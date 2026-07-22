import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title: "DOOH Advertising Guides — Digital Out-of-Home for Local Business (2026)",
  description:
    "Complete DOOH advertising resource hub: city guides, niche playbooks, CPM benchmarks, and how to launch your first digital billboard campaign for under $500/month.",
  alternates: {
    canonical: "https://datalatte.pro/blog/dooh-advertising",
  },
  openGraph: {
    title: "DOOH Advertising Guides — Digital Out-of-Home for Local Business (2026)",
    description:
      "City guides, niche playbooks, CPM benchmarks, and how to launch digital billboard campaigns from $300/month.",
    url: "https://datalatte.pro/blog/dooh-advertising",
    siteName: "DataLatte",
    type: "website",
  },
};

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

interface Article {
  slug: string;
  title: string;
  description: string;
}

function readArticle(filename: string): Article | null {
  const filepath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  try {
    const raw = fs.readFileSync(filepath, "utf8");
    const { data } = matter(raw);
    const slug = filename.replace(".mdx", "");
    return {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
    };
  } catch {
    return null;
  }
}

const ESSENTIALS = [
  "dooh-advertising-complete-guide-2026",
  "dooh-event-marketing-local-business",
];

const NICHES = [
  { slug: "dooh-advertising-for-coffee-shops", label: "Coffee Shops" },
  { slug: "dooh-advertising-for-hair-salons", label: "Hair Salons" },
  { slug: "dooh-advertising-for-restaurants", label: "Restaurants" },
  { slug: "dooh-advertising-for-fitness-studios", label: "Fitness Studios" },
  { slug: "dooh-advertising-for-pet-groomers", label: "Pet Groomers" },
  { slug: "dooh-advertising-for-nail-salons", label: "Nail Salons" },
  { slug: "dooh-advertising-for-barbershops", label: "Barbershops" },
  { slug: "dooh-advertising-for-yoga-studios", label: "Yoga Studios" },
];

const US_CITIES = [
  { slug: "dooh-advertising-new-york-city", label: "New York City, NY" },
  { slug: "dooh-advertising-los-angeles", label: "Los Angeles, CA" },
  { slug: "dooh-advertising-chicago", label: "Chicago, IL" },
  { slug: "dooh-advertising-houston", label: "Houston, TX" },
  { slug: "dooh-advertising-phoenix", label: "Phoenix, AZ" },
  { slug: "dooh-advertising-philadelphia", label: "Philadelphia, PA" },
  { slug: "dooh-advertising-san-antonio", label: "San Antonio, TX" },
  { slug: "dooh-advertising-san-diego", label: "San Diego, CA" },
  { slug: "dooh-advertising-dallas", label: "Dallas, TX" },
  { slug: "dooh-advertising-san-jose", label: "San Jose, CA" },
  { slug: "dooh-advertising-austin", label: "Austin, TX" },
  { slug: "dooh-advertising-jacksonville", label: "Jacksonville, FL" },
  { slug: "dooh-advertising-fort-worth", label: "Fort Worth, TX" },
  { slug: "dooh-advertising-columbus", label: "Columbus, OH" },
  { slug: "dooh-advertising-san-francisco", label: "San Francisco, CA" },
  { slug: "dooh-advertising-charlotte", label: "Charlotte, NC" },
  { slug: "dooh-advertising-indianapolis", label: "Indianapolis, IN" },
  { slug: "dooh-advertising-seattle", label: "Seattle, WA" },
  { slug: "dooh-advertising-denver", label: "Denver, CO" },
  { slug: "dooh-advertising-nashville", label: "Nashville, TN" },
  { slug: "dooh-advertising-oklahoma-city", label: "Oklahoma City, OK" },
  { slug: "dooh-advertising-el-paso", label: "El Paso, TX" },
  { slug: "dooh-advertising-las-vegas", label: "Las Vegas, NV" },
  { slug: "dooh-advertising-louisville", label: "Louisville, KY" },
  { slug: "dooh-advertising-baltimore", label: "Baltimore, MD" },
  { slug: "dooh-advertising-memphis", label: "Memphis, TN" },
  { slug: "dooh-advertising-albuquerque", label: "Albuquerque, NM" },
  { slug: "dooh-advertising-tucson", label: "Tucson, AZ" },
  { slug: "dooh-advertising-sacramento", label: "Sacramento, CA" },
  { slug: "dooh-advertising-kansas-city", label: "Kansas City, MO" },
  { slug: "dooh-advertising-atlanta", label: "Atlanta, GA" },
  { slug: "dooh-advertising-omaha", label: "Omaha, NE" },
  { slug: "dooh-advertising-colorado-springs", label: "Colorado Springs, CO" },
  { slug: "dooh-advertising-raleigh", label: "Raleigh, NC" },
  { slug: "dooh-advertising-minneapolis", label: "Minneapolis, MN" },
  { slug: "dooh-advertising-tampa", label: "Tampa, FL" },
  { slug: "dooh-advertising-new-orleans", label: "New Orleans, LA" },
  { slug: "dooh-advertising-portland", label: "Portland, OR" },
  { slug: "dooh-advertising-miami", label: "Miami, FL" },
  { slug: "dooh-advertising-anaheim", label: "Anaheim, CA" },
  { slug: "dooh-advertising-long-beach", label: "Long Beach, CA" },
  { slug: "dooh-advertising-mesa", label: "Mesa, AZ" },
  { slug: "dooh-advertising-fresno", label: "Fresno, CA" },
  { slug: "dooh-advertising-virginia-beach", label: "Virginia Beach, VA" },
  { slug: "dooh-advertising-boston", label: "Boston, MA" },
  { slug: "dooh-advertising-cleveland", label: "Cleveland, OH" },
  { slug: "dooh-advertising-pittsburgh", label: "Pittsburgh, PA" },
  { slug: "dooh-advertising-st-louis", label: "St. Louis, MO" },
  { slug: "dooh-advertising-milwaukee", label: "Milwaukee, WI" },
  { slug: "dooh-advertising-honolulu", label: "Honolulu, HI" },
  { slug: "dooh-advertising-lexington", label: "Lexington, KY" },
  { slug: "dooh-advertising-anchorage", label: "Anchorage, AK" },
];

