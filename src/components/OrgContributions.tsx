"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  groupContributions,
  pullRequestNumber,
  type ContributionStatus,
} from "@/lib/contributions";
import { OrganizationMark } from "./OrganizationMark";
import { StatusCounts } from "./StatusCounts";
import { usePullRequests } from "./use-pull-requests";

const STATUS_DOT: Record<ContributionStatus, string> = {
  merged: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]",
  open: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  closed: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function activityDate(pr: { mergedAt?: string; closedAt?: string; createdAt: string }): string {
  return pr.mergedAt || pr.closedAt || pr.createdAt;
}

/**
 * Detail view for every organization the profile owner contributed to.
 * Each organization expands into its pull requests; `?org=<owner>` opens and
 * scrolls to that organization, which is how the homepage rows link in.
 */
export function OrgContributions() {
  const { prsByType, isLoaded } = usePullRequests();
  const orgs = useMemo(() => groupContributions(prsByType), [prsByType]);
  const [openOrg, setOpenOrg] = useState<string | null>(null);
  const deepLinkApplied = useRef(false);

  const totals = useMemo(
    () =>
      orgs.reduce(
        (acc, org) => ({
          merged: acc.merged + org.counts.merged,
          open: acc.open + org.counts.open,
          closed: acc.closed + org.counts.closed,
        }),
        { merged: 0, open: 0, closed: 0 } as Record<ContributionStatus, number>,
      ),
    [orgs],
  );

  useEffect(() => {
    if (deepLinkApplied.current || orgs.length === 0) return;

    const requested = new URLSearchParams(window.location.search).get("org");
    if (!requested) {
      deepLinkApplied.current = true;
      return;
    }

    const index = orgs.findIndex(
      (org) => org.name.toLowerCase() === requested.toLowerCase(),
    );
    if (index === -1) return;

    deepLinkApplied.current = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const name = orgs[index].name;

    window.requestAnimationFrame(() => {
      setOpenOrg(name);
      document
        .getElementById(`org-${index}`)
        ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  }, [orgs]);

  if (!isLoaded && orgs.length === 0) {
    return (
      <div aria-busy="true" className="w-full flex flex-col">
        <span className="sr-only">Loading contributions</span>
        <div aria-hidden="true" className="flex flex-col">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 py-4 px-4 -mx-4">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="h-4 w-1/3 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orgs.length === 0) {
    return (
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
        No contributions to show right now.{" "}
        <a
          href="https://github.com/rishabhx29"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          View the profile on GitHub
        </a>
        .
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pb-3 text-[12px] text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {orgs.length} organizations
        </span>
        <StatusCounts counts={totals} />
      </div>

      <div className="flex flex-col border-t border-black/[0.06] divide-y divide-black/[0.06] dark:border-white/[0.07] dark:divide-white/[0.07]">
        {orgs.map((org, index) => {
          const isOpen = openOrg === org.name;
          const triggerId = `org-trigger-${index}`;
          const panelId = `org-panel-${index}`;

          return (
            <section key={org.name} id={`org-${index}`} className="scroll-mt-28">
              <h2>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenOrg(isOpen ? null : org.name)}
                  className="group flex w-full items-center gap-3 py-4 px-4 -mx-4 text-left rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                >
                  <OrganizationMark name={org.name} size="md" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="truncate text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                        {org.name}
                      </span>
                      <span className="shrink-0 text-[12px] tabular-nums text-zinc-400 dark:text-zinc-500">
                        {org.total} PR{org.total === 1 ? "" : "s"}
                      </span>
                    </span>
                    <StatusCounts
                      counts={org.counts}
                      className="text-[12px] text-zinc-500 dark:text-zinc-400"
                    />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ease-out motion-reduce:transition-none dark:text-zinc-500 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </h2>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                inert={!isOpen}
                className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`px-4 sm:pl-[64px] ${isOpen ? "pb-4 opacity-100" : "pb-0 opacity-0"} transition-[opacity,padding] duration-300 motion-reduce:transition-none`}
                  >
                    <ul className="flex flex-col">
                      {org.pullRequests.map((pr) => {
                        const number = pullRequestNumber(pr.url);
                        const date = activityDate(pr);

                        return (
                          <li
                            key={pr.id}
                            className="flex items-start gap-2.5 py-2.5 first:pt-1 last:pb-1"
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[pr.status]}`}
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                              <a
                                href={pr.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link inline-flex items-start gap-1.5 text-[13px] font-medium leading-snug text-zinc-800 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-200 dark:hover:text-white dark:focus-visible:ring-zinc-600 rounded-sm"
                              >
                                <span className="line-clamp-2">{pr.title}</span>
                                <span className="sr-only"> (opens on GitHub in a new tab)</span>
                                <svg
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="mt-[3px] h-3 w-3 shrink-0 text-zinc-400 opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 group-focus-visible/link:opacity-100 motion-reduce:transition-none dark:text-zinc-500"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <line x1="7" y1="17" x2="17" y2="7" />
                                  <polyline points="7 7 17 7 17 17" />
                                </svg>
                              </a>
                              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                <span className="capitalize">{pr.status}</span>
                                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                                  ·
                                </span>
                                <span className="truncate">{pr.repository.nameWithOwner}</span>
                                {number && (
                                  <>
                                    <span className="tabular-nums">#{number}</span>
                                    <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
                                      ·
                                    </span>
                                  </>
                                )}
                                <time dateTime={date}>{DATE.format(new Date(date))}</time>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
