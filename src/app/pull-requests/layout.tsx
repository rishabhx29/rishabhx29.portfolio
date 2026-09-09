import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Open Source Contributions",
  description:
    "Pull requests and open-source contributions by Rishabh Tripathi (rishabhx29) across developer tools, web frameworks, and community initiatives.",
  alternates: { canonical: "/pull-requests" },
  openGraph: {
    title: "Open Source Contributions | Rishabh Tripathi Portfolio",
    description:
      "Pull requests and open-source contributions by Rishabh Tripathi (rishabhx29).",
    url: "/pull-requests",
  },
};

export default function PullRequestsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Open Source Contributions",
        item: new URL("/pull-requests", siteUrl).href,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
