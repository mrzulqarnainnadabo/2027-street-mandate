import { timingSafeEqual } from "node:crypto";

/**
 * Server-only operator authorization.
 * CIVIC_OPERATOR_KEY must never reach client bundles or URLs.
 * Fail closed when the key is missing or the header is wrong.
 */

export function getOperatorKeyConfigured(): boolean {
  return Boolean(process.env.CIVIC_OPERATOR_KEY?.trim());
}

function safeEqualString(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/**
 * Accepts Authorization: Bearer <key> only.
 * Missing key, empty key, malformed header, or mismatch → false.
 */
export function isAuthorizedOperatorRequest(request: Request): boolean {
  const expected = process.env.CIVIC_OPERATOR_KEY?.trim();
  if (!expected) return false;

  const header = request.headers.get("authorization");
  if (!header) return false;

  const match = header.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match) return false;

  const supplied = match[1];
  if (!supplied) return false;

  return safeEqualString(supplied, expected);
}
