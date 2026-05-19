import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { CITIES, NICHES, NICHE_DATA, type NicheSlug } from "@/lib/locationData";

export const revalidate = 86400;

function getCity(locationSlug: string) {
  return CITIES.find((c) => c.slug === locationSlug) ?? null;
}

function getNiche(nicheSlug: string) {
  if (!NICHES.includes(nicheSlug as NicheSlug)) return null;
  return NICHE_DATA[nicheSlug as NicheSlug];
}

export async function generateStaticParams() {
  const params: { niche: string; location: string }[] = [];
  for (const niche of NICHES) {
    for (const city of CITIES) {
      params.push({ niche, location: city.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string; location: string }>;
}): Promise<Metadata> {
  const { niche: nicheSlug, location: locationSlug } = await params;
  const niche = getNiche(nicheSlug);
  const city = getCity(locationSlug);
  if (!niche || !city) return {};

  const title = `${niche.label} Marketing in ${city.city}, ${city.stateCode} | DataLatte`;
  const description = `Data-driven marketing for ${niche.labelPlural.toLowerCase()} in ${city.city}, ${city.state}. Local SEO, Google Ads, and reputation management to grow your business.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function LocationNichePage({
  params,
}: {
  params: Promise<{ niche: string; location: string }>;
}) {
  const { niche: nicheSlug, location: locationSlug } = await params;
  const niche = getNiche(nicheSlug);
  const city = getCity(locationSlug);
  if (!niche || !city) notFound();

  const faqItems = niche.faq(city.city, city.state);
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: `${niche.labelPlural} Marketing`, url: `https://datalatte.pro/for/${niche.slug}` },
    { name: `${city.city}, ${city.stateCode}`, url: `https://datalatte.pro/for/${niche.slug}/${city.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqItems)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className={`relative overflow-hidden ${niche.accentClass} py-24`}>
        <div className="absolute inset-0 opacity-15">
          <Image src={niche.heroImage} alt={niche.labelPlural} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-8">
            <Link href="/for" className="hover:text-white transition-colors">Industries</Link>
            <span>›</span>
            <Link href={`/for/${niche.slug}`} className="hover:text-white transition-colors">{niche.labelPlural}</Link>
            <span>›</span>
            <span className="text-white/90">{city.city}, {city.stateCode}</span>
          </nav>
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            {niche.emoji} {niche.label} Marketing · {city.city}, {city.stateCode}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
            {niche.label} Marketing in {city.city}, {city.stateCode}
          </h1>
          <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-2xl">
            {niche.intro(city.city, city.state)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
              Get a Free Audit <ArrowRight size={17} />
            </Link>
            <Link href={`/for/${niche.slug}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Full {niche.label} guide
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mb-8">
            Marketing services for {niche.labelPlural.toLowerCase()} in {city.city}
          </h2>
          <ul className="space-y-4">
            {niche.services.map((service, i) => (
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

      {/* Why local matters */}
      <SectionWrapper className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Why Location Matters</span>
          <h2 className="section-title mb-6">
            Marketing for {niche.labelPlural.toLowerCase()} in {city.city} is different
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
            href={`/for/${niche.slug}`}
            className="inline-flex items-center gap-2 text-coffee-700 font-semibold hover:underline"
          >
            Read our full {niche.label.toLowerCase()} marketing guide <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">FAQ</span>
          <h2 className="section-title mb-8">
            Common questions from {city.city} {niche.labelPlural.toLowerCase()}
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
        headline={`Ready to grow your ${niche.label.toLowerCase()} in ${city.city}?`}
        sub="Free audit — we'll review your current marketing setup and show you exactly where the biggest opportunities are."
      />
    </>
  );
}
