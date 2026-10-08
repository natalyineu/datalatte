import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

export const EXTRA_FAQS = [
  {
    q: "How fast do agents actually reply, and does speed matter that much?",
    a: "A Lead Responder typically sends its first message in 10–60 seconds. Speed matters: a Harvard Business Review study of 2,241 U.S. companies (Oldroyd, McElheran & Elkington, 2011) found firms that contacted web leads within an hour were about 7x more likely to qualify them than firms that waited just one more hour, and over 60x more likely than firms that waited 24 hours or more.",
  },
  {
    q: "Will customers know they're talking to AI?",
    a: "I don't hide it. The agent opens as your business's assistant, answers in your tone, and hands over to a human the moment a customer asks or the topic is sensitive (complaints, refunds, medical or legal questions). Honest framing performs better than pretending, and in several jurisdictions disclosure is expected for automated messaging anyway.",
  },
  {
    q: "What if I only have 10–15 leads a month?",
    a: "Then a full pipeline is overkill. Start with one agent — usually Missed Call Text-Back or Review Monitor — which pays back on a handful of recovered customers. The free AI Agent Builder tool estimates which agent fits your volume before you spend anything.",
  },
  {
    q: "Who owns the system after it's built?",
    a: "You do. Accounts (n8n, OpenAI/Anthropic, Twilio, CRM) are created under your business, not mine. You get workflow exports, prompts, documentation and a recorded walkthrough. If you stop working with me, everything keeps running.",
  },
  {
    q: "How do you protect customer data?",
    a: "Agents only receive the fields they need (name, service, time — not payment details). API keys live in environment variables, never in prompts. Business-tier LLM APIs don't train on your data by default, and message logs are retained only as long as you choose. Payments always stay inside your booking or POS system.",
  },
  {
    q: "How do I know it's working?",
    a: "Every build ships with a dashboard tracking response time, replies per lead, bookings attributed to the agent, escalation rate and cost per lead. After 30 days we compare against your baseline — and if an agent doesn't move a number, we switch it off or change it.",
  },
];

const STEPS = [
  { wk: "Week 1", title: "Audit & baseline", body: "I map every place a lead can come in (forms, calls, DMs, GBP messages, ads) and measure today's reply time, lead-to-booking rate and no-show rate. This baseline is what we judge results against." },
  { wk: "Weeks 2–3", title: "Build the first agent", body: "Prompt, tools, knowledge base and escalation rules for one agent, wired into your CRM and booking system. Tested on 30–50 real past conversations before it ever messages a customer." },
  { wk: "Week 4", title: "Shadow mode → live", body: "The agent drafts replies and you approve them for a few days. Once approval rate is high, it goes live with a daily digest of everything it sent." },
  { wk: "Weeks 5–8", title: "Add agents & tune", body: "Second and third agents (e.g. No-Show Reducer, Reactivation) reuse the same plumbing, so they ship faster. Prompts are tuned weekly from real transcripts." },
  { wk: "Day 30+", title: "Review & handover", body: "Results vs baseline, cost per lead, and a recorded walkthrough. 30 days of post-launch support are included." },
];

const COSTS = [
  { item: "Single-agent build", cost: "$800–$2,000", note: "Missed-call text-back, FAQ bot, review replies. 1–2 weeks." },
  { item: "Multi-agent pipeline", cost: "$2,500–$5,000", note: "Lead responder + booking + no-show + reactivation. 3–5 weeks." },
  { item: "Running costs", cost: "$50–$200 / mo", note: "LLM API, n8n hosting, Twilio. Paid directly to vendors, no markup." },
  { item: "Typical LLM cost per conversation", cost: "~$0.01–$0.05", note: "With a small model (GPT-4o-mini / Claude Haiku class); varies with length." },
];

const WONT = [
  "Replace your team — it handles the repetitive 70%, people handle the relationship.",
  "Take payments or change prices on its own.",
  "Give medical, legal or veterinary advice — those messages escalate to you.",
  "Send marketing messages to people who haven't opted in.",
  "Answer from the open internet — it only uses content you approved.",
];

