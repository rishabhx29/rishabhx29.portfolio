"use client";

import React from "react";
import Link from "next/link";
import { Boxes, ArrowRight, Sparkles } from "lucide-react";
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

      {/* Teaser Glass Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        className="w-full p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-zinc-950/90 border border-cyan-500/30 dark:border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden group"
      >
        {/* Background dotted blueprint effect inside card */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
          style={{
            backgroundImage: `radial-gradient(circle, #06b6d4 1.5px, transparent 1.5px)`,
            backgroundSize: `20px 20px`,
          }}
        />

        {/* Ambient neon glow */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-500" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Boxes className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
                <span>Interactive Feature</span>
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              Blueprint Canvas & Sandbox
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Step into an open interactive CAD workspace. Drag around my achievements, badges, and tech tokens, annotate with drawing tools, leave sticky notes, and export high-res snapshots.
            </p>
          </div>

          <Link
            href="/playground"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all group/btn active:scale-95"
          >
            <span>Launch Playground</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
