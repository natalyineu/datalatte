import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CITIES, NICHES, SERVICE_SEGMENT_SLUGS } from "@/lib/locationData";
import { fetchPublishedSignals } from "@/lib/radar-signals";

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
  let popularity: Record<string, number> = {};
  const popPath = path.join(contentDir, "popularity.json");
  if (fs.existsSync(popPath)) {
    try { popularity = JSON.parse(fs.readFileSync(popPath, "utf8")); } catch { /* ignore */ }
  }

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data } = matter(raw);
      const parsed = new Date(data.date as string);
      const impressions = popularity[slug] ?? 0;
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: !isNaN(parsed.getTime()) ? parsed : new Date(),
        changeFrequency: "monthly" as const,
        priority: impressions > 100 ? 0.9 : impressions >= 10 ? 0.8 : 0.7,
      };
    })
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

async function getRadarRoutes(): Promise<MetadataRoute.Sitemap> {
  try {
    const signals = await fetchPublishedSignals();
    return signals.map((s) => ({
      url: `${baseUrl}/radar/${s.slug}`,
      lastModified: new Date(s.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogRoutes = getBlogRoutes();
  const latestPost = blogRoutes[0]?.lastModified ?? new Date();
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,                                        lastModified: today,      changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/blog`,                              lastModified: latestPost, changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/contact`,                           lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`,                             lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/radar`,                             lastModified: today,      changeFrequency: "daily",   priority: 0.8 },
    { url: `${baseUrl}/radar/feed.xml`,                    lastModified: today,      changeFrequency: "daily",   priority: 0.5 },
    // Niche pages
    { url: `${baseUrl}/for/coffee-shops`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/hair-salons`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/pet-groomers`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/fitness-studios`,               lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/restaurants`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/dentists`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/cleaning-services`,             lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/real-estate-agents`,            lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/barbershops`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/nail-salons`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/yoga-studios`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/electricians`,                  lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/for/plumbers`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/for/startups`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/freelancers`,                   lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/medium-business`,               lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for/enterprise`,                    lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
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
    { url: `${baseUrl}/services/content-marketing`,        lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/cro`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/video-marketing`,          lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/reputation-management`,    lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/tiktok-ads`,               lastModified: today,      changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services/competitor-analysis`,      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Checklists
    { url: `${baseUrl}/checklists`,                                         lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    // Tools
    { url: `${baseUrl}/tools/marketing-budget-calculator`, lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools/ai-agent-builder`,            lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tools/local-seo-grader`,            lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    // New content pages
    { url: `${baseUrl}/pricing`,                           lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/case-studies`,                      lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/results`,                           lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resources`,                         lastModified: today,      changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/for/multi-location`,                lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compare/freelance-vs-agency`,       lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services/programmatic`,             lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`,                            lastModified: today,      changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/reporting`,                          lastModified: today,      changeFrequency: "monthly", priority: 0.8 },
    // Legal
    { url: `${baseUrl}/privacy`,                            lastModified: today,      changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/terms`,                              lastModified: today,      changeFrequency: "yearly",  priority: 0.3 },
  ];

  const categoryRoutes = getCategoryRoutes();
  const radarRoutes = await getRadarRoutes();

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

  // Niche × service intersection pages
  const nicheServiceRoutes: MetadataRoute.Sitemap = [];
  for (const niche of NICHES) {
    for (const serviceSlug of SERVICE_SEGMENT_SLUGS) {
      nicheServiceRoutes.push({
        url: `${baseUrl}/for/${niche}/${serviceSlug}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  return [...staticRoutes, ...radarRoutes, ...locationRoutes, ...nicheServiceRoutes, ...categoryRoutes, ...blogRoutes];
}
