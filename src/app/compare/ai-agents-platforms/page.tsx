import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, X, Minus, ArrowRight, Zap, Brain, Workflow } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/compare/ai-agents-platforms";
const PAGE_TITLE = "Best AI Agent Platforms for Local Business 2026: Claude vs ChatGPT vs Gemini + n8n vs Zapier vs Make";
const PAGE_DESC =
  "Honest comparison of AI models (Claude, ChatGPT, Gemini) and automation platforms (n8n, Zapier, Make.com) for local business agents. Covers booking bots, phone answering, review management, and lead capture — with real API costs and accuracy benchmarks.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-US": PAGE_URL,
      "en-GB": PAGE_URL,
      "en-AU": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    siteName: "DataLatte",
    type: "website",
  },
};

const llmRows = [
  {
    factor: "Response quality for local business FAQs",
    claude: "Excellent — nuanced, warm tone; handles edge cases well",
    chatgpt: "Good — slightly more generic but reliable",
    gemini: "Decent — tends toward over-formal responses",
  },
  {
    factor: "Hallucination rate on business-specific data",
    claude: "Very low with system prompt constraints + RAG",
    chatgpt: "Low — GPT-4o is reliable with grounding",
    gemini: "Moderate without explicit grounding",
  },
  {
    factor: "Multi-turn conversation handling",
    claude: "Excellent — 200K context window, tracks full history",
    chatgpt: "Good — 128K context on GPT-4o",
    gemini: "Good — 1M context but slower inference",
  },
  {
    factor: "Function calling / tool use",
    claude: "Excellent — clean JSON, reliable schema adherence",
    chatgpt: "Excellent — mature tooling, well-documented",
    gemini: "Good — improving rapidly in 2026",
  },
  {
    factor: "Speed (median response time)",
    claude: "Haiku 3.5: ~0.4s · Sonnet 4: ~1.2s",
    chatgpt: "GPT-4o-mini: ~0.5s · GPT-4o: ~1.4s",
    gemini: "Flash 2.0: ~0.6s · Pro 2.0: ~1.8s",
  },
  {
    factor: "Cost for 10,000 agent messages/month",
    claude: "Haiku 3.5: ~$3 · Sonnet 4: ~$18",
    chatgpt: "GPT-4o-mini: ~$4 · GPT-4o: ~$25",
    gemini: "Flash 2.0: ~$2 · Pro 2.0: ~$20",
  },
  {
    factor: "Tone control (warm, local business voice)",
    claude: "Best in class — excels at warm, human-sounding responses",
    chatgpt: "Good — responds well to persona prompting",
    gemini: "Adequate — less natural for conversational agents",
  },
  {
    factor: "Summarising long booking histories / customer context",
    claude: "Excellent — large context window with strong recall",
    chatgpt: "Good — slightly more prone to context drift at length",
    gemini: "Good — long context but occasional middle-section loss",
  },
  {
    factor: "Language support (non-English local markets)",
    claude: "Strong in 30+ languages",
    chatgpt: "Excellent in 50+ languages — GPT-4o multilingual benchmark leader",
    gemini: "Excellent in 40+ languages — strong in Asian languages",
  },
  {
    factor: "DataLatte recommendation",
    claude: "Preferred for FAQ, review response, reactivation agents",
    chatgpt: "Preferred for booking agents and voice (Realtime API)",
    gemini: "Good fallback — best for Google Workspace integrations",
  },
];

