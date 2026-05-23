"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TabId = "live" | "paid" | "seo" | "social" | "weekly";

const TABS: { id: TabId; label: string }[] = [
  { id: "live",   label: "📊 Live Overview"  },
  { id: "paid",   label: "🎯 Paid Ads"       },
  { id: "seo",    label: "🔍 SEO & Organic"  },
  { id: "social", label: "📱 Social Media"   },
  { id: "weekly", label: "📧 Weekly Brief"   },
];

const SPARKLINES: Record<string, string> = {
  up:   "0,18 10,15 20,14 30,9 40,11 50,6 60,3",
  flat: "0,11 10,10 20,12 30,9 40,11 50,10 60,10",
  down: "0,3  10,6  20,5  30,9 40,10 50,13 60,17",
};

// ── Live Overview data ──────────────────────────────────────────────────────
const LIVE_PAID = [
  { name: "Google Ads",    abbr: "GA",  color: "#4285F4", primary: "4.2× ROAS",  s1: "$2,100 spend", s2: "52 leads",    spark: "up",   pct: "+8%",  good: true  },
  { name: "Meta Ads",      abbr: "fb",  color: "#0866FF", primary: "3.1× ROAS",  s1: "$1,480 spend", s2: "28 leads",    spark: "up",   pct: "+5%",  good: true  },
  { name: "YouTube Ads",   abbr: "YT",  color: "#FF0000", primary: "2.6× ROAS",  s1: "$480 spend",   s2: "8.4k views",  spark: "up",   pct: "+12%", good: true  },
  { name: "TikTok Ads",    abbr: "TT",  color: "#010101", primary: "2.9× ROAS",  s1: "$700 spend",   s2: "14 leads",    spark: "flat", pct: "0%",   good: null  },
  { name: "LinkedIn Ads",  abbr: "Li",  color: "#0A66C2", primary: "$68 CPL",    s1: "$340 spend",   s2: "5 leads",     spark: "down", pct: "+14%", good: false },
  { name: "Microsoft Ads", abbr: "MS",  color: "#00A4EF", primary: "3.7× ROAS",  s1: "$220 spend",   s2: "11 leads",    spark: "up",   pct: "+3%",  good: true  },
];
const LIVE_ORGANIC = [
  { name: "Search Console",abbr: "SC",  color: "#EA4335", primary: "1,240 clicks",s1: "pos. 4.2 avg", s2: "3.8% CTR",   spark: "up",   pct: "+12%", good: true  },
  { name: "Google Business",abbr:"GBP", color: "#FBBC04", primary: "4,821 views", s1: "47 calls",     s2: "23 directions",spark:"up",  pct: "+6%",  good: true  },
  { name: "Instagram",     abbr: "IG",  color: "#C13584", primary: "12.4k reach", s1: "4.2% eng.",    s2: "+87 followers",spark:"up",  pct: "+9%",  good: true  },
  { name: "Email & SMS",   abbr: "EM",  color: "#7C3AED", primary: "28% open",    s1: "4.1% CTR",     s2: "$680 revenue", spark:"flat", pct: "+1%",  good: true  },
];

// ── Paid Ads data ───────────────────────────────────────────────────────────
const ROAS_BARS = [
  { name: "Google Ads",   color: "#4285F4", roas: 4.2 },
  { name: "Microsoft Ads",color: "#00A4EF", roas: 3.7 },
  { name: "TikTok Ads",   color: "#555",    roas: 2.9 },
  { name: "Meta Ads",     color: "#0866FF", roas: 3.1 },
  { name: "YouTube Ads",  color: "#FF0000", roas: 2.6 },
  { name: "LinkedIn Ads", color: "#0A66C2", roas: 2.1 },
];

const TOP_KWS = [
  { kw: "hair salon austin tx",     pos: 3,  delta: +1, clicks: 142, ctr: "8.2%", status: "good"    },
  { kw: "best hair salon near me",  pos: 5,  delta: +2, clicks: 89,  ctr: "4.1%", status: "good"    },
  { kw: "hair coloring austin",     pos: 12, delta: -1, clicks: 31,  ctr: "1.8%", status: "warning" },
  { kw: "balayage austin tx",       pos: 7,  delta: +3, clicks: 58,  ctr: "5.9%", status: "good"    },
  { kw: "hair salon open sunday",   pos: 8,  delta:  0, clicks: 64,  ctr: "3.3%", status: "ok"      },
];

