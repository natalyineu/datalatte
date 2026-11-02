import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CopyEmail from "@/components/advertise/CopyEmail";
import Reveal from "@/components/advertise/Reveal";
import { GridOverlay, FloatingChip, StatsBar, BeforeAfter, TileGrid, PipelineFlow } from "@/components/advertise/Shared";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/partnerships";
const PAGE_TITLE = "Partner with DataLatte";
const PAGE_DESC =
  "Partner with DataLatte on tool reviews, co-marketing, referrals and data projects for local-business marketing. How we work, what we offer and how to start.";
const MAIL = "mailto:hi@datalatte.pro?subject=Partnership%20with%20DataLatte";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

const BEFORE_AFTER = [
  { before: "A review that is really an ad", after: "Hands-on testing against our checklist, with your public pricing verified" },
  { before: "One-off mention, then silence", after: "Joint resources and references that stay useful and are kept up to date" },
  { before: "Vague terms and surprises later", after: "Scope, deliverables, timing and any fee agreed in writing first" },
  { before: "Payment that bends the verdict", after: "Partnership never changes a ranking, score or conclusion" },
  { before: "Contact lists passed around", after: "No contact details shared without each person's consent" },
];

const TILE_GROUPS = [
  {
    label: "Ways to partner", dot: "#b07d4d",
    tiles: [
      { abbr: "TL", name: "Tool and platform partners", category: "Reviews", desc: "Hands-on review or comparison entry, with your pricing and features verified on your public pages. A trial or demo account helps; it never buys a verdict.", tags: ["Review", "Comparison", "Corrections welcome"] },
      { abbr: "CM", name: "Co-marketing", category: "Joint resources", desc: "Joint guides, checklists, webinars and calculators. You bring expertise or data; we bring structure, editing and distribution.", tags: ["Guides", "Webinars", "Calculators"] },
      { abbr: "RF", name: "Referral partners", category: "Agencies and freelancers", desc: "We introduce local businesses that need services we do not provide, and you do the same. Any fee is agreed in writing first.", tags: ["Introductions", "Written terms"] },
      { abbr: "DR", name: "Data and research", category: "Publishers and analysts", desc: "We cite primary sources in our guides and rates library. If you publish local-advertising benchmarks, we can reference and present them.", tags: ["Citations", "Joint write-ups"] },
    ],
  },
  {
    label: "Community", dot: "#8a5a2b",
    tiles: [
      { abbr: "LO", name: "Local organizations", category: "Chambers, SBDCs, communities", desc: "Free guides, calculators and checklists for your members, plus workshops or Q&A on local marketing. Content stays free for members.", tags: ["Member resources", "Workshops", "Events"] },
    ],
  },
];

const PIPE_LEFT = [
  { title: "Tools and platforms", text: "Reviews and comparison entries." },
  { title: "Agencies and freelancers", text: "Referrals in both directions." },
  { title: "Publishers and analysts", text: "Benchmarks and research." },
];
const PIPE_RIGHT = [
  { title: "Independent guides", text: "Sourced, checked and labelled where needed." },
  { title: "Joint resources", text: "Checklists, calculators, webinars." },
  { title: "Readers who decide better", text: "Small-business owners in the US, UK, Canada and Australia." },
];

const PRINCIPLES = [
  "Independence. Partnership never changes a ranking, a score or a conclusion in our guides. Paid placements live on a separate page with their own rules.",
  "Disclosure. Anything sponsored, affiliate or received free is labelled where the reader sees it. Paid links carry rel=\"sponsored\".",
  "Verification. We check claims against your public pages and primary sources. Claims we cannot support are softened or dropped.",
  "Clarity. Scope, deliverables, timing and any fees are agreed in writing before work starts.",
  "Respect for readers. We do not share anyone's contact details without consent.",
];

const STEPS = [
  { n: "1", t: "Say hello", d: "Email what you do, who you serve and what kind of partnership you have in mind." },
  { n: "2", t: "We check the fit", d: "We reply within two business days with questions or a yes/no on fit." },
  { n: "3", t: "Agree the scope", d: "A short written outline of what each side delivers, when, and any fee." },
  { n: "4", t: "Build it together", d: "We work through drafts, facts and approvals; you see the final version before it goes live." },
  { n: "5", t: "Launch and review", d: "We publish, share the URLs and talk about what worked a few weeks later." },
];

