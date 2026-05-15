import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Shield, BarChart3, Layers, Zap, Users } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Enterprise Digital Marketing & Agency White-Label Services",
  description:
    "Enterprise-grade digital marketing strategy, programmatic advertising, and white-label agency services. OMD, Dentsu, BBDO and GroupM background. US, UK and EU markets.",
};

const credentials = [
  { label: "OMD",    sub: "Global media planning & buying" },
  { label: "Dentsu", sub: "Integrated performance campaigns" },
  { label: "BBDO",   sub: "Brand & performance strategy" },
  { label: "GroupM", sub: "Programmatic & data-driven media" },
];

const capabilities = [
  {
    icon: Globe,
    title: "Multi-market campaign management",
    desc: "Pan-European and US campaigns coordinated across markets, languages, and regulatory environments. Built frameworks for simultaneous launches across 10+ markets.",
  },
  {
    icon: BarChart3,
    title: "Programmatic & advanced paid media",
    desc: "DV360, The Trade Desk, Amazon DSP, and direct buys. Audience modelling, frequency capping, brand safety, viewability standards, and multi-touch attribution.",
  },
  {
    icon: Layers,
    title: "Brand strategy & full-funnel architecture",
    desc: "From awareness through to conversion. Channel mix modelling, budget allocation frameworks, and creative strategy aligned to business objectives — not just media metrics.",
  },
  {
    icon: Shield,
    title: "Marketing measurement & attribution",
    desc: "MMM, MTA, incrementality testing, and custom dashboards. I've built reporting frameworks for global brands that need to justify nine-figure media investments.",
  },
  {
    icon: Zap,
    title: "AI & marketing technology",
    desc: "AI-powered automation, feed management, dynamic creative, and MarTech stack architecture. Implementation across Salesforce, HubSpot, GA4, and custom CDP solutions.",
  },
  {
    icon: Users,
    title: "White-label & agency overflow",
    desc: "Senior resource available for agencies needing to scale up. Strategy, planning, analytics, and campaign management delivered under your brand, to your standard.",
  },
];

const services = [
  "Programmatic advertising (DV360, The Trade Desk, Amazon DSP)",
  "Pan-European & multi-market campaign management",
  "Brand strategy & market positioning",
  "Full-funnel media planning & buying",
  "Marketing mix modelling (MMM)",
  "Multi-touch attribution (MTA)",
  "Incrementality & lift testing",
  "Advanced audience strategy & data partnerships",
  "Dynamic creative optimisation (DCO)",
  "Google Ads & Performance Max at scale",
  "Meta Ads (Facebook & Instagram) enterprise campaigns",
  "SEO strategy & technical audits",
  "CRM strategy & lifecycle marketing",
  "Marketing technology stack architecture",
  "Custom analytics dashboards & BI reporting",
  "Influencer & creator programme management",
  "Content strategy & thought leadership",
  "Agency white-label services",
  "Marketing team training & workshops",
  "Competitive intelligence & market research",
];

const whitelabel = [
  "Strategy and planning documents delivered under your brand",
  "Campaign build, management and optimisation",
  "Analytics reporting and dashboards for your clients",
  "Overflow capacity during agency growth phases",
  "Senior resource when you need to punch above your headcount",
  "Specialist knowledge in paid media, SEO, and analytics",
  "Full confidentiality — clients never know we're involved",
];

export default function EnterprisePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-950 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Enterprise & Agency Services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Agency-grade expertise.
            <span className="text-coffee-300"> Without the agency.</span>
          </h1>
          <p className="text-xl text-white/70 font-medium mb-3">
            Senior digital marketing strategy for brands that need more than a managed service.
          </p>
          <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
            With a background across OMD, Dentsu, BBDO, and GroupM — managing campaigns for Fortune 500
            and FTSE 100 brands across the US and Europe — I bring the analytical depth and strategic
            experience that enterprise work demands, without the complexity and overhead of a full agency.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Start a conversation <ArrowRight size={17} />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Full background & credentials
            </Link>
          </div>
        </div>
      </section>

      {/* Agency credentials bar */}
      <div className="bg-gray-900 py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Agency experience
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {credentials.map((c) => (
              <div key={c.label} className="text-center border border-gray-700 rounded-xl px-4 py-3">
                <p className="font-bold text-white text-base">{c.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">What enterprise work actually requires</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((c) => (
            <div key={c.title} className="card p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <c.icon size={20} className="text-coffee-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Full services */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-10">
          <span className="section-label">Service Scope</span>
          <h2 className="section-title">Full enterprise service catalogue</h2>
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

      {/* White label */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">For Agencies</span>
            <h2 className="section-title">White-label & overflow services</h2>
            <p className="section-subtitle">
              Need senior resource without adding headcount? I work with agencies as a confidential partner.
            </p>
          </div>
          <div className="space-y-3">
            {whitelabel.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-coffee-50 rounded-xl px-5 py-4 border border-coffee-100">
                <CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Why not a full agency */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">The Difference</span>
            <h2 className="section-title">Why enterprise clients choose DataLatte</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Direct access to senior expertise",
                desc: "At big agencies, senior people pitch. Junior people deliver. With DataLatte, the person who does the strategy is the person who runs the campaigns.",
              },
              {
                title: "Speed of execution",
                desc: "No briefing chains. No creative rounds that take six weeks. Strategy to live campaigns in days, not months. With the same quality standards I applied at global agencies.",
              },
              {
                title: "Transparency over theatre",
                desc: "No inflated reporting decks designed to justify retainers. You see exactly what's working, what isn't, and what we're doing about it. Your budget is treated like my own.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-coffee-100">
                <h3 className="font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Let's talk about your next campaign"
        sub="Strategy review, audit, or project brief — reach out and I'll come back within 24 hours."
      />
    </>
  );
}