const automationRows = [
  {
    factor: "Technical skill required",
    n8n: "Medium — visual builder but requires logic understanding",
    zapier: "Low — drag and drop, no-code friendly",
    make: "Medium — powerful but steeper UI learning curve",
  },
  {
    factor: "Monthly cost (local business scale)",
    n8n: "Self-hosted: ~$20/mo server · Cloud: from $24/mo",
    zapier: "Professional: $49/mo · Team: $69/mo",
    make: "Core: $9/mo · Pro: $16/mo · Teams: $29/mo",
  },
  {
    factor: "AI/LLM native integration",
    n8n: "Excellent — built-in nodes for OpenAI, Anthropic, Gemini",
    zapier: "Good — AI actions via ChatGPT and Claude apps",
    make: "Good — HTTP module for any LLM API",
  },
  {
    factor: "Execution speed for agent workflows",
    n8n: "Fastest — runs on your server, no queue delay",
    zapier: "Slower — 1–15 min delay on free/low tiers",
    make: "Fast — near-instant on paid plans",
  },
  {
    factor: "Webhook handling (instant triggers)",
    n8n: "Excellent — real-time webhook processing",
    zapier: "Limited on lower tiers — polling delay",
    make: "Excellent — instant webhook triggers",
  },
  {
    factor: "CRM integrations (GoHighLevel, HubSpot, etc.)",
    n8n: "Broad — via HTTP or community nodes",
    zapier: "Largest library — 6,000+ apps",
    make: "Large — 1,500+ apps, deep GHL support",
  },
  {
    factor: "Error handling and retry logic",
    n8n: "Excellent — built-in error workflows, retry on fail",
    zapier: "Basic — error Zaps available but limited",
    make: "Good — error handlers, custom retry",
  },
  {
    factor: "Multi-step AI pipelines (RAG, chain of thought)",
    n8n: "Best — designed for complex LLM orchestration",
    zapier: "Limited — better for simple single-step AI tasks",
    make: "Good — handles multi-step with HTTP modules",
  },
  {
    factor: "Self-hosting / data sovereignty",
    n8n: "Yes — full self-hosting, data never leaves your server",
    zapier: "No — SaaS only, US data storage",
    make: "Limited — EU data option on enterprise",
  },
  {
    factor: "DataLatte uses for client agents",
    n8n: "Primary platform — all production agents",
    zapier: "Simple client automations only",
    make: "GHL-heavy client stacks",
  },
];

const stackOptions = [
  {
    name: "Custom-built (DataLatte stack)",
    icon: "🧠",
    pros: [
      "Exact fit for your business — no feature bloat",
      "Full control over AI model, prompts, and tone",
      "Lowest long-term cost (API-direct, no platform markup)",
      "Data stays on your infrastructure",
      "Can handle complex multi-step logic",
    ],
    cons: [
      "Higher upfront build time (1–4 weeks)",
      "Requires a developer for major changes",
      "You own the maintenance",
    ],
    bestFor: "Businesses wanting production-grade agents with specific integrations",
    cost: "$800–$5,000 build + ~$50–$200/month API costs",
  },
  {
    name: "GoHighLevel (GHL) AI",
    icon: "⚡",
    pros: [
      "All-in-one: CRM + email + SMS + AI chat in one platform",
      "Good for businesses already using GHL",
      "No separate AI API costs — included in plan",
      "Large community and template library",
    ],
    cons: [
      "Generic AI responses — harder to customise tone deeply",
      "Monthly platform cost ($97–$497/mo) adds up",
      "Less flexibility for complex multi-turn conversations",
      "Vendor lock-in — hard to migrate data",
    ],
    bestFor: "Businesses already on GHL who want quick AI activation",
    cost: "$97–$497/month platform fee",
  },
  {
    name: "Tidio / Intercom / Freshchat",
    icon: "💬",
    pros: [
      "Easy website chat deployment — 10-minute setup",
      "Pre-built FAQ bot templates",
      "Good for simple question-answer use cases",
    ],
    cons: [
      "Limited AI sophistication — rule-based or basic LLM",
      "Cannot integrate with booking systems deeply",
      "Can't handle outbound (reviews, reactivation, reminders)",
      "Monthly cost for each channel adds up",
    ],
    bestFor: "Businesses needing only basic website chat — not full agent pipelines",
    cost: "$29–$199/month depending on features",
  },
];

