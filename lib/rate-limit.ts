/**
 * Lightweight in-memory rate limit for serverless instances.
 * Not a global distributed limiter — still reduces burst abuse per instance.
 * Prefer IP; optionally fold deviceId into the key for soft client signals.
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

const MAX_KEYS = 5000;

function prune(now: number) {
  if (store.size < MAX_KEYS) return;
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }
  if (store.size >= MAX_KEYS) {
    const entries = [...store.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt);
    for (let i = 0; i < Math.floor(entries.length / 2); i++) {
      store.delete(entries[i][0]);
    }
  }
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSec: number };

/**
 * @param key stable client key (e.g. ip or ip+device)
 * @param limit max actions in window
 * @param windowMs window length
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  prune(now);
  const safeKey = key.slice(0, 200) || "unknown";
  let bucket = store.get(safeKey);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(safeKey, bucket);
  }
  if (bucket.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  bucket.count += 1;
  return { ok: true, remaining: Math.max(0, limit - bucket.count) };
}

/** Client IP from common proxy headers (Vercel / reverse proxy). */
export function clientIpFromRequest(req: {
  headers: { get(name: string): string | null };
}): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}
