// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

beforeEach(() => {
  vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "private-test-token");
  vi.stubEnv("VERCEL_ANALYTICS_PROJECT_ID", "prj_test");
  vi.stubEnv("VERCEL_PROJECT_ID", "");
  vi.stubEnv("VERCEL_ANALYTICS_TEAM_ID", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/profile-views", () => {
  it("does not invent a count or call Vercel when credentials are absent", async () => {
    vi.stubEnv("VERCEL_ANALYTICS_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    expect(await response.json()).toEqual({ ok: false, count: null });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns lifetime production homepage pageviews without exposing the token", async () => {
    const fetchMock = vi.fn(async () => Response.json({ data: { pageviews: 1234, visitors: 900 } }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VERCEL_ANALYTICS_TEAM_ID", "team_test");

    const response = await GET();
    const payload = await response.text();
    expect(JSON.parse(payload)).toEqual({ ok: true, count: 1234 });
    expect(payload).not.toContain("private-test-token");
    expect(response.headers.get("cache-control")).toContain("s-maxage=300");
    const [url, options] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit];
    expect(url.origin + url.pathname).toBe("https://api.vercel.com/v1/query/web-analytics/visits/count");
    expect(url.searchParams.get("projectId")).toBe("prj_test");
    expect(url.searchParams.get("teamId")).toBe("team_test");
    expect(url.searchParams.get("filter")).toBe("requestPath eq '/'");
    expect(url.searchParams.has("since")).toBe(false);
    expect(options.headers).toEqual({ Authorization: "Bearer private-test-token" });
  });

  it("uses Vercel's system project ID when no override is set", async () => {
    vi.stubEnv("VERCEL_ANALYTICS_PROJECT_ID", "");
    vi.stubEnv("VERCEL_PROJECT_ID", "prj_system");
    const fetchMock = vi.fn(async () => Response.json({ data: { pageviews: 0, visitors: 0 } }));
    vi.stubGlobal("fetch", fetchMock);

    expect(await (await GET()).json()).toEqual({ ok: true, count: 0 });
    const [url] = fetchMock.mock.calls[0] as unknown as [URL];
    expect(url.searchParams.get("projectId")).toBe("prj_system");
  });

  it("does not show a fake zero for an API error or unexpected response", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Unauthorized", { status: 401 })));
    expect(await (await GET()).json()).toEqual({ ok: false, count: null });

    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ data: { pageviews: "0" } })));
    const malformed = await GET();
    expect(await malformed.json()).toEqual({ ok: false, count: null });
    expect(malformed.headers.get("cache-control")).toContain("s-maxage=30");
  });

  it("handles an upstream network failure without leaking error details", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network failed"); }));
    expect(await (await GET()).json()).toEqual({ ok: false, count: null });
  });
});
