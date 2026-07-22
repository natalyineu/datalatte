import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";

export const metadata: Metadata = {
  title:
    "Local Marketing Guides by Country — Digital Marketing for SMBs Worldwide",
  description:
    "Find the best digital marketing strategies for your country. Free local marketing guides for small businesses in 150+ countries — Facebook, Google Ads, WhatsApp, and more.",
  alternates: {
    canonical: "https://datalatte.pro/blog/local-marketing-guides",
  },
  openGraph: {
    title:
      "Local Marketing Guides by Country — Digital Marketing for SMBs Worldwide",
    description:
      "Find the best digital marketing strategies for your country. Free local marketing guides for small businesses in 150+ countries.",
    url: "https://datalatte.pro/blog/local-marketing-guides",
    siteName: "DataLatte",
    type: "website",
  },
};

const contentDir = path.join(process.cwd(), "content/blog");

// ── Region definitions ────────────────────────────────────────────────────────
// Each slug here corresponds to the {country} part of
// local-marketing-{country}-small-business-2026.mdx
const REGIONS: { name: string; emoji: string; slugs: string[] }[] = [
  {
    name: "Europe",
    emoji: "🇪🇺",
    slugs: [
      "albania",
      "austria",
      "belarus",
      "belgium",
      "bosnia-herzegovina",
      "bulgaria",
      "croatia",
      "cyprus",
      "czech-republic",
      "denmark",
      "estonia",
      "finland",
      "france",
      "georgia",
      "germany",
      "greece",
      "hungary",
      "iceland",
      "ireland",
      "italy",
      "kosovo",
      "latvia",
      "lithuania",
      "luxembourg",
      "malta",
      "moldova",
      "montenegro",
      "netherlands",
      "north-macedonia",
      "norway",
      "poland",
      "portugal",
      "romania",
      "russia",
      "serbia",
      "slovakia",
      "slovenia",
      "spain",
      "sweden",
      "switzerland",
      "ukraine",
      "united-kingdom",
    ],
  },
  {
    name: "Americas",
    emoji: "🌎",
    slugs: [
      "argentina",
      "bahamas",
      "barbados",
      "belize",
      "bolivia",
      "brazil",
      "canada",
      "chile",
      "colombia",
      "costa-rica",
      "cuba",
      "dominican-republic",
      "ecuador",
      "el-salvador",
      "guatemala",
      "guyana",
      "haiti",
      "honduras",
      "jamaica",
      "mexico",
      "nicaragua",
      "panama",
      "paraguay",
      "peru",
      "trinidad-tobago",
      "united-states",
      "uruguay",
      "venezuela",
    ],
  },
  {
    name: "Middle East & Africa",
    emoji: "🌍",
    slugs: [
      "algeria",
      "angola",
      "armenia",
      "azerbaijan",
      "bahrain",
      "botswana",
      "cameroon",
      "cape-verde",
      "democratic-republic-congo",
      "dubai-uae",
      "egypt",
      "ethiopia",
      "ghana",
      "iran",
      "iraq",
      "israel",
      "ivory-coast",
      "jordan",
      "kenya",
      "kuwait",
      "lebanon",
      "madagascar",
      "malawi",
      "mauritius",
      "morocco",
      "mozambique",
      "namibia",
      "nigeria",
      "oman",
      "qatar",
      "rwanda",
      "saudi-arabia",
      "senegal",
      "south-africa",
      "tanzania",
      "tunisia",
      "turkey",
      "uganda",
      "zambia",
      "zimbabwe",
    ],
  },
  {
    name: "Asia Pacific",
    emoji: "🌏",
    slugs: [
      "australia",
      "bangladesh",
      "bhutan",
      "cambodia",
      "china",
      "fiji",
      "hong-kong",
      "india",
      "indonesia",
      "japan",
      "kazakhstan",
      "kyrgyzstan",
      "laos",
      "malaysia",
      "maldives",
      "mongolia",
      "myanmar",
      "nepal",
      "new-zealand",
      "pakistan",
      "papua-new-guinea",
      "philippines",
      "singapore",
      "south-korea",
      "sri-lanka",
      "taiwan",
      "tajikistan",
      "thailand",
      "uzbekistan",
      "vietnam",
    ],
  },
  {
    name: "Caribbean",
    emoji: "🏝️",
    slugs: [
      "bahamas",
      "barbados",
      "cuba",
      "dominican-republic",
      "haiti",
      "jamaica",
      "trinidad-tobago",
    ],
  },
];

