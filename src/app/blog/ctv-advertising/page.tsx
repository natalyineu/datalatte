import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title: "CTV Advertising Guides — Connected TV for Local Business (2026)",
  description:
    "Complete CTV advertising resource hub: platform comparisons, CPM pricing, city guides, and niche playbooks for local businesses running streaming TV ads in 2026.",
  alternates: {
    canonical: "https://datalatte.pro/blog/ctv-advertising",
  },
  openGraph: {
    title: "CTV Advertising Guides — Connected TV for Local Business (2026)",
    description:
      "Platform comparisons, CPM pricing, city guides, and niche playbooks for local businesses running streaming TV ads.",
    url: "https://datalatte.pro/blog/ctv-advertising",
    siteName: "DataLatte",
    type: "website",
  },
};

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

// ── Article types ─────────────────────────────────────────────────────────────

interface Article {
  slug: string;
  title: string;
  description: string;
  label: string;
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
      label: "",
    };
  } catch {
    return null;
  }
}

// ── Static article lists ──────────────────────────────────────────────────────

const ESSENTIALS = [
  "what-is-ctv-advertising-guide-for-local-business-owners-2026",
  "ctv-advertising-platforms-compared-2026",
  "how-much-does-ctv-advertising-cost-real-cpm-data",
  "ctv-vs-ott-advertising-explained",
  "ctv-vs-ott-whats-the-difference-and-which-should-you-buy",
  "is-ctv-advertising-worth-it-small-budget-2026",
  "ctv-advertising-creative-specs-guide-2026",
  "connected-tv-ads-vs-traditional-tv-ads-why-ctv-wins-for-local-business",
  "new-ctv-ad-formats-2026-pause-ads-qr-codes-shoppable",
  "ctv-dooh-omnichannel-strategy-local-business",
  "small-business-super-bowl-season-ctv-ads-2026",
];

const NICHES = [
  { slug: "ctv-ads-for-local-businesses-can-you-advertise-on-streaming-tv", label: "All Local Businesses" },
  { slug: "ctv-ads-for-coffee-shops", label: "Coffee Shops" },
  { slug: "ctv-ads-for-fitness-studios", label: "Fitness Studios" },
  { slug: "ctv-ads-for-hair-salons", label: "Hair Salons" },
  { slug: "ctv-ads-for-restaurants", label: "Restaurants" },
  { slug: "ctv-ads-for-pet-groomers", label: "Pet Groomers" },
  { slug: "ctv-ads-for-nail-salons", label: "Nail Salons" },
  { slug: "ctv-ads-for-barbershops", label: "Barbershops" },
  { slug: "ctv-ads-for-yoga-studios", label: "Yoga Studios" },
];

const US_CITIES = [
  "new-york-city-ny", "los-angeles-ca", "chicago-il", "houston-tx", "phoenix-az",
  "philadelphia-pa", "san-antonio-tx", "san-diego-ca", "dallas-tx", "san-jose-ca",
  "austin-tx", "jacksonville-fl", "fort-worth-tx", "columbus-oh", "san-francisco-ca",
  "charlotte-nc", "indianapolis-in", "seattle-wa", "denver-co", "nashville-tn",
  "oklahoma-city-ok", "el-paso-tx", "las-vegas-nv", "louisville-ky", "baltimore-md",
  "memphis-tn", "albuquerque-nm", "tucson-az", "sacramento-ca", "kansas-city-mo",
  "atlanta-ga", "omaha-ne", "colorado-springs-co", "raleigh-nc", "minneapolis-mn",
  "tampa-fl", "new-orleans-la", "portland-or", "miami-fl", "anaheim-ca",
  "long-beach-ca", "mesa-az", "fresno-ca", "virginia-beach-va", "boston-ma",
  "cleveland-oh", "pittsburgh-pa", "st-louis-mo", "detroit-mi", "honolulu-hi",
  "lexington-ky", "anchorage-ak", "usa",
];

