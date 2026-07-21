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

export async function POST(req: NextRequest) {
  try {
    const { session_id, title, body, url, secret } = await req.json();
    if (!session_id && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let q = supabase.from("push_subscriptions").select("subscription, endpoint");
    if (session_id) q = q.eq("session_id", session_id);
    const { data } = await q;

    const payload = JSON.stringify({
      title: title || "TrimTrack",
      body: body || "Time to log your meal!",
      url: url || "/dashboard",
    });

    await Promise.all(
      (data || []).map((r: any) =>
        webpush.sendNotification(r.subscription, payload).catch(async (e: any) => {
          if (e.statusCode === 404 || e.statusCode === 410) {
            await supabase.from("push_subscriptions").delete().eq("endpoint", r.endpoint);
          }
        })
      )
    );
    return NextResponse.json({ ok: true, sent: data?.length || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
