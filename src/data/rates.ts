// Benchmarks and price points used across DataLatte articles. Every row links to the article that discusses it
// and names its source. "confidence" says how the figure was obtained:
//   report       – read directly on the publisher's own page
//   rate-card    – read on the vendor's own pricing page
//   second-hand  – quoted by a roundup; original page could not be opened
//   estimate     – vendor or agency estimate, not a measured rate
export type Confidence = "report" | "rate-card" | "second-hand" | "estimate";

export interface BenchmarkRow {
  channel: "Google Search" | "Meta (Facebook & Instagram)";
  category: string;
  cpc?: string;
  ctr?: string;
  conv?: string;
  cpl?: string;
  note?: string;
  source: { name: string; url: string };
  confidence: Confidence;
  article: string; // blog slug
}

export interface PriceRow {
  group: "SEO & local tools" | "Booking & websites" | "Automation" | "Audio, TV & other ads";
  item: string;
  price: string;
  basis: string;
  source: { name: string; url: string };
  confidence: Confidence;
  article: string;
}

export const AS_OF = "October 2026";

const LIQ_SEARCH = { name: "LocaliQ Search Advertising Benchmarks 2026", url: "https://localiq.com/blog/search-advertising-benchmarks/" };
const LIQ_HEALTH = { name: "LocaliQ Healthcare Search Benchmarks", url: "https://localiq.com/blog/healthcare-search-advertising-benchmarks/" };
const LIQ_FB = { name: "LocaliQ Facebook Advertising Benchmarks 2026", url: "https://localiq.com/blog/facebook-advertising-benchmarks/" };
const WT_FIT = { name: "Webtonic fitness Google Ads statistics", url: "https://www.webtonic.io/blog/fitness-google-ads-statistics" };
const WT_DOORS = { name: "Webtonic garage doors & windows statistics", url: "https://www.webtonic.io/blog/garage-doors-and-windows-google-ads-statistics" };
const WT_INS = { name: "Webtonic insurance Meta ads statistics", url: "https://www.webtonic.io/blog/insurance-meta-ads-statistics" };

export const BENCHMARKS: BenchmarkRow[] = [
  { channel: "Google Search", category: "Restaurants & food (closest to cafés)", cpc: "$2.05", ctr: "6.83%", conv: "8.05%", cpl: "$30.57", source: LIQ_SEARCH, confidence: "report", article: "google-ads-for-coffee-shops-complete-2026-guide" },
  { channel: "Google Search", category: "Health & fitness", cpc: "$6.17", ctr: "5.81%", conv: "6.94%", cpl: "$67.36", note: "Webtonic credits TheAdSpend; sources in its roundup disagree (Sports & Recreation CPC $2.77).", source: WT_FIT, confidence: "second-hand", article: "google-ads-for-gyms" },
  { channel: "Google Search", category: "General dentistry (proxy for cosmetic dental)", cpc: "$7.03", ctr: "5.06%", conv: "7.74%", cpl: "$84.77", source: LIQ_HEALTH, confidence: "report", article: "google-ads-for-teeth-whitening" },
  { channel: "Google Search", category: "General practice & family medicine", cpc: "$5.47", ctr: "5.50%", conv: "11.63%", cpl: "$62.80", note: "No pediatrics or urgent-care line exists.", source: LIQ_HEALTH, confidence: "report", article: "google-ads-for-pediatricians" },
  { channel: "Google Search", category: "Mental health", cpc: "$4.22", conv: "1.85%", note: "LocaliQ's published medians do not multiply into its stated cost per lead.", source: LIQ_HEALTH, confidence: "report", article: "google-ads-for-mental-health-professionals" },
  { channel: "Google Search", category: "Hospitals & clinics (proxy for urgent care)", cpc: "$4.90", source: LIQ_HEALTH, confidence: "report", article: "google-ads-for-urgent-care" },
  { channel: "Google Search", category: "Education & instruction", cpc: "$4.81", source: LIQ_SEARCH, confidence: "report", article: "marketing-for-kids-activities-businesses" },
  { channel: "Google Search", category: "Home & home improvement", cpc: "$8.33", ctr: "6.47%", conv: "8.05%", cpl: "$90.92", source: WT_DOORS, confidence: "second-hand", article: "google-ads-for-window-companies" },
  { channel: "Google Search", category: "Doors & windows sales", cpl: "$200.34", conv: "4.41%", source: WT_DOORS, confidence: "second-hand", article: "google-ads-for-window-companies" },
  { channel: "Google Search", category: "Beauty & personal care (nail salons)", cpc: "$4.62", note: "Quoted by an agency article crediting WordStream; original not opened.", source: { name: "Mega Digital (credits WordStream)", url: "https://megadigital.ai/en/blog/google-ads-benchmarks/" }, confidence: "second-hand", article: "google-ads-for-nail-salons-complete-2026-guide" },
  { channel: "Google Search", category: "All industries (average)", cpc: "$5.42", cpl: "$66.69", source: LIQ_SEARCH, confidence: "report", article: "google-ads-vs-facebook-ads-local-business-which-wins" },
  { channel: "Meta (Facebook & Instagram)", category: "All industries, lead campaigns", cpc: "$1.80", cpl: "$27.39", source: LIQ_FB, confidence: "report", article: "google-ads-vs-facebook-ads-local-business-which-wins" },
  { channel: "Meta (Facebook & Instagram)", category: "Beauty & personal care, lead campaigns", cpc: "$2.97", conv: "5.63%", cpl: "$50.91", note: "Traffic campaigns in the same category: $0.50 CPC.", source: LIQ_FB, confidence: "report", article: "hair-salon-facebook-ads-strategy" },
  { channel: "Meta (Facebook & Instagram)", category: "Personal services, lead campaigns (proxy for groomers)", cpl: "$38.09", source: LIQ_FB, confidence: "report", article: "facebook-ads-pet-groomers-guide" },
  { channel: "Meta (Facebook & Instagram)", category: "Finance & insurance, traffic campaigns", cpc: "$1.22", ctr: "0.98%", note: "Not an insurance lead-campaign figure. WordStream 2025 via Webtonic.", source: WT_INS, confidence: "second-hand", article: "facebook-ads-for-insurance-agents" },
];

