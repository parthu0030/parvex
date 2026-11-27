import "server-only";

// Lightweight in-memory rate limiter. Fine for a single-instance deployment;
// swap for a Redis-backed limiter (e.g. Upstash) if PARVEX moves to multiple
// serverless regions/instances where in-memory state won't be shared.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count };
}

/** Give back one use, e.g. when a request failed for a reason that wasn't the visitor's fault. */
export function refundRateLimit(key: string): void {
  const bucket = buckets.get(key);
  if (bucket && bucket.count > 0) bucket.count -= 1;
}
