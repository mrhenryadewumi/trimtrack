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

const BACKDATE_LIMIT_DAYS = 90;

/**
 * Today when no date is given. A supplied date must be YYYY-MM-DD, not in the
 * future, and within the back-dating window. Returns null when invalid.
 */
function resolveEntryDate(raw: unknown): string | null {
  const today = new Date().toISOString().split("T")[0];
  if (raw === undefined || raw === null || raw === "") return today;
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;

  const asked = Date.parse(`${raw}T00:00:00Z`);
  if (!Number.isFinite(asked)) return null;

  const todayMs = Date.parse(`${today}T00:00:00Z`);
  if (asked > todayMs) return null;
  if (todayMs - asked > BACKDATE_LIMIT_DAYS * 24 * 60 * 60 * 1000) return null;

  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const body = await req.json();
    const sessionId = cookieSession || body.session_id;

    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 400 });

    // Optional back-dating, so a meal missed yesterday can still be logged.
    // Bounded to the last 90 days and never the future.
    const entryDate = resolveEntryDate(body.date);
    if (entryDate === null) {
      return NextResponse.json(
        { error: "date must be YYYY-MM-DD, not in the future, within the last 90 days" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("meal_entries")
      .insert({
        session_id: sessionId,
        date: entryDate,
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

    // Rebuild the statement for the day the meal belongs to, not today —
    // Trends reads food_statements, so a back-dated meal would otherwise
    // never show up there.
    await rebuildStatement(sessionId, entryDate);

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    const { id } = body;

    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Read it first so we know which day's statement to rebuild, and so a row
    // belonging to someone else is indistinguishable from one that isn't there.
    const { data: meal } = await supabase
      .from("meal_entries")
      .select("id, date, session_id")
      .eq("id", id)
      .eq("session_id", sessionId)
      .maybeSingle();

    if (!meal) return NextResponse.json({ error: "Meal not found" }, { status: 404 });

    // The session_id filter is the ownership check — without it this is an
    // unauthenticated delete of anyone's data.
    const { error } = await supabase
      .from("meal_entries")
      .delete()
      .eq("id", id)
      .eq("session_id", sessionId);

    if (error) throw error;

    await rebuildStatement(sessionId, meal.date);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * Recomputes food_statements for one day from the meals actually stored.
 * Shared by POST and DELETE, so deleting the last meal of a day zeroes the
 * statement rather than leaving the old totals behind.
 */
async function rebuildStatement(sessionId: string, date: string) {
  const { data: meals } = await supabase
    .from("meal_entries")
    .select("*")
    .eq("session_id", sessionId)
    .eq("date", date);

  const { data: prof } = await supabase
    .from("profiles")
    .select("daily_calorie_goal")
    .eq("session_id", sessionId)
    .maybeSingle();

  const goalKcal = prof?.daily_calorie_goal || 1500;
  const rows = meals || [];
  const totalKcal = rows.reduce((s: number, m: any) => s + (m.kcal || 0), 0);
  const totalProtein = Math.round(rows.reduce((s: number, m: any) => s + (m.protein || 0), 0));
  const totalCarbs = Math.round(rows.reduce((s: number, m: any) => s + (m.carbs || 0), 0));
  const totalFat = Math.round(rows.reduce((s: number, m: any) => s + (m.fat || 0), 0));

  let status = "under";
  if (totalKcal > goalKcal * 1.1) status = "over";
  else if (totalKcal >= goalKcal * 0.9) status = "on_track";

  await supabase.from("food_statements").upsert(
    {
      session_id: sessionId,
      date,
      timezone: "UTC",
      total_kcal: totalKcal,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
      goal_kcal: goalKcal,
      meals_count: rows.length,
      status,
      summary: `${date}: ${totalKcal} kcal eaten. ${rows.length} meals. Status: ${status}.`,
    },
    { onConflict: "session_id,date" }
  );
}