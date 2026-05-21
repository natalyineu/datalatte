import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { faqSchema, breadcrumbSchema, serviceSchema } from "@/lib/schema";

interface ServicePageProps {
  service: string;
  tagline: string;
  description: string;
  icon: string;
  accentClass: string;
  whatItIs: string;
  howItWorks: { step: string; title: string; desc: string }[];
  included: string[];
  notIncluded?: string[]; // kept for backward compat but ignored
  bestFor: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
}

const SERVICE_SLUGS: Record<string, string> = {
  "Google Ads": "google-ads",
  "Meta Ads": "meta-ads",
  "Local SEO": "local-seo",
  "Google Business Profile": "google-business-profile",
  "Analytics & Reporting": "analytics",
  "AI Agents & Automation": "ai-agents",
  "Email & SMS Marketing": "email-sms",
  "Social Media Management": "social-media",
  "Website & Landing Pages": "website",
  "Content Marketing": "content-marketing",
  "Reputation Management": "reputation-management",
  "Conversion Rate Optimisation": "cro",
  "Video Marketing": "video-marketing",
  "TikTok Ads": "tiktok-ads",
};

export default function ServicePage({
  service, tagline, description, icon, accentClass,
  whatItIs, howItWorks, included, bestFor, faqs, relatedLinks,
}: ServicePageProps) {
  const slug = SERVICE_SLUGS[service] ?? service.toLowerCase().replace(/[\s&]+/g, "-").replace(/[^a-z0-9-]/g, "");
  const serviceUrl = `https://datalatte.pro/services/${slug}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: "https://datalatte.pro" },
    { name: service, url: serviceUrl },
  ]);

  return (
    <>
      {/* FAQPage + BreadcrumbList + Service structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema({ name: service, description, url: serviceUrl })) }}
      />

      {/* Hero */}
      <section className={`${accentClass} py-24 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-5">{icon}</div>
          <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            Service
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-balance">{service}</h1>
          <p className="text-xl text-white/80 font-medium mb-3">{tagline}</p>
          <p className="text-white/65 max-w-2xl mx-auto mb-8 leading-relaxed">{description}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
            Request a Free Audit <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* What it is */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <span className="section-label">The Basics</span>
          <h2 className="section-title mb-6">What is {service}, really?</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{whatItIs}</p>
        </div>
      </SectionWrapper>

      {/* How it works */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">My Process</span>
          <h2 className="section-title">
            How I approach <span className="gradient-text">{service}</span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {howItWorks.map((item) => (
            <div key={item.step} className="flex gap-5 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-coffee-100 text-coffee-700 font-bold text-sm flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Included */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
            <span className="text-coffee-600">✓</span> Everything included in {service}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-2.5 bg-coffee-50 rounded-xl px-4 py-3 border border-coffee-100">
                <CheckCircle2 size={17} className="text-coffee-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Best for */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-3xl mx-auto">
          <span className="section-label">Is This Right for You?</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{service} works best for:</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {bestFor.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-coffee-100">
                <CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions about {service}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Related */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900">Explore related services</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <CTABanner />
    </>
  );
}