const faqs = [
  {
    q: "Should I use Claude or ChatGPT for my local business AI agent?",
    a: "It depends on the task. For booking agents that handle complex multi-turn conversations and need precise function calling (checking calendar availability, creating appointments), GPT-4o-mini is slightly faster and cheaper. For customer-facing agents that need warm, natural responses — FAQ chat, review responses, reactivation messages — Claude 3.5 Haiku or Sonnet tends to produce more human-feeling output. At DataLatte, most production agents use GPT-4o-mini for booking tasks and Claude Haiku 3.5 for conversational and writing tasks. The difference in monthly API cost for a typical local business is under $20.",
  },
  {
    q: "Why does DataLatte use n8n instead of Zapier?",
    a: "Three reasons: speed, cost, and control. n8n runs on a dedicated server so webhook triggers are instant — critical for a booking agent that needs to respond in under 60 seconds. At scale (thousands of agent executions per month), n8n's flat server cost is dramatically cheaper than Zapier's per-task pricing. And n8n's LLM orchestration nodes let us build complex multi-step AI pipelines — memory management, RAG retrieval, conditional routing — that Zapier's simple action chain can't replicate. For clients already using Zapier for simpler automations, we keep Zapier for those and use n8n specifically for AI agent workflows.",
  },
  {
    q: "What is the total monthly cost of running AI agents for a local business?",
    a: "For a typical local service business with 3 agents (booking bot, FAQ chat, review monitor), the monthly API and infrastructure cost is $50–$150/month. This breaks down as: LLM API costs ($20–$80 depending on volume — Claude Haiku and GPT-4o-mini are both cheap), n8n server ($20–$40 on a basic VPS), Twilio for SMS/voice ($10–$30), and vector database if using RAG ($0–$20 on Supabase free tier or Pinecone starter). This is the ongoing cost after the initial build investment. DataLatte passes through API costs at zero markup.",
  },
  {
    q: "Can I use AI agents if I'm not technical at all?",
    a: "Yes — that's exactly what DataLatte builds for you. You don't need to understand n8n, API keys, or LLM prompting. You describe what you want your agent to do ('answer calls when I'm busy and book appointments into my calendar') and we build, test, and deploy it. After launch, you interact with the agent through a simple dashboard and get weekly reports on what it handled. The technical stack runs invisibly in the background.",
  },
  {
    q: "How is a real AI agent different from a simple chatbot?",
    a: "A chatbot follows a decision tree — if they say X, respond with Y. An AI agent uses a large language model to understand natural language, reason about the context, and take actions. A chatbot can only answer questions it was pre-programmed for. An AI agent can understand 'I need to move my 3pm Thursday appointment to sometime Friday afternoon because I have a dentist visit' and actually check your calendar, find available Friday slots, move the appointment, and send a confirmation — all in one conversation. The difference is generalisation and action-taking, not just Q&A.",
  },
  {
    q: "What's the risk of AI agents making mistakes or saying the wrong thing?",
    a: "Real and manageable. The biggest risk is hallucination — the AI inventing information (like incorrect pricing or hours) that you haven't provided. The fix: we use Retrieval-Augmented Generation (RAG) so the agent can only answer from your verified business knowledge base, not from general training data. For booking actions, we build confirmation steps so the AI confirms the appointment details with the customer before writing to the calendar. All agents have human escalation paths — if confidence is low or the topic is outside scope, the agent routes to you. In 18 months of production agents, our clients' agents have had a 97%+ correct resolution rate.",
  },
];

