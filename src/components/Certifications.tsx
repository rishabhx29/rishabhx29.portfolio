"use client";

import Image from "next/image";

export function Certifications() {
  return (
    <div className="relative mt-4 overflow-hidden w-full pb-4">
      <div className="flex gap-4 w-full">
        <div className="group w-full max-w-[260px] flex-shrink-0 flex flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#171717] border border-black/20 dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/[0.16] transition-colors duration-200 cursor-default">
          <div className="relative w-full aspect-video bg-zinc-100 dark:bg-[#100f0f]/60 p-2 flex items-center justify-center overflow-hidden">
            <div className="relative h-full aspect-square">
              <Image
                src="/Gssoc-badge.png"
                alt="Rishabh Tripathi — GirlScript Summer of Code 2024 Contributor Badge"
                fill
                sizes="146px"
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <div className="h-px bg-black/30 dark:bg-white/[0.15]" aria-hidden="true" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="flex items-start justify-between gap-2 px-3 py-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-600 dark:text-zinc-400">
                GSSoC 2024
              </span>
              <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                GirlScript Summer of Code Contributor
              </p>
            </div>
          </div>
        </div>

        <div className="group w-full max-w-[260px] flex-shrink-0 flex flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#171717] border border-black/20 dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/[0.16] transition-colors duration-200 cursor-default">
          <div className="relative w-full aspect-video bg-zinc-100 dark:bg-[#100f0f]/60 p-2 flex items-center justify-center overflow-hidden">
            <div className="relative h-full aspect-square">
              <Image
                src="/ssoc-badge.png"
                alt="Rishabh Tripathi — Social Summer of Code 2024 Project Admin & Contributor Badge"
                fill
                sizes="146px"
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <div className="h-px bg-black/30 dark:bg-white/[0.15]" aria-hidden="true" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="flex items-start justify-between gap-2 px-3 py-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-600 dark:text-zinc-400">
                SSoC 2024
              </span>
              <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                Social Summer of Code Contributor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
