export type Impact = "breaking" | "high" | "medium" | "fyi";
export type Category = "meta" | "google" | "ai" | "tiktok" | "seo";
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

export const SIGNALS: Signal[] = [
  {
    slug: "meta-advantage-plus-local-ads",
    source: "Meta Newsroom",
    sourceUrl: "https://www.facebook.com/business/news",
    category: "meta",
    date: "2026-05-29",
    timeAgo: "3h ago",
    impact: "breaking",
    headline: "Meta Rolls Out AI Advantage+ to All Local Ad Accounts",
    summary:
      "Meta's AI bidding now automatically finds high-intent customers near your location — even on budgets as low as $5/day. Previously gated to mid-to-large advertisers.",
    body: [
      "Meta quietly expanded its Advantage+ Shopping campaigns to all advertisers globally, including local businesses running as little as $5/day. The system uses on-device signals and real-time intent data to find customers most likely to convert near your location — without you having to set up manual audience targeting.",
      "The rollout removes one of the biggest barriers local business owners faced with Meta ads: the need to understand ad sets, lookalike audiences, and interest stacks. Advantage+ collapses all that into a single toggle.",
      "Early tests by Meta show a 22% average reduction in cost-per-result compared to manual campaigns for local service categories including restaurants, salons, and fitness studios.",
      "The update also includes automatic creative variations — Meta will test up to 150 combinations of your headline, image, and CTA text to find the highest-performing variant for each user segment.",
    ],
    insight:
      "Enable Advantage+ on your next Instagram or Facebook campaign. Local businesses typically see 20–30% lower cost-per-click within the first two weeks. Start with a $10/day test budget for 7 days before scaling.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    slug: "google-ai-overviews-business-profiles",
    source: "Search Engine Journal",
    sourceUrl: "https://www.searchenginejournal.com",
    category: "google",
    date: "2026-05-29",
    timeAgo: "6h ago",
    impact: "high",
    headline: "Google AI Overviews Now Pull Directly from Business Profiles",
    summary:
      "Google's AI-generated summaries are surfacing hours, reviews, photos and services from Google Business Profiles — appearing above the traditional map pack.",
    body: [
      "Google confirmed that AI Overviews — the AI-generated answer blocks that appear at the top of search results — now actively pull structured data from Google Business Profiles when a local query is detected.",
      "This means a user searching 'best yoga studio near me open Sunday' could see an AI-generated response that includes your studio's name, hours, review score, and a specific service you offer — all before they scroll to the map or ads.",
      "The implication is significant: your GBP is no longer just a map pin. It's now a structured data source feeding Google's most prominent UI element. Incomplete or outdated profiles are being skipped in favour of competitors with richer, more accurate data.",
      "Google has not released specific ranking factors for GBP inclusion in AI Overviews, but SEO professionals are seeing strong correlation with: complete service menus, recent photos (within 30 days), a review score above 4.2, and a description that matches the search query's intent.",
    ],
    insight:
      "Audit your GBP description and service list this week. Add at least 3 recent photos, respond to your last 5 reviews, and make sure your hours are accurate. These directly influence AI Overview inclusion.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    slug: "tiktok-nearby-ad-format",
    source: "TikTok for Business",
    sourceUrl: "https://www.tiktok.com/business/en",
    category: "tiktok",
    date: "2026-05-28",
    timeAgo: "1d ago",
    impact: "medium",
    headline: "TikTok Launches 'Nearby' — Hyperlocal Ads That Target Within 5 Miles",
    summary:
      "TikTok's new ad format shows video ads exclusively to users physically within a radius you choose (1–10 miles). Minimum $20/day, no agency required.",
    body: [
      "TikTok has launched 'Nearby', a new ad placement available globally via TikTok Ads Manager. Unlike standard location targeting (which can only go down to city level), Nearby uses real-time device GPS to show ads only to users currently within your chosen radius — from 1 to 10 miles.",
      "The format sits in TikTok's dedicated 'Nearby' feed tab, which surfaces local content and business posts to users exploring what's around them. This is separate from the main For You Page, meaning your ad reaches users actively in a local-discovery mindset.",
      "The minimum spend is $20/day with no minimum contract. Creatives can be a standard vertical video (9:16) between 5 and 60 seconds. TikTok's Creative Assistant can generate a first draft from your business name and a few product photos.",
      "Early adopters in the coffee shop category are reporting foot traffic lifts of 8–15% during campaign windows, particularly for 'happy hour' style offers broadcast 30–60 minutes before the promotion period.",
    ],
    insight:
      "Run a 7-day Nearby test at $20/day. Film a 15-second walk-in video showing your space — authenticity outperforms polished ads on TikTok. Target a 2-mile radius and measure foot traffic vs. your baseline week.",
    niches: ["coffee", "salons", "fitness"],
  },
  {
    slug: "n8n-mcp-claude-review-automation",
    source: "n8n Blog",
    sourceUrl: "https://n8n.io/blog",
    category: "ai",
    date: "2026-05-28",
    timeAgo: "1d ago",
    impact: "medium",
    headline: "n8n's MCP Connector Lets You Auto-Reply to Reviews with Claude AI",
    summary:
      "n8n's new official MCP connector wires Claude directly into no-code workflows: new Google review → AI drafts a branded reply → posts automatically. Two-hour setup, no code.",
    body: [
      "n8n released an official Model Context Protocol (MCP) server connector for Claude, making it possible to use Claude as an AI agent inside n8n workflows without writing any code. The connector handles authentication, context passing, and response formatting automatically.",
      "The most immediately useful workflow for local businesses: connect your Google Business Profile via the GBP API → trigger on new review → pass review text + your business context to Claude → auto-post the reply (or route it to a Slack approval step first).",
      "This previously required either a developer or a paid service. The n8n community edition is free for up to 5 active workflows, and the MCP connector is included at no extra cost.",
      "Beyond reviews, the same setup can handle: drafting responses to DMs, generating weekly social posts from your bookings data, sending personalised follow-up emails to recent customers, and flagging negative sentiment mentions across platforms.",
    ],
    insight:
      "If you get 10+ Google reviews a month, this workflow pays for your time back immediately. Set it to draft replies for your approval — never auto-post without a human check step until you've reviewed 20–30 drafts.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
  {
    slug: "google-ads-profit-optimisation",
    source: "Google Ads Help Center",
    sourceUrl: "https://support.google.com/google-ads",
    category: "seo",
    date: "2026-05-27",
    timeAgo: "2d ago",
    impact: "fyi",
    headline: "Google Ads Profit Optimisation Bidding Now Works Under $1k/Month",
    summary:
      "Google's profit-margin bidding mode no longer needs large data volumes. It now works with 30+ conversions/month — accessible for local businesses on modest budgets.",
    body: [
      "Google quietly updated the minimum data requirements for Profit Optimisation bidding, its mode that optimises for actual margin rather than clicks or conversions. Previously the strategy required 50+ conversions per month and significant historical margin data — a threshold most small local businesses couldn't hit.",
      "The updated model now works with as few as 30 monthly conversions and can use product-level margin data you supply manually (e.g. 'bookings for facial = $45 margin, bookings for haircut = $22 margin'). Google then bids more aggressively for high-margin conversions and pulls back on low-margin ones.",
      "For businesses that track multiple service types in Google Ads — a salon with cuts, colours, and treatments, for example — this can meaningfully shift the mix of conversions Google drives toward your most profitable services.",
      "The feature requires conversion tracking to be set up correctly and margin data to be passed via conversion value rules. This is a one-time setup that takes 1–2 hours.",
    ],
    insight:
      "Only worth testing if you track conversions properly in Google Ads and have at least 2 different service types with different margins. Set up conversion value rules first, then pilot one campaign for 4 weeks before drawing conclusions.",
    niches: ["coffee", "salons", "pet", "fitness"],
  },
];

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
};

export function getSignalBySlug(slug: string): Signal | undefined {
  return SIGNALS.find((s) => s.slug === slug);
}

export function getAdjacentSignals(slug: string): {
  prev: Signal | null;
  next: Signal | null;
  index: number;
  total: number;
} {
  const index = SIGNALS.findIndex((s) => s.slug === slug);
  return {
    prev: index > 0 ? SIGNALS[index - 1] : null,
    next: index < SIGNALS.length - 1 ? SIGNALS[index + 1] : null,
    index,
    total: SIGNALS.length,
  };
}
