import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, FileCheck2, Mail, Search, ShieldCheck, Target, Tv, Megaphone, Store, Wrench } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import Reveal from "@/components/advertise/Reveal";
import CountUp from "@/components/advertise/CountUp";
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

const MARQUEE = ["Streaming TV (CTV)", "Digital out-of-home", "Google Ads", "Meta Ads", "Local SEO", "Google Business Profile", "Spotify Ads", "Nextdoor", "Email and SMS", "Booking software", "Review tools", "Analytics"];

const WHY = [
  { icon: Target, title: "Readers who are deciding", text: "People land on our guides while comparing ad platforms, checking costs or choosing a tool. A mention sits where that decision happens." },
  { icon: BadgeCheck, title: "A sourced environment", text: "Every guide names its sources. Your placement sits next to numbers that readers can check, which is the opposite of a banner." },
  { icon: ShieldCheck, title: "Labelled and compliant", text: "Visible Sponsored label and rel=\"sponsored\" links on every placement, in line with Google's paid-link guidance and the FTC's disclosure rules." },
  { icon: Clock, title: "Live in three business days", text: "Send the facts, approve the wording, and we publish within three business days of your approval. No long sales cycle." },
];

const FORMATS = [
  {
    name: "Sponsored mention",
    price: "$150",
    note: "one-time",
    items: ["50 to 100 words inside one existing article", "Placed where readers already compare options", "One link, rel=\"sponsored\"", "Wording approved by you"],
    cta: "Book a mention",
  },
  {
    name: "Sponsored section",
    price: "$300",
    note: "one-time",
    featured: true,
    items: ["150 to 300 words plus a row in the comparison table", "Facts checked against your public pages", "Up to two links, rel=\"sponsored\"", "Wording approved by you"],
    cta: "Book a section",
  },
  {
    name: "Sponsored article",
    price: "$600",
    note: "one-time",
    items: ["New 1,200+ word article researched and written by us", "Tutorial, comparison or buyer's guide on an agreed topic", "Sources cited, “Sponsored” label at the top", "Internal links from related guides"],
    cta: "Book an article",
  },
];

const PACKS = [
  { name: "Partner pack", price: "$400", detail: "Three sponsored mentions across three related articles, instead of $450.", },
  { name: "Launch pack", price: "$850", detail: "One sponsored article plus two mentions in related guides, instead of $900.", },
];

const TOPICS = [
  { icon: Tv, title: "Streaming TV (CTV) and DOOH", text: "Platform comparisons, minimum budgets, CPM ranges.", href: "/blog/ctv-advertising" },
  { icon: Megaphone, title: "Ad platforms", text: "Google Ads, Meta, Spotify, Nextdoor, Walmart Connect and more.", href: "/blog" },
  { icon: Search, title: "Local SEO and reviews", text: "Google Business Profile, citations, review tools.", href: "/blog/local-marketing-guides" },
  { icon: Wrench, title: "Marketing and booking tools", text: "Booking software, CRMs, automation, analytics.", href: "/rates" },
  { icon: Store, title: "Local business niches", text: "Cafes, salons, groomers, fitness studios, home services.", href: "/for/coffee-shops" },
];

const STEPS = [
  { n: "1", title: "Tell us what you offer", text: "Email the product, your target market and the article you have in mind." },
  { n: "2", title: "We confirm the fit", text: "Within two business days we confirm placement, format, price and timing." },
  { n: "3", title: "Approve the wording", text: "We write or adapt the text from your facts and send it for approval." },
  { n: "4", title: "Pay by invoice", text: "A USD invoice, payable by Wise, Revolut, PayPal or bank transfer." },
  { n: "5", title: "We publish", text: "Live within three business days of approval, and we send you the URL." },
];

