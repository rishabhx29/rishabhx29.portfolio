"use client";

import React, { useEffect, useRef, useState } from "react";

type PetVariant = "dog" | "classic" | "tora" | "maia" | "vaporwave";

const VARIANTS: { id: PetVariant; label: string; icon: string }[] = [
  { id: "dog", label: "Dog", icon: "🐶" },
  { id: "classic", label: "Classic Cat", icon: "🐱" },
  { id: "tora", label: "Tora Cat", icon: "🐯" },
  { id: "maia", label: "Maia Cat", icon: "🐈" },
  { id: "vaporwave", label: "Vaporwave Cat", icon: "💜" },
];

const SPRITE_SETS: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

const BARK_PHRASES = [
  "Woof! 🐾",
  "Arf! 🦴",
  "Ruff ruff!",
  "*wags tail*",
  "Boop! ✨",
  "*pant pant*",
  "Hello friend!",
];

export function OnekoPet() {
  const [variant, setVariant] = useState<PetVariant>("dog");
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number }>({ x: 32, y: 32 });
  const [isClient, setIsClient] = useState(false);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBubble = (text: string, x: number, y: number, duration = 2000) => {
    setBubbleText(text);
    setBubblePos({ x, y });
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleText(null);
    }, duration);
  };

  useEffect(() => {
    setIsClient(true);

    // Disable pet on mobile touch devices to avoid touch gesture conflicts
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // Load saved variant from localStorage if any, otherwise default to dog
    let activeVariant: PetVariant = "dog";
    try {
      const saved = localStorage.getItem("oneko:variant");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (VARIANTS.some((v) => v.id === parsed)) {
          activeVariant = parsed;
          setVariant(parsed);
        }
      }
    } catch {}

    // Pet element setup
    const nekoEl = document.createElement("div");
    nekoEl.id = "portfolio-oneko-pet";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "auto";
    nekoEl.style.backgroundImage = `url('/oneko/oneko-${activeVariant}.gif')`;
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.zIndex = "9999";
    nekoEl.style.cursor = "grab";
    nekoEl.style.userSelect = "none";
    nekoEl.style.touchAction = "none";
    nekoEl.style.transition = "opacity 0.2s ease";

    // Initial positioning in visible area
    let nekoPosX = Math.min(window.innerWidth - 64, 80);
    let nekoPosY = Math.min(window.innerHeight - 64, 80);
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let forceSleep = false;
    let grabbing = false;
    let grabStop = true;
    let nudge = false;

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    document.body.appendChild(nekoEl);

    const setSprite = (name: string, frame: number) => {
      const set = SPRITE_SETS[name] || SPRITE_SETS.idle;
      const sprite = set[frame % set.length];
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    };

    const resetIdleAnimation = () => {
      idleAnimation = null;
      idleAnimationFrame = 0;
    };

    const idle = () => {
      idleTime += 1;

      // Random idle animations every few seconds when stopped
      if (idleTime > 10 && Math.floor(Math.random() * 180) === 0 && idleAnimation == null) {
        const availableAnimations = ["sleeping", "scratchSelf"];
        if (nekoPosX < 40) availableAnimations.push("scratchWallW");
        if (nekoPosY < 40) availableAnimations.push("scratchWallN");
        if (nekoPosX > window.innerWidth - 40) availableAnimations.push("scratchWallE");
        if (nekoPosY > window.innerHeight - 40) availableAnimations.push("scratchWallS");

        idleAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
      }

      if (forceSleep) {
        idleAnimation = "sleeping";
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8 && nudge && forceSleep) {
            setSprite("idle", 0);
            break;
          } else if (nudge) {
            nudge = false;
            resetIdleAnimation();
          }
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192 && !forceSleep) {
            resetIdleAnimation();
          }
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    };

    const nekoSpeed = 11;

    const frame = () => {
      frameCount += 1;

      if (grabbing) {
        if (grabStop) setSprite("alert", 0);
        return;
      }

      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.hypot(diffX, diffY);

      // Stopped when close to mouse
      if (distance < 48 && !forceSleep) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      // Alert delay when mouse suddenly moves away after being idle
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 6);
        idleTime -= 1;
        return;
      }

      // Calculate 8-direction running animation
      let direction = "";
      if (diffY / distance > 0.5) direction += "N";
      else if (diffY / distance < -0.5) direction += "S";

      if (diffX / distance > 0.5) direction += "W";
      else if (diffX / distance < -0.5) direction += "E";

      if (!direction) direction = "S";

      setSprite(direction, frameCount);

      // Move toward mouse position
      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;

      // Keep within viewport boundaries
      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    };

    // Track mouse movement
    const onMouseMove = (e: MouseEvent) => {
      if (forceSleep) return;
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };

    // Dragging support
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // only primary button
      e.preventDefault();
      grabbing = true;
      nekoEl.style.cursor = "grabbing";

      let startX = e.clientX;
      let startY = e.clientY;
      let startNekoX = nekoPosX;
      let startNekoY = nekoPosY;
      let grabInterval: NodeJS.Timeout;

      const onDragMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX > absDeltaY && absDeltaX > 10) {
          setSprite(deltaX > 0 ? "scratchWallW" : "scratchWallE", frameCount);
        } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
          setSprite(deltaY > 0 ? "scratchWallN" : "scratchWallS", frameCount);
        }

        if (grabStop || absDeltaX > 10 || absDeltaY > 10) {
          grabStop = false;
          clearTimeout(grabInterval);
          grabInterval = setTimeout(() => {
            grabStop = true;
            nudge = false;
            startX = moveEvent.clientX;
            startY = moveEvent.clientY;
            startNekoX = nekoPosX;
            startNekoY = nekoPosY;
          }, 150);
        }

        nekoPosX = startNekoX + (moveEvent.clientX - startX);
        nekoPosY = startNekoY + (moveEvent.clientY - startY);

        nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
        nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
      };

      const onDragEnd = () => {
        grabbing = false;
        nudge = true;
        nekoEl.style.cursor = "grab";
        resetIdleAnimation();
        window.removeEventListener("mousemove", onDragMove);
        window.removeEventListener("mouseup", onDragEnd);
      };

      window.addEventListener("mousemove", onDragMove);
      window.addEventListener("mouseup", onDragEnd);
    };

    // Single click for cute bark / speech bubble
    let clickTimeout: NodeJS.Timeout | null = null;
    nekoEl.addEventListener("click", () => {
      if (clickTimeout) clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        if (!grabbing) {
          const phrase = BARK_PHRASES[Math.floor(Math.random() * BARK_PHRASES.length)];
          showBubble(phrase, nekoPosX, nekoPosY - 24);
        }
      }, 200);
    });

    // Double click to toggle sleep / wake
    nekoEl.addEventListener("dblclick", () => {
      if (clickTimeout) clearTimeout(clickTimeout);
      forceSleep = !forceSleep;
      nudge = false;
      if (forceSleep) {
        showBubble("Zzz... 💤", nekoPosX, nekoPosY - 24);
      } else {
        resetIdleAnimation();
        showBubble("Awake! ⚡", nekoPosX, nekoPosY - 24);
      }
    });

    // Right click to cycle variant (Dog -> Classic Cat -> Tora -> Maia -> Vaporwave)
    nekoEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const currentIndex = VARIANTS.findIndex((v) => v.id === activeVariant);
      const nextIndex = (currentIndex + 1) % VARIANTS.length;
      activeVariant = VARIANTS[nextIndex].id;
      setVariant(activeVariant);
      try {
        localStorage.setItem("oneko:variant", JSON.stringify(activeVariant));
      } catch {}
      nekoEl.style.backgroundImage = `url('/oneko/oneko-${activeVariant}.gif')`;
      showBubble(
        `${VARIANTS[nextIndex].icon} ${VARIANTS[nextIndex].label}`,
        nekoPosX,
        nekoPosY - 24
      );
    });

    window.addEventListener("mousemove", onMouseMove);
    nekoEl.addEventListener("mousedown", onMouseDown);

    // Run animation frame tick at 100ms (~10 FPS retro style)
    const interval = setInterval(frame, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", onMouseMove);
      nekoEl.removeEventListener("mousedown", onMouseDown);
      if (nekoEl.parentNode) {
        nekoEl.parentNode.removeChild(nekoEl);
      }
    };
  }, []);

  if (!isClient) return null;

  return (
    <>
      {bubbleText && (
        <div
          className="fixed pointer-events-none z-[10000] px-2 py-0.5 rounded-full bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-[11px] font-mono tracking-tight font-medium shadow-md border border-white/10 dark:border-black/10 transition-transform duration-150 animate-in fade-in zoom-in-90"
          style={{
            left: `${bubblePos.x}px`,
            top: `${bubblePos.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {bubbleText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900/90 dark:border-t-zinc-100/90" />
        </div>
      )}
    </>
  );
}
