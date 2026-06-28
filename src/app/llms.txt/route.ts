export const dynamic = "force-static";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fetchPublishedSignals } from "@/lib/radar-signals";

const BASE = "https://datalatte.pro";
const contentDir = path.join(process.cwd(), "content/blog");

const NICHE_PAGES = [
  { slug: "coffee-shops",       label: "Coffee Shops" },
  { slug: "hair-salons",        label: "Hair & Beauty Salons" },
  { slug: "pet-groomers",       label: "Pet Groomers" },
  { slug: "fitness-studios",    label: "Fitness Studios" },
  { slug: "restaurants",        label: "Restaurants" },
  { slug: "dentists",           label: "Dentists" },
  { slug: "barbershops",        label: "Barbershops" },
  { slug: "nail-salons",        label: "Nail Salons" },
  { slug: "yoga-studios",       label: "Yoga Studios" },
  { slug: "cleaning-services",  label: "Cleaning Services" },
  { slug: "real-estate-agents", label: "Real Estate Agents" },
  { slug: "electricians",       label: "Electricians" },
  { slug: "plumbers",           label: "Plumbers" },
  { slug: "startups",           label: "Startups" },
  { slug: "freelancers",        label: "Freelancers" },
  { slug: "medium-business",    label: "Medium-Sized Businesses" },
  { slug: "enterprise",         label: "Enterprise & Agencies" },
  { slug: "multi-location",     label: "Multi-Location Businesses" },
];

const SERVICE_PAGES = [
  { slug: "google-ads",              label: "Google Ads Management" },
  { slug: "meta-ads",                label: "Meta Ads (Facebook & Instagram)" },
  { slug: "tiktok-ads",              label: "TikTok Ads" },
  { slug: "local-seo",               label: "Local SEO" },
  { slug: "google-business-profile", label: "Google Business Profile Optimization" },
  { slug: "analytics",               label: "Marketing Analytics & Reporting" },
  { slug: "ai-agents",               label: "AI Agents & Automation" },
  { slug: "email-sms",               label: "Email & SMS Marketing" },
  { slug: "social-media",            label: "Social Media Management" },
  { slug: "website",                 label: "Website & Landing Pages" },
  { slug: "programmatic",            label: "Programmatic Advertising" },
  { slug: "content-marketing",       label: "Content Marketing" },
  { slug: "video-marketing",         label: "Video Marketing" },
  { slug: "reputation-management",   label: "Reputation Management" },
  { slug: "cro",                     label: "Conversion Rate Optimisation" },
  { slug: "competitor-analysis",     label: "Competitor Analysis" },
];

const CHECKLIST_PAGES = [
  { slug: "google-business-profile", label: "Google Business Profile Optimization Checklist" },
  { slug: "local-seo-audit",         label: "Local SEO Audit Checklist" },
  { slug: "google-ads-setup",        label: "Google Ads Setup Checklist" },
  { slug: "meta-ads-setup",          label: "Meta Ads Setup Checklist" },
  { slug: "website-cro",             label: "Website CRO Checklist" },
  { slug: "email-marketing",         label: "Email Marketing Checklist" },
  { slug: "social-media-content",    label: "Social Media Content Checklist" },
  { slug: "coffee-shop-marketing",   label: "Coffee Shop Marketing Checklist" },
  { slug: "hair-salon-marketing",    label: "Hair Salon Marketing Checklist" },
  { slug: "reputation-management",   label: "Reputation Management Checklist" },
  { slug: "pet-groomer-marketing",   label: "Pet Groomer Marketing Checklist" },
  { slug: "fitness-studio-marketing",label: "Fitness Studio Marketing Checklist" },
  { slug: "restaurant-marketing",    label: "Restaurant Marketing Checklist" },
  { slug: "dentist-marketing",       label: "Dentist Marketing Checklist" },
  { slug: "cleaning-service-marketing", label: "Cleaning Service Marketing Checklist" },
  { slug: "real-estate-marketing",   label: "Real Estate Marketing Checklist" },
];

const TOOL_PAGES = [
  { slug: "marketing-budget-calculator", label: "Marketing Budget Calculator — free tool for local businesses" },
  { slug: "local-seo-grader",            label: "Local SEO Grader — audit your local search presence" },
  { slug: "ai-agent-builder",            label: "AI Agent Builder — automate customer interactions" },
];

