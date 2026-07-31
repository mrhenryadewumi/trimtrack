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
    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email, name, plan, status, trial_ends_at, session_id, email_confirmed")
      .eq("session_id", sessionId)
      .single();

    if (!sub) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    return NextResponse.json({
      name: profile?.name || sub.name || "there",
      email: sub.email,
      plan: sub.plan,
      status: sub.status,
      trial_ends_at: sub.trial_ends_at,
      session_id: sessionId,
      // Older rows predate the column; only an explicit false is unconfirmed.
      emailConfirmed: sub.email_confirmed !== false,
      dailyCalorieGoal: profile?.daily_calorie_goal || 1500,
      startWeight: profile?.start_weight || 80,
      goalWeight: profile?.goal_weight || 70,
      height: profile?.height || 170,
      age: profile?.age || 28,
      gender: profile?.gender || "female",
      country: profile?.country || "Nigeria",
      activity: profile?.activity || "light",
      drink: profile?.drink || "no",
      avoidFoods: profile?.avoid_foods || [],
      reminders: profile?.reminders !== false,
    });
  } catch (err: any) {
    console.error("Profile GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sid = body.session_id || req.cookies.get("trimtrack_session")?.value;
    if (!sid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Body measurements were previously written through unchecked, which let
    // a goal weight of 170 kg sit against a start weight of 80. Validate here
    // so every client is covered, not just whichever one is being fixed.
    const num = (v: unknown) => (v === undefined || v === null ? null : Number(v));

    const startWeight = num(body.startWeight);
    const goalWeight = num(body.goalWeight);
    const height = num(body.height);

    for (const [label, value] of [
      ["Start weight", startWeight],
      ["Goal weight", goalWeight],
    ] as const) {
      if (value !== null && (!Number.isFinite(value) || value < 30 || value > 300)) {
        return NextResponse.json(
          { error: `${label} must be between 30 and 300 kg` },
          { status: 400 }
        );
      }
    }

    if (height !== null && (!Number.isFinite(height) || height < 100 || height > 250)) {
      return NextResponse.json(
        { error: "Height must be between 100 and 250 cm" },
        { status: 400 }
      );
    }

    // A patch may carry only one of the pair, so read the stored counterpart
    // rather than skipping the comparison.
    let effectiveStart = startWeight;
    let effectiveGoal = goalWeight;
    if ((startWeight === null) !== (goalWeight === null)) {
      const { data: stored } = await supabase
        .from("profiles")
        .select("start_weight, goal_weight")
        .eq("session_id", sid)
        .maybeSingle();
      if (stored) {
        if (effectiveStart === null) effectiveStart = num(stored.start_weight);
        if (effectiveGoal === null) effectiveGoal = num(stored.goal_weight);
      }
    }

    // TrimTrack is a weight-loss product — onboarding says "To lose" and the
    // projection subtracts goal from start — so the goal has to be lighter.
    // Supporting gain would need a goal-type column before this can relax.
    if (
      effectiveStart !== null &&
      effectiveGoal !== null &&
      Number.isFinite(effectiveStart) &&
      Number.isFinite(effectiveGoal) &&
      effectiveGoal >= effectiveStart
    ) {
      return NextResponse.json(
        { error: "Goal weight must be below your current weight" },
        { status: 400 }
      );
    }

    // Map camelCase frontend fields to snake_case DB columns
    const dbRecord: any = {
      session_id: sid,
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) dbRecord.name = body.name;
    if (body.age !== undefined) dbRecord.age = body.age;
    if (body.gender !== undefined) dbRecord.gender = body.gender;
    if (body.country !== undefined) dbRecord.country = body.country;
    if (body.height !== undefined) dbRecord.height = body.height;
    if (body.activity !== undefined) dbRecord.activity = body.activity;
    if (body.drink !== undefined) dbRecord.drink = body.drink;
    if (body.reminders !== undefined) dbRecord.reminders = body.reminders;
    if (body.avoidFoods !== undefined) dbRecord.avoid_foods = body.avoidFoods;
    if (body.startWeight !== undefined) dbRecord.start_weight = body.startWeight;
    if (body.goalWeight !== undefined) dbRecord.goal_weight = body.goalWeight;
    if (body.dailyCalorieGoal !== undefined) dbRecord.daily_calorie_goal = body.dailyCalorieGoal;

    // Also update name in subscriptions table
    if (body.name) {
      await supabase.from("subscriptions").update({ name: body.name }).eq("session_id", sid);
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(dbRecord, { onConflict: "session_id" });

    if (error) {
      console.error("Profile upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Profile POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}