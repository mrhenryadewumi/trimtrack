export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

/**
 * Server-to-server push. Not reachable from a client, by design.
 *
 * The old auth line was:
 *
 *   if (!session_id && secret !== process.env.CRON_SECRET) return 401
 *
 * which means supplying ANY session_id skipped the secret entirely. Title,
 * body and url are all attacker-controlled, so that was a working phishing
 * channel: a notification that looks exactly like TrimTrack, saying whatever
 * you like, opening wherever you like — delivered to a specific member.
 *
 * The secret is now required on every path. A session_id narrows the audience;
 * it is not a credential.
 */

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

/** Notifications may only ever open TrimTrack. */
function safePath(raw: unknown): string {
  if (typeof raw !== "string") return "/dashboard";
  // A leading double slash is protocol-relative and leaves the site.
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const { session_id, title, body, url, secret } = await req.json();

    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let q = supabase.from("push_subscriptions").select("subscription, endpoint");
    if (session_id) q = q.eq("session_id", session_id);
    const { data } = await q;

    const payload = JSON.stringify({
      title: typeof title === "string" ? title.slice(0, 80) : "TrimTrack",
      body: typeof body === "string" ? body.slice(0, 200) : "Time to log your meal!",
      url: safePath(url),
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
