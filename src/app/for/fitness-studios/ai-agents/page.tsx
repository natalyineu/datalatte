import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Phone, Star, RefreshCw, UserCheck } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/for/fitness-studios/ai-agents";
const PAGE_TITLE = "AI Agents for Fitness Studios: Automate Class Bookings, Trials & Member Retention in 2026";
const PAGE_DESC =
  "5 AI agents built for gyms, fitness studios, and personal trainers: 24/7 class booking, free trial converter, no-show reminder sequence, Google review pipeline, and lapsed member reactivation. Works with Mindbody, WODIFY, Glofox, and Pike13.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const agents = [
  {
    icon: <Calendar size={22} />,
    name: "24/7 Class & Session Booking Agent",
    trigger: "Website chat, Instagram DM, Facebook Messenger, Google Business chat, SMS",
    whatItDoes: "Books classes, personal training sessions, and intro workshops around the clock — without you or your front desk picking up a message. The agent checks real-time class availability in your booking system, asks about fitness goals and experience level where relevant, creates the booking, and sends a confirmation. Handles reschedules, waitlist adds, and cancellation policy enforcement automatically.",
    conversation: [
      { role: "customer", text: "Hey, do you have any spin classes this week? I'm a total beginner" },
      { role: "agent", text: "Hi! Welcome 👋 Yes, we have spin classes every Tuesday and Thursday at 6:30pm, plus Saturday at 9am. All are beginner-friendly — our instructors adjust resistance guidance for new riders. Any of those work for you?" },
      { role: "customer", text: "Saturday 9am sounds good" },
      { role: "agent", text: "Great choice — Saturday morning spin is one of our most popular classes! I've got 3 spots left. Can I grab your name and email to get you booked in?" },
      { role: "customer", text: "Jake Thompson, jake@email.com" },
      { role: "agent", text: "You're booked, Jake! ✅ Saturday 9am Spin with Coach Priya. Arrive 10 mins early to set up your bike. You'll get a confirmation email and a reminder Friday evening. Any questions before then?" },
    ],
    integrations: ["Mindbody", "WODIFY", "Glofox", "Pike13", "TeamUp", "Zen Planner"],
    impact: "Fitness studios using 24/7 booking capture 35–50% more class sign-ups from evening and weekend enquiries that previously went unanswered.",
  },
  {
    icon: <UserCheck size={22} />,
    name: "Free Trial Converter Agent",
    trigger: "Trial class attended → automated follow-up begins",
    whatItDoes: "Turns one-time trial visitors into paying members. Triggered when a trial attendee is marked complete in your system, the agent sends a personalised follow-up within 2 hours: asks how the session went, addresses common objections (price, time, intensity), presents membership options tailored to their stated goals, and removes friction from signing up. Three-touch sequence — stops the moment they convert.",
    conversation: [
      { role: "agent", text: "Hi Jake! Hope you loved your first spin class this morning 🚴 How did you find it? Tough, fun, or a bit of both?" },
      { role: "customer", text: "Loved it! My legs are dead but in a good way haha. How much is membership?" },
      { role: "agent", text: "Ha! That's exactly how it should feel 😄 We have three options: Unlimited at £65/month (all classes, all times), 8-class pass at £49, or 4-class pass at £29. Given you're aiming to come weekly, Unlimited gives you the most flexibility. Want me to send the sign-up link?" },
      { role: "customer", text: "Yeah send it over" },
      { role: "agent", text: "Here you go: [Membership link]. First month is £55 if you sign up within 48 hours of your trial — just use code WELCOME10 at checkout. Let me know if you have any questions, Jake!" },
    ],
    integrations: ["Mindbody", "Glofox", "WODIFY", "Stripe", "GoCardless"],
    impact: "Studios with an automated trial follow-up convert 25–40% of trial attendees into members — versus 8–12% with no follow-up.",
  },
  {
    icon: <Phone size={22} />,
    name: "No-Show Reducer — Class Reminder Sequence",
    trigger: "Class booking confirmed → sequence begins",
    whatItDoes: "Runs a multi-touch reminder sequence for every confirmed booking: 48 hours before with class details and what to bring, 2 hours before as a final push notification. For capped classes, unconfirmed spots after 24 hours are flagged so you can open them to the waitlist. Confirmed attendees are automatically moved off the waitlist and notified. Includes cancellation links to free up slots efficiently.",
    conversation: [
      { role: "agent", text: "Hi Jake! Reminder: your Spin class with Coach Priya is tomorrow at 9am at Iron & Flow Studio. Bring water, a towel, and indoor trainers. Reply CANCEL if your plans change — we have a waitlist ready 🙏" },
      { role: "customer", text: "Actually I need to cancel, sorry!" },
      { role: "agent", text: "No problem — spot released and the first person on the waitlist has been notified. Hope to see you in class next week! Want me to book you into next Saturday instead?" },
      { role: "customer", text: "Yes please" },
      { role: "agent", text: "Done! You're in for Saturday 9am Spin next week. Reminder will come Thursday evening. See you there 💪" },
    ],
    integrations: ["Twilio SMS", "Mindbody", "WODIFY", "Glofox", "WhatsApp Business"],
    impact: "Studios using reminder sequences see 25–40% fewer no-shows. Freed waitlist spots generate an additional 8–15% class revenue each month.",
  },
  {
    icon: <Star size={22} />,
    name: "Post-Class Google Review Pipeline",
    trigger: "Attendance marked in booking system → 2 hours later",
    whatItDoes: "After every class is marked attended, the agent sends a personalised thank-you referencing the specific class and instructor. Members who rate 5 stars are guided to Google with a one-tap link. Members who express any frustration are privately routed — their feedback is captured and sent to you immediately so you can address it before it becomes a public 1-star review.",
    conversation: [
      { role: "agent", text: "Hi Jake! Hope you're recovering well after spin with Coach Priya 🔥 How was your session today? Quick rating: ⭐⭐⭐⭐⭐" },
      { role: "customer", text: "5 stars! Priya is amazing, best instructor I've had" },
      { role: "agent", text: "That means so much — she'll love hearing that! If you have 30 seconds, a Google review would really help other fitness seekers find us: [Google link]. It makes a huge difference 🙏" },
      { role: "customer", text: "Done! Mentioned Priya by name" },
      { role: "agent", text: "Thank you Jake! See you in class 💪" },
    ],
    integrations: ["Google Business Profile API", "Mindbody", "Glofox", "WODIFY", "Teamup"],
    impact: "Studios using automated review pipelines average 4–5× more Google reviews per month. Going from 23 to 100+ reviews typically lifts local pack ranking within 90 days.",
  },
  {
    icon: <RefreshCw size={22} />,
    name: "Lapsed Member Reactivation Agent",
    trigger: "Member hasn't booked a class in 21+ days (from booking system data)",
    whatItDoes: "Identifies members who've stopped showing up before their natural churn point and sends a personalised, non-pushy win-back sequence. References their last class and instructor if available. Offers a relevant reason to return: a new class on the schedule, a seasonal challenge, or a limited return offer. Three messages over 10 days — stops the moment they rebook.",
    conversation: [
      { role: "agent", text: "Hi Jake! We noticed it's been a few weeks since your last spin session — we hope everything's okay 💛 We've just added a new HIIT Cycling class on Wednesday evenings that a lot of our members are raving about. Fancy giving it a try? Book here: [link]" },
      { role: "customer", text: "Oh I've just been really busy. Is Priya still teaching?" },
      { role: "agent", text: "She absolutely is! Her Tuesday 6:30pm and Saturday 9am sessions are both running. She's also added a new Thursday HIIT class if you want something more intense. Want me to grab you a spot?" },
      { role: "customer", text: "Book me in Saturday" },
      { role: "agent", text: "Done! Saturday 9am spin with Coach Priya. See you then 🚴" },
    ],
    integrations: ["Mindbody", "WODIFY", "Glofox", "Mailchimp", "Klaviyo", "GoHighLevel"],
    impact: "10–18% of lapsed members rebook within the reactivation window. A studio with 200 active members typically has 40–60 lapsed at any time — recovering 15% is 6–9 extra bookings per month.",
  },
];

