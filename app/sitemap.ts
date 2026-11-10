import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { containers } from "@/data/containers";
import { useCases } from "@/data/use-cases";
import { blogPosts } from "@/data/blog";

const lastModified = new Date("2026-11-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/containers", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/use-cases", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/size-guide", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/delivery", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${site.url}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...containers.map((container) => ({
      url: `${site.url}/containers/${container.slug}`,
      lastModified: new Date(container.addedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...useCases.map((useCase) => ({
      url: `${site.url}/use-cases/${useCase.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
