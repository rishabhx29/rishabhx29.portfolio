"use client";

import Link from "next/link";

import { groupContributions } from "@/lib/contributions";
import { OrganizationMark } from "./OrganizationMark";
import { StatusCounts } from "./StatusCounts";
import { usePullRequests } from "./use-pull-requests";

const VISIBLE_ORGS = 5;

/**
 * Homepage open-source section. One row per organization instead of a flat
 * pull request list; a row opens the detail page with that org expanded.
 */
export function OpenSourceOrgs() {
  const { prsByType, isLoaded } = usePullRequests();
  const orgs = groupContributions(prsByType);
  const visibleOrgs = orgs.slice(0, VISIBLE_ORGS);

  return (
    <div className="w-full flex flex-col">
      <div className="py-2 relative">
        <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Open Source Contributions
        </h2>
      </div>

      <div className="relative pt-0 pb-2">
        {!isLoaded && orgs.length === 0 ? (
          <div aria-busy="true">
            <span className="sr-only">Loading contributions</span>
            <div aria-hidden="true" className="flex flex-col">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3.5 px-4 -mx-4">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="h-3.5 w-1/3 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                    <div className="h-3 w-1/2 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : orgs.length > 0 ? (
          <>
            <div className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.07]">
              {visibleOrgs.map((org) => (
                <Link
                  key={org.name}
                  href={`/pull-requests?org=${encodeURIComponent(org.name)}`}
                  prefetch={false}
                  aria-label={`View pull requests for ${org.name}`}
                  className="group relative flex items-center gap-3 py-3.5 px-4 -mx-4 rounded-lg transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                >
                  <OrganizationMark name={org.name} />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                      {org.name}
                    </span>
                    <StatusCounts
                      counts={org.counts}
                      className="text-[12px] text-zinc-500 dark:text-zinc-400"
                    />
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none dark:text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-4 relative z-20">
              <Link
                href="/pull-requests"
                prefetch={false}
                aria-label="View every organization and pull request"
                className="relative group block"
              >
                <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#171717] dark:hover:bg-[#1e1e1e] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                  All {orgs.length} organizations
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <p className="py-4 text-[13px] text-zinc-500 dark:text-zinc-400">
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
        )}
      </div>
    </div>
  );
}
