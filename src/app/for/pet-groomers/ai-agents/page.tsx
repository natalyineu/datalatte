import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Phone, Star, RefreshCw, MessageSquare } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/for/pet-groomers/ai-agents";
const PAGE_TITLE = "AI Agents for Pet Groomers: Automate Bookings, No-Shows & Google Reviews in 2026";
const PAGE_DESC =
  "5 AI agents built for pet grooming salons and mobile groomers: 24/7 appointment booking with breed-specific intake, no-show reminders, Google review pipeline, breed FAQ bot, and lapsed client reactivation. Works with 123Pet, PetExec, Pawfinity, and Gingr.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
};

const agents = [
  {
    icon: <Calendar size={22} />,
    name: "24/7 Appointment Booking Agent (with Pet Intake)",
    trigger: "Website chat, Instagram DM, Facebook Messenger, Google Business chat, SMS",
    whatItDoes: "Books grooming appointments around the clock, capturing the 40%+ of enquiries that arrive outside business hours. Unlike a generic booking widget, this agent conducts a proper pet intake conversation: breed, size, coat condition, temperament notes, and service preferences. All intake data flows directly into your grooming software so your groomer is fully briefed before the dog arrives — no phone tag, no missing information.",
    conversation: [
      { role: "customer", text: "Hi! Can I book a groom for my dog? She's a golden retriever" },
      { role: "agent", text: "Hi! We'd love to look after her 🐾 For a golden retriever, we'd recommend our full groom package (bath, dry, brush-out, trim, nail clip, ear clean). A few quick questions — how old is she and roughly what's her coat condition like at the moment?" },
      { role: "customer", text: "She's 3, coat is a bit matted on the legs" },
      { role: "agent", text: "Got it — we'll allow extra time for the matting and use our de-matting treatment to keep it as gentle as possible. Any nervousness around grooming or specific handling notes we should know?" },
      { role: "customer", text: "She's fine, just doesn't love the dryer" },
      { role: "agent", text: "Noted — we'll use the calm drying room for her. We have availability this Thursday at 10am or Saturday at 1pm. Full groom for a golden is £65. Which works better?" },
      { role: "customer", text: "Saturday 1pm please. Name is Molly, my name is Sarah" },
      { role: "agent", text: "Booked! ✅ Molly — Saturday 1pm full groom. Sarah, you'll get a confirmation and a reminder Friday morning. We'll note the dryer sensitivity for our groomer. See you Saturday!" },
    ],
    integrations: ["123Pet", "PetExec", "Pawfinity", "Gingr", "MoeGo", "Square Appointments"],
    impact: "Groomers using 24/7 booking with pet intake capture 40–55% more bookings, plus reduce new-client phone intake time by 15–20 minutes per appointment.",
  },
  {
    icon: <Phone size={22} />,
    name: "No-Show Reducer — Appointment Reminder Sequence",
    trigger: "Appointment booked → automated sequence begins",
    whatItDoes: "Runs a personalised reminder sequence for every confirmed appointment — using the pet's name, not just the owner's: SMS 48 hours before asking to confirm, SMS 3 hours before as a final reminder. Unconfirmed appointments after 24 hours are flagged so you can decide whether to release the slot. For repeat no-showers, the system can trigger an automatic deposit request on their next booking.",
    conversation: [
      { role: "agent", text: "Hi Sarah! Just a reminder that Molly's full groom is booked for tomorrow, Saturday at 1pm at Pawsome Grooming Studio. Please reply YES to confirm or CANCEL if you need to reschedule. We have a waitlist so it helps to know asap 🐾" },
      { role: "customer", text: "YES — looking forward to it!" },
      { role: "agent", text: "Wonderful! We'll have everything ready for Molly at 1pm. She'll come out looking fabulous 🌟 See you both tomorrow!" },
    ],
    integrations: ["Twilio SMS", "123Pet", "PetExec", "Gingr", "WhatsApp Business"],
    impact: "Groomers using reminder sequences see 30–45% fewer no-shows. At an average service value of £55–75, one recovered no-show per week = £3,000–4,000/year.",
  },
  {
    icon: <Star size={22} />,
    name: "Post-Groom Google Review Pipeline",
    trigger: "Appointment marked complete in grooming software",
    whatItDoes: "1–2 hours after a groom is marked complete, the agent sends a personalised message referencing the pet by name and asking how the groom went. Owners who rate 5 stars are guided directly to your Google Business Profile. Owners who express any disappointment are privately routed — their feedback is captured and sent directly to you, keeping it off public review platforms and giving you a chance to make it right.",
    conversation: [
      { role: "agent", text: "Hi Sarah! Hope Molly is feeling gorgeous after her groom today 🐾 How did she get on? We'd love to know!" },
      { role: "customer", text: "She looks incredible! The groomer did such a brilliant job with her matting" },
      { role: "agent", text: "So glad to hear it — she looked so relaxed when she left! If you have a moment, a Google review would really help other pet parents find us. Takes 30 seconds: [Google link] 🙏" },
      { role: "customer", text: "Done! Gave 5 stars and mentioned how gentle they were with her" },
      { role: "agent", text: "Thank you so much Sarah! See you and Molly next time 🐾" },
    ],
    integrations: ["Google Business Profile API", "123Pet", "Gingr", "MoeGo", "Square"],
    impact: "3–5× more Google reviews per month. Pet groomers with 50+ reviews rank dramatically higher in 'dog groomer near me' searches than those with fewer than 20.",
  },
  {
    icon: <MessageSquare size={22} />,
    name: "Breed & Service FAQ Agent",
    trigger: "Website chat, Instagram DM, WhatsApp, Google Business chat",
    whatItDoes: "Answers the breed-specific and service questions that fill your inbox: how often a cockapoo should be groomed, whether you handle aggressive dogs, if you use cage-free drying, what's included in a puppy's first groom, whether you do hand-stripping for terriers, your de-shedding treatment for huskies. Knows your full service menu, breed handling protocols, and can give price estimates. Escalates complex cases to you immediately.",
    conversation: [
      { role: "customer", text: "Do you groom huskies? I've been told they're hard to handle" },
      { role: "agent", text: "We do! Huskies are one of our specialties — we have a dedicated de-shedding treatment that removes the undercoat without damaging the top coat. It takes about 2–2.5 hours and typically reduces shedding dramatically for 6–8 weeks. Is yours particularly anxious or generally relaxed?" },
      { role: "customer", text: "Pretty chill. How much?" },
      { role: "agent", text: "For a standard husky, our full groom with de-shedding treatment is £80–£95 depending on coat condition. We'd recommend booking a de-shed every 6–8 weeks during shedding season (spring/autumn). Would you like me to book an appointment?" },
    ],
    integrations: ["Website (embed)", "Instagram DM API", "WhatsApp Business", "Google Business Profile"],
    impact: "Reduces incoming phone and DM enquiry handling time by 3–6 hours per week for the average grooming salon.",
  },
  {
    icon: <RefreshCw size={22} />,
    name: "Lapsed Client Reactivation Agent",
    trigger: "Client hasn't rebooked within their pet's normal grooming window (8–12 weeks)",
    whatItDoes: "Identifies clients who haven't rebooked after their pet's natural rebook window and sends a personalised win-back sequence — using the pet's name for a warmth that generic reminders can't match. References the last groom, mentions the pet's coat condition at that visit, and offers a gentle nudge to rebook. Three messages over 12 days — stops the moment they rebook.",
    conversation: [
      { role: "agent", text: "Hi Sarah! It's been about 10 weeks since Molly's last groom 🐾 Golden retrievers' coats tend to get matted quite quickly at this time of year — we'd love to get her back in before it gets too tricky to manage. Book here: [link]" },
      { role: "customer", text: "Oh yes I've been meaning to call! Is the same groomer available?" },
      { role: "agent", text: "Yes — Jess is still with us and she remembers Molly! She has Thursday morning or Saturday afternoon this week. Which works better?" },
      { role: "customer", text: "Saturday please" },
      { role: "agent", text: "Perfect — I'll grab Saturday afternoon for Molly and Jess. Confirmation on its way to you now 🐾" },
    ],
    integrations: ["123Pet", "PetExec", "Gingr", "MoeGo", "Mailchimp", "Klaviyo"],
    impact: "15–25% of lapsed clients rebook within the reactivation window. A groomer with 150 active clients typically has 30–50 lapsed at any given time — recovering 20% is 6–10 extra bookings per month.",
  },
];

