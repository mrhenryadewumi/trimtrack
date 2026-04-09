export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPassword } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password are required" }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("subscriptions")
      .select("session_id, password_hash, plan, status, name, email_confirmed")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: "No account found with this email" }, { status: 404 });
    }

    if (!user.password_hash) {
      return NextResponse.json({ ok: false, error: "Please use the login link sent to your email" }, { status: 400 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
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
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}