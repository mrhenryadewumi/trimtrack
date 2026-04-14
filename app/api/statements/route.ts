export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const sessionId = cookieSession || req.nextUrl.searchParams.get("session_id");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");

    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    let query = supabase
      .from("food_statements")
      .select("*")
      .eq("session_id", sessionId)
      .order("date", { ascending: false })
      .limit(limit);

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ statements: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const body = await req.json();
    const sessionId = cookieSession || body.session_id;

    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { date, timezone, total_kcal, total_protein, total_carbs, total_fat, goal_kcal, meals_count } = body;

    let status = "under";
    if (total_kcal > goal_kcal * 1.1) status = "over";
    else if (total_kcal >= goal_kcal * 0.9) status = "on_track";

    const summary = `${date}: ${total_kcal} kcal eaten (goal: ${goal_kcal} kcal). ${meals_count} meals logged. Status: ${status}.`;

    const { data, error } = await supabase
      .from("food_statements")
      .upsert({
        session_id: sessionId,
        date,
        timezone: timezone || "UTC",
        total_kcal,
        total_protein,
        total_carbs,
        total_fat,
        goal_kcal,
        meals_count,
        status,
        summary,
      }, { onConflict: "session_id,date" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}