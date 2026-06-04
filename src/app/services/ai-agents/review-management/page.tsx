import type { Metadata } from "next";
import Link from "next/link";
import { Star, TrendingUp, Shield, CheckCircle2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/services/ai-agents/review-management";
const PAGE_TITLE = "AI Review Management Agent: Automate Google Reviews for Local Businesses in 2026";
const PAGE_DESC =
  "Automatically collect 5-star Google reviews after every appointment. AI review management sends personalised post-visit requests, routes negative feedback privately, and builds your online reputation on autopilot. Works with Square, Mindbody, Fresha, and all major booking systems.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const pipeline = [
  {
    step: "1",
    title: "Appointment marked complete",
    body: "Your booking system marks the appointment as attended. This fires the trigger — no manual action required.",
  },
  {
    step: "2",
    title: "Wait 1–3 hours",
    body: "Configurable delay — long enough for the customer to be home and reflecting on the experience, but not so long they've moved on.",
  },
  {
    step: "3",
    title: "Personalised message sent",
    body: "SMS or WhatsApp referencing the customer by name, the specific service, and the staff member. Not a generic 'please leave us a review.'",
  },
  {
    step: "4",
    title: "Customer rates the experience",
    body: "A simple 1–5 star tap or numeric reply. Two paths open depending on their answer.",
  },
  {
    step: "5",
    title: "5 stars → guided to Google",
    body: "One-tap deep link to your Google Business Profile review form. Frictionless. Most complete it in 30–60 seconds.",
  },
  {
    step: "6",
    title: "Under 5 stars → private route",
    body: "Customer is asked: 'What could we have done better?' Their feedback is sent directly to you. No public platform. You respond, recover the relationship, and address the root cause.",
  },
];

const conversations = [
  {
    label: "Hair salon — 5-star flow",
    messages: [
      { role: "agent", text: "Hi Emma! Hope you're loving your new colour from today's appointment with Zara 💛 How was your experience? (Reply 1–5 or tap a star)" },
      { role: "customer", text: "5! She was absolutely amazing as always" },
      { role: "agent", text: "So wonderful to hear! 🌟 If you have 30 seconds, a Google review would mean the world to us and helps other clients find Zara. Tap here: [Google link]" },
      { role: "customer", text: "Done! Mentioned the balayage specifically" },
      { role: "agent", text: "Thank you so much Emma — you're the best! See you next time 💛" },
    ],
  },
  {
    label: "Coffee shop — negative recovery flow",
    messages: [
      { role: "agent", text: "Thanks for visiting Bloom Coffee today! ☕ Quick question — how was your experience? (1–5)" },
      { role: "customer", text: "3 — coffee was great but waited 20 mins for my food order" },
      { role: "agent", text: "Thank you for being honest — that's really helpful to know. A 20-minute wait isn't acceptable and we're sorry about that. Would you be open to a complimentary pastry on your next visit? I'll pass this to the manager directly." },
      { role: "customer", text: "That's really kind, thanks" },
      { role: "agent", text: "Done — your next visit is on us. We'll make sure to get it right. Hope to see you again soon ☕" },
    ],
  },
];

const impact = [
  { metric: "3–5×", label: "More Google reviews per month vs asking manually" },
  { metric: "0.3–0.5★", label: "Average rating improvement within 90 days" },
  { metric: "94%", label: "Of customers won't leave a review unless asked" },
  { metric: "15–25%", label: "Increase in new client bookings after hitting 100+ reviews" },
];

const triggers = [
  { system: "Square POS / Square Appointments", detail: "Customer record + visit trigger from Square's API" },
  { system: "Mindbody", detail: "Attendance marked in class or appointment schedule" },
  { system: "Fresha / Vagaro / Booksy", detail: "Appointment status updated to 'completed'" },
  { system: "Gingr / 123Pet", detail: "Groom marked complete in pet management system" },
  { system: "Loyalzoo / Clover Loyalty", detail: "Transaction recorded in loyalty platform" },
  { system: "Toast / Clover POS", detail: "Receipt sent → review request 2 hours later" },
  { system: "Custom webhook", detail: "Any system that can fire a webhook on completion" },
];

