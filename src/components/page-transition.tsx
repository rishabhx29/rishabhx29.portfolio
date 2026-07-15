"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { KonamiEasterEgg } from "@/components/konami-easter-egg";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = React.useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <KonamiEasterEgg />
      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
        animate={{
          opacity: 1,
          y: 0,
          filter: isAnimating ? "blur(0px)" : "none",
        }}
        exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          filter: isAnimating ? undefined : "none",
          transform: isAnimating ? undefined : "none",
        }}
        className="flex flex-col min-h-screen w-full relative"
      >
        {/* Animated Blueprint Drawing Grid Lines on Route Navigation */}
        <div className="absolute inset-0 pointer-events-none z-30 hidden md:block overflow-hidden">
          {/* Left Vertical Drawing Line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.8, times: [0, 0.4, 1], ease: "easeInOut", delay: 0.05 }}
            className="absolute top-0 bottom-0 left-[30%] w-[1px] border-r border-black/40 dark:border-white/30"
            style={{
              transformOrigin: "top",
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          {/* Right Vertical Drawing Line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.8, times: [0, 0.4, 1], ease: "easeInOut", delay: 0.1 }}
            className="absolute top-0 bottom-0 right-[30%] w-[1px] border-r border-black/40 dark:border-white/30"
            style={{
              transformOrigin: "top",
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          {/* Top Horizontal Drawing Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.75, times: [0, 0.4, 1], ease: "easeInOut", delay: 0.15 }}
            className="absolute left-0 right-0 top-[22vh] h-[1px] border-b border-black/40 dark:border-white/30"
            style={{
              transformOrigin: "left",
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          {/* Bottom Header Horizontal Drawing Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.75, times: [0, 0.4, 1], ease: "easeInOut", delay: 0.2 }}
            className="absolute left-0 right-0 top-[calc(22vh+112px)] h-[1px] border-b border-black/40 dark:border-white/30"
            style={{
              transformOrigin: "right",
              maskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />
          {/* Intersection Pulsing Nodes */}
          {[
            { top: "22vh", left: "30%" },
            { top: "22vh", right: "30%" },
            { top: "calc(22vh + 112px)", left: "30%" },
            { top: "calc(22vh + 112px)", right: "30%" },
          ].map((pos, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 0], opacity: [0, 0.6, 0] }}
              transition={{
                duration: 0.65,
                times: [0, 0.5, 1],
                delay: 0.2 + idx * 0.05,
                ease: "easeOut",
              }}
              className="absolute w-[3px] h-[3px] bg-black dark:bg-white rounded-full pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                transform: `translate(${pos.right ? "50%" : "-50%"}, -50%)`,
              }}
            />
          ))}
        </div>

        {children}
      </motion.div>
    </AnimatePresence>
    </>
  );
}