export default function AIAgentsPlatformsComparePage() {
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "Compare", url: "https://datalatte.pro/compare/ai-agents-platforms" },
      { name: "AI Agent Platforms Compared", url: "https://datalatte.pro/compare/ai-agents-platforms" },
    ]),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-coffee-900 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">Platform Comparison · 2026</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              AI Agents for Local Business:<br />
              <span className="text-coffee-300">Claude vs ChatGPT vs Gemini</span><br />
              n8n vs Zapier vs Make
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              You're building a booking bot, a phone-answering agent, or a review responder.
              Which AI model should it use? Which automation platform should it run on?
              This is our honest, tested answer — based on real production agents running
              for local businesses right now.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services/ai-agents" className="btn-primary">
                See what we build →
              </Link>
              <Link href="/free-audit" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                Free audit
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Quick verdict */}
      <section className="bg-coffee-50 border-b border-coffee-100 py-10">
        <SectionWrapper>
          <p className="text-sm text-coffee-600 font-semibold uppercase tracking-wide mb-4">TL;DR — The DataLatte Stack</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🤖", label: "Booking & voice agents", verdict: "GPT-4o-mini", reason: "Fastest function calling, lowest latency for real-time conversations" },
              { icon: "💬", label: "FAQ, review & reactivation agents", verdict: "Claude 3.5 Haiku", reason: "Warmest tone, best at nuanced customer communication" },
              { icon: "⚙️", label: "Orchestration & workflows", verdict: "n8n (self-hosted)", reason: "Instant webhooks, complex LLM pipelines, no per-task cost" },
            ].map((v) => (
              <div key={v.label} className="bg-white rounded-xl p-5 border border-coffee-200">
                <div className="text-2xl mb-2">{v.icon}</div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{v.label}</p>
                <p className="text-xl font-bold text-coffee-800 mb-1">{v.verdict}</p>
                <p className="text-sm text-gray-600">{v.reason}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* LLM Comparison */}
      <SectionWrapper className="py-20">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="text-coffee-600" size={24} />
          <p className="section-label">Part 1</p>
        </div>
        <h2 className="section-title mb-4">Claude vs ChatGPT vs Gemini for Local Business Agents</h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          All three can power a local business AI agent. The differences matter when you're choosing
          what to build long-term — cost, tone, and reliability add up at scale.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-4 font-semibold text-gray-700 w-44">Factor</th>
                <th className="text-left px-5 py-4 font-semibold text-coffee-700">Claude (Anthropic)</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">ChatGPT (OpenAI)</th>
                <th className="text-left px-5 py-4 font-semibold text-gray-700">Gemini (Google)</th>
              </tr>
            </thead>
            <tbody>
              {llmRows.map((row, i) => (
                <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-5 py-4 font-medium text-gray-800 text-xs">{row.factor}</td>
                  <td className="px-5 py-4 text-gray-700 border-l border-coffee-100 bg-coffee-50/30">{row.claude}</td>
                  <td className="px-5 py-4 text-gray-600">{row.chatgpt}</td>
                  <td className="px-5 py-4 text-gray-600">{row.gemini}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Real cost breakdown */}
        <div className="mt-12 bg-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-lg font-bold mb-6 text-coffee-300">Real Monthly API Cost for a Local Business Agent</h3>
          <p className="text-gray-400 text-sm mb-6">Assumptions: 500 customer conversations/month, avg 8 messages each = 4,000 LLM calls. Mix of input/output tokens typical for a booking + FAQ agent.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { model: "Claude 3.5 Haiku", cost: "~$4/month", detail: "$0.80/M input · $4/M output", badge: "Cheapest for volume" },
              { model: "GPT-4o-mini", cost: "~$5/month", detail: "$0.15/M input · $0.60/M output", badge: "Cheapest overall" },
              { model: "Gemini 2.0 Flash", cost: "~$3/month", detail: "$0.075/M input · $0.30/M output", badge: "Lowest API price" },
            ].map((m) => (
              <div key={m.model} className="bg-gray-800 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">{m.model}</p>
                <p className="text-3xl font-bold text-white mb-1">{m.cost}</p>
                <p className="text-xs text-gray-500 mb-3">{m.detail}</p>
                <span className="text-xs bg-coffee-800 text-coffee-200 px-2 py-1 rounded-full">{m.badge}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">Note: At typical local business conversation volumes, LLM costs are negligible. Infrastructure (n8n server, SMS, vector DB) usually costs more than the AI API itself.</p>
        </div>
      </SectionWrapper>

      {/* Automation Platform Comparison */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <div className="flex items-center gap-3 mb-3">
            <Workflow className="text-coffee-600" size={24} />
            <p className="section-label">Part 2</p>
          </div>
          <h2 className="section-title mb-4">n8n vs Zapier vs Make.com for AI Agent Workflows</h2>
          <p className="text-gray-600 max-w-2xl mb-10">
            The AI model is the brain. The automation platform is the nervous system — routing triggers,
            calling APIs, writing to databases, sending SMS. This choice matters more for agent
            performance and cost than the LLM itself.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left px-5 py-4 font-semibold w-44">Factor</th>
                  <th className="text-left px-5 py-4 font-semibold text-coffee-300">n8n</th>
                  <th className="text-left px-5 py-4 font-semibold">Zapier</th>
                  <th className="text-left px-5 py-4 font-semibold">Make.com</th>
                </tr>
              </thead>
              <tbody>
                {automationRows.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-5 py-4 font-medium text-gray-800 text-xs">{row.factor}</td>
                    <td className="px-5 py-4 text-gray-700 border-l border-coffee-100 bg-coffee-50/30">{row.n8n}</td>
                    <td className="px-5 py-4 text-gray-600">{row.zapier}</td>
                    <td className="px-5 py-4 text-gray-600">{row.make}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionWrapper>
      </section>

      {/* Pre-built vs custom */}
      <SectionWrapper className="py-20">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="text-coffee-600" size={24} />
          <p className="section-label">Part 3</p>
        </div>
        <h2 className="section-title mb-4">Custom-Built vs GoHighLevel vs Off-the-Shelf Chatbots</h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          Beyond the AI model and automation platform, you need to decide how the whole agent
          is assembled. Here are the three realistic options for local businesses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackOptions.map((opt) => (
            <div key={opt.name} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <div className="text-3xl mb-3">{opt.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{opt.name}</h3>
              <div className="mb-4 flex-1">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Advantages</p>
                <ul className="space-y-2">
                  {opt.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">Limitations</p>
                <ul className="space-y-2">
                  {opt.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                      <X size={14} className="text-red-400 mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-auto">
                <p className="text-xs text-gray-500 mb-1"><span className="font-semibold">Best for:</span> {opt.bestFor}</p>
                <p className="text-xs text-coffee-700 font-semibold">{opt.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Real agent architecture diagram */}
      <section className="bg-gray-900 text-white py-20">
        <SectionWrapper>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            The DataLatte Production Agent Stack
          </h2>
          <p className="text-gray-400 text-center max-w-xl mx-auto mb-12">
            This is the exact architecture running in production agents for local businesses today.
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-3">
              {[
                { layer: "Trigger layer", tech: "Twilio (SMS/voice) · WhatsApp Business API · Web chat widget · Email webhook", note: "Customer sends message or calls" },
                { layer: "Orchestration", tech: "n8n (self-hosted) · Real-time webhook processing · Error handling + retry", note: "Routes, processes, and coordinates" },
                { layer: "Memory & context", tech: "Supabase (PostgreSQL) · pgvector for RAG · Conversation history per customer", note: "Knows who the customer is and what they've asked before" },
                { layer: "AI brain", tech: "Claude 3.5 Haiku / GPT-4o-mini · System prompt + business knowledge base · Function calling", note: "Understands intent, generates response, triggers actions" },
                { layer: "Action layer", tech: "Calendly / Acuity / Square / Fresha / Mindbody API · Google Business API · CRM write", note: "Books appointments, updates records, triggers emails" },
                { layer: "Monitoring", tech: "n8n execution logs · Custom Slack alerts · Weekly performance digest", note: "You see exactly what every agent did" },
              ].map((l, i) => (
                <div key={l.layer} className="flex items-start gap-4 bg-gray-800 rounded-xl p-4">
                  <div className="bg-coffee-600 text-white text-xs font-bold rounded-lg px-2 py-1 shrink-0 min-w-[28px] text-center">{i + 1}</div>
                  <div className="flex-1">
                    <p className="text-coffee-300 text-xs font-semibold uppercase tracking-wide mb-1">{l.layer}</p>
                    <p className="text-white text-sm font-medium mb-1">{l.tech}</p>
                    <p className="text-gray-400 text-xs">{l.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* FAQ */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-gray-200 pb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Ready to build your first AI agent?"
        sub="We'll audit your current setup, identify the 2–3 agents that will have the biggest impact on your business, and give you a fixed-price build proposal."
        ctaLabel="Get a free agent audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
