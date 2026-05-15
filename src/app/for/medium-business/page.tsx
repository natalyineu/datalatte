import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Target, BarChart3, Zap, Globe, Mail } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Digital Marketing for Growing & Mid-Market Businesses",
  description:
    "Full-funnel digital marketing for scaling companies. Multi-channel paid media, SEO, CRM, and marketing analytics from a consultant with Fortune 500 agency experience.",
};

const challenges = [
  {
    icon: Target,
    title: "Your current agency assigns juniors to your account",
    desc: "Mid-market companies often get the pitch from senior partners and the delivery from account execs two years out of university. You deserve senior-level thinking on every campaign.",
  },
  {
    icon: BarChart3,
    title: "You've outgrown 'set it and forget it' campaigns",
    desc: "Basic Google Ads and a boosted Facebook post got you to this point. Now you need proper funnel architecture, attribution modelling, and cross-channel budget optimisation.",
  },
  {
    icon: TrendingUp,
    title: "You need scale, not just maintenance",
    desc: "You're not looking to maintain — you're looking to grow 30–100% year-over-year. That requires a different approach to strategy, testing, and channel expansion.",
  },
  {
    icon: Globe,
    title: "Multi-location or multi-market complexity",
    desc: "Coordinating campaigns across regions, languages, or verticals requires someone who's done it before — not someone learning on your budget.",
  },
];

const services = [
  "Full-funnel paid media strategy (Google, Meta, programmatic)",
  "Media planning & budget allocation across channels",
  "Programmatic advertising (DV360, The Trade Desk)",
  "Advanced audience segmentation & targeting",
  "Cross-channel attribution modelling",
  "CRM integration & lifecycle marketing",
  "Marketing automation (email, SMS, retargeting flows)",
  "SEO strategy & technical SEO audits",
  "Content strategy & editorial calendar",
  "Landing page & conversion rate optimisation",
  "Marketing analytics dashboards & reporting",
  "A/B testing & experimentation frameworks",
  "Brand strategy & market positioning",
  "Competitive intelligence & market research",
  "Social media strategy & community management",
  "Influencer & creator partnerships",
];

const industries = [
  "E-commerce & DTC brands",
  "Multi-location retail & franchises",
  "SaaS & technology companies",
  "Professional services & B2B",
  "Healthcare & wellness brands",
  "Financial services",
  "Real estate & property",
  "Hospitality & food service groups",
  "Education & e-learning",
  "Automotive & transport",
];

const process = [
  {
    step: "01",
    title: "Marketing audit & gap analysis",
    desc: "I audit your current channels, spend, attribution, and funnel performance. You get an honest assessment of what's working, what's wasted, and where the biggest growth opportunity is.",
  },
  {
    step: "02",
    title: "Strategy & channel architecture",
    desc: "Based on the audit, I build a full-channel strategy with clear budget allocation, KPI targets, and a 90-day execution roadmap. No fluff — specific tactics, specific numbers.",
  },
  {
    step: "03",
    title: "Implementation & campaign build",
    desc: "I build and launch campaigns across your chosen channels — paid search, paid social, programmatic, email — with proper tracking, creative frameworks, and audience structures.",
  },
  {
    step: "04",
    title: "Optimisation & scaling",
    desc: "Weekly performance reviews, ongoing A/B testing, budget reallocation based on data. When something's working, we scale it. When it isn't, we fix it fast.",
  },
  {
    step: "05",
    title: "Reporting & strategic reviews",
    desc: "Monthly reporting in plain language with dashboards you can actually use. Quarterly strategy reviews to recalibrate goals and channel mix as the business evolves.",
  },
];

export default function MediumBusinessPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            For Growing Businesses
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Marketing built for
            <span className="text-coffee-300"> serious growth</span>
          </h1>
          <p className="text-xl text-white/70 font-medium mb-3">
            Not startup experiments. Not enterprise bureaucracy. Exactly the right level.
          </p>
          <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
            You've got traction. Now you need a full-funnel marketing strategy that scales your
            acquisition channels, builds brand equity, and optimises every pound and dollar you spend.
            That's where I come in.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Strategy Review <ArrowRight size={17} />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              About my agency experience
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="bg-coffee-900 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-coffee-200">
          <span>✓ Experience at OMD, Dentsu, BBDO & GroupM</span>
          <span>✓ Fortune 500 & FTSE 100 campaigns</span>
          <span>✓ Multi-million dollar media budgets managed</span>
          <span>✓ US, UK, EU markets</span>
        </div>
      </div>

      {/* Challenges */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Sound Familiar?</span>
          <h2 className="section-title">Why growing companies switch to DataLatte</h2>
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

      {/* Services */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-10">
          <span className="section-label">Full-Service Scope</span>
          <h2 className="section-title">Everything on the table</h2>
          <p className="section-subtitle">No artificial limits. I work across the full marketing stack.</p>
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
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">How We Work Together</span>
          <h2 className="section-title">A process that <span className="gradient-text">actually delivers</span></h2>
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

      {/* Industries */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Industries</span>
            <h2 className="section-title">I work across sectors</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {industries.map((ind) => (
              <div key={ind} className="bg-white rounded-xl px-4 py-3 text-center border border-coffee-100 text-sm font-medium text-gray-700">
                {ind}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Related */}
      <SectionWrapper>
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore by service</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "Google Ads", href: "/services/google-ads" },
            { label: "Meta Ads", href: "/services/meta-ads" },
            { label: "Local SEO", href: "/services/local-seo" },
            { label: "Analytics", href: "/services/analytics" },
            { label: "AI Automation", href: "/services/ai-agents" },
            { label: "Email & SMS", href: "/services/email-sms" },
            { label: "Enterprise Solutions", href: "/for/enterprise" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Let's build a marketing engine that scales with you"
        sub="Free strategy review — I'll audit your current setup and show you exactly where the growth is."
      />
    </>
  );
}
