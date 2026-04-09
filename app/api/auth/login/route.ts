export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });

    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("session_id, plan, status")
      .eq("email", email)
      .single();

    if (!existing) {
      return NextResponse.json({ ok: false, error: "No account found. Please sign up first." }, { status: 404 });
    }

    await supabase.from("subscriptions").update({
      confirm_token: token,
      updated_at: new Date().toISOString(),
    }).eq("email", email);

    const { error } = await resend.emails.send({
      from: "TrimTrack <hello@trimtrack.fit>",
      to: email,
      subject: "Your TrimTrack login link",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
          <div style="background:#1a5c38;padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#b5f23d;margin:0;font-size:28px;">TrimTrack</h1>
            <p style="color:#a8d5b5;margin:8px 0 0;">Your login link</p>
          </div>
          <p style="color:#444;line-height:1.6;">Click the button below to log in to TrimTrack. This link expires in 15 minutes.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/api/auth/verify?token=${token}&email=${encodeURIComponent(email)}"
              style="background:#1a5c38;color:#b5f23d;padding:16px 32px;border-radius:12px;
              text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              Log in to TrimTrack
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            If you did not request this, ignore this email.
          </p>
        </div>
      `,
    });

    if (error) return NextResponse.json({ ok: false, error: "Email failed" }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}