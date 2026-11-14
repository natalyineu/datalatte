import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import Segments from "@/components/Segments";
import PartnerStrip from "@/components/PartnerStrip";
import { breadcrumbSchema } from "@/lib/schema";

const URL_ = "https://datalatte.pro/for";
const TITLE = "Marketing for Local Businesses, Startups & Growing Brands";
const DESC =
  "Industry-specific marketing for cafés, salons, clinics, studios, trades, startups, freelancers and multi-location brands. Find your industry and see what works.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL_ },
  openGraph: { title: TITLE, description: DESC, url: URL_, siteName: "DataLatte", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function ForIndexPage() {
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: "Industries", url: URL_ },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <section className="hero-gradient text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-coffee-200 border border-white/20 rounded-full px-4 py-1.5 mb-5">Industries</span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance">
            Marketing for <span className="text-coffee-300">local businesses, startups</span> and growing brands
          </h1>
          <p className="mt-5 text-lg text-white/75 max-w-2xl mx-auto">
            Different customers, different levers. Pick your industry to see the channels, costs and playbooks that fit it.
          </p>
        </div>
      </section>
      <SectionWrapper>
        <Segments />
        <p className="mt-12 text-center text-gray-600 dark:text-gray-400">
          Your business is not listed? That is fine: the same data-driven method works for any local or online business.{" "}
          <Link href="/contact" className="font-semibold text-coffee-700 dark:text-coffee-300 hover:underline">Tell us what you do</Link>.
        </p>
      </SectionWrapper>
      <PartnerStrip />
      <CTABanner />
    </>
  );
}
