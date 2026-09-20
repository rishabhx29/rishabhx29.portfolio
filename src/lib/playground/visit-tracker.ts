"use client";

/**
 * Page-visit tracking for the visit-based achievements. Runs once per route
 * change on the client; keeps a small set of visited paths in localStorage.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordAchievement } from "./use-achievements";

const VISITED_KEY = "playground.visits.v1";

const MAIN_PAGES = [
  "/",
  "/projects",
  "/experience",
  "/blogs",
  "/resume",
  "/pull-requests",
  "/contact",
];

function readVisited(): Set<string> {
  try {
    const raw = window.localStorage.getItem(VISITED_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return new Set();
  }
}

function writeVisited(paths: Set<string>): void {
  try {
    window.localStorage.setItem(VISITED_KEY, JSON.stringify([...paths]));
  } catch {
    // Ignore.
  }
}

/** Mount once in the root layout. */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Count only the section root: /blogs/slug counts as /blogs.
    const first = pathname?.split("/").filter(Boolean)[0];
    const current = first ? `/${first}` : "/";

    const visited = readVisited();
    const isNew = !visited.has(current);
    if (!isNew) return;

    visited.add(current);
    writeVisited(visited);

    recordAchievement("first-steps");
    if (MAIN_PAGES.every((page) => visited.has(page))) {
      recordAchievement("world-tour");
    }
  }, [pathname]);

  return null;
}
