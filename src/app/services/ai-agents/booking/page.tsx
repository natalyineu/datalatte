import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/services/ai-agents/booking";
const PAGE_TITLE = "AI Booking Agent for Local Businesses: 24/7 Appointment Automation in 2026";
const PAGE_DESC =
  "Build an AI booking agent that takes appointments around the clock — from Instagram DMs, website chat, SMS, and missed calls. Works with Mindbody, Fresha, Square, Vagaro, Booksy, and 20+ booking platforms. No scripted menus, real natural language.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const channels = [
  { name: "Website chat widget", desc: "Embedded on any page — books without the customer leaving your site" },
  { name: "Instagram DM", desc: "Replies to DMs automatically via the Instagram Messaging API" },
  { name: "Facebook Messenger", desc: "Handles Messenger enquiries and converts them to bookings" },
  { name: "Google Business Profile chat", desc: "Captures leads from Google Maps search directly" },
  { name: "SMS / WhatsApp", desc: "Responds to inbound texts and WhatsApp messages 24/7" },
  { name: "Missed call text-back", desc: "When calls go unanswered, auto-texts within 90 seconds" },
];

const platforms = [
  "Mindbody", "Fresha", "Vagaro", "Booksy", "Square Appointments",
  "Treatwell", "Timely", "WODIFY", "Glofox", "Pike13",
  "123Pet", "Gingr", "MoeGo", "Acuity Scheduling", "Calendly",
  "Google Calendar", "Cliniko", "Jane App", "GoHighLevel",
];

const steps = [
  {
    n: "01",
    title: "Customer sends a message on any channel",
    body: "Instagram DM, website chat, Google Business Profile, SMS — wherever they reach out, the agent is listening. No channel-switching on your end.",
  },
  {
    n: "02",
    title: "Agent qualifies the request in natural language",
    body: "It asks the right questions for your business type — service, preferred time, stylist/groomer/trainer preference, pet breed for groomers, coat condition for hair salons. No scripted menus. Real conversation.",
  },
  {
    n: "03",
    title: "Agent checks live availability in your booking system",
    body: "Real-time API call to your booking platform — reads current availability, respects buffer times, blocked times, and your staff's individual calendars.",
  },
  {
    n: "04",
    title: "Agent offers specific slots and confirms",
    body: "Presents 2–3 concrete options, handles objections (wrong time, wrong staff, price question), and confirms the preferred slot with the customer's name and contact.",
  },
  {
    n: "05",
    title: "Booking created directly in your system",
    body: "Writes the confirmed appointment into your booking platform — no double-entry, no manual step. Customer gets a confirmation immediately.",
  },
  {
    n: "06",
    title: "Reminder sequence begins automatically",
    body: "The booking triggers your reminder sequence (separate agent, configurable timing) — reducing no-shows without any manual follow-up.",
  },
];

const niches = [
  { label: "Hair & Beauty Salons", href: "/for/hair-salons/ai-agents", detail: "Handles service + stylist preference, colour consultation triage, patch test reminders" },
  { label: "Fitness Studios & Gyms", href: "/for/fitness-studios/ai-agents", detail: "Books classes with waitlist, handles drop-in vs membership, collects fitness goals" },
  { label: "Pet Groomers", href: "/for/pet-groomers/ai-agents", detail: "Full pet intake (breed, coat, temperament) flows directly into grooming software" },
  { label: "Coffee Shops & Cafés", href: "/for/coffee-shops/ai-agents", detail: "Private events, team breakfasts, deposit collection, group dietary requirements" },
  { label: "Dental & Medical", href: "/for/dentists", detail: "Appointment type qualification, insurance pre-check, new-patient intake" },
  { label: "Cleaning Services", href: "/for/cleaning-services", detail: "Property size, service frequency, key handoff logistics, quoting flow" },
];

