"use client";

import React, { useRef, useEffect } from "react";

export function FooterBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const gradient = `radial-gradient(250px circle at ${x}px ${y}px, black, transparent)`;
        spotlight.style.maskImage = gradient;
        spotlight.style.webkitMaskImage = gradient;
      });
    };

    const handleMouseEnter = () => {
      spotlight.style.opacity = "0.25";
    };

    const handleMouseLeave = () => {
      spotlight.style.opacity = "0";
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      {/* Base dots that fade out */}
      <div
        className="absolute inset-0 w-full h-full text-zinc-400 dark:text-zinc-500 opacity-20 dark:opacity-[0.1] pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      />

      {/* Interactive hover spotlight that reveals more opaque dots without triggering React renders */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 w-full h-full text-zinc-500 dark:text-zinc-400 pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundPosition: "center",
          opacity: 0,
        }}
      />
    </div>
  );
}