const faqs = [
  {
    q: "Does this violate Google's review policies?",
    a: "No — Google's policy prohibits incentivising reviews or review-gating (only asking satisfied customers to review publicly while hiding negative feedback). Our pipeline doesn't gate publicly — every customer who responds is offered a path, and only the 5-star path leads to Google. Negative feedback is privately captured but not blocked from going public — if a customer independently decides to post a Google review after their private feedback, that's their right. We capture negative feedback first to give you a recovery window, which is standard practice across the industry.",
  },
  {
    q: "What if a customer who gave 3 stars later posts a 1-star Google review?",
    a: "The private recovery path is your best defence here. When a customer feels heard and receives a genuine response (apology, complimentary offer, explanation), most choose not to post publicly. Our typical outcome data shows that 70–80% of sub-5-star responders who receive a recovery response do not post a public negative review. You get to fix the relationship before it becomes a permanent public record.",
  },
  {
    q: "Can the agent respond to existing Google reviews on our behalf?",
    a: "Yes — we can add a review response module that drafts responses to new Google reviews (positive and negative) and either sends them automatically or presents them for your approval. Responding to reviews is a strong local SEO signal and demonstrates that you're an active, engaged business. We write responses that sound human and brand-consistent, not templated.",
  },
  {
    q: "How is the message personalised?",
    a: "We pull data from your booking or POS system at send time: customer first name, the specific service or item they purchased, and the staff member who served them. 'Hi Emma, hope Zara's balayage is growing on you!' converts at a significantly higher rate than 'Hi, how was your recent visit?' The specificity signals that it's a real message, not a mass blast.",
  },
  {
    q: "How quickly does this start generating results?",
    a: "Within the first 30 days, most businesses see a meaningful increase in review volume — often doubling or tripling the monthly rate. The rating improvement follows within 60–90 days as the higher volume of positive reviews begins to statistically move the average. Local search ranking improvement (more visibility in Google Maps) typically shows up within 90–120 days for competitive niches.",
  },
];

export default function AIReviewManagementPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "AI Agents", url: "https://datalatte.pro/services/ai-agents" },
      { name: "AI Review Management", url: "https://datalatte.pro/services/ai-agents/review-management" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agent Skill · Google Review Management</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Build your reputation<br />
              <span className="text-coffee-300">automatically.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              94% of customers won't leave a review unless you ask. An AI review management
              agent asks every single one — at the right moment, with the right message,
              personalised to their specific visit. 5-star reviews go to Google.
              Negative feedback gets privately routed so you can fix it first.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Start collecting reviews on autopilot →</Link>
              <Link href="/services/ai-agents" className="px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
                All AI agent skills
              </Link>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Impact stats */}
      <div className="bg-coffee-50 border-b border-coffee-100 py-8">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {impact.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-coffee-700">{s.metric}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </div>

      {/* Pipeline */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">The 6-step review pipeline</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Fully automated from appointment completion to published Google review — with a private recovery path for any negative feedback.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipeline.map((p) => (
            <div key={p.step} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <span className="text-3xl font-bold text-coffee-200">{p.step}</span>
              <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Conversation demos */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-3">Both paths in action</h2>
          <p className="text-gray-600 max-w-2xl mb-12">The 5-star path converts happy customers into published reviews. The recovery path turns a dissatisfied customer into a loyal one.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {conversations.map((conv) => (
              <div key={conv.label}>
                <p className="text-sm font-semibold text-gray-700 mb-3">{conv.label}</p>
                <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                    Live conversation example
                  </p>
                  <div className="space-y-3">
                    {conv.messages.map((msg, j) => (
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
      </section>

      {/* Trigger integrations */}
      <SectionWrapper className="py-20">
        <h2 className="section-title mb-3">Works with your point-of-sale and booking system</h2>
        <p className="text-gray-600 max-w-2xl mb-10">The review pipeline is triggered by a real business event — not a time-based blast. This makes the timing feel natural and improves response rates.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {triggers.map((t) => (
            <div key={t.system} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
              <CheckCircle2 size={16} className="text-coffee-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.system}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <SectionWrapper>
          <h2 className="section-title mb-10">Review management questions</h2>
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
        headline="Start collecting Google reviews automatically"
        sub="Free audit — we'll look at your current review count, review velocity, and competitor profiles, then show you exactly what a review pipeline would mean for your local search ranking."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
