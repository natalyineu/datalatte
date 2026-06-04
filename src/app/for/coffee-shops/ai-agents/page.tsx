import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, MessageSquare, Phone, Star, RefreshCw, Calendar } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/for/coffee-shops/ai-agents";
const PAGE_TITLE = "AI Agents for Coffee Shops: Automate Bookings, Reviews & Customer Replies in 2026";
const PAGE_DESC =
  "The 5 AI agents every coffee shop needs: event booking bot, Google reviews manager, missed call text-back, FAQ chat, and lapsed customer reactivation. Real conversation flows, Square/Toast integrations, and pricing.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const agents = [
  {
    icon: <Calendar size={22} />,
    name: "Event & Private Hire Booking Agent",
    trigger: "Instagram DM, Facebook message, website chat, or email",
    whatItDoes: "Handles enquiries for private events, birthday parties, corporate breakfasts, and coffee-tasting experiences. Asks the right qualifying questions, checks your availability calendar, and confirms bookings without you picking up the phone.",
    conversation: [
      { role: "customer", text: "Hi! Do you do private events? We're looking for a venue for a team breakfast, about 15 people, sometime next month." },
      { role: "agent", text: "Hi! We'd love to host your team breakfast 🎉 We can seat up to 20 for private events. A few quick questions — do you have a preferred date or are you flexible on timing? And are there any dietary requirements I should note?" },
      { role: "customer", text: "Flexible on date, probably a Thursday. Two people are vegan." },
      { role: "agent", text: "Perfect — Thursdays work well. We have availability on the 8th, 15th, and 22nd. Our plant-based options are extensive so your vegan guests will be well looked after. Shall I pencil in the 15th and send over our private event menu and pricing?" },
      { role: "customer", text: "Yes please!" },
      { role: "agent", text: "Done! I've sent details to your email. A £50 deposit secures the date — here's the booking link: [link]. See you on the 15th! ☕" },
    ],
    integrations: ["Calendly", "Acuity Scheduling", "Square Appointments", "Google Calendar"],
    impact: "40–60% of event enquiries previously went unanswered after hours. This agent captures them all.",
  },
  {
    icon: <MessageSquare size={22} />,
    name: "FAQ & Menu Chat Agent",
    trigger: "Website chat widget, Google Business Profile chat, WhatsApp",
    whatItDoes: "Answers the questions that eat your time: hours, WiFi password, allergens, parking, whether you take card-only, if you're dog-friendly. Knows your full menu and can suggest options based on dietary needs. Escalates to you for anything unusual.",
    conversation: [
      { role: "customer", text: "Are you dog friendly?" },
      { role: "agent", text: "Yes! Dogs are very welcome on our outdoor terrace and we have a water bowl ready for them. The indoor seating area is for humans only (health rules 😄). Anything else you'd like to know?" },
      { role: "customer", text: "Do you have oat milk? And is there parking nearby?" },
      { role: "agent", text: "We use Oatly barista oat milk as standard — just ask for it when ordering. For parking, the closest is Market Street car park (2 min walk, £1.50/hr) or free on Church Lane after 6pm. See you soon!" },
    ],
    integrations: ["Your website (widget)", "Google Business Profile", "WhatsApp Business API"],
    impact: "Reduces incoming phone calls by 35–50%. Captures after-hours enquiries that previously bounced to a competitor.",
  },
  {
    icon: <Phone size={22} />,
    name: "Missed Call Text-Back Agent",
    trigger: "Missed inbound phone call (via Twilio call tracking)",
    whatItDoes: "When a call goes unanswered — during busy morning rush, staff training, or when you're short-handed — the agent sends an SMS within 90 seconds. It introduces the café, offers to answer questions or take a reservation, and keeps the conversation going until the customer is served.",
    conversation: [
      { role: "agent", text: "Hi! You just called Bloom Coffee — sorry we missed you! I'm the café's assistant. Can I help with a table reservation, a catering enquiry, or answer a question? 😊" },
      { role: "customer", text: "Just wanted to know if you're open Sunday mornings" },
      { role: "agent", text: "We're open Sunday 8am–2pm — great timing for brunch! Would you like me to reserve a table? We get busy from 10am onwards." },
      { role: "customer", text: "Yeah, table for 3 around 9:30?" },
      { role: "agent", text: "Perfect — I've got that in for Sunday at 9:30 for 3. You'll get a confirmation text shortly. See you then! ☕" },
    ],
    integrations: ["Twilio (call tracking)", "Square Appointments", "Acuity", "Custom calendar"],
    impact: "Captures 60–80% of missed calls. Average coffee shop loses 8–12 bookable enquiries per week to unanswered calls.",
  },
  {
    icon: <Star size={22} />,
    name: "Google Reviews Pipeline",
    trigger: "Post-visit trigger via Square/loyalty app receipt email, or SMS 2 hours after visit",
    whatItDoes: "Sends a friendly review request to customers after their visit. For 5-star reviews, guides them to your Google page and thanks them. For negative feedback, privately captures their complaint and routes it to you — keeping it off public platforms and giving you a chance to recover the relationship.",
    conversation: [
      { role: "agent", text: "Thanks for visiting Bloom Coffee today! 💛 How was your experience? (tap to rate) ⭐⭐⭐⭐⭐" },
      { role: "customer", text: "5 stars! Loved the flat white" },
      { role: "agent", text: "That means so much to us — thank you! Would you mind leaving us a quick Google review? It helps more people discover us 🙏 [Google Review Link]" },
      { role: "customer", text: "Done!" },
      { role: "agent", text: "You're amazing. See you next time ☕" },
    ],
    integrations: ["Google Business Profile API", "Square POS", "Clover", "Toast", "Loyalzoo"],
    impact: "Businesses using automated review pipelines average 3–4x more reviews per month and a 0.3–0.5 star rating improvement within 90 days.",
  },
  {
    icon: <RefreshCw size={22} />,
    name: "Lapsed Customer Reactivation Agent",
    trigger: "Customer hasn't visited in 45+ days (detected via Square/loyalty data)",
    whatItDoes: "Sends a personalised win-back message to customers who've gone quiet. References their last order if available, offers a small incentive (loyalty points, a free treat on their next visit), and re-invites them back. Three-touch sequence over 10 days — stops automatically when they return.",
    conversation: [
      { role: "agent", text: "Hi Sarah! It's been a while since your last flat white at Bloom ☕ We miss you! As a thank-you for being a loyal customer, here's a free pastry on your next visit — just show this message: WELCOME15. Valid for 2 weeks." },
      { role: "customer", text: "Oh nice! I've just been working from home more. I'll pop in this week" },
      { role: "agent", text: "Brilliant — we'll have your flat white ready! The pastry coupon is saved here whenever you're ready 😊" },
    ],
    integrations: ["Square Loyalty", "Loyalzoo", "Mailchimp", "Klaviyo", "GoHighLevel"],
    impact: "15–25% reactivation rate on lapsed customers. Far cheaper than acquiring new ones.",
  },
];

