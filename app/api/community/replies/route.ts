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
    const { data, error } = await supabase
      .from("community_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ replies: data || [] });
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