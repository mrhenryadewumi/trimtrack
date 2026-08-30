import { createClient } from "@supabase/supabase-js";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

/**
 * Scan quota lookup.
 *
 * Two problems here before:
 *
 * 1. Unauthenticated. Any sessionId in a query string or body was accepted, so
 *    anyone could read or reset anyone else's scan allowance.
 * 2. It CREATED rows. GET inserted a subscriptions row for an unknown session,
 *    and POST upserted one — both producing accounts with no email and no
 *    password hash. subscriptions is the user table; only signup should write
 *    to it.
 *
 * Now: the session must already resolve to a real account, and neither verb
 * creates anything.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_SCANS_PER_DAY = 50;

async function resolve(req: NextRequest, bodySession?: string) {
  const sessionId =
    req.cookies.get("trimtrack_session")?.value ||
    bodySession ||
    req.nextUrl.searchParams.get("sessionId");

  if (!sessionId) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("session_id, plan, scan_count_today, scan_date")
    .eq("session_id", sessionId)
    .maybeSingle();

  return data || null;
}

export async function GET(req: NextRequest) {
  const sub = await resolve(req);
  if (!sub) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (sub.plan === "premium") {
    return NextResponse.json({ plan: "premium", scansLeft: 999 });
  }

  const today = new Date().toISOString().split("T")[0];
  const used = sub.scan_date === today ? sub.scan_count_today || 0 : 0;
  return NextResponse.json({ plan: sub.plan || "free", scansLeft: Math.max(0, FREE_SCANS_PER_DAY - used) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const sub = await resolve(req, body.sessionId || body.session_id);
  if (!sub) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (sub.plan === "premium") return NextResponse.json({ ok: true, scansLeft: 999 });

  const today = new Date().toISOString().split("T")[0];
  const used = sub.scan_date === today ? sub.scan_count_today || 0 : 0;

  if (used >= FREE_SCANS_PER_DAY) {
    return NextResponse.json({ ok: false, scansLeft: 0, limitReached: true });
  }

  // update, not upsert — this must never bring a subscription into existence.
  await supabase
    .from("subscriptions")
    .update({ scan_count_today: used + 1, scan_date: today, updated_at: new Date().toISOString() })
    .eq("session_id", sub.session_id);

  return NextResponse.json({ ok: true, scansLeft: FREE_SCANS_PER_DAY - used - 1 });
}
