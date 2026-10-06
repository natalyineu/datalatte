import type { Metadata } from "next";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { HUBS } from "@/lib/hubs";

export const metadata: Metadata = {
  title: "Local Marketing Guides: Coffee Shops, Salons, Pet Groomers, Studios",
  description: "Complete guides to local marketing for small businesses: Google Maps, Google Ads, social media, email and AI, grouped by niche with the best articles in one place.",
  alternates: { canonical: "https://datalatte.pro/guides" },
};

const NICHES: Record<string, string> = { coffee: "Coffee shops", salon: "Hair salons & barbershops", pet: "Pet groomers", fitness: "Fitness studios" };

export default function GuidesIndex() {
  const topics = HUBS.filter((h) => !h.niche);
  return (
    <>
      <section className="hero-gradient py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Local marketing guides</h1>
        <p className="text-coffee-200 text-lg max-w-2xl mx-auto">Start here. Each guide collects our best articles on one topic, so you can read in a sensible order instead of searching.</p>
      </section>
      <SectionWrapper>
        {Object.entries(NICHES).map(([k, label]) => (
          <div key={k} className="mb-12">
            <h2 className="section-title !text-2xl md:!text-3xl mb-5">{label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HUBS.filter((h) => h.niche === k).map((h) => (
                <Link key={h.slug} href={`/guides/${h.slug}`} className="card p-5 hover:-translate-y-0.5 transition">
                  <p className="font-semibold text-gray-900 dark:text-gray-50">{h.title.replace(": Complete Guide", "")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{h.count} articles</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <h2 className="section-title !text-2xl md:!text-3xl mb-5">By topic</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((h) => (
            <Link key={h.slug} href={`/guides/${h.slug}`} className="card p-5 hover:-translate-y-0.5 transition">
              <p className="font-semibold text-gray-900 dark:text-gray-50">{h.title.split(":")[0]}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{h.count} articles</p>
            </Link>
          ))}
        </div>
      </SectionWrapper>
      <CTABanner headline="Want this applied to your business?" sub="Tell me about your business and I will reply with a short, honest action plan." ctaLabel="Talk to me" ctaHref="/contact" />
    </>
  );
}
