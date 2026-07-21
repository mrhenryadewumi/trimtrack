export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = req.cookies.get("trimtrack_session")?.value || body.session_id;
    if (!sessionId || !body.post_id) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    const { data: existing } = await supabase
      .from("community_cheers")
      .select("post_id")
      .eq("post_id", body.post_id)
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await supabase.from("community_cheers").delete().eq("post_id", body.post_id).eq("session_id", sessionId);
      return NextResponse.json({ ok: true, cheered: false });
    }
    await supabase.from("community_cheers").insert({ post_id: body.post_id, session_id: sessionId });
    return NextResponse.json({ ok: true, cheered: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}