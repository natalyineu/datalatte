import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Minus, Check, X, Bell, Zap } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import ReportingFlow from "@/components/ReportingFlow";
import DashboardTabs from "@/components/DashboardTabs";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

const BASE = "https://datalatte.pro";
const PAGE_URL = `${BASE}/reporting`;

export const metadata: Metadata = {
  title: "Marketing Reporting & Analytics Dashboard",
  description:
    "See exactly how DataLatte connects Google Ads, Meta, TikTok, Yelp, Mindbody, and 31 data sources into one clear weekly report. No spreadsheets. No mystery.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Marketing Reporting | DataLatte",
    description:
      "Every channel. One clear report. DataLatte turns 31 data sources into actionable weekly insights.",
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
  freshness: string;
}

const DATA_SOURCE_GROUPS: { label: string; color: string; sources: DataSource[] }[] = [
  {
    label: "Paid Advertising",
    color: "#4285F4",
    sources: [
      { name: "Google Ads",       abbr: "GA",  color: "#4285F4", bg: "#EBF2FF", category: "Paid Search",    freshness: "Hourly",   metrics: ["Clicks", "Conversions", "CPC", "ROAS", "Quality Score"],  description: "Search & Performance Max campaigns"    },
      { name: "Meta Ads",         abbr: "fb",  color: "#0866FF", bg: "#EBF4FF", category: "Paid Social",    freshness: "Hourly",   metrics: ["Reach", "CPM", "CTR", "ROAS", "Frequency"],               description: "Facebook & Instagram campaigns"         },
      { name: "YouTube Ads",      abbr: "YT",  color: "#FF0000", bg: "#FFEBEB", category: "Video Ads",      freshness: "Daily",    metrics: ["Views", "CPV", "VTR", "Conversions", "ROAS"],             description: "In-stream & bumper video ads"           },
      { name: "TikTok Ads",       abbr: "TT",  color: "#010101", bg: "#F3F4F6", category: "Video Ads",      freshness: "Daily",    metrics: ["Views", "CTR", "CPV", "Conversions"],                     description: "In-feed & TopView video ads"            },
      { name: "LinkedIn Ads",     abbr: "Li",  color: "#0A66C2", bg: "#E8F3FF", category: "B2B Social",     freshness: "Daily",    metrics: ["Impressions", "CPL", "CTR", "Lead Quality"],              description: "Sponsored content & lead gen forms"     },
      { name: "X / Twitter Ads",  abbr: "X",   color: "#1DA1F2", bg: "#E8F5FF", category: "Social Ads",     freshness: "Daily",    metrics: ["Impressions", "CPE", "CTR", "Followers"],                 description: "Promoted tweets & follower campaigns"   },
      { name: "Microsoft Ads",    abbr: "MS",  color: "#00A4EF", bg: "#E6F5FF", category: "Paid Search",    freshness: "Daily",    metrics: ["Clicks", "CPC", "ROAS", "Conversions"],                   description: "Bing search & audience network"         },
      { name: "Pinterest Ads",    abbr: "Pn",  color: "#E60023", bg: "#FFE8EA", category: "Visual Ads",     freshness: "Daily",    metrics: ["Impressions", "Saves", "CTR", "ROAS"],                    description: "Promoted pins & shopping campaigns"     },
      { name: "Programmatic",     abbr: "GD",  color: "#34A853", bg: "#EDFAF1", category: "Display",        freshness: "Daily",    metrics: ["Impressions", "Viewability", "CTR", "CPC"],               description: "Display, native & programmatic DSPs"    },
    ],
  },
  {
    label: "Organic Search & Local",
    color: "#EA4335",
    sources: [
      { name: "Search Console",    abbr: "SC",  color: "#EA4335", bg: "#FEECEA", category: "Organic Search", freshness: "Daily",    metrics: ["Clicks", "Impressions", "CTR", "Position"],               description: "Organic keyword & page performance"     },
      { name: "Google Business",   abbr: "GBP", color: "#FBBC04", bg: "#FFF9E6", category: "Local Search",   freshness: "Daily",    metrics: ["Views", "Calls", "Directions", "Bookings"],              description: "Maps & local pack visibility"           },
      { name: "Google Analytics 4",abbr: "A4",  color: "#E8710A", bg: "#FEF3E7", category: "Analytics",      freshness: "Real-time",metrics: ["Sessions", "Users", "Engagement", "Revenue"],            description: "On-site behaviour & goal conversions"   },
    ],
  },
  {
    label: "Organic Social",
    color: "#C13584",
    sources: [
      { name: "Instagram",         abbr: "IG",  color: "#C13584", bg: "#FCF0F7", category: "Social Organic", freshness: "Daily",    metrics: ["Followers", "Reach", "Engagement", "Stories"],           description: "Feed, Reels & Stories performance"      },
      { name: "TikTok Organic",    abbr: "TK",  color: "#010101", bg: "#F3F4F6", category: "Social Organic", freshness: "Daily",    metrics: ["Views", "Followers", "Engagement", "Watch time"],        description: "Organic short-form video growth"        },
      { name: "Facebook Page",     abbr: "FB",  color: "#1877F2", bg: "#EBF4FF", category: "Social Organic", freshness: "Daily",    metrics: ["Reach", "Likes", "Shares", "Messages"],                  description: "Page performance & community growth"    },
      { name: "LinkedIn Page",     abbr: "LP",  color: "#0A66C2", bg: "#E8F3FF", category: "Social Organic", freshness: "Daily",    metrics: ["Impressions", "Clicks", "Followers", "Engagement"],      description: "Company page & content reach"           },
      { name: "YouTube Channel",   abbr: "YC",  color: "#FF0000", bg: "#FFEBEB", category: "Social Organic", freshness: "Daily",    metrics: ["Views", "Watch time", "Subscribers", "Revenue"],        description: "Organic video reach & subscriber growth"},
      { name: "X / Twitter",       abbr: "X",   color: "#1DA1F2", bg: "#E8F5FF", category: "Social Organic", freshness: "Daily",    metrics: ["Impressions", "Engagement", "Followers", "Link clicks"], description: "Organic post reach & audience growth"   },
    ],
  },
  {
    label: "Email & Retention",
    color: "#7C3AED",
    sources: [
      { name: "Email Marketing",   abbr: "EM",  color: "#7C3AED", bg: "#F0EBFF", category: "Retention",      freshness: "Per send", metrics: ["Open rate", "CTR", "Revenue", "Unsubscribes"],           description: "Campaign & automation performance"      },
      { name: "SMS Marketing",     abbr: "SM",  color: "#9333EA", bg: "#F3E8FF", category: "Retention",      freshness: "Per send", metrics: ["Delivery", "CTR", "Revenue", "Opt-outs"],                description: "SMS blasts & drip sequences"            },
      { name: "CRM",               abbr: "CR",  color: "#6D28D9", bg: "#EDE9FE", category: "Retention",      freshness: "Daily",    metrics: ["Contacts", "Pipeline", "Deals won", "LTV"],             description: "Contact health & deal pipeline"         },
    ],
  },
  {
    label: "Reviews & Directories",
    color: "#D97706",
    sources: [
      { name: "Yelp",              abbr: "Yp",  color: "#D32323", bg: "#FDECEA", category: "Reviews",        freshness: "Daily",    metrics: ["Rating", "Reviews", "Profile views", "Leads"],           description: "Reviews, leads & business visibility"   },
      { name: "Tripadvisor",       abbr: "TA",  color: "#00AA6C", bg: "#E6FAF3", category: "Reviews",        freshness: "Daily",    metrics: ["Rating", "Reviews", "Ranking", "Impressions"],           description: "Review ranking & travel audience reach" },
      { name: "Nextdoor",          abbr: "ND",  color: "#8DB600", bg: "#F4FAE6", category: "Local Social",   freshness: "Daily",    metrics: ["Recommendations", "Reach", "Clicks", "Followers"],       description: "Neighbourhood recommendations & reach"  },
      { name: "Apple Maps",        abbr: "AM",  color: "#555555", bg: "#F3F4F6", category: "Local Search",   freshness: "Weekly",   metrics: ["Views", "Taps", "Directions", "Calls"],                  description: "Apple Maps listing & search visibility" },
      { name: "Bing Places",       abbr: "BP",  color: "#008272", bg: "#E6F5F3", category: "Local Search",   freshness: "Weekly",   metrics: ["Impressions", "Clicks", "Calls", "Directions"],          description: "Bing & Microsoft search local listings" },
    ],
  },
  {
    label: "Booking & POS",
    color: "#059669",
    sources: [
      { name: "Mindbody",          abbr: "MB",  color: "#00B4D8", bg: "#E6F7FB", category: "Fitness / Wellness", freshness: "Daily", metrics: ["Bookings", "New clients", "Retention", "Revenue"],      description: "Fitness & wellness booking platform"    },
      { name: "Booksy",            abbr: "Bk",  color: "#6246EA", bg: "#EFEBFF", category: "Hair & Beauty",  freshness: "Daily",    metrics: ["Appointments", "Rating", "New clients", "Revenue"],      description: "Salon & barber appointment tracking"    },
      { name: "Fresha",            abbr: "Fr",  color: "#00C4A0", bg: "#E6FAF7", category: "Salons & Spas",  freshness: "Daily",    metrics: ["Bookings", "Revenue", "Retention", "Reviews"],           description: "Salon & spa booking & payment data"     },
      { name: "Square POS",        abbr: "Sq",  color: "#1A1A1A", bg: "#F3F4F6", category: "Cafés / Retail", freshness: "Daily",    metrics: ["Transactions", "Revenue", "Avg ticket", "Repeat rate"],  description: "Point-of-sale revenue & loyalty data"   },
      { name: "OpenTable",         abbr: "OT",  color: "#DA3743", bg: "#FDECEA", category: "Restaurants",    freshness: "Daily",    metrics: ["Reservations", "Covers", "No-shows", "Reviews"],         description: "Reservation & dining experience data"   },
    ],
  },
];

