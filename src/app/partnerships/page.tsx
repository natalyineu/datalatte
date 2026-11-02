import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Handshake, Mail, Megaphone, Network, Presentation, Users } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
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

const TYPES = [
  {
    icon: Presentation,
    title: "Tool and platform partners",
    who: "Software, ad platforms and services for local businesses",
    text: "We test your product against our own checklist and write an honest hands-on review or comparison entry, with your pricing and features verified on your public pages. A free trial or demo account helps; it never buys a verdict.",
    gives: "Hands-on review, comparison-table entry, factual corrections welcome.",
  },
  {
    icon: Megaphone,
    title: "Co-marketing",
    who: "Brands with a shared audience of small-business owners",
    text: "Joint guides, checklists, webinars and calculators. You bring expertise or data, we bring structure, editing and distribution to our readers and subscribers.",
    gives: "Co-branded resource, joint promotion, shared lead list only with each reader's consent.",
  },
  {
    icon: Handshake,
    title: "Referral partners",
    who: "Agencies, consultants and freelancers",
    text: "We introduce local businesses that need services we do not provide, and you do the same for us. Any fee or revenue share is agreed in writing before the first introduction.",
    gives: "Qualified introductions in both directions, clear written terms.",
  },
  {
    icon: Network,
    title: "Data and research partners",
    who: "Publishers, analysts and platforms that hold benchmarks",
    text: "We cite primary sources in our guides and rates library. If you publish benchmarks or run studies on local advertising, we can reference them, link to them and help present them.",
    gives: "Cited, linked references and joint write-ups of new research.",
  },
  {
    icon: Users,
    title: "Local organizations",
    who: "Chambers of commerce, business associations, SBDCs and communities",
    text: "Free guides, calculators and checklists for your members, plus workshops or Q&A sessions on local marketing. Content stays free for your members.",
    gives: "Member resources, guest sessions, co-hosted events.",
  },
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

      <section className="hero-gradient py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-coffee-200 text-sm font-semibold tracking-widest uppercase mb-4">Partnerships</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">Build something useful for local businesses, together</h1>
          <p className="text-coffee-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            DataLatte works with tools, platforms, agencies, researchers and local organizations that serve small-business owners. We bring sourced guides, careful editing and a readership that is choosing how to market. You bring a product, expertise or an audience.
          </p>
          <p className="text-white text-xl md:text-2xl font-semibold mb-8">
            Write to us: <a href="mailto:hi@datalatte.pro" className="underline decoration-coffee-300 underline-offset-4 hover:text-coffee-200">hi@datalatte.pro</a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={MAIL} className="inline-flex items-center justify-center gap-2 bg-white text-coffee-900 font-bold px-8 py-4 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-lg">
              Start a conversation <ArrowRight size={20} />
            </a>
            <Link href="/advertise" className="inline-flex items-center justify-center gap-2 border border-coffee-200 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-lg">
              Looking to advertise instead?
            </Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label">Ways to partner</span>
            <h2 className="section-title">Five kinds of partnership we are open to</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TYPES.map((t) => (
              <div key={t.title} className="card p-6 flex flex-col">
                <t.icon className="text-coffee-700 dark:text-coffee-300 mb-3" size={28} aria-hidden />
                <h3 className="font-bold text-gray-900 dark:text-gray-50">{t.title}</h3>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mt-1 mb-3">{t.who}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4 flex-1">{t.text}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200"><strong>You get:</strong> {t.gives}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Our principles</span>
            <h2 className="section-title">What every partner can count on</h2>
          </div>
          <ul className="space-y-3 text-gray-700 dark:text-gray-200">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-3"><BadgeCheck size={20} className="text-coffee-600 mt-0.5 shrink-0" aria-hidden />{p}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-6">
            See how we source numbers in our <Link href="/rates" className="underline text-coffee-700 dark:text-coffee-300">rates library</Link>, and how paid placements work on the <Link href="/advertise" className="underline text-coffee-700 dark:text-coffee-300">Advertise</Link> page.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">How it works</span>
            <h2 className="section-title">From first email to launch</h2>
          </div>
          <ol className="space-y-4">
            {STEPS.map((s) => (
              <li key={s.n} className="card p-5 flex gap-4 items-start">
                <span className="shrink-0 w-9 h-9 rounded-full bg-coffee-700 text-white font-bold flex items-center justify-center">{s.n}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-50">{s.t}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-gray-50 dark:bg-gray-900">
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

      <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Mail className="mx-auto text-coffee-200 mb-4" size={36} aria-hidden />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">Let&apos;s see what we can build</h2>
          <p className="text-coffee-200 text-lg mb-8">Tell us who you are and what you have in mind. We reply within two business days.</p>
          <a href={MAIL} className="inline-flex items-center gap-2 bg-white text-coffee-900 font-bold px-8 py-4 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-lg">
            Email hi@datalatte.pro <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </>
  );
}
