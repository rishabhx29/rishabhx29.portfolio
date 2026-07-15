"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlaygroundAssetItem } from "@/data/playgroundAssets";
import { Maximize2, Minimize2, RotateCw, ExternalLink, X } from "lucide-react";

interface PlaygroundItemProps {
  item: PlaygroundAssetItem;
  onUpdate: (id: string, updates: Partial<PlaygroundAssetItem>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlaygroundItem({
  item,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
}: PlaygroundItemProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(item.rotation || 0);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRot = (rotation + 15) % 360;
    setRotation(nextRot);
    onUpdate(item.id, { rotation: nextRot });
  };

  const handleResize = (e: React.MouseEvent, factor: number) => {
    e.stopPropagation();
    const nextScale = Math.max(0.6, Math.min(1.8, scale * factor));
    setScale(nextScale);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => onSelect()}
      onDragEnd={(e, info) => {
        onUpdate(item.id, {
          defaultX: item.defaultX + info.offset.x,
          defaultY: item.defaultY + info.offset.y,
        });
      }}
      initial={{ x: item.defaultX, y: item.defaultY, rotate: rotation, scale: 1 }}
      animate={{ rotate: rotation, scale }}
      whileHover={{ scale: scale * 1.02 }}
      whileDrag={{ scale: scale * 1.05, zIndex: 50, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25)" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow rounded-2xl group ${
        isSelected
          ? "ring-2 ring-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-40"
          : "hover:ring-1 hover:ring-zinc-600 z-10"
      }`}
      style={{
        width: item.width || 220,
        height: item.height || "auto",
      }}
    >
      {/* Floating Action Controls on Hover/Select */}
      <div className={`absolute -top-10 left-0 right-0 flex items-center justify-between px-2 py-1 rounded-xl bg-zinc-900/90 border border-zinc-700/80 backdrop-blur-md shadow-xl transition-opacity ${
        isSelected || "opacity-0 group-hover:opacity-100"
      }`}>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => handleResize(e, 1.15)}
            title="Scale Up"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleResize(e, 0.85)}
            title="Scale Down"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate 15°"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open Link"
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-cyan-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Remove from Canvas"
            className="p-1.5 rounded-lg hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render based on Asset Type */}
      {item.type === "image" && (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-sm">
          {item.src && (
            <div className="relative w-full" style={{ height: (item.height || 240) - 60 }}>
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover pointer-events-none"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          )}
          <div className="p-3 bg-zinc-950/90 border-t border-zinc-800/80">
            <h4 className="text-xs font-bold text-zinc-200 tracking-tight truncate">{item.title}</h4>
            {item.subtitle && (
              <p className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">{item.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {item.type === "badge" && (
        <div className="relative w-full h-full p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-zinc-900/90 to-zinc-950/90 shadow-2xl flex flex-col items-center justify-center text-center">
          {item.src && (
            <div className="relative w-28 h-28 mb-3">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-contain pointer-events-none drop-shadow-[0_10px_15px_rgba(245,158,11,0.2)]"
                sizes="120px"
              />
            </div>
          )}
          <h4 className="text-xs font-bold text-amber-300 tracking-tight">{item.title}</h4>
          {item.subtitle && (
            <p className="text-[10px] text-amber-200/70 font-mono mt-1">{item.subtitle}</p>
          )}
        </div>
      )}

      {item.type === "tech" && (
        <div className={`w-full h-full px-4 py-3 rounded-xl border bg-gradient-to-r shadow-lg flex items-center justify-between gap-3 ${
          item.color || "from-zinc-900 to-zinc-800 border-zinc-700 text-zinc-200"
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-tight">{item.title}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
