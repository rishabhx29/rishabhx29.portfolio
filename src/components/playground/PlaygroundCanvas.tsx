"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PlaygroundAssetItem,
  INITIAL_PLAYGROUND_ASSETS,
  PRESET_LAYOUTS,
} from "@/data/playgroundAssets";
import { PlaygroundItem } from "./PlaygroundItem";
import { StickyNote } from "./StickyNote";
import { DrawingOverlay, DrawingStroke } from "./DrawingOverlay";
import { PlaygroundToolbar } from "./PlaygroundToolbar";
import { PlaygroundDock } from "./PlaygroundDock";
import { Boxes, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import html2canvas from "html2canvas";

const STORAGE_KEY_ASSETS = "blueprint_playground_assets_v1";
const STORAGE_KEY_STROKES = "blueprint_playground_strokes_v1";
const STORAGE_KEY_LAYOUT = "blueprint_playground_layout_v1";

export function PlaygroundCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasViewportRef = useRef<HTMLDivElement | null>(null);

  // State
  const [assets, setAssets] = useState<PlaygroundAssetItem[]>(INITIAL_PLAYGROUND_ASSETS);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<"select" | "pen" | "arrow" | "highlighter" | "sticky">("select");
  const [currentLayout, setCurrentLayout] = useState<string>("chaos");

  // Viewport Pan & Zoom
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedAssets = localStorage.getItem(STORAGE_KEY_ASSETS);
      const savedStrokes = localStorage.getItem(STORAGE_KEY_STROKES);
      const savedLayout = localStorage.getItem(STORAGE_KEY_LAYOUT);

      if (savedAssets) setAssets(JSON.parse(savedAssets));
      if (savedStrokes) setStrokes(JSON.parse(savedStrokes));
      if (savedLayout) setCurrentLayout(savedLayout);
    } catch (e) {
      console.error("Failed to load playground state from storage", e);
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
      localStorage.setItem(STORAGE_KEY_STROKES, JSON.stringify(strokes));
      localStorage.setItem(STORAGE_KEY_LAYOUT, currentLayout);
    } catch (e) {
      console.error("Failed to save playground state to storage", e);
    }
  }, [assets, strokes, currentLayout]);

  // Handle asset mutations
  const handleUpdateAsset = (id: string, updates: Partial<PlaygroundAssetItem>) => {
    setAssets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSpawnAsset = (type: "image" | "badge" | "tech" | "sticky", presetId?: string) => {
    if (presetId) {
      const existing = INITIAL_PLAYGROUND_ASSETS.find((a) => a.id === presetId);
      if (existing) {
        const spawned: PlaygroundAssetItem = {
          ...existing,
          id: `${existing.id}-${Date.now()}`,
          defaultX: (-pan.x + 400) / zoom + Math.random() * 80,
          defaultY: (-pan.y + 250) / zoom + Math.random() * 80,
        };
        setAssets((prev) => [...prev, spawned]);
        setSelectedId(spawned.id);
        return;
      }
    }

    // Default Spawns
    if (type === "sticky") {
      const newSticky: PlaygroundAssetItem = {
        id: `sticky-${Date.now()}`,
        type: "sticky",
        title: "📌 Architectural Note",
        content: "New note added from dock. Double-click to edit your message!",
        color: "cyan",
        defaultX: (-pan.x + 500) / zoom,
        defaultY: (-pan.y + 300) / zoom,
        width: 260,
        height: 220,
        rotation: 0,
      };
      setAssets((prev) => [...prev, newSticky]);
      setSelectedId(newSticky.id);
    } else if (type === "tech") {
      const newTech: PlaygroundAssetItem = {
        id: `tech-${Date.now()}`,
        type: "tech",
        title: "⚡ Custom System Token",
        color: "from-blue-950/80 to-indigo-900/60 border-blue-500/40 text-blue-300",
        defaultX: (-pan.x + 500) / zoom,
        defaultY: (-pan.y + 350) / zoom,
        width: 210,
        height: 56,
        rotation: 0,
      };
      setAssets((prev) => [...prev, newTech]);
      setSelectedId(newTech.id);
    }
  };

  const handleSelectLayout = (templateKey: string) => {
    setCurrentLayout(templateKey);
    const layoutAssets = PRESET_LAYOUTS[templateKey] || INITIAL_PLAYGROUND_ASSETS;
    setAssets(layoutAssets);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleResetCanvas = () => {
    setAssets(PRESET_LAYOUTS[currentLayout] || INITIAL_PLAYGROUND_ASSETS);
    setStrokes([]);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setSelectedId(null);
  };

  const handleExportSnapshot = async () => {
    if (!canvasViewportRef.current) return;
    try {
      setSelectedId(null);
      await new Promise((r) => setTimeout(r, 100)); // Let selection rings clear
      const canvas = await html2canvas(canvasViewportRef.current, {
        backgroundColor: "#09090b",
        scale: 2,
        useCORS: true,
      } as any);
      const link = document.createElement("a");
      link.download = `rishabh-blueprint-playground-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Snapshot export failed", e);
    }
  };

  // Pan interaction
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && activeTool === "select" && e.target === containerRef.current)) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (e.target === containerRef.current) {
      setSelectedId(null);
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleContainerMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom via wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || activeTool === "select") {
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom((z) => Math.max(0.5, Math.min(2.0, z * factor)));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-screen overflow-hidden bg-zinc-950 select-none"
    >
      {/* Header Bar */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4 pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl backdrop-blur-xl text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all text-xs font-bold"
        >
          <span>← Back to Portfolio</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-xl">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Boxes className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold text-zinc-200 tracking-wide">
            Blueprint Canvas <span className="text-cyan-400">v1.0</span>
          </span>
          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-400">
            {currentLayout.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Dock / Template Switcher */}
      <PlaygroundDock
        onSpawnAsset={handleSpawnAsset}
        onSelectLayout={handleSelectLayout}
        currentLayout={currentLayout}
      />

      {/* Floating Coordinate HUD & Zoom */}
      <div className="absolute top-20 sm:top-6 left-6 sm:left-auto sm:right-96 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-[10px] font-mono text-zinc-400">
        <span>X: {Math.round(pan.x)}</span>
        <span>Y: {Math.round(pan.y)}</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
          className="p-1 hover:text-cyan-400 transition-colors"
        >
          <ZoomIn className="w-3 h-3" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
          className="p-1 hover:text-cyan-400 transition-colors"
        >
          <ZoomOut className="w-3 h-3" />
        </button>
      </div>

      {/* Main Infinite Viewport */}
      <div
        ref={canvasViewportRef}
        className="absolute inset-0 w-full h-full origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          backgroundImage: `radial-gradient(circle, #27272a 1.5px, transparent 1.5px)`,
          backgroundSize: `20px 20px`,
          width: 4000,
          height: 3000,
        }}
      >
        {/* Coordinate Axis Origin Indicator (+) */}
        <div className="absolute left-[400px] top-[300px] w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center opacity-30">
          <div className="absolute w-full h-[1px] bg-cyan-400" />
          <div className="absolute h-full w-[1px] bg-cyan-400" />
        </div>

        {/* Render Cards & Sticky Notes */}
        {assets.map((item) => {
          if (item.type === "sticky") {
            return (
              <StickyNote
                key={item.id}
                item={item}
                onUpdate={handleUpdateAsset}
                onDelete={handleDeleteAsset}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
              />
            );
          }
          return (
            <PlaygroundItem
              key={item.id}
              item={item}
              onUpdate={handleUpdateAsset}
              onDelete={handleDeleteAsset}
              isSelected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
            />
          );
        })}

        {/* Freehand Drawing Overlay */}
        <DrawingOverlay
          activeTool={activeTool}
          zoom={zoom}
          pan={pan}
          strokes={strokes}
          onAddStroke={(s) => setStrokes((prev) => [...prev, s])}
        />
      </div>

      {/* Bottom Toolbar */}
      <PlaygroundToolbar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onClearAnnotations={() => setStrokes([])}
        onResetCanvas={handleResetCanvas}
        onExportSnapshot={handleExportSnapshot}
      />
    </div>
  );
}
