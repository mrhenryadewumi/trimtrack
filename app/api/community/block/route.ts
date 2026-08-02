export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/community/block { post_id }
 *
 * Blocks the author of a post. Identified by post rather than by member,
 * deliberately: session_id is the auth token, so it never leaves the server
 * and the client has no way to name another member directly.
 *
 * Blocking twice is a success — the caller's intent already holds.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId =
      req.cookies.get("trimtrack_session")?.value || body.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const postId = typeof body.post_id === "string" ? body.post_id : null;
    if (!postId) {
      return NextResponse.json({ error: "Missing post_id" }, { status: 400 });
    }

    const { data: post } = await supabase
      .from("community_posts")
      .select("session_id")
      .eq("id", postId)
      .maybeSingle();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.session_id === sessionId) {
      return NextResponse.json(
        { error: "You cannot block yourself" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("blocked_members").insert({
      session_id: sessionId,
      blocked_session_id: post.session_id,
    });

    // 23505 is the unique index: already blocked.
    if (error && error.code !== "23505") {
      console.error("Block insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Block error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