const DATA_SOURCES: DataSource[] = DATA_SOURCE_GROUPS.flatMap(g => g.sources);

const REPORT_OUTPUTS = [
  { emoji: "📧", name: "Weekly Email Brief",   timing: "Every Monday",     desc: "Key numbers, top wins, one concern, and 3 action items — in 90 seconds of reading."              },
  { emoji: "📄", name: "Monthly PDF Report",   timing: "1st of the month", desc: "Full channel breakdown with trend charts, benchmarks, competitor context, and a 30-day plan."  },
  { emoji: "📊", name: "Live Dashboard",       timing: "Real-time",        desc: "Bookmark-ready view of every connected channel — updated automatically, no login required."       },
  { emoji: "🔔", name: "Instant Alerts",       timing: "As it happens",    desc: "Telegram or email alerts the moment spend spikes, CTR drops, or a goal is hit."                  },
  { emoji: "💬", name: "Monthly Strategy Call",timing: "45 min / month",   desc: "Review the numbers together, decide priorities, and adjust the plan for next month."              },
];

const FAQS = [
  { q: "How long does it take to set up reporting?",      a: "Most clients have a live dashboard and their first weekly brief within 5 business days of onboarding. We handle all the platform connections."                           },
  { q: "Do I need to install any software?",              a: "No. You give DataLatte read-only access to your ad accounts and analytics tools. Everything else is handled on our side."                                                },
  { q: "Can I see reports for channels I manage myself?", a: "Yes. If you run your own Instagram or email platform, we connect to it and include it alongside the channels we manage for you."                                         },
  { q: "What if I only use 2–3 of these platforms?",      a: "We report on what you actually use. There's no minimum number of connected channels — and we flag which extra channels would likely be worth adding for your business type." },
  { q: "How is this different from Google's own reports?", a: "Google's dashboards show you one channel. DataLatte shows you all channels together — so you can see trade-offs like 'our Meta CPL is 40% higher than Google, should we shift budget?'" },
  { q: "Does DataLatte track organic social performance?", a: "Yes. We pull data from Instagram, TikTok, Facebook Page, LinkedIn, YouTube Channel, and X/Twitter — so you see organic and paid side by side, with a true blended picture of your marketing." },
];

