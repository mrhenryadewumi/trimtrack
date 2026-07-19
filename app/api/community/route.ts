export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function sid(req: NextRequest, body?: any) {
  return body?.session_id || req.cookies.get("trimtrack_session")?.value || req.nextUrl.searchParams.get("session_id") || null;
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = sid(req);
    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const kind = req.nextUrl.searchParams.get("kind");

    let q = supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50);
    if (kind && kind !== "all") q = q.eq("kind", kind);
    const { data: posts, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ids = (posts || []).map(p => p.id);
    let cheers: any[] = [], replies: any[] = [];
    if (ids.length) {
      const [c, r] = await Promise.all([
        supabase.from("cheers").select("post_id, session_id").in("post_id", ids),
        supabase.from("replies").select("*").in("post_id", ids).order("created_at", { ascending: true }),
      ]);
      cheers = c.data || []; replies = r.data || [];
    }

    const out = (posts || []).map(p => ({
      ...p,
      cheer_count: cheers.filter(c => c.post_id === p.id).length,
      cheered: cheers.some(c => c.post_id === p.id && c.session_id === sessionId),
      mine: p.session_id === sessionId,
      replies: replies.filter(r => r.post_id === p.id).map(r => ({ id: r.id, author_name: r.author_name, body: r.body, created_at: r.created_at, mine: r.session_id === sessionId })),
    }));
    return NextResponse.json({ posts: out });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = sid(req, body);
    if (!sessionId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: sub } = await supabase.from("subscriptions").select("name").eq("session_id", sessionId).single();
    const author = sub?.name || "Member";

    if (body.action === "post") {
      const { data, error } = await supabase.from("posts")
        .insert({ session_id: sessionId, author_name: author, kind: body.kind || "journey", body: body.body, meta: body.meta || {} })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, post: data });
    }
    if (body.action === "reply") {
      const { data, error } = await supabase.from("replies")
        .insert({ post_id: body.post_id, session_id: sessionId, author_name: author, body: body.body })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, reply: data });
    }
    if (body.action === "cheer") {
      await supabase.from("cheers").upsert({ post_id: body.post_id, session_id: sessionId }, { onConflict: "post_id,session_id" });
      return NextResponse.json({ ok: true });
    }
    if (body.action === "uncheer") {
      await supabase.from("cheers").delete().eq("post_id", body.post_id).eq("session_id", sessionId);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}