const COUNTRIES = [
  "uk", "australia", "canada", "new-zealand", "ireland",
  "germany", "france", "spain", "italy", "netherlands",
  "europe", "brazil", "mexico", "argentina", "india",
  "japan", "south-korea", "singapore", "uae", "south-africa",
  "poland", "sweden", "norway", "denmark", "finland",
  "austria", "belgium", "switzerland", "portugal", "czech-republic",
  "greece", "hungary", "indonesia", "philippines", "thailand", "turkey",
];

const COUNTRY_NAMES: Record<string, string> = {
  uk: "United Kingdom", australia: "Australia", canada: "Canada",
  "new-zealand": "New Zealand", ireland: "Ireland", germany: "Germany",
  france: "France", spain: "Spain", italy: "Italy", netherlands: "Netherlands",
  europe: "Europe (Overview)", brazil: "Brazil", mexico: "Mexico",
  argentina: "Argentina", india: "India", japan: "Japan",
  "south-korea": "South Korea", singapore: "Singapore", uae: "UAE",
  "south-africa": "South Africa", poland: "Poland", sweden: "Sweden",
  norway: "Norway", denmark: "Denmark", finland: "Finland",
  austria: "Austria", belgium: "Belgium", switzerland: "Switzerland",
  portugal: "Portugal", "czech-republic": "Czech Republic",
  greece: "Greece", hungary: "Hungary", indonesia: "Indonesia",
  philippines: "Philippines", thailand: "Thailand", turkey: "Turkey",
};

const CITY_NAMES: Record<string, string> = {
  "new-york-city-ny": "New York City, NY", "los-angeles-ca": "Los Angeles, CA",
  "chicago-il": "Chicago, IL", "houston-tx": "Houston, TX", "phoenix-az": "Phoenix, AZ",
  "philadelphia-pa": "Philadelphia, PA", "san-antonio-tx": "San Antonio, TX",
  "san-diego-ca": "San Diego, CA", "dallas-tx": "Dallas, TX", "san-jose-ca": "San Jose, CA",
  "austin-tx": "Austin, TX", "jacksonville-fl": "Jacksonville, FL",
  "fort-worth-tx": "Fort Worth, TX", "columbus-oh": "Columbus, OH",
  "san-francisco-ca": "San Francisco, CA", "charlotte-nc": "Charlotte, NC",
  "indianapolis-in": "Indianapolis, IN", "seattle-wa": "Seattle, WA",
  "denver-co": "Denver, CO", "nashville-tn": "Nashville, TN",
  "oklahoma-city-ok": "Oklahoma City, OK", "el-paso-tx": "El Paso, TX",
  "las-vegas-nv": "Las Vegas, NV", "louisville-ky": "Louisville, KY",
  "baltimore-md": "Baltimore, MD", "memphis-tn": "Memphis, TN",
  "albuquerque-nm": "Albuquerque, NM", "tucson-az": "Tucson, AZ",
  "sacramento-ca": "Sacramento, CA", "kansas-city-mo": "Kansas City, MO",
  "atlanta-ga": "Atlanta, GA", "omaha-ne": "Omaha, NE",
  "colorado-springs-co": "Colorado Springs, CO", "raleigh-nc": "Raleigh, NC",
  "minneapolis-mn": "Minneapolis, MN", "tampa-fl": "Tampa, FL",
  "new-orleans-la": "New Orleans, LA", "portland-or": "Portland, OR",
  "miami-fl": "Miami, FL", "anaheim-ca": "Anaheim, CA",
  "long-beach-ca": "Long Beach, CA", "mesa-az": "Mesa, AZ",
  "fresno-ca": "Fresno, CA", "virginia-beach-va": "Virginia Beach, VA",
  "boston-ma": "Boston, MA", "cleveland-oh": "Cleveland, OH",
  "pittsburgh-pa": "Pittsburgh, PA", "st-louis-mo": "St. Louis, MO",
  "detroit-mi": "Detroit, MI", "honolulu-hi": "Honolulu, HI",
  "lexington-ky": "Lexington, KY", "anchorage-ak": "Anchorage, AK",
  usa: "Nationwide USA",
};

