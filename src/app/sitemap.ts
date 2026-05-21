import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CITIES, NICHES } from "@/lib/locationData";

const baseUrl = "https://datalatte.pro";
const contentDir = path.join(process.cwd(), "content/blog");

function getCategoryRoutes(): MetadataRoute.Sitemap {
  const cats = new Set<string>();
  fs.readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .forEach((f) => {
      const { data } = matter(fs.readFileSync(path.join(contentDir, f), "utf8"));
      if (data.category) cats.add(data.category as string);
    });
  return [...cats].map((cat) => {
    const slug = cat.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return {
      url: `${baseUrl}/blog/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });
}

function getBlogRoutes(): MetadataRoute.Sitemap {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data } = matter(raw);
      // Use lastModified (set by caretaker on enrichment) if present, fall back to publish date
      const modStr = (data.lastModified as string | undefined) ?? (data.date as string);
      const parsed = new Date(modStr);
      const publishDate = new Date(data.date as string);
      const isRecentlyUpdated = !isNaN(parsed.getTime()) &&
        (parsed.getTime() - publishDate.getTime()) > 24 * 60 * 60 * 1000; // updated after publish
      return {
        url: `${baseUrl}/blog/${file.replace(".mdx", "")}`,
        lastModified: !isNaN(parsed.getTime()) ? parsed : new Date(),
        changeFrequency: isRecentlyUpdated ? ("weekly" as const) : ("monthly" as const),
        priority: 0.7,
      };
    })
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

const POSTS_PER_PAGE = 24;

function getBlogPaginationRoutes(totalPosts: number, latestPost: Date): MetadataRoute.Sitemap {
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const routes: MetadataRoute.Sitemap = [];
  // Start from page 2 (page 1 is /blog, already in staticRoutes)
  for (let p = 2; p <= totalPages; p++) {
    routes.push({
      url: `${baseUrl}/blog?page=${p}`,
      lastModified: latestPost,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    });
  }
  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = getBlogRoutes();
  const latestPost = blogRoutes[0]?.lastModified ?? new Date();
  const today = new Date();

  // Count total MDX files for pagination
  const totalPosts = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx")).length;
  const latestPostDate = latestPost instanceof Date ? latestPost : new Date(latestPost);
  const paginationRoutes = getBlogPaginationRoutes(totalPosts, latestPostDate);

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
    { url: `${baseUrl}/for/restaurants`,                    lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/dentists`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/cleaning-services`,             lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/real-estate-agents`,            lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/startups`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/freelancers`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/medium-business`,               lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/enterprise`,                    lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Lead gen
    { url: `${baseUrl}/free-audit`,                        lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
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
    // Tools
    { url: `${baseUrl}/tools/marketing-budget-calculator`, lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools/ai-agent-builder`,            lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Legal
    { url: `${baseUrl}/privacy`,                            lastModified: today,      changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,                              lastModified: today,      changeFrequency: "yearly",  priority: 0.3 },
  ];

  const categoryRoutes = getCategoryRoutes();

  const locationRoutes: MetadataRoute.Sitemap = [];
  for (const niche of NICHES) {
    for (const city of CITIES) {
      locationRoutes.push({
        url: `${baseUrl}/for/${niche}/${city.slug}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...paginationRoutes, ...locationRoutes, ...categoryRoutes, ...blogRoutes];
}
