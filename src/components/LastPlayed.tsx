"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music2 } from "lucide-react";

/**
 * "Last played" chip for the song section.
 *
 * Replaces a hardcoded track with whatever Spotify actually reports — playing
 * right now if one is, otherwise the most recently played. Hides itself
 * entirely when the integration is not configured, so the header never renders
 * a dead or placeholder chip.
 */

type SpotifyState = {
  ok: boolean;
  reason?: string;
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  album?: string;
  image?: string;
  url?: string;
};

export function LastPlayed() {
  const [data, setData] = useState<SpotifyState | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/spotify", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setData(d as SpotifyState);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!data || !data.ok || !data.title) return null;

  const albumTag = data.album ? ` (${data.album})` : "";
  const ariaLabel = `${data.isPlaying ? "Now playing" : "Last played"} ${data.title} by ${data.artist} on Spotify`;

  return (
    <a
      href={data.url || "https://open.spotify.com"}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      title={`${data.title} — ${data.artist}${albumTag}`}
      className="group relative flex h-11 items-center gap-2.5 rounded-full border border-black/10 bg-white/90 px-3 text-left shadow-sm shadow-black/10 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[1px] hover:border-black/25 hover:bg-white hover:shadow-md active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:border-white/10 dark:bg-[#171717]/90 dark:shadow-black/60 dark:hover:border-white/25 dark:hover:bg-[#1e1e1e] dark:focus-visible:outline-zinc-50 sm:h-9"
    >
      {data.image ? (
        <Image
          src={data.image}
          alt=""
          width={24}
          height={24}
          unoptimized
          className="h-6 w-6 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      )}

      <span className="flex min-w-0 items-baseline gap-1.5 pr-0.5">
        <span className="truncate font-mono text-[12px] font-semibold tracking-[0.08em] text-zinc-700 dark:text-zinc-300 sm:text-[11px]">
          {data.title}
        </span>
        <span className="hidden font-mono text-[11px] text-zinc-400 dark:text-zinc-500 sm:inline">
          — {data.artist}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
        <span
          className={`h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 ${
            data.isPlaying ? "animate-pulse" : "opacity-60"
          }`}
          aria-hidden="true"
        />
        {data.isPlaying ? "NOW PLAYING" : "LAST PLAYED"}
      </span>
    </a>
  );
}
