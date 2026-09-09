import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogsData";
import { projectsData } from "@/data/projectsData";
import { siteUrl } from "@/lib/site";

const route = (path: string) => new URL(path, siteUrl).href;

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: route("/"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: route("/projects"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: route("/experience"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: route("/pull-requests"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: route("/resume"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: route("/contact"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: route("/playground"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectPages = projectsData.map((project) => ({
    url: route(`/projects/${project.slug}`),
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: route(`/blogs/${post.slug}`),
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