// ── Data loading ──────────────────────────────────────────────────────────────

function loadArticles(slugs: string[]): Article[] {
  return slugs
    .map((s) => readArticle(`${s}.mdx`))
    .filter((a): a is Article => a !== null);
}

function citySlugToArticleSlug(citySlug: string) {
  return `ctv-advertising-${citySlug}-local-business-guide`;
}

function countrySlugToArticleSlug(countrySlug: string) {
  return `ctv-advertising-${countrySlug}-small-business-guide`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CTVHubPage() {
  const essentials = loadArticles(ESSENTIALS);
  const niches = NICHES.map(({ slug, label }) => {
    const a = readArticle(`${slug}.mdx`);
    return a ? { ...a, label } : null;
  }).filter((a): a is Article & { label: string } => a !== null);

  const cities = US_CITIES.map((city) => {
    const a = readArticle(`${citySlugToArticleSlug(city)}.mdx`);
    return a ? { ...a, label: CITY_NAMES[city] ?? city } : null;
  }).filter((a): a is Article & { label: string } => a !== null);

  const countries = COUNTRIES.map((country) => {
    const a = readArticle(`${countrySlugToArticleSlug(country)}.mdx`);
    return a ? { ...a, label: COUNTRY_NAMES[country] ?? country } : null;
  }).filter((a): a is Article & { label: string } => a !== null);

  const totalCount = essentials.length + niches.length + cities.length + countries.length;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CTV Advertising Guides for Local Business",
    description:
      "Complete hub for connected TV advertising — platform comparisons, pricing, city guides, and niche playbooks for local businesses.",
    url: "https://datalatte.pro/blog/ctv-advertising",
    publisher: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
    hasPart: [...essentials, ...niches, ...cities, ...countries].map((a) => ({
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

      {/* ── Hero ── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-label">CTV Advertising Hub</span>
          <h1 className="section-title mb-4">
            Connected TV Advertising{" "}
            <span className="gradient-text">for Local Business</span>
          </h1>
          <p className="section-subtitle">
            Everything you need to run streaming TV ads — platform comparisons,
            real CPM data, city guides, and niche-specific playbooks. Updated
            for 2026. {totalCount}+ guides in one place.
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
              href="/services/ctv-advertising"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              CTV advertising service →
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/services/programmatic"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              Programmatic advertising →
            </Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="space-y-20">

          {/* ── Essentials ── */}
          <section>
            <div className="mb-6">
              <span className="section-label">Start here</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">The Essentials</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Platform comparisons, pricing breakdowns, and strategy guides
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          {/* ── By niche ── */}
          <section>
            <div className="mb-6">
              <span className="section-label">By Business Type</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">CTV Ads by Niche</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Industry-specific guides with targeting, budgets, and creative tips
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

          {/* ── US Cities ── */}
          <section>
            <div className="mb-6">
              <span className="section-label">United States</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                CTV Advertising by City
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Local market guides — CPM rates, top DMAs, and campaign tips for {cities.length} US markets
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

          {/* ── International ── */}
          <section>
            <div className="mb-6">
              <span className="section-label">International</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                CTV Advertising by Country
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Market-specific guides for streaming TV advertising outside the US
              </p>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {countries.map((a) => (
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

        {/* ── Stats bar ── */}
        <div className="mt-16 bg-coffee-50 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-coffee-700 uppercase tracking-widest mb-6">
            What&apos;s covered
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { n: essentials.length, label: "Strategy guides" },
              { n: niches.length, label: "Niche playbooks" },
              { n: cities.length, label: "US city guides" },
              { n: countries.length, label: "Country guides" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-coffee-800">{n}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── CTA ── */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to run CTV ads for your business?
        </h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Skip the learning curve. We set up, manage, and optimize your
          connected TV campaigns — with full reporting so you see exactly what
          you&apos;re getting.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/services/ctv-advertising" className="btn-primary">
            CTV advertising service
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