const faqs = [
  {
    q: "Can these agents integrate with Square POS?",
    a: "Yes — Square is the most common POS we integrate with for coffee shops. The review pipeline connects to Square's customer directory to identify post-visit trigger moments. The booking agent writes confirmed reservations into Square Appointments. The reactivation agent reads purchase history from Square to identify lapsed customers and personalise messages ('your last visit was a flat white and a blueberry muffin').",
  },
  {
    q: "What if a customer asks something the agent doesn't know?",
    a: "Every agent has a defined scope and an escalation path. If a customer asks about something outside the agent's knowledge base (a specific allergy not in your menu, a complex corporate catering request), it responds: 'Great question — let me get the owner to follow up directly. What's the best way to reach you?' It captures their contact and pings you immediately via Slack or SMS. The agent never makes up an answer.",
  },
  {
    q: "Will this work for a coffee cart or market stall (no fixed premises)?",
    a: "Yes, with some adjustments. The FAQ agent focuses on location (which market you're at, schedule, upcoming events) rather than parking and seating. The event booking agent becomes a catering/pop-up enquiry handler. The missed call text-back and review pipeline work identically regardless of premises type.",
  },
  {
    q: "How long does it take to set up?",
    a: "For a standard 3-agent setup (FAQ chat + missed call text-back + review pipeline), we build and test in 1–2 weeks. The event booking agent adds another week if calendar integration is required. You provide a 30-minute onboarding call covering your menu, hours, policies, and calendar system — we handle everything else.",
  },
  {
    q: "What does it actually cost to run?",
    a: "Build: $800–$2,500 depending on how many agents and integrations. Monthly running costs (API, SMS, hosting): $50–$120/month. A single recovered event booking or 20 Google reviews generated typically cover the monthly cost many times over.",
  },
];

export default function CoffeeShopAIAgentsPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "Coffee Shops", url: "https://datalatte.pro/for/coffee-shops" },
      { name: "AI Agents for Coffee Shops", url: "https://datalatte.pro/for/coffee-shops/ai-agents" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-coffee-900 via-coffee-800 to-gray-900 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agents · Coffee Shops & Cafés</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your café runs 24/7.<br />
              <span className="text-coffee-300">Your AI agents should too.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Five production-ready AI agents built specifically for coffee shops and cafés.
              Handle event bookings, recover missed calls, collect Google reviews,
              answer FAQs at 2am, and win back customers who've drifted — all without adding a single staff hour.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Get a free café AI audit →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                See all agent services
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Stats bar */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "8–12", label: "Bookable calls a café misses per week on average" },
              { value: "94%", label: "Of customers won't leave a review unless asked" },
              { value: "45 days", label: "Before a lapsed customer is gone for good" },
              { value: "$50–120", label: "Monthly running cost for 3 agents combined" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* Agents */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">The 5 AI Agents Built for Coffee Shops</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Each agent is a real LLM pipeline — not a rule-based chatbot. It understands natural language, takes action, and handles edge cases the same way a trained staff member would.</p>

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

              {/* Conversation demo */}
              <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Live conversation example
                </p>
                <div className="space-y-3">
                  {agent.conversation.map((msg, j) => (
                    <div key={j} className={`flex ${msg.role === "agent" ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "agent"
                          ? "bg-gray-700 text-gray-100 rounded-tl-sm"
                          : "bg-coffee-600 text-white rounded-tr-sm"
                      }`}>
                        {msg.role === "agent" && (
                          <p className="text-xs text-coffee-300 font-semibold mb-1">AI Agent</p>
                        )}
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

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Questions from café owners</h2>
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
        headline="Ready to put your café on autopilot?"
        sub="Free 30-minute audit. We'll map exactly which agents will have the biggest impact for your specific café setup — no generic advice."
        ctaLabel="Book your free café AI audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
