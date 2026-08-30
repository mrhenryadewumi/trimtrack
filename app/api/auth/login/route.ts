export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_EMAIL_LIMIT = 5;
const LOGIN_IP_LIMIT = 20;

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
    const { email: rawEmail, password } = await req.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    // Signup stores the address lowercased, so the lookup has to match it —
    // otherwise anyone who typed a capital at signup can never log in.
    const email = String(rawEmail).trim().toLowerCase();

    const ip = getClientIp(req);
    const [emailLimit, ipLimit] = await Promise.all([
      checkRateLimit("login-email", email, LOGIN_EMAIL_LIMIT, LOGIN_WINDOW_MS),
      checkRateLimit("login-ip", ip, LOGIN_IP_LIMIT, LOGIN_WINDOW_MS),
    ]);
    if (!emailLimit.allowed || !ipLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Try again later." },
        { status: 429 }
      );
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

    // Unknown email and wrong password get the same answer — a 404 here
    // told an attacker which addresses have accounts.
    if (!user || !user.password_hash) {
      return NextResponse.json(
        { ok: false, error: "Email or password is incorrect" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Email or password is incorrect" },
        { status: 401 }
      );
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

    await resetRateLimit("login-email", email, LOGIN_WINDOW_MS);

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
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
