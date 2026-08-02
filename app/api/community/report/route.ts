export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/community/report { post_id, reason? }
 *
 * Records a report against a post. Both stores require a way to flag
 * objectionable user content, and /support tells people reports are looked at
 * within 24 hours.
 *
 * Reporting the same post twice is a success, not an error — the reporter
 * should never be told their report "failed" because they already sent one.
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

    const reason =
      typeof body.reason === "string" ? body.reason.slice(0, 500) : null;

    const { error } = await supabase.from("community_reports").insert({
      post_id: postId,
      session_id: sessionId,
      reason,
    });

    // 23505 is the unique index: already reported by this person.
    if (error && error.code !== "23505") {
      console.error("Report insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Report error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
