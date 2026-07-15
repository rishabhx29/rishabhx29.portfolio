"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlaygroundAssetItem } from "@/data/playgroundAssets";
import { X, Check } from "lucide-react";

interface StickyNoteProps {
  item: PlaygroundAssetItem;
  onUpdate: (id: string, updates: Partial<PlaygroundAssetItem>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function StickyNote({
  item,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.content || "");

  const colorStyles: Record<string, string> = {
    yellow: "from-amber-400/20 via-yellow-400/10 to-amber-500/15 border-amber-400/50 text-amber-100",
    cyan: "from-cyan-400/20 via-sky-400/10 to-cyan-500/15 border-cyan-400/50 text-cyan-100",
    purple: "from-purple-400/20 via-fuchsia-400/10 to-purple-500/15 border-purple-400/50 text-purple-100",
    dark: "from-zinc-800/80 via-zinc-900/90 to-zinc-950/90 border-zinc-700/80 text-zinc-200",
  };

  const currentTheme = colorStyles[item.color || "yellow"] || colorStyles.yellow;

  const handleSave = () => {
    setIsEditing(false);
    onUpdate(item.id, { content: text });
  };

  return (
    <motion.div
      drag={!isEditing}
      dragMomentum={false}
      onDragStart={() => onSelect()}
      onDragEnd={(e, info) => {
        onUpdate(item.id, {
          defaultX: item.defaultX + info.offset.x,
          defaultY: item.defaultY + info.offset.y,
        });
      }}
      initial={{ x: item.defaultX, y: item.defaultY, rotate: item.rotation || 0 }}
      animate={{ rotate: item.rotation || 0 }}
      whileHover={{ scale: isEditing ? 1 : 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 50, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-grab active:cursor-grabbing select-none p-5 rounded-2xl border bg-gradient-to-br backdrop-blur-xl shadow-2xl transition-all group flex flex-col justify-between ${currentTheme} ${
        isSelected
          ? "ring-2 ring-white/60 shadow-[0_0_30px_rgba(255,255,255,0.15)] z-40"
          : "hover:border-white/40 z-10"
      }`}
      style={{
        width: item.width || 260,
        height: item.height || 220,
      }}
    >
      {/* Top Bar / Actions */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-70">
          {item.title || "📝 Sticky Note"}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
              title="Save Note"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              Edit
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 rounded hover:bg-red-500/20 text-red-300 transition-colors"
            title="Delete Note"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
          autoFocus
          className="w-full flex-grow bg-black/30 text-white text-xs font-mono p-2 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none"
          placeholder="Type your note or architectural annotation here..."
        />
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className="w-full flex-grow text-xs font-mono leading-relaxed overflow-y-auto pr-1 select-text cursor-text"
        >
          {text || (
            <span className="opacity-40 italic">Double click or press edit to type...</span>
          )}
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono opacity-50">
        <span>Visitor Note</span>
        <span>Double-click to edit</span>
      </div>
    </motion.div>
  );
}
