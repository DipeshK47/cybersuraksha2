/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Scope: this limits abuse within a single Worker isolate — enough to blunt
 * credential-stuffing and accidental floods against auth endpoints. For
 * authoritative, cross-isolate enforcement in production, pair this with
 * Cloudflare's built-in rate-limiting rules (WAF) or a Durable-Object counter;
 * this module is the in-process backstop, not the sole defense.
 */

const buckets = new Map<string, number[]>();

// Bound memory: opportunistically drop fully-expired buckets.
function sweep(now: number, windowMs: number) {
  if (buckets.size < 5_000) return;
  for (const [key, hits] of buckets) {
    if (hits.length === 0 || now - hits[hits.length - 1] > windowMs) {
      buckets.delete(key);
    }
  }
}

export function clientKey(request: Request, scope: string): string {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return `${scope}:${ip}`;
}

/** Returns true if the action is allowed, false if the limit is exceeded. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now, windowMs);
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

/**
 * Enforce a limit for a request. Returns a ready 429 Response when exceeded,
 * or null when the request may proceed.
 */
export function enforceRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Response | null {
  if (allow(clientKey(request, scope), limit, windowMs)) return null;
  return Response.json(
    { error: "Too many attempts. Please wait a moment and try again." },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) },
    },
  );
}
