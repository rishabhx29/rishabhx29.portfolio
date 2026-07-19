"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const BannerParticles = dynamic(
  () => import("@/components/BannerParticles").then((module) => module.BannerParticles),
  { ssr: false }
);

const GithubGraph = dynamic(
  () => import("@/components/GithubGraph").then((module) => module.GithubGraph),
  { ssr: false }
);

const RishabhParticles = dynamic(
  () => import("@/components/RishabhParticles").then((module) => module.RishabhParticles),
  { ssr: false }
);

function useViewportLoad(rootMargin = "240px") {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, shouldLoad };
}

export function DeferredBannerParticles() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setShouldLoad(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return shouldLoad ? <BannerParticles /> : null;
}

export function DeferredGithubGraph() {
  const { ref, shouldLoad } = useViewportLoad();

  return (
    <div ref={ref} className="min-h-[260px]">
      {shouldLoad ? <GithubGraph /> : <GithubGraphFallback />}
    </div>
  );
}

export function DeferredRishabhParticles() {
  const { ref, shouldLoad } = useViewportLoad("160px");

  return <div ref={ref} className="h-full w-full">{shouldLoad ? <RishabhParticles /> : null}</div>;
}

function GithubGraphFallback() {
  return (
    <section className="relative z-10 mt-6 min-h-[236px] border-y border-black/20 py-4 dark:border-white/[.12]" aria-label="GitHub activity loading area">
      <div className="h-5 w-32 bg-zinc-200/70 dark:bg-zinc-800/70" />
      <div className="mt-7 grid grid-cols-[repeat(26,minmax(0,1fr))] gap-1" aria-hidden="true">
        {Array.from({ length: 130 }, (_, index) => (
          <span key={index} className="aspect-square bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
    </section>
  );
}
