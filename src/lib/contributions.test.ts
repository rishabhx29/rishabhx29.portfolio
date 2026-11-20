import { describe, expect, it } from "vitest";

import type { PullRequest } from "./github";
import { groupContributions, pullRequestNumber } from "./contributions";

function makePR(
  id: number,
  repo: string,
  createdAt: string,
  extra: Partial<PullRequest> = {},
): PullRequest {
  return {
    id,
    title: `PR ${id}`,
    url: `https://github.com/${repo}/pull/${id}`,
    repository: { nameWithOwner: repo, stargazerCount: 1000 },
    state: "MERGED",
    createdAt,
    ...extra,
  };
}

describe("groupContributions", () => {
  it("groups pull requests by repository owner and counts each status", () => {
    const byType = {
      merged: [
        makePR(1, "mantine/mantine", "2026-01-01"),
        makePR(2, "mantine/mantine", "2026-02-01"),
      ],
      open: [makePR(3, "T3Code/t3code", "2026-03-01", { state: "OPEN" })],
      closed: [makePR(4, "mantine/mantine", "2026-04-01", { state: "CLOSED" })],
    };

    const orgs = groupContributions(byType);

    expect(orgs.map((org) => org.name)).toEqual(["mantine", "T3Code"]);
    expect(orgs[0].counts).toEqual({ merged: 2, open: 0, closed: 1 });
    expect(orgs[0].total).toBe(3);
    expect(orgs[1].counts).toEqual({ merged: 0, open: 1, closed: 0 });
  });

  it("counts a pull request that appears under two filters exactly once", () => {
    const duplicate = makePR(7, "mantine/mantine", "2026-01-01");

    const orgs = groupContributions({
      merged: [duplicate],
      open: [{ ...duplicate, state: "OPEN" }],
    });

    expect(orgs).toHaveLength(1);
    expect(orgs[0].counts).toEqual({ merged: 1, open: 0, closed: 0 });
    expect(orgs[0].pullRequests).toHaveLength(1);
  });

  it("sorts organizations by merged count, then total, then name", () => {
    const byType = {
      merged: [
        makePR(1, "alpha/alpha", "2026-01-01"),
        makePR(2, "beta/beta", "2026-01-01"),
        makePR(3, "beta/beta", "2026-01-02"),
        makePR(4, "zulu/zulu", "2026-01-01"),
      ],
      open: [
        makePR(5, "alpha/alpha", "2026-01-03", { state: "OPEN" }),
        makePR(6, "alpha/alpha", "2026-01-04", { state: "OPEN" }),
        makePR(7, "zulu/zulu", "2026-01-05", { state: "OPEN" }),
      ],
    };

    const orgs = groupContributions(byType);

    // beta has 2 merged; alpha and zulu tie on 1 merged, alpha wins on total (3 vs 2).
    expect(orgs.map((org) => org.name)).toEqual(["beta", "alpha", "zulu"]);
  });

  it("orders each organization's pull requests by most recent activity", () => {
    const byType = {
      merged: [
        makePR(1, "mantine/mantine", "2025-01-01"),
        makePR(2, "mantine/mantine", "2025-03-01", { mergedAt: "2025-06-01" }),
      ],
      closed: [makePR(3, "mantine/mantine", "2025-05-01", { closedAt: "2025-04-01" })],
    };

    const orgs = groupContributions(byType);

    expect(orgs[0].pullRequests.map((pr) => pr.id)).toEqual([2, 3, 1]);
    expect(orgs[0].pullRequests.map((pr) => pr.status)).toEqual([
      "merged",
      "closed",
      "merged",
    ]);
  });

  it("leaves out pull requests in the profile owner's own repositories", () => {
    const orgs = groupContributions({
      merged: [
        makePR(1, "rishabhx29/rishabhx29.portfolio", "2026-01-01"),
        makePR(2, "mantinedev/mantine", "2026-01-02"),
      ],
    });

    expect(orgs.map((org) => org.name)).toEqual(["mantinedev"]);
  });

  it("leaves out organizations whose repositories all have fewer than 100 stars", () => {
    const orgs = groupContributions({
      merged: [
        makePR(1, "famous/famous", "2026-01-01", {
          repository: { nameWithOwner: "famous/famous", stargazerCount: 12000 },
        }),
        makePR(2, "small/small", "2026-01-02", {
          repository: { nameWithOwner: "small/small", stargazerCount: 99 },
        }),
      ],
    });

    expect(orgs.map((org) => org.name)).toEqual(["famous"]);
  });

  it("keeps an organization when any one of its repositories reaches 100 stars", () => {
    const orgs = groupContributions({
      merged: [
        makePR(1, "mixed/tiny", "2026-01-01", {
          repository: { nameWithOwner: "mixed/tiny", stargazerCount: 4 },
        }),
        makePR(2, "mixed/big", "2026-01-02", {
          repository: { nameWithOwner: "mixed/big", stargazerCount: 100 },
        }),
      ],
    });

    expect(orgs).toHaveLength(1);
    expect(orgs[0].total).toBe(2);
    expect(orgs[0].stars).toBe(100);
  });

  it("returns nothing when no lists have loaded yet", () => {
    expect(groupContributions({})).toEqual([]);
  });
});

describe("pullRequestNumber", () => {
  it("reads the number from a pull request URL", () => {
    expect(pullRequestNumber("https://github.com/mantine/mantine/pull/7321")).toBe("7321");
  });

  it("returns null for a URL that is not a pull request", () => {
    expect(pullRequestNumber("https://github.com/mantine/mantine")).toBeNull();
  });
});
