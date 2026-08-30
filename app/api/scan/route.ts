export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { FOODS } from "@/lib/foods";
import { resolveScanNutrition } from "@/lib/nutrition-lookup";

/**
 * Meal photo scanning.
 *
 * Requires a real session and a daily cap (scan_count_today / scan_date).
 * Tries Anthropic first (already on the account), then OpenAI GPT-4o if
 * Claude fails or the Anthropic key is missing. Google Vision is not used:
 * it labels objects, it does not estimate a West African plate.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DAILY_SCAN_LIMIT = 50;
const MAX_IMAGE_CHARS = 8_000_000;

const CATALOG = FOODS.slice(0, 80)
  .map((f) => `${f.name} (${f.kcal} kcal)`)
  .join("; ");

const ANALYZE_PROMPT = `You are a nutrition expert specialising in Nigerian and West African home cooking.

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

Visual rules - do not mix these up:
- Akara: irregular craggy deep-fried black-eyed pea fritters. Not puff puff, not rice.
- Egusi: thick orange melon-seed soup with greens, usually beside swallow (pounded yam, eba, fufu). Never a plate of rice.
- Moin moin / moi moi: smooth steamed orange-red bean pudding, often with egg inside. Not a stew.
- Jollof: smoky orange-red rice, often with chicken or plantain.
- Suya: spiced grilled meat skewers with yaji, usually with onion.

Name the dish. Do not invent calorie numbers - tables fill those in after.
If multiple foods are visible, name the main plate.
Prefer names from this list when they match: ${CATALOG}`;

function parseScanJson(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

async function analyzeWithAnthropic(image: string, mediaType: string) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
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
            { type: "text", text: ANALYZE_PROMPT },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("Anthropic scan error:", response.status, err);
    return null;
  }
  const data = await response.json();
  return parseScanJson(data.content?.[0]?.text || "");
}

async function analyzeWithOpenAI(image: string, mediaType: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const mime = mediaType || "image/jpeg";
  const response = await fetch("https://openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 700,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mime};base64,${image}` },
            },
            { type: "text", text: ANALYZE_PROMPT },
          ],
        },
      ],
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("OpenAI scan error:", response.status, err);
    return null;
  }
  const data = await response.json();
  return parseScanJson(data.choices?.[0]?.message?.content || "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId =
      req.cookies.get("trimtrack_session")?.value || body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
          error: `That's all ${DAILY_SCAN_LIMIT} scans for today. Search for the food or add it by hand - the count resets at midnight.`,
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

    if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Scanning is unavailable right now" }, { status: 503 });
    }

    const result =
      (await analyzeWithAnthropic(image, mediaType)) ||
      (await analyzeWithOpenAI(image, mediaType));

    if (!result) {
      return NextResponse.json({ error: "Failed to analyse image" }, { status: 502 });
    }

    await supabase
      .from("subscriptions")
      .update({ scan_count_today: usedToday + 1, scan_date: today })
      .eq("session_id", sessionId);

    const mealName =
      (result.identified && result.meal_name) || result.meal_name;
    if (result.identified && mealName) {
      const table = await resolveScanNutrition(String(mealName));
      result.meal_name = table.meal_name;
      result.kcal = table.kcal;
      result.protein = table.protein;
      result.carbs = table.carbs;
      result.fat = table.fat;
      result.source = table.source;
      result.estimate = table.estimate;
      result.notes = table.source;
    }

    return NextResponse.json({
      ...result,
      scansLeft: Math.max(0, DAILY_SCAN_LIMIT - (usedToday + 1)),
    });
  } catch (err) {
    console.error("Photo scan error:", err);
    return NextResponse.json({ error: "Failed to analyse image" }, { status: 500 });
  }
}