const faqs = [
  {
    q: "How is this different from a booking widget or Calendly link?",
    a: "A booking widget requires the customer to already know what they want and navigate to it. An AI booking agent meets customers where they are — in their Instagram DMs, in your Google chat, in a text message — and has a real conversation that qualifies them, answers their questions, and converts the enquiry into a confirmed booking. It handles uncertainty ('I'm not sure which service I need'), objections ('that time doesn't work'), and edge cases ('can I change my stylist?') that a booking widget can't.",
  },
  {
    q: "What if a customer asks something outside the booking flow?",
    a: "The booking agent is configured with a scope — it knows when a question is outside its remit and escalates gracefully. For complex service questions, it hands off to your FAQ agent. For pricing queries it doesn't have the answer to, it says 'let me get the owner to come back to you on that' and captures the contact. It never makes up an answer.",
  },
  {
    q: "Can it handle reschedules and cancellations?",
    a: "Yes. Customers can DM or text 'I need to reschedule my appointment on Saturday' and the agent retrieves their booking, presents available alternative slots, and moves the appointment. Cancellations are processed according to your policy — the agent enforces your cancellation window (e.g. 48-hour notice required for a deposit refund) and releases the slot for new bookings.",
  },
  {
    q: "How long does it take to set up?",
    a: "For a standard booking agent with one booking platform integration and 3–4 channels, we build and test in 1–2 weeks. Setup requires a 30-minute onboarding call where you walk us through your services, pricing, staff calendars, and any policies. We handle the integration, conversation design, and testing. You approve before it goes live.",
  },
  {
    q: "What does it cost?",
    a: "Build: $800–$2,000 depending on booking platform complexity and number of channels. Monthly: $40–$90/month for API calls, SMS (if applicable), and hosting. For most local businesses, a single additional booking per week from after-hours enquiries covers the monthly cost many times over.",
  },
];

export default function AIBookingAgentPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "AI Agents", url: "https://datalatte.pro/services/ai-agents" },
      { name: "AI Booking Agent", url: "https://datalatte.pro/services/ai-agents/booking" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agent Skill · Appointment Booking</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Never lose a booking<br />
              <span className="text-coffee-300">to a missed message.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              An AI booking agent that handles enquiries 24/7 across Instagram, website chat,
              Google Business Profile, and SMS — qualifying the customer, checking your real-time
              availability, and creating the confirmed booking in your system. No scripted menus.
              No missed revenue.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Get your booking agent built →</Link>
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
              { value: "40%", label: "Of booking enquiries arrive outside business hours" },
              { value: "24/7", label: "Coverage across all channels with zero staff time" },
              { value: "90s", label: "Response time to missed calls via automatic text-back" },
              { value: "6", label: "Channels monitored simultaneously from one agent" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* How it works */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">How the booking agent works</h2>
        <p className="text-gray-600 max-w-2xl mb-14">A real LLM pipeline — not a chatbot with decision trees. It handles natural language, understands context, and takes action in your booking system.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.n} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <span className="text-3xl font-bold text-coffee-200">{step.n}</span>
              <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Channels */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-3">Every channel, one agent</h2>
          <p className="text-gray-600 max-w-2xl mb-12">Customers contact you in different ways. The booking agent handles all of them — consistently, immediately, and with the same quality of response.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div key={ch.name} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex gap-3">
                <CheckCircle2 size={18} className="text-coffee-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{ch.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Platform integrations */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Works with your booking platform</h2>
        <p className="text-gray-600 max-w-2xl mb-10">We integrate with 20+ booking systems — reading real-time availability and writing confirmed bookings directly. No manual sync, no double-entry.</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <span key={p} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full">{p}</span>
          ))}
        </div>
      </SectionWrapper>

      {/* Niche versions */}
      <section className="bg-coffee-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-3">Booking agents built for your industry</h2>
          <p className="text-gray-600 max-w-2xl mb-12">Different businesses need different intake flows. We build booking agents configured for your specific niche — not a generic template.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {niches.map((n) => (
              <Link key={n.href} href={n.href} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-coffee-200 transition-all group">
                <p className="font-semibold text-gray-900 group-hover:text-coffee-700 transition-colors">{n.label}</p>
                <p className="text-xs text-gray-500 mt-1 mb-3">{n.detail}</p>
                <span className="text-xs text-coffee-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  See booking agent <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Booking agent questions</h2>
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
        headline="Get your AI booking agent built"
        sub="Free 30-minute audit. We'll map your current booking channels, identify where you're losing after-hours revenue, and spec out the exact booking agent to fix it."
        ctaLabel="Book your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