// ── Pretty display names ──────────────────────────────────────────────────────
const DISPLAY_NAMES: Record<string, string> = {
  albania: "Albania",
  algeria: "Algeria",
  angola: "Angola",
  argentina: "Argentina",
  armenia: "Armenia",
  australia: "Australia",
  austria: "Austria",
  azerbaijan: "Azerbaijan",
  bahamas: "Bahamas",
  bahrain: "Bahrain",
  bangladesh: "Bangladesh",
  barbados: "Barbados",
  belarus: "Belarus",
  belgium: "Belgium",
  belize: "Belize",
  bhutan: "Bhutan",
  bolivia: "Bolivia",
  "bosnia-herzegovina": "Bosnia & Herzegovina",
  botswana: "Botswana",
  brazil: "Brazil",
  bulgaria: "Bulgaria",
  cambodia: "Cambodia",
  cameroon: "Cameroon",
  canada: "Canada",
  "cape-verde": "Cape Verde",
  chile: "Chile",
  china: "China",
  colombia: "Colombia",
  "costa-rica": "Costa Rica",
  croatia: "Croatia",
  cuba: "Cuba",
  cyprus: "Cyprus",
  "czech-republic": "Czech Republic",
  "democratic-republic-congo": "DR Congo",
  denmark: "Denmark",
  "dominican-republic": "Dominican Republic",
  "dubai-uae": "Dubai / UAE",
  ecuador: "Ecuador",
  egypt: "Egypt",
  "el-salvador": "El Salvador",
  estonia: "Estonia",
  ethiopia: "Ethiopia",
  fiji: "Fiji",
  finland: "Finland",
  france: "France",
  georgia: "Georgia",
  germany: "Germany",
  ghana: "Ghana",
  greece: "Greece",
  guatemala: "Guatemala",
  guyana: "Guyana",
  haiti: "Haiti",
  honduras: "Honduras",
  "hong-kong": "Hong Kong",
  hungary: "Hungary",
  iceland: "Iceland",
  india: "India",
  indonesia: "Indonesia",
  iran: "Iran",
  iraq: "Iraq",
  ireland: "Ireland",
  israel: "Israel",
  italy: "Italy",
  "ivory-coast": "Côte d'Ivoire",
  jamaica: "Jamaica",
  japan: "Japan",
  jordan: "Jordan",
  kazakhstan: "Kazakhstan",
  kenya: "Kenya",
  kosovo: "Kosovo",
  kuwait: "Kuwait",
  kyrgyzstan: "Kyrgyzstan",
  laos: "Laos",
  latvia: "Latvia",
  lebanon: "Lebanon",
  lithuania: "Lithuania",
  luxembourg: "Luxembourg",
  madagascar: "Madagascar",
  malawi: "Malawi",
  malaysia: "Malaysia",
  maldives: "Maldives",
  malta: "Malta",
  mauritius: "Mauritius",
  mexico: "Mexico",
  moldova: "Moldova",
  mongolia: "Mongolia",
  montenegro: "Montenegro",
  morocco: "Morocco",
  mozambique: "Mozambique",
  myanmar: "Myanmar",
  namibia: "Namibia",
  nepal: "Nepal",
  netherlands: "Netherlands",
  "new-zealand": "New Zealand",
  nicaragua: "Nicaragua",
  nigeria: "Nigeria",
  "north-macedonia": "North Macedonia",
  norway: "Norway",
  oman: "Oman",
  pakistan: "Pakistan",
  panama: "Panama",
  "papua-new-guinea": "Papua New Guinea",
  paraguay: "Paraguay",
  peru: "Peru",
  philippines: "Philippines",
  poland: "Poland",
  portugal: "Portugal",
  qatar: "Qatar",
  romania: "Romania",
  russia: "Russia",
  rwanda: "Rwanda",
  "saudi-arabia": "Saudi Arabia",
  senegal: "Senegal",
  serbia: "Serbia",
  singapore: "Singapore",
  slovakia: "Slovakia",
  slovenia: "Slovenia",
  "south-africa": "South Africa",
  "south-korea": "South Korea",
  spain: "Spain",
  "sri-lanka": "Sri Lanka",
  sweden: "Sweden",
  switzerland: "Switzerland",
  taiwan: "Taiwan",
  tajikistan: "Tajikistan",
  tanzania: "Tanzania",
  thailand: "Thailand",
  "trinidad-tobago": "Trinidad & Tobago",
  tunisia: "Tunisia",
  turkey: "Turkey",
  uganda: "Uganda",
  ukraine: "Ukraine",
  "united-kingdom": "United Kingdom",
  "united-states": "United States",
  uruguay: "Uruguay",
  uzbekistan: "Uzbekistan",
  venezuela: "Venezuela",
  vietnam: "Vietnam",
  zambia: "Zambia",
  zimbabwe: "Zimbabwe",
};

