import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, X, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/compare/freelance-vs-agency";
const PAGE_TITLE = "Freelance Marketing Consultant vs Agency: Which Is Right for You?";
const PAGE_DESC =
  "Honest comparison of hiring a freelance marketing consultant vs a full-service agency for local and small businesses. Costs, access, accountability, and when each option wins.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "en-US": PAGE_URL,
      "en-GB": PAGE_URL,
      "en-AU": PAGE_URL,
      "en-CA": PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    siteName: "DataLatte",
    type: "website",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "Freelance vs Agency" }],
  },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC, images: ["https://datalatte.pro/opengraph-image"] },
};

const comparisonRows = [
  {
    factor: "Who works on your account",
    agency: "Usually a junior account exec or recent graduate following a template",
    freelancer: "A senior specialist — you know exactly who's doing the work",
  },
  {
    factor: "Cost",
    agency: "£2,000–£10,000+/month retainer, plus markup on ad spend and tools",
    freelancer: "From £500–£2,500/month — you pay for expertise, not overhead",
  },
  {
    factor: "Responsiveness",
    agency: "Account managers, briefing chains, and 48-hour SLAs between emails",
    freelancer: "Direct access — one Slack message or email to the person doing the work",
  },
  {
    factor: "Strategic depth",
    agency: "Strategy often set by a senior planner who hands it off to juniors",
    freelancer: "Senior-level thinking on every decision, from strategy to execution",
  },
  {
    factor: "Transparency",
    agency: "Dashboards and reports that often obscure real performance data",
    freelancer: "Full access to all accounts, every platform, every data point",
  },
  {
    factor: "Contract flexibility",
    agency: "Typically 6–12 month minimum contracts with steep exit clauses",
    freelancer: "Month-to-month with 30 days notice — you stay because results are good",
  },
  {
    factor: "Tool markup",
    agency: "Often charge a 10–30% management fee on top of ad spend",
    freelancer: "No markup — your ad spend goes directly to the platforms",
  },
  {
    factor: "Speed to start",
    agency: "6-week onboarding, briefing documents, multiple kickoff calls",
    freelancer: "Audit delivered within 48 hours, campaigns live within 1–2 weeks",
  },
];

const agencyWins = [
  "You need a large in-house creative team producing high-volume video content",
  "You're running global multi-market campaigns with 50+ markets to coordinate",
  "You need the brand credibility of a well-known agency logo in investor pitches",
  "Your legal or procurement team requires working with incorporated entities",
];

const freelancerWins = [
  "You're a local business with a focused marketing need (ads, SEO, GBP)",
  "You want the person you speak with to be the person doing the work",
  "You've been burned by agencies assigning juniors to your account",
  "You need marketing ROI, not agency relationship management",
  "You have a budget under £5,000/month (agencies rarely prioritise you below this)",
  "You want full access to your own accounts and data — no black box",
  "You're scaling a single-location or multi-location local business",
];

const faqs = [
  {
    q: "Is a freelance marketing consultant as capable as a full agency?",
    a: "For most small and local businesses, a senior freelance consultant is significantly more capable than the team an agency assigns at the same budget. Agencies save their senior talent for their largest clients. At DataLatte, every campaign is built and managed directly by Nataliia — 10+ years at OMD, Dentsu, BBDO, and GroupM — not by someone who graduated two years ago.",
  },
  {
    q: "What happens if a freelancer gets sick or goes on holiday?",
    a: "It's a fair question. The honest answer: the same thing happens at an agency — except you don't know about it. A good freelancer will communicate proactively, schedule coverage in advance, and have redundancies in place (automated reporting, paused spend if needed). At DataLatte, I build in buffer time for all client commitments during planned breaks.",
  },
  {
    q: "Aren't agencies better for larger budgets?",
    a: "Not necessarily. Agency capacity scales, but quality often doesn't. A £5,000/month client at a mid-size agency is still likely getting a junior account executive and a shared planning team. A senior freelance consultant at the same budget gives you direct access to someone who has managed multi-million pound campaigns. The question isn't budget size — it's what your budget actually buys.",
  },
  {
    q: "What if I need services beyond one person's expertise?",
    a: "Experienced marketing consultants maintain trusted networks of specialist collaborators — developers, designers, copywriters, video producers — and can project-manage the full stack as needed. The difference: you pay for actual work, not for account manager overhead.",
  },
  {
    q: "Should I hire in-house instead of either?",
    a: "An in-house hire makes sense when you need someone dedicated 40 hours a week to marketing at scale. For most local and growing businesses, a senior freelancer gives you more expertise per pound spent than a single junior in-house hire, with more flexibility and no employment overheads. Many clients combine both: an in-house coordinator and a senior consultant for strategy and channel execution.",
  },
];

