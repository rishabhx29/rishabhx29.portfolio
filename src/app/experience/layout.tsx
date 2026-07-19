import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional experience, engineering work, and contributions by Rishabh Tripathi.",
  alternates: { canonical: "/experience" },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
