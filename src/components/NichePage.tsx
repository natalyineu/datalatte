import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, TrendingUp, X, Check } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import TestimonialCard from "@/components/TestimonialCard";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

interface NichePageProps {
  niche: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  accentColor: string;
  problems: string[];
  services: { title: string; desc: string; icon: string }[];
  kpis: { metric: string; desc: string; improvement: string }[];
  tactics: { title: string; detail: string }[];
  testimonial: { quote: string; author: string; role: string; rating?: number };
  faq: { q: string; a: string }[];
  ctaHeadline: string;
}

const NICHE_SLUGS: Record<string, string> = {
  "Coffee Shops": "coffee-shops",
  "Hair & Beauty Salons": "hair-salons",
  "Pet Groomers": "pet-groomers",
  "Fitness & Yoga Studios": "fitness-studios",
  "Startups": "startups",
  "Freelancers": "freelancers",
  "Medium Business": "medium-business",
  "Enterprise": "enterprise",
  "Restaurants": "restaurants",
  "Dentists": "dentists",
  "Cleaning Services": "cleaning-services",
  "Real Estate Agents": "real-estate-agents",
};

export default function NichePage({
  niche, headline, subheadline, heroImage, accentColor,
  problems, services, kpis, tactics, testimonial, faq, ctaHeadline,
}: NichePageProps) {
  const slug = NICHE_SLUGS[niche] ?? niche.toLowerCase().replace(/[\s&]+/g, "-").replace(/[^a-z0-9-]/g, "");
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: `${niche} Marketing`, url: `https://datalatte.pro/for/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden ${accentColor} pt-24 pb-28`}>
        {/* Background image */}
        <div className="absolute inset-0 opacity-20">
          <Image src={heroImage} alt={niche} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating badges */}
        <div className="absolute left-6 top-20 lg:left-20 lg:top-24 hidden sm:block animate-float opacity-90">
          <div className="bg-black/50 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">New clients</span>
            <span className="text-green-400 font-bold">↑ 40%</span>
          </div>
        </div>
        <div className="absolute right-6 top-24 lg:right-24 lg:top-28 hidden sm:block animate-float-r opacity-90" style={{ animationDelay: "0.9s" }}>
          <div className="bg-black/50 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">Cost per lead</span>
            <span className="text-green-400 font-bold">↓ 35%</span>
          </div>
        </div>
        <div className="absolute left-10 bottom-16 lg:left-32 hidden lg:block animate-float opacity-75" style={{ animationDelay: "1.6s" }}>
          <div className="bg-black/50 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-coffee-400 animate-pulse shrink-0" />
            <span className="text-white/70">Google Maps</span>
            <span className="text-coffee-300 font-bold">Top 3 position</span>
          </div>
        </div>
        <div className="absolute right-10 bottom-20 lg:right-28 hidden lg:block animate-float-r opacity-75" style={{ animationDelay: "0.5s" }}>
          <div className="bg-black/50 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="text-white/70">Weekly report</span>
            <span className="text-blue-400 font-bold">Every Monday ✓</span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              {niche} Marketing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
              {headline}
            </h1>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">{subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
                Get a Free Audit <ArrowRight size={17} />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
                See pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-gray-950 border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: kpis[0]?.improvement ?? "↑40%", label: kpis[0]?.metric ?? "New clients"       },
            { value: kpis[1]?.improvement ?? "↓35%", label: kpis[1]?.metric ?? "Cost per lead"     },
            { value: kpis[2]?.improvement ?? "3×",   label: kpis[2]?.metric ?? "Return on ad spend" },
            { value: "5 days",                        label: "To first live dashboard"               },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-coffee-300">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Before / After (replaces plain problems list) ── */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">Sound Familiar?</span>
          <h2 className="section-title">
            The marketing headaches every{" "}
            <span className="gradient-text">{niche.toLowerCase()} owner</span> knows
          </h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="px-5 py-3 border-r border-gray-100 flex items-center gap-2">
              <X size={13} className="text-red-400" /> Right now
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <Check size={13} className="text-green-500" /> After DataLatte
            </div>
          </div>
          {problems.map((p, i) => (
            <div key={i} className="grid grid-cols-2 text-sm hover:bg-gray-50 transition-colors">
              <div className="px-5 py-3.5 text-gray-400 border-r border-gray-100 flex items-start gap-2">
                <X size={13} className="text-red-400 shrink-0 mt-0.5" />
                {p}
              </div>
              <div className="px-5 py-3.5 text-gray-800 flex items-start gap-2">
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                {
                  [
                    "Clear weekly report — what's working & exactly what to do next",
                    "Cost-per-lead tracked from day one, ad spend justified",
                    "Data-driven strategy built for your specific niche",
                    "Month-to-month — cancel any time, no penalties",
                    "Direct access to a senior strategist, not a junior exec",
                    "Automated reporting while you focus on running your business",
                  ][i] ?? "Fixed with the DataLatte approach"
                }
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── KPIs ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">What Good Looks Like</span>
          <h2 className="section-title">
            The metrics that matter
            <br />
            <span className="gradient-text">for {niche.toLowerCase()}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => (
            <div key={kpi.metric} className="card p-6 text-center hover:border-coffee-300 hover:shadow-lg transition-all animate-card-rise" style={{ animationDelay: `${i * 0.1}s` }}>
              <TrendingUp size={28} className="text-coffee-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-coffee-700 mb-1">{kpi.improvement}</div>
              <div className="font-semibold text-gray-900 mb-2">{kpi.metric}</div>
              <p className="text-sm text-gray-500">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Services ── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">How I Help</span>
          <h2 className="section-title">
            Marketing services built for{" "}
            <span className="gradient-text">{niche.toLowerCase()}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div key={svc.title} className="card p-6 hover:border-coffee-300 hover:shadow-md hover:-translate-y-1 transition-all animate-card-rise" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="text-3xl mb-4 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>{svc.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Tactics — dark pipeline ── */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">My Approach</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Specific tactics that work for{" "}
              <span className="text-coffee-400">{niche.toLowerCase()}</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Every niche has its own seasonality, customer journey, and competitive landscape.
              Here&apos;s what I focus on for {niche.toLowerCase()} specifically.
            </p>
          </div>
          <div className="space-y-0">
            {tactics.map((t, i) => (
              <div key={t.title} className="flex gap-5 animate-card-rise" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-coffee-800 border border-coffee-600 text-coffee-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  {i < tactics.length - 1 && <div className="w-px flex-1 bg-coffee-900 my-2" />}
                </div>
                <div className="pb-8">
                  <h4 className="font-semibold text-white mb-1.5 mt-1.5">{t.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-label">What Clients Say</span>
          <TestimonialCard {...testimonial} />
          <Link href="/contact" className="btn-primary mt-8">
            Let&apos;s talk about your {niche.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="card p-6 hover:border-coffee-200 hover:shadow-sm transition-all">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-coffee-600 mt-0.5 shrink-0" />
                  {item.q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline={ctaHeadline} />
    </>
  );
}
