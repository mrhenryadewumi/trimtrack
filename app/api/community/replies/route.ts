export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get("post_id");
    if (!postId) return NextResponse.json({ error: "Missing post_id" }, { status: 400 });

    const sessionId =
      req.cookies.get("trimtrack_session")?.value ||
      req.nextUrl.searchParams.get("session_id");

    const { data, error } = await supabase
      .from("community_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    let blocked = new Set<string>();
    if (sessionId) {
      const { data: blocks } = await supabase
        .from("blocked_members")
        .select("blocked_session_id")
        .eq("session_id", sessionId);
      blocked = new Set((blocks || []).map((b: any) => b.blocked_session_id));
    }

    // Same rule as the feed: session_id is the auth token and must not leave
    // the server. Whitelist, and drop replies from blocked members.
    const replies = (data || [])
      .filter((r: any) => !blocked.has(r.session_id))
      .map((r: any) => ({
        id: r.id,
        post_id: r.post_id,
        author_name: r.author_name,
        body: r.body,
        created_at: r.created_at,
      }));

    return NextResponse.json({ replies });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    const text = (body.body || "").trim();
    if (!sessionId || !body.post_id || !text) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const { data: prof } = await supabase.from("profiles").select("name").eq("session_id", sessionId).maybeSingle();
    let author_name = prof?.name;
    if (!author_name) {
      const { data: sub } = await supabase.from("subscriptions").select("name").eq("session_id", sessionId).maybeSingle();
      author_name = sub?.name || "Member";
    }

    const { data, error } = await supabase
      .from("community_replies")
      .insert({ post_id: body.post_id, session_id: sessionId, author_name, body: text })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, reply: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}