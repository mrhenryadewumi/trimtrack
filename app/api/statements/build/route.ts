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

    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Get profile for goal
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("session_id")
      .eq("session_id", sessionId)
      .single();

    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("daily_calorie_goal")
      .eq("session_id", sessionId)
      .maybeSingle();

    const goalKcal = profile?.daily_calorie_goal || 1500;

    // Get all meal entries for the date range
    let query = supabase
      .from("meal_entries")
      .select("*")
      .eq("session_id", sessionId)
      .order("date", { ascending: true });

    if (from) query = query.gte("date", from);
    if (to) query = query.lte("date", to);

    const { data: meals, error } = await query;
    if (error) throw error;

    if (!meals || meals.length === 0) {
      return NextResponse.json({ ok: true, built: 0 });
    }

    // Group meals by date
    const byDate: Record<string, any[]> = {};
    for (const meal of meals) {
      const d = meal.date;
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(meal);
    }

    // Build statement for each date
    let built = 0;
    for (const [date, dayMeals] of Object.entries(byDate)) {
      const totalKcal = dayMeals.reduce((s, m) => s + (m.kcal || 0), 0);
      const totalProtein = Math.round(dayMeals.reduce((s, m) => s + (m.protein || 0), 0));
      const totalCarbs = Math.round(dayMeals.reduce((s, m) => s + (m.carbs || 0), 0));
      const totalFat = Math.round(dayMeals.reduce((s, m) => s + (m.fat || 0), 0));

      let status = "under";
      if (totalKcal > goalKcal * 1.1) status = "over";
      else if (totalKcal >= goalKcal * 0.9) status = "on_track";

      const summary = `${date}: ${totalKcal} kcal eaten (goal: ${goalKcal} kcal). ${dayMeals.length} meals. Status: ${status}.`;

      await supabase.from("food_statements").upsert({
        session_id: sessionId,
        date,
        timezone: "UTC",
        total_kcal: totalKcal,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        goal_kcal: goalKcal,
        meals_count: dayMeals.length,
        status,
        summary,
      }, { onConflict: "session_id,date" });

      built++;
    }

    return NextResponse.json({ ok: true, built });
  } catch (err: any) {
    console.error("Statement build error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}