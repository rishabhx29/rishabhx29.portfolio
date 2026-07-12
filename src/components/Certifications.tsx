"use client";

import Image from "next/image";

export function Certifications() {
  return (
    <div className="relative mt-4 overflow-hidden w-full pb-4">
      <div className="flex gap-4 w-full">
        <div className="group w-full max-w-[260px] flex-shrink-0 flex flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#09090b] border border-black/30 dark:border-white/[0.15] transition-colors duration-200 cursor-default">
          <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800/40 p-2 flex items-center justify-center overflow-hidden">
            <Image
              src="/Gssoc-badge.png"
              alt="GSSoC Badge"
              width={260}
              height={146}
              className="w-auto h-full max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
          <div className="h-px bg-black/30 dark:bg-white/[0.15]" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="flex items-start justify-between gap-2 px-3 py-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 dark:text-zinc-500">
                GSSoC 2024
              </span>
              <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                GirlScript Summer of Code Contributor
              </p>
            </div>
          </div>
        </div>

        <div className="group w-full max-w-[260px] flex-shrink-0 flex flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#09090b] border border-black/30 dark:border-white/[0.15] transition-colors duration-200 cursor-default">
          <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800/40 p-2 flex items-center justify-center overflow-hidden">
            <Image
              src="/ssoc-badge.png"
              alt="SSoC Badge"
              width={260}
              height={146}
              className="w-auto h-full max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
          <div className="h-px bg-black/30 dark:bg-white/[0.15]" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="flex items-start justify-between gap-2 px-3 py-2.5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 dark:text-zinc-500">
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
