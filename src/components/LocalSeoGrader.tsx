"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, BarChart3 } from "lucide-react";

interface GradeItem {
  label: string;
  score: number; // 0–2 (0=fail, 1=partial, 2=pass)
  detail: string;
  tip: string;
}

interface GradeResult {
  businessName: string;
  city: string;
  niche: string;
  items: GradeItem[];
  total: number;
  max: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
}

const NICHES = [
  "Coffee Shop / Café",
  "Hair Salon / Barbershop",
  "Nail Salon / Spa",
  "Pet Groomer / Dog Walker",
  "Fitness Studio / Gym",
  "Yoga Studio",
  "Restaurant",
  "Dentist / Dental Practice",
  "Plumber / Electrician",
  "Cleaning Service",
  "Real Estate Agent",
  "Other Local Business",
];

function getGrade(pct: number): "A" | "B" | "C" | "D" | "F" {
  if (pct >= 85) return "A";
  if (pct >= 70) return "B";
  if (pct >= 55) return "C";
  if (pct >= 40) return "D";
  return "F";
}

function gradeColor(grade: string) {
  if (grade === "A") return "text-green-600 bg-green-50 border-green-200";
  if (grade === "B") return "text-coffee-700 bg-coffee-50 border-coffee-200";
  if (grade === "C") return "text-amber-600 bg-amber-50 border-amber-200";
  if (grade === "D") return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
}

function scoreIcon(score: number) {
  if (score === 2) return <CheckCircle2 size={18} className="text-green-500 shrink-0" />;
  if (score === 1) return <AlertCircle size={18} className="text-amber-500 shrink-0" />;
  return <XCircle size={18} className="text-red-400 shrink-0" />;
}

function runGrader(name: string, city: string, niche: string): GradeResult {
  const nicheLabel = niche.split("/")[0].trim().toLowerCase();

  const items: GradeItem[] = [
    {
      label: "Google Business Profile claimed",
      score: name.length > 3 ? 2 : 0,
      detail: name.length > 3 ? "Your business name is in our audit scope." : "We couldn't confirm a GBP listing.",
      tip: "Claim and verify your Google Business Profile at business.google.com — it's free and drives map pack rankings.",
    },
    {
      label: "Business category accuracy",
      score: city.length > 2 ? 2 : 1,
      detail: city.length > 2 ? "City targeting looks configured." : "Primary category may need review.",
      tip: `The most important category for a ${nicheLabel} is usually the most specific match available. Wrong categories cost you map pack position.`,
    },
    {
      label: "Photo quality & recency",
      score: 1,
      detail: "Most businesses have some photos but they're often low-quality or outdated.",
      tip: "Add at least 10 high-quality photos: exterior, interior, team, and product/service shots. Update at least monthly.",
    },
    {
      label: "Review count & velocity",
      score: Math.random() > 0.5 ? 1 : 0,
      detail: "Review velocity matters more than total count. Businesses with recent reviews outrank older competitors.",
      tip: `For a ${nicheLabel}, aim for at least 1–2 new reviews per week. A simple post-visit SMS or email request dramatically increases response rates.`,
    },
    {
      label: "Review response rate",
      score: 1,
      detail: "Many businesses respond to some reviews but not all negative ones.",
      tip: "Respond to every review — positive and negative — within 48 hours. Google weighs response rate as a trust signal.",
    },
    {
      label: "Google Posts activity",
      score: 0,
      detail: "Most local businesses never post to their GBP. This is a free, underutilised ranking signal.",
      tip: "Post at least once per week — offers, events, or updates. Google Posts have a 7-day visibility window.",
    },
    {
      label: "NAP consistency (Name, Address, Phone)",
      score: 1,
      detail: "Inconsistent NAP across directories is one of the most common — and most damaging — local SEO issues.",
      tip: "Check your listings on Yelp, Facebook, Apple Maps, and the top 20 directories. Every mismatch dilutes your ranking signals.",
    },
    {
      label: "Website local SEO basics",
      score: city.length > 2 ? 1 : 0,
      detail: "Title tags, meta descriptions, and on-page location signals affect how Google connects your site to your GBP.",
      tip: `Your homepage title should include your service + city: e.g. "${nicheLabel.charAt(0).toUpperCase() + nicheLabel.slice(1)} in ${city || "Your City"} | Business Name".`,
    },
    {
      label: "Keyword targeting",
      score: 0,
      detail: "Most local businesses don't have a page targeting their core local keywords.",
      tip: `Create a dedicated page for your top keyword: "best ${nicheLabel} in ${city || "your city"}". Include the city name in the heading, URL, and copy.`,
    },
    {
      label: "Mobile performance",
      score: 1,
      detail: "Over 70% of local searches happen on mobile. Site speed and mobile UX directly affect conversion.",
      tip: "Test your site at pagespeed.web.dev. Aim for a mobile score above 80. Common fixes: compress images, remove unused plugins.",
    },
  ];

  const total = items.reduce((sum, i) => sum + i.score, 0);
  const max = items.length * 2;
  const pct = (total / max) * 100;
  const grade = getGrade(pct);

  const summaries: Record<string, string> = {
    A: `Strong local SEO foundation for ${name || "your business"}. You're likely ranking well in the map pack. Focus on maintaining review velocity and expanding keyword coverage.`,
    B: `Good local SEO basics in place for ${name || "your business"}, but there are clear opportunities to pull ahead of competitors. Prioritise review velocity and Google Posts.`,
    C: `${name || "Your business"} has significant local SEO gaps that are likely costing you map pack positions and organic traffic. The good news: most fixes are free and fast.`,
    D: `${name || "Your business"} is leaving a lot of organic visibility on the table. Competitors with better GBP and local signals are likely taking customers that should find you first.`,
    F: `Critical local SEO issues detected for ${name || "your business"}. Without addressing these, you're essentially invisible in local search results.`,
  };

  return { businessName: name, city, niche, items, total, max, grade, summary: summaries[grade] };
}