// ── Data loading ──────────────────────────────────────────────────────────────
interface CountryPost {
  slug: string;
  fullSlug: string;
  title: string;
  description: string;
  displayName: string;
}

function toTitleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function loadCountryPosts(): Map<string, CountryPost> {
  const map = new Map<string, CountryPost>();
  const files = fs.readdirSync(contentDir).filter((f) =>
    /^local-marketing-.+-small-business-2026\.mdx$/.test(f)
  );
  for (const file of files) {
    const fullSlug = file.replace(".mdx", "");
    const countrySlug = fullSlug
      .replace("local-marketing-", "")
      .replace("-small-business-2026", "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data } = matter(raw);
    map.set(countrySlug, {
      slug: countrySlug,
      fullSlug,
      title: (data.title as string) ?? "",
      description: (data.description as string) ?? "",
      displayName: DISPLAY_NAMES[countrySlug] ?? toTitleCase(countrySlug),
    });
  }
  return map;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LocalMarketingGuidesPage() {
  const posts = loadCountryPosts();
  const totalCount = posts.size;

  // Build region data — only include slugs where a file actually exists.
  // Deduplicate slugs within each region (Caribbean overlaps with Americas).
  const regionData = REGIONS.map((region) => {
    const seen = new Set<string>();
    const countries = region.slugs
      .filter((s) => {
        if (!posts.has(s) || seen.has(s)) return false;
        seen.add(s);
        return true;
      })
      .map((s) => posts.get(s)!)
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
    return { ...region, countries };
  }).filter((r) => r.countries.length > 0);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Local Marketing Guides by Country",
    description:
      "Free digital marketing guides for small businesses in 150+ countries.",
    url: "https://datalatte.pro/blog/local-marketing-guides",
    publisher: {
      "@type": "Organization",
      name: "DataLatte",
      url: "https://datalatte.pro",
    },
    hasPart: [...posts.values()].map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `https://datalatte.pro/blog/${p.fullSlug}`,
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
          <span className="section-label">Worldwide Coverage</span>
          <h1 className="section-title mb-4">
            Local Marketing Guides{" "}
            <span className="gradient-text">by Country</span>
          </h1>
          <p className="section-subtitle">
            Every country has its own digital landscape — different social
            platforms, search habits, and ad networks. Browse free marketing
            guides for small businesses in{" "}
            <strong>{totalCount}+ countries</strong> and find the strategies
            that actually work where you are.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            <Link
              href="/blog"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              ← Back to blog
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/services/local-seo"
              className="text-coffee-700 hover:text-coffee-900 hover:underline font-medium transition-colors"
            >
              Local SEO services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Regions ── */}
      <SectionWrapper>
        <div className="space-y-16">
          {regionData.map((region) => (
            <div key={region.name}>
              {/* Region header */}
              <div className="mb-6">
                <span className="section-label">
                  {region.emoji} {region.name}
                </span>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {region.countries.length}{" "}
                  {region.countries.length === 1 ? "guide" : "guides"}{" "}
                  available
                </p>
              </div>

              {/* Country cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {region.countries.map((country) => (
                  <Link
                    key={country.slug}
                    href={`/blog/${country.fullSlug}`}
                    className="card group flex flex-col gap-1 p-4 hover:border-coffee-300 hover:shadow-md transition-all duration-200"
                  >
                    <span className="font-semibold text-gray-800 group-hover:text-coffee-700 transition-colors text-sm leading-tight">
                      {country.displayName}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-snug">
                      {country.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Coverage stats ── */}
        <div className="mt-16 bg-coffee-50 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-coffee-700 uppercase tracking-widest mb-4">
            Coverage at a glance
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {regionData.map((r) => (
              <div key={r.name} className="text-center">
                <div className="text-2xl font-bold text-coffee-800">
                  {r.countries.length}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{r.name}</div>
              </div>
            ))}
            <div className="text-center">
              <div className="text-2xl font-bold text-coffee-800">
                {totalCount}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Total guides</div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Bottom CTA ── */}
      <section className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Need hands-on help with your local marketing?
        </h2>
        <p className="text-gray-400 mb-6 max-w-xl mx-auto">
          Reading a guide is a great start. Let&apos;s turn those insights into
          a real campaign — tailored to your business, city, and budget.
        </p>
        <Link href="/contact" className="btn-primary">
          Get in touch
        </Link>
      </section>
    </>
  );
}