function loadArticles(slugs: string[]): Article[] {
  return slugs.map((s) => readArticle(`${s}.mdx`)).filter((a): a is Article => a !== null);
}

export default function DOOHHubPage() {
  const essentials = loadArticles(ESSENTIALS);
  const niches = NICHES.map(({ slug, label }) => {
    const a = readArticle(`${slug}.mdx`);
    return a ? { ...a, label } : null;
  }).filter((a): a is Article & { label: string } => a !== null);

  const cities = US_CITIES.map(({ slug, label }) => {
    const a = readArticle(`${slug}.mdx`);
    return a ? { ...a, label } : null;
  }).filter((a): a is Article & { label: string } => a !== null);

  const totalCount = essentials.length + niches.length + cities.length;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "DOOH Advertising Guides for Local Business",
    description:
      "Complete hub for digital out-of-home advertising — city guides, niche playbooks, CPM benchmarks, and campaign setup for local businesses.",
    url: "https://datalatte.pro/blog/dooh-advertising",
    publisher: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
    hasPart: [...essentials, ...niches, ...cities].map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `https://datalatte.pro/blog/${a.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">DOOH Advertising Hub</span>
          <h1 className="section-title mb-4">
            Digital Out-of-Home Advertising{" "}
            <span className="gradient-text">for Local Business</span>
          </h1>
          <p className="section-subtitle">
            Everything you need to run digital billboard campaigns — CPM
            benchmarks, city-specific screen maps, niche playbooks, and
            step-by-step setup guides. Starting from $300/month. {totalCount}+
            guides in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            <Link
              href="/blog"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              ← All articles
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/services/programmatic"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              Programmatic advertising service →
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/blog/ctv-advertising"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              CTV advertising guides →
            </Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="space-y-20">

          {/* Essentials */}
          {essentials.length > 0 && (
            <section>
              <div className="mb-6">
                <span className="section-label">Start here</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">The Essentials</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Complete guide and strategy overview
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {essentials.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="card group flex flex-col gap-2 p-5 hover:border-coffee-300 hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-coffee-700 transition-colors text-sm leading-snug">
                      {a.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-snug">
                      {a.description}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* By niche */}
          <section>
            <div className="mb-6">
              <span className="section-label">By Business Type</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">DOOH by Niche</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Industry-specific guides with screen recommendations, budgets, and creative tips
              </p>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {niches.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="card group flex flex-col gap-1 p-4 hover:border-coffee-300 hover:shadow-md transition-all duration-200"
                >
                  <span className="font-semibold text-gray-800 group-hover:text-coffee-700 transition-colors text-sm leading-tight">
                    {a.label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-snug">
                    {a.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* US Cities */}
          <section>
            <div className="mb-6">
              <span className="section-label">United States</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                DOOH Advertising by City
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                CPM benchmarks, screen locations, and campaign setup for {cities.length} US markets
              </p>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {cities.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="card group flex flex-col gap-1 p-4 hover:border-coffee-300 hover:shadow-md transition-all duration-200"
                >
                  <span className="font-semibold text-gray-800 group-hover:text-coffee-700 transition-colors text-sm leading-tight">
                    {a.label}
                  </span>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* Stats bar */}
        <div className="mt-16 bg-coffee-50 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-coffee-700 uppercase tracking-widest mb-6">
            What&apos;s covered
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: essentials.length, label: "Strategy guides" },
              { n: niches.length, label: "Niche playbooks" },
              { n: cities.length, label: "City guides" },
              { n: "$3–10", label: "Typical CPM range" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-coffee-800">{n}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to put your business on digital screens?
        </h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          We set up and manage DOOH campaigns across Vistar Media, StackAdapt,
          and Place Exchange — with geo-targeting, creative specs, and weekly
          reporting included.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/services/programmatic" className="btn-primary">
            Programmatic advertising service
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 hover:text-white transition-colors font-medium"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </>
  );
}
