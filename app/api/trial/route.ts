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
    const { name, email, sessionId } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400 });
    }

    const confirmToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

    if (sessionId) {
      await supabase.from("subscriptions").upsert({
        session_id: sessionId,
        email,
        name,
        email_confirmed: false,
        confirm_token: confirmToken,
        trial_started_at: new Date().toISOString(),
        trial_ends_at: trialEndsAt,
        plan: "trial",
        status: "pending",
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_id" });
    }

    const { error } = await resend.emails.send({
      from: "TrimTrack <hello@trimtrack.fit>",
      to: email,
      subject: "Start your 30-day TrimTrack free trial",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
          <div style="background:#1a5c38;padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#b5f23d;margin:0;font-size:28px;">TrimTrack</h1>
            <p style="color:#a8d5b5;margin:8px 0 0;">Your 30-day free trial is ready</p>
          </div>
          <h2 style="color:#0f1f14;">Hi ${name || "there"},</h2>
          <p style="color:#444;line-height:1.6;">
            You are one click away from 30 days of full access to TrimTrack Premium -
            unlimited AI food scanning, reminders, and everything built for your food culture.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/api/trial/confirm?token=${confirmToken}&sessionId=${sessionId}"
              style="background:#1a5c38;color:#b5f23d;padding:16px 32px;border-radius:12px;
              text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              Start my free trial
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            No credit card required. After 30 days, upgrade for just GBP 2.99/month.<br/>
            If you did not sign up, ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ ok: false, error: "Email failed", detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("Trial API error:", err);
    return NextResponse.json({ ok: false, error: "Server error", detail: err.message }, { status: 500 });
  }
}