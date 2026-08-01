export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { createConfirmToken } from "@/lib/confirmToken";

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
    const email = typeof body.email === "string" ? body.email.trim() : null;

    // An unconfirmed account has no session — login refuses to issue one — so
    // the address alone has to be enough to ask for the email again. Nothing
    // is disclosed that signup does not already reveal through its 409.
    if (!sessionId && !email) {
      return NextResponse.json(
        { ok: false, error: "Session or email required" },
        { status: 400 }
      );
    }

    const query = supabase
      .from("subscriptions")
      .select("session_id, email, name, email_confirmed");

    const { data: rows } = sessionId
      ? await query.eq("session_id", sessionId).limit(1)
      : await query.eq("email", email!).order("created_at", { ascending: false }).limit(1);

    const sub = rows?.[0];

    if (!sub) {
      return NextResponse.json({ ok: false, error: "Account not found" }, { status: 404 });
    }

    const targetSession = sub.session_id;

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

    // A fresh 7-day token every time, so the newest email is always the one
    // that works and older links stop being useful.
    const confirmToken = createConfirmToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

    const { error: dbError } = await supabase
      .from("subscriptions")
      .update({ confirm_token: confirmToken, updated_at: new Date().toISOString() })
      .eq("session_id", targetSession);

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
            <a href="${appUrl}/api/trial/confirm?token=${confirmToken}&sessionId=${targetSession}"
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
