import type { MetadataRoute } from "next";

const baseUrl = "https://datalatte.pro";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/contact",
    "/blog",
    "/for/coffee-shops",
    "/for/hair-salons",
    "/for/pet-groomers",
    "/for/fitness-studios",
    "/services/google-ads",
    "/services/meta-ads",
    "/services/google-business-profile",
    "/services/local-seo",
    "/services/analytics",
    "/services/ai-agents",
    "/services/email-sms",
    "/services/social-media",
    "/services/website",
    "/blog/coffee-shops-dominate-google-maps",
    "/blog/hair-salon-instagram-bookings",
    "/blog/pet-groomer-google-ads-mistakes",
    "/blog/fitness-studio-year-round-marketing",
    "/blog/google-business-profile-optimization-checklist",
    "/blog/local-marketing-budget-guide",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/blog" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/blog/") ? 0.6 : 0.8,
  }));
}
