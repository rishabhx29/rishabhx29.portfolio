"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Sparkles, Terminal, RotateCw } from "lucide-react";
import Image from "next/image";

const KONAMI_CODE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

export function KonamiEasterEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipCount, setFlipCount] = useState(0);

  // Play retro 8-bit celebratory chime using Web Audio API
  const playCelebrationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * 0.1 + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + (idx + 1) * 0.1 + 0.1);
      });
    } catch {
      // Audio might be blocked by browser policies if not initiated by direct click
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#06b6d4", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981"],
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#06b6d4", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#06b6d4", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981"],
    });
  }, []);

  const triggerAvatarBackflip = useCallback(() => {
    setIsFlipping(true);
    setFlipCount((prev) => prev + 1);
    setTimeout(() => {
      setIsFlipping(false);
    }, 900);
  }, []);

  useEffect(() => {
    let buffer: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      buffer = [...buffer, key].slice(-KONAMI_CODE.length);

      if (buffer.join(",") === KONAMI_CODE.join(",")) {
        buffer = [];
        setIsOpen(true);
        triggerConfetti();
        playCelebrationSound();
        // Trigger initial avatar backflip
        setTimeout(() => {
          triggerAvatarBackflip();
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerConfetti, playCelebrationSound, triggerAvatarBackflip]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          {/* Backdrop click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Glowing Modal Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-zinc-950/95 border border-cyan-500/50 dark:border-cyan-400/50 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden text-zinc-100"
          >
            {/* Background cyber grid effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 -z-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(6,182,212,0.4) 0%, transparent 70%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "100% 100%, 20px 20px, 20px 20px",
              }}
            />

            {/* Top Badge */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-mono tracking-wider animate-pulse">
                <Terminal className="w-3.5 h-3.5" />
                <span>KONAMI CODE DETECTED: LEVEL 99 DEV MODE</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content: Avatar Backflip & Message */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {/* Backflipping Avatar */}
              <div className="relative group cursor-pointer" onClick={triggerAvatarBackflip} title="Click to do another backflip!">
                <motion.div
                  animate={
                    isFlipping
                      ? { rotateX: [0, 360], scale: [1, 1.2, 1] }
                      : { rotateX: 0 }
                  }
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] relative bg-zinc-900 flex-shrink-0"
                >
                  <Image
                    src="/Rishabh-Avatar.jpg"
                    alt="Rishabh Tripathi"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cyan-500 text-black font-bold text-[10px] rounded-full shadow whitespace-nowrap">
                  Backflips: {flipCount}
                </div>
              </div>

              {/* Text info */}
              <div className="text-center sm:text-left">
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center justify-center sm:justify-start gap-2">
                  <span>Secret Frequency Unlocked!</span>
                  <Sparkles className="w-5 h-5 text-cyan-400 inline" />
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  You typed the legendary <code className="text-cyan-300 font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">↑↑↓↓←→←→BA</code> sequence. Only true hackers know the old ways!
                </p>
              </div>
            </div>

            {/* Fun Developer Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-center">
                <div className="text-zinc-400 mb-1">⚡ Coffee-to-Code</div>
                <div className="text-cyan-400 font-bold text-sm">99.8% Efficiency</div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-center">
                <div className="text-zinc-400 mb-1">🛡️ Bug Squashing</div>
                <div className="text-purple-400 font-bold text-sm">God Mode Active</div>
              </div>
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-center">
                <div className="text-zinc-400 mb-1">🚀 Current Vibe</div>
                <div className="text-pink-400 font-bold text-sm">Building Future</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
              <button
                onClick={triggerAvatarBackflip}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl transition-all cursor-pointer border border-zinc-700"
              >
                <RotateCw className="w-4 h-4 text-cyan-400" />
                <span>Do a Backflip 🤸</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={triggerConfetti}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confetti Blast 🎉</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