// ── SEO & Organic data ──────────────────────────────────────────────────────
const RANK_DIST = [
  { range: "Pos. 1–3",  count: 12,  color: "#34A853", pct: 90 },
  { range: "Pos. 4–10", count: 47,  color: "#FBBC04", pct: 72 },
  { range: "Pos. 11–20",count: 83,  color: "#E8710A", pct: 52 },
  { range: "Pos. 21+",  count: 183, color: "#D1D5DB", pct: 100 },
];

// ── Social data ─────────────────────────────────────────────────────────────
const SOCIAL = [
  { platform: "Instagram",      abbr: "IG", color: "#C13584", followers: "4,218", growth: "+87",  eng: "4.2%", posts: 5,  spark: "up"   },
  { platform: "TikTok Organic", abbr: "TK", color: "#010101", followers: "1,847", growth: "+134", eng: "6.9%", posts: 8,  spark: "up"   },
  { platform: "X / Twitter",    abbr: "X",  color: "#1DA1F2", followers: "1,203", growth: "+5",   eng: "1.2%", posts: 12, spark: "flat" },
  { platform: "Facebook Page",  abbr: "FB", color: "#1877F2", followers: "2,104", growth: "+12",  eng: "1.8%", posts: 4,  spark: "flat" },
  { platform: "LinkedIn Page",  abbr: "Li", color: "#0A66C2", followers: "891",   growth: "+23",  eng: "2.4%", posts: 3,  spark: "up"   },
  { platform: "YouTube Channel",abbr: "YT", color: "#FF0000", followers: "456",   growth: "+8",   eng: "3.1%", posts: 2,  spark: "up"   },
];

