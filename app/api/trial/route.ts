export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { createConfirmToken } from "@/lib/confirmToken";
import { createSessionId } from "@/lib/sessionId";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { name, email: rawEmail, password } = await req.json();

    if (!rawEmail) return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
    if (!password || password.length < 8) return NextResponse.json({ ok: false, error: "Password must be at least 8 characters" }, { status: 400 });

    // Store one canonical form. Without this, Henry@ and henry@ are two
    // accounts, and the unique index would reject the second with a 500.
    const email = String(rawEmail).trim().toLowerCase();

    // .single() errors on anything other than exactly one row — including two
    // or more — which left `existing` null and let the signup through. Once an
    // address had duplicates, every later signup added another.
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (existing) return NextResponse.json({ ok: false, error: "An account with this email already exists. Please log in." }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const confirmToken = createConfirmToken(); // 7 days
    const sid = createSessionId();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.trimtrack.fit";

    const { error: dbError } = await supabase.from("subscriptions").insert({
      session_id: sid,
      email,
      name,
      password_hash: passwordHash,
      email_confirmed: !resend,
      confirm_token: confirmToken,
      trial_started_at: new Date().toISOString(),
      plan: "free",
      status: resend ? "pending" : "active",
      updated_at: new Date().toISOString(),
    });

    if (dbError) {
      // 23505 is the unique index on lower(email). The check above races with
      // a simultaneous signup on the same address; the index is what actually
      // guarantees uniqueness, so treat it as the same answer, not a 500.
      if (dbError.code === "23505") {
        return NextResponse.json(
          { ok: false, error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }
      console.error("DB error:", dbError);
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 });
    }

    if (resend) await resend.emails.send({
      from: "TrimTrack <hello@trimtrack.fit>",
      to: email,
      subject: "Confirm your TrimTrack account",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:32px;">
          <div style="background:#1a5c38;padding:24px;border-radius:16px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#b5f23d;margin:0;font-size:28px;">TrimTrack</h1>
            <p style="color:#a8d5b5;margin:8px 0 0;">Confirm your account</p>
          </div>
          <h2 style="color:#0f1f14;">Hi ${name || "there"},</h2>
          <p style="color:#444;line-height:1.6;">Click below to confirm your email and start using TrimTrack. It is free while we test.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${appUrl}/api/trial/confirm?token=${confirmToken}&sessionId=${sid}"
              style="background:#1a5c38;color:#b5f23d;padding:16px 32px;border-radius:12px;
              text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
              Confirm my account
            </a>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            Free while we test. No credit card.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Trial error:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
