import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import RatesTable from "@/components/RatesTable";
import { breadcrumbSchema } from "@/lib/schema";
import { AS_OF, BENCHMARKS, PRICES } from "@/data/rates";

const PAGE_URL = "https://datalatte.pro/rates";
const PAGE_TITLE = "Local Marketing Rates & Benchmarks (Sourced)";
const PAGE_DESC = `${BENCHMARKS.length} ad benchmarks and ${PRICES.length} tool prices for local businesses, each with its source, a confidence label and the guide behind it. Updated ${AS_OF}.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

const breadcrumb = breadcrumbSchema([
  { name: "Home", url: "https://datalatte.pro" },
  { name: "Resources", url: "https://datalatte.pro/resources" },
  { name: "Rates & Benchmarks", url: PAGE_URL },
]);

export default function RatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">Rates library</span>
          <h1 className="section-title mb-4">
            What local marketing really costs,
            <span className="gradient-text"> with sources</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Benchmarks and price points we use in our guides. Every row names its source and says how sure we are: read on the publisher&apos;s own page, or only quoted second-hand.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">Updated {AS_OF}. Reference points for planning, not quotes: real prices depend on your market, season and negotiation.</p>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-6xl mx-auto">
          <RatesTable />

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-50 mb-2">How to read the confidence labels</h2>
              <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1.5 list-disc pl-5">
                <li><strong>Report</strong>: we read the figure on the publisher&apos;s own page.</li>
                <li><strong>Rate card</strong>: we read it on the vendor&apos;s pricing page.</li>
                <li><strong>Second-hand</strong>: quoted by a roundup; we could not open the original.</li>
                <li><strong>Estimate</strong>: a vendor or agency estimate, not a measured rate.</li>
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-gray-50 mb-2">Use them, then use your own numbers</h2>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Industry medians include advertisers of every size. Plug them into the{" "}
                <Link href="/tools/marketing-budget-calculator" className="text-coffee-700 underline dark:text-coffee-300">budget calculator</Link>
                {" "}as a starting point, then replace them with your own cost per lead after 30 days. See something out of date? Email{" "}
                <a href="mailto:hi@datalatte.pro" className="text-coffee-700 underline dark:text-coffee-300">hi@datalatte.pro</a> and we will check it.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
