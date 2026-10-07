# Homepage profile views

The homepage shows a global profile-view counter powered by Upstash Redis. It does **not** use a server-memory variable or a browser-local total, which would reset or differ between serverless instances. The site renders `—` rather than inventing a count until Redis is configured.

## Deployment setup

1. Create a persistent Upstash Redis database (do not use a temporary 72-hour starter database).
2. Set these server-only environment variables in the Vercel project for **Production** (and Preview if needed):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Redeploy. The counter begins at zero after the first real visit. Do not put these values in `NEXT_PUBLIC_` variables or commit them to Git.

The Spotify music chip also needs the three existing server-only `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` environment variables on the deployment. Without them, it shows an honest "Spotify unavailable" music icon rather than pretending a fixed track is live.

## Counting semantics

- A homepage mount sends a same-origin POST from the browser. Crawlers, link prefetches, and GET requests cannot increment it.
- Each browser tab keeps a random UUID in session storage. Redis stores only a SHA-256 hash of it for 24 hours; the same tab counts at most once during that period, even after reloads or React remounts.
- On Vercel the trusted proxy-provided IP is HMAC-hashed for an hourly rate bucket (120 new views per IP per hour). The IP, user agent, and raw UUID are never stored. A Redis Lua script deduplicates, rate-limits, and increments atomically across serverless instances.
- As with any public page-view counter, this is an approximate engagement metric, **not** a fraud-proof count of unique people. Shared networks and privacy settings that block session storage or scripts may affect totals.
- `GET /api/profile-views` reads without counting; `POST /api/profile-views` records one eligible visit. Responses are private, uncached, and never contain database credentials.
