import React from "react";
import { Metadata } from "next";
import { PlaygroundCanvas } from "@/components/playground/PlaygroundCanvas";

export const metadata: Metadata = {
  title: "Architecture Field Notebook | Rishabh Tripathi",
  description: "A temporary, editable field notebook of Rishabh's work, ideas, images, and side quests.",
};

export default function PlaygroundPage() {
  return (
    <main className="w-full overflow-hidden">
      <PlaygroundCanvas />
    </main>
  );
}