// ── Weekly brief data ───────────────────────────────────────────────────────
const WEEKLY_METRICS = [
  { label: "Total Ad Spend",   value: "$5,320", change: +4.1,  positive: false },
  { label: "Total Leads",      value: "138",    change: +22.3, positive: true  },
  { label: "Blended CPL",      value: "$38.55", change: -14.8, positive: true  },
  { label: "Blended ROAS",     value: "3.9×",   change: +9.7,  positive: true  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function Sparkline({ type, color }: { type: string; color: string }) {
  const pts = SPARKLINES[type] ?? SPARKLINES.flat;
  const stroke = type === "up" ? "#34A853" : type === "down" ? "#ef4444" : "#9ca3af";
  return (
    <svg viewBox="0 0 60 22" className="w-14 h-4 shrink-0">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PctBadge({ pct, good }: { pct: string; good: boolean | null }) {
  const cls = good === true ? "text-green-400" : good === false ? "text-red-400" : "text-gray-500";
  return <span className={`text-xs font-semibold ${cls}`}>{pct}</span>;
}

function ChannelCard({ ch }: { ch: typeof LIVE_PAID[0] }) {
  return (
    <div className="bg-gray-800/60 rounded-xl border border-gray-700/60 p-3.5 hover:border-gray-600 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: ch.color }}>{ch.abbr}</div>
          <span className="text-gray-300 text-xs font-medium truncate">{ch.name}</span>
        </div>
        <PctBadge pct={ch.pct} good={ch.good} />
      </div>
      <div className="text-white font-bold text-lg leading-tight mb-1">{ch.primary}</div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-gray-500 text-xs">{ch.s1}</div>
          <div className="text-gray-500 text-xs">{ch.s2}</div>
        </div>
        <Sparkline type={ch.spark} color={ch.color} />
      </div>
    </div>
  );
}

// ── Tab panels ───────────────────────────────────────────────────────────────

function LiveOverview() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-xs">May 19–25, 2026 · Bloom Hair Studio, Austin TX</span>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live · updated 2 min ago
        </span>
      </div>
      <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Paid Channels</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {LIVE_PAID.map(ch => <ChannelCard key={ch.name} ch={ch} />)}
      </div>
      <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-widest">Organic &amp; Owned</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LIVE_ORGANIC.map(ch => <ChannelCard key={ch.name} ch={ch} />)}
      </div>
    </div>
  );
}

function PaidAds() {
  const max = Math.max(...ROAS_BARS.map(b => b.roas));
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-white font-semibold">ROAS by Channel</span>
        <span className="text-gray-500 text-xs">This week vs last week</span>
      </div>
      <div className="space-y-3 mb-8">
        {ROAS_BARS.map(b => (
          <div key={b.name} className="flex items-center gap-3">
            <div className="w-24 text-gray-400 text-xs shrink-0 text-right">{b.name}</div>
            <div className="flex-1 bg-gray-800 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center px-3 mdx-bar-grow"
                style={{ width: `${(b.roas / max) * 100}%`, backgroundColor: b.color, "--bar-target": `${(b.roas / max) * 100}%` } as React.CSSProperties}
              >
                <span className="text-white text-xs font-bold">{b.roas}×</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-white font-semibold mb-3">Top Performing Keywords (Google Ads)</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="text-gray-500 border-b border-gray-700">
            <th className="text-left pb-2 font-medium">Keyword</th>
            <th className="text-right pb-2 font-medium">Pos.</th>
            <th className="text-right pb-2 font-medium">Clicks</th>
            <th className="text-right pb-2 font-medium">CTR</th>
            <th className="text-right pb-2 font-medium">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-800">
            {TOP_KWS.map(k => (
              <tr key={k.kw} className="text-gray-300">
                <td className="py-2 pr-4 font-mono text-gray-400">{k.kw}</td>
                <td className="py-2 text-right text-white font-semibold">{k.pos}</td>
                <td className="py-2 text-right">{k.clicks}</td>
                <td className="py-2 text-right">{k.ctr}</td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${k.status === "good" ? "bg-green-900/60 text-green-400" : k.status === "warning" ? "bg-amber-900/60 text-amber-400" : "bg-gray-800 text-gray-400"}`}>
                    {k.status === "good" ? "Strong" : k.status === "warning" ? "Watch" : "OK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SeoOrganic() {
  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[{ l: "Organic Sessions", v: "3,847", d: "+12%", g: true }, { l: "Keywords Ranked", v: "325", d: "+8", g: true }, { l: "Avg. Position", v: "8.4", d: "-1.2", g: true }].map(s => (
          <div key={s.l} className="bg-gray-800/60 rounded-xl border border-gray-700/60 p-4">
            <div className="text-gray-400 text-xs mb-1">{s.l}</div>
            <div className="text-white font-bold text-xl">{s.v}</div>
            <div className={`text-xs font-medium mt-1 ${s.g ? "text-green-400" : "text-red-400"}`}>{s.d} vs last week</div>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <div className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-widest">Keyword Ranking Distribution</div>
        <div className="space-y-2">
          {RANK_DIST.map(r => (
            <div key={r.range} className="flex items-center gap-3">
              <div className="w-20 text-gray-500 text-xs shrink-0">{r.range}</div>
              <div className="flex-1 bg-gray-800 rounded-full h-5 overflow-hidden">
                <div className="h-full rounded-full mdx-bar-grow flex items-center px-2" style={{ width: `${r.pct}%`, backgroundColor: r.color, "--bar-target": `${r.pct}%` } as React.CSSProperties}>
                  <span className="text-white text-xs font-bold">{r.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-widest">Google Business Profile</div>
      <div className="grid grid-cols-3 gap-3">
        {[{ l: "Profile Views", v: "4,821", d: "+6%" }, { l: "Phone Calls", v: "47", d: "+18%" }, { l: "Direction Requests", v: "23", d: "+4%" }].map(s => (
          <div key={s.l} className="bg-gray-800/60 rounded-xl border border-gray-700/60 p-3 text-center">
            <div className="text-white font-bold text-lg">{s.v}</div>
            <div className="text-gray-500 text-xs">{s.l}</div>
            <div className="text-green-400 text-xs font-medium">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialMedia() {
  return (
    <div>
      <div className="text-gray-400 text-xs mb-4 font-semibold uppercase tracking-widest">Follower Growth &amp; Engagement</div>
      <div className="space-y-3 mb-6">
        {SOCIAL.map(s => (
          <div key={s.platform} className="flex items-center gap-3 bg-gray-800/60 border border-gray-700/60 rounded-xl p-3">
            <div className="w-8 h-8 rounded-lg text-white text-xs font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: s.color }}>{s.abbr}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-semibold">{s.platform}</span>
                <span className="text-green-400 text-xs font-semibold">{s.growth} this week</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-gray-400 text-xs">{s.followers} followers</span>
                <span className="text-gray-400 text-xs">{s.eng} eng.</span>
                <span className="text-gray-500 text-xs">{s.posts} posts</span>
              </div>
            </div>
            <Sparkline type={s.spark} color={s.color} />
          </div>
        ))}
      </div>
      <div className="text-gray-400 text-xs mb-3 font-semibold uppercase tracking-widest">Engagement Rate Benchmark</div>
      <div className="space-y-2">
        {SOCIAL.slice(0,4).map(s => {
          const pct = parseFloat(s.eng);
          return (
            <div key={s.platform} className="flex items-center gap-3">
              <div className="w-24 text-gray-500 text-xs shrink-0">{s.platform.split(" ")[0]}</div>
              <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                <div className="h-full rounded-full mdx-bar-grow" style={{ width: `${(pct / 8) * 100}%`, backgroundColor: s.color, "--bar-target": `${(pct / 8) * 100}%` } as React.CSSProperties} />
              </div>
              <span className="text-gray-400 text-xs w-10 text-right">{s.eng}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyBrief() {
  return (
    <div>
      <div className="bg-gradient-to-r from-coffee-900/80 to-coffee-800/80 rounded-xl px-5 py-4 flex items-center justify-between mb-5 border border-coffee-700/40">
        <div>
          <div className="text-coffee-300 text-xs font-semibold uppercase tracking-widest">Weekly Brief · May 19–25, 2026</div>
          <div className="text-white font-bold text-base mt-0.5">Bloom Hair Studio — Austin TX</div>
        </div>
        <div className="text-3xl animate-float">☕</div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {WEEKLY_METRICS.map(m => (
          <div key={m.label} className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-3">
            <div className="text-gray-400 text-xs mb-1">{m.label}</div>
            <div className="text-white font-bold text-xl tabular-nums">{m.value}</div>
            <div className={`text-xs font-medium mt-1 flex items-center gap-0.5 ${m.positive ? "text-green-400" : "text-red-400"}`}>
              {m.positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(m.change)}% vs last week
            </div>
          </div>
        ))}
      </div>
      <div className="bg-coffee-950/60 border border-coffee-800/40 rounded-xl p-4">
        <div className="text-coffee-300 text-xs font-bold uppercase tracking-widest mb-3">This week&apos;s 3 priorities</div>
        <ol className="space-y-2.5">
          {[
            "Pause 3 Google Ads keywords with CPL > $90 — dragging blended average up by ~$8.",
            "Refresh Meta creative for hair treatment offer — CTR dropped 22% over 10 days.",
            "Reply to 2 unanswered Google reviews — response rate affects Maps ranking.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span className="w-5 h-5 rounded-full bg-coffee-700 text-coffee-100 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function DashboardTabs() {
  const [active, setActive] = useState<TabId>("live");

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-700/80 overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-950 border-b border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-gray-500 text-xs mx-auto">DataLatte Analytics · datalatte.pro/dashboard</span>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-800 bg-gray-950/60">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
              active === tab.id
                ? "text-white border-coffee-500 bg-gray-900/80"
                : "text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="p-5 min-h-64">
        {active === "live"   && <LiveOverview />}
        {active === "paid"   && <PaidAds />}
        {active === "seo"    && <SeoOrganic />}
        {active === "social" && <SocialMedia />}
        {active === "weekly" && <WeeklyBrief />}
      </div>
    </div>
  );
}
