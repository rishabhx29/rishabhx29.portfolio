import { createHash, createHmac } from "node:crypto";

const COUNT_KEY = "portfolio:profile-views:v1";
const VISITOR_TTL_SECONDS = 86_400;
const RATE_TTL_SECONDS = 3_600;
const MAX_NEW_VIEWS_PER_HOUR = 120;

// Deduplicate, rate-limit, and increment in one Redis operation. The Lua
// script is atomic, so a failed request cannot leave a visitor marked without
// its view being counted. Redis stores hashes, never raw visitor IDs or IPs.
const RECORD_VIEW = `
  if redis.call('EXISTS', KEYS[2]) == 1 then
    return tonumber(redis.call('GET', KEYS[1]) or '0')
  end
  local attempts = redis.call('INCR', KEYS[3])
  if attempts == 1 then redis.call('EXPIRE', KEYS[3], ARGV[2]) end
  if attempts > tonumber(ARGV[3]) then
    return tonumber(redis.call('GET', KEYS[1]) or '0')
  end
  redis.call('SET', KEYS[2], '1', 'EX', ARGV[1])
  return redis.call('INCR', KEYS[1])
`;

type RedisResult = { result?: unknown; error?: string };

function credentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  // These are deployment settings, not request input, but reject a typo or an
  // insecure endpoint rather than sending the database token to it.
  try {
    const endpoint = new URL(url);
    if (endpoint.protocol !== "https:") return null;
    return { url: endpoint.toString(), token };
  } catch {
    return null;
  }
}

export function profileViewsConfigured() {
  return credentials() !== null;
}

async function redis(command: (string | number)[]): Promise<unknown> {
  const config = credentials();
  if (!config) throw new Error("Profile views store not configured");

  const response = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Profile views store unavailable");
  const data = (await response.json()) as RedisResult;
  if (data.error || !("result" in data)) throw new Error("Profile views store rejected command");
  return data.result;
}

function countFrom(value: unknown): number {
  const count = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
  if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid profile view count");
  return count;
}

/** Only real client visits POST; GET and crawler prefetches never increment. */
export async function getProfileViews(): Promise<number> {
  const count = await redis(["GET", COUNT_KEY]);
  return count === null ? 0 : countFrom(count);
}

/**
 * A random per-tab identifier is hashed and kept for one day. On Vercel a
 * separate HMAC of the proxy-supplied client IP limits new visits to 120/hour;
 * that rate key expires after an hour. Neither the IP nor raw ID is stored.
 */
export async function recordProfileView(visitorId: string, clientIp: string): Promise<number> {
  const visitorDigest = createHash("sha256").update(visitorId).digest("hex");
  const rateDigest = createHmac("sha256", process.env.UPSTASH_REDIS_REST_TOKEN ?? "")
    .update(clientIp)
    .digest("hex");
  return countFrom(await redis([
    "EVAL", RECORD_VIEW, 3,
    COUNT_KEY,
    `${COUNT_KEY}:visitor:${visitorDigest}`,
    `${COUNT_KEY}:rate:${rateDigest}`,
    VISITOR_TTL_SECONDS,
    RATE_TTL_SECONDS,
    MAX_NEW_VIEWS_PER_HOUR,
  ]));
}
