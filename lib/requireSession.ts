import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * True only when the session id belongs to a real account. Write routes call
 * this so a made-up session id cannot create orphan rows.
 */
export async function sessionExists(supabase: SupabaseClient, sessionId: string): Promise<boolean> {
  if (typeof sessionId !== "string" || sessionId.length < 8) return false;
  const { data } = await supabase
    .from("subscriptions")
    .select("session_id")
    .eq("session_id", sessionId)
    .maybeSingle();
  return !!data;
}
