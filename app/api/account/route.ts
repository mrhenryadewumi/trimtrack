export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * DELETE /api/account — permanent account deletion.
 *
 * Required by both app stores: an app that can sign up must be able to delete
 * in-app. Everything keyed to the session is removed, the cookie is cleared,
 * and the call is idempotent — deleting an account that is already gone is a
 * 200, never a 500, so a retry from a flaky connection cannot wedge the user.
 *
 * Auth matches every other route here: the session cookie when the web app
 * calls it, or session_id in the JSON body when the native app does (the
 * httpOnly cookie is not reliable in React Native).
 */
export async function DELETE(req: NextRequest) {
  try {
    // A DELETE may legitimately carry no body — the cookie is enough.
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const sessionId =
      req.cookies.get("trimtrack_session")?.value || body.session_id;

    // No session at all is still a success: there is nothing left to delete,
    // and the caller's goal (account gone, signed out) already holds.
    if (!sessionId) return clearedResponse({ ok: true, deleted: false });

    // The `reminders` table is keyed by email, not session_id, so the address
    // has to be read before the subscriptions row (the user record) goes.
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("email")
      .eq("session_id", sessionId)
      .maybeSingle();

    const email = sub?.email ?? null;

    // Cheers and replies other members left on this member's posts would
    // otherwise be orphaned, so they go before the posts themselves.
    const { data: ownPosts } = await supabase
      .from("community_posts")
      .select("id")
      .eq("session_id", sessionId);

    const postIds = (ownPosts || []).map((p: { id: string }) => p.id);

    if (postIds.length > 0) {
      await supabase.from("community_cheers").delete().in("post_id", postIds);
      await supabase.from("community_replies").delete().in("post_id", postIds);
    }

    // Children first, then the rows they hang off, then the user record.
    await supabase.from("community_cheers").delete().eq("session_id", sessionId);
    await supabase.from("community_replies").delete().eq("session_id", sessionId);
    await supabase.from("community_posts").delete().eq("session_id", sessionId);

    await supabase.from("meal_entries").delete().eq("session_id", sessionId);
    await supabase.from("food_statements").delete().eq("session_id", sessionId);
    await supabase.from("weight_log").delete().eq("session_id", sessionId);
    await supabase.from("push_subscriptions").delete().eq("session_id", sessionId);

    // Reminder sends and the waitlist are keyed by email, not session_id —
    // lib/api-client.ts sendReminder() posts { type, email, name,
    // daily_goal, ... } with no session id. Both carry personal data, so both
    // go. (The `reminders` boolean on profiles is the on/off preference and
    // goes with the profile row below.)
    if (email) {
      await supabase.from("reminders").delete().eq("email", email);
      await supabase.from("waitlist").delete().eq("email", email);
    }

    await supabase.from("profiles").delete().eq("session_id", sessionId);

    // subscriptions IS the user record in this schema — delete it last so a
    // failure part-way through leaves the account still resolvable and the
    // call safely retryable.
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("session_id", sessionId);

    if (error) {
      console.error("Account delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return clearedResponse({ ok: true, deleted: true });
  } catch (err: any) {
    console.error("Account DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** 200 with the session cookie expired. */
function clearedResponse(payload: Record<string, unknown>) {
  const response = NextResponse.json(payload);
  response.cookies.set("trimtrack_session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
