import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { getPosts } from "@/lib/blog";

export const dynamic = "force-static";

// Built from the content modules, so new services, cities and posts show up
// here automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "monthly"],
    ["/services", 0.9, "monthly"],
    ["/service-areas", 0.8, "monthly"],
    ["/quote", 0.9, "yearly"],
    ["/reviews", 0.7, "weekly"],
    ["/gallery", 0.6, "monthly"],
    ["/about", 0.6, "yearly"],
    ["/contact", 0.7, "yearly"],
    ["/faq", 0.6, "monthly"],
    ["/blog", 0.6, "weekly"],
    ["/careers", 0.4, "monthly"],
    ["/privacy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
  ];

  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({
      url: absoluteUrl(path),
      priority,
      changeFrequency,
    })),
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      priority: 0.9,
      changeFrequency: "monthly" as const,
    })),
    ...cities.map((c) => ({
      url: absoluteUrl(`/service-areas/${c.slug}`),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...getPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(`${p.date}T12:00:00`),
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
  ];
}
