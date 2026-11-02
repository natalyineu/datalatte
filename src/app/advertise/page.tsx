import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileCheck2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/advertise/Reveal";
import CountUp from "@/components/advertise/CountUp";
import PlacementTabs from "@/components/advertise/PlacementTabs";
import { GridOverlay, FloatingChip, StatsBar, BeforeAfter, TileGrid, PipelineFlow } from "@/components/advertise/Shared";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/advertise";
const PAGE_TITLE = "Advertise and Partner with DataLatte";
const PAGE_DESC =
  "Put your product in front of US small-business owners comparing ad platforms and tools. Labelled sponsored mentions, sections and articles from $150.";
const MAIL = "mailto:hi@datalatte.pro?subject=Sponsored%20placement%20on%20DataLatte";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

const FAQ = [
  {
    q: "Is a sponsored placement a paid link?",
    a: "A placement can include a link to your site. Every paid link is marked rel=\"sponsored\", which is what Google's guidelines ask for, so it works as a clearly labelled advertisement and as a referral path for readers, not as a ranking trick.",
  },
  {
    q: "How is sponsored content disclosed?",
    a: "Each placement carries a visible “Sponsored” label next to it. In the US, the FTC's Endorsement Guides (16 CFR Part 255) require a clear and conspicuous disclosure of a paid connection, and we apply the same rule to every placement on every device.",
  },
  {
    q: "Can I write the copy myself?",
    a: "You can send key facts, a draft or approved claims. We rewrite for accuracy and tone, check the facts against your public pages, and send you the final wording before it goes live.",
  },
  {
    q: "What if my claims cannot be verified?",
    a: "We cut or soften them. A claim we cannot support from a public source does not run, whoever is paying for it.",
  },
  {
    q: "Do you guarantee traffic, rankings or sales?",
    a: "No, and nobody honest can. We tell you where the placement sits and what the page earns in search so you can judge the fit.",
  },
  {
    q: "How long does a placement stay up?",
    a: "For as long as the article is published. If it becomes inaccurate we contact you before changing or removing it.",
  },
  {
    q: "How do I pay?",
    a: "We invoice in US dollars. You can pay by wire or ACH-compatible transfer through Wise or Revolut, by PayPal, or by bank transfer. Payment is one-time per placement.",
  },
  {
    q: "Do you take placements outside the US?",
    a: "Yes. Our readers are mostly in the US, UK, Canada and Australia, and we can phrase and price placements for any of those markets.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: "https://datalatte.pro" },
  { name: "Advertise", url: PAGE_URL },
]);

const FLAGS = [
  { f: "🇺🇸", n: "United States" },
  { f: "🇬🇧", n: "United Kingdom" },
  { f: "🇨🇦", n: "Canada" },
  { f: "🇦🇺", n: "Australia" },
];

const BEFORE_AFTER = [
  { before: "A banner readers learn to ignore", after: "A mention inside the comparison they are reading" },
  { before: "Anonymous paid links with no label", after: "Visible Sponsored label and rel=\"sponsored\" on every link" },
  { before: "Ad copy nobody checks", after: "Facts checked against your own public pages" },
  { before: "Weeks of back-and-forth", after: "Live within three business days of your approval" },
  { before: "Unclear price until the invoice", after: "Published starting prices, one time, in US dollars" },
  { before: "No say in the final wording", after: "You approve the text before it goes live" },
];

