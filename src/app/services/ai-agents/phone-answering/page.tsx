import type { Metadata } from "next";
import Link from "next/link";
import { Phone, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/services/ai-agents/phone-answering";
const PAGE_TITLE = "AI Phone Answering Agent for Local Businesses: Never Miss a Call in 2026";
const PAGE_DESC =
  "Missed call text-back and AI phone answering for local businesses. Automatically texts back within 90 seconds of a missed call, qualifies the customer, answers FAQs, and books appointments — so every call becomes a converted customer.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const scenarios = [
  {
    trigger: "Busy morning rush",
    problem: "You're pulling espresso shots and the phone rings. Nobody answers. The caller hangs up and Googles your competitor.",
    solution: "Within 90 seconds, the agent texts the missed number: 'Hi, you just called Bloom Coffee — sorry we missed you! Can I help with a reservation or a quick question? 😊'",
  },
  {
    trigger: "Grooming appointment in progress",
    problem: "You're mid-groom with a nervous dog. You can't answer. The caller has three other grooming salons to try.",
    solution: "Text-back fires immediately. Agent asks about their dog's breed, collects intake details, and books the appointment — all before you've finished the groom.",
  },
  {
    trigger: "Closed hours",
    problem: "It's 9pm. A potential client calls about booking a colour appointment for next Saturday. Voicemail. They forget to call back.",
    solution: "Text-back fires within 90 seconds. Agent books the Saturday appointment, collects the client's contact, and your diary is full before you open in the morning.",
  },
  {
    trigger: "Staff on lunch / short-handed",
    problem: "Your receptionist is at lunch. You're with a client. Three calls in 45 minutes go unanswered.",
    solution: "All three get an automatic text-back. Agent handles two straightforward FAQs and books one appointment. Nothing falls through.",
  },
];

const conversation = [
  { role: "agent", text: "Hi! You just called Bloom Hair Studio — sorry we missed you! I'm the studio's assistant. Can I help with a booking or answer a quick question? 😊" },
  { role: "customer", text: "Yeah I wanted to book a balayage, not sure who to ask for" },
  { role: "agent", text: "Great choice! Our balayage specialist is Zara — she has a stunning portfolio and is fully booked 2 weeks out, which tells you all you need to know 😊 For balayage + cut we recommend 3–4 hours. When are you thinking? I can check her next available slots." },
  { role: "customer", text: "Something in the next 2 weeks ideally" },
  { role: "agent", text: "Zara has Tuesday 3rd at 11am or Thursday 5th at 2pm. Full balayage + cut is £165. Which works for you?" },
  { role: "customer", text: "Tuesday 11am" },
  { role: "agent", text: "Booked! ✅ Tuesday 3rd at 11am with Zara for balayage + cut. Can I grab your name so Zara knows who she's looking forward to seeing?" },
];

const capabilities = [
  "Texts back missed calls within 90 seconds, 24/7",
  "Greets callers by referencing your business name",
  "Qualifies the reason for the call in natural language",
  "Answers FAQs (hours, parking, pricing, availability)",
  "Checks real-time availability and books appointments",
  "Collects contact details and lead information",
  "Handles objections and presents options",
  "Escalates complex queries to you via Slack or SMS",
  "Logs every conversation for your review",
  "Personalises responses using caller history (return callers)",
];

const faqs = [
  {
    q: "How does the missed call text-back work technically?",
    a: "We set up a Twilio (or similar) call tracking number that forwards to your existing phone line. When a call goes unanswered, a webhook fires to the AI agent system within 60–90 seconds. The agent sends an SMS to the caller's number and handles the conversation from there. Your phone number doesn't change — we simply add a monitoring layer on top of your existing line.",
  },
  {
    q: "What happens when someone calls and the agent texts them but they want to talk to a person?",
    a: "If a customer explicitly asks to speak to someone, the agent says: 'Absolutely — I'll let the team know to call you back shortly. What's the best number and a good time to reach you?' It captures their details and notifies you immediately. The agent never pretends to be human if the customer asks directly whether they're speaking to a bot.",
  },
  {
    q: "Can this work for a business that takes calls for complex quotes?",
    a: "Yes, within defined limits. For simple bookings and FAQ responses, the agent handles everything. For complex jobs requiring a site visit or detailed spec (e.g., cleaning services, electricians), the agent qualifies the job type, collects the necessary details, and books a callback or consultation — giving you a pre-qualified lead rather than a cold call to return.",
  },
  {
    q: "What if the person doesn't respond to the text-back?",
    a: "If there's no response within 10 minutes, the agent sends one follow-up: 'Just following up in case my last message didn't come through — happy to help whenever you're ready!' If still no response, the conversation is logged and you receive a notification. No aggressive follow-up sequences for phone-based contacts — just one professional prompt.",
  },
  {
    q: "Can I use this alongside a human receptionist?",
    a: "Absolutely — in fact, this is the most common setup. The agent handles overflow: missed calls during busy periods, after-hours calls, and lunchtime gaps. Your receptionist handles in-person customers and scheduled callback calls. The agent logs every conversation so your receptionist has full context when following up.",
  },
];

export default function AIPhoneAnsweringPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "AI Agents", url: "https://datalatte.pro/services/ai-agents" },
      { name: "AI Phone Answering", url: "https://datalatte.pro/services/ai-agents/phone-answering" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agent Skill · Phone Answering & Missed Call Recovery</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Stop losing customers<br />
              <span className="text-coffee-300">to missed calls.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Every missed call is a potential customer calling your competitor.
              An AI phone answering agent texts back within 90 seconds, answers their question,
              and books the appointment — so no call goes unconverted, even during the morning
              rush, mid-groom, or after hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Set up your missed call recovery →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                All AI agent skills
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Stats */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "8–12", label: "Bookable calls the average local business misses per week" },
              { value: "90s", label: "Response time to missed calls via automatic text-back" },
              { value: "62%", label: "Of missed callers who respond to an automated text-back" },
              { value: "78%", label: "Of people prefer texting a business over waiting on hold" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* Real scenarios */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Every missed call scenario, handled</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Calls go unanswered for real reasons. The agent handles all of them — without you needing to change how you work.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map((s) => (
            <div key={s.trigger} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <p className="text-xs font-semibold text-coffee-600 uppercase tracking-wide mb-2">{s.trigger}</p>
              <p className="text-sm text-gray-500 mb-3 italic">"{s.problem}"</p>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">{s.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Conversation demo */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title mb-3 text-center">What the conversation looks like</h2>
            <p className="text-gray-600 mb-10 text-center">A missed call on a Saturday afternoon. What happens next.</p>
            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
              <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                Live SMS conversation — triggered by missed call
              </p>
              <div className="space-y-3">
                {conversation.map((msg, j) => (
                  <div key={j} className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === "agent" ? "bg-gray-700 text-gray-100 rounded-tl-sm" : "bg-coffee-600 text-white rounded-tr-sm"
                    }`}>
                      {msg.role === "agent" && <p className="text-xs text-coffee-300 font-semibold mb-1">AI Agent (SMS)</p>}
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Capabilities */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">What the phone answering agent does</h2>
        <p className="text-gray-600 max-w-xl mb-10">Full capability stack — not just a text-back, but a complete conversational agent that handles the entire customer interaction.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {capabilities.map((c) => (
            <div key={c} className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-coffee-500 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">{c}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Phone answering agent questions</h2>
          <div className="max-w-3xl space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      <CTABanner
        headline="Stop letting missed calls go to your competitors"
        sub="Free audit — we'll estimate how many bookings you're losing to unanswered calls each week and show you exactly what a missed call recovery agent would look like for your business."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