export default function FreelanceVsAgencyPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Compare", url: "https://datalatte.pro/compare" },
    { name: "Freelance vs Agency", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            An honest comparison — not a sales pitch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">
            Freelance consultant vs
            <span className="text-coffee-300"> marketing agency</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Both options have genuine pros and cons. Here&apos;s how to think through the decision for your
            specific situation — not a pitch for one or the other.
          </p>
        </div>
      </section>

      {/* Head-to-head comparison table */}
      <SectionWrapper>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Head-to-head</span>
            <h2 className="section-title">What you actually get</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full bg-white text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 text-gray-500 font-medium w-1/4">Factor</th>
                  <th className="p-4 text-center text-gray-700 font-bold w-3/8">Marketing agency</th>
                  <th className="p-4 text-center text-coffee-700 font-bold w-3/8">Freelance consultant</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.factor} className={i % 2 === 0 ? "bg-gray-50/40" : "bg-white"}>
                    <td className="p-4 font-semibold text-gray-900 text-sm align-top">{row.factor}</td>
                    <td className="p-4 text-gray-500 text-sm align-top">{row.agency}</td>
                    <td className="p-4 text-gray-700 text-sm align-top">{row.freelancer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* When each wins */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Agency wins */}
          <div className="card p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">🏢</div>
              <h3 className="text-xl font-bold text-gray-900">Choose an agency when…</h3>
            </div>
            <div className="space-y-3">
              {agencyWins.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Freelancer wins */}
          <div className="card p-7 border-coffee-200 bg-coffee-50/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-coffee-100 flex items-center justify-center text-xl">👩‍💻</div>
              <h3 className="text-xl font-bold text-gray-900">Choose a freelancer when…</h3>
            </div>
            <div className="space-y-3">
              {freelancerWins.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-coffee-600 shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* The agency model problem */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">The real problem</span>
          <h2 className="section-title mb-6">
            Why agencies assign juniors to
            <span className="gradient-text"> your account</span>
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
            <p>
              Agencies are structured to make money on margin. A senior strategist billing at £200/hr
              is only profitable if they&apos;re sold to clients at £350/hr. To scale that, agencies build
              teams: the senior sets the strategy once and hands execution to junior staff at £30–50/hr —
              who they bill at £150/hr.
            </p>
            <p>
              This works for the agency. It&apos;s a problem for you. The person in your kickoff call
              is almost never the person managing your campaigns day-to-day. The strategic thinking
              you paid for gets diluted through a chain of account managers, planners, and executives
              who are each managing 8–12 clients simultaneously.
            </p>
            <p>
              A senior freelance consultant has one cost structure: their time. There&apos;s no margin
              to protect, no junior to offshore the execution to. You get the senior thinking — on
              every decision, every optimisation, every report.
            </p>
          </div>
          <Link href="/about" className="inline-flex items-center gap-2 text-coffee-700 font-semibold mt-6 hover:underline">
            About Nataliia&apos;s agency background <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="See if DataLatte is the right fit for your business"
        sub="Start with a free audit — no commitment, no pitch deck. I'll review your current marketing and tell you honestly what I'd do differently."
      />
    </>
  );
}
