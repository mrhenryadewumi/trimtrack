import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FREE_SCANS_PER_DAY = 3;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ plan: "free", scansLeft: FREE_SCANS_PER_DAY });

  const today = new Date().toISOString().split("T")[0];

  let { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (!data) {
    await supabase.from("subscriptions").insert({
      session_id: sessionId,
      plan: "free",
      scan_count_today: 0,
      scan_date: today,
    });
    return NextResponse.json({ plan: "free", scansLeft: FREE_SCANS_PER_DAY });
  }

  if (data.plan === "premium") {
    return NextResponse.json({ plan: "premium", scansLeft: 999 });
  }

  const scanDate = data.scan_date;
  const scanCount = scanDate === today ? data.scan_count_today : 0;
  const scansLeft = Math.max(0, FREE_SCANS_PER_DAY - scanCount);

  return NextResponse.json({ plan: "free", scansLeft });
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ ok: false });

  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (data?.plan === "premium") return NextResponse.json({ ok: true, scansLeft: 999 });

  const scanDate = data?.scan_date;
  const scanCount = scanDate === today ? (data?.scan_count_today || 0) : 0;

  if (scanCount >= FREE_SCANS_PER_DAY) {
    return NextResponse.json({ ok: false, scansLeft: 0, limitReached: true });
  }

  await supabase.from("subscriptions").upsert({
    session_id: sessionId,
    scan_count_today: scanCount + 1,
    scan_date: today,
    updated_at: new Date().toISOString(),
  }, { onConflict: "session_id" });

  return NextResponse.json({ ok: true, scansLeft: FREE_SCANS_PER_DAY - scanCount - 1 });
}