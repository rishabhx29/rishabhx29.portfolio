import { NextResponse } from "next/server";
import { isAllowedQuery } from "@/lib/github-queries";

/**
 * Thin GitHub GraphQL adapter.
 *
 * It exists only to keep `GITHUB_TOKEN` on the server. That makes it a
 * privileged endpoint, so it defends itself:
 *
 * - **Exact query allowlist** — only the documents in `@/lib/github-queries`
 *   may run. Without this the route would proxy arbitrary client GraphQL
 *   using our token.
 * - **Rate limiting** — a small per-IP token bucket; the token's own 5,000
 *   req/hr budget is not something anonymous callers should be able to drain.
 * - **TTL cache** — identical queries are served from memory for a few
 *   minutes, which removes the ~0.8–2s cold latency on every page view.
 *
 * The response contract is unchanged and deliberately forgiving: callers get
 * `{ data: null, fallback: true }` and render their offline state. Real
 * failures are logged server-side rather than surfaced to the client.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Max accepted request body. The largest real query is well under 1 KB. */
const MAX_BODY_BYTES = 8 * 1024;

/** Cache lifetime for a successful GraphQL response. */
const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 32;

/** Per-IP allowance. */
const RATE_LIMIT_CAPACITY = 20;
const RATE_LIMIT_REFILL_MS = 10 * 1000;

type Bucket = { tokens: number; updatedAt: number };

const cache = new Map<string, { expiresAt: number; payload: unknown }>();
const buckets = new Map<string, Bucket>();

function readCache(key: string) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    cache.delete(key);
    return null;
  }
  // Refresh LRU position.
  cache.delete(key);
  cache.set(key, hit);
  return hit.payload;
}

function writeCache(key: string, payload: unknown) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, payload });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "local";
}

function takeToken(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, { tokens: RATE_LIMIT_CAPACITY - 1, updatedAt: now });
    return true;
  }

  const refilled = Math.floor((now - bucket.updatedAt) / RATE_LIMIT_REFILL_MS);
  if (refilled > 0) {
    bucket.tokens = Math.min(RATE_LIMIT_CAPACITY, bucket.tokens + refilled);
    bucket.updatedAt += refilled * RATE_LIMIT_REFILL_MS;
  }

  if (bucket.tokens <= 0) return false;

  bucket.tokens -= 1;

  // Keep the map from growing without bound on a long-lived server.
  if (buckets.size > 5_000) {
    for (const [id, entry] of buckets) {
      if (now - entry.updatedAt > RATE_LIMIT_REFILL_MS * 4) buckets.delete(id);
    }
  }

  return true;
}

const offline = () => NextResponse.json({ data: null, fallback: true }, { status: 200 });

export async function POST(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { data: null, message: "Offline / Fallback mode", fallback: true },
      { status: 200 },
    );
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let query: unknown;
  try {
    const body: unknown = await request.json();
    query = typeof body === "object" && body !== null ? (body as { query?: unknown }).query : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // The security boundary: nothing outside the allowlist reaches GitHub.
  // Checked *before* the rate limiter so rejected garbage costs the caller
  // nothing and cannot drain the bucket that legitimate page views share.
  if (!isAllowedQuery(query)) {
    return NextResponse.json({ error: "Query not allowed" }, { status: 403 });
  }

  if (!takeToken(clientKey(request))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const cached = readCache(query);
  if (cached) {
    return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (!response.ok || !isJson) {
      console.error(`[api/github] upstream ${response.status} ${response.statusText}`);
      return offline();
    }

    const payload: unknown = await response.json();
    writeCache(query, payload);

    return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } });
  } catch (error) {
    console.error("[api/github] request failed", error);
    return offline();
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
