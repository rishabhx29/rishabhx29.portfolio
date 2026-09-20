"use client";

import React, { useRef, useEffect, useState } from "react";

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[];
  tool: "pen" | "arrow" | "highlighter";
  color: string;
  size: number;
}

interface DrawingOverlayProps {
  activeTool: "select" | "pen" | "arrow" | "highlighter" | "sticky";
  zoom: number;
  pan: { x: number; y: number };
  strokes: DrawingStroke[];
  onAddStroke: (stroke: DrawingStroke) => void;
}

type DrawTool = "pen" | "arrow" | "highlighter";

const TOOL_STYLES: Record<DrawTool, { color: string; size: number }> = {
  pen: { color: "#f43f5e", size: 3 }, // Rose freehand
  arrow: { color: "#06b6d4", size: 4 }, // Cyan arrow
  highlighter: { color: "rgba(250, 204, 21, 0.4)", size: 24 }, // Amber translucent
};

const CURSORS: Record<DrawTool, string> = {
  pen: "crosshair",
  arrow: "cell",
  highlighter: "text",
};

function isDrawTool(tool: string): tool is DrawTool {
  return tool === "pen" || tool === "arrow" || tool === "highlighter";
}

function toolStyle(tool: DrawTool) {
  return TOOL_STYLES[tool];
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  size: number
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const headLen = size * 4;
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - headLen * Math.cos(angle - Math.PI / 6),
    to.y - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    to.x - headLen * Math.cos(angle + Math.PI / 6),
    to.y - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function strokePath(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawingStroke) {
  if (stroke.points.length < 2) return;
  ctx.beginPath();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (stroke.tool === "arrow") {
    const start = stroke.points[0];
    const end = stroke.points[stroke.points.length - 1];
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    drawArrowhead(ctx, start, end, stroke.size);
  } else {
    strokePath(ctx, stroke.points);
  }
}

export function DrawingOverlay({
  activeTool,
  zoom,
  pan,
  strokes,
  onAddStroke,
}: DrawingOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);

  const isToolActive = isDrawTool(activeTool);

  // Convert screen coordinates to canvas world coordinates
  const screenToWorld = (screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (screenX - rect.left - pan.x) / zoom,
      y: (screenY - rect.top - pan.y) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isToolActive) return;
    e.stopPropagation();
    setIsDrawing(true);
    const startPoint = screenToWorld(e.clientX, e.clientY);
    setCurrentPoints([startPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !isToolActive) return;
    e.stopPropagation();
    const nextPoint = screenToWorld(e.clientX, e.clientY);
    setCurrentPoints((prev) => [...prev, nextPoint]);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !isToolActive) return;
    e.stopPropagation();
    setIsDrawing(false);

    if (currentPoints.length >= 2) {
      const style = toolStyle(activeTool);

      onAddStroke({
        id: `stroke-${Date.now()}`,
        points: currentPoints,
        tool: activeTool,
        color: style.color,
        size: style.size,
      });
    }
    setCurrentPoints([]);
  };

  // Draw all completed strokes + active in-progress stroke
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Apply viewport zoom & pan transformations
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    strokes.forEach((stroke) => drawStroke(ctx, stroke));

    // Render active drawing stroke
    if (isDrawTool(activeTool) && currentPoints.length >= 2) {
      const style = toolStyle(activeTool);
      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (activeTool === "arrow") {
        const start = currentPoints[0];
        const end = currentPoints[currentPoints.length - 1];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        drawArrowhead(ctx, start, end, style.size);
      } else {
        strokePath(ctx, currentPoints);
      }
    }

    ctx.restore();
  }, [strokes, currentPoints, zoom, pan, activeTool]);

  const cursor = isDrawTool(activeTool) ? CURSORS[activeTool] : "default";
  const pointerEventsClass = isToolActive ? "auto" : "none";

  return (
    <canvas
      ref={canvasRef}
      width={4000}
      height={3000}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`absolute inset-0 z-30 pointer-events-${pointerEventsClass}`}
      style={{ cursor }}
    />
  );
}
