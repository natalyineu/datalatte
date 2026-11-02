import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { breadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://datalatte.pro/advertise";
const PAGE_TITLE = "Sponsored Content and Advertising at DataLatte";
const PAGE_DESC =
  "How sponsored mentions, sections and articles work on DataLatte: formats, starting prices, disclosure rules, what we refuse and how to book a placement.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: "https://datalatte.pro" },
  { name: "Sponsored content", url: PAGE_URL },
]);

const FORMATS = [
  {
    name: "Sponsored mention",
    price: "from $150",
    what: "50 to 100 words about your product inside one existing article, in the place where readers already compare options. One link.",
    fit: "Tools, platforms and services that fit a topic we already cover.",
  },
  {
    name: "Sponsored section",
    price: "from $300",
    what: "150 to 300 words plus a row in the comparison table, in one existing article. Fact-checked against your own public pages. One or two links.",
    fit: "Vendors who want a fuller explanation next to the competitors we already compare.",
  },
  {
    name: "Sponsored article",
    price: "from $600",
    what: "A new article of 1,200+ words that we research and write, with sources, on a topic we agree together. Marked as sponsored at the top.",
    fit: "Products that need their own page: a tutorial, a comparison or a buyer's guide.",
  },
];

const RULES = [
  "Every sponsored item carries a visible “Sponsored” label next to it.",
  "Every paid link uses rel=\"sponsored\", as Google's guidelines for paid links require. We do not sell links that pass ranking credit.",
  "We check facts and prices against your own public pages and the sources named in the article. Claims we cannot verify are rewritten or removed.",
  "You see the final wording before it goes live. We edit for accuracy, tone and length; we do not publish ad copy as if it were research.",
  "Payment does not change a comparison table, a ranking of options or a conclusion we reached earlier.",
  "We do not guarantee rankings, traffic, leads or sales from a placement.",
];

const REFUSALS = [
  "Products in sensitive categories (gambling, adult, crypto trading, health claims) need a closer look, and we decide case by case.",
  "We need to be able to verify that the product exists and works as described.",
  "Link swaps and bulk guest-post packages are not a fit; single, clearly labelled placements are.",
  "If a request does not suit our readers, we say so and, where we can, suggest a better fit.",
];

export default function AdvertisePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">Sponsored content</span>
          <h1 className="section-title mb-4">
            Advertise on DataLatte,
            <span className="gradient-text"> clearly labelled</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            DataLatte publishes sourced guides on local marketing: ads, local SEO, CTV, outdoor and the tools behind them. We take a small number of sponsored placements from relevant vendors, always labelled, always fact-checked.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">Prices are one-time, in US dollars, and start at the figures below. Updated November 2026.</p>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">Formats and starting prices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FORMATS.map((f) => (
              <div key={f.name} className="card p-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-50">{f.name}</h3>
                <p className="text-2xl font-bold text-coffee-700 dark:text-coffee-300 my-2">{f.price}</p>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">{f.what}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Best for:</strong> {f.fit}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
            The final price depends on the article, the length and how much research the item needs. A placement stays live for as long as the article is published; we may remove it if it becomes inaccurate, and we tell you first.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-14 mb-4">Who reads it</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-3">
            Readers are owners and marketers of small local businesses and the people who advise them, mostly in the US, UK, Canada and Australia. They arrive mid-decision: comparing platforms, checking what an ad channel costs, or choosing a tool.
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-3">
            The site is young and the audience is small. In the 28 days to 31 October 2026, Google Search showed DataLatte pages about 15,100 times (Google Search Console), and impressions were rising week on week. We do not publish a visitor count because we would rather give you the Search Console and analytics screenshots on request than a round number.
          </p>
          <p className="text-gray-700 dark:text-gray-200">
            Sponsored placements are priced for that audience. If you need volume, a sponsored mention here is a small, targeted addition to a wider plan, not a replacement for it.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-14 mb-4">How we handle sponsored content</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200 list-disc pl-5">
            {RULES.map((r) => <li key={r}>{r}</li>)}
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-14 mb-4">What we review carefully</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-200 list-disc pl-5">
            {REFUSALS.map((r) => <li key={r}>{r}</li>)}
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-14 mb-4">How to book</h2>
          <ol className="space-y-2 text-gray-700 dark:text-gray-200 list-decimal pl-5">
            <li>Email <a href="mailto:hi@datalatte.pro" className="text-coffee-700 underline dark:text-coffee-300">hi@datalatte.pro</a> with your product, the article you have in mind and your target market.</li>
            <li>We confirm whether the placement fits the article and send the format, price and timing.</li>
            <li>You send the key facts and the URL for the link. We write or adapt the text and send it for your approval.</li>
            <li>We invoice. You can pay by PayPal, Wise, Revolut or bank transfer.</li>
            <li>We publish within three business days of your approval and share the live URL.</li>
          </ol>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-10">
            Looking for something other than a placement? See our <Link href="/services/local-seo" className="text-coffee-700 underline dark:text-coffee-300">services</Link> or the <Link href="/rates" className="text-coffee-700 underline dark:text-coffee-300">rates library</Link> that shows how we source numbers.
          </p>
        </div>
      </SectionWrapper>

      <CTABanner
        headline="Have a product that fits our readers?"
        sub="Tell us about it and the article you have in mind. We reply within two business days."
        ctaLabel="Email hi@datalatte.pro"
        ctaHref="mailto:hi@datalatte.pro"
      />
    </>
  );
}
