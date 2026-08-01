export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Rows created before this predate the confirmation gate and keep working
 * even with a null flag. Anything newer must confirm. Kept as a constant so
 * the backfill and this check can be reasoned about together.
 */
const CONFIRMATION_REQUIRED_FROM = Date.parse("2026-08-01T00:00:00Z");

function isUnconfirmed(flag: unknown, createdAt: unknown): boolean {
  if (flag === true) return false;
  if (flag === false) return true;
  // Null or missing: only gate accounts created after the cutoff.
  const created = typeof createdAt === "string" ? Date.parse(createdAt) : NaN;
  return Number.isFinite(created) && created >= CONFIRMATION_REQUIRED_FROM;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    // subscriptions has no unique constraint on email, so one address can own
    // several accounts. .single() errored on those and locked the person out
    // entirely. Take the newest account that can actually be signed into, and
    // fall back to the newest overall so the "reset your password" message
    // still reaches someone whose accounts all lack a hash.
    const { data: users } = await supabase
      .from("subscriptions")
      .select("session_id, password_hash, plan, status, name, email_confirmed, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false });

    const user = users?.find((u) => u.password_hash) ?? users?.[0];

    if (!user) {
      return NextResponse.json({ ok: false, error: "No account found with this email" }, { status: 404 });
    }

    if (!user.password_hash) {
      return NextResponse.json({ ok: false, error: "Please reset your password using Forgot Password" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
    }

    // Confirmation gate. Checked only after the password, so an attacker
    // cannot use it to discover which addresses have accounts.
    //
    // A null email_confirmed means one of two things: a row that predates the
    // column, or one written before this shipped. Accounts older than the
    // cutoff are let through so existing users are never locked out; anything
    // created after it has to confirm.
    if (isUnconfirmed(user.email_confirmed, user.created_at)) {
      return NextResponse.json(
        { ok: false, error: "unconfirmed", email },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      ok: true,
      sessionId: user.session_id,
      name: user.name,
      plan: user.plan,
    });

    response.cookies.set("trimtrack_session", user.session_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days - renewed on activity
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}