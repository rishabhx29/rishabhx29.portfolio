"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutGrid, Sparkles, ChevronDown, Award, Image as ImageIcon, Cpu, FileText } from "lucide-react";

interface PlaygroundDockProps {
  onSpawnAsset: (type: "image" | "badge" | "tech" | "sticky", presetId?: string) => void;
  onSelectLayout: (templateKey: string) => void;
  currentLayout: string;
}

export function PlaygroundDock({
  onSpawnAsset,
  onSelectLayout,
  currentLayout,
}: PlaygroundDockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"assets" | "templates">("templates");

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl backdrop-blur-xl text-zinc-200 hover:text-white hover:border-cyan-500/50 transition-all font-medium text-xs sm:text-sm"
      >
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span>Canvas Assets & Templates</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mt-3 w-80 p-4 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl backdrop-blur-2xl flex flex-col gap-4"
          >
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
              <button
                onClick={() => setActiveTab("templates")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "templates"
                    ? "bg-zinc-800 text-cyan-400 shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Preset Layouts</span>
              </button>
              <button
                onClick={() => setActiveTab("assets")}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "assets"
                    ? "bg-zinc-800 text-cyan-400 shadow"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Spawn Assets</span>
              </button>
            </div>

            {/* Templates Panel */}
            {activeTab === "templates" && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-bold">
                  Select a Blueprint Template
                </span>

                <button
                  onClick={() => {
                    onSelectLayout("chaos");
                    setIsOpen(false);
                  }}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    currentLayout === "chaos"
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300"
                      : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>🎲 Free-Form Chaos</span>
                    {currentLayout === "chaos" && <span className="text-[9px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Active</span>}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">Scattered engineering layout ready for dragging and drawing.</p>
                </button>

                <button
                  onClick={() => {
                    onSelectLayout("roadmap");
                    setIsOpen(false);
                  }}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    currentLayout === "roadmap"
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300"
                      : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>🏆 Achievement Roadmap</span>
                    {currentLayout === "roadmap" && <span className="text-[9px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Active</span>}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">Clean grid rows organizing milestones chronologically.</p>
                </button>

                <button
                  onClick={() => {
                    onSelectLayout("tech");
                    setIsOpen(false);
                  }}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                    currentLayout === "tech"
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300"
                      : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>⚙️ Tech Stack Cluster</span>
                    {currentLayout === "tech" && <span className="text-[9px] bg-cyan-500/20 px-1.5 py-0.5 rounded">Active</span>}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">Groups core systems, frameworks, and badges around architecture.</p>
                </button>
              </div>
            )}

            {/* Assets Panel */}
            {activeTab === "assets" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSpawnAsset("sticky");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-purple-300 transition-all gap-2 text-center"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs font-bold">Sticky Note</span>
                </button>

                <button
                  onClick={() => {
                    onSpawnAsset("badge", "badge-gssoc");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-300 transition-all gap-2 text-center"
                >
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold">GSSoC Badge</span>
                </button>

                <button
                  onClick={() => {
                    onSpawnAsset("tech", "tech-next");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-300 transition-all gap-2 text-center"
                >
                  <Cpu className="w-5 h-5" />
                  <span className="text-xs font-bold">Tech Token</span>
                </button>

                <button
                  onClick={() => {
                    onSpawnAsset("image", "avatar-main");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-950/20 text-blue-300 transition-all gap-2 text-center"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-xs font-bold">Profile Card</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
