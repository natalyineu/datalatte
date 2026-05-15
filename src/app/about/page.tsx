import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, BarChart3, Globe, Zap, Users } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Nataliia — Senior Digital Marketing Consultant | DataLatte",
  description:
    "10+ years across OMD, Dentsu, BBDO and GroupM working with Fortune 500 and FTSE 100 brands. Now bringing enterprise-grade marketing to businesses of every size.",
};

const agencies = [
  { name: "OMD",     desc: "Global media network — Omnicom Group" },
  { name: "Dentsu",  desc: "Top-5 global advertising group" },
  { name: "BBDO",    desc: "Creative & performance — Omnicom" },
  { name: "GroupM",  desc: "World's largest media investment group" },
];

const values = [
  {
    icon: BarChart3,
    title: "Data first, always",
    desc: "Every recommendation I make is backed by something measurable. After years of multi-million dollar campaigns, I can't approach marketing any other way.",
  },
  {
    icon: Globe,
    title: "Enterprise thinking, any budget",
    desc: "The frameworks I used at OMD and GroupM for global brands work just as well for a local coffee shop. Strategy scales down. Rigor doesn't.",
  },
  {
    icon: Zap,
    title: "Speed without sloppiness",
    desc: "Agency life trains you to move fast under pressure. I bring that pace without the bureaucracy — you get senior-level thinking without the 6-week onboarding.",
  },
  {
    icon: Users,
    title: "One person, full accountability",
    desc: "No account managers, no briefing chains, no creative departments playing telephone. You work directly with me — the same person who planned campaigns for global brands.",
  },
];

const expertise = [
  "Google Ads & Performance Max",
  "Meta Ads (Facebook & Instagram)",
  "Programmatic Advertising (DV360, The Trade Desk)",
  "Local SEO & Google Business Profile",
  "Marketing Analytics & Attribution",
  "Email & CRM Marketing",
  "AI Agents & Marketing Automation",
  "Social Media Strategy & Management",
  "Brand Strategy & Positioning",
  "Media Planning & Buying",
  "Marketing Technology Stack",
  "Website & Landing Page Optimisation",
  "Conversion Rate Optimisation",
  "Influencer & Creator Marketing",
];

export default function AboutPage() {
  return (
    <>
      {/* Person structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />

      {/* Hero */}
      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            Senior Digital Marketing Consultant
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Enterprise marketing experience.
            <br />
            <span className="text-coffee-300">Applied to your business.</span>
          </h1>
          <p className="text-coffee-200 text-lg max-w-2xl mx-auto">
            10+ years building campaigns for global brands at the world's biggest media agencies —
            now working directly with businesses who deserve that level of expertise without the agency markup.
          </p>
        </div>
      </section>

      {/* Story + Photo */}
      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative flex flex-col items-center lg:items-start">
            <div className="relative inline-block">
              <Image
                src="/images/founder.png"
                alt="Nataliia Makota — founder of DataLatte"
                width={320}
                height={320}
                className="rounded-full object-cover shadow-2xl ring-4 ring-coffee-100"
                style={{ width: 320, height: 320, objectFit: "cover" }}
                priority
              />
              <div className="absolute -inset-3 rounded-full border-2 border-dashed border-coffee-200 -z-10" />
            </div>
            <div className="mt-6 bg-coffee-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg border border-coffee-600 inline-flex items-center gap-2">
              ☕ Powered by actual lattes
            </div>

            {/* Agency badges */}
            <div className="mt-6 w-full">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Agency background</p>
              <div className="grid grid-cols-2 gap-2">
                {agencies.map((a) => (
                  <div key={a.name} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="section-label">My Story</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              From global media desks
              <span className="gradient-text"> to your marketing</span>
            </h2>

            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p>
                I'm Nataliia — a digital marketing consultant with over a decade of experience
                managing campaigns across some of the world's most demanding marketing environments.
                My career has taken me through <strong className="text-gray-800">OMD, Dentsu, BBDO, and GroupM</strong>,
                where I worked on performance and brand campaigns for Fortune 500 and FTSE 100 companies
                across Europe and the US.
              </p>
              <p>
                At those agencies, I managed multi-million dollar media budgets, built attribution
                models from scratch, launched programmatic strategies across DV360 and The Trade Desk,
                and led teams through full-funnel campaign architectures for brands in retail,
                automotive, FMCG, financial services, and tech.
              </p>
              <p>
                I founded DataLatte because I kept seeing the same problem: the analytical rigour
                and strategic thinking available to big brands simply wasn't accessible to smaller
                businesses — or mid-sized companies working with agencies that assigned their most
                junior staff to their accounts.
              </p>
              <p>
                DataLatte fixes that. Whether you're a local coffee shop or a scaling e-commerce
                brand, you get the same level of strategic thinking I applied to global campaigns —
                without the agency overhead, the account manager telephone chain, or the six-figure
                retainer.
              </p>
              <p className="font-medium text-gray-800">
                You get me, directly. Senior expertise. Real accountability. Results you can measure.
              </p>
            </div>

            <Link href="/contact" className="btn-primary mt-8">
              Work with me <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Expertise grid */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-10">
          <span className="section-label">Full-Service Expertise</span>
          <h2 className="section-title">
            Everything I work on
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From a single Google Ads campaign to a full multi-channel strategy. I work across the complete marketing stack.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {expertise.map((skill) => (
            <div key={skill} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <CheckCircle2 size={15} className="text-coffee-500 shrink-0" />
              <span className="text-sm text-gray-700">{skill}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">How I Work</span>
          <h2 className="section-title">
            What working with me
            <span className="gradient-text"> looks like</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((v) => (
            <div key={v.title} className="card p-6 flex gap-4">
              <div className="w-11 h-11 rounded-xl bg-coffee-100 flex items-center justify-center shrink-0">
                <v.icon size={20} className="text-coffee-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Who I work with */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Who I Work With</span>
            <h2 className="section-title">From first campaign to global rollout</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Local Businesses",
                emoji: "🏪",
                desc: "Coffee shops, hair salons, pet groomers, fitness studios. I help local businesses build visibility, drive foot traffic, and compete with bigger brands on a fraction of the budget.",
                href: "/for/coffee-shops",
                cta: "See local solutions",
              },
              {
                label: "Growing Companies",
                emoji: "📈",
                desc: "Multi-location brands, scaling e-commerce, regional businesses. I build the full-funnel architecture — paid search, paid social, SEO, CRM — that supports serious growth.",
                href: "/for/medium-business",
                cta: "See growth solutions",
              },
              {
                label: "Enterprise & Agencies",
                emoji: "🏢",
                desc: "Global brands, white-label agency work, and complex multi-market campaigns. I bring the same rigour I used at OMD and GroupM — attribution, programmatic, brand strategy.",
                href: "/for/enterprise",
                cta: "See enterprise solutions",
              },
            ].map((tier) => (
              <div key={tier.label} className="bg-white rounded-2xl p-6 border border-coffee-100 flex flex-col gap-4">
                <div className="text-3xl">{tier.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg">{tier.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{tier.desc}</p>
                <Link href={tier.href} className="text-sm font-semibold text-coffee-700 hover:text-coffee-900 flex items-center gap-1 transition-colors">
                  {tier.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Ready to work with someone who's done this at scale?"
        sub="Start with a free audit. I'll review your current marketing and tell you exactly what I'd prioritise."
      />
    </>
  );
}
