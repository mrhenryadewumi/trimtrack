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
      .select("email, name, plan, status, trial_ends_at, session_id")
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