const TILE_GROUPS = [
  {
    label: "Advertising and media", dot: "#b07d4d",
    tiles: [
      { abbr: "TV", name: "Streaming TV (CTV)", category: "Platforms", desc: "Platform comparisons, minimum budgets and CPM ranges for small advertisers.", tags: ["Platforms", "Budgets", "CPM"] },
      { abbr: "OO", name: "Out-of-home (DOOH)", category: "Outdoor", desc: "Digital billboards and screens, how local businesses buy them.", tags: ["Networks", "Pricing", "Targeting"] },
      { abbr: "GA", name: "Google and Meta ads", category: "Paid search and social", desc: "Campaign setup, benchmarks and budgets by niche.", tags: ["CPC", "CPL", "Setup"] },
      { abbr: "AU", name: "Audio and local ads", category: "Emerging channels", desc: "Spotify, Nextdoor and other channels local businesses test.", tags: ["Spotify", "Nextdoor", "Retail media"] },
    ],
  },
  {
    label: "Search and local", dot: "#8a5a2b",
    tiles: [
      { abbr: "SE", name: "Local SEO", category: "Organic", desc: "Rankings, citations and audits for businesses with a physical location.", tags: ["Audits", "Citations", "Maps"] },
      { abbr: "GB", name: "Google Business Profile", category: "Local search", desc: "Setup, optimisation and review management.", tags: ["Profile", "Reviews", "Posts"] },
      { abbr: "RV", name: "Reviews and reputation", category: "Trust", desc: "Tools and rules for asking for and answering reviews.", tags: ["Yelp", "Google", "Policy"] },
      { abbr: "WB", name: "Websites and landing pages", category: "Conversion", desc: "Builders, speed and booking flows for small sites.", tags: ["Builders", "CRO", "Forms"] },
    ],
  },
  {
    label: "Tools and software", dot: "#6f4e37",
    tiles: [
      { abbr: "BK", name: "Booking and POS", category: "Operations", desc: "Booking apps and checkout tools for salons, studios and cafes.", tags: ["Booking", "Payments", "CRM"] },
      { abbr: "EM", name: "Email and SMS", category: "Retention", desc: "Newsletters, reminders and review requests.", tags: ["Email", "SMS", "Automation"] },
      { abbr: "AI", name: "AI and automation", category: "Productivity", desc: "Assistants, no-code workflows and agents for small teams.", tags: ["Agents", "Zapier", "Workflows"] },
      { abbr: "AN", name: "Analytics and reporting", category: "Measurement", desc: "Dashboards, attribution and tracking setup.", tags: ["GA4", "Dashboards", "Tracking"] },
    ],
  },
];

const FORMATS = [
  { name: "Sponsored mention", price: "$150", note: "one-time", items: ["50 to 100 words inside one existing article", "Placed where readers already compare options", "One link, rel=\"sponsored\"", "Wording approved by you"], cta: "Book a mention" },
  { name: "Sponsored section", price: "$300", note: "one-time", featured: true, items: ["150 to 300 words plus a row in the comparison table", "Facts checked against your public pages", "Up to two links, rel=\"sponsored\"", "Wording approved by you"], cta: "Book a section" },
  { name: "Sponsored article", price: "$600", note: "one-time", items: ["New 1,200+ word article researched and written by us", "Tutorial, comparison or buyer's guide on an agreed topic", "Sources cited, \"Sponsored\" label at the top", "Internal links from related guides"], cta: "Book an article" },
];

const PACKS = [
  { name: "Partner pack", price: "$400", detail: "Three sponsored mentions across three related articles, instead of $450." },
  { name: "Launch pack", price: "$850", detail: "One sponsored article plus two mentions in related guides, instead of $900." },
];

const STANDARDS = [
  { t: "Label", d: "A visible \"Sponsored\" label sits next to every paid item, on desktop and mobile." },
  { t: "Links", d: "Every paid link carries rel=\"sponsored\". We do not sell links that pass ranking credit." },
  { t: "Facts", d: "Facts and prices are checked against your public pages and the sources named in the article. Claims we cannot verify are softened or removed." },
  { t: "Approval", d: "You approve the final wording. We edit for accuracy, tone and length." },
  { t: "Independence", d: "Payment does not change a comparison table, a ranking of options or a conclusion reached earlier." },
  { t: "Fit", d: "Sensitive categories (gambling, adult, crypto trading, health claims) are reviewed case by case. If a request does not suit our readers, we say so." },
];

