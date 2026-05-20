import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, User, MessageSquare, Star, TrendingUp } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Digital Marketing for Freelancers & Consultants | Build Your Personal Brand",
  description:
    "Marketing strategy for freelancers, consultants, and independent professionals. Build your personal brand, generate consistent inbound leads, and charge premium rates.",
};

const challenges = [
  {
    icon: User,
    title: "You get work through referrals — but referrals are unpredictable",
    desc: "Word-of-mouth got you started, but it doesn't scale. You need a predictable inbound system so you're not anxiously checking your inbox waiting for the next referral to come through.",
  },
  {
    icon: MessageSquare,
    title: "You know what you do — but clients don't understand why to choose you",
    desc: "Positioning is the hardest part. Most freelancers describe themselves by what they do, not the outcome they deliver. Clear positioning is what lets you charge 2–3x more and attract better clients.",
  },
  {
    icon: Star,
    title: "You're competing on price instead of value",
    desc: "When clients compare you to three other options and choose on cost, your positioning isn't working. A strong personal brand and visible expertise means clients come to you specifically — price becomes secondary.",
  },
  {
    icon: TrendingUp,
    title: "You want to scale income without working more hours",
    desc: "The freelance ceiling is real. Marketing that builds your authority — thought leadership, content, SEO — creates leverage: more enquiries, higher rates, better clients, without just adding more hours.",
  },
];

const services = [
  "Personal brand strategy & positioning",
  "LinkedIn profile & content strategy",
  "Lead generation systems (organic & paid)",
  "Google Ads for professional services",
  "Portfolio / website optimisation",
  "SEO for service-based keywords",
  "Email newsletter strategy & setup",
  "Case study & social proof development",
  "Content strategy (articles, LinkedIn posts, podcasts)",
  "Thought leadership positioning",
  "Meta Ads for lead generation",
  "Testimonial & review acquisition systems",
  "Niche specialisation strategy",
  "Pricing & offer positioning",
  "CRM & pipeline setup (no-code tools)",
  "Referral program design",
];

