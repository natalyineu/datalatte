import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Agent Builder for Local Business",
  description:
    "Build a custom AI agent for your local business in minutes. Automate marketing, customer replies, bookings, and more — no coding required.",
  alternates: {
    canonical: "https://datalatte.pro/tools/ai-agent-builder",
  },
};

const AGENT_TYPES = [
  {
    icon: "💬",
    name: "Customer Reply Agent",
    description: "Answers FAQs, handles booking enquiries, and follows up with leads automatically.",
    tags: ["24/7 support", "lead follow-up", "FAQ handling"],
    color: "from-coffee-100 to-coffee-50",
    border: "border-coffee-200",
  },
  {
    icon: "📢",
    name: "Social Media Agent",
    description: "Creates and schedules posts across Instagram, Facebook, and Google Business Profile.",
    tags: ["content creation", "scheduling", "multi-platform"],
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
  {
    icon: "📧",
    name: "Email Marketing Agent",
    description: "Writes campaigns, segments your audience, and sends follow-up sequences.",
    tags: ["email campaigns", "segmentation", "automation"],
    color: "from-coffee-100 to-coffee-50",
    border: "border-coffee-200",
  },
  {
    icon: "📊",
    name: "Reporting Agent",
    description: "Pulls data from Google Ads, Meta, and Analytics — gives you a plain-English weekly summary.",
    tags: ["weekly reports", "ad performance", "insights"],
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
  {
    icon: "🔍",
    name: "SEO & Content Agent",
    description: "Researches keywords, writes blog posts, and updates your Google Business Profile.",
    tags: ["blog writing", "keyword research", "GBP updates"],
    color: "from-coffee-100 to-coffee-50",
    border: "border-coffee-200",
  },
  {
    icon: "⭐",
    name: "Review & Reputation Agent",
    description: "Monitors new reviews, drafts responses, and alerts you to negative feedback instantly.",
    tags: ["review responses", "reputation", "alerts"],
    color: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
];

const STEPS = [
  { num: "01", label: "Pick your agent type", desc: "Choose from pre-built agent templates designed for local businesses." },
  { num: "02", label: "Connect your tools", desc: "Link Google, Meta, your CRM, email platform, or calendar in one click." },
  { num: "03", label: "Set your preferences", desc: "Define your brand voice, working hours, and what the agent can do autonomously." },
  { num: "04", label: "Launch & monitor", desc: "Your agent goes live. You get a live dashboard — full control, always." },
];

export default function AIAgentBuilderPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-coffee-800 via-coffee-700 to-coffee-600 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-8xl">🤖</div>
          <div className="absolute top-20 right-20 text-6xl">⚡</div>
          <div className="absolute bottom-10 left-1/3 text-7xl">☕</div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Coming Soon · Free Tool
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            AI Agent Builder
            <span className="block text-coffee-200 text-3xl md:text-4xl mt-1">for Local Business</span>
          </h1>
          <p className="text-coffee-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Build a custom AI agent that handles marketing, customer replies, bookings, and reporting — no coding, no monthly retainer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-coffee-700 font-bold px-8 py-3.5 rounded-xl hover:bg-coffee-50 transition-colors"
            >
              Get early access →
            </Link>
            <Link
              href="/services/ai-agents"
              className="inline-block bg-coffee-600 border border-coffee-400 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-coffee-500 transition-colors"
            >
              Done-for-you option
            </Link>
          </div>
        </div>
      </section>

      {/* Agent type cards */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-coffee-500 uppercase tracking-widest mb-2">Choose your agent</p>
          <h2 className="text-3xl font-bold text-gray-900">What should your agent do?</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Each agent template is pre-built for local businesses. Pick one (or combine several) and configure it to match your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AGENT_TYPES.map((agent) => (
            <div
              key={agent.name}
              className={`relative rounded-2xl border ${agent.border} bg-gradient-to-br ${agent.color} p-6 group cursor-default`}
            >
              <div className="text-4xl mb-3">{agent.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{agent.name}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{agent.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white/70 text-coffee-700 font-medium px-2.5 py-1 rounded-full border border-coffee-100">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="absolute top-4 right-4 text-xs font-semibold text-coffee-400 bg-white/60 px-2 py-0.5 rounded-full">
                Soon
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-coffee-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-coffee-500 uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900">From zero to running agent in 10 minutes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 border border-coffee-100 flex gap-4 items-start">
                <span className="text-3xl font-black text-coffee-200 leading-none">{step.num}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.label}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">☕🤖</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Be first in line</h2>
        <p className="text-gray-500 mb-8">
          The AI Agent Builder is in development. Join the waitlist and get free early access plus a 1-on-1 setup session with Nataliia.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-coffee-700 hover:bg-coffee-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
        >
          Join the waitlist →
        </Link>
        <p className="text-gray-400 text-sm mt-4">
          Already want an AI agent?{" "}
          <Link href="/services/ai-agents" className="text-coffee-600 hover:underline font-medium">
            We build it for you →
          </Link>
        </p>
      </section>
    </main>
  );
}
