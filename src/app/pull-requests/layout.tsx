import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open-source contributions",
  description:
    "Pull requests and open-source contributions by Rishabh Tripathi across developer tools and web projects.",
  alternates: { canonical: "/pull-requests" },
};

export default function PullRequestsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