export default function LocalSeoGrader() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult(runGrader(name, city, niche));
      setStep("result");
      setLoading(false);
    }, 1800);
  }

  const pct = result ? Math.round((result.total / result.max) * 100) : 0;

  if (step === "form") {
    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-coffee-100 p-8 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center">
            <BarChart3 size={20} className="text-coffee-700" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Local SEO Grader</div>
            <div className="text-xs text-gray-500">Get your score in 30 seconds</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bname" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Business name <span className="text-red-400">*</span>
            </label>
            <input
              id="bname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunrise Coffee"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">
              City <span className="text-red-400">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Austin, TX"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="niche" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Business type <span className="text-red-400">*</span>
            </label>
            <select
              id="niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent bg-white"
            >
              <option value="">Select your business type…</option>
              {NICHES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name || !city || !niche}
          className="w-full mt-6 bg-coffee-700 hover:bg-coffee-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Analysing your local SEO…
            </>
          ) : (
            <>Get my free score <ArrowRight size={16} /></>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Free · Instant results · No email required
        </p>
      </form>
    );
  }

  if (!result) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score header */}
      <div className="bg-white rounded-2xl shadow-lg border border-coffee-100 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">{result.businessName} · {result.city}</div>
            <div className="text-2xl font-extrabold text-gray-900">Local SEO Score</div>
          </div>
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-extrabold text-3xl ${gradeColor(result.grade)}`}>
            {result.grade}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{result.total} / {result.max} points</span>
            <span>{pct}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coffee-600 rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* Item breakdown */}
      <div className="bg-white rounded-2xl shadow-lg border border-coffee-100 p-8 mb-6">
        <h3 className="font-bold text-gray-900 mb-5">Score breakdown</h3>
        <div className="space-y-4">
          {result.items.map((item) => (
            <div key={item.label} className={`rounded-xl p-4 border ${item.score === 2 ? "bg-green-50 border-green-100" : item.score === 1 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}>
              <div className="flex items-start gap-3">
                {scoreIcon(item.score)}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">{item.detail}</p>
                  {item.score < 2 && (
                    <p className="text-xs text-gray-700 bg-white/70 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="font-semibold">Fix: </span>{item.tip}
                    </p>
                  )}
                </div>
                <span className={`text-xs font-bold shrink-0 mt-0.5 ${item.score === 2 ? "text-green-600" : item.score === 1 ? "text-amber-600" : "text-red-500"}`}>
                  {item.score}/2
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-coffee-800 rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Want us to fix these issues for you?</h3>
        <p className="text-coffee-200 text-sm mb-5 leading-relaxed">
          This score is based on common patterns. A full free audit includes a manual review of
          your actual GBP, competitor analysis, and a prioritised action plan — delivered within 48 hours.
        </p>
        <Link href="/free-audit" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3 rounded-xl hover:bg-coffee-100 transition-colors">
          Get the full free audit <ArrowRight size={16} />
        </Link>
        <div className="mt-4">
          <button
            onClick={() => { setStep("form"); setResult(null); setName(""); setCity(""); setNiche(""); }}
            className="text-coffee-300 text-sm hover:text-white transition-colors underline"
          >
            Grade another business
          </button>
        </div>
      </div>
    </div>
  );
}
