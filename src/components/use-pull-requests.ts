"use client";

/**
 * Loads the profile owner's pull requests for all three filters once per
 * mount, with the previous payload cached in localStorage so a repeat visit
 * paints immediately.
 *
 * `fetchPullRequests` resolves `null` when GitHub is unreachable or
 * unconfigured; the hook still marks that filter loaded so the UI can settle
 * on its empty state instead of spinning forever. Cached entries pass through
 * `isExcludedPullRequest` too, because caches written before a filter change
 * would otherwise keep showing the hidden entries.
 */

import { useEffect, useState } from "react";
import {
  fetchPullRequests,
  isExcludedPullRequest,
  type PRFilterType,
  type PullRequest,
} from "@/lib/github";

export type PullRequestsByType = Partial<Record<PRFilterType, PullRequest[]>>;

const TYPES: PRFilterType[] = ["merged", "open", "closed"];

function cacheKey(type: PRFilterType): string {
  // v2: entries carry repository.stargazerCount, which the org filter needs.
  return `github_prs_v2_${type}`;
}

function readCache(type: PRFilterType): PullRequest[] | null {
  try {
    const raw = window.localStorage.getItem(cacheKey(type));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return (parsed as PullRequest[]).filter((pr) => !isExcludedPullRequest(pr));
  } catch {
    return null;
  }
}

export interface PullRequestsState {
  prsByType: PullRequestsByType;
  isLoaded: boolean;
}

export function usePullRequests(): PullRequestsState {
  const [prsByType, setPrsByType] = useState<PullRequestsByType>({});
  const [loadedTypes, setLoadedTypes] = useState<Set<PRFilterType>>(new Set());

  useEffect(() => {
    let cancelled = false;

    TYPES.forEach((type) => {
      const cached = readCache(type);
      if (cached) {
        setPrsByType((prev) => ({ ...prev, [type]: cached }));
        setLoadedTypes((prev) => new Set(prev).add(type));
      }
    });

    TYPES.forEach((type) => {
      void fetchPullRequests(type).then((fresh) => {
        if (cancelled) return;

        if (fresh) {
          setPrsByType((prev) => ({ ...prev, [type]: fresh }));
          try {
            window.localStorage.setItem(cacheKey(type), JSON.stringify(fresh));
          } catch {
            // Storage full or blocked. The fresh data still renders.
          }
        }

        setLoadedTypes((prev) => {
          if (prev.has(type)) return prev;
          const next = new Set(prev);
          next.add(type);
          return next;
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { prsByType, isLoaded: loadedTypes.size === TYPES.length };
}
