export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:hello@trimtrack.fit",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const slot = req.nextUrl.searchParams.get("slot") || "morning";
  const msg = slot === "evening"
    ? { title: "Evening check-in", body: "How did today go? Log your dinner." }
    : { title: "Good morning", body: "Plan your day - log breakfast to stay on track." };

  const { data } = await supabase.from("push_subscriptions").select("subscription, endpoint");
  const payload = JSON.stringify({ ...msg, url: "/dashboard" });

  await Promise.all(
    (data || []).map((r: any) =>
      webpush.sendNotification(r.subscription, payload).catch(async (e: any) => {
        if (e.statusCode === 404 || e.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", r.endpoint);
        }
      })
    )
  );
  return NextResponse.json({ ok: true, slot, sent: data?.length || 0 });
}
