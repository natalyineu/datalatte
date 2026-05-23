import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const BASE = "https://datalatte.pro";
const PAGE_URL = `${BASE}/reporting`;

export const metadata: Metadata = {
  title: "Marketing Reporting & Analytics Dashboard",
  description:
    "See exactly how DataLatte connects Google Ads, Meta, TikTok, SEO, and 10+ data sources into one clear weekly report. No spreadsheets. No mystery.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Marketing Reporting | DataLatte",
    description:
      "Every channel. One clear report. See how DataLatte turns 10+ data sources into actionable weekly insights.",
    url: PAGE_URL,
    type: "website",
    siteName: "DataLatte",
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

interface DataSource {
  name: string;
  abbr: string;
  color: string;
  bg: string;
  category: string;
  metrics: string[];
  description: string;
}

const DATA_SOURCES: DataSource[] = [
  {
    name: "Google Ads",
    abbr: "GA",
    color: "#4285F4",
    bg: "#EBF2FF",
    category: "Paid Search",
    metrics: ["Clicks", "Conversions", "CPC", "ROAS", "Quality Score"],
    description: "Search & Performance Max campaigns",
  },
  {
    name: "Meta Ads",
    abbr: "fb",
    color: "#0866FF",
    bg: "#EBF4FF",
    category: "Paid Social",
    metrics: ["Reach", "CPM", "CTR", "ROAS", "Frequency"],
    description: "Facebook & Instagram campaigns",
  },
  {
    name: "TikTok Ads",
    abbr: "TT",
    color: "#010101",
    bg: "#F3F4F6",
    category: "Video Ads",
    metrics: ["Views", "CTR", "CPV", "Conversions"],
    description: "In-feed & TopView video ads",
  },
  {
    name: "Google Display",
    abbr: "GD",
    color: "#34A853",
    bg: "#EDFAF1",
    category: "Programmatic",
    metrics: ["Impressions", "Viewability", "CTR", "CPC"],
    description: "Display & programmatic inventory",
  },
  {
    name: "Search Console",
    abbr: "SC",
    color: "#EA4335",
    bg: "#FEECEA",
    category: "Organic Search",
    metrics: ["Clicks", "Impressions", "CTR", "Position"],
    description: "Organic keyword & page data",
  },
  {
    name: "Google Business",
    abbr: "GBP",
    color: "#FBBC04",
    bg: "#FFF9E6",
    category: "Local Search",
    metrics: ["Views", "Calls", "Directions", "Bookings"],
    description: "Maps & local search visibility",
  },
  {
    name: "Google Analytics 4",
    abbr: "A4",
    color: "#E8710A",
    bg: "#FEF3E7",
    category: "Analytics",
    metrics: ["Sessions", "Users", "Engagement", "Revenue"],
    description: "On-site behaviour & conversions",
  },
  {
    name: "Instagram",
    abbr: "IG",
    color: "#C13584",
    bg: "#FCF0F7",
    category: "Social Organic",
    metrics: ["Followers", "Reach", "Engagement", "Stories"],
    description: "Organic growth & content performance",
  },
  {
    name: "Facebook Page",
    abbr: "FB",
    color: "#1877F2",
    bg: "#EBF4FF",
    category: "Social Organic",
    metrics: ["Reach", "Likes", "Shares", "Messages"],
    description: "Page performance & community",
  },
  {
    name: "Email & SMS",
    abbr: "EM",
    color: "#7C3AED",
    bg: "#F0EBFF",
    category: "Retention",
    metrics: ["Open rate", "CTR", "Revenue", "Unsubscribes"],
    description: "Campaign performance & list health",
  },
];

const REPORT_OUTPUTS = [
  {
    emoji: "📧",
    name: "Weekly Email Brief",
    timing: "Every Monday",
    desc: "Key numbers, top wins, one concern, and 3 action items — in 90 seconds of reading.",
    color: "border-coffee-300 bg-coffee-50",
  },
  {
    emoji: "📄",
    name: "Monthly PDF Report",
    timing: "First of the month",
    desc: "Full channel breakdown with trend charts, benchmarks, competitor context, and a 30-day action plan.",
    color: "border-coffee-300 bg-coffee-50",
  },
  {
    emoji: "📊",
    name: "Live Dashboard",
    timing: "Real-time",
    desc: "Bookmark-ready dashboard with every connected channel — updated automatically, no login required.",
    color: "border-coffee-300 bg-coffee-50",
  },
  {
    emoji: "🔔",
    name: "Instant Alerts",
    timing: "As it happens",
    desc: "Telegram or email alerts the moment spend spikes, CTR drops, or a target is hit.",
    color: "border-coffee-300 bg-coffee-50",
  },
  {
    emoji: "💬",
    name: "Monthly Strategy Call",
    timing: "45 min / month",
    desc: "Review the numbers together, decide the next priorities, and adjust the plan.",
    color: "border-coffee-300 bg-coffee-50",
  },
];

const FAQS = [
  {
    q: "How long does it take to set up reporting?",
    a: "Most clients have a live dashboard and their first weekly brief within 5 business days of onboarding. We handle all the platform connections.",
  },
  {
    q: "Do I need to install any software?",
    a: "No. You give DataLatte read-only access to your ad accounts and analytics tools. Everything else is handled on our side.",
  },
  {
    q: "Can I see reports for channels I manage myself?",
    a: "Yes. If you run your own Instagram or email platform, we connect to it and include it alongside the channels we manage for you.",
  },
  {
    q: "What if I only use 2–3 of these platforms?",
    a: "We report on what you actually use. There's no minimum number of connected channels.",
  },
];

const MOCK_METRICS = [
  { label: "Total Ad Spend", value: "$4,280", change: -3.2, note: "vs last week" },
  { label: "Leads Generated", value: "94", change: 18.4, note: "vs last week" },
  { label: "Cost per Lead", value: "$45.53", change: -18.5, note: "vs last week" },
  { label: "Blended ROAS", value: "3.8×", change: 12.1, note: "vs last week" },
];

const MOCK_CHANNELS = [
  { name: "Google Ads", spend: "$2,100", leads: 52, cpl: "$40.38", roas: "4.2×", trend: "up" },
  { name: "Meta Ads", spend: "$1,480", leads: 28, cpl: "$52.86", roas: "3.1×", trend: "up" },
  { name: "TikTok Ads", spend: "$700", leads: 14, cpl: "$50.00", roas: "2.9×", trend: "neutral" },
  { name: "Organic SEO", spend: "—", leads: 0, cpl: "—", roas: "—", trend: "up" },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp size={14} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

export default function ReportingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: BASE },
    { name: "Reporting", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 border border-white/20 text-coffee-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            Reporting & Analytics
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Every channel.{" "}
            <span className="text-coffee-400">One clear report.</span>
          </h1>
          <p className="text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
            DataLatte connects Google Ads, Meta, TikTok, SEO, and 10+ data sources into a single
            weekly briefing — so you always know what&apos;s working, what&apos;s not, and what to do next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-coffee-500 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl hover:shadow-coffee-900/30"
            >
              Get my free audit <ArrowRight size={17} />
            </Link>
            <Link
              href="/services/analytics"
              className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/80 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all"
            >
              Analytics service →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Data Sources Grid ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Data Sources</span>
          <h2 className="section-title">
            Connected to <span className="gradient-text">10+ platforms</span>
          </h2>
          <p className="section-subtitle">
            Every channel you run — pulled automatically, cleaned, and cross-referenced.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DATA_SOURCES.map((source) => (
            <div
              key={source.name}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              {/* Logo badge */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: source.color }}
                >
                  {source.abbr}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm leading-tight">{source.name}</div>
                  <div
                    className="text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
                    style={{ backgroundColor: source.bg, color: source.color }}
                  >
                    {source.category}
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-xs mb-3 leading-relaxed">{source.description}</p>

              {/* Metric chips */}
              <div className="flex flex-wrap gap-1">
                {source.metrics.map((m) => (
                  <span
                    key={m}
                    className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Flow Diagram ── */}
      <SectionWrapper className="bg-gray-950 overflow-hidden relative">
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative">
          <div className="text-center mb-12">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Your data pipeline, visualised
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1fr,auto,1fr] gap-6 items-center max-w-5xl mx-auto">

            {/* ── Left: Inputs ── */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center lg:text-left">
                Your Channels
              </div>
              {[
                { label: "Ad Platforms", sources: ["Google Ads", "Meta Ads", "TikTok Ads", "Programmatic"], color: "#4285F4" },
                { label: "Search & Local", sources: ["Search Console", "Google Business Profile", "Local SEO"], color: "#34A853" },
                { label: "Analytics & Social", sources: ["GA4", "Instagram", "Facebook Page"], color: "#E8710A" },
                { label: "Email & Retention", sources: ["Email", "SMS", "CRM"], color: "#7C3AED" },
              ].map((group) => (
                <div
                  key={group.label}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3"
                >
                  <div
                    className="w-2 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <div>
                    <div className="text-white text-sm font-semibold">{group.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{group.sources.join(" · ")}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Center: Hub ── */}
            <div className="flex flex-col items-center gap-3 py-4">
              {/* Arrow in */}
              <div className="hidden lg:flex flex-col items-center">
                <div className="w-px h-8 bg-gradient-to-b from-transparent to-coffee-500" />
                <div className="w-2 h-2 rounded-full bg-coffee-500" />
              </div>

              {/* Hub card */}
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-2xl bg-coffee-500/20 blur-xl scale-110" />
                <div className="relative bg-gradient-to-b from-coffee-800 to-coffee-900 border border-coffee-600/50 rounded-2xl p-6 text-center w-44 shadow-2xl">
                  <div className="text-5xl mb-3">☕</div>
                  <div className="text-white font-bold text-sm leading-tight">DataLatte</div>
                  <div className="text-coffee-300 text-xs mt-1">Analytics Hub</div>
                  <div className="mt-3 flex flex-wrap gap-1 justify-center">
                    {["Normalise", "Cross-ref", "Score", "Trend"].map((t) => (
                      <span key={t} className="text-xs bg-coffee-700/60 text-coffee-200 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrow out */}
              <div className="hidden lg:flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-coffee-500" />
                <div className="w-px h-8 bg-gradient-to-b from-coffee-500 to-transparent" />
              </div>
            </div>

            {/* ── Right: Outputs ── */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 text-center lg:text-right">
                Your Reports
              </div>
              {REPORT_OUTPUTS.map((output) => (
                <div
                  key={output.name}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3"
                >
                  <div className="text-2xl shrink-0">{output.emoji}</div>
                  <div>
                    <div className="text-white text-sm font-semibold">{output.name}</div>
                    <div className="text-gray-500 text-xs">{output.timing}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Sample Report Preview ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Report Preview</span>
          <h2 className="section-title">
            This is what you&apos;ll see{" "}
            <span className="gradient-text">every Monday</span>
          </h2>
          <p className="section-subtitle">
            A real-format weekly brief — numbers changed for privacy.
          </p>
        </div>

        {/* Mock report card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Report header */}
          <div className="bg-gradient-to-r from-coffee-900 to-coffee-700 px-6 py-5 flex items-center justify-between">
            <div>
              <div className="text-coffee-300 text-xs font-semibold uppercase tracking-widest">
                Weekly Brief · May 19–25, 2026
              </div>
              <div className="text-white font-bold text-lg mt-1">Bloom Hair Studio — Austin TX</div>
            </div>
            <div className="text-4xl">☕</div>
          </div>

          {/* Top metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            {MOCK_METRICS.map((m) => {
              const isPositive = m.label === "Cost per Lead" ? m.change < 0 : m.change > 0;
              const isNeutral = m.change === 0;
              return (
                <div key={m.label} className="p-5">
                  <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                  <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                  <div
                    className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${
                      isNeutral ? "text-gray-400" : isPositive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isNeutral ? (
                      <Minus size={11} />
                    ) : isPositive ? (
                      <TrendingUp size={11} />
                    ) : (
                      <TrendingDown size={11} />
                    )}
                    {Math.abs(m.change)}% {m.note}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Channel table */}
          <div className="px-6 pb-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest py-4 border-t border-gray-100">
              Channel Breakdown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-2 font-medium">Channel</th>
                    <th className="pb-2 font-medium text-right">Spend</th>
                    <th className="pb-2 font-medium text-right">Leads</th>
                    <th className="pb-2 font-medium text-right">CPL</th>
                    <th className="pb-2 font-medium text-right">ROAS</th>
                    <th className="pb-2 font-medium text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_CHANNELS.map((ch) => (
                    <tr key={ch.name} className="text-gray-700">
                      <td className="py-2.5 font-medium text-gray-900">{ch.name}</td>
                      <td className="py-2.5 text-right">{ch.spend}</td>
                      <td className="py-2.5 text-right">{ch.leads || "—"}</td>
                      <td className="py-2.5 text-right">{ch.cpl}</td>
                      <td className="py-2.5 text-right font-medium">{ch.roas}</td>
                      <td className="py-2.5 text-right">
                        <TrendIcon trend={ch.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action items */}
          <div className="mx-6 my-4 bg-coffee-50 rounded-xl p-4 border border-coffee-100">
            <div className="text-xs font-semibold text-coffee-700 uppercase tracking-widest mb-3">
              This week&apos;s 3 priorities
            </div>
            <ol className="space-y-2">
              {[
                "Pause the 3 Google Ads keywords with CPL > $90 — they're dragging the average up.",
                "Test a new Meta creative for the hair treatment offer — CTR on current set is declining.",
                "Reply to the 2 unanswered Google reviews from this week — response rate affects ranking.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-coffee-200 text-coffee-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="px-6 pb-6 text-center text-xs text-gray-400">
            Sample report — numbers are illustrative only.
          </div>
        </div>
      </SectionWrapper>

      {/* ── Report Delivery Methods ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Delivery</span>
          <h2 className="section-title">How you receive your reports</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {REPORT_OUTPUTS.map((output) => (
            <div
              key={output.name}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-coffee-200 transition-all"
            >
              <div className="text-3xl mb-3">{output.emoji}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{output.name}</h3>
                <span className="text-xs bg-coffee-100 text-coffee-700 px-2 py-0.5 rounded-full font-medium">
                  {output.timing}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{output.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <SectionWrapper>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Reporting questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{f.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
