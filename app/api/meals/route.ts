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
    const querySession = req.nextUrl.searchParams.get("session_id");
    const sessionId = cookieSession || querySession;
    const date = req.nextUrl.searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    const { data, error } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("session_id", sessionId)
      .eq("date", date);

    if (error) throw error;
    return NextResponse.json({ meals: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const body = await req.json();
    const sessionId = cookieSession || body.session_id;

    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    const { data, error } = await supabase
      .from("meal_entries")
      .insert({
        session_id: sessionId,
        date: new Date().toISOString().split("T")[0],
        meal_type: body.meal_type,
        food_name: body.food_name,
        kcal: body.kcal,
        protein: body.protein,
        carbs: body.carbs,
        fat: body.fat,
      })
      .select()
      .single();

    if (error) throw error;

    // Build/update today's statement after every meal save
    const today = new Date().toISOString().split("T")[0];
    const { data: todayMeals } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("session_id", sessionId)
      .eq("date", today);

    if (todayMeals && todayMeals.length > 0) {
      const { data: prof } = await supabase.from("profiles").select("daily_calorie_goal").eq("session_id", sessionId).maybeSingle();
      const goalKcal = prof?.daily_calorie_goal || 1500;
      const totalKcal = todayMeals.reduce((s: number, m: any) => s + (m.kcal || 0), 0);
      const totalProtein = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.protein || 0), 0));
      const totalCarbs = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.carbs || 0), 0));
      const totalFat = Math.round(todayMeals.reduce((s: number, m: any) => s + (m.fat || 0), 0));
      let status = "under";
      if (totalKcal > goalKcal * 1.1) status = "over";
      else if (totalKcal >= goalKcal * 0.9) status = "on_track";
      await supabase.from("food_statements").upsert({
        session_id: sessionId,
        date: today,
        timezone: "UTC",
        total_kcal: totalKcal,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        goal_kcal: goalKcal,
        meals_count: todayMeals.length,
        status,
        summary: `${today}: ${totalKcal} kcal eaten. ${todayMeals.length} meals. Status: ${status}.`,
      }, { onConflict: "session_id,date" });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabase.from("meal_entries").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}