export const PRICES: PriceRow[] = [
  { group: "SEO & local tools", item: "Semrush SEO toolkit", price: "$139/mo", basis: "Entry plan as listed on the pricing page; currency not stated on the page.", source: { name: "Semrush pricing", url: "https://www.semrush.com/prices/" }, confidence: "rate-card", article: "semrush-vs-ahrefs-small-business" },
  { group: "SEO & local tools", item: "Semrush Local", price: "$30 and $60/location/mo", basis: "Annual billing.", source: { name: "Semrush Local pricing", url: "https://www.semrush.com/pricing/local/" }, confidence: "rate-card", article: "semrush-vs-ahrefs-small-business" },
  { group: "SEO & local tools", item: "Ahrefs Lite / Standard", price: "$129 / $249/mo", basis: "Plan prices on the pricing page; billing period not labelled for every column.", source: { name: "Ahrefs pricing", url: "https://ahrefs.com/pricing" }, confidence: "rate-card", article: "ahrefs-local-seo-guide" },
  { group: "SEO & local tools", item: "BrightLocal Track / Manage / Grow", price: "$41 / $54 / $65/mo", basis: "Monthly billing, one location; annual is lower.", source: { name: "BrightLocal pricing", url: "https://www.brightlocal.com/pricing/" }, confidence: "rate-card", article: "best-local-seo-audit-tool" },
  { group: "Booking & websites", item: "Fresha Independent", price: "$19.95/mo", basis: "Plus $0.02 per text after 100 free; AI Concierge add-on $99.95 per location.", source: { name: "Fresha pricing", url: "https://www.fresha.com/pricing" }, confidence: "rate-card", article: "ai-automation-for-hair-salons" },
  { group: "Booking & websites", item: "Vagaro", price: "$23.99/mo", basis: "For the first 6 months; reminders included.", source: { name: "Vagaro pricing", url: "https://www.vagaro.com/pro/pricing" }, confidence: "rate-card", article: "ai-automation-for-hair-salons" },
  { group: "Booking & websites", item: "MoeGo (pet groomers)", price: "$49 / $99 / $159/mo", basis: "Three plans on the pricing page.", source: { name: "MoeGo pricing", url: "https://www.moego.pet/pricing" }, confidence: "rate-card", article: "pet-groomer-website-pages-and-copy-guide" },
  { group: "Booking & websites", item: "Squarespace Basic / Core / Plus / Advanced", price: "$19 / $29 / $49 / $99/mo", basis: "Annual billing. Monthly billing: $25 / $39 / $65 / $139.", source: { name: "Squarespace pricing", url: "https://www.squarespace.com/pricing" }, confidence: "rate-card", article: "squarespace-for-local-business-review" },
  { group: "Automation", item: "Make Core / Pro / Teams", price: "$12 / $21 / $38/mo", basis: "10,000 credits each; Free plan: 1,000 credits, 2 active scenarios.", source: { name: "Make pricing", url: "https://www.make.com/en/pricing" }, confidence: "rate-card", article: "make-automation-for-small-business" },
  { group: "Audio, TV & other ads", item: "Spotify Ad Studio and AudioGO (Pandora)", price: "$250 minimum", basis: "Minimum campaign budget.", source: { name: "Spotify Advertising", url: "https://ads.spotify.com/en-US/small-business-advertising/" }, confidence: "rate-card", article: "digital-audio-advertising-2026-spotify-pandora-podcast-ads" },
  { group: "Audio, TV & other ads", item: "Nextdoor ads", price: "$3, $5 or $10/day", basis: "Suggested daily budgets, billed upfront as daily budget × 31 days ($93, $155, $310).", source: { name: "Nextdoor for Business", url: "https://business.nextdoor.com/en-us/blog/tips-for-selecting-a-budget-for-nextdoor-ads" }, confidence: "rate-card", article: "nextdoor-ads-cost-2026" },
  { group: "Audio, TV & other ads", item: "CTV advertising (CPM)", price: "$15–$45 market-wide; $20–$60 Roku/Hulu", basis: "Cost per 1,000 views. Vendor estimates, not rates published by the platforms.", source: { name: "Vibe", url: "https://www.vibe.co/blog/roku-advertising-cost" }, confidence: "estimate", article: "how-much-does-ctv-advertising-cost-real-cpm-data" },
  { group: "Audio, TV & other ads", item: "Walmart Connect (recommended starting budget)", price: "$100/day", basis: "About $3,000 a month; Walmart's own recommendation.", source: { name: "Walmart Connect campaign setup guide", url: "https://www.walmartconnect.com/insights/easy-campaign-set-up" }, confidence: "rate-card", article: "walmart-connect-ads-small-business" },
];

export const CONFIDENCE_LABEL: Record<Confidence, { label: string; hint: string }> = {
  report: { label: "Report", hint: "Read on the publisher's own page" },
  "rate-card": { label: "Rate card", hint: "Read on the vendor's pricing page" },
  "second-hand": { label: "Second-hand", hint: "Quoted by a roundup; original not opened" },
  estimate: { label: "Estimate", hint: "Vendor or agency estimate, not measured" },
};