const MOCK_METRICS = [
  { label: "Total Ad Spend",    value: "$4,280", change: -3.2,   note: "vs last week", positive: false },
  { label: "Leads Generated",  value: "117",    change: 24.5,   note: "vs last week", positive: true  },
  { label: "Cost per Lead",    value: "$36.58", change: -22.5,  note: "vs last week", positive: true  },
  { label: "Blended ROAS",     value: "3.8×",   change: 12.1,   note: "vs last week", positive: true  },
];

const MOCK_CHANNELS = [
  { name: "Google Ads",   spend: "$2,100", leads: 52,  cpl: "$40.38", roas: "4.2×", trend: "up"     },
  { name: "Meta Ads",     spend: "$1,480", leads: 28,  cpl: "$52.86", roas: "3.1×", trend: "up"     },
  { name: "TikTok Ads",   spend: "$700",   leads: 14,  cpl: "$50.00", roas: "2.9×", trend: "neutral"},
  { name: "Organic SEO",  spend: "—",      leads: 23,  cpl: "—",      roas: "∞",    trend: "up"     },
];

const BEFORE_AFTER = [
  { before: "5 tabs open, no single source of truth",   after: "One live dashboard, always current"        },
  { before: "Manual data pulls every week",             after: "Automated Monday brief in your inbox"      },
  { before: "No idea which channel is actually working",after: "Clear ROAS breakdown per channel"          },
  { before: "Panic when ad spend suddenly changes",     after: "Instant alert with context — no surprises" },
  { before: "Monthly mystery report from an agency",    after: "Weekly brief + real-time visibility"       },
  { before: "3–5 hours a week on spreadsheets",         after: "5 minutes reading, rest of week executing" },
];

