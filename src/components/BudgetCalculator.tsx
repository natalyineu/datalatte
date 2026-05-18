"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Copy, Check } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Niche    = "coffee" | "salon" | "pet" | "fitness" | "startup" | "freelancer" | "other";
type Stage    = "new" | "growing" | "established";
type Goal     = "customers" | "visibility" | "retention" | "growth";

interface Channel {
  label:   string;
  href:    string;
  emoji:   string;
  pct:     number;   // % of total budget
  color:   string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const NICHES: { value: Niche; emoji: string; label: string }[] = [
  { value: "coffee",     emoji: "☕", label: "Coffee Shop" },
  { value: "salon",      emoji: "✂️", label: "Hair & Beauty" },
  { value: "pet",        emoji: "🐾", label: "Pet Business" },
  { value: "fitness",    emoji: "🏋️", label: "Fitness Studio" },
  { value: "startup",    emoji: "🚀", label: "Startup" },
  { value: "freelancer", emoji: "💼", label: "Freelancer" },
  { value: "other",      emoji: "🏪", label: "Other" },
];

const STAGES: { value: Stage; label: string; desc: string; pct: number }[] = [
  { value: "new",         label: "Just starting out",   desc: "< 1 year in business",    pct: 0.16 },
  { value: "growing",     label: "Growing steadily",    desc: "1 – 3 years in business", pct: 0.12 },
  { value: "established", label: "Well established",    desc: "3+ years in business",    pct: 0.07 },
];

const GOALS: { value: Goal; emoji: string; label: string; desc: string }[] = [
  { value: "customers",  emoji: "🎯", label: "Get more customers",        desc: "Paid ads & lead generation"       },
  { value: "visibility", emoji: "📍", label: "Improve local visibility",  desc: "SEO, Google Maps & reviews"      },
  { value: "retention",  emoji: "💌", label: "Keep existing customers",   desc: "Email, SMS & social media"        },
  { value: "growth",     emoji: "📈", label: "Full-scale growth",         desc: "All channels working together"   },
];

// Channel breakdowns by goal (must sum to 100)
const ALLOCATIONS: Record<Goal, Channel[]> = {
  customers: [
    { label: "Google Ads",               href: "/services/google-ads",               emoji: "🔍", pct: 40, color: "bg-amber-500"    },
    { label: "Meta Ads",                 href: "/services/meta-ads",                 emoji: "📱", pct: 28, color: "bg-blue-500"     },
    { label: "Local SEO",                href: "/services/local-seo",                emoji: "🗺️", pct: 17, color: "bg-emerald-500"  },
    { label: "Google Business Profile",  href: "/services/google-business-profile",  emoji: "📍", pct: 10, color: "bg-red-500"      },
    { label: "Email & SMS",              href: "/services/email-sms",                emoji: "📧", pct:  5, color: "bg-purple-500"   },
  ],
  visibility: [
    { label: "Local SEO",                href: "/services/local-seo",                emoji: "🗺️", pct: 35, color: "bg-emerald-500"  },
    { label: "Google Business Profile",  href: "/services/google-business-profile",  emoji: "📍", pct: 25, color: "bg-red-500"      },
    { label: "Google Ads",               href: "/services/google-ads",               emoji: "🔍", pct: 22, color: "bg-amber-500"    },
    { label: "Social Media",             href: "/services/social-media",             emoji: "📣", pct: 13, color: "bg-pink-500"     },
    { label: "Email & SMS",              href: "/services/email-sms",                emoji: "📧", pct:  5, color: "bg-purple-500"   },
  ],
  retention: [
    { label: "Email & SMS",              href: "/services/email-sms",                emoji: "📧", pct: 35, color: "bg-purple-500"   },
    { label: "Social Media",             href: "/services/social-media",             emoji: "📣", pct: 25, color: "bg-pink-500"     },
    { label: "Meta Ads",                 href: "/services/meta-ads",                 emoji: "📱", pct: 20, color: "bg-blue-500"     },
    { label: "Google Ads",               href: "/services/google-ads",               emoji: "🔍", pct: 15, color: "bg-amber-500"    },
    { label: "Analytics",                href: "/services/analytics",                emoji: "📊", pct:  5, color: "bg-teal-500"     },
  ],
  growth: [
    { label: "Google Ads",               href: "/services/google-ads",               emoji: "🔍", pct: 30, color: "bg-amber-500"    },
    { label: "Meta Ads",                 href: "/services/meta-ads",                 emoji: "📱", pct: 22, color: "bg-blue-500"     },
    { label: "Local SEO",                href: "/services/local-seo",                emoji: "🗺️", pct: 20, color: "bg-emerald-500"  },
    { label: "Email & SMS",              href: "/services/email-sms",                emoji: "📧", pct: 12, color: "bg-purple-500"   },
    { label: "Google Business Profile",  href: "/services/google-business-profile",  emoji: "📍", pct:  9, color: "bg-red-500"      },
    { label: "Social Media",             href: "/services/social-media",             emoji: "📣", pct:  7, color: "bg-pink-500"     },
  ],
};

// Niche-specific tips
const NICHE_TIPS: Record<Niche, string> = {
  coffee:     "Coffee shops see the best ROI from Google Maps ads and loyalty email campaigns — regulars spend 67% more than new visitors.",
  salon:      "Salons convert best with Instagram/Meta Ads showing before & after photos. Google Ads works well for 'hair salon near me' searches.",
  pet:        "Pet businesses benefit from Google Business Profile reviews and local SEO — 82% of pet owners search locally before booking.",
  fitness:    "Fitness studios see January peaks — budget 30% more in Dec–Jan. Retargeting lapsed members via email has the highest ROI.",
  startup:    "Startups should front-load brand awareness (Meta Ads) before converting to performance. Allocate 20% to testing new channels.",
  freelancer: "Freelancers convert best through LinkedIn + email nurture. A content + SEO strategy compounds over time with low ongoing cost.",
  other:      "Mix paid and organic channels. Start with Google Ads for fast results, then invest in SEO for long-term compounding returns.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function calcBudget(revenue: number, stagePct: number) {
  const raw = Math.round(revenue * stagePct);
  return Math.max(500, raw); // floor at $500/month
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
              ${i < step  ? "bg-coffee-700 text-white" : ""}
              ${i === step ? "bg-coffee-600 text-white ring-4 ring-coffee-100" : ""}
              ${i > step  ? "bg-gray-100 text-gray-400" : ""}`}
          >
            {i < step ? <Check size={13} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-0.5 w-8 transition-all duration-300 ${i < step ? "bg-coffee-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
      <span className="text-xs text-gray-400 ml-1">Step {step + 1} of {total}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BudgetCalculator() {
  const [step,    setStep]    = useState(0);
  const [niche,   setNiche]   = useState<Niche | null>(null);
  const [revenue, setRevenue] = useState(15000);
  const [stage,   setStage]   = useState<Stage | null>(null);
  const [goal,    setGoal]    = useState<Goal | null>(null);
  const [copied,  setCopied]  = useState(false);

  // Lead capture
  const [email,        setEmail]        = useState("");
  const [leadStatus,   setLeadStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [showLeadForm, setShowLeadForm] = useState(true);

  // ── Derived results ──────────────────────────────────────────────────────
  const stageConfig    = STAGES.find(s => s.value === stage);
  const totalBudget    = stage ? calcBudget(revenue, stageConfig!.pct) : 0;
  const channels       = goal  ? ALLOCATIONS[goal]  : [];
  const nicheTip       = niche ? NICHE_TIPS[niche]  : "";

  // ── Actions ──────────────────────────────────────────────────────────────
  function handleCopy() {
    const text = channels
      .map(c => `${c.label}: ${fmt(Math.round(totalBudget * c.pct / 100))}`)
      .join("\n");
    navigator.clipboard.writeText(
      `My recommended marketing budget: ${fmt(totalBudget)}/month\n\n${text}\n\nCalculated at datalatte.pro/tools/marketing-budget-calculator`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "budget-calculator" }),
      });
      setLeadStatus(res.ok ? "done" : "error");
    } catch {
      setLeadStatus("error");
    }
  }

  // ── Rendering ────────────────────────────────────────────────────────────

  // Step 0 — Niche
  if (step === 0) return (
    <div>
      <StepIndicator step={0} total={4} />
      <h2 className="text-xl font-bold text-gray-900 mb-1">What type of business do you run?</h2>
      <p className="text-gray-500 text-sm mb-5">We'll tailor your budget to your industry.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NICHES.map(n => (
          <button
            key={n.value}
            onClick={() => { setNiche(n.value); setStep(1); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer
              ${niche === n.value
                ? "border-coffee-600 bg-coffee-50 text-coffee-800"
                : "border-gray-200 hover:border-coffee-300 hover:bg-coffee-50/50 text-gray-700"}`}
          >
            <span className="text-3xl">{n.emoji}</span>
            <span className="text-sm font-medium">{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Step 1 — Revenue
  if (step === 1) return (
    <div>
      <StepIndicator step={1} total={4} />
      <h2 className="text-xl font-bold text-gray-900 mb-1">What's your approximate monthly revenue?</h2>
      <p className="text-gray-500 text-sm mb-6">This helps us recommend a realistic budget. Don't worry — it's just a guide.</p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Monthly revenue</span>
          <span className="text-2xl font-bold text-coffee-700">{fmt(revenue)}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={150000}
          step={1000}
          value={revenue}
          onChange={e => setRevenue(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-coffee-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$1,000</span>
          <span>$150,000+</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-8">
        {[3000, 8000, 15000, 30000, 60000].map(v => (
          <button
            key={v}
            onClick={() => setRevenue(v)}
            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all
              ${revenue === v
                ? "border-coffee-600 bg-coffee-50 text-coffee-700"
                : "border-gray-200 text-gray-500 hover:border-coffee-300"}`}
          >
            {fmt(v)}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(0)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={() => setStep(2)} className="flex-1 btn-primary justify-center py-2.5 text-sm group">
          Continue <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );

  // Step 2 — Stage
  if (step === 2) return (
    <div>
      <StepIndicator step={2} total={4} />
      <h2 className="text-xl font-bold text-gray-900 mb-1">How long have you been in business?</h2>
      <p className="text-gray-500 text-sm mb-5">Newer businesses typically invest a higher % of revenue in marketing.</p>

      <div className="space-y-3 mb-8">
        {STAGES.map(s => (
          <button
            key={s.value}
            onClick={() => setStage(s.value)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left
              ${stage === s.value
                ? "border-coffee-600 bg-coffee-50"
                : "border-gray-200 hover:border-coffee-300 hover:bg-coffee-50/50"}`}
          >
            <div>
              <p className={`font-semibold ${stage === s.value ? "text-coffee-800" : "text-gray-800"}`}>{s.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </div>
            <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${stage === s.value ? "bg-coffee-700 text-white" : "bg-gray-100 text-gray-500"}`}>
              ~{Math.round(s.pct * 100)}% of revenue
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!stage}
          className="flex-1 btn-primary justify-center py-2.5 text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );

  // Step 3 — Goal → shows results
  if (step === 3) return (
    <div>
      <StepIndicator step={3} total={4} />
      <h2 className="text-xl font-bold text-gray-900 mb-1">What's your #1 marketing goal?</h2>
      <p className="text-gray-500 text-sm mb-5">This determines how we split your budget across channels.</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {GOALS.map(g => (
          <button
            key={g.value}
            onClick={() => setGoal(g.value)}
            className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left
              ${goal === g.value
                ? "border-coffee-600 bg-coffee-50"
                : "border-gray-200 hover:border-coffee-300 hover:bg-coffee-50/50"}`}
          >
            <span className="text-2xl leading-none">{g.emoji}</span>
            <div>
              <p className={`font-semibold text-sm ${goal === g.value ? "text-coffee-800" : "text-gray-800"}`}>{g.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => { if (goal) setStep(4); }}
          disabled={!goal}
          className="flex-1 btn-primary justify-center py-2.5 text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          See my results <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );

  // Step 4 — Results
  if (step === 4 && niche && stage && goal) return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 size={22} className="text-green-600" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">Your recommended budget</p>
          <p className="text-gray-500 text-xs">Based on your {NICHES.find(n=>n.value===niche)?.label} business</p>
        </div>
      </div>

      {/* Total budget pill */}
      <div className="bg-gradient-to-r from-coffee-700 to-coffee-500 rounded-2xl p-6 text-white mb-6">
        <p className="text-coffee-200 text-sm mb-1">Recommended monthly marketing budget</p>
        <p className="text-4xl font-bold">{fmt(totalBudget)}</p>
        <p className="text-coffee-200 text-sm mt-1">
          ~{Math.round((totalBudget / revenue) * 100)}% of your {fmt(revenue)}/month revenue
          {totalBudget === 500 && " (minimum recommended)"}
        </p>
      </div>

      {/* Channel breakdown */}
      <div className="mb-5">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Budget breakdown by channel</h3>
        <div className="space-y-3">
          {channels.map(ch => {
            const amount = Math.round(totalBudget * ch.pct / 100);
            return (
              <div key={ch.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{ch.emoji}</span>
                    <Link href={ch.href} className="text-sm font-medium text-gray-700 hover:text-coffee-700 transition-colors">
                      {ch.label}
                    </Link>
                    <span className="text-xs text-gray-400">{ch.pct}%</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{fmt(amount)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ch.color} transition-all duration-700`}
                    style={{ width: `${ch.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Niche tip */}
      <div className="bg-coffee-50 border border-coffee-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-coffee-700 mb-1">☕ Pro tip for {NICHES.find(n=>n.value===niche)?.label}s</p>
        <p className="text-xs text-gray-600 leading-relaxed">{nicheTip}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
        >
          {copied ? <><Check size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy results</>}
        </button>
        <button onClick={() => setStep(0)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
          Start over
        </button>
      </div>

      {/* CTA — Free audit */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4">
        <p className="font-bold mb-1">Want a custom plan, not just a calculator?</p>
        <p className="text-gray-400 text-sm mb-4">
          I'll review your current setup and tell you exactly where to invest {fmt(totalBudget)}/month for maximum ROI — free, no commitment.
        </p>
        <Link
          href={`/contact?budget=${totalBudget}&niche=${niche}&goal=${goal}`}
          className="flex items-center justify-center gap-2 w-full bg-coffee-600 hover:bg-coffee-500 text-white font-semibold py-3 rounded-xl transition-colors group"
        >
          Book my free audit
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Lead capture — email results */}
      {showLeadForm && leadStatus !== "done" && (
        <div className="border border-gray-100 rounded-2xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">📧 Email yourself these results</p>
          <p className="text-xs text-gray-500 mb-3">We'll also send you a free weekly marketing tip for {NICHES.find(n=>n.value===niche)?.label}s.</p>
          <form onSubmit={handleLeadSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-coffee-400 focus:ring-2 focus:ring-coffee-100 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={leadStatus === "loading"}
              className="bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {leadStatus === "loading" ? "…" : "Send"}
            </button>
          </form>
          {leadStatus === "error" && <p className="text-red-500 text-xs mt-1">Something went wrong — try again.</p>}
          <button onClick={() => setShowLeadForm(false)} className="text-xs text-gray-400 mt-2 hover:text-gray-600 transition-colors">
            No thanks
          </button>
        </div>
      )}

      {leadStatus === "done" && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <CheckCircle2 size={18} className="text-green-500 mx-auto mb-1" />
          <p className="text-sm text-green-700 font-medium">Results sent! Check your inbox ☕</p>
        </div>
      )}
    </div>
  );

  return null;
}
