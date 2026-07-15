"use client";

import React from "react";
import {
  Hand,
  PenTool,
  ArrowUpRight,
  Highlighter,
  StickyNote as NoteIcon,
  Trash2,
  Download,
  RotateCcw,
} from "lucide-react";

interface PlaygroundToolbarProps {
  activeTool: "select" | "pen" | "arrow" | "highlighter" | "sticky";
  onSelectTool: (tool: "select" | "pen" | "arrow" | "highlighter" | "sticky") => void;
  onClearAnnotations: () => void;
  onResetCanvas: () => void;
  onExportSnapshot: () => void;
}

export function PlaygroundToolbar({
  activeTool,
  onSelectTool,
  onClearAnnotations,
  onResetCanvas,
  onExportSnapshot,
}: PlaygroundToolbarProps) {
  const tools = [
    { id: "select", label: "Pan / Select", icon: Hand, color: "text-zinc-300" },
    { id: "pen", label: "Pen (Red)", icon: PenTool, color: "text-rose-400" },
    { id: "arrow", label: "Connector Arrow", icon: ArrowUpRight, color: "text-cyan-400" },
    { id: "highlighter", label: "Highlighter (Amber)", icon: Highlighter, color: "text-amber-400" },
    { id: "sticky", label: "Spawn Sticky Note", icon: NoteIcon, color: "text-purple-400" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl">
      {/* Tool Buttons */}
      <div className="flex items-center gap-1 border-r border-zinc-800 pr-2">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id as any)}
              title={t.label}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-zinc-800 text-white ring-1 ring-cyan-400/80 shadow-md"
                  : "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? t.color : ""}`} />
              <span className="hidden sm:inline">{t.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Utilities */}
      <div className="flex items-center gap-1 pl-1">
        <button
          onClick={onClearAnnotations}
          title="Clear Drawings"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden md:inline">Clear Drawings</span>
        </button>

        <button
          onClick={onResetCanvas}
          title="Reset Canvas Layout"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <button
          onClick={onExportSnapshot}
          title="Export High-Res PNG Snapshot"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all ml-1"
        >
          <Download className="w-4 h-4" />
          <span>Export Snapshot 📸</span>
        </button>
      </div>
    </div>
  );
}
