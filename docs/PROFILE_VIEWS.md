# Homepage profile views

The homepage reads the lifetime production pageviews for `/` from the [Vercel Web Analytics count API](https://vercel.com/docs/analytics/web-analytics-api). It uses the Web Analytics data already collected by the site; no Redis database or custom visitor tracking is needed. "Profile views" means **pageviews**, not unique visitors, and includes traffic only since Web Analytics was enabled.

## Deployment setup

1. Enable **Web Analytics** for the Vercel project (if it is not enabled already).
2. Create a [Vercel access token](https://vercel.com/docs/accounts/access-tokens) scoped to this project/team if available, with the shortest practical expiration. Rotate it periodically. Set `VERCEL_ANALYTICS_TOKEN` in the Vercel project's **Production** environment. Do not prefix it with `NEXT_PUBLIC_` or commit it.
3. Set `VERCEL_ANALYTICS_PROJECT_ID` to this project's `prj_…` ID (or project name). Vercel's `VERCEL_PROJECT_ID` system variable is a fallback, but relying on it requires system environment variables to be exposed in the project settings.
4. If the project is owned by a team, also add `VERCEL_ANALYTICS_TEAM_ID` with its `team_…` ID. Personal projects do not need it.
5. Redeploy. Without the token and project ID, or if the API is unavailable, the page shows `—` rather than a fabricated count.

The existing Spotify music chip still needs `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN` on the Vercel deployment. Without them, it shows an honest "Spotify unavailable" music icon.

## How it works

- The browser reads `GET /api/profile-views`. That server route calls `GET /v1/query/web-analytics/visits/count` with `requestPath eq '/'` and returns only `data.pageviews`; it never sends the Vercel token to the browser.
- Successful responses are cached at the Vercel edge for five minutes, so the number may lag behind the dashboard. Upstream failures are cached for 30 seconds to avoid hammering the API; missing credentials are not cached.
- This site does **not** send a custom POST, store visitor IDs/IPs, or increment its own counter. Vercel's existing Analytics script collects visits as usual. Preview/local traffic is not included in the production count.