const faqs = [
  {
    q: "Which pet grooming software does this integrate with?",
    a: "We integrate with all major pet grooming platforms: 123Pet (most widely used in the US), PetExec, Pawfinity, Gingr, and MoeGo. The booking agent reads real-time availability and writes confirmed appointments — including all pet intake notes — directly into your software. Your groomer sees the breed, coat condition, temperament notes, and special handling instructions before the dog even arrives.",
  },
  {
    q: "Can the booking agent handle different service types and dog sizes?",
    a: "Yes. We configure the agent with your complete service menu: full groom, bath and brush, puppy first groom, de-shedding, hand-stripping, nail clip-only, and any add-ons. Pricing is set by breed group or size (small/medium/large/extra-large) and the agent quotes accurately based on what the owner tells it. For uncommon breeds or coat conditions that need a manual quote, it flags to you rather than guessing.",
  },
  {
    q: "How does the agent handle aggressive or anxious dogs?",
    a: "We configure a safety escalation protocol. If an owner mentions aggression, extreme anxiety, or a bite history during booking, the agent flags this immediately and routes the booking to you for manual review. It doesn't decline the booking — it tells the owner a team member will call within a few hours to discuss their dog's needs. This gives you the chance to assess the dog properly before confirming.",
  },
  {
    q: "Can I set breed-specific reactivation windows?",
    a: "Yes. You set the rebook window per breed or coat type in the system configuration. A poodle or bichon on a 6-week schedule triggers the reactivation agent at 8 weeks. A Labrador on an 8-week bath-and-brush triggers at 12 weeks. This prevents messaging clients who are actually on schedule while catching those who are genuinely lapsed — reducing unsubscribes and increasing rebook rates.",
  },
  {
    q: "What does it cost to set up and run?",
    a: "Build: $900–$2,200 depending on the number of agents and software integrations. Monthly running costs (API calls, SMS, hosting): $50–$110/month. For a groomer doing 20 appointments per week at an average of £65 per groom, recovering even one no-show per week pays for the full monthly cost. The review pipeline and reactivation agent typically deliver 5–10× their monthly cost in new and recovered revenue.",
  },
];

