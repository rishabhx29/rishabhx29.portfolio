import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogsData";
import { projectsData } from "@/data/projectsData";
import { siteUrl } from "@/lib/site";

const route = (path: string) => new URL(path, siteUrl).href;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: route("/"), changeFrequency: "weekly", priority: 1 },
    { url: route("/projects"), changeFrequency: "monthly", priority: 0.9 },
    { url: route("/experience"), changeFrequency: "monthly", priority: 0.8 },
    { url: route("/pull-requests"), changeFrequency: "weekly", priority: 0.8 },
    { url: route("/resume"), changeFrequency: "monthly", priority: 0.7 },
    { url: route("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: route("/playground"), changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages = projectsData.map((project) => ({
    url: route(`/projects/${project.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: route(`/blogs/${post.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
