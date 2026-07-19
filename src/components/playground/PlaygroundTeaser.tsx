"use client";

import React from "react";
import Link from "next/link";
import { Boxes, ArrowRight, MoveDiagonal2 } from "lucide-react";
import { motion } from "framer-motion";

export function PlaygroundTeaser() {
  return (
    <div className="w-full mt-12 pt-4 pb-4 relative">
      {/* Top horizontal divider line */}
      <div
        className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="group relative w-full overflow-hidden border border-black/30 bg-zinc-50 p-6 shadow-[0_18px_40px_rgba(24,24,27,.09)] dark:border-white/[.15] dark:bg-[#09090b] sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(113,113,122,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(113,113,122,.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 border border-zinc-300 bg-zinc-100/70 transition-transform duration-500 group-hover:rotate-6 dark:border-zinc-700 dark:bg-zinc-900/70" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
          <div className="flex max-w-xl flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center border border-black/15 bg-zinc-900 text-zinc-100 dark:border-white/15 dark:bg-zinc-100 dark:text-zinc-900">
                <Boxes className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] font-semibold tracking-[.16em] text-zinc-500">INTERACTIVE FIELD / 01</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Rearrange the evidence.
            </h3>

            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-sm">
              A living field notebook of shipped work, small artifacts, and things that rarely fit inside a conventional portfolio card.
            </p>
          </div>

          <Link
            href="/playground"
            className="group/btn flex shrink-0 items-center gap-2 border border-zinc-900 bg-zinc-900 px-5 py-3 text-xs font-semibold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-zinc-700 active:translate-y-0 active:scale-[.98] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 sm:text-sm"
          >
            <span>Launch Playground</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
        <div className="relative z-10 mt-6 flex items-center gap-2 border-t border-black/10 pt-3 font-mono text-[9px] tracking-[.13em] text-zinc-400 dark:border-white/10"><MoveDiagonal2 className="h-3.5 w-3.5" /> DRAG · DRAW · RECOMPOSE · EXPORT</div>
      </motion.div>
    </div>
  );
}
