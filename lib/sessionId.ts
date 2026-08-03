import { randomBytes } from "crypto";

/**
 * Session ids and any other secret handed to a client.
 *
 * These were previously `Math.random().toString(36) + Date.now()`. Math.random
 * is not a CSPRNG — V8 runs xorshift128+, whose state can be recovered from a
 * few outputs, after which every later value is predictable. Since the session
 * id IS the auth credential on every route here, that was a full account
 * takeover away from anyone who bothered.
 *
 * 32 bytes of crypto randomness, hex-encoded: 64 characters, URL-safe, safe in
 * a cookie, a query string or a JSON body.
 */
export function createSessionId(): string {
  return randomBytes(32).toString("hex");
}
