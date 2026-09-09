import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Engineering experience, roles, and open-source leadership by Rishabh Tripathi (rishabhx29) — Software Developer Intern at Ecera System, SSoC Project Admin, and GSSoC Contributor.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience | Rishabh Tripathi Portfolio",
    description:
      "Engineering experience, roles, and open-source leadership by full-stack developer Rishabh Tripathi.",
    url: "/experience",
  },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
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
        name: "Experience",
        item: new URL("/experience", siteUrl).href,
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
