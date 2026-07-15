import React from "react";
import { Metadata } from "next";
import { PlaygroundCanvas } from "@/components/playground/PlaygroundCanvas";

export const metadata: Metadata = {
  title: "Blueprint Playground | Rishabh Tripathi",
  description: "An interactive engineering sandbox to explore Rishabh's achievements, badges, architecture banners, and tech stack tokens on an infinite draggable canvas.",
};

export default function PlaygroundPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-zinc-950">
      <PlaygroundCanvas />
    </main>
  );
}
