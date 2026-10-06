"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PHOTOS = ["/Rishabh-Avatar.jpg", "/Rishabh-photo.jpg"] as const;

/**
 * Profile picture as a rounded square with an outline. Clicking it pops the
 * frame down and swaps in the other photo, then springs back up. Colourful
 * by default - the old grayscale treatment was removed.
 */
export function ProfileAvatar({
  alt,
  priority = false,
  sizes,
}: {
  readonly alt: string;
  readonly priority?: boolean;
  readonly sizes?: string;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "shrink">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const toggle = () => {
    if (phase === "shrink") return;
    setPhase("shrink");
    timer.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % PHOTOS.length);
      setPhase("idle");
    }, 200);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch profile photo"
      aria-pressed={index === 1}
      className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[26%] border-2 border-zinc-300/90 outline outline-1 outline-offset-2 outline-black/10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.06] active:scale-[0.94] dark:border-zinc-700/90 dark:outline-white/15 data-[phase=shrink]:scale-[0.7] data-[phase=shrink]:rotate-[-4deg]"
      data-phase={phase}
    >
      <Image
        src={PHOTOS[index]}
        alt={alt}
        width={240}
        height={240}
        quality={85}
        priority={priority}
        sizes={sizes}
        className="h-full w-full object-cover"
      />
    </button>
  );
}
