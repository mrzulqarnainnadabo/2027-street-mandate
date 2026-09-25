import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const OPERATOR_SESSION_COOKIE = "iseyc_op_session";

function sessionSecret(): string | null {
  const key = process.env.CIVIC_OPERATOR_KEY?.trim();
  return key || null;
}

function expectedToken(): string | null {
  const secret = sessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update("iseyc-operator-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** True if httpOnly operator session cookie is valid. */
export async function hasValidOperatorSession(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const jar = await cookies();
  const supplied = jar.get(OPERATOR_SESSION_COOKIE)?.value || "";
  if (!supplied) return false;
  return safeEqual(supplied, expected);
}

/**
 * Establish session only when the supplied key matches CIVIC_OPERATOR_KEY.
 * Key is never written into the cookie — only an HMAC token is.
 */
export async function establishOperatorSession(suppliedKey: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const expected = process.env.CIVIC_OPERATOR_KEY?.trim();
  if (!expected) {
    return { ok: false, error: "Operator access is not configured on this server." };
  }
  if (!suppliedKey.trim() || !safeEqual(suppliedKey.trim(), expected)) {
    return { ok: false, error: "Operator authorization failed." };
  }
  const token = expectedToken();
  if (!token) return { ok: false, error: "Operator access is not configured on this server." };

  const jar = await cookies();
  jar.set(OPERATOR_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return { ok: true };
}

export async function clearOperatorSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(OPERATOR_SESSION_COOKIE);
}
