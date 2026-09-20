import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let fetchContributionCalendar: typeof import("./github").fetchContributionCalendar;
let fetchPullRequests: typeof import("./github").fetchPullRequests;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("./github");
  fetchContributionCalendar = mod.fetchContributionCalendar;
  fetchPullRequests = mod.fetchPullRequests;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function stubFetch(payload: unknown, ok = true, contentType: string | null = "application/json") {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok,
      status: ok ? 200 : 500,
      headers: { get: () => contentType },
      json: async () => payload,
    })),
  );
}

describe("fetchContributionCalendar", () => {
  it("returns the typed calendar when the shape matches", async () => {
    const calendar = {
      totalContributions: 42,
      months: [{ name: "January" }],
      weeks: [{ contributionDays: [{ contributionCount: 3, date: "2026-01-02" }] }],
    };
    stubFetch({ data: { user: { contributionsCollection: { contributionCalendar: calendar } } } });

    await expect(fetchContributionCalendar()).resolves.toEqual(calendar);
  });

  it("resolves null when the route answers with the offline fallback", async () => {
    stubFetch({ data: null, message: "Offline / Fallback mode", fallback: true });

    await expect(fetchContributionCalendar()).resolves.toBeNull();
  });

  it("resolves null on a non-JSON or error response", async () => {
    stubFetch("<html>boom</html>", false, "text/html");
    await expect(fetchContributionCalendar()).resolves.toBeNull();

    stubFetch("nope", true, null);
    await expect(fetchContributionCalendar()).resolves.toBeNull();
  });

  it("resolves null when the network itself fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));

    await expect(fetchContributionCalendar()).resolves.toBeNull();
  });
});

describe("fetchPullRequests", () => {
  const makePR = (id: number, title: string, repo: string, createdAt: string) => ({
    id,
    title,
    url: `https://github.com/${repo}/pull/${id}`,
    repository: { nameWithOwner: repo },
    state: "MERGED",
    createdAt,
  });

  it("extracts, filters the excluded repo PR, and sorts newest first", async () => {
    const old = makePR(1, "Fix bug", "upstream/repo", "2025-01-01");
    const excluded = makePR(2, "Main", "rishabhx29/flexprice-storybook", "2026-01-01");
    const newest = makePR(3, "Add feature", "upstream/repo", "2026-06-01");
    stubFetch({ data: { search: { edges: [{ node: old }, { node: excluded }, null, { node: newest }] } } });

    const prs = await fetchPullRequests("merged");

    expect(prs).toEqual([newest, old]);
  });

  it("resolves null when search edges are missing (fallback payload)", async () => {
    stubFetch({ data: null, fallback: true });

    await expect(fetchPullRequests("open")).resolves.toBeNull();
  });
});
