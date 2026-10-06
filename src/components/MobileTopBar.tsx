"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Consistent fixed mobile top bar on every page: site wordmark (distinct
 * display font) on the left, theme toggle on the right. These are the only
 * places THEME TOGGLE renders on phones (the song chip lives in the hero).
 */
export function MobileTopBar() {
  return (
    <header
      style={{ zIndex: 40, position: "fixed", top: 0, left: 0, right: 0 }}
      className="md:hidden flex h-14 items-center justify-between gap-4 border-b border-black/5 bg-[#fbfaf9]/80 px-4 backdrop-blur-md dark:border-white/[0.08] dark:bg-[var(--page-bg)]/80"
    >
      <Link
        href="/"
        style={{ fontFamily: "var(--font-doto), monospace" }}
        className="text-[15px] tracking-tight text-zinc-900 dark:text-zinc-100"
        aria-label="Home"
      >
        Rishabh Tripathi
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}