"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eraser,
  Expand,
  FileDown,
  Hand,
  ImagePlus,
  Layers3,
  Minus,
  PenLine,
  Plus,
  Redo2,
  RotateCw,
  Sparkles,
  StickyNote,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import {
  DEFAULT_WORKBENCH_OBJECTS,
  PLAYGROUND_ASSET_CATALOG,
  WORKBENCH_LAYOUTS,
  type WorkbenchObject,
  type WorkbenchObjectType,
} from "@/data/playgroundAssets";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";

type Tool = "hand" | "draw" | "erase";
type Camera = { x: number; y: number; zoom: number };
type Point = { x: number; y: number };
type Stroke = { id: string; points: Point[] };
type LayoutName = keyof typeof WORKBENCH_LAYOUTS;

const CAMERA_LIMITS = { min: 0.05, max: 12 };
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function getObjectKindLabel(type: WorkbenchObjectType) {
  return type === "photo" ? "Photo" : type === "project" ? "Project" : type === "achievement" ? "Achievement" : type === "label" ? "Frame" : "Note";
}

export function PlaygroundCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const dragRef = useRef<{ id: string; start: Point; origin: Point } | null>(null);
  const panRef = useRef<{ start: Point; origin: Point } | null>(null);
  const historyRef = useRef<WorkbenchObject[][]>([]);
  const redoRef = useRef<WorkbenchObject[][]>([]);
  const [objects, setObjects] = useState<WorkbenchObject[]>(() => clone(DEFAULT_WORKBENCH_OBJECTS));
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [activeStroke, setActiveStroke] = useState<Point[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("hand");
  const [camera, setCamera] = useState<Camera>({ x: 160, y: 116, zoom: 0.8 });
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [toast, setToast] = useState("Drag the pieces. Make it yours. It resets when you leave.");

  const selected = objects.find((entry) => entry.id === selectedId) ?? null;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo(); else undo();
      }
      if (event.key === "Escape") setSelectedId(null);
      if (event.key === "Delete" && selected?.removable) removeSelected();
      if (event.key === "0") fitBoard();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setToast(""), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const boardTransform = useMemo(
    () => `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.zoom})`,
    [camera]
  );

  function snapshot() {
    historyRef.current = [...historyRef.current.slice(-24), clone(objects)];
    redoRef.current = [];
  }

  function commit(next: WorkbenchObject[]) {
    snapshot();
    setObjects(next);
  }

  function undo() {
    const previous = historyRef.current.pop();
    if (!previous) return;
    redoRef.current.push(clone(objects));
    setObjects(previous);
    setToast("Undid the last canvas change.");
  }

  function redo() {
    const next = redoRef.current.pop();
    if (!next) return;
    historyRef.current.push(clone(objects));
    setObjects(next);
    setToast("Restored the canvas change.");
  }

  function getContentBounds() {
    const allPoints = objects.flatMap((object) => [
      { x: object.x, y: object.y },
      { x: object.x + object.width, y: object.y + object.height },
    ]);
    const padding = 96;
    return {
      left: Math.min(...allPoints.map((point) => point.x)) - padding,
      top: Math.min(...allPoints.map((point) => point.y)) - padding,
      right: Math.max(...allPoints.map((point) => point.x)) + padding,
      bottom: Math.max(...allPoints.map((point) => point.y)) + padding,
    };
  }

  function fitBoard() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const bounds = getContentBounds();
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const zoom = Math.min((viewport.clientWidth - 44) / width, (viewport.clientHeight - 128) / height, 0.82);
    setCamera({ x: (viewport.clientWidth - width * zoom) / 2 - bounds.left * zoom, y: (viewport.clientHeight - height * zoom) / 2 - bounds.top * zoom, zoom });
  }

  function resetBoard() {
    historyRef.current = [];
    redoRef.current = [];
    setObjects(clone(DEFAULT_WORKBENCH_OBJECTS));
    setStrokes([]);
    setSelectedId(null);
    setToast("Back to the authored field notes.");
    fitBoard();
  }

  function selectLayout(name: LayoutName) {
    commit(clone(WORKBENCH_LAYOUTS[name]));
    setSelectedId(null);
    setToast(`${name === "fieldNotes" ? "Field notes" : name === "projectWall" ? "Project wall" : "After hours"} arranged.`);
  }

  function toWorld(clientX: number, clientY: number): Point {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (clientX - rect.left - camera.x) / camera.zoom, y: (clientY - rect.top - camera.y) / camera.zoom };
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nextZoom = Math.min(CAMERA_LIMITS.max, Math.max(CAMERA_LIMITS.min, camera.zoom * (event.deltaY > 0 ? 0.88 : 1.14)));
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const worldX = (pointerX - camera.x) / camera.zoom;
    const worldY = (pointerY - camera.y) / camera.zoom;
    setCamera({ x: pointerX - worldX * nextZoom, y: pointerY - worldY * nextZoom, zoom: nextZoom });
  }

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    if (tool !== "hand" || event.button !== 0 || (event.target !== viewportRef.current && event.target !== worldRef.current)) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    panRef.current = { start: { x: event.clientX, y: event.clientY }, origin: { x: camera.x, y: camera.y } };
  }

  function moveCanvas(event: React.PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;
    if (viewport) {
      const rect = viewport.getBoundingClientRect();
      viewport.style.setProperty("--field-x", `${event.clientX - rect.left}px`);
      viewport.style.setProperty("--field-y", `${event.clientY - rect.top}px`);
    }
    if (panRef.current) {
      const { start, origin } = panRef.current;
      setCamera((current) => ({ ...current, x: origin.x + event.clientX - start.x, y: origin.y + event.clientY - start.y }));
      return;
    }
    if (tool === "draw" && activeStroke.length) {
      const nextPoint = toWorld(event.clientX, event.clientY);
      setActiveStroke((points) => [...points, nextPoint]);
    }
  }

  function endCanvas(event: React.PointerEvent<HTMLDivElement>) {
    if (panRef.current) panRef.current = null;
    if (tool === "draw" && activeStroke.length > 1) {
      setStrokes((items) => [...items, { id: `stroke-${Date.now()}`, points: activeStroke }]);
      setActiveStroke([]);
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function startDraw(event: React.PointerEvent<HTMLDivElement>) {
    if (tool !== "draw" || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setActiveStroke([toWorld(event.clientX, event.clientY)]);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>, object: WorkbenchObject) {
    if (tool !== "hand" || event.button !== 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: object.id, start: { x: event.clientX, y: event.clientY }, origin: { x: object.x, y: object.y } };
    setSelectedId(object.id);
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const x = drag.origin.x + (event.clientX - drag.start.x) / camera.zoom;
    const y = drag.origin.y + (event.clientY - drag.start.y) / camera.zoom;
    const node = cardRefs.current.get(drag.id);
    const object = objects.find((entry) => entry.id === drag.id);
    if (node && object) node.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${object.rotation ?? 0}deg)`;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const x = drag.origin.x + (event.clientX - drag.start.x) / camera.zoom;
    const y = drag.origin.y + (event.clientY - drag.start.y) / camera.zoom;
    dragRef.current = null;
    commit(objects.map((entry) => entry.id === drag.id ? { ...entry, x, y } : entry));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function addCatalogAsset(assetId: string) {
    const asset = PLAYGROUND_ASSET_CATALOG.find((entry) => entry.id === assetId);
    if (!asset) return;
    const viewport = viewportRef.current;
    const x = viewport ? (viewport.clientWidth / 2 - camera.x) / camera.zoom - asset.width / 2 : 0;
    const y = viewport ? (viewport.clientHeight / 2 - camera.y) / camera.zoom - asset.height / 2 : 0;
    const object: WorkbenchObject = { ...asset, id: `${asset.id}-${Date.now()}`, x, y, rotation: 0, removable: true };
    commit([...objects, object]);
    setSelectedId(object.id);
    setLibraryOpen(false);
    setToast(`${asset.title} added to your board.`);
  }

  function addNote() {
    const object: WorkbenchObject = { id: `note-${Date.now()}`, type: "note", title: "Untitled field note", content: "Double-click this note to write something down.", x: 690, y: 500, width: 268, height: 188, rotation: -1, variant: "paper", removable: true };
    commit([...objects, object]);
    setSelectedId(object.id);
  }

  function updateSelected(updates: Partial<WorkbenchObject>) {
    if (!selected) return;
    commit(objects.map((entry) => entry.id === selected.id ? { ...entry, ...updates } : entry));
  }

  function duplicateSelected() {
    if (!selected) return;
    const copy = { ...selected, id: `${selected.id}-${Date.now()}`, x: selected.x + 34, y: selected.y + 34, removable: true };
    commit([...objects, copy]);
    setSelectedId(copy.id);
  }

  function removeSelected() {
    if (!selected?.removable) return;
    commit(objects.filter((entry) => entry.id !== selected.id));
    setSelectedId(null);
  }

  async function exportPng() {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const bounds = getContentBounds();
      const exportOptions = {
        backgroundColor: document.documentElement.classList.contains("dark") ? "#09090b" : "#fafafa",
        scale: 1.2,
        useCORS: true,
        x: bounds.left,
        y: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
      } as unknown as Parameters<typeof html2canvas>[1];
      const canvas = await html2canvas(worldRef.current!, exportOptions);
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Could not create image");
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "rishabh-field-notebook.png";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
      setToast("Your field notebook is ready as a PNG.");
    } catch {
      setToast("Could not export the image. Please try again.");
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ version: 1, objects, strokes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rishabh-field-notebook.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className={`playground-shell relative min-h-[100dvh] overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 ${focusMode ? "playground-focus" : ""}`}>
      <div className="playground-grain pointer-events-none absolute inset-0" />
      <header className="playground-header absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 px-3 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="playground-icon-button grid h-9 w-9 shrink-0 place-items-center" aria-label="Back to portfolio"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-tight sm:text-sm">Architecture field notebook <span className="ml-1 font-mono text-[9px] font-medium tracking-[.16em] text-zinc-400">/ 01</span></p>
            <p className="hidden text-[11px] text-zinc-500 dark:text-zinc-400 sm:block">A temporary spatial index of work, context, and side quests.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setFocusMode((value) => !value)} className="playground-icon-button hidden h-9 items-center gap-2 px-3 text-xs font-medium sm:flex" aria-pressed={focusMode}><span className="h-1.5 w-1.5 bg-current" />{focusMode ? "Exit focus" : "Focus"}</button>
          <CommandMenu />
          <ThemeToggle className="playground-icon-button grid h-9 w-9 shrink-0 place-items-center" />
          <button onClick={exportPng} className="playground-export-button flex h-9 items-center gap-2 px-3 text-xs font-medium"><Download className="h-3.5 w-3.5" /><span className="hidden sm:inline">Export</span></button>
        </div>
      </header>

      <div ref={viewportRef} onWheel={handleWheel} onPointerDown={(event) => tool === "draw" ? startDraw(event) : startPan(event)} onPointerMove={moveCanvas} onPointerUp={endCanvas} style={{ "--field-grid-x": `${camera.x}px`, "--field-grid-y": `${camera.y}px`, "--field-grid-size": `${72 * camera.zoom}px` } as React.CSSProperties} className={`playground-viewport relative min-h-[100dvh] touch-none overflow-hidden ${tool === "hand" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"}`}>
        <div className="playground-scanline pointer-events-none absolute inset-x-0 top-[62px] z-10" />
        <div ref={worldRef} style={{ width: 1, height: 1, transform: boardTransform, transformOrigin: "0 0", willChange: "transform", overflow: "visible" }} className="absolute left-0 top-0">
          <div className="pointer-events-none absolute left-[-58px] top-[-58px] h-[1px] w-[1600px] bg-zinc-400/45 dark:bg-zinc-500/45" />
          <p className="pointer-events-none absolute left-[1180px] top-[-82px] whitespace-nowrap font-mono text-[10px] tracking-[.18em] text-zinc-500">RT / INFINITE FIELD / 2026</p>
          <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
            {[...strokes, ...(activeStroke.length > 1 ? [{ id: "active", points: activeStroke }] : [])].map((stroke) => <polyline key={stroke.id} points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600/80 dark:text-cyan-300/80" />)}
          </svg>
          <div className="playground-orbit pointer-events-none absolute left-[760px] top-[380px] h-40 w-40" aria-hidden="true"><span /><span /><span /></div>
          {objects.map((object, index) => <WorkbenchCard key={object.id} object={object} index={index} selected={selectedId === object.id} setRef={(node) => { if (node) cardRefs.current.set(object.id, node); }} onSelect={() => setSelectedId(object.id)} onPointerDown={(event) => startDrag(event, object)} onPointerMove={moveDrag} onPointerUp={endDrag} onEdit={(content) => updateSelected({ content })} />)}
        </div>
      </div>

      <div className="playground-intro pointer-events-none absolute bottom-[94px] left-4 z-20 hidden max-w-[255px] lg:block">
        <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-zinc-500">SPATIAL PORTFOLIO / ACTIVE</p>
        <p className="mt-2 text-sm font-medium leading-snug text-zinc-800 dark:text-zinc-100">Not a gallery. A desk you can rearrange.</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">Drag artifacts, draw connections, or switch the composition when you want a different read.</p>
        <div className="mt-3 flex items-center gap-2 font-mono text-[9px] tracking-[.12em] text-zinc-400"><span className="h-px w-8 bg-current" /> SCROLL TO ZOOM</div>
      </div>

      <aside className="playground-panel absolute right-3 top-[70px] z-30 hidden w-56 p-2 lg:block">
        <p className="px-2 pb-2 pt-1 font-mono text-[10px] font-medium tracking-[.16em] text-zinc-500">COMPOSITIONS</p>
        {([ ["fieldNotes", "Field notes"], ["projectWall", "Project wall"], ["afterHours", "After hours"] ] as const).map(([name, label], index) => <button key={name} onClick={() => selectLayout(name)} className="playground-layout-button flex w-full items-center justify-between px-2 py-2 text-left text-xs"><span><span className="mr-2 font-mono text-[9px] text-zinc-400">0{index + 1}</span>{label}</span><Layers3 className="h-3.5 w-3.5 text-zinc-400" /></button>)}
        <div className="mt-2 border-t border-black/10 pt-2 dark:border-white/10"><button onClick={resetBoard} className="playground-layout-button flex w-full items-center gap-2 px-2 py-2 text-left text-xs text-zinc-500"><RotateCw className="h-3.5 w-3.5" /> Reset to default</button></div>
      </aside>

      <div className="playground-dock absolute bottom-3 left-1/2 z-30 flex w-[calc(100%-24px)] max-w-xl -translate-x-1/2 items-center justify-between gap-1 p-1.5 sm:w-auto">
        <div className="flex items-center gap-1">
          <ToolButton active={tool === "hand"} onClick={() => setTool("hand")} label="Move"><Hand className="h-4 w-4" /></ToolButton>
          <ToolButton active={tool === "draw"} onClick={() => setTool("draw")} label="Draw"><PenLine className="h-4 w-4" /></ToolButton>
          <ToolButton active={tool === "erase"} onClick={() => { setStrokes([]); setTool("hand"); }} label="Clear lines"><Eraser className="h-4 w-4" /></ToolButton>
          <ToolButton onClick={addNote} label="Add note"><StickyNote className="h-4 w-4" /></ToolButton>
          <ToolButton active={libraryOpen} onClick={() => setLibraryOpen((open) => !open)} label="Open library"><ImagePlus className="h-4 w-4" /></ToolButton>
        </div>
        <div className="flex items-center gap-1 border-l border-black/10 pl-1 dark:border-white/10">
          <ToolButton onClick={undo} label="Undo"><Undo2 className="h-4 w-4" /></ToolButton><ToolButton onClick={redo} label="Redo"><Redo2 className="h-4 w-4" /></ToolButton><ToolButton onClick={() => setCamera((value) => ({ ...value, zoom: Math.max(.46, value.zoom - .1) }))} label="Zoom out"><Minus className="h-4 w-4" /></ToolButton><ToolButton onClick={() => setCamera((value) => ({ ...value, zoom: Math.min(1.35, value.zoom + .1) }))} label="Zoom in"><Plus className="h-4 w-4" /></ToolButton><ToolButton onClick={fitBoard} label="Fit board"><Expand className="h-4 w-4" /></ToolButton>
        </div>
      </div>

      {libraryOpen && <div className="absolute bottom-[72px] left-3 right-3 z-40 mx-auto max-w-2xl border border-black/10 bg-zinc-50 p-3 shadow-2xl dark:border-white/10 dark:bg-zinc-950 sm:left-1/2 sm:-translate-x-1/2"><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-semibold">Image & artifact library</p><p className="text-xs text-zinc-500">Click any image to drop it into the active view.</p></div><button onClick={() => setLibraryOpen(false)} className="p-2"><X className="h-4 w-4" /></button></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{PLAYGROUND_ASSET_CATALOG.map((asset) => <button key={asset.id} onClick={() => addCatalogAsset(asset.id)} className="group overflow-hidden border border-black/10 text-left transition-colors hover:-translate-y-0.5 hover:border-zinc-500 dark:border-white/10"><div className="relative aspect-[1.25] overflow-hidden bg-zinc-200 dark:bg-zinc-900"><Image src={asset.src} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-[1.04]" sizes="180px" /></div><div className="px-2 pb-2 pt-1.5"><p className="truncate text-[11px] font-medium">{asset.title}</p><p className="mt-0.5 text-[9px] uppercase tracking-[.12em] text-zinc-500">{asset.type}</p></div></button>)}</div></div>}
      {selected && <Inspector object={selected} onChange={updateSelected} onDuplicate={duplicateSelected} onRemove={removeSelected} onClose={() => setSelectedId(null)} />}
      <div aria-live="polite" className="pointer-events-none absolute bottom-[78px] left-3 z-30 max-w-[270px] text-xs text-zinc-600 dark:text-zinc-300 sm:bottom-5 sm:left-5">{toast && <span className="inline-block border border-black/10 bg-zinc-50/90 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">{toast}</span>}</div>
      <button onClick={exportJson} className="absolute bottom-5 right-4 z-30 hidden items-center gap-2 text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 md:flex"><FileDown className="h-3.5 w-3.5" /> Export board data</button>
    </section>
  );
}

function ToolButton({ active, onClick, label, children }: { active?: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return <button onClick={onClick} aria-label={label} title={label} className={`grid h-8 w-8 place-items-center transition-[transform,background-color,color] duration-200 active:scale-[.94] ${active ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"}`}>{children}</button>;
}

function WorkbenchCard({ object, index, selected, setRef, onSelect, onPointerDown, onPointerMove, onPointerUp, onEdit }: { object: WorkbenchObject; index: number; selected: boolean; setRef: (node: HTMLDivElement | null) => void; onSelect: () => void; onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void; onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void; onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => void; onEdit: (content: string) => void }) {
  const [editing, setEditing] = useState(false);
  const paper = object.variant === "polaroid" ? "bg-white p-2 text-zinc-900 shadow-[0_20px_42px_rgba(24,24,27,.18)]" : object.variant === "dark" ? "border-zinc-800 bg-zinc-950 text-zinc-100 shadow-[0_20px_42px_rgba(0,0,0,.32)]" : "border-zinc-300 bg-zinc-50 text-zinc-900 shadow-[0_20px_42px_rgba(24,24,27,.14)] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  return <div ref={setRef} tabIndex={0} role="group" aria-label={`${getObjectKindLabel(object.type)}: ${object.title}`} onClick={(event) => { event.stopPropagation(); onSelect(); }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} style={{ width: object.width, height: object.height, transform: `translate3d(${object.x}px, ${object.y}px, 0) rotate(${object.rotation ?? 0}deg)`, willChange: "transform" }} className={`playground-object playground-object-${object.type} playground-variant-${object.variant ?? "paper"} absolute z-10 select-none border transition-[box-shadow,filter] duration-200 ${paper} ${selected ? "ring-2 ring-cyan-500 ring-offset-2 ring-offset-zinc-100 dark:ring-cyan-300 dark:ring-offset-[#101012]" : ""} ${object.type === "label" ? "border-dashed bg-transparent shadow-none" : "cursor-grab active:cursor-grabbing"}`}>
    <div className="playground-object-inner h-full" style={{ "--object-delay": `${Math.min(index, 8) * 80}ms` } as React.CSSProperties}>
    {object.type === "label" && <div className="flex h-full flex-col justify-center"><p className="text-[10px] font-semibold tracking-[.18em] text-zinc-500">{object.title}</p><p className="mt-1 text-sm font-medium tracking-tight">{object.subtitle}</p></div>}
    {(object.type === "photo" || object.type === "project") && object.src && <><div className="relative h-[calc(100%-52px)] overflow-hidden bg-zinc-200 dark:bg-zinc-800"><Image src={object.src} alt={object.title} fill className="pointer-events-none object-cover" sizes="360px" /></div><div className="px-1 pt-2"><p className="truncate text-xs font-semibold tracking-tight">{object.title}</p><p className="mt-0.5 truncate text-[10px] text-zinc-500 dark:text-zinc-400">{object.subtitle}</p></div></>}
    {object.type === "achievement" && object.src && <div className="flex h-full flex-col items-center justify-center p-4 text-center"><div className="relative h-28 w-28"><Image src={object.src} alt={object.title} fill className="pointer-events-none object-contain" sizes="112px" /></div><p className="mt-3 text-xs font-semibold">{object.title}</p><p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">{object.subtitle}</p></div>}
    {object.type === "note" && <div className="flex h-full flex-col p-4"><p className="border-b border-current/10 pb-2 text-[10px] font-semibold tracking-[.14em] uppercase opacity-65">{object.title}</p>{editing ? <textarea autoFocus value={object.content} onChange={(event) => onEdit(event.target.value)} onBlur={() => setEditing(false)} className="mt-3 min-h-0 flex-1 resize-none bg-transparent text-xs leading-relaxed outline-none" /> : <button onDoubleClick={() => setEditing(true)} className="mt-3 text-left text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">{object.content}</button>}<p className="mt-auto pt-2 text-[9px] text-zinc-400">double-click to edit</p></div>}
    </div>
  </div>;
}

function Inspector({ object, onChange, onDuplicate, onRemove, onClose }: { object: WorkbenchObject; onChange: (updates: Partial<WorkbenchObject>) => void; onDuplicate: () => void; onRemove: () => void; onClose: () => void }) {
  return <aside className="absolute left-3 top-[70px] z-40 w-[calc(100%-24px)] max-w-xs border border-black/10 bg-zinc-50/96 p-3 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/96 sm:w-72"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-medium tracking-[.16em] text-zinc-500">SELECTED {getObjectKindLabel(object.type).toUpperCase()}</p><p className="mt-1 text-sm font-semibold">{object.title}</p></div><button onClick={onClose} aria-label="Close inspector" className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X className="h-4 w-4" /></button></div><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => onChange({ rotation: (object.rotation ?? 0) + 15 })} className="flex items-center justify-center gap-2 border border-black/10 py-2 text-xs dark:border-white/10"><RotateCw className="h-3.5 w-3.5" /> Rotate</button><button onClick={onDuplicate} className="flex items-center justify-center gap-2 border border-black/10 py-2 text-xs dark:border-white/10"><Sparkles className="h-3.5 w-3.5" /> Duplicate</button></div>{object.type === "note" && <label className="mt-3 block text-xs text-zinc-500">Title<input value={object.title} onChange={(event) => onChange({ title: event.target.value })} className="mt-1 w-full border border-black/10 bg-transparent px-2 py-2 text-zinc-900 outline-none dark:border-white/10 dark:text-zinc-100" /></label>}{object.removable && <button onClick={onRemove} className="mt-3 flex w-full items-center justify-center gap-2 border border-red-500/30 py-2 text-xs text-red-600 dark:text-red-300"><Trash2 className="h-3.5 w-3.5" /> Remove from this session</button>}</aside>;
}
