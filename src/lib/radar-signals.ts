import { supabase } from "./supabase";

export type Impact = "breaking" | "high" | "medium" | "fyi";
export type Category = "meta" | "google" | "ai" | "tiktok" | "seo" | "ctv";
export type Niche = "coffee" | "salons" | "pet" | "fitness";

export interface Signal {
  slug: string;
  source: string;
  sourceUrl: string;
  category: Category;
  date: string;
  timeAgo: string;
  impact: Impact;
  headline: string;
  summary: string;
  body: string[];
  insight: string;
  niches: Niche[];
}

export const NICHE_LABELS: Record<Niche, string> = {
  coffee: "☕ Coffee Shops",
  salons: "💇 Hair & Beauty",
  pet: "🐾 Pet Groomers",
  fitness: "🏋️ Fitness Studios",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  meta: "Meta / Instagram",
  google: "Google",
  ai: "AI & Automation",
  tiktok: "TikTok",
  seo: "SEO",
  ctv: "CTV / OTT / DOOH",
};

function toTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function rowToSignal(row: Record<string, unknown>): Signal {
  return {
    slug: row.slug as string,
    source: row.source as string,
    sourceUrl: row.source_url as string,
    category: row.category as Category,
    date: (row.published_at as string).slice(0, 10),
    timeAgo: toTimeAgo(row.published_at as string),
    impact: row.impact as Impact,
    headline: row.headline as string,
    summary: row.summary as string,
    body: row.body as string[],
    insight: row.insight as string,
    niches: row.niches as Niche[],
  };
}

/**
 * strict: for pages that are re-rendered on a timer (ISR). A database error or an empty result throws, so Next keeps
 * serving the last good page instead of replacing it with an empty Radar. Without it, errors quietly return [].
 */
export async function fetchPublishedSignals(opts: { strict?: boolean } = {}): Promise<Signal[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const { data, error } = await supabase
    .from("radar_signals")
    .select("slug,source,source_url,category,published_at,updated_at,impact,headline,summary,body,insight,niches")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    if (opts.strict) throw new Error(`radar_signals query failed: ${error.message}`);
    return [];
  }
  if (opts.strict && (data ?? []).length === 0) throw new Error("radar_signals returned no published rows; keeping the previous page");
  return (data ?? []).map(rowToSignal);
}

export async function fetchSignalBySlug(slug: string): Promise<Signal | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const { data, error } = await supabase
    .from("radar_signals")
    .select("slug,source,source_url,category,published_at,updated_at,impact,headline,summary,body,insight,niches")
    .eq("status", "published")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return rowToSignal(data as Record<string, unknown>);
}

export function getAdjacentSignals(
  signals: Signal[],
  slug: string,
): { prev: Signal | null; next: Signal | null; index: number; total: number } {
  const index = signals.findIndex((s) => s.slug === slug);
  return {
    prev: index > 0 ? signals[index - 1] : null,
    next: index < signals.length - 1 ? signals[index + 1] : null,
    index,
    total: signals.length,
  };
}
