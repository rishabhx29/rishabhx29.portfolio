import type { Metadata } from "next";
import { projectsData } from "@/data/projectsData";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Featured software engineering projects by Rishabh Tripathi (rishabhx29), including AlgoForge (DSA learning platform), Traceon (AI codebase analysis), and EduPulse (LMS).",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Rishabh Tripathi Portfolio",
    description:
      "Featured software engineering projects by Rishabh Tripathi (rishabhx29), including AlgoForge, Traceon, and EduPulse.",
    url: "/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const projectsJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects | Rishabh Tripathi Portfolio",
    description:
      "Featured full-stack web applications, developer tools, and open-source projects by Rishabh Tripathi.",
    url: new URL("/projects", siteUrl).href,
    author: {
      "@type": "Person",
      name: siteName,
      url: siteUrl.origin,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projectsData.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.description,
          url: new URL(`/projects/${project.slug}`, siteUrl).href,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      {children}
    </>
  );
}
