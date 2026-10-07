/** Read production homepage pageviews from Vercel Web Analytics, server-side only. */

export function profileViewsConfigured() {
  return Boolean(
    process.env.VERCEL_ANALYTICS_TOKEN &&
    (process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID),
  );
}

export async function getProfileViews(): Promise<number> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_ANALYTICS_PROJECT_ID || process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) throw new Error("Vercel Analytics is not configured");

  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("filter", "requestPath eq '/'");
  if (process.env.VERCEL_ANALYTICS_TEAM_ID) {
    url.searchParams.set("teamId", process.env.VERCEL_ANALYTICS_TEAM_ID);
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Vercel Analytics request failed");

  const data = (await response.json()) as { data?: { pageviews?: unknown } };
  const count = data.data?.pageviews;
  if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) {
    throw new Error("Vercel Analytics returned an invalid pageview count");
  }
  return count;
}
