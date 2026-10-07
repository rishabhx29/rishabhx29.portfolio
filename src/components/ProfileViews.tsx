"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type CountState = { ok: true; count: number } | { ok: false; count: null };

export function ProfileViews() {
  const [views, setViews] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    // The browser only reads the aggregate. Vercel's Analytics script records
    // visits independently; this request never increments a custom counter.
    fetch("/api/profile-views")
      .then((response) => response.ok ? response.json() as Promise<CountState> : null)
      .then((data) => {
        if (active && data?.ok && Number.isSafeInteger(data.count)) setViews(data.count);
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
        title={loaded && views === null ? "Vercel Web Analytics count is unavailable" : undefined}
        className="font-mono font-semibold tabular-nums text-zinc-800 dark:text-zinc-200"
      >
        {views === null ? (loaded ? "—" : "…") : views.toLocaleString("en-US")}
        {views === null ? <span className="sr-only">{loaded ? "View count unavailable" : "Loading view count"}</span> : null}
      </span>
    </section>
  );
}
