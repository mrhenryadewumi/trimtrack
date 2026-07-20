export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const message = (body.message || "").trim();
    if (!message) return NextResponse.json({ error: "Empty message" }, { status: 400 });
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    const today = new Date().toISOString().split("T")[0];
    const [{ data: profile }, { data: sub }, { data: meals }] = await Promise.all([
      supabase.from("profiles").select("*").eq("session_id", sessionId).maybeSingle(),
      supabase.from("subscriptions").select("name").eq("session_id", sessionId).maybeSingle(),
      supabase.from("meal_entries").select("food_name, kcal, protein, meal_type").eq("session_id", sessionId).eq("date", today),
    ]);

    const name = profile?.name || sub?.name || "friend";
    const goal = profile?.daily_calorie_goal || 1500;
    const eaten = (meals || []).reduce((s: number, m: any) => s + (m.kcal || 0), 0);
    const protein = Math.round((meals || []).reduce((s: number, m: any) => s + (m.protein || 0), 0));
    const mealList = (meals || []).map((m: any) => `${m.meal_type}: ${m.food_name} ${m.kcal} kcal`).join("; ") || "nothing logged yet";

    const system =
      `You are Trim, the warm, practical AI nutrition coach inside TrimTrack, a calorie tracker built around African (especially Nigerian) food culture. ` +
      `Live user context: name ${name}; daily budget ${goal} kcal; eaten ${eaten} kcal today (${mealList}); ` +
      `${Math.max(0, goal - eaten)} kcal remaining; protein ${protein}g today; ` +
      `current weight ${profile?.start_weight ?? "unknown"} kg, goal ${profile?.goal_weight ?? "unknown"} kg; activity: ${profile?.activity || "light"}. ` +
      `Answer in 1-3 short sentences, concrete and encouraging, referencing familiar Nigerian foods where natural. ` +
      `Plain text only - no markdown, no lists. Never invent data not in this context. You are not a doctor; for medical questions, say so briefly.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system,
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic error:", res.status, errText);
      return NextResponse.json({ error: "Coach unavailable right now" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ reply: data.content?.[0]?.text || "" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}