"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION_KEY = "profile-view-id";

type CountState = { ok: true; count: number } | { ok: false; count: null };

export function ProfileViews() {
  const [views, setViews] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    // One browser tab counts once per day; Redis also deduplicates repeated
    // requests from React Strict Mode, navigation, and network retries.
    let visitorId = crypto.randomUUID();
    try {
      visitorId = sessionStorage.getItem(SESSION_KEY) ?? visitorId;
      sessionStorage.setItem(SESSION_KEY, visitorId);
    } catch {
      // Private browsing may block storage; the counter can still be read.
    }

    fetch("/api/profile-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
      cache: "no-store",
    })
      .then((response) => response.json() as Promise<CountState>)
      .then((data) => {
        if (active && data.ok && Number.isSafeInteger(data.count)) setViews(data.count);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-label="Profile views" className="mt-6 flex items-center gap-2 text-[12px] text-zinc-600 dark:text-zinc-400">
      <Eye className="size-4" aria-hidden="true" />
      <span>Profile views</span>
      <span
        aria-live="polite"
        title={loaded && views === null ? "View count is unavailable until the persistent store is connected" : undefined}
        className="font-mono font-semibold tabular-nums text-zinc-800 dark:text-zinc-200"
      >
        {views === null ? (loaded ? "—" : "…") : views.toLocaleString("en-US")}
        {views === null ? <span className="sr-only">{loaded ? "View count unavailable" : "Loading view count"}</span> : null}
      </span>
    </section>
  );
}
