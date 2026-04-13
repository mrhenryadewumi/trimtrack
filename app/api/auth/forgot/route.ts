export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";
    const resetToken = Math.random().toString(36).slice(2) + Date.now().toString(36);

    const { data: user } = await supabase
      .from("subscriptions")
      .select("id, name")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ ok: true });
    }

    await supabase.from("subscriptions").update({
      confirm_token: resetToken,
      updated_at: new Date().toISOString(),
    }).eq("email", email);

    const { error: emailError } = await resend.emails.send({
      from: "TrimTrack <hello@trimtrack.fit>",
      to: email,
      subject: "Reset your TrimTrack password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
          <div style="background:#1a5c38;padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#b5f23d;margin:0;font-size:28px;">TrimTrack</h1>
          </div>
          <h2 style="color:#0f1f14;">Reset your password</h2>
          <p style="color:#444;line-height:1.6;">Click below to set a new password. This link expires in 1 hour.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}"
              style="background:#1a5c38;color:#b5f23d;padding:16px 32px;border-radius:12px;
              text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              Reset my password
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            If you did not request this, ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}