export default function PetGroomerAIAgentsPage() {
  const schema = [
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "https://datalatte.pro" },
      { name: "Pet Groomers", url: "https://datalatte.pro/for/pet-groomers" },
      { name: "AI Agents for Pet Groomers", url: "https://datalatte.pro/for/pet-groomers/ai-agents" },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="bg-gradient-to-br from-gray-900 via-coffee-900 to-coffee-800 text-white py-20">
        <SectionWrapper>
          <div className="max-w-3xl">
            <p className="section-label text-coffee-300 mb-4">AI Agents · Pet Groomers & Grooming Salons</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              More bookings.<br />
              <span className="text-coffee-300">Less phone tag.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Five AI agents purpose-built for pet grooming salons and mobile groomers.
              Books appointments 24/7 with full pet intake, reduces no-shows, builds your
              Google review count, and wins back clients whose pets are overdue for a groom
              — all while you're working behind the table.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-audit" className="btn-primary">Get your free grooming AI audit →</Link>
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
              { value: "40%+", label: "Of grooming enquiries arrive outside business hours" },
              { value: "£3–4K", label: "Revenue recovered per year by cutting one no-show per week" },
              { value: "3–5×", label: "More Google reviews with automated post-groom requests" },
              { value: "10–12 weeks", label: "Rebook window before a grooming client is considered lapsed" },
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
        <h2 className="section-title mb-3">5 AI Agents Built for Pet Groomers</h2>
        <p className="text-gray-600 max-w-2xl mb-14">Real LLM pipelines that speak pet-owner language, conduct proper breed intake, integrate with your grooming software, and handle the full client lifecycle — from first enquiry to loyal repeat customer.</p>

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
          <h2 className="section-title mb-10">Questions from pet grooming business owners</h2>
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
        headline="Book your free grooming salon AI audit"
        sub="We'll review your booking flow, intake process, and review count — then identify exactly which agents will have the biggest impact on your grooming business."
        ctaLabel="Get your free audit"
        ctaHref="/free-audit"
      />
    </>
  );
}
