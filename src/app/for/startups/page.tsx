import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Rocket, Users, TrendingUp, DollarSign, Zap, BarChart3 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Digital Marketing for Startups | User Acquisition & Growth",
  description:
    "Marketing strategy for early-stage and growth-stage startups. Rapid user acquisition, performance marketing, and data-driven growth experiments — without burning your runway.",
};

const challenges = [
  {
    icon: DollarSign,
    title: "Every dollar counts — but bad marketing burns runway fast",
    desc: "You don't have the luxury of 'testing' a $30K agency retainer for three months before seeing results. You need growth experiments that move fast and prove out before you scale spend.",
  },
  {
    icon: Users,
    title: "You're trying to find product-market fit while also acquiring users",
    desc: "Marketing looks different at every stage of your journey. What works for getting your first 100 users is completely different from scaling to 10,000. You need someone who understands the progression.",
  },
  {
    icon: TrendingUp,
    title: "You need to grow fast without burning your CAC:LTV ratio",
    desc: "Investors are watching unit economics. Blowing budget on traffic that doesn't convert or retain is a red flag. You need acquisition channels that scale sustainably with strong payback periods.",
  },
  {
    icon: BarChart3,
    title: "Your analytics aren't telling you what to do next",
    desc: "You have data but it's not giving you answers. Attribution is broken, funnels aren't instrumented properly, and you're making gut-feel decisions instead of data-driven ones.",
  },
];

const services = [
  "Paid user acquisition (Google, Meta, LinkedIn)",
  "Performance marketing strategy & channel selection",
  "Growth hacking & rapid experimentation frameworks",
  "Conversion rate optimisation (landing pages, onboarding)",
  "Funnel instrumentation & analytics setup",
  "CAC / LTV modelling & cohort analysis",
  "Content marketing & SEO (bottom-of-funnel first)",
  "Product-led growth tactics & referral programs",
  "App store optimisation (iOS & Android)",
  "Email nurture sequences & lifecycle automation",
  "Retargeting & remarketing campaigns",
  "Influencer & creator partnerships",
  "PR & launch strategy",
  "Investor-ready growth dashboards",
  "A/B testing & experimentation programs",
  "Community building & viral loop design",
];

const stages = [
  {
    stage: "Pre-seed & Seed",
    focus: "First users",
    tactics: [
      "Manual outreach + early adopter communities",
      "Launch PR (Product Hunt, Hacker News, press)",
      "Basic paid acquisition tests ($500–2K/mo)",
      "Onboarding funnel optimisation",
    ],
    goal: "Validate demand, find your first 100–1,000 users",
  },
  {
    stage: "Series A",
    focus: "Repeatable growth",
    tactics: [
      "Scale 1–2 proven acquisition channels",
      "SEO content engine (bottom-of-funnel first)",
      "Lifecycle email & retention automation",
      "Attribution modelling & dashboards",
    ],
    goal: "Hit MoM growth targets with improving unit economics",
  },
  {
    stage: "Series B+",
    focus: "Market leadership",
    tactics: [
      "Multi-channel full-funnel campaigns",
      "Brand building + performance balance",
      "Category-defining content strategy",
      "Partner & channel marketing programs",
    ],
    goal: "Own category, defend against new entrants, expand to new segments",
  },
];

const process = [
  {
    step: "01",
    title: "Growth audit & opportunity map",
    desc: "I look at your current acquisition channels, funnel conversion rates, retention data, and unit economics. You get a clear picture of where you're losing users and money — and where the highest-leverage opportunities are.",
  },
  {
    step: "02",
    title: "Experiment roadmap (not a 90-day plan)",
    desc: "Startups don't need 90-day plans — they need a stack-ranked list of growth experiments sorted by potential impact vs. effort. I build this with you in week one and we move fast.",
  },
  {
    step: "03",
    title: "Run, measure, kill or scale",
    desc: "We launch experiments fast (often in days, not weeks), measure results against a clear hypothesis, and make quick decisions: double down or kill it. No HiPPO decisions, no wasted cycles.",
  },
  {
    step: "04",
    title: "Scale what works",
    desc: "When an experiment proves out — better landing page, new ad angle, referral mechanic — we systematize and scale it. I build the infrastructure so you can run it without me being in every decision.",
  },
  {
    step: "05",
    title: "Investor-ready reporting",
    desc: "Monthly growth reviews with the metrics that matter to your board: MoM growth rate, CAC by channel, payback period, retention curves, and cohort analysis. Presented in language that works for investor updates.",
  },
];

