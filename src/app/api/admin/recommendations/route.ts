import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const CLUSTERS_PATH  = path.join(process.cwd(), "seo-research/02-keyword-clusters-expanded.md");
const PAA_PATH       = path.join(process.cwd(), "seo-research/serpapi-raw/paa-all.json");
const AUTOCOMPLETE_PATH = path.join(process.cwd(), "seo-research/serpapi-raw/autocomplete-expanded.json");
const QUEUE_PATH     = path.join(process.cwd(), "content/queue.json");
const INDEX_PATH     = path.join(process.cwd(), "content/blog/INDEX.md");

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Recommendation {
  title: string;
  slug: string;
  primaryKeyword: string;
  cluster: string;
  targetWords: number;
  source: "cluster" | "paa" | "autocomplete";
}

// ── Slug helpers ──────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ── Get existing slugs ────────────────────────────────────────────────────────

function getExistingSlugs(): Set<string> {
  const slugs = new Set<string>();

  // From INDEX.md
  try {
    const raw = fs.readFileSync(INDEX_PATH, "utf8");
    const lines = raw.split("\n");
    const headerIdx = lines.findIndex((l) => l.startsWith("| Slug"));
    if (headerIdx !== -1) {
      lines
        .slice(headerIdx + 2)
        .filter((l) => l.startsWith("|"))
        .forEach((line) => {
          const cols = line.split("|").map((c) => c.trim()).filter(Boolean);
          if (cols.length >= 1) slugs.add(cols[0].replace(/`/g, ""));
        });
    }
  } catch { /* ignore */ }

  // From queue.json
  try {
    const q = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8")) as {
      queue: Array<{ slug: string }>;
    };
    q.queue.forEach((e) => slugs.add(e.slug));
  } catch { /* ignore */ }

  return slugs;
}

// ── Parse cluster file → article candidates ───────────────────────────────────

function parseClusterArticles(): Array<{
  title: string;
  cluster: string;
  primaryKeyword: string;
  targetWords: number;
}> {
  const results: Array<{
    title: string;
    cluster: string;
    primaryKeyword: string;
    targetWords: number;
  }> = [];

  try {
    const md = fs.readFileSync(CLUSTERS_PATH, "utf8");
    const lines = md.split("\n");

    let currentCluster = "";
    let currentSeed = "";
    let inPrioritySection = false;

    // Target word counts per cluster type (more competitive = more words)
    const clusterWordCounts: Record<string, number> = {
      "Google Ads": 2000,
      "Local SEO": 1800,
      "Facebook Ads": 1800,
      "Marketing Automation": 1600,
      "Google Business Profile": 1800,
      "Influencer Marketing": 1600,
      "Email Marketing for Coffee": 1500,
      "Responsive Search Ads": 1500,
      "Dog Grooming": 1600,
      "Email Marketing": 1800,
    };

    function getTargetWords(clusterName: string): number {
      for (const [key, val] of Object.entries(clusterWordCounts)) {
        if (clusterName.toLowerCase().includes(key.toLowerCase())) return val;
      }
      return 1600;
    }

    for (const line of lines) {
      // Cluster header: ## CLUSTER X — Name
      const clusterMatch = line.match(/^## CLUSTER \d+ — (.+)/);
      if (clusterMatch) {
        currentCluster = clusterMatch[1]
          .trim()
          .replace(/\s*\(.*?\)\s*$/, "")  // strip trailing (breakout) etc
          .replace(/\s*🚨.*$/, "")         // strip emojis
          .trim();
        inPrioritySection = false;
        continue;
      }

      // Seed keyword
      const seedMatch = line.match(/\*\*Seed:\*\* "(.+?)"/);
      if (seedMatch) {
        currentSeed = seedMatch[1].trim();
        continue;
      }

      // Priority titles section start
      if (line.includes("### Priority Article Titles")) {
        inPrioritySection = true;
        continue;
      }

      // Any other ### ends the priority section
      if (line.startsWith("###") && !line.includes("Priority Article Titles")) {
        inPrioritySection = false;
        continue;
      }

      // Parse numbered article titles: 1. **"Title"** or 1. 💡 **"Title"**
      if (inPrioritySection) {
        const titleMatch = line.match(/^\d+\.\s+(?:💡\s+)?(?:🏷️\s+)?\*\*"(.+?)"\*\*/);
        if (titleMatch) {
          const title = titleMatch[1].trim();
          // Skip service page hints
          if (title.toLowerCase().includes("service page")) continue;

          results.push({
            title,
            cluster: currentCluster,
            primaryKeyword: currentSeed,
            targetWords: getTargetWords(currentCluster),
          });
        }
      }
    }
  } catch { /* return empty on error */ }

  return results;
}

// ── Parse PAA → bonus article ideas ──────────────────────────────────────────

function parsePAAArticles(): Array<{
  title: string;
  cluster: string;
  primaryKeyword: string;
  targetWords: number;
}> {
  const results: Array<{
    title: string;
    cluster: string;
    primaryKeyword: string;
    targetWords: number;
  }> = [];

  try {
    const raw = JSON.parse(fs.readFileSync(PAA_PATH, "utf8")) as {
      data: Record<string, Array<{ question: string }>>;
    };

    // High-value PAA questions that make good standalone articles
    const highValueKeywords = [
      "how to set up google ads",
      "how much does google ads cost",
      "email marketing for coffee",
      "how to market a coffee shop",
      "how to get more clients",
      "local seo for restaurants",
    ];

    for (const [kw, items] of Object.entries(raw.data)) {
      const isHighValue = highValueKeywords.some((hv) =>
        kw.toLowerCase().includes(hv)
      );
      if (!isHighValue) continue;

      for (const item of items.slice(0, 2)) {
        const q = item.question;
        // Convert question to article title
        const title = q.endsWith("?")
          ? q.slice(0, -1) + " — Complete Guide for 2026"
          : q + " — Guide for 2026";

        results.push({
          title,
          cluster: "Google Ads for Small Business",
          primaryKeyword: kw,
          targetWords: 1400,
        });
      }
    }
  } catch { /* ignore */ }

  return results;
}

// ── Parse autocomplete → bonus article ideas ──────────────────────────────────

function parseAutocompleteArticles(): Array<{
  title: string;
  cluster: string;
  primaryKeyword: string;
  targetWords: number;
}> {
  const results: Array<{
    title: string;
    cluster: string;
    primaryKeyword: string;
    targetWords: number;
  }> = [];

  try {
    const raw = JSON.parse(fs.readFileSync(AUTOCOMPLETE_PATH, "utf8")) as {
      data: Record<
        string,
        { base?: string[]; how?: string[]; what?: string[]; why?: string[] }
      >;
    };

    const clusterMap: Record<string, { cluster: string; words: number }> = {
      "influencer marketing for salons": {
        cluster: "Influencer Marketing for Salons",
        words: 1600,
      },
      "email marketing for coffee shops": {
        cluster: "Email Marketing for Coffee Shops",
        words: 1500,
      },
      "responsive search ads small business": {
        cluster: "Responsive Search Ads",
        words: 1500,
      },
    };

    for (const [seed, suggestions] of Object.entries(raw.data)) {
      const meta = clusterMap[seed];
      if (!meta) continue;

      const allSugs = [
        ...(suggestions.how ?? []),
        ...(suggestions.what ?? []),
        ...(suggestions.base ?? []),
      ].slice(0, 3);

      for (const sug of allSugs) {
        if (sug.length < 15 || sug.length > 80) continue;
        const title =
          sug.charAt(0).toUpperCase() +
          sug.slice(1) +
          (sug.endsWith("?") ? "" : ": The 2026 Guide");

        results.push({
          title,
          cluster: meta.cluster,
          primaryKeyword: sug,
          targetWords: meta.words,
        });
      }
    }
  } catch { /* ignore */ }

  return results;
}

// ── GET /api/admin/recommendations ───────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const existingSlugs = getExistingSlugs();

    // Gather candidates from all sources
    const clusterArticles  = parseClusterArticles();
    const paaArticles      = parsePAAArticles();
    const autoArticles     = parseAutocompleteArticles();

    const allCandidates = [
      ...clusterArticles.map((a) => ({ ...a, source: "cluster" as const })),
      ...paaArticles.map((a) => ({ ...a, source: "paa" as const })),
      ...autoArticles.map((a) => ({ ...a, source: "autocomplete" as const })),
    ];

    // Deduplicate by slug and filter out existing
    const seen = new Set<string>();
    const recommendations: Recommendation[] = [];

    for (const candidate of allCandidates) {
      const slug = toSlug(candidate.title);
      if (seen.has(slug)) continue;
      if (existingSlugs.has(slug)) continue;

      seen.add(slug);
      recommendations.push({
        title: candidate.title,
        slug,
        primaryKeyword: candidate.primaryKeyword,
        cluster: candidate.cluster,
        targetWords: candidate.targetWords,
        source: candidate.source,
      });

      if (recommendations.length >= 15) break;
    }

    return NextResponse.json(
      { recommendations, total: recommendations.length },
      { status: 200 }
    );
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
