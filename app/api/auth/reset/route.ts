export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const { data: user } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("email", email)
      .eq("confirm_token", token)
      .single();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await supabase.from("subscriptions").update({
      password_hash: passwordHash,
      confirm_token: null,
      email_confirmed: true,
      updated_at: new Date().toISOString(),
    }).eq("email", email);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}