function getBlogCategories(): string[] {
  const cats = new Set<string>();
  fs.readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .forEach((f) => {
      const { data } = matter(fs.readFileSync(path.join(contentDir, f), "utf8"));
      if (data.category) cats.add(String(data.category));
    });
  return [...cats].sort();
}

function getAllBlogPosts(): { slug: string; title: string }[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  const posts: { slug: string; title: string; date: string }[] = [];

  for (const file of files) {
    const { data } = matter(fs.readFileSync(path.join(contentDir, file), "utf8"));
    posts.push({
      slug: file.replace(".mdx", ""),
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
    });
  }

  return posts
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ slug, title }) => ({ slug, title }));
}

export async function GET(req: Request) {
  const ua = req.headers.get("user-agent") ?? "unknown";
  console.log(`[llms.txt] ${new Date().toISOString()} ua="${ua}"`);
  const topPosts = getAllBlogPosts();
  const categories = getBlogCategories();

  let radarLines: string[] = [];
  try {
    const signals = await fetchPublishedSignals();
    if (signals.length > 0) {
      radarLines = [
        `## Marketing Radar — Recent Insights`,
        ``,
        ...signals.slice(0, 20).map((s) => `- [${s.headline ?? s.slug}](${BASE}/radar/${s.slug})`),
        ``,
      ];
    }
  } catch {
    // Radar unavailable — skip section
  }

  const lines: string[] = [
    `# DataLatte — Data-Driven Local Marketing for Small Businesses`,
    ``,
    `> DataLatte (datalatte.pro) is a digital marketing consultancy founded by Nataliia Makota — a senior marketing strategist with 10+ years experience at OMD, Dentsu, BBDO, and GroupM. We help local small businesses in the US, UK, Australia, and Canada grow with performance marketing: Google Ads, Meta Ads, Local SEO, Google Business Profile, AI automation, and analytics.`,
    ``,
    `## Core Pages`,
    ``,
    `- [Homepage](${BASE}): Overview of services and value proposition for local businesses`,
    `- [About Nataliia](${BASE}/about): Founder background, experience, and approach`,
    `- [Services overview](${BASE}/services): Full list of marketing services offered`,
    `- [Blog](${BASE}/blog): 1500+ how-to guides and strategies for local business marketing`,
    `- [Free marketing checklists](${BASE}/checklists): Step-by-step checklists for Google Ads, SEO, Meta Ads, and more`,
    `- [Marketing Radar](${BASE}/radar): Weekly local marketing insights and trends`,
    `- [Contact / Free Audit](${BASE}/contact): Get a free marketing audit`,
    `- [Free Audit](${BASE}/free-audit): Request a free local marketing audit`,
    `- [Pricing](${BASE}/pricing): Service pricing and packages`,
    `- [Case Studies](${BASE}/case-studies): Real results from local business marketing campaigns`,
    `- [Results](${BASE}/results): Performance benchmarks and client outcomes`,
    `- [Resources](${BASE}/resources): Free marketing resources for small businesses`,
    `- [Reporting](${BASE}/reporting): Marketing analytics and reporting services`,
    `- [Freelance vs Agency](${BASE}/compare/freelance-vs-agency): Compare hiring a freelancer vs a marketing agency`,
    ``,
    `## Services`,
    ``,
    ...SERVICE_PAGES.map(({ slug, label }) => `- [${label}](${BASE}/services/${slug})`),
    ``,
    `## Industry Niche Pages`,
    ``,
    ...NICHE_PAGES.map(({ slug, label }) => `- [Marketing for ${label}](${BASE}/for/${slug})`),
    ``,
    `## Free Tools`,
    ``,
    ...TOOL_PAGES.map(({ slug, label }) => `- [${label}](${BASE}/tools/${slug})`),
    ``,
    `## Marketing Checklists`,
    ``,
    ...CHECKLIST_PAGES.map(({ slug, label }) => `- [${label}](${BASE}/checklists/${slug})`),
    ``,
    `## Blog Categories`,
    ``,
    ...categories.map((cat) => {
      const slug = cat.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      return `- [${cat}](${BASE}/blog/category/${slug})`;
    }),
    ``,
    ...radarLines,
    `## Blog — All Articles`,
    ``,
    ...topPosts.map(({ slug, title }) => `- [${title}](${BASE}/blog/${slug})`),
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
