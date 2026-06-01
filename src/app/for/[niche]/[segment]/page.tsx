import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import {
  CITIES, NICHES, NICHE_DATA, SERVICE_SEGMENTS, SERVICE_SEGMENT_SLUGS,
  cityCurrency, type NicheSlug,
} from "@/lib/locationData";

export const revalidate = 86400;

function getCity(slug: string) {
  return CITIES.find((c) => c.slug === slug) ?? null;
}

function getNiche(slug: string) {
  if (!NICHES.includes(slug as NicheSlug)) return null;
  return NICHE_DATA[slug as NicheSlug];
}

function getServiceSegment(slug: string) {
  return SERVICE_SEGMENTS[slug] ?? null;
}

export async function generateStaticParams() {
  const params: { niche: string; segment: string }[] = [];
  // Location pages: niche × city
  for (const niche of NICHES) {
    for (const city of CITIES) {
      params.push({ niche, segment: city.slug });
    }
  }
  // Service intersection pages: niche × service
  for (const niche of NICHES) {
    for (const serviceSlug of SERVICE_SEGMENT_SLUGS) {
      params.push({ niche, segment: serviceSlug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string; segment: string }>;
}): Promise<Metadata> {
  const { niche: nicheSlug, segment } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) return {};

  const city = getCity(segment);
  if (city) {
    const title = `${niche.label} Marketing in ${city.city}, ${city.stateCode} | DataLatte`;
    const description = `Data-driven marketing for ${niche.labelPlural.toLowerCase()} in ${city.city}, ${city.state}. Local SEO, Google Ads, and reputation management to grow your business.`;
    const url = `https://datalatte.pro/for/${nicheSlug}/${segment}`;
    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          "en-US": url, "en-GB": url, "en-AU": url, "en-CA": url, "x-default": url,
        },
      },
      openGraph: {
        title, description, url, siteName: "DataLatte", type: "website",
        images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: `${niche.label} Marketing in ${city.city}` }],
      },
    };
  }

  const service = getServiceSegment(segment);
  if (service) {
    const title = `${service.label} for ${niche.labelPlural} | DataLatte`;
    const description = `${service.label} built specifically for ${niche.labelPlural.toLowerCase()}. ${service.tagline(niche.label)} — with the same analytical rigour used at global media agencies.`;
    return {
      title,
      description,
      alternates: {
        canonical: `https://datalatte.pro/for/${nicheSlug}/${segment}`,
        languages: {
          "en-US": `https://datalatte.pro/for/${nicheSlug}/${segment}`,
          "en-GB": `https://datalatte.pro/for/${nicheSlug}/${segment}`,
          "en-AU": `https://datalatte.pro/for/${nicheSlug}/${segment}`,
          "en-CA": `https://datalatte.pro/for/${nicheSlug}/${segment}`,
          "x-default": `https://datalatte.pro/for/${nicheSlug}/${segment}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `https://datalatte.pro/for/${nicheSlug}/${segment}`,
        siteName: "DataLatte",
        type: "website",
        images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: `${service.label} for ${niche.labelPlural}` }],
      },
    };
  }

  return {};
}

