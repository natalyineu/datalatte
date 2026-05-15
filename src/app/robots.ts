import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All crawlers — full access
      { userAgent: "*", allow: "/" },
      // AI crawlers — explicitly welcome (for llms.txt discovery)
      { userAgent: "GPTBot",         allow: "/" },
      { userAgent: "ChatGPT-User",   allow: "/" },
      { userAgent: "ClaudeBot",      allow: "/" },
      { userAgent: "anthropic-ai",   allow: "/" },
      { userAgent: "PerplexityBot",  allow: "/" },
      { userAgent: "Googlebot",      allow: "/" },
      { userAgent: "Bingbot",        allow: "/" },
    ],
    sitemap: "https://datalatte.pro/sitemap.xml",
    // llms.txt for AI crawlers — https://llmstxt.org
    // Accessible at: https://datalatte.pro/llms.txt
  };
}
