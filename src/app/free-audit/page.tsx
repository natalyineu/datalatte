import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Clock, Search, BarChart3, Star, Target } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import ContactForm from "@/components/ContactForm";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  alternates: { canonical: "https://datalatte.pro/free-audit" },
  title: "Free Local Marketing Audit — No Strings Attached",
  description:
    "Get a personalised audit of your Google Business Profile, local SEO, and ad campaigns. 100% free, delivered within 48 hours. Find out exactly what's holding your business back.",
  openGraph: {
    title: "Free Local Marketing Audit | DataLatte",
    description:
      "Discover why competitors outrank you, what your Google Business Profile is missing, and where your ad spend is leaking. Free, personal, no sales pressure.",
  },
};

const auditItems = [
  {
    icon: Search,
    title: "Google Business Profile Score",
    desc: "We check completeness, category accuracy, photo quality, review velocity, and posting frequency — the exact factors Google uses to rank you in the map pack.",
  },
  {
    icon: BarChart3,
    title: "Local SEO & Keyword Gaps",
    desc: "See which searches your competitors are winning that you're missing. We identify the top 10 keywords you should rank for — and why you don't yet.",
  },
  {
    icon: Star,
    title: "Review & Reputation Analysis",
    desc: "Your star rating, response rate, and review recency directly affect your ranking. We'll show you exactly where you stand and what to fix first.",
  },
  {
    icon: Target,
    title: "Competitor Positioning",
    desc: "We analyse your top 3 local competitors: what they're doing right, where their gaps are, and how you can overtake them in 60–90 days.",
  },
  {
    icon: BarChart3,
    title: "Ad Account Health Check",
    desc: "If you're running Google or Meta Ads, we'll flag the most common money-wasting mistakes: broad match overuse, missing negative keywords, and poor landing pages.",
  },
  {
    icon: Clock,
    title: "Quick-Win Action Plan",
    desc: "You'll receive a prioritised list of the 3–5 changes that will have the biggest impact in the shortest time — no jargon, no fluff.",
  },
];

const steps = [
  {
    step: "1",
    title: "Fill in the form",
    desc: "Tell us about your business, your main challenges, and what you'd like to improve. Takes 2 minutes.",
  },
  {
    step: "2",
    title: "We do the research",
    desc: "Nataliia personally reviews your GBP, rankings, competitors, and any existing ad accounts. Delivered within 48 hours.",
  },
  {
    step: "3",
    title: "You get a clear report",
    desc: "A written audit with specific findings and a prioritised action plan — no pitch deck, no sales call required.",
  },
];

export default function FreeAuditPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-800 to-coffee-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              100% Free · No sales call required · 48-hour turnaround
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
              Find Out Exactly What&apos;s Holding Your Business Back Online
            </h1>
            <p className="text-white/75 text-lg mb-8 leading-relaxed">
              Get a personalised local marketing audit — your Google Business Profile, local SEO rankings, competitor gaps, and ad account health — delivered to your inbox within 48 hours.
            </p>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              {["No commitment", "Personal analysis by Nataliia", "Specific action plan included", "Works for any local business"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-coffee-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">What You&apos;ll Receive</span>
          <h2 className="section-title">
            Six areas we review —{" "}
            <span className="gradient-text">completely free</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-4">
            This isn&apos;t an automated report. Nataliia personally researches your business and delivers findings tailored to your specific situation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auditItems.map((item) => (
            <div key={item.title} className="card p-6">
              <item.icon size={26} className="text-coffee-600 mb-4" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* How it works */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Simple, fast, and genuinely useful</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-coffee-100 text-coffee-700 font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Form */}
      <SectionWrapper id="audit-form">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Request Your Audit</span>
            <h2 className="section-title">
              Get your free audit —{" "}
              <span className="gradient-text">takes 2 minutes</span>
            </h2>
            <p className="text-gray-500 mt-4">
              No credit card. No commitment. Just honest analysis of where you stand and what to do next.
            </p>
          </div>
          <ContactForm />
        </div>
      </SectionWrapper>

      {/* Social proof + reassurance */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">Why It&apos;s Free</span>
          <h2 className="section-title mb-4">No catch — here&apos;s why</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            I offer free audits because the best clients are those who already understand the problem. If the audit shows you have serious gaps, you might want help fixing them — and we can talk about that. If you can fix everything yourself, that&apos;s great too. Either way, you leave with something genuinely useful.
          </p>
          <p className="text-coffee-700 font-semibold mb-8">
            — Nataliia, Founder of DataLatte
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "48h", label: "Average delivery time" },
              { value: "100%", label: "Personal — not automated" },
              { value: "0", label: "Sales calls required" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-3xl font-bold text-coffee-700 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Is it really free with no strings attached?",
                a: "Yes. The audit is free and comes with no obligation. If you want to work together after, great — we can discuss. If not, the audit is yours to act on however you like.",
              },
              {
                q: "What do I need to provide?",
                a: "Just your business name, website, and a brief description of what you'd like to improve. You don't need to share ad account access for the initial audit — though it helps if you want a deeper ad review.",
              },
              {
                q: "Who actually does the audit?",
                a: "Nataliia personally reviews every audit request. This is not an automated tool — it's a real human looking at your specific situation.",
              },
              {
                q: "What kinds of businesses does this work for?",
                a: "Any local or service-area business with a physical presence or service territory: restaurants, salons, dental practices, cleaning services, real estate agents, fitness studios, and more.",
              },
            ].map((item) => (
              <div key={item.q} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-coffee-600 mt-0.5 shrink-0" />
                  {item.q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="#audit-form" className="btn-primary">
              Request my free audit <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline="Ready to find out what's really holding you back?" />
    </>
  );
}
