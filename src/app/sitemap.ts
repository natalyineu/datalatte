import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const baseUrl = "https://datalatte.pro";
const contentDir = path.join(process.cwd(), "content/blog");

function getBlogRoutes() {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data } = matter(raw);
      return {
        url: `${baseUrl}/blog/${file.replace(".mdx", "")}`,
        lastModified: new Date(data.date as string),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for/coffee-shops`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for/hair-salons`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for/pet-groomers`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/for/fitness-studios`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/google-ads`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/meta-ads`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/google-business-profile`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/local-seo`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/analytics`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/ai-agents`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/email-sms`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/social-media`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services/website`, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  return [...staticRoutes, ...getBlogRoutes()];
}
