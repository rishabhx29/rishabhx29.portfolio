"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LastPlayed } from "@/components/LastPlayed";
import { CurrentTime } from "@/components/CurrentTime";
import { FooterBackground } from "@/components/FooterBackground";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PullRequestsPage() {
  return (
    <div className="min-h-screen w-full bg-[#fbfaf9] dark:bg-[var(--page-bg)] relative overflow-x-hidden transition-colors duration-300">

      {/* Cell 1: Dot Matrix Background */}
      <div className="absolute left-0 right-0 md:left-[27%] md:right-[27%] top-0 h-[var(--banner-h)] -z-0 pointer-events-auto">
        <FooterBackground />
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <CurrentTime />
        </div>
      </div>

      {/* Cell 2: Header with Back Button + Title + Controls */}
      <div className="absolute left-0 right-0 md:left-[27%] md:right-[27%] top-[var(--banner-h)] h-[var(--profile-h)] flex items-center px-4 z-50">
        <div className="flex w-full items-center justify-between">
          {/* Left: Back + Title */}
          <div className="flex items-center gap-5">
            <Link
              href="/"
              aria-label="Back to home"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                Pull Requests
              </h1>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                Open Source Contributions
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1 max-md:hidden">
            <LastPlayed />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <motion.main
        id="main-content"
        initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="ml-0 mr-0 md:ml-[27%] md:mr-[27%] pt-[var(--content-offset)] pb-16 px-4 flex flex-col z-10 relative"
      >
        <div className="mt-4">
          <OpenSourceContributions isFullPage />
        </div>
        
        {/* Bottom Separator */}
        <div className="relative mt-8">
        </div>
      </motion.main>
    </div>
  );
}
