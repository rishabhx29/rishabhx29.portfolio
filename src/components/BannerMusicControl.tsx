"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";

const flyingTrack = "/sounds/Tom%20Odell%20-%20Flying%20%20%29%29.mp3";

export function BannerMusicControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      audio.volume = 0.55;
      await audio.play();
    } catch {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const actionLabel = hasError
    ? "Audio unavailable"
    : isPlaying
      ? "Pause"
      : "Play";

  return (
    <>
      <audio
        ref={audioRef}
        src={flyingTrack}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      <button
        type="button"
        onClick={togglePlayback}
        disabled={hasError}
        aria-pressed={isPlaying}
        aria-label={`${actionLabel} background music`}
        title={`${actionLabel} background music`}
        className="group relative flex h-9 items-center gap-2.5 rounded-full border border-black/10 bg-white/90 px-3 text-left text-zinc-950 shadow-sm shadow-black/10 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[1px] hover:border-black/25 hover:bg-white hover:shadow-md active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#09090b]/85 dark:text-zinc-50 dark:shadow-black/60 dark:hover:border-white/25 dark:hover:bg-[#121214] dark:focus-visible:outline-zinc-50"
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/5 text-zinc-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 group-hover:bg-black/10 group-hover:text-zinc-950 dark:bg-white/10 dark:text-zinc-300 dark:group-hover:bg-white/15 dark:group-hover:text-white"
          aria-hidden="true"
        >
          {isPlaying ? (
            <span className="flex h-3 items-center gap-[2px]">
              {[0, 1, 2].map((bar) => (
                <span
                  key={bar}
                  className="banner-music-level h-full w-[2px] rounded-full bg-cyan-500 dark:bg-cyan-400"
                  style={{ animationDelay: `${bar * 110}ms` }}
                />
              ))}
            </span>
          ) : (
            <Play
              className="h-3 w-3 fill-current ml-[1px] transition-transform duration-300 group-hover:scale-110"
              strokeWidth={2.5}
            />
          )}
        </span>

        <span className="flex min-w-0 items-center pr-0.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-zinc-600 transition-colors group-hover:text-zinc-950 dark:text-zinc-400 dark:group-hover:text-zinc-50">
          {hasError ? "UNAVAILABLE" : isPlaying ? "PLAYING" : "PLAY"}
        </span>
      </button>
    </>
  );
}
