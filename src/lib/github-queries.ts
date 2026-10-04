/**
 * The single source of truth for every GitHub GraphQL query this site sends.
 *
 * Why this lives in its own module:
 *
 * 1. `/api/github` holds the server-side `GITHUB_TOKEN`. It used to forward any
 *    `query` string the client sent, which turned the route into an open proxy
 *    for anyone who could reach it — burning the token's 5,000 req/hr budget
 *    and exposing whatever the token can read.
 * 2. So the route now validates incoming queries against an **exact allowlist**
 *    built from the constants below. No client-controlled text is ever
 *    interpolated into an outbound request.
 *
 * Because the client imports these same constants, the allowlist can never
 * drift out of sync with what the UI actually sends: if a query changes here,
 * both sides change together.
 */

export type PRFilterType = "merged" | "open" | "closed";

export const CONTRIBUTION_CALENDAR_QUERY = `
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
  `;

export const PR_SEARCH_QUERIES: Record<PRFilterType, string> = {
  merged: "author:rishabhx29 type:pr is:merged",
  open: "author:rishabhx29 type:pr is:open",
  closed: "author:rishabhx29 type:pr is:closed is:unmerged",
};

function buildPullRequestSearchQuery(searchQuery: string): string {
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

export const PULL_REQUEST_SEARCH_QUERIES: Record<PRFilterType, string> = {
  merged: buildPullRequestSearchQuery(PR_SEARCH_QUERIES.merged),
  open: buildPullRequestSearchQuery(PR_SEARCH_QUERIES.open),
  closed: buildPullRequestSearchQuery(PR_SEARCH_QUERIES.closed),
};

/**
 * Collapses whitespace so a query matches regardless of indentation or
 * trailing newlines, then trims. Two GraphQL documents that differ only in
 * formatting are equivalent, so this is the right granularity for an exact
 * (rather than fuzzy) allowlist.
 */
export function normalizeQuery(query: string): string {
  return query.replace(/\s+/g, " ").trim();
}

const ALLOWED = new Set(
  [CONTRIBUTION_CALENDAR_QUERY, ...Object.values(PULL_REQUEST_SEARCH_QUERIES)].map(normalizeQuery),
);

/** True only for the exact documents this site is allowed to execute. */
export function isAllowedQuery(query: unknown): query is string {
  return typeof query === "string" && ALLOWED.has(normalizeQuery(query));
}
