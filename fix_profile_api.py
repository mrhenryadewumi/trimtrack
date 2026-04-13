# Fix the profile GET API to return basic data from subscriptions even if profiles table is empty
content = """export const dynamic = "force-dynamic";
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

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email, name, plan, status, trial_ends_at, session_id")
      .eq("session_id", sessionId)
      .single();

    if (!sub) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();

    // Return combined data - works even if profiles table has no record yet
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
    const { session_id, ...profile } = body;
    const sid = session_id || req.cookies.get("trimtrack_session")?.value;

    if (!sid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { error } = await supabase.from("profiles").upsert({
      session_id: sid,
      ...profile,
      updated_at: new Date().toISOString(),
    }, { onConflict: "session_id" });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Profile POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
"""

with open(r'C:\Users\mrhen\trimtrack\app\api\profile\route.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done")