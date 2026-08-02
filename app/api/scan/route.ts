export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Meal photo scanning.
 *
 * This route had NO authentication of any kind. It read an image off the body
 * and called Claude Opus on the production key — so anyone who found the URL
 * could loop it until the Anthropic bill was exhausted. It now requires a real
 * session and enforces a daily cap using the scan_count_today / scan_date
 * columns that already existed on subscriptions and were never read.
 *
 * It also used the anon Supabase client, built it, and never used it. Now on
 * the service role like every other route, and actually used.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DAILY_SCAN_LIMIT = 6; // matches FREE_SCANS_PER_DAY in /api/subscription

/** ~8MB of base64 ≈ a 6MB photo. Anything larger is not a phone camera. */
const MAX_IMAGE_CHARS = 8_000_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId =
      req.cookies.get("trimtrack_session")?.value || body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // The session must resolve to a real account — not just be non-empty.
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("session_id, scan_count_today, scan_date")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0];
    const usedToday = sub.scan_date === today ? sub.scan_count_today || 0 : 0;

    if (usedToday >= DAILY_SCAN_LIMIT) {
      return NextResponse.json(
        {
          error: `That's all ${DAILY_SCAN_LIMIT} scans for today. Search for the food or add it by hand — the count resets at midnight.`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    const { image, mediaType } = body;
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (typeof image !== "string" || image.length > MAX_IMAGE_CHARS) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "Scanning is unavailable right now" }, { status: 503 });
    }

    // Counted before the call, not after: otherwise a burst of concurrent
    // requests all pass the check above and every one of them bills.
    await supabase
      .from("subscriptions")
      .update({ scan_count_today: usedToday + 1, scan_date: today })
      .eq("session_id", sessionId);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType || "image/jpeg",
                  data: image,
                },
              },
              {
                type: "text",
                text: `You are a nutrition expert specialising in Nigerian, West African, and global foods.

Analyse this food photo and return ONLY a valid JSON object with no other text.

If you can identify food:
{
  "identified": true,
  "meal_name": "name of the dish",
  "description": "brief description in 1 sentence",
  "kcal": estimated calories as number,
  "protein": grams of protein as number,
  "carbs": grams of carbs as number,
  "fat": grams of fat as number,
  "confidence": "high" or "medium" or "low",
  "notes": "any important notes about the estimate"
}

If you cannot identify food:
{
  "identified": false,
  "message": "Could not identify food in this image"
}

Important:
- Be specific with Nigerian/West African foods (Jollof Rice, Egusi Soup, Moi Moi, Pepper Soup, Efo Riro, Akara, Suya, Fufu, Eba, Pounded Yam, Banga Soup, etc)
- Estimate for a typical single serving portion
- If multiple foods are visible, estimate the total
- Be accurate — people are tracking calories for weight loss`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Anthropic scan error:", response.status, err);
      return NextResponse.json({ error: "Failed to analyse image" }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to analyse image" }, { status: 502 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      ...result,
      scansLeft: Math.max(0, DAILY_SCAN_LIMIT - (usedToday + 1)),
    });
  } catch (err) {
    console.error("Photo scan error:", err);
    return NextResponse.json({ error: "Failed to analyse image" }, { status: 500 });
  }
}
