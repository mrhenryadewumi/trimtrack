export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/rateLimit";

const POST_WINDOW_MS = 60 * 60 * 1000;
const POST_LIMIT = 10;
const BODY_MAX_LENGTH = 4000;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resolveName(sessionId: string): Promise<string> {
  const { data: prof } = await supabase.from("profiles").select("name").eq("session_id", sessionId).maybeSingle();
  if (prof?.name) return prof.name;
  const { data: sub } = await supabase.from("subscriptions").select("name").eq("session_id", sessionId).maybeSingle();
  return sub?.name || "Member";
}

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("trimtrack_session")?.value || req.nextUrl.searchParams.get("session_id");
    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 401 });

    // Who this member has blocked. Their posts never enter the feed.
    const { data: blocks } = await supabase
      .from("blocked_members")
      .select("blocked_session_id")
      .eq("session_id", sessionId);
    const blocked = new Set((blocks || []).map((b: any) => b.blocked_session_id));

    const { data: posts, error } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    const visible = (posts || []).filter(p => !blocked.has(p.session_id));

    const ids = visible.map(p => p.id);
    let cheers: any[] = [], replies: any[] = [];
    if (ids.length > 0) {
      const [c, r] = await Promise.all([
        supabase.from("community_cheers").select("post_id, session_id").in("post_id", ids),
        supabase.from("community_replies").select("post_id").in("post_id", ids),
      ]);
      cheers = c.data || []; replies = r.data || [];
    }

    // Never spread the row: session_id is the auth token, so returning it
    // would let any reader impersonate the author. Whitelist the fields.
    const enriched = visible.map(p => ({
      id: p.id,
      author_name: p.author_name,
      kind: p.kind,
      body: p.body,
      meta: p.meta,
      created_at: p.created_at,
      cheer_count: cheers.filter(c => c.post_id === p.id).length,
      cheered: cheers.some(c => c.post_id === p.id && c.session_id === sessionId),
      reply_count: replies.filter(r => r.post_id === p.id).length,
      mine: p.session_id === sessionId,
    }));

    return NextResponse.json({ posts: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    if (!sessionId) return NextResponse.json({ error: "Missing session" }, { status: 401 });

    const text = (body.body || "").trim();
    if (!text) return NextResponse.json({ error: "Empty post" }, { status: 400 });
    if (text.length > BODY_MAX_LENGTH) {
      return NextResponse.json({ error: "Post is too long" }, { status: 400 });
    }
    const kind = ["journey", "idea", "recipe", "question"].includes(body.kind) ? body.kind : "journey";

    const limit = await checkRateLimit("community-post", sessionId, POST_LIMIT, POST_WINDOW_MS);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many posts. Try again later." }, { status: 429 });
    }

    const author_name = await resolveName(sessionId);
    const { data, error } = await supabase
      .from("community_posts")
      .insert({ session_id: sessionId, author_name, kind, body: text, meta: body.meta || {} })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, post: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    if (!sessionId || !body.id) return NextResponse.json({ error: "Missing params" }, { status: 400 });
    const { error } = await supabase.from("community_posts").delete().eq("id", body.id).eq("session_id", sessionId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}