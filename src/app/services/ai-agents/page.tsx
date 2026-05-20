import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, MessageSquare, Star, Phone, Calendar, Bot, RotateCcw, Bell, Code2, Cpu, GitBranch, Webhook } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://datalatte.pro/services/ai-agents",
    languages: {
      "en-US": "https://datalatte.pro/services/ai-agents",
      "en-GB": "https://datalatte.pro/services/ai-agents",
      "en-AU": "https://datalatte.pro/services/ai-agents",
      "en-CA": "https://datalatte.pro/services/ai-agents",
      "x-default": "https://datalatte.pro/services/ai-agents",
    },
  },
  title: "AI Agents & Automation for Local Businesses",
  description:
    "Custom AI agents built on OpenAI, Claude, and n8n — automating lead follow-up, review replies, booking flows, and customer Q&A for local businesses. Real LLM pipelines, not chatbot toys.",
  openGraph: {
    title: "AI Agents & Automation for Local Businesses",
    description: "Custom AI agents built on OpenAI, Claude, and n8n — automating lead follow-up, review replies, booking flows, and customer Q&A for local businesses. Real LLM pipelines, not chatbot toys.",
    url: "https://datalatte.pro/services/ai-agents",
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "DataLatte — AI Agents & Automation for Local Businesses" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents & Automation for Local Businesses",
    description: "Custom AI agents built on OpenAI, Claude, and n8n — automating lead follow-up, review replies, booking flows, and customer Q&A for local businesses. Real LLM pipelines, not chatbot toys.",
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

// ── Agent catalog ─────────────────────────────────────────────────────────────

const AGENTS = [
  {
    id: "lead-responder",
    icon: Zap,
    name: "Lead Responder",
    tagline: "< 60s response, 24/7",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    trigger: "Webhook · Form submit · GBP message",
    model: "GPT-4o-mini",
    actions: ["Send personalised SMS/email", "Create CRM contact", "Notify owner"],
    desc: "Fires the moment a lead fills a form, messages your GBP, or clicks a Facebook Lead Ad. Pulls context from your service list and sends a personalised reply that sounds like you — in under 60 seconds.",
    schema: `{
  "name": "qualify_lead",
  "parameters": {
    "name": "string",
    "service_interest": "enum[haircut,colour,blowout]",
    "preferred_time": "string",
    "urgency": "enum[today,this_week,flexible]"
  }
}`,
  },
  {
    id: "review-monitor",
    icon: Star,
    name: "Review Monitor",
    tagline: "Responds in < 2 hours",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-100",
    trigger: "GBP webhook · Yelp RSS · Facebook API",
    model: "Claude 3.5 Haiku",
    actions: ["Draft personalised reply", "Flag negatives for owner", "Log to sheet"],
    desc: "Monitors Google Business Profile, Yelp, and Facebook for new reviews. Generates a reply that references the specific service mentioned, thanks by name, and matches your brand tone. Negative reviews route to you first.",
    schema: `{
  "name": "draft_review_reply",
  "parameters": {
    "reviewer_name": "string",
    "rating": "integer(1-5)",
    "service_mentioned": "string",
    "sentiment": "enum[positive,neutral,negative]",
    "reply_tone": "enum[warm,professional,empathetic]"
  }
}`,
  },
  {
    id: "booking-agent",
    icon: Calendar,
    name: "Booking Agent",
    tagline: "Fully conversational scheduling",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    trigger: "Website chat · SMS · WhatsApp",
    model: "GPT-4o",
    actions: ["Check calendar availability", "Create booking", "Send confirmation"],
    desc: "A multi-turn conversational agent that handles the full booking flow — asks about service, stylist preference, and date, checks real-time availability via Calendly/Acuity/Square API, and confirms the appointment.",
    schema: `{
  "name": "create_booking",
  "parameters": {
    "service": "string",
    "staff_preference": "string | null",
    "date": "ISO8601",
    "duration_mins": "integer",
    "customer_phone": "string",
    "send_reminder": "boolean"
  }
}`,
  },
  {
    id: "missed-call",
    icon: Phone,
    name: "Missed Call Text-Back",
    tagline: "Recaptures 40% of lost calls",
    color: "text-green-600",
    bg: "bg-green-50 border-green-100",
    trigger: "Twilio missed-call webhook",
    model: "GPT-4o-mini",
    actions: ["Send SMS within 30s", "Offer booking link", "Escalate if urgent"],
    desc: "When a call goes unanswered, Twilio fires a webhook. The agent sends a personalised SMS within 30 seconds, offers a direct booking link, and starts a two-way SMS conversation to capture the lead before they call a competitor.",
    schema: `{
  "name": "handle_missed_call",
  "parameters": {
    "caller_number": "string",
    "call_time": "ISO8601",
    "business_hours": "boolean",
    "prior_customer": "boolean",
    "message_template": "enum[new_lead,returning,after_hours]"
  }
}`,
  },
  {
    id: "no-show-reducer",
    icon: Bell,
    name: "No-Show Reducer",
    tagline: "Cuts no-shows by 30–50%",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100",
    trigger: "Cron · Booking system API",
    model: "Rule-based + GPT-4o-mini",
    actions: ["48h reminder SMS", "2h reminder", "Reschedule if no confirm"],
    desc: "A multi-step sequence: 48h before → SMS reminder with one-tap confirm. 2h before → final nudge. No reply? Agent sends a reschedule offer and marks the slot potentially free — reducing dead time on your calendar.",
    schema: `{
  "name": "send_reminder",
  "parameters": {
    "booking_id": "string",
    "customer_name": "string",
    "service": "string",
    "appointment_time": "ISO8601",
    "reminder_stage": "enum[48h,2h,1h]",
    "channel": "enum[sms,email,whatsapp]"
  }
}`,
  },
  {
    id: "faq-bot",
    icon: MessageSquare,
    name: "FAQ / Website Chat",
    tagline: "Handles 80% of inbound questions",
    color: "text-coffee-700",
    bg: "bg-coffee-50 border-coffee-100",
    trigger: "Website widget · Facebook Messenger",
    model: "Claude 3.5 Sonnet (RAG)",
    actions: ["Answer from knowledge base", "Capture contact", "Escalate to human"],
    desc: "RAG-powered chat agent trained on your services, pricing, hours, and policies. Uses vector search over your content to give accurate, specific answers. Unknown questions route to you with full conversation context.",
    schema: `{
  "name": "query_knowledge_base",
  "parameters": {
    "query": "string",
    "context_window": "integer",
    "top_k_chunks": "integer(1-5)",
    "confidence_threshold": "float(0-1)",
    "fallback_action": "enum[escalate,capture_email,suggest_call]"
  }
}`,
  },
  {
    id: "reactivation",
    icon: RotateCcw,
    name: "Reactivation Agent",
    tagline: "Wins back lapsed clients",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-100",
    trigger: "CRM cron · Last visit > 60 days",
    model: "GPT-4o-mini",
    actions: ["Segment by last service", "Send personalised offer", "Track re-bookings"],
    desc: "Queries your booking system for clients who haven't visited in 60+ days, segments them by last service type, and sends a personalised re-engagement message with a tailored offer. Tracks opens and re-bookings automatically.",
    schema: `{
  "name": "reactivate_client",
  "parameters": {
    "client_id": "string",
    "last_service": "string",
    "days_since_visit": "integer",
    "lifetime_value": "number",
    "offer_type": "enum[discount,gift,priority_booking,none]",
    "channel": "enum[sms,email]"
  }
}`,
  },
  {
    id: "reputation",
    icon: Bot,
    name: "Reputation Pipeline",
    tagline: "Automates review generation",
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-100",
    trigger: "Post-visit webhook · POS API",
    model: "GPT-4o-mini + conditional logic",
    actions: ["Send review request", "Route happy → Google", "Route unhappy → private"],
    desc: "After a completed appointment, the agent sends a satisfaction check via SMS. Happy customers (4–5 stars) get a direct link to your Google review page. Unhappy customers get a private feedback form — protecting your public rating.",
    schema: `{
  "name": "route_review_request",
  "parameters": {
    "customer_id": "string",
    "service_completed": "string",
    "internal_rating": "integer(1-5)",
    "google_review_url": "string",
    "private_form_url": "string",
    "send_delay_mins": "integer"
  }
}`,
  },
];

// ── Tech stack ────────────────────────────────────────────────────────────────

const STACK = [
  { name: "OpenAI API", detail: "GPT-4o, GPT-4o-mini, function calling, embeddings", category: "LLM" },
  { name: "Anthropic API", detail: "Claude 3.5 Sonnet/Haiku for nuanced, tone-safe responses", category: "LLM" },
  { name: "n8n", detail: "Self-hosted workflow orchestration, 400+ integrations", category: "Orchestration" },
  { name: "Zapier / Make", detail: "No-code automation for simpler trigger-action flows", category: "Orchestration" },
  { name: "GoHighLevel", detail: "CRM, SMS/email sequences, pipeline management", category: "CRM/Comms" },
  { name: "Twilio", detail: "Programmable SMS, voice webhooks, WhatsApp Business API", category: "Comms" },
  { name: "Pinecone / Supabase", detail: "Vector store for RAG-powered knowledge base agents", category: "Memory" },
  { name: "Calendly / Acuity / Square", detail: "Real-time availability + booking creation via API", category: "Booking" },
];

// ── Architecture steps ────────────────────────────────────────────────────────

const ARCH_STEPS = [
  { icon: Webhook, label: "Trigger", desc: "Webhook, cron, form submit, API event, or user message fires the workflow" },
  { icon: GitBranch, label: "Route", desc: "Conditional logic classifies the input — new lead, existing client, complaint, etc." },
  { icon: Cpu, label: "LLM call", desc: "Structured prompt with context + function schema sent to GPT-4o or Claude. Response parsed into typed actions." },
  { icon: Code2, label: "Action", desc: "Agent executes: writes to CRM, sends SMS, creates booking, posts reply, or escalates to human" },
];

// ── Structured data ───────────────────────────────────────────────────────────

const faqs = [
  {
    q: "What's the difference between a workflow automation and an AI agent?",
    a: "A workflow automation (Zapier, Make) follows a fixed if/then path — it can't reason or adapt. An AI agent uses an LLM to understand unstructured input, decide what action to take, and call the right tool. For example: a workflow can auto-send a confirmation email. An agent can read an ambiguous 'I want to come in Thursday but maybe Friday' message, extract the intent, check availability, and respond naturally.",
  },
  {
    q: "Do you use GPT-4o or Claude? How do you choose?",
    a: "It depends on the task. GPT-4o with function calling is best for structured data extraction, booking flows, and tool use. Claude 3.5 Sonnet/Haiku is better for customer-facing text where tone consistency matters — it's harder to make sound robotic. For most setups I run a hybrid: Claude for the customer-facing layer, GPT-4o-mini for the background data work.",
  },
  {
    q: "Can agents access my existing booking system or CRM?",
    a: "Yes, if it has an API (which most do — Calendly, Acuity, Square, Mindbody, GoHighLevel, HubSpot, Salesforce all do). I map the API endpoints into OpenAI function definitions or n8n HTTP nodes, so the agent can read availability, create bookings, and update contact records in real time.",
  },
  {
    q: "How do you handle hallucinations or wrong answers?",
    a: "For customer-facing agents I use RAG (retrieval-augmented generation) — the agent answers only from your approved content, not from general training data. I set confidence thresholds: if the retrieval score is below the threshold, the agent escalates to a human instead of guessing. Critical actions (booking creation, refunds) always require explicit confirmation steps.",
  },
  {
    q: "What does a typical build cost and how long does it take?",
    a: "A single-agent setup (e.g. missed call text-back + FAQ bot) typically takes 1–2 weeks and runs $800–$2,000 one-time depending on integration complexity. A full multi-agent pipeline (lead responder + booking + no-show reducer + reactivation) is 3–5 weeks, $2,500–$5,000. Monthly tool costs run $50–$200 (API calls, n8n hosting, Twilio). I provide full documentation so you can manage and update it yourself.",
  },
  {
    q: "What happens when the AI gets something wrong or a customer complains?",
    a: "Every agent has a human escalation path. The fallback triggers when: confidence score is low, the customer uses escalation keywords ('speak to a person', 'this is wrong'), or the conversation exceeds a set turn limit without resolution. You get a Slack/SMS alert with full conversation context so you can step in immediately. Nothing gets auto-resolved without a clear success condition.",
  },
];

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: "https://datalatte.pro" },
  { name: "Services", url: "https://datalatte.pro/services/google-ads" },
  { name: "AI Agents & Automation", url: "https://datalatte.pro/services/ai-agents" },
]);

