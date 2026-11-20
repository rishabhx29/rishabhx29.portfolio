/**
 * Aggregation for the Open Source section: the site shows one organization row
 * per GitHub owner instead of a flat pull request list.
 *
 * Pure by design. The hook that fetches and caches pull requests hands its
 * three lists in, and both the home summary and the detail page render the
 * same grouping, so the counts can never disagree with each other.
 */

import type { PRFilterType, PullRequest } from "./github";

export type ContributionStatus = PRFilterType;

export interface OrganizedPullRequest extends PullRequest {
  status: ContributionStatus;
}

export interface OrganizationContribution {
  name: string;
  counts: Record<ContributionStatus, number>;
  total: number;
  /** Stars on the organization's most-starred contributed repository. */
  stars: number;
  pullRequests: OrganizedPullRequest[];
}

/** Merged wins over open, open over closed, when the same PR shows up twice. */
const TYPE_ORDER: ContributionStatus[] = ["merged", "open", "closed"];

/** Work in the profile owner's own repositories is not a contributed organization. */
const PROFILE_OWNER = "rishabhx29";

/** Only organizations with a notable repository show up; small ones are noise. */
const MIN_ORGANIZATION_STARS = 100;

function activity(pr: PullRequest): number {
  return new Date(pr.mergedAt || pr.closedAt || pr.createdAt).getTime();
}

export function groupContributions(
  byType: Partial<Record<PRFilterType, PullRequest[]>>,
): OrganizationContribution[] {
  const groups = new Map<string, OrganizationContribution>();
  const seen = new Set<number>();

  for (const type of TYPE_ORDER) {
    for (const pr of byType[type] ?? []) {
      if (seen.has(pr.id)) continue;
      seen.add(pr.id);

      const owner = pr.repository.nameWithOwner.split("/")[0];
      if (!owner || owner.toLowerCase() === PROFILE_OWNER) continue;

      const key = owner.toLowerCase();
      let org = groups.get(key);
      if (!org) {
        org = {
          name: owner,
          counts: { merged: 0, open: 0, closed: 0 },
          total: 0,
          stars: 0,
          pullRequests: [],
        };
        groups.set(key, org);
      }

      org.counts[type] += 1;
      org.total += 1;
      org.stars = Math.max(org.stars, pr.repository.stargazerCount);
      org.pullRequests.push({ ...pr, status: type });
    }
  }

  return [...groups.values()]
    .filter((org) => org.stars >= MIN_ORGANIZATION_STARS)
    .map((org) => ({
      ...org,
      pullRequests: [...org.pullRequests].sort((a, b) => activity(b) - activity(a)),
    }))
    .sort(
      (a, b) =>
        b.counts.merged - a.counts.merged ||
        b.total - a.total ||
        a.name.localeCompare(b.name),
    );
}

/** `.../pull/7321` -> `"7321"`; null when the URL is not a pull request. */
export function pullRequestNumber(url: string): string | null {
  return /\/pull\/(\d+)/.exec(url)?.[1] ?? null;
}