const WILL = [
  "Reply to every new lead in under a minute, at 2 a.m. too.",
  "Book, reschedule and remind through your existing calendar.",
  "Reply to every Google review in your voice, flagging the angry ones to you.",
  "Wake up past clients with a personal, relevant nudge.",
  "Show you the numbers: response time, bookings, cost per lead.",
];

const NICHES = [
  { name: "Hair & beauty salons", pains: "DM and call inquiries during appointments, no-shows, rebooking gaps", href: "/blog/ai-agents-for-hair-salons" },
  { name: "Coffee shops & cafés", pains: "Review replies, catering and event inquiries, loyalty reactivation", href: "/blog/ai-agents-for-coffee-shops" },
  { name: "Pet groomers", pains: "Same-day slot requests, vaccination checks, recurring-visit reminders", href: "/blog/ai-agents-for-pet-groomers" },
  { name: "Fitness studios", pains: "Trial-class leads going cold, lapsed members, class waitlists", href: "/blog/ai-agents-for-gyms-fitness-studios" },
];

const GUIDES = [
  { t: "AI agents for local business: what they are and how they work", h: "/blog/ai-agents-for-local-business-what-they-are-and-how-they-work" },
  { t: "AI agent vs chatbot: what's the difference?", h: "/blog/ai-agent-vs-chatbot-whats-the-difference-local-business" },
  { t: "n8n AI agent workflow for local business", h: "/blog/n8n-ai-agent-workflow-local-business" },
  { t: "AI receptionist setup guide 2026", h: "/blog/ai-receptionist-small-business-setup-guide-2026" },
  { t: "Appointment reminders that cut no-shows", h: "/blog/ai-agent-for-appointment-reminders-reduce-no-shows" },
  { t: "Best AI agents for small business 2026", h: "/blog/best-ai-agents-for-small-business-2026" },
];

export function WhyFast() {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        <span className="section-label">Why this pays</span>
        <h2 className="section-title">The first reply wins the customer</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { n: "7×", t: "more likely to qualify a lead contacted within 1 hour vs. 1 hour later" },
            { n: "60×", t: "more likely vs. waiting 24 hours or more" },
            { n: "<60s", t: "typical first-reply time for a Lead Responder agent" },
          ].map((s) => (
            <div key={s.n} className="card p-6 text-center">
              <div className="text-4xl font-bold gradient-text">{s.n}</div>
              <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">{s.t}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 dark:text-gray-400">
          Source: Oldroyd, McElheran &amp; Elkington, “The Short Life of Online Sales Leads,” Harvard Business Review, March 2011 (2,241 U.S. companies). The &lt;60s figure is the design target of the build, not a third-party statistic.
        </p>
        <p className="text-gray-600 mt-6 leading-relaxed dark:text-gray-300">
          Local service businesses lose most leads in the gap between “inquiry sent” and “owner free to answer.” The owner is mid-haircut, behind the espresso machine, or asleep. An agent closes that gap: it answers, qualifies, offers real slots and only then involves you.
        </p>
      </div>
    </SectionWrapper>
  );
}

