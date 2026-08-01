/**
 * Confirmation tokens that carry their own expiry.
 *
 * Format: `<random>.<expiry-ms in base36>`. The expiry is not signed, but it
 * does not need to be: the whole string is compared against the value stored
 * on the row, so editing the expiry breaks the match. This keeps the 7-day
 * limit self-contained and avoids adding a column.
 */

export const CONFIRM_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createConfirmToken(ttlMs: number = CONFIRM_TOKEN_TTL_MS): string {
  const random = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expiresAt = (Date.now() + ttlMs).toString(36);
  return `${random}.${expiresAt}`;
}

/**
 * True when the token carries an expiry that has passed. Tokens issued before
 * this format existed have no expiry part and are accepted, so links already
 * in inboxes keep working.
 */
export function isConfirmTokenExpired(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const expiresAt = parseInt(token.slice(dot + 1), 36);
  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() > expiresAt;
}
