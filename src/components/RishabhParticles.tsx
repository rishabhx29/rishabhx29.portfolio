"use client";

import { useTheme } from "next-themes";
import { InteractiveParticles } from "@/components/ui/interactive-particles";

export function RishabhParticles() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <InteractiveParticles
      src="/Rishabh.png"
      allowUpload={false}
      background={isDark ? "#000000" : "#ffffff"}
      color={isDark ? "#a1a1aa" : "#52525b"}
      size={0.9}
      randomness={1.5}
      depth={2.0}
      touchRadius={0.25}
      threshold={34}
      maxDimension={1000}
      scaleMultiplier={0.98}
      className="h-full w-full"
    />
  );
}
