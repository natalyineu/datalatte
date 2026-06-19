import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Phone, Star, RefreshCw, MessageSquare } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/for/hair-salons/ai-agents";
const PAGE_TITLE = "AI Agents for Hair Salons: Automate Bookings, No-Shows & Google Reviews in 2026";
const PAGE_DESC =
  "5 AI agents for hair salons and beauty studios: 24/7 appointment booking, no-show reducer, Google review pipeline, stylist FAQ bot, and lapsed client reactivation. Works with Fresha, Vagaro, Booksy, and Square.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const agents = [
  {
    icon: <Calendar size={22} />,
    name: "24/7 Appointment Booking Agent",
    trigger: "Website chat, Instagram DM, Facebook Messenger, Google Business chat, SMS",
    whatItDoes: "Books appointments around the clock — capturing the 40% of salon booking enquiries that arrive outside business hours. Asks for service type, preferred stylist, and availability, then creates the booking directly in your salon software. Handles reschedules and cancellations too, with your salon's policy enforced automatically.",
    conversation: [
      { role: "customer", text: "Can I book a full colour and cut with someone on Saturday?" },
      { role: "agent", text: "Hi! Absolutely — Saturday works well. For a full colour + cut, we recommend allowing 3 hours. Do you have a preferred stylist, or shall I find the best available slot?" },
      { role: "customer", text: "Whoever is free around 11am is fine" },
      { role: "agent", text: "Zara has 11:15am available on Saturday. Full colour + cut is £135. Shall I book that in for you? I'll just need your name and a contact number." },
      { role: "customer", text: "Yes please, Emma Davies, 07712 345678" },
      { role: "agent", text: "Booked! 🎉 Emma Davies — Sat 11:15am, full colour + cut with Zara. You'll get a confirmation text and a reminder 48 hours before. Is there anything specific for the colour you'd like noted for Zara?" },
    ],
    integrations: ["Fresha", "Vagaro", "Booksy", "Square Appointments", "Treatwell", "Timely"],
    impact: "Salons using 24/7 booking agents capture 40–55% more online bookings, primarily from evening and weekend enquiries.",
  },
  {
    icon: <Phone size={22} />,
    name: "No-Show Reducer — Reminder Sequence",
    trigger: "Appointment booked → automated sequence begins",
    whatItDoes: "Runs a multi-touch reminder sequence for every confirmed appointment: SMS 72 hours before asking to confirm, SMS 24 hours before with confirmation link, SMS 2 hours before as final reminder. Each message is personalised with stylist name, service, and time. Unconfirmed appointments after 48 hours are flagged for you to decide whether to release the slot.",
    conversation: [
      { role: "agent", text: "Hi Emma! Reminder: you're booked in with Zara at Bloom Hair on Saturday at 11:15am for colour + cut. Please confirm your appointment by replying YES, or reply CANCEL if you need to reschedule." },
      { role: "customer", text: "YES" },
      { role: "agent", text: "Perfect — see you Saturday! 💛 Zara will be ready for you at 11:15am. Reply RESCHEDULE anytime if your plans change." },
    ],
    integrations: ["Twilio SMS", "Fresha", "Vagaro", "Booksy", "WhatsApp Business"],
    impact: "Salons using reminder sequences see 30–50% reduction in no-shows. At an average service value of £85, one recovered no-show per week = £4,400/year.",
  },
  {
    icon: <Star size={22} />,
    name: "Post-Appointment Google Review Pipeline",
    trigger: "Appointment marked complete in booking system",
    whatItDoes: "2–3 hours after an appointment is marked complete, the agent sends a personalised thank-you and review request. Customers who rate 5 stars are guided directly to Google. Customers who indicate any disappointment are privately routed — their feedback is captured and sent to you immediately, keeping negative sentiment off public platforms.",
    conversation: [
      { role: "agent", text: "Hi Emma! Hope you're loving your new colour 💛 How was your experience with Zara today? (Reply 1–5 or tap a star)" },
      { role: "customer", text: "5! She was amazing" },
      { role: "agent", text: "So glad to hear it! 🌟 If you have a moment, a Google review would mean the world to us and helps other clients find us. It only takes 30 seconds: [Google link]" },
      { role: "customer", text: "Done! Gave 5 stars" },
      { role: "agent", text: "Thank you so much Emma! See you next time 💛" },
    ],
    integrations: ["Google Business Profile API", "Fresha", "Vagaro", "Square", "Booksy"],
    impact: "3–4× more Google reviews per month. A salon going from 47 to 200+ reviews typically sees a 15–25% increase in new client bookings within 6 months.",
  },
  {
    icon: <MessageSquare size={22} />,
    name: "Stylist & Service FAQ Agent",
    trigger: "Website chat, Instagram DM, WhatsApp, Google Business chat",
    whatItDoes: "Answers the questions that fill your inbox: which stylist specialises in balayage, how long a Brazilian blowout takes, whether you do extensions, patch test requirements for colour clients, parking, whether walk-ins are accepted. Knows your full service menu and can give price estimates. Escalates anything requiring a consultation.",
    conversation: [
      { role: "customer", text: "Do you do extensions? And how much roughly?" },
      { role: "agent", text: "Yes! We offer tape-in and nano-ring extensions. Pricing depends on hair length and amount — typically £250–£500 fitted, not including the hair itself (we source at cost or you can bring your own). Sophie is our extension specialist. Would you like me to book a free consultation with her?" },
      { role: "customer", text: "Yes please, sometime next week" },
      { role: "agent", text: "Sophie has Tuesday at 4pm or Thursday at 11am next week. Consultations are free and take about 20 minutes. Which works better for you?" },
    ],
    integrations: ["Your website (embed)", "Instagram DM API", "WhatsApp Business", "Google Business Profile"],
    impact: "Reduces DM and phone enquiry handling time by 3–5 hours per week for the average salon.",
  },
  {
    icon: <RefreshCw size={22} />,
    name: "Lapsed Client Reactivation Agent",
    trigger: "Client hasn't visited in 8+ weeks (from booking system data)",
    whatItDoes: "Identifies clients who haven't rebooked after their natural rebook window and sends a personalised, non-pushy win-back sequence. References their last service if available. Offers a reason to return (seasonal offer, new stylist, new service). Three messages over 12 days — stops the moment they rebook.",
    conversation: [
      { role: "agent", text: "Hi Emma! It's been a little while since your last visit with Zara — we hope you've been well 💛 We've just introduced a new toning gloss treatment that's perfect for maintaining your colour between appointments. Worth a look? Book here: [link]" },
      { role: "customer", text: "Oh I've been meaning to come back! Is Zara still there?" },
      { role: "agent", text: "She absolutely is! She's been asking after you 😊 Shall I check her availability for the next couple of weeks?" },
    ],
    integrations: ["Fresha", "Vagaro", "Booksy", "Mailchimp", "Klaviyo"],
    impact: "12–20% of lapsed clients rebook within the reactivation window. A salon with 400 active clients typically has 80–120 lapsed at any one time — recovering 15% is 12–18 extra bookings per month.",
  },
];

