import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const baseUrl = "https://datalatte.pro";
const contentDir = path.join(process.cwd(), "content/blog");

function getBlogRoutes(): MetadataRoute.Sitemap {
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
        priority: 0.7,
      };
    })
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = getBlogRoutes();
  const latestPost = blogRoutes[0]?.lastModified ?? new Date();
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                                        lastModified: today,      changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/blog`,                              lastModified: latestPost, changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/contact`,                           lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`,                             lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Niche pages
    { url: `${baseUrl}/for/coffee-shops`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/hair-salons`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/pet-groomers`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/fitness-studios`,               lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Service pages
    { url: `${baseUrl}/services/google-ads`,               lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/meta-ads`,                 lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/google-business-profile`,  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/local-seo`,                lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/analytics`,                lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/ai-agents`,                lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/email-sms`,                lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/social-media`,             lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/website`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
  ];

  return [...staticRoutes, ...blogRoutes];
}