const FAQ = [
  { q: "Do you run an affiliate program?", a: "We are open to affiliate and referral arrangements with tools and services we would recommend anyway. If a link earns us a fee, the page says so at the point of the link." },
  { q: "Is this different from advertising?", a: "Yes. Advertising is a paid, labelled placement in a guide and is covered on our Advertise page. Partnerships are collaborations such as reviews, joint resources, referrals and research, agreed case by case." },
  { q: "Can a partnership affect your reviews?", a: "No. We can correct factual errors you point out with a source, but we do not remove criticism or change a verdict because of a relationship." },
  { q: "Do you work with partners outside the US?", a: "Yes. Our readers are mostly in the US, UK, Canada and Australia, and we work with partners in any of those markets." },
  { q: "How fast can we start?", a: "Most conversations get a reply within two business days. Small projects such as a review or a comparison entry can be live within a few weeks." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const breadcrumb = breadcrumbSchema([
  { name: "Home", url: "https://datalatte.pro" },
  { name: "Partnerships", url: PAGE_URL },
]);


export default function PartnershipsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 pt-24 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <GridOverlay />
        <FloatingChip className="left-6 top-20 lg:left-20 lg:top-24 sm:block" dot="green"><span className="text-gray-300">Reviews</span><span className="text-green-400 font-bold">hands-on</span></FloatingChip>
        <FloatingChip className="right-6 top-24 lg:right-24 lg:top-28 sm:block" dot="green" delay="0.8s" reverse><span className="text-gray-300">Terms</span><span className="text-green-400 font-bold">in writing</span></FloatingChip>
        <FloatingChip className="left-10 bottom-16 lg:left-32 lg:block" dot="amber" delay="1.4s"><span className="text-gray-300">Reply in</span><span className="text-amber-400 font-bold">2 days</span></FloatingChip>
        <FloatingChip className="right-10 bottom-20 lg:right-28 lg:block" dot="blue" delay="0.4s" reverse><span className="text-gray-300">🇺🇸 🇬🇧 🇨🇦 🇦🇺</span></FloatingChip>
        <FloatingChip className="left-1/4 top-12 lg:block" dot="pink" delay="2.1s"><span className="text-gray-300">Co-marketing</span></FloatingChip>
        <FloatingChip className="right-1/4 bottom-10 lg:block" dot="purple" delay="1.8s" reverse><span className="text-gray-300">Research</span></FloatingChip>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-white/10 border border-white/20 text-coffee-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">Partnerships</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance leading-tight">
            Build something useful <span className="text-coffee-400">for local businesses, together</span>
          </h1>
          <p className="text-xl text-white/65 max-w-2xl mx-auto mb-4 leading-relaxed">
            DataLatte works with tools, platforms, agencies, researchers and local organizations that serve small-business owners. We bring sourced guides, careful editing and a readership that is choosing how to market.
          </p>
          <p className="text-lg text-white font-semibold mb-10">
            Write to us: <a href="mailto:hi@datalatte.pro" className="underline decoration-coffee-400 underline-offset-4 hover:text-coffee-300">hi@datalatte.pro</a>{" "}
            <CopyEmail className="ml-1" />
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={MAIL} className="inline-flex items-center justify-center gap-2 bg-coffee-500 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl hover:shadow-coffee-900/30">
              Start a conversation <ArrowRight size={17} />
            </a>
            <Link href="/advertise" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white/80 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              Looking to advertise instead? →
            </Link>
          </div>
        </div>
      </section>

      <StatsBar items={[
        { value: "5", label: "Kinds of partnership" },
        { value: "2 days", label: "To our first reply" },
        { value: "In writing", label: "Scope and any fee" },
        { value: "0", label: "Verdicts we sell" },
      ]} />

      <SectionWrapper>
        <Reveal>
          <div className="text-center mb-12">
            <span className="section-label">The difference</span>
            <h2 className="section-title">Partnerships that <span className="gradient-text">stay honest</span></h2>
          </div>
          <BeforeAfter beforeLabel="Typical vendor deal" afterLabel="A DataLatte partnership" rows={BEFORE_AFTER} />
        </Reveal>
      </SectionWrapper>

      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="text-center mb-12">
          <span className="section-label">Ways to partner</span>
          <h2 className="section-title">Five kinds of partnership <span className="gradient-text">we are open to</span></h2>
        </div>
        <TileGrid groups={TILE_GROUPS} />
      </SectionWrapper>

      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <GridOverlay size={32} opacity={0.035} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-14">
            <span className="inline-block text-coffee-400 text-sm font-semibold uppercase tracking-widest mb-3">The idea</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Everyone who serves local businesses, one place to learn</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">Expertise, products and data from partners flow into guides that readers can check and trust.</p>
          </div>
          <PipelineFlow sub="Check · edit · publish" left={PIPE_LEFT} right={PIPE_RIGHT} />
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Our principles</span>
            <h2 className="section-title">What every partner <span className="gradient-text">can count on</span></h2>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-950 divide-y divide-gray-800 overflow-hidden">
            {PRINCIPLES.map((p) => (
              <div key={p} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-900/60 transition-colors">
                <BadgeCheck size={18} className="text-green-400 mt-0.5 shrink-0" aria-hidden />
                <div className="text-sm text-gray-300">{p}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
            See how we source numbers in our <Link href="/rates" className="underline text-coffee-700 dark:text-coffee-300">rates library</Link>, and how paid placements work on the <Link href="/advertise" className="underline text-coffee-700 dark:text-coffee-300">Advertise</Link> page.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">How it works</span>
            <h2 className="section-title">From first email to launch</h2>
          </div>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <li className="card p-5 flex gap-4 items-start hover:translate-x-1 transition-transform duration-300">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-coffee-700 text-white font-bold flex items-center justify-center">{s.n}</span>
                  <div><h3 className="font-bold text-gray-900 dark:text-gray-50">{s.t}</h3><p className="text-sm text-gray-700 dark:text-gray-200">{s.d}</p></div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions partners ask</h2>
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

      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <GridOverlay />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 animate-float" aria-hidden>☕</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">Let&apos;s see what we can build</h2>
          <p className="text-white/65 text-lg mb-8">Tell us who you are and what you have in mind. We reply within two business days.</p>
          <a href={MAIL} className="inline-flex items-center gap-2 bg-coffee-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl text-lg">
            Email hi@datalatte.pro <ArrowRight size={20} />
          </a>
          <div className="mt-4"><CopyEmail /></div>
        </div>
      </section>
    </>
  );
}
