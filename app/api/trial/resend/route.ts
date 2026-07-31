export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * POST /api/trial/resend — sends the confirmation email again.
 *
 * Issues a fresh confirm_token so an older link cannot be replayed, then
 * mails the same confirmation the signup sent. Auth is the session, cookie or
 * body, like every other route.
 */
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const sessionId =
      req.cookies.get("trimtrack_session")?.value || body.session_id;
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email, name, email_confirmed")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json({ ok: false, error: "Account not found" }, { status: 404 });
    }

    // Already done — a success, so the caller can just hide its banner.
    if (sub.email_confirmed) {
      return NextResponse.json({ ok: true, alreadyConfirmed: true });
    }

    if (!resend) {
      return NextResponse.json(
        { ok: false, error: "Email sending is not configured" },
        { status: 503 }
      );
    }

    const confirmToken =
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

    const { error: dbError } = await supabase
      .from("subscriptions")
      .update({ confirm_token: confirmToken, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);

    if (dbError) {
      console.error("Resend token error:", dbError);
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 });
    }

    const { error: emailError } = await resend.emails.send({
      from: "TrimTrack <hello@trimtrack.fit>",
      to: sub.email,
      subject: "Confirm your TrimTrack account",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
          <div style="background:#1a5c38;padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#b5f23d;margin:0;font-size:28px;">TrimTrack</h1>
            <p style="color:#a8d5b5;margin:8px 0 0;">Confirm your account</p>
          </div>
          <h2 style="color:#0f1f14;">Hi ${sub.name || "there"},</h2>
          <p style="color:#444;line-height:1.6;">Click below to confirm your email. This keeps your account recoverable if you ever forget your password.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/api/trial/confirm?token=${confirmToken}&sessionId=${sessionId}"
              style="background:#1a5c38;color:#b5f23d;padding:16px 32px;border-radius:12px;
              text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              Confirm my email
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            If you did not ask for this, you can ignore it.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return NextResponse.json(
        { ok: false, error: "Could not send the email" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