const service = serviceSchema({
  name: "AI Agents & Automation",
  description: "Custom AI agents built on OpenAI and Claude APIs, n8n, and Twilio — automating lead response, booking, review management, and client reactivation for local businesses.",
  url: "https://datalatte.pro/services/ai-agents",
});

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AIAgentsPage() {
  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />

      {/* Tool promo banner */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-3 px-4 text-center text-sm">
        <span className="text-gray-600">Want to explore AI agents yourself? </span>
        <Link href="/tools/ai-agent-builder" className="font-semibold text-coffee-700 hover:underline">
          Try our free AI Agent Builder →
        </Link>
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-coffee-950 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-6xl mb-5">🤖</div>
          <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-mono px-4 py-1.5 rounded-full mb-5 tracking-wider">
            AI AGENTS & AUTOMATION
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            Eight agents. One pipeline.<br className="hidden sm:block" />
            <span className="text-coffee-400">Zero missed leads.</span>
          </h1>
          <p className="text-xl text-white/70 mb-4 max-w-2xl mx-auto">
            Real LLM pipelines — not chatbot toys. Built on OpenAI function calling, Claude, n8n, and Twilio — integrated into your booking system, CRM, and Google Business Profile.
          </p>
          <p className="text-white/45 text-sm font-mono mb-10 max-w-xl mx-auto">
            trigger → classify → LLM call → structured action → human escalation path
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Request a Free Audit <ArrowRight size={17} />
            </Link>
            <Link href="/tools/ai-agent-builder" className="inline-flex items-center gap-2 border border-white/25 text-white/80 font-medium px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Try Agent Builder <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Architecture ──────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-coffee-400 uppercase tracking-widest">Under the hood</span>
            <h2 className="text-2xl font-bold text-white mt-2">How every agent is structured</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {ARCH_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex-1 relative">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full">
                    <Icon size={20} className="text-coffee-400 mb-3" />
                    <div className="text-xs font-mono text-coffee-500 mb-1 uppercase tracking-widest">{String(i + 1).padStart(2, "0")}</div>
                    <div className="text-white font-semibold mb-2">{step.label}</div>
                    <div className="text-gray-400 text-xs leading-relaxed">{step.desc}</div>
                  </div>
                  {i < ARCH_STEPS.length - 1 && (
                    <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-coffee-600 rounded-full items-center justify-center">
                      <ArrowRight size={11} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Agent catalog ─────────────────────────────────────────────────── */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">The Agent Catalog</span>
          <h2 className="section-title">8 agents I build for local businesses</h2>
          <p className="text-gray-500 max-w-xl mx-auto mt-3">
            Each card shows the real trigger, model, and function schema. These are deployed pipelines — not demos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className={`rounded-2xl border p-6 ${agent.bg} flex flex-col gap-4`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                      <Icon size={18} className={agent.color} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{agent.name}</div>
                      <div className={`text-xs font-semibold ${agent.color}`}>{agent.tagline}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">{agent.desc}</p>

                {/* Technical details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/70 rounded-lg px-3 py-2">
                    <div className="text-gray-400 font-mono mb-0.5">TRIGGER</div>
                    <div className="text-gray-700 font-medium">{agent.trigger}</div>
                  </div>
                  <div className="bg-white/70 rounded-lg px-3 py-2">
                    <div className="text-gray-400 font-mono mb-0.5">MODEL</div>
                    <div className="text-gray-700 font-medium">{agent.model}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.actions.map((a) => (
                    <span key={a} className="text-xs bg-white/80 border border-white/60 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                      {a}
                    </span>
                  ))}
                </div>

                {/* Function schema */}
                <details className="group">
                  <summary className="flex items-center gap-1.5 text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-700 select-none list-none">
                    <Code2 size={12} />
                    <span>function schema</span>
                    <span className="ml-auto text-gray-400 group-open:rotate-90 transition-transform inline-block">›</span>
                  </summary>
                  <pre className="mt-2 bg-gray-950 text-green-400 text-xs rounded-lg p-3 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
                    {agent.schema}
                  </pre>
                </details>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* ── Tech stack ────────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-coffee-400 uppercase tracking-widest">Tech Stack</span>
            <h2 className="text-2xl font-bold text-white mt-2">Tools I use to build and deploy agents</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STACK.map((tool) => (
              <div key={tool.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="text-xs font-mono text-coffee-500 mb-1 uppercase tracking-widest">{tool.category}</div>
                <div className="text-white font-semibold text-sm mb-1">{tool.name}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{tool.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Example: full n8n-style pipeline ─────────────────────────────── */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="section-label">Live Example</span>
            <h2 className="section-title">Lead Responder — full pipeline config</h2>
            <p className="text-gray-500 mt-3">
              This is an abbreviated version of the n8n workflow + OpenAI function definition used in a real hair salon deployment. The agent handles 40–60 inbound leads per month, responds within 45 seconds, and books ~28% into consultations.
            </p>
          </div>

          {/* Pipeline config block */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Tab bar */}
            <div className="bg-gray-950 flex items-center gap-1 px-4 py-3 border-b border-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500 font-mono">lead_responder_agent.json</span>
            </div>
            <pre className="bg-gray-950 text-gray-300 text-xs p-5 overflow-x-auto leading-relaxed font-mono">
{`{
  "workflow": "lead_responder_v2",
  "trigger": {
    "type": "webhook",
    "method": "POST",
    "path": "/leads/inbound",
    "auth": "bearer"
  },
  "nodes": [
    {
      "id": "classify_source",
      "type": "switch",
      "conditions": [
        { "field": "$.source", "equals": "gbp_message",  "next": "enrich_gbp"  },
        { "field": "$.source", "equals": "facebook_lead", "next": "enrich_fb"   },
        { "field": "$.source", "equals": "web_form",      "next": "enrich_form" }
      ]
    },
    {
      "id": "call_llm",
      "type": "openai_chat",
      "model": "gpt-4o-mini",
      "system_prompt": "You are a warm, concise assistant for {business_name}...",
      "tools": [
        {
          "name": "qualify_lead",
          "description": "Extract lead intent and urgency",
          "parameters": {
            "type": "object",
            "properties": {
              "service_interest": { "type": "string", "enum": ["haircut","colour","blowout","other"] },
              "urgency":          { "type": "string", "enum": ["today","this_week","flexible"] },
              "contact_preference":{ "type": "string", "enum": ["sms","email","call"] }
            },
            "required": ["service_interest", "urgency"]
          }
        },
        {
          "name": "check_availability",
          "description": "Query Calendly API for open slots",
          "parameters": {
            "type": "object",
            "properties": {
              "service_type": { "type": "string" },
              "preferred_date": { "type": "string", "format": "date" },
              "duration_mins":  { "type": "integer", "default": 60 }
            }
          }
        }
      ],
      "fallback_on_error": "escalate_to_human"
    },
    {
      "id": "send_reply",
      "type": "twilio_sms",
      "to": "{{trigger.phone}}",
      "body": "{{llm.generated_reply}}",
      "timeout_ms": 8000
    },
    {
      "id": "create_crm_contact",
      "type": "gohighlevel_api",
      "action": "upsert_contact",
      "data": {
        "name":    "{{trigger.name}}",
        "phone":   "{{trigger.phone}}",
        "tags":    ["ai_lead", "{{nodes.call_llm.service_interest}}"],
        "pipeline": "new_leads"
      }
    },
    {
      "id": "escalate_to_human",
      "type": "notify",
      "channels": ["sms_owner", "slack"],
      "message": "⚠️ AI handoff: {{trigger.name}} — low confidence or error. Conversation: {{context_url}}"
    }
  ],
  "sla": {
    "max_response_ms": 60000,
    "escalation_on_timeout": true
  }
}`}
            </pre>
          </div>

          <p className="text-xs text-gray-400 mt-3 font-mono">
            * Simplified for clarity. Production config includes retry logic, PII scrubbing, and audit logging.
          </p>
        </div>
      </SectionWrapper>

      {/* ── What's included ───────────────────────────────────────────────── */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
            <span className="text-coffee-600">✓</span> What you get
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Full workflow audit — map every lead drop-off point",
              "Up to 3 agents built and deployed (4–8 week engagement)",
              "OpenAI / Claude API integration with function calling",
              "n8n or Zapier orchestration layer",
              "CRM integration (GoHighLevel, HubSpot, or custom)",
              "Twilio SMS + WhatsApp Business setup",
              "RAG knowledge base from your existing content",
              "Confidence threshold tuning + human escalation paths",
              "Monitoring dashboard (response rates, fallback rate, cost/lead)",
              "Full documentation + recorded walkthrough so you can extend it",
              "30-day post-launch support — fix anything that surfaces in production",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5 bg-white rounded-xl px-4 py-3 border border-coffee-100">
                <CheckCircle2 size={17} className="text-coffee-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Best for ──────────────────────────────────────────────────────── */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Is This Right for You?</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">This engagement is best for:</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Businesses handling 20+ inbound leads per month",
              "Owners spending 1–2h/day on repetitive follow-up messages",
              "Any service business with > 10% no-show rate",
              "Businesses with an existing booking system and CRM",
              "Tech-comfortable owners who want to understand what they're running",
              "Anyone who's ever lost a lead to a competitor who replied faster",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-coffee-50 rounded-xl p-4 border border-coffee-100">
                <CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Technical questions answered</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Related ───────────────────────────────────────────────────────── */}
      <SectionWrapper>
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore related services</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "🤖 Free AI Agent Builder Tool", href: "/tools/ai-agent-builder" },
            { label: "Analytics & Reporting", href: "/services/analytics" },
            { label: "Google Ads", href: "/services/google-ads" },
            { label: "Email & SMS Marketing", href: "/services/email-sms" },
            { label: "Website & Landing Pages", href: "/services/website" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
