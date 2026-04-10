export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Read session from cookie or query param
    const cookieSession = req.cookies.get("trimtrack_session")?.value;
    const querySession = req.nextUrl.searchParams.get("session_id");
    const sessionId = cookieSession || querySession;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get subscription data (email, name, plan)
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email, name, plan, status, trial_ends_at")
      .eq("session_id", sessionId)
      .single();

    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (!sub && !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...(profile || {}),
      email: sub?.email,
      name: profile?.name || sub?.name,
      plan: sub?.plan,
      status: sub?.status,
      trial_ends_at: sub?.trial_ends_at,
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