const faqs = [
  {
    q: "Which booking systems does this work with?",
    a: "We integrate with all major salon booking platforms: Fresha (including the new Fresha Pro API), Vagaro, Booksy, Square Appointments, Treatwell, and Timely. If you use a custom booking system or a regional platform, we can typically integrate via their API or webhooks. The booking agent reads real-time availability and writes confirmed appointments directly — no double-entry.",
  },
  {
    q: "Can the booking agent handle consultations for colour services?",
    a: "Yes. We configure a consultation workflow for colour services (especially for new clients or significant colour changes). The agent identifies when a consultation is required based on the service requested and client history, books the consultation, and sends the pre-consultation patch test instructions automatically — reducing the risk of adverse reactions and the liability that comes with skipping this step.",
  },
  {
    q: "What happens when the agent can't answer a question?",
    a: "It escalates gracefully. For anything outside its knowledge base or that requires your professional judgment, it says: 'That's a great question for our senior stylist — I'll get someone to reply directly. What's the best way to reach you?' You're notified immediately via Slack or SMS with the customer's question and contact. The agent never guesses on professional advice.",
  },
  {
    q: "Can I customise the tone and personality of the agent?",
    a: "Completely. During setup, we establish your salon's tone of voice — whether that's warm and chatty, professional and precise, or somewhere in between. We define your brand name as the agent's persona, the phrases it uses, the emojis it allows (or doesn't), and the escalation triggers. The agent sounds like your best receptionist, not a generic chatbot.",
  },
  {
    q: "How does the no-show reducer handle clients who never respond?",
    a: "If a client doesn't confirm by 24 hours before their appointment, the system flags it in your dashboard and sends you an alert. You can then choose to: hold the slot (waiting for them to show), release it and allow online booking, or manually call the client. The agent sends a final reminder 2 hours before regardless. For repeat no-showers, we can configure an automatic prepayment request on future bookings.",
  },
];

export default function HairSalonAIAgentsPage() {
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "Hair Salons", url: "https://datalatte.pro/for/hair-salons" },
      { name: "AI Agents for Hair Salons", url: "https://datalatte.pro/for/hair-salons/ai-agents" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agents · Hair Salons & Beauty Studios</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Stop losing bookings<br />
              <span className="text-coffee-300">to missed messages.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Five AI agents purpose-built for hair salons and beauty studios. Books appointments
              at midnight, cuts no-shows by 40%, fills your Google profile with 5-star reviews,
              and wins back clients who've gone quiet — all running while you're behind the chair.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Get your free salon AI audit →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                See all AI services
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "40%", label: "Of salon booking enquiries arrive outside business hours" },
              { value: "£4,400", label: "Revenue saved per year by cutting one no-show per week" },
              { value: "3–4×", label: "More Google reviews with automated post-visit requests" },
              { value: "15%", label: "Of lapsed clients rebook when you reach out within 8 weeks" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">5 AI Agents Built for Hair Salons</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Real LLM pipelines that understand natural language, integrate with your booking system, and handle real-world salon scenarios — not scripted chatbot menus.</p>

        <div className="space-y-16">
          {agents.map((agent, i) => (
            <div key={agent.name} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-coffee-100 text-coffee-700 p-2 rounded-lg">{agent.icon}</div>
                  <span className="text-xs font-semibold text-coffee-600 uppercase tracking-wide">Agent {i + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{agent.name}</h3>
                <p className="text-sm text-gray-500 mb-3"><span className="font-semibold">Triggered by:</span> {agent.trigger}</p>
                <p className="text-gray-700 mb-5">{agent.whatItDoes}</p>
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Integrates with</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.integrations.map((int) => (
                      <span key={int} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{int}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-green-800 mb-1">Typical impact</p>
                  <p className="text-sm text-green-700">{agent.impact}</p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Live conversation example
                </p>
                <div className="space-y-3">
                  {agent.conversation.map((msg, j) => (
                    <div key={j} className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "agent" ? "bg-gray-700 text-gray-100 rounded-tl-sm" : "bg-coffee-600 text-white rounded-tr-sm"
                      }`}>
                        {msg.role === "agent" && <p className="text-xs text-coffee-300 font-semibold mb-1">AI Agent</p>}
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Questions from salon owners</h2>
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
        headline="Book your free salon AI audit"
        sub="We'll review your current booking flow, identify where you're losing revenue to missed messages and no-shows, and propose the exact agents to fix it."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