export default function AdvertisePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="adv-orb w-96 h-96 bg-coffee-500/30 -top-24 -left-24" aria-hidden />
        <div className="adv-orb w-80 h-80 bg-coffee-300/20 bottom-0 right-0" style={{ animationDelay: "-6s" }} aria-hidden />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="adv-bob mx-auto mb-6 w-20 h-20" aria-hidden>
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <path className="adv-steam" d="M30 26c-4-5 4-8 0-13" stroke="#f3d9b8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path className="adv-steam" style={{ animationDelay: "0.9s" }} d="M40 26c-4-5 4-8 0-13" stroke="#f3d9b8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path className="adv-steam" style={{ animationDelay: "1.8s" }} d="M50 26c-4-5 4-8 0-13" stroke="#f3d9b8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M18 32h44v18a16 16 0 0 1-16 16h-12a16 16 0 0 1-16-16z" fill="#b07d4d" />
              <path d="M62 36h6a8 8 0 0 1 0 16h-8" stroke="#b07d4d" strokeWidth="5" fill="none" strokeLinecap="round" />
              <ellipse cx="40" cy="32" rx="22" ry="4" fill="#4a2d18" />
              <rect x="14" y="68" width="52" height="5" rx="2.5" fill="#8a5a2b" />
            </svg>
          </div>
          <span className="inline-block text-coffee-200 text-sm font-semibold tracking-widest uppercase mb-4">Advertise and partner</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
            Reach small-business owners <span className="text-coffee-300">at the moment they choose</span>
          </h1>
          <p className="text-coffee-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            DataLatte is a library of sourced guides on local marketing: ad platforms, local SEO, streaming TV, outdoor and the tools behind them. Put your product in the guide where readers are already comparing options.
          </p>
          <p className="text-white text-xl md:text-2xl font-semibold mb-8">
            Placements from $150 &middot;{" "}
            <a href="mailto:hi@datalatte.pro" className="underline decoration-coffee-300 underline-offset-4 hover:text-coffee-200">hi@datalatte.pro</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href={MAIL} className="adv-pulse inline-flex items-center justify-center gap-2 bg-white text-coffee-900 font-bold px-8 py-4 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-lg">
              Book a placement <ArrowRight size={20} />
            </a>
            <a href="#formats" className="inline-flex items-center justify-center gap-2 border border-coffee-200 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg">
              See formats and prices
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3" aria-label="Where our readers are">
            <span className="text-coffee-200 text-sm mr-1">Our readers:</span>
            {FLAGS.map((x) => (
              <span key={x.n} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 text-white text-sm hover:bg-white/20 transition-colors">
                <span className="text-xl leading-none" aria-hidden>{x.f}</span>{x.n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Topic marquee */}
      <div className="adv-marquee overflow-hidden bg-coffee-950 border-y border-coffee-800 py-4" aria-label="Topics we cover">
        <div className="adv-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} aria-hidden={i >= MARQUEE.length} className="mx-6 inline-flex items-center gap-3 text-coffee-200 whitespace-nowrap text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-coffee-400" aria-hidden />{m}
            </span>
          ))}
        </div>
      </div>

      {/* Proof strip */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-gray-800 text-center">
          <div className="py-8 px-6">
            <div className="text-4xl font-bold text-coffee-700 dark:text-coffee-300"><CountUp to={1000} suffix="+" /></div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">sourced guides, each citing its sources</div>
          </div>
          <div className="py-8 px-6">
            <div className="text-4xl font-bold text-coffee-700 dark:text-coffee-300"><CountUp to={15100} prefix="~" /></div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Google Search impressions in the 28 days to Oct 31, 2026 (Search Console)</div>
          </div>
          <div className="py-8 px-6">
            <div className="text-4xl leading-none" aria-hidden>🇺🇸 🇬🇧 🇨🇦 🇦🇺</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-3">where our readers are</div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pb-4 px-4">
          The site is young and growing. Search Console and analytics screenshots are available on request.
        </p>
      </section>

      {/* Placement mockup */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <span className="section-label">What it looks like</span>
            <h2 className="section-title mb-4">Inside the guide, clearly labelled</h2>
            <p className="text-gray-700 dark:text-gray-200 mb-3">
              Your mention sits in the section where readers compare options, with a visible Sponsored label and a link marked rel=&quot;sponsored&quot;. It reads as useful information, not as a banner, and it never changes the comparison around it.
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li className="flex gap-2"><BadgeCheck size={18} className="text-coffee-600 shrink-0 mt-0.5" aria-hidden />Facts checked against your public pages</li>
              <li className="flex gap-2"><BadgeCheck size={18} className="text-coffee-600 shrink-0 mt-0.5" aria-hidden />You approve the final wording</li>
              <li className="flex gap-2"><BadgeCheck size={18} className="text-coffee-600 shrink-0 mt-0.5" aria-hidden />Live for as long as the article is published</li>
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="card p-6 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300" aria-hidden>
              <div className="h-3 w-24 rounded bg-coffee-200 dark:bg-coffee-800 mb-4" />
              <div className="h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-600 mb-4" />
              <div className="space-y-2 mb-5">
                <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2.5 w-11/12 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2.5 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="adv-pulse rounded-xl border-2 border-coffee-500 bg-coffee-50 dark:bg-coffee-900/30 p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-coffee-700 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-800 rounded px-2 py-0.5">Sponsored</span>
                  <span className="text-[10px] text-gray-500">Your brand</span>
                </div>
                <div className="h-3 w-2/3 rounded bg-coffee-400/70 mb-2" />
                <div className="space-y-1.5">
                  <div className="h-2 rounded bg-coffee-200 dark:bg-coffee-800" />
                  <div className="h-2 w-5/6 rounded bg-coffee-200 dark:bg-coffee-800" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-2.5 w-10/12 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      {/* Why */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Why partner</span>
            <h2 className="section-title">A placement that reads like help, not a banner</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.1}>
                <div className="card p-6 h-full hover:-translate-y-1 transition-transform duration-300">
                  <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-coffee-100 dark:bg-coffee-900/40 mb-4">
                    <w.icon className="text-coffee-700 dark:text-coffee-300" size={26} aria-hidden />
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-gray-50 mb-2">{w.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Formats */}
      <SectionWrapper id="formats" className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Formats and prices</span>
            <h2 className="section-title">Simple pricing, one time, in US dollars</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Prices are starting points. The final quote depends on the article, the length and the research the item needs.</p>
          </div>
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

      {/* Topics */}
      <SectionWrapper>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Where you can appear</span>
            <h2 className="section-title">Topics our readers search for</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <Link href={t.href} className="card p-6 block h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-coffee-100 dark:bg-coffee-900/40 mb-3 group-hover:scale-110 transition-transform">
                    <t.icon className="text-coffee-700 dark:text-coffee-300" size={24} aria-hidden />
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-gray-50 mb-1">{t.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{t.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Steps */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">How it works</span>
            <h2 className="section-title">From email to live page in five steps</h2>
          </div>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
              <li className="card p-5 flex gap-4 items-start hover:translate-x-1 transition-transform duration-300">
                <span className="shrink-0 w-9 h-9 rounded-full bg-coffee-700 text-white font-bold flex items-center justify-center">{s.n}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-50">{s.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{s.text}</p>
                </div>
              </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </SectionWrapper>

      {/* Standards */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Editorial standards</span>
            <h2 className="section-title">How we keep sponsored content honest</h2>
          </div>
          <ul className="space-y-3 text-gray-700 dark:text-gray-200">
            {[
              "A visible “Sponsored” label sits next to every paid item, on desktop and mobile.",
              "Every paid link carries rel=\"sponsored\". We do not sell links that pass ranking credit.",
              "Facts and prices are checked against your public pages and the sources named in the article. Claims we cannot verify are softened or removed.",
              "You approve the final wording. We edit for accuracy, tone and length.",
              "Payment does not change a comparison table, a ranking of options or a conclusion reached earlier.",
              "Sensitive categories (gambling, adult, crypto trading, health claims) are reviewed case by case. If a request does not suit our readers, we say so.",
            ].map((r) => (
              <li key={r} className="flex gap-3"><BadgeCheck size={20} className="text-coffee-600 mt-0.5 shrink-0" aria-hidden />{r}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-8">
            References:{" "}
            <a className="underline text-coffee-700 dark:text-coffee-300" href="https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links" rel="noopener noreferrer">Google: qualify outbound links (rel=&quot;sponsored&quot;)</a>{" · "}
            <a className="underline text-coffee-700 dark:text-coffee-300" href="https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255" rel="noopener noreferrer">FTC Endorsement Guides, 16 CFR Part 255</a>. This page describes our own practice and is not legal advice.
          </p>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900">
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
      <section className="hero-gradient relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="adv-orb w-72 h-72 bg-coffee-400/25 -top-20 right-10" aria-hidden />
        <div className="relative max-w-3xl mx-auto text-center">
          <Mail className="adv-bob mx-auto text-coffee-200 mb-4" size={36} aria-hidden />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">Have a product that fits our readers?</h2>
          <p className="text-coffee-200 text-lg mb-8">Tell us about it and the article you have in mind. We reply within two business days.</p>
          <a href={MAIL} className="inline-flex items-center gap-2 bg-white text-coffee-900 font-bold px-8 py-4 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-lg">
            Email hi@datalatte.pro <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </>
  );
}