const faqs = [
  {
    q: "Which fitness booking systems does this integrate with?",
    a: "We integrate with all major fitness studio platforms: Mindbody (including the Mindbody Business API), WODIFY (used widely in CrossFit boxes), Glofox (popular in boutique gyms), Pike13, TeamUp, and Zen Planner. The booking agent reads real-time class capacity and availability, creates bookings directly in your platform, and handles waitlist management — no double-entry or manual sync required.",
  },
  {
    q: "Can the booking agent handle different membership types (drop-in vs package vs unlimited)?",
    a: "Yes. We configure the agent to understand your membership structure: drop-in rates, class pass balances, unlimited memberships, and intro-offer restrictions. When a member books, the agent checks their current pass balance or membership status and handles the correct billing logic. For non-members, it presents the most appropriate membership option for their stated goals and booking frequency.",
  },
  {
    q: "How does the trial converter handle price objections?",
    a: "We configure the agent with your most common objections and the responses that actually convert. Price objection: agent presents the per-class cost of the right membership tier, compares it to a single PT session, and emphasises the community. Time objection: agent highlights early morning, lunchtime, and evening options. Intimidation objection: agent references the beginner-friendly environment and beginner-specific classes. The sequence is personalised based on what the trial attendee said about their goals during booking.",
  },
  {
    q: "Can I set different reactivation triggers for different member types?",
    a: "Yes. Lapse windows are fully configurable. For unlimited members, we might trigger at 14 days inactive (they're paying and not using it — highest urgency). For class pass holders, at 21 days or when their pass is about to expire. For annual members, at 30 days. Each cohort gets a different message tone: for paying members it's 'we've missed you,' for lapsed passholders it's a reminder about their remaining credits.",
  },
  {
    q: "What does this cost to run for a typical boutique studio?",
    a: "Build: $1,200–$2,800 depending on number of agents and booking system complexity. Monthly running costs (API calls, SMS, hosting): $60–$140/month. A single converted trial attendee on a £65/month membership = £780/year — that covers the build cost before the end of the first year. The reactivation and review agents have similarly asymmetric returns.",
  },
];

export default function FitnessStudioAIAgentsPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "Fitness Studios", url: "https://datalatte.pro/for/fitness-studios" },
      { name: "AI Agents for Fitness Studios", url: "https://datalatte.pro/for/fitness-studios/ai-agents" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agents · Fitness Studios & Gyms</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Fill every class.<br />
              <span className="text-coffee-300">Convert every trial.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Five AI agents purpose-built for fitness studios, gyms, and personal trainers.
              Books classes at midnight, turns trial visitors into paying members, reduces
              no-shows, fills your Google profile with 5-star reviews, and wins back members
              who've gone quiet — all running while you're on the floor coaching.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Get your free studio AI audit →</Link>
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
              { value: "35–50%", label: "More class sign-ups captured with 24/7 booking" },
              { value: "8–12%", label: "Trial-to-member rate without follow-up (vs 40% with it)" },
              { value: "25–40%", label: "Fewer no-shows with automated reminder sequences" },
              { value: "21 days", label: "The lapse window — act before members disappear for good" },
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
        <h2 className="section-title mb-3">5 AI Agents Built for Fitness Studios</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Real LLM pipelines that understand fitness-specific language, integrate with your class management system, and handle the full member lifecycle — from first enquiry to long-term retention.</p>

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
          <h2 className="section-title mb-10">Questions from studio owners</h2>
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
        headline="Book your free fitness studio AI audit"
        sub="We'll map your current booking flow, trial conversion rate, and member churn — then propose exactly which agents will have the biggest revenue impact for your studio."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