// ── Location page ─────────────────────────────────────────────────────────────
function LocationNichePage({ niche: nicheData, city }: {
  niche: ReturnType<typeof getNiche> & object;
  city: NonNullable<ReturnType<typeof getCity>>;
}) {
  const faqItems = nicheData!.faq(city.city, city.state, cityCurrency(city));
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: `${nicheData!.labelPlural} Marketing`, url: `https://datalatte.pro/for/${nicheData!.slug}` },
    { name: `${city.city}, ${city.stateCode}`, url: `https://datalatte.pro/for/${nicheData!.slug}/${city.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className={`relative overflow-hidden ${nicheData!.accentClass} py-24`}>
        <div className="absolute inset-0 opacity-15">
          <Image src={nicheData!.heroImage} alt={nicheData!.labelPlural} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/for/${nicheData!.slug}`} className="hover:text-white transition-colors">{nicheData!.labelPlural}</Link>
            <span>›</span>
            <span className="text-white/90">{city.city}, {city.stateCode}</span>
          </nav>
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            {nicheData!.emoji} {nicheData!.label} Marketing · {city.city}, {city.stateCode}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
            {nicheData!.label} Marketing in {city.city}, {city.stateCode}
          </h1>
          <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-2xl">
            {nicheData!.intro(city.city, city.state)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Audit <ArrowRight size={17} />
            </Link>
            <Link href={`/for/${nicheData!.slug}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Full {nicheData!.label} guide
            </Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mb-8">
            Marketing services for {nicheData!.labelPlural.toLowerCase()} in {city.city}
          </h2>
          <ul className="space-y-4">
            {nicheData!.services.map((service, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-coffee-600 mt-0.5 flex-shrink-0" size={20} />
                <span className="text-gray-700 leading-relaxed">
                  {service.replace(/\${city}/g, city.city)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Why Location Matters</span>
          <h2 className="section-title mb-6">
            Marketing for {nicheData!.labelPlural.toLowerCase()} in {city.city} is different
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            Local search in {city.city} has its own competitive landscape — different keyword volumes, different CPCs,
            and different consumer behaviours than the national average. A campaign that works in a small town
            won&apos;t necessarily perform the same way in {city.city}.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            DataLatte builds campaigns that reflect how {city.city} customers actually search and buy —
            not generic templates applied across every market. That means tighter targeting, better
            quality scores, and lower cost per acquisition.
          </p>
          <Link
            href={`/for/${nicheData!.slug}`}
            className="inline-flex items-center gap-2 text-coffee-700 font-semibold hover:underline"
          >
            Read our full {nicheData!.label.toLowerCase()} marketing guide <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">FAQ</span>
          <h2 className="section-title mb-8">
            Common questions from {city.city} {nicheData!.labelPlural.toLowerCase()}
          </h2>
          <div className="space-y-6">
            {faqItems.map(({ q, a }, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner
        headline={`Ready to grow your ${nicheData!.label.toLowerCase()} in ${city.city}?`}
        sub="Free audit — we'll review your current marketing setup and show you exactly where the biggest opportunities are."
      />
    </>
  );
}

// ── Service intersection page ─────────────────────────────────────────────────
function NicheServicePage({ niche: nicheData, service }: {
  niche: NonNullable<ReturnType<typeof getNiche>>;
  service: NonNullable<ReturnType<typeof getServiceSegment>>;
}) {
  const pageUrl = `https://datalatte.pro/for/${nicheData.slug}/${service.slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: `${nicheData.labelPlural} Marketing`, url: `https://datalatte.pro/for/${nicheData.slug}` },
    { name: service.label, url: pageUrl },
  ]);

  const faqs = [
    {
      q: `Does ${service.shortLabel} work for ${nicheData.labelPlural.toLowerCase()}?`,
      a: `Yes — ${service.shortLabel} is one of the most effective marketing channels for ${nicheData.labelPlural.toLowerCase()}. The key is tailoring the strategy to your specific audience, local competition, and service offering rather than applying a generic template.`,
    },
    {
      q: `How long until I see results from ${service.shortLabel}?`,
      a: service.ctaNote,
    },
    {
      q: `How much does ${service.shortLabel} cost for a ${nicheData.label.toLowerCase()}?`,
      a: `Costs vary based on your market and goals. Use our free Marketing Budget Calculator for a personalised estimate, or request a free audit and I'll recommend a specific budget for your situation.`,
    },
    {
      q: `Can I manage ${service.shortLabel} myself or do I need a consultant?`,
      a: `You can set up the basics yourself, but the details that determine whether campaigns succeed or waste budget — keyword strategy, bid management, audience targeting, conversion tracking — require significant expertise to get right. Most business owners see a 2–4× better return when working with a specialist versus running campaigns themselves.`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className={`relative overflow-hidden ${nicheData.accentClass} py-24`}>
        <div className="absolute inset-0 opacity-15">
          <Image src={nicheData.heroImage} alt={nicheData.labelPlural} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <Link href={`/for/${nicheData.slug}`} className="hover:text-white transition-colors">{nicheData.labelPlural}</Link>
            <span>›</span>
            <span className="text-white/90">{service.label}</span>
          </nav>
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            {service.icon} {service.label} · {nicheData.labelPlural}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
            {service.label} for
            <br />
            <span className="text-coffee-300">{nicheData.labelPlural}</span>
          </h1>
          <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-2xl">
            {service.intro(nicheData.label, nicheData.labelPlural)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Audit <ArrowRight size={17} />
            </Link>
            <Link href={`/for/${nicheData.slug}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Full {nicheData.label} guide
            </Link>
          </div>
        </div>
      </section>

      {/* What's included */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">What I do</span>
          <h2 className="section-title mb-8">
            {service.label} built specifically for {nicheData.labelPlural.toLowerCase()}
          </h2>
          <ul className="space-y-4">
            {service.bullets(nicheData.label).map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 bg-coffee-50 rounded-xl px-5 py-4 border border-coffee-100">
                <CheckCircle2 className="text-coffee-600 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-gray-700 leading-relaxed text-sm">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      {/* Why niche-specific */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Why it matters</span>
          <h2 className="section-title mb-6">
            {service.shortLabel} for {nicheData.labelPlural.toLowerCase()} is different
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-lg">
              A generic {service.shortLabel.toLowerCase()} campaign applied to a {nicheData.label.toLowerCase()} without
              understanding the audience, seasonality, and competitive landscape will underperform.{" "}
              {nicheData.labelPlural} have specific customer journeys, peak booking patterns, and local
              competitive dynamics that shape what works.
            </p>
            <p>
              DataLatte builds {service.shortLabel.toLowerCase()} strategies specifically for{" "}
              {nicheData.labelPlural.toLowerCase()} — not templates copied from other industries. That means
              the right keywords, the right targeting, the right creative approach, and the right success
              metrics for your specific business type.
            </p>
          </div>
          <Link
            href={service.href}
            className="inline-flex items-center gap-2 text-coffee-700 font-semibold mt-6 hover:underline"
          >
            Read the full {service.label} service page <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">
              {service.shortLabel} for {nicheData.labelPlural.toLowerCase()} — common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Related */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore more</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/for/${nicheData.slug}`} className="btn-outline text-sm py-2 px-5">
            All {nicheData.label} marketing <ArrowRight size={13} />
          </Link>
          <Link href={service.href} className="btn-outline text-sm py-2 px-5">
            {service.label} service <ArrowRight size={13} />
          </Link>
          <Link href="/tools/marketing-budget-calculator" className="btn-outline text-sm py-2 px-5">
            Budget calculator <ArrowRight size={13} />
          </Link>
          <Link href="/case-studies" className="btn-outline text-sm py-2 px-5">
            Case studies <ArrowRight size={13} />
          </Link>
        </div>
      </SectionWrapper>

      <CTABanner
        headline={`Ready to get ${service.shortLabel} working for your ${nicheData.label.toLowerCase()}?`}
        sub="Start with a free audit. I'll review your current setup and show you exactly what to do first."
      />
    </>
  );
}

// ── Main page component ───────────────────────────────────────────────────────
export default async function SegmentPage({
  params,
}: {
  params: Promise<{ niche: string; segment: string }>;
}) {
  const { niche: nicheSlug, segment } = await params;
  const niche = getNiche(nicheSlug);
  if (!niche) notFound();

  const city = getCity(segment);
  if (city) {
    return <LocationNichePage niche={niche} city={city} />;
  }

  const service = getServiceSegment(segment);
  if (service) {
    return <NicheServicePage niche={niche} service={service} />;
  }

  notFound();
}
