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

  const isToolActive = activeTool === "pen" || activeTool === "arrow" || activeTool === "highlighter";

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
      const color =
        activeTool === "highlighter"
          ? "rgba(250, 204, 21, 0.4)" // Amber translucent
          : activeTool === "arrow"
          ? "#06b6d4" // Cyan arrow
          : "#f43f5e"; // Rose freehand

      const size = activeTool === "highlighter" ? 24 : activeTool === "arrow" ? 4 : 3;

      onAddStroke({
        id: `stroke-${Date.now()}`,
        points: currentPoints,
        tool: activeTool as "pen" | "arrow" | "highlighter",
        color,
        size,
      });
    }
    setCurrentPoints([]);
  };

  // Helper function to draw an arrowhead at the end of a line
  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    size: number
  ) => {
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

    // Render saved strokes
    strokes.forEach((stroke) => {
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
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        ctx.stroke();
      }
    });

    // Render active drawing stroke
    if (currentPoints.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle =
        activeTool === "highlighter"
          ? "rgba(250, 204, 21, 0.4)"
          : activeTool === "arrow"
          ? "#06b6d4"
          : "#f43f5e";
      ctx.lineWidth = activeTool === "highlighter" ? 24 : activeTool === "arrow" ? 4 : 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (activeTool === "arrow") {
        const start = currentPoints[0];
        const end = currentPoints[currentPoints.length - 1];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        drawArrowhead(ctx, start, end, ctx.lineWidth);
      } else {
        ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
        for (let i = 1; i < currentPoints.length; i++) {
          ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [strokes, currentPoints, zoom, pan, activeTool]);

  return (
    <canvas
      ref={canvasRef}
      width={4000}
      height={3000}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`absolute inset-0 z-30 pointer-events-${isToolActive ? "auto" : "none"}`}
      style={{
        cursor:
          activeTool === "pen"
            ? "crosshair"
            : activeTool === "arrow"
            ? "cell"
            : activeTool === "highlighter"
            ? "text"
            : "default",
      }}
    />
  );
}
