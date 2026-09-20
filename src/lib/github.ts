/**
 * GitHub data module — the seam between the site and GitHub.
 *
 * Owns: query text, transport, response guarding, and the fallback contract.
 * The contract: every function resolves with typed data, or `null` when GitHub
 * is unreachable/unconfigured/misshapen. `null` means "render your cached or
 * offline state"; callers never inspect HTTP details.
 *
 * The `/api/github` route stays a thin token adapter: it injects the server-side
 * GITHUB_TOKEN and folds all its own failures into `{ data: null, fallback: true }`.
 */

export interface ContributionCalendar {
  totalContributions: number;
  months: Array<{ name: string }>;
  weeks: Array<{
    contributionDays: Array<{
      contributionCount: number;
      date: string;
    }>;
  }>;
}

export interface PullRequest {
  id: number;
  title: string;
  url: string;
  repository: {
    nameWithOwner: string;
  };
  state: string;
  createdAt: string;
  mergedAt?: string;
  closedAt?: string;
}

export type PRFilterType = "merged" | "open" | "closed";

/** Run a GraphQL query through the thin adapter. Returns `data.data` or null. */
async function runQuery(query: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch("/api/github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      return null;
    }

    const payload = (await response.json()) as {
      data?: Record<string, unknown> | null;
    };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

/** Contribution calendar for the profile owner, or null when offline. */
export async function fetchContributionCalendar(): Promise<ContributionCalendar | null> {
  const data = await runQuery(`
    query {
      user(login: "rishabhx29") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            months {
              name
            }
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `);

  const calendar = (
    data as {
      user?: {
        contributionsCollection?: { contributionCalendar?: ContributionCalendar };
      };
    } | null
  )?.user?.contributionsCollection?.contributionCalendar;

  return calendar ?? null;
}

const SEARCH_QUERIES: Record<PRFilterType, string> = {
  merged: "author:rishabhx29 type:pr is:merged",
  open: "author:rishabhx29 type:pr is:open",
  closed: "author:rishabhx29 type:pr is:closed is:unmerged",
};

function buildGraphQLQuery(searchQuery: string) {
  return `query {
    search(query: "${searchQuery}", type: ISSUE, first: 100) {
      edges {
        node {
          ... on PullRequest {
            id
            title
            url
            repository {
              nameWithOwner
            }
            state
            createdAt
            mergedAt
            closedAt
          }
        }
      }
    }
  }`;
}

/** PRs that shouldn't appear in the open-source timeline. */
function isExcludedPullRequest(pr: PullRequest): boolean {
  return pr.title === "Main" && pr.repository.nameWithOwner === "rishabhx29/flexprice-storybook";
}

function recency(pr: PullRequest): number {
  return new Date(pr.mergedAt || pr.closedAt || pr.createdAt).getTime();
}

/** The profile owner's PRs for a filter type, newest first — or null when offline. */
export async function fetchPullRequests(type: PRFilterType): Promise<PullRequest[] | null> {
  const data = await runQuery(buildGraphQLQuery(SEARCH_QUERIES[type]));

  const edges = (
    data as {
      search?: {
        edges?: Array<{ node?: PullRequest | null } | null>;
      };
    } | null
  )?.search?.edges;

  if (!edges) return null;

  return edges
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .filter((pr) => !isExcludedPullRequest(pr))
    .sort((a, b) => recency(b) - recency(a));
}