export function MathBlock() {
  return (
    <SectionWrapper className="bg-gray-50 dark:bg-gray-800/60">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">The Math</span>
        <h2 className="section-title">What one agent can be worth — an example</h2>
        <p className="text-gray-600 mt-3 dark:text-gray-300">Illustrative salon scenario. Every input is an assumption — swap in your own numbers.</p>
        <div className="overflow-x-auto mt-6 card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <th className="p-4 font-semibold">Input</th>
                <th className="p-4 font-semibold">Value</th>
                <th className="p-4 font-semibold">Basis</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-200">
              {[
                ["Inbound leads / month", "40", "Assumption"],
                ["Lead → booking, manual replies", "30%  (12 bookings)", "Assumption"],
                ["Lead → booking, instant agent reply", "38%  (15.2 bookings)", "Assumption: +8 pts"],
                ["Extra bookings / month", "+3.2", "15.2 − 12"],
                ["Value per new client (first year)", "$255", "Assumption: $85 × 3 visits"],
                ["Extra revenue / month", "≈ $816", "3.2 × $255"],
                ["Running cost / month", "≈ $100", "Mid-range of $50–$200"],
                ["Net gain / month", "≈ $716", "$816 − $100"],
                ["Payback on a $1,500 build", "≈ 2.1 months", "$1,500 ÷ $716"],
              ].map((r) => (
                <tr key={r[0]} className="border-b last:border-0 border-gray-100 dark:border-gray-800">
                  <td className="p-4">{r[0]}</td>
                  <td className="p-4 font-semibold">{r[1]}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-4 dark:text-gray-300">
          If the true uplift is only +4 points, payback stretches to roughly 5 months; at +12 points it falls under 1.5. That sensitivity is why the audit week measures your real baseline first. Not sure of your numbers? Use the{" "}
          <Link href="/tools/ai-agent-builder" className="text-coffee-700 underline dark:text-coffee-300">AI Agent Builder</Link> or the{" "}
          <Link href="/tools/marketing-budget-calculator" className="text-coffee-700 underline dark:text-coffee-300">budget calculator</Link>.
        </p>
      </div>
    </SectionWrapper>
  );
}

export function Process() {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        <span className="section-label">How it works</span>
        <h2 className="section-title">From first call to live agent in 4 weeks</h2>
        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.wk} className="card p-5 flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-coffee-600 text-white font-bold flex items-center justify-center">{i + 1}</div>
              <div>
                <div className="text-xs font-mono text-coffee-700 dark:text-coffee-300">{s.wk}</div>
                <h3 className="font-bold text-gray-900 dark:text-gray-50">{s.title}</h3>
                <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}

export function Pricing() {
  return (
    <SectionWrapper className="bg-gray-50 dark:bg-gray-800/60">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">Pricing</span>
        <h2 className="section-title">What it costs — no surprises</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {COSTS.map((c) => (
            <div key={c.item} className="card p-5">
              <div className="text-sm text-gray-500 dark:text-gray-400">{c.item}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1 dark:text-gray-50">{c.cost}</div>
              <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">{c.note}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-4 dark:text-gray-300">Vendor accounts are in your name. Build is a one-time fee; there is no retainer unless you want ongoing tuning.</p>
      </div>
    </SectionWrapper>
  );
}

export function Honest() {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        <span className="section-label">Honest scope</span>
        <h2 className="section-title">What agents will — and won&apos;t — do</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-8">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-3 dark:text-gray-50">Will</h3>
            <ul className="space-y-2">
              {WILL.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200"><CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5 dark:text-coffee-400" />{w}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 mb-3 dark:text-gray-50">Won&apos;t</h3>
            <ul className="space-y-2">
              {WONT.map((w) => (
                <li key={w} className="flex gap-2 text-sm text-gray-700 dark:text-gray-200"><XCircle size={17} className="text-gray-500 shrink-0 mt-0.5 dark:text-gray-400" />{w}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export function ByNiche() {
  return (
    <SectionWrapper className="bg-gray-50 dark:bg-gray-800/60">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">By industry</span>
        <h2 className="section-title">Where agents fit your business</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {NICHES.map((n) => (
            <Link key={n.href} href={n.href} className="card p-5 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 dark:text-gray-50">{n.name}</h3>
              <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">{n.pains}</p>
              <span className="text-sm text-coffee-700 font-medium mt-3 inline-flex items-center gap-1 dark:text-coffee-300">Read the guide <ArrowRight size={13} /></span>
            </Link>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

export function Guides() {
  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-50">Learn more before you decide</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {GUIDES.map((g) => (
            <li key={g.h}>
              <Link href={g.h} className="flex items-start gap-2 text-sm text-coffee-700 hover:underline dark:text-coffee-300">
                <ArrowRight size={14} className="mt-0.5 shrink-0" />{g.t}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
