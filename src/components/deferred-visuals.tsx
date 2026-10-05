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

/**
 * Particle field behind the banner.
 *
 * This used to start on a fixed 1200ms timer, which on a throttled phone lands
 * squarely in the LCP window: the hero banner is the largest element on the
 * page, so anything that mounts alongside it competes with the paint that
 * Lighthouse is waiting for. Yielding to idle instead keeps the effect and gets
 * it out of the way. The timeout is only a backstop for browsers with no
 * requestIdleCallback.
 */
export function DeferredBannerParticles() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const handle = win.requestIdleCallback(() => setShouldLoad(true), { timeout: 2500 });
      return () => {
        if (win.cancelIdleCallback) win.cancelIdleCallback(handle);
      };
    }

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

/**
 * The three.js particle field behind the certifications card.
 *
 * That card is `max-md:hidden`, but a CSS-hidden element still satisfies
 * IntersectionObserver, so the viewport gate alone used to mount a WebGL
 * renderer — and pull the 514 KB three.js chunk — on phones, where nothing was
 * ever visible. Gating on the breakpoint as well means the chunk is never
 * requested on mobile.
 */
export function DeferredRishabhParticles() {
  const { ref, shouldLoad } = useViewportLoad("160px");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {isDesktop && shouldLoad ? <RishabhParticles /> : null}
    </div>
  );
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
