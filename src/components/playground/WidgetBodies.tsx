"use client";

/**
 * Widget cards rendered inside WorkbenchCard for the link / clock / music
 * object types. Live time and audio live here so the rest of the canvas
 * stays presentational.
 */

import { useEffect, useRef, useState } from "react";
import { Mail, Pause, Play } from "lucide-react";
import { loadBuffer, getAudioContext } from "@/lib/audio";
import type { WorkbenchObject } from "@/data/playgroundAssets";

const MUSIC_TRACK = "/sounds/flying.mp3";

function LinkCardBody({ object }: { object: WorkbenchObject }) {
  const href = object.href ?? "";
  const isGitHub = href.includes("github.com");
  const isLinkedIn = href.includes("linkedin.com");
  const icon =
    isGitHub || isLinkedIn ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        {isGitHub ? (
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
        ) : (
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
        )}
      </svg>
    ) : (
      <Mail className="h-5 w-5" aria-hidden="true" />
    );

  const isInternal = object.href?.startsWith("/");

  return (
    <a
      href={object.href}
      {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className="flex h-full flex-col justify-between p-3 text-zinc-900 dark:text-zinc-100"
    >
      <span className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
          {icon}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[.16em] text-zinc-400">open</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold tracking-tight">{object.title}</span>
        <span className="block truncate text-[10px] text-zinc-500 dark:text-zinc-400">{object.subtitle}</span>
      </span>
    </a>
  );
}

function ClockCardBody() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const prime = window.setTimeout(() => setNow(new Date()), 0);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(prime);
    };
  }, []);

  const hours = now?.getHours().toString().padStart(2, "0") ?? "--";
  const minutes = now?.getMinutes().toString().padStart(2, "0") ?? "--";
  const seconds = now?.getSeconds().toString().padStart(2, "0") ?? "--";

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      <p className="font-mono text-[9px] uppercase tracking-[.18em] text-zinc-400">my desk clock</p>
      <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-100">
        {hours}:{minutes}
        <span className="text-sm text-zinc-400">:{seconds}</span>
      </p>
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((tick) => (
          <span key={tick} className="h-0.5 flex-1 bg-zinc-300 dark:bg-zinc-700" />
        ))}
      </div>
    </div>
  );
}

function MusicCardBody({ object }: { object: WorkbenchObject }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => audioRef.current?.pause(), []);

  function toggle() {
    if (!audioRef.current) {
      audioRef.current = new Audio(MUSIC_TRACK);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }
    // Prime the shared AudioContext so browsers treat this as a user gesture.
    void loadBuffer("/sounds/pop.mp3").then(() => getAudioContext().resume().catch(() => undefined));
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <div className="flex h-full items-center gap-3 p-3">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={playing ? "Pause desk radio" : "Play desk radio"}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-zinc-900 text-zinc-50 transition-transform active:scale-95 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      </button>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{object.title}</span>
        <span className="block truncate text-[10px] text-zinc-500 dark:text-zinc-400">{object.subtitle}</span>
      </span>
      <span className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${playing ? "animate-pulse bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`} aria-hidden="true" />
    </div>
  );
}

export function WidgetBody({ object }: { object: WorkbenchObject }) {
  if (object.type === "link") return <LinkCardBody object={object} />;
  if (object.type === "clock") return <ClockCardBody />;
  if (object.type === "music") return <MusicCardBody object={object} />;
  return null;
}
