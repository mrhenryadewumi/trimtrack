import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Fixed-window limiter backed by the `rate_limits` table
 * (bucket, key, window_start, count). One row per (bucket, key, window).
 */
export async function checkRateLimit(
  bucket: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowStart = new Date(
    Math.floor(Date.now() / windowMs) * windowMs
  ).toISOString();

  const { data: existing } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("bucket", bucket)
    .eq("key", key)
    .eq("window_start", windowStart)
    .maybeSingle();

  if (!existing) {
    await supabase
      .from("rate_limits")
      .insert({ bucket, key, window_start: windowStart, count: 1 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await supabase
    .from("rate_limits")
    .update({ count: existing.count + 1 })
    .eq("bucket", bucket)
    .eq("key", key)
    .eq("window_start", windowStart);

  return { allowed: true, remaining: limit - existing.count - 1 };
}

/** Clears a bucket/key's current window — used to reset on a successful login. */
export async function resetRateLimit(
  bucket: string,
  key: string,
  windowMs: number
): Promise<void> {
  const windowStart = new Date(
    Math.floor(Date.now() / windowMs) * windowMs
  ).toISOString();

  await supabase
    .from("rate_limits")
    .delete()
    .eq("bucket", bucket)
    .eq("key", key)
    .eq("window_start", windowStart);
}

/** Best-effort caller IP from standard proxy headers. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
