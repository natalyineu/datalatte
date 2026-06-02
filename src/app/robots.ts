import type { MetadataRoute } from "next";

// AI crawler user-agents — explicitly welcomed for llms.txt / RAG indexing
// Source: https://github.com/ai-robots-txt/ai.robots.txt
const AI_CRAWLERS = [
  // OpenAI / ChatGPT
  "GPTBot", "ChatGPT-User", "ChatGPT Agent", "OAI-SearchBot", "OpenAI", "Operator",
  // Anthropic / Claude
  "ClaudeBot", "Claude-User", "Claude-Web", "Claude-SearchBot", "anthropic-ai",
  // Google AI (Gemini, NotebookLM, Mariner)
  "Google-Extended", "Gemini-Deep-Research", "Google-NotebookLM", "NotebookLM",
  "GoogleAgent-Mariner", "Google-Agent", "Google-Gemini-CLI", "GoogleOther",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // DeepSeek
  "DeepSeekBot",
  // Meta AI
  "meta-externalagent", "Meta-ExternalAgent", "meta-externalfetcher",
  // Mistral
  "MistralAI-User",
  // Apple
  "Applebot", "Applebot-Extended",
  // Amazon / Bedrock
  "Amazonbot", "bedrockbot", "AmazonBuyForMe",
  // Microsoft / Azure
  "AzureAI-SearchBot",
  // You.com
  "YouBot",
  // DuckDuckGo
  "DuckAssistBot",
  // Brave
  "Bravebot",
  // Phind
  "PhindBot",
  // Tavily
  "TavilyBot",
  // Exa
  "ExaBot",
  // Cohere
  "cohere-ai",
  // Kagi
  "kagi-fetcher",
  // ByteDance / TikTok
  "Bytespider", "TikTokSpider", "imageSpider",
  // Cloudflare AI
  "Cloudflare-AutoRAG",
  // Linkup
  "LinkupBot",
  // Diffbot
  "Diffbot",
  // Yandex AI (Russia) — YandexGPT / Alice
  "YandexAdditional", "YandexAdditionalBot",
  // Huawei — PanGu LLM + Petal Search
  "PanguBot", "PetalBot",
  // Zhipu AI (China) — ChatGLM
  "ChatGLM-Spider",
  // iAsk (Chinese AI search)
  "iAskBot", "iaskspider", "iaskspider/2.0",
  // Common Crawl
  "CCBot",
  // Meta / Facebook link previews
  "facebookexternalhit",
  // Standard search
  "Googlebot", "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Block admin + API routes for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      // Explicit allow for every known AI crawler — belt-and-suspenders
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/", disallow: ["/admin", "/api/"] as string[] })),
    ],
    sitemap: [
      "https://datalatte.pro/sitemap.xml",
      "https://datalatte.pro/llms.txt",
    ],
  };
}