const ALERTS = [
  { level: "red",    icon: "🔴", text: "Budget alert: TikTok CPL rose 38% in 48 h — DataLatte paused lowest-performing ad sets automatically."        },
  { level: "green",  icon: "🟢", text: "Win: Meta ROAS hit 3.1× after creative refresh — up from 2.4×. Recommended: increase budget by 15%."           },
  { level: "yellow", icon: "🟡", text: "Opportunity: Google Ads Quality Score for 'hair salon austin' hit 9/10. Recommend raising bid 20%."             },
  { level: "blue",   icon: "🔵", text: "SEO: 'hair salon open sunday' moved from pos. 12 → pos. 8 this week. New top-3 content opportunity identified." },
  { level: "yellow", icon: "🟡", text: "Review alert: 2 Google reviews unanswered 3+ days. Response rate below 80% — Maps ranking risk."                },
  { level: "green",  icon: "🟢", text: "Organic: Instagram reach +31% this week from 3 Reels. Organic CPL this week: $0 for 23 website visits via GA4." },
];

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")   return <TrendingUp  size={14} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500"   />;
  return <Minus size={14} className="text-gray-400" />;
}

export default function ReportingPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: BASE },
    { name: "Reporting", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating platform badges */}
        <div className="absolute left-6 top-20 lg:left-20 lg:top-24 hidden sm:block animate-float opacity-90">
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Google Ads</span>
            <span className="text-green-400 font-bold">4.2× ROAS</span>
          </div>
        </div>
        <div className="absolute right-6 top-24 lg:right-24 lg:top-28 hidden sm:block animate-float-r opacity-90" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Leads this week</span>
            <span className="text-green-400 font-bold">↑ 24%</span>
          </div>
        </div>
        <div className="absolute left-10 bottom-16 lg:left-32 hidden lg:block animate-float opacity-80" style={{ animationDelay: "1.4s" }}>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Meta CPL</span>
            <span className="text-amber-400 font-bold">↓ $12 vs last week</span>
          </div>
        </div>
        <div className="absolute right-10 bottom-20 lg:right-28 hidden lg:block animate-float-r opacity-80" style={{ animationDelay: "0.4s" }}>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Dashboard live</span>
            <span className="text-blue-400 font-bold">Day 5 ✓</span>
          </div>
        </div>
        <div className="absolute left-1/4 top-12 hidden lg:block animate-float opacity-70" style={{ animationDelay: "2.1s" }}>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Instagram reach</span>
            <span className="text-pink-400 font-bold">+31%</span>
          </div>
        </div>
        <div className="absolute right-1/4 bottom-10 hidden lg:block animate-float-r opacity-70" style={{ animationDelay: "1.8s" }}>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-700 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <span className="text-gray-300">Email open rate</span>
            <span className="text-purple-400 font-bold">28%</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 border border-white/20 text-coffee-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            Reporting & Analytics
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Every channel.{" "}
            <span className="text-coffee-400">One clear report.</span>
          </h1>
          <p className="text-xl text-white/65 max-w-2xl mx-auto mb-4 leading-relaxed">
            DataLatte connects Google Ads, Meta, TikTok, Yelp, Mindbody, Booksy, and 31 data sources
            into a single weekly briefing — so you always know what&apos;s working, what isn&apos;t, and exactly what to do next.
          </p>
          <p className="text-sm text-coffee-400 mb-10 font-medium">
            No spreadsheets. No guessing. No 5-tab Monday mornings.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-coffee-500 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl hover:shadow-coffee-900/30">
              Get my free audit <ArrowRight size={17} />
            </Link>
            <Link href="/services/analytics" className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-white/80 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              Analytics service →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-coffee-950 border-b border-coffee-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: "31",     label: "Connected sources" },
            { value: "5 days", label: "To first dashboard" },
            { value: "3–5 hrs",label: "Saved per week"    },
            { value: "0",      label: "Spreadsheets"      },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-coffee-300">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Before / After ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">The Difference</span>
          <h2 className="section-title">
            Sound familiar?{" "}
            <span className="gradient-text">Here&apos;s the fix.</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="px-5 py-3 border-r border-gray-100 flex items-center gap-2">
              <X size={13} className="text-red-400" /> Before
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <Check size={13} className="text-green-500" /> After DataLatte
            </div>
          </div>
          {BEFORE_AFTER.map((row, i) => (
            <div key={i} className="grid grid-cols-2 text-sm hover:bg-gray-50 transition-colors">
              <div className="px-5 py-3.5 text-gray-400 border-r border-gray-100 flex items-start gap-2">
                <X size={13} className="text-red-400 shrink-0 mt-0.5" />
                {row.before}
              </div>
              <div className="px-5 py-3.5 text-gray-800 flex items-start gap-2">
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                {row.after}
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Data Sources Grid ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Data Sources</span>
          <h2 className="section-title">
            Connected to <span className="gradient-text">31 platforms</span>
          </h2>
          <p className="section-subtitle">
            Every channel you run — pulled automatically, cleaned, and cross-referenced.
          </p>
        </div>

        <div className="space-y-10">
          {DATA_SOURCE_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{group.label}</h3>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">{group.sources.length} sources</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.sources.map((source, i) => (
                  <div
                    key={source.name}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group relative overflow-hidden animate-card-rise"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                      style={{ background: `radial-gradient(circle at top left, ${source.color}18, transparent 65%)` }}
                    />
                    <div className="flex items-center gap-3 mb-3 relative">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: source.color }}
                      >
                        {source.abbr}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm leading-tight truncate">{source.name}</div>
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block"
                          style={{ backgroundColor: source.bg, color: source.color }}
                        >
                          {source.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2.5 relative">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                      <span className="text-xs text-gray-400">{source.freshness} refresh</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3 leading-relaxed relative">{source.description}</p>
                    <div className="flex flex-wrap gap-1 relative">
                      {source.metrics.map((m) => (
                        <span key={m} className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Flow Diagram ── */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Your data pipeline, visualised
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Data flows in from every channel, gets normalised and cross-referenced in the DataLatte hub,
              then comes out as clear, actionable reports.
            </p>
          </div>
          <ReportingFlow />
        </div>
      </section>

      {/* ── Dashboard Tabs ── */}
      <section className="bg-gray-950 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Live Dashboard Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What your dashboard looks like
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Five views, one bookmark. Switch between channels, ads performance, SEO, social, and your Monday brief.
            </p>
          </div>
          <DashboardTabs />
        </div>
      </section>

      {/* ── Automated Insights ── */}
      <section className="bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Automated Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              DataLatte flags issues{" "}
              <span className="text-coffee-400">before you notice them</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Rules-based monitoring across all 21 channels. Budget spikes, CTR drops, ranking shifts, and
              review gaps — surfaced instantly, with context.
            </p>
          </div>

          <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Alert feed header */}
            <div className="flex items-center gap-2 px-5 py-3 bg-gray-900 border-b border-gray-800">
              <Bell size={14} className="text-coffee-400 animate-pulse" />
              <span className="text-gray-400 text-xs font-medium">Automated alerts feed</span>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
              </span>
            </div>
            <div className="divide-y divide-gray-800/60">
              {ALERTS.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 px-5 py-4 hover:bg-gray-900/60 transition-colors animate-card-rise"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-lg shrink-0 mt-0.5">{alert.icon}</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{alert.text}</p>
                  <span className="text-gray-600 text-xs whitespace-nowrap shrink-0 mt-0.5">
                    {["2m ago", "14m ago", "1h ago", "3h ago", "6h ago", "Yesterday"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between">
              <span className="text-gray-600 text-xs">Alerts delivered via email or Telegram</span>
              <div className="flex items-center gap-1.5 text-xs text-coffee-400 font-medium">
                <Zap size={12} /> 47 alerts this month
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sample Weekly Report ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Report Preview</span>
          <h2 className="section-title">
            This lands in your inbox{" "}
            <span className="gradient-text">every Monday</span>
          </h2>
          <p className="section-subtitle">
            Real format, illustrative numbers. 90 seconds to read. 3 actions to take.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-coffee-900 to-coffee-700 px-6 py-5 flex items-center justify-between">
            <div>
              <div className="text-coffee-300 text-xs font-semibold uppercase tracking-widest">
                Weekly Brief · May 19–25, 2026
              </div>
              <div className="text-white font-bold text-lg mt-1">Bloom Hair Studio — Austin TX</div>
            </div>
            <div className="text-4xl animate-float">☕</div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            {MOCK_METRICS.map((m) => (
              <div key={m.label} className="p-5 group hover:bg-gray-50 transition-colors">
                <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                <div className="text-2xl font-bold text-gray-900 tabular-nums">{m.value}</div>
                <div className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${m.positive ? "text-green-600" : "text-red-500"}`}>
                  {m.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(m.change)}% {m.note}
                </div>
              </div>
            ))}
          </div>

          {/* Spend bar */}
          <div className="px-6 pt-4 pb-2">
            <div className="text-xs text-gray-400 mb-2 font-medium">Budget allocation this week</div>
            <div className="flex rounded-full overflow-hidden h-3">
              <div className="bg-[#4285F4]" style={{ width: "49%" }} title="Google Ads 49%" />
              <div className="bg-[#0866FF]" style={{ width: "35%" }} title="Meta Ads 35%"   />
              <div className="bg-[#010101]" style={{ width: "16%" }} title="TikTok Ads 16%" />
            </div>
            <div className="flex gap-4 mt-2">
              {[{ c: "#4285F4", l: "Google Ads 49%" }, { c: "#0866FF", l: "Meta Ads 35%" }, { c: "#333", l: "TikTok 16%" }].map(x => (
                <div key={x.l} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: x.c }} />
                  {x.l}
                </div>
              ))}
            </div>
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
                    <tr key={ch.name} className="text-gray-700 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-medium text-gray-900">{ch.name}</td>
                      <td className="py-2.5 text-right tabular-nums">{ch.spend}</td>
                      <td className="py-2.5 text-right tabular-nums font-semibold">{ch.leads}</td>
                      <td className="py-2.5 text-right tabular-nums">{ch.cpl}</td>
                      <td className="py-2.5 text-right font-semibold">{ch.roas}</td>
                      <td className="py-2.5 text-right"><TrendIcon trend={ch.trend} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 pb-2">* Organic SEO leads tracked via GA4 goal completions — no ad spend.</p>
          </div>

          {/* 3 priorities */}
          <div className="mx-6 my-5 bg-coffee-50 rounded-xl p-5 border border-coffee-100">
            <div className="text-xs font-bold text-coffee-700 uppercase tracking-widest mb-4">
              This week&apos;s 3 priorities
            </div>
            <ol className="space-y-3">
              {[
                "Pause the 3 Google Ads keywords with CPL > $90 — they're dragging the blended average up by ~$8.",
                "Test a new Meta creative for the hair treatment offer — CTR on the current set has dropped 22% in 10 days.",
                "Reply to the 2 unanswered Google reviews from this week — response rate directly affects your Maps ranking.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-6 h-6 rounded-full bg-coffee-200 text-coffee-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="px-6 pb-5 text-center text-xs text-gray-400">
            Sample report — numbers are illustrative only.
          </div>
        </div>
      </SectionWrapper>

      {/* ── Setup Timeline ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Onboarding</span>
          <h2 className="section-title">Live in 5 days</h2>
          <p className="section-subtitle">You handle one Zoom call. We handle the rest.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {[
            { day: "Day 1",    icon: "🔑", title: "Access granted",        desc: "You share read-only access to your ad accounts and analytics tools in a 30-min onboarding call." },
            { day: "Days 2–3", icon: "⚙️", title: "We connect everything", desc: "DataLatte pulls your historical data, cleans it, and maps it across all connected channels."     },
            { day: "Day 4",    icon: "📊", title: "Dashboard goes live",   desc: "Your bookmarkable real-time dashboard is ready. We send you the link."                            },
            { day: "Day 5",    icon: "📧", title: "First brief arrives",   desc: "Your first weekly brief lands in your inbox — with baselines, early wins, and 3 action items."     },
            { day: "Ongoing",  icon: "♻️", title: "Weekly cadence begins", desc: "Monday briefs, monthly deep-dives, instant alerts, and a monthly strategy call."                  },
          ].map((step, i) => (
            <div key={step.day} className="flex gap-5 mb-6 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-coffee-100 text-xl flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                {i < 4 && <div className="w-px flex-1 bg-coffee-100 my-2" />}
              </div>
              <div className="pb-6">
                <div className="text-xs font-bold text-coffee-600 uppercase tracking-widest mb-1">{step.day}</div>
                <div className="font-semibold text-gray-900 mb-1">{step.title}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Delivery Methods ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Delivery</span>
          <h2 className="section-title">How you receive your reports</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {REPORT_OUTPUTS.map((output, i) => (
            <div
              key={output.name}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-coffee-200 hover:-translate-y-1 transition-all duration-300 animate-card-rise"
              style={{ animationDelay: `${i * 0.09}s` }}
            >
              <div className="text-3xl mb-3 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                {output.emoji}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{output.name}</h3>
                <span className="text-xs bg-coffee-100 text-coffee-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                  {output.timing}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{output.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <SectionWrapper className="bg-gray-50">
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