const personas = [
  {
    type: "Consultant",
    icon: "🧠",
    challenge: "Command premium rates in a crowded market",
    tactics: [
      "Thought leadership on LinkedIn & industry press",
      "Narrow niche positioning (e.g. 'SaaS go-to-market' not just 'marketing')",
      "Case studies with ROI numbers front and centre",
      "Speaking engagements & podcast appearances",
    ],
  },
  {
    type: "Creative (designer, writer, developer)",
    icon: "🎨",
    challenge: "Fill your pipeline with quality project work",
    tactics: [
      "Portfolio SEO (rank for '[city] + [service]')",
      "Google Ads targeting high-intent searches",
      "Strong social proof — reviews, testimonials, results",
      "LinkedIn & Behance / Dribbble / GitHub presence",
    ],
  },
  {
    type: "Coach or Trainer",
    icon: "🏆",
    challenge: "Build an audience that converts to clients",
    tactics: [
      "Content marketing (video, newsletters, LinkedIn)",
      "Meta Ads for discovery + lead magnets",
      "Email nurture sequences for warm prospects",
      "Webinar & free session funnel",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Positioning workshop",
    desc: "We start by getting crystal clear on who you serve, what makes you different, and why that matters to your ideal client. This shapes everything else — your messaging, your channels, your pricing.",
  },
  {
    step: "02",
    title: "Lead generation audit",
    desc: "Where are your clients coming from right now? Where are the gaps? I audit your current presence — LinkedIn, website, Google, referral sources — and map the fastest path to more consistent inbound enquiries.",
  },
  {
    step: "03",
    title: "System build",
    desc: "I build the infrastructure: optimised profiles, lead capture on your site, email sequences, and any paid campaigns we've agreed to run. Everything connected so leads don't fall through the cracks.",
  },
  {
    step: "04",
    title: "Content engine (optional)",
    desc: "For freelancers who want long-term authority, I set up a sustainable content strategy — LinkedIn posts, email newsletter, or SEO articles — that compounds over time and feeds the inbound pipeline without constant ad spend.",
  },
  {
    step: "05",
    title: "Ongoing optimisation",
    desc: "Monthly review of lead volume, quality, and conversion rates. We adjust what's not working and double down on what is. Goal: fewer, better leads — so you can focus on client work, not marketing admin.",
  },
];

export default function FreelancersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            For Freelancers & Consultants
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Stop chasing clients.
            <span className="text-coffee-300"> Start attracting them.</span>
          </h1>
          <p className="text-xl text-white/70 font-medium mb-3">
            Build a personal brand that generates inbound leads while you sleep.
          </p>
          <p className="text-white/55 max-w-2xl mx-auto mb-8 leading-relaxed">
            Freelancers who market themselves well don't just get more clients — they get
            better clients who pay more, argue less, and refer others. I help you build the
            personal brand and lead generation system that makes that happen consistently.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Brand Audit <ArrowRight size={17} />
            </Link>
            <Link href="/services/local-seo" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              See how SEO works for services
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="bg-coffee-900 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-coffee-200">
          <span>✓ Personal brand positioning included</span>
          <span>✓ LinkedIn + Google + website strategy</span>
          <span>✓ No lock-in contracts</span>
          <span>✓ Built for solo & boutique operators</span>
        </div>
      </div>

      {/* Challenges */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Sound Familiar?</span>
          <h2 className="section-title">Why freelancers work with DataLatte</h2>
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

      {/* By persona */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">Built for Your Type of Work</span>
          <h2 className="section-title">Different freelancers, different playbooks</h2>
          <p className="section-subtitle">
            A business consultant and a freelance designer need completely different marketing strategies. I tailor the approach to you.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personas.map((p) => (
            <div key={p.type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="font-bold text-gray-900 mb-1">{p.type}</div>
              <p className="text-xs text-coffee-600 font-medium mb-4">{p.challenge}</p>
              <ul className="space-y-2">
                {p.tactics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={13} className="text-coffee-500 shrink-0 mt-0.5" />
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
          <span className="section-label">Full Service Menu</span>
          <h2 className="section-title">Everything you need to build inbound</h2>
          <p className="section-subtitle">Start with the highest-impact channels for your situation. Add more as you grow.</p>
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
          <h2 className="section-title">From invisible to <span className="gradient-text">in-demand</span></h2>
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

      {/* LinkedIn callout */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">The #1 Channel for Most Freelancers</span>
          <h2 className="section-title mb-4">LinkedIn isn't optional — it's your portfolio, CV, and sales funnel in one</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            A well-optimised LinkedIn profile with consistent, expert content can generate 3–5 warm inbound enquiries per month without spending a penny on ads.
            Most freelancers' profiles are missing the fundamentals — headline, social proof, and a clear call-to-action.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { label: "Profile optimisation", desc: "Headline, About section, featured posts, and skills that attract your ideal client" },
              { label: "Content strategy", desc: "Post topics, frequency, and format that build authority without eating your day" },
              { label: "Outreach playbook", desc: "How to connect, follow up, and convert conversations into consultations — without spamming" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 border border-coffee-100">
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.label}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
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
            { label: "Google Ads", href: "/services/google-ads" },
            { label: "Meta Ads", href: "/services/meta-ads" },
            { label: "Local SEO", href: "/services/local-seo" },
            { label: "Email & SMS", href: "/services/email-sms" },
            { label: "Social Media", href: "/services/social-media" },
            { label: "Growing Businesses", href: "/for/medium-business" },
            { label: "Startups", href: "/for/startups" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Ready to build a personal brand that brings clients to you?"
        sub="Free brand audit — I'll review your current online presence and tell you exactly what to fix first to start generating better inbound leads."
      />
    </>
  );
}
