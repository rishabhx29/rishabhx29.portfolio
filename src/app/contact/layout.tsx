import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rishabh Tripathi (rishabhx29) about software engineering opportunities, product collaborations, and open-source development.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Rishabh Tripathi Portfolio",
    description:
      "Get in touch with Rishabh Tripathi about software engineering opportunities, product collaborations, and open-source development.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
        name: "Contact",
        item: new URL("/contact", siteUrl).href,
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