export default function StartupsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            For Startups
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Growth marketing that
            <span className="text-coffee-300"> doesn't burn your runway</span>
          </h1>
          <p className="text-xl text-white/70 font-medium mb-3">
            Fast experiments. Proven channels. Investor-ready metrics.
          </p>
          <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
            You're building something new — you can't afford slow agencies, long contracts, or
            campaigns that take six months to show results. I bring startup-paced growth marketing:
            rapid experiments, clear data, and a bias toward action over process.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Growth Audit <ArrowRight size={17} />
            </Link>
            <Link href="/services/analytics" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              See how analytics work
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="bg-coffee-900 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-coffee-200">
          <span>✓ Growth strategy from seed to Series B+</span>
          <span>✓ CAC:LTV modelling included</span>
          <span>✓ No long-term contracts</span>
          <span>✓ Investor-ready growth dashboards</span>
        </div>
      </div>

      {/* Challenges */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Sound Familiar?</span>
          <h2 className="section-title">Why startups choose DataLatte</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {challenges.map((c) => (
            <div key={c.title} className="card p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <c.icon size={20} className="text-coffee-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Growth by stage */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Right Strategy, Right Stage</span>
          <h2 className="section-title">Marketing that evolves with your funding</h2>
          <p className="section-subtitle">What works at pre-seed is wrong at Series A. I tailor the approach to where you actually are.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stages.map((s) => (
            <div key={s.stage} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="inline-block bg-coffee-100 text-coffee-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                {s.stage}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{s.focus}</div>
              <p className="text-xs text-gray-400 mb-4">{s.goal}</p>
              <ul className="space-y-2">
                {s.tactics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                    <Rocket size={13} className="text-coffee-500 shrink-0 mt-0.5" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">Full Growth Stack</span>
          <h2 className="section-title">Everything a startup growth team needs</h2>
          <p className="section-subtitle">Pick what you need now. Add more as you scale.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {services.map((s) => (
            <div key={s} className="flex items-start gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <CheckCircle2 size={15} className="text-coffee-500 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{s}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Process */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">How We Work Together</span>
          <h2 className="section-title">Move fast, measure everything, <span className="gradient-text">scale what works</span></h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {process.map((item) => (
            <div key={item.step} className="flex gap-5 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-coffee-100 text-coffee-700 font-bold text-sm flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Key metrics callout */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">What Investors Want to See</span>
            <h2 className="section-title">Metrics that matter at every stage</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { metric: "CAC by channel", icon: "💰", desc: "Know exactly what you pay per customer, broken down by source" },
              { metric: "Payback period", icon: "⏱️", desc: "Months until you recover acquisition cost — the key unit economics metric" },
              { metric: "MoM growth rate", icon: "📈", desc: "Compound growth rate month-over-month across key cohorts" },
              { metric: "Retention curves", icon: "🔁", desc: "D7, D30, D90 retention — the real signal of product-market fit" },
            ].map((m) => (
              <div key={m.metric} className="bg-white rounded-2xl p-5 border border-coffee-100 text-center">
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="font-bold text-gray-900 mb-1 text-sm">{m.metric}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Related links */}
      <SectionWrapper>
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore by service</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Analytics & Reporting", href: "/services/analytics" },
            { label: "Google Ads", href: "/services/google-ads" },
            { label: "Meta Ads", href: "/services/meta-ads" },
            { label: "Email & SMS", href: "/services/email-sms" },
            { label: "AI Automation", href: "/services/ai-agents" },
            { label: "Growing Businesses", href: "/for/medium-business" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Let's build growth you can take to your next funding round"
        sub="Free growth audit — I'll map your current funnel, flag the leaks, and show you the highest-leverage experiments to run first."
      />
    </>
  );
}
