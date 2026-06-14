import Link from "next/link";
import { ArrowRight, CheckCircle2, X, Check, ChevronRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import ScrollReveal from "@/components/ScrollReveal";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

interface ServicePageProps {
  service: string;
  tagline: string;
  description: string;
  icon: string;
  accentClass: string;
  whatItIs: string;
  howItWorks: { step: string; title: string; desc: string }[];
  included: string[];
  notIncluded?: string[];
  bestFor: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  beforeAfter?: { before: string; after: string }[];
  stats?: { value: string; label: string }[];
}

const SERVICE_SLUGS: Record<string, string> = {
  "Google Ads": "google-ads",
  "Meta Ads": "meta-ads",
  "Local SEO": "local-seo",
  "Google Business Profile": "google-business-profile",
  "Analytics & Reporting": "analytics",
  "AI Agents & Automation": "ai-agents",
  "Email & SMS Marketing": "email-sms",
  "Social Media Management": "social-media",
  "Website & Landing Pages": "website",
  "Content Marketing": "content-marketing",
  "Reputation Management": "reputation-management",
  "Conversion Rate Optimisation": "cro",
  "Video Marketing": "video-marketing",
  "TikTok Ads": "tiktok-ads",
  "Programmatic Advertising": "programmatic",
};

const DEFAULT_STATS = [
  { value: "10+",    label: "Years experience" },
  { value: "48 h",   label: "First audit turnaround" },
  { value: "0",      label: "Lock-in contracts" },
  { value: "Direct", label: "Access to Nataliia" },
];

const DEFAULT_BEFORE_AFTER = [
  { before: "No idea what's actually working",         after: "Clear weekly report: what's working & why"   },
  { before: "Paying an agency that ignores you",       after: "Direct access to a senior strategist"        },
  { before: "Budget spent with no clear ROI",          after: "Cost-per-lead tracked from day one"          },
  { before: "Signed into a 12-month contract",         after: "Month-to-month — cancel any time"            },
  { before: "Generic campaigns, generic results",      after: "Strategy built for your niche specifically"  },
];

export default function ServicePage({
  service, tagline, description, icon, accentClass,
  whatItIs, howItWorks, included, bestFor, faqs, relatedLinks,
  beforeAfter = DEFAULT_BEFORE_AFTER,
  stats = DEFAULT_STATS,
}: ServicePageProps) {
  const slug = SERVICE_SLUGS[service] ?? service.toLowerCase().replace(/[\s&]+/g, "-").replace(/[^a-z0-9-]/g, "");
  const serviceUrl = `https://datalatte.pro/services/${slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Services", url: "https://datalatte.pro/services/google-ads" },
    { name: service, url: serviceUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema({ name: service, description, url: serviceUrl })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden ${accentClass} pt-24 pb-28 px-4 sm:px-6 lg:px-8`}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating badges */}
        <div className="absolute left-6 top-20 lg:left-16 lg:top-24 hidden sm:block animate-float opacity-90">
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">Free audit</span>
            <span className="text-green-400 font-bold">48 h turnaround</span>
          </div>
        </div>
        <div className="absolute right-6 top-24 lg:right-20 lg:top-28 hidden sm:block animate-float-r opacity-90" style={{ animationDelay: "0.8s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">Month-to-month</span>
            <span className="text-green-400 font-bold">No lock-in</span>
          </div>
        </div>
        <div className="absolute left-12 bottom-16 lg:left-28 hidden lg:block animate-float opacity-75" style={{ animationDelay: "1.5s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-coffee-400 animate-pulse shrink-0" />
            <span className="text-white/70">Weekly report</span>
            <span className="text-coffee-300 font-bold">Every Monday</span>
          </div>
        </div>
        <div className="absolute right-10 bottom-20 lg:right-24 hidden lg:block animate-float-r opacity-75" style={{ animationDelay: "0.4s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="text-white/70">Setup</span>
            <span className="text-blue-400 font-bold">Live in 5 days ✓</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-6xl mb-5 animate-float" style={{ animationDelay: "0.2s" }}>{icon}</div>
          <span className="inline-block bg-white/10 border border-white/20 text-white/70 text-xs font-mono px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
            {service}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{tagline}</h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-5 leading-relaxed text-lg">{description}</p>
          {/* Monospace flow indicator */}
          <p className="text-white/35 text-xs font-mono mb-10 max-w-2xl mx-auto tracking-wide">
            {howItWorks.map((s, i) => (
              <span key={s.step}>
                {s.title}
                {i < howItWorks.length - 1 && <span className="mx-2 text-coffee-600">→</span>}
              </span>
            ))}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/free-audit" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Request a Free Audit <ArrowRight size={17} />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              See pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-gray-950 border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08} direction="up">
              <div>
                <div className="text-xl font-bold text-coffee-300">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ── Before / After ── */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">The Difference</span>
          <h2 className="section-title">Sound familiar? <span className="gradient-text">Here&apos;s the fix.</span></h2>
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
          {beforeAfter.map((row, i) => (
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

      {/* ── What it is ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className={`grid gap-10 items-start ${stats && stats.length > 0 ? "md:grid-cols-[1fr_300px]" : ""}`}>
            {/* Text column */}
            <div>
              <span className="section-label">The Basics</span>
              <h2 className="section-title mb-8">What is {service}, really?</h2>
              <div className="space-y-6">
                {whatItIs.split("\\n\\n").map((para, i) => {
                  if (i === 0) return (
                    <p key={i} className="text-gray-800 leading-relaxed text-xl">{para}</p>
                  );
                  if (i === 1) return (
                    <div key={i} className="flex gap-4 bg-white rounded-xl p-5 border border-coffee-100 shadow-sm">
                      <div className="shrink-0 w-1 rounded-full bg-coffee-400 self-stretch" />
                      <p className="text-gray-600 leading-relaxed text-sm">{para}</p>
                    </div>
                  );
                  return (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">Common mistake to avoid</p>
                      <p className="text-gray-700 leading-relaxed text-sm">{para}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats sidebar */}
            {stats && stats.length > 0 && (
              <div className="space-y-3 md:sticky md:top-24">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl px-5 py-4 border border-coffee-100 shadow-sm">
                    <div className="text-3xl font-bold text-coffee-800 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* ── How it works — architecture flow ── */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-coffee-400 uppercase tracking-widest">My Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
              How I approach <span className="text-coffee-400">{service}</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              A clear, repeatable process — so you always know where things stand.
            </p>
          </div>
          {/* First row: up to 4 steps as horizontal cards */}
          <div className="flex flex-col sm:flex-row items-stretch gap-0 mb-4">
            {howItWorks.slice(0, 4).map((item, i) => (
              <div key={item.step} className="flex-1 relative">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full mx-1 first:ml-0 last:mr-0">
                  <div className="text-xs font-mono text-coffee-500 mb-2 uppercase tracking-widest">{item.step}</div>
                  <div className="text-white font-semibold mb-2 text-sm">{item.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{item.desc}</div>
                </div>
                {i < Math.min(howItWorks.length, 4) - 1 && (
                  <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-coffee-700 rounded-full items-center justify-center">
                    <ChevronRight size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Overflow steps (5+) in a second row */}
          {howItWorks.length > 4 && (
            <div className="flex flex-col sm:flex-row items-stretch gap-0">
              {howItWorks.slice(4).map((item, i) => (
                <div key={item.step} className="flex-1 relative">
                  <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-5 h-full mx-1 first:ml-0">
                    <div className="text-xs font-mono text-coffee-600 mb-2 uppercase tracking-widest">{item.step}</div>
                    <div className="text-white/80 font-semibold mb-2 text-sm">{item.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                  {i < howItWorks.slice(4).length - 1 && (
                    <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-coffee-800 rounded-full items-center justify-center">
                      <ChevronRight size={10} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Included ── */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">What&apos;s Included</span>
            <h2 className="section-title">Everything in {service}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {included.map((item, i) => (
              <ScrollReveal key={item} delay={i * 0.05}>
              <div className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm hover:border-coffee-300 hover:shadow-md transition-all group h-full">
                <CheckCircle2 size={17} className="text-coffee-500 shrink-0 mt-0.5 group-hover:text-coffee-600 transition-colors" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Best for ── */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Is This Right for You?</span>
            <h2 className="section-title">{service} works best for:</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {bestFor.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white rounded-xl p-5 border border-coffee-100 hover:border-coffee-400 hover:shadow-md transition-all animate-card-rise"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions about {service}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 0.07}>
              <div className="card p-6 hover:border-coffee-300 hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Related ── */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore related services</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* ── From the Blog ── */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">Free Guides</span>
          <h2 className="section-title mb-2">Learn from our <span className="gradient-text">blog</span></h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xl mx-auto">Practical digital marketing guides for local businesses — country-by-country strategies, budgets, and platform breakdowns.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/blog" className="btn-outline text-sm py-2 px-5">All articles <ArrowRight size={13} /></Link>
            <Link href="/blog/local-marketing-guides" className="btn-outline text-sm py-2 px-5">Country guides <ArrowRight size={13} /></Link>
            <Link href="/blog/local-marketing-budget-guide" className="btn-outline text-sm py-2 px-5">Budget guide <ArrowRight size={13} /></Link>
            <Link href="/blog/google-business-profile-optimization-checklist" className="btn-outline text-sm py-2 px-5">GBP checklist <ArrowRight size={13} /></Link>
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
