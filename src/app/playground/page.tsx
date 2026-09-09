import React from "react";
import { Metadata } from "next";
import { PlaygroundCanvas } from "@/components/playground/PlaygroundCanvas";

export const metadata: Metadata = {
  title: "Playground & Architecture Field Notebook",
  description:
    "An interactive, infinite-canvas field notebook of Rishabh Tripathi's creative experiments, architectural notes, and side quests.",
  alternates: {
    canonical: "/playground",
  },
  openGraph: {
    title: "Playground & Field Notebook | Rishabh Tripathi Portfolio",
    description:
      "Interactive experiments and architecture sketches by Rishabh Tripathi.",
    url: "/playground",
  },
};

export default function PlaygroundPage() {
  return (
    <main className="w-full overflow-hidden">
      <PlaygroundCanvas />
    </main>
  );
}