export default function AdvertisePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <GridOverlay />
        <FloatingChip className="left-6 top-20 lg:left-20 lg:top-24 sm:block" dot="green"><span className="text-gray-300">Label</span><span className="text-green-400 font-bold">Sponsored ✓</span></FloatingChip>
        <FloatingChip className="right-6 top-24 lg:right-24 lg:top-28 sm:block" dot="green" delay="0.8s" reverse><span className="text-gray-300">Links</span><span className="text-green-400 font-bold">rel=sponsored</span></FloatingChip>
        <FloatingChip className="left-10 bottom-16 lg:left-32 lg:block" dot="amber" delay="1.4s"><span className="text-gray-300">Live in</span><span className="text-amber-400 font-bold">3 days</span></FloatingChip>
        <FloatingChip className="right-10 bottom-20 lg:right-28 lg:block" dot="blue" delay="0.4s" reverse><span className="text-gray-300">From</span><span className="text-blue-300 font-bold">$150</span></FloatingChip>
        <FloatingChip className="left-1/4 top-12 lg:block" dot="pink" delay="2.1s"><span className="text-gray-300">🇺🇸 🇬🇧 🇨🇦 🇦🇺</span></FloatingChip>
        <FloatingChip className="right-1/4 bottom-10 lg:block" dot="purple" delay="1.8s" reverse><span className="text-gray-300">Facts</span><span className="text-purple-300 font-bold">checked</span></FloatingChip>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 border border-white/20 text-coffee-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">Advertise and partner</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Reach small-business owners <span className="text-coffee-400">at the moment they choose</span>
          </h1>
          <p className="text-xl text-white/65 max-w-2xl mx-auto mb-4 leading-relaxed">
            DataLatte is a library of sourced guides on local marketing: ad platforms, local SEO, streaming TV, outdoor and the tools behind them. Put your product in the guide where readers are already comparing options.
          </p>
          <p className="text-lg text-white font-semibold mb-10">
            Placements from $150 &middot;{" "}
            <a href="mailto:hi@datalatte.pro" className="underline decoration-coffee-400 underline-offset-4 hover:text-coffee-300">hi@datalatte.pro</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <a href={MAIL} className="inline-flex items-center justify-center gap-2 bg-coffee-500 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl hover:shadow-coffee-900/30">
              Book a placement <ArrowRight size={17} />
            </a>
            <a href="#formats" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white/80 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              See formats and prices →
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Where our readers are">
            {FLAGS.map((x) => (
              <span key={x.n} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 text-white text-sm hover:bg-white/20 transition-colors">
                <span className="text-xl leading-none" aria-hidden>{x.f}</span>{x.n}
              </span>
            ))}
          </div>
        </div>
      </section>

      <StatsBar items={[
        { value: <CountUp to={1000} suffix="+" />, label: "Sourced guides" },
        { value: <CountUp to={74000} prefix="~" />, label: "Google impressions, last 90 days to Oct 31 (Search Console)" },
        { value: "4 markets", label: "US, UK, Canada, Australia" },
        { value: "3 days", label: "From approval to live" },
      ]} />
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 py-3 px-4 bg-coffee-950">The site is young and growing. Search Console and analytics screenshots are available on request.</p>

      {/* Before / After */}
      <SectionWrapper>
        <Reveal>
          <div className="text-center mb-12">
            <span className="section-label">The difference</span>
            <h2 className="section-title">Not a banner. <span className="gradient-text">A useful, labelled mention.</span></h2>
          </div>
          <BeforeAfter beforeLabel="Typical ad buy" afterLabel="A DataLatte placement" rows={BEFORE_AFTER} />
        </Reveal>
      </SectionWrapper>

      {/* Topics grid */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="text-center mb-12">
          <span className="section-label">Where you can appear</span>
          <h2 className="section-title">Twelve topics, <span className="gradient-text">one readership</span></h2>
          <p className="text-gray-500 max-w-xl mx-auto dark:text-gray-400">Pick the guides that match your product. We confirm the fit before anything is published.</p>
        </div>
        <TileGrid groups={TILE_GROUPS} />
      </SectionWrapper>

      {/* Placement preview (dark) */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <GridOverlay size={32} opacity={0.035} />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">Live placement preview</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What your placement looks like</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">Switch between the three formats to see how each one sits inside a guide.</p>
          </div>
          <PlacementTabs />
        </div>
      </section>

      {/* Formats */}
      <SectionWrapper id="formats">
        <div className="text-center mb-12">
          <span className="section-label">Formats and prices</span>
          <h2 className="section-title">Simple pricing, <span className="gradient-text">one time, in US dollars</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Prices are starting points. The final quote depends on the article, the length and the research the item needs.</p>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {FORMATS.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.12} className="h-full">
                <div className={f.featured ? "adv-border rounded-2xl p-[2px] h-full md:-mt-3 md:mb-3" : "h-full"}>
                  <div className={`card p-8 flex flex-col h-full ${f.featured ? "" : "hover:-translate-y-1 transition-transform duration-300"}`}>
                    {f.featured && <span className="self-start text-xs font-bold uppercase tracking-wide bg-coffee-700 text-white rounded-full px-3 py-1 mb-3">Recommended</span>}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{f.name}</h3>
                    <div className="my-4">
                      <span className="text-4xl font-bold text-coffee-700 dark:text-coffee-300">from {f.price}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">{f.note}</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200 mb-8 flex-1">
                      {f.items.map((it) => (
                        <li key={it} className="flex gap-2"><FileCheck2 size={16} className="text-coffee-600 mt-0.5 shrink-0" aria-hidden />{it}</li>
                      ))}
                    </ul>
                    <a href={MAIL} className="btn-primary text-center">{f.cta}</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {PACKS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <div className="card p-6 flex items-center justify-between gap-4 h-full hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-50">{p.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{p.detail}</p>
                  </div>
                  <div className="text-2xl font-bold text-coffee-700 dark:text-coffee-300 whitespace-nowrap">{p.price}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Pipeline */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <GridOverlay size={32} opacity={0.035} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">From your email to a live page</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">You send the facts. We check, write, label and publish, and you approve before anything goes live.</p>
          </div>
          <PipelineFlow
            sub="Check · write · label"
            left={[
              { title: "1. You write to us", text: "Product, market and the article you have in mind." },
              { title: "2. We confirm the fit", text: "Reply within two business days with format, price and timing." },
              { title: "3. You send the facts", text: "Key claims and the URL for the link." },
            ]}
            right={[
              { title: "4. You approve the wording", text: "We write or adapt it and send the final text." },
              { title: "5. Invoice and payment", text: "USD invoice via Wise, Revolut, PayPal or bank transfer." },
              { title: "6. Live in three days", text: "We publish and send you the URL." },
            ]}
          />
        </div>
      </section>

      {/* Standards */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Editorial standards</span>
            <h2 className="section-title">How we keep sponsored content <span className="gradient-text">honest</span></h2>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950 divide-y divide-gray-800 overflow-hidden">
            {STANDARDS.map((r) => (
              <div key={r.t} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-900/60 transition-colors">
                <BadgeCheck size={18} className="text-green-400 mt-0.5 shrink-0" aria-hidden />
                <div><div className="text-sm font-semibold text-white">{r.t}</div><div className="text-sm text-gray-400">{r.d}</div></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
            References:{" "}
            <a className="underline text-coffee-700 dark:text-coffee-300" href="https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links" rel="noopener noreferrer">Google: qualify outbound links (rel=&quot;sponsored&quot;)</a>{" · "}
            <a className="underline text-coffee-700 dark:text-coffee-300" href="https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255" rel="noopener noreferrer">FTC Endorsement Guides, 16 CFR Part 255</a>. This page describes our own practice and is not legal advice. Looking for a collaboration rather than a placement? See <Link href="/partnerships" className="underline text-coffee-700 dark:text-coffee-300">Partnerships</Link>.
          </p>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions advertisers ask</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card p-5 group">
                <summary className="font-semibold text-gray-900 dark:text-gray-50 cursor-pointer list-none flex justify-between gap-4">
                  {f.q}<span className="text-coffee-700 dark:text-coffee-300 group-open:rotate-45 transition-transform" aria-hidden>+</span>
                </summary>
                <p className="text-sm text-gray-700 dark:text-gray-200 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GridOverlay />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 animate-float" aria-hidden>☕</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">Have a product that fits our readers?</h2>
          <p className="text-white/65 text-lg mb-8">Tell us about it and the article you have in mind. We reply within two business days.</p>
          <a href={MAIL} className="inline-flex items-center gap-2 bg-coffee-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl text-lg">
            Email hi@datalatte.pro <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </>
  );
}
