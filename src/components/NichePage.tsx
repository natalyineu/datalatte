import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import TestimonialCard from "@/components/TestimonialCard";

interface NichePageProps {
  niche: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  accentColor: string;
  problems: string[];
  services: { title: string; desc: string; icon: string }[];
  kpis: { metric: string; desc: string; improvement: string }[];
  tactics: { title: string; detail: string }[];
  testimonial: { quote: string; author: string; role: string; rating?: number };
  faq: { q: string; a: string }[];
  ctaHeadline: string;
}

export default function NichePage({
  niche, headline, subheadline, heroImage, accentColor,
  problems, services, kpis, tactics, testimonial, faq, ctaHeadline,
}: NichePageProps) {
  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden ${accentColor} py-24`}>
        <div className="absolute inset-0 opacity-20">
          <Image src={heroImage} alt={niche} fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/15 border border-white/25 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              {niche} Marketing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight text-balance">
              {headline}
            </h1>
            <p className="text-white/75 text-lg mb-8 leading-relaxed">{subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg">
                Get a Free Audit <ArrowRight size={17} />
              </Link>
              <Link href="/services/google-ads" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all">
                See all services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <SectionWrapper className="bg-gray-50">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Sound familiar?</span>
            <h2 className="section-title mb-6">
              The marketing headaches every{" "}
              <span className="gradient-text">{niche.toLowerCase()} owner</span> knows
            </h2>
            <ul className="space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex items-start gap-3 text-gray-600">
                  <span className="text-gray-400 mt-0.5 shrink-0 font-bold">✗</span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-700 font-medium">
              These are fixable problems — and I've seen them across every type of local business.
            </p>
          </div>
          <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image src={heroImage} alt={`${niche} marketing`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </SectionWrapper>

      {/* KPIs */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">What Good Looks Like</span>
          <h2 className="section-title">
            The metrics that actually matter
            <br />
            <span className="gradient-text">for {niche.toLowerCase()}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.metric} className="card p-6 text-center">
              <TrendingUp size={28} className="text-coffee-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-coffee-700 mb-1">{kpi.improvement}</div>
              <div className="font-semibold text-gray-900 mb-2">{kpi.metric}</div>
              <p className="text-sm text-gray-500">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper className="bg-gray-50">
        <div className="text-center mb-12">
          <span className="section-label">How I Help</span>
          <h2 className="section-title">
            Marketing services built for{" "}
            <span className="gradient-text">{niche.toLowerCase()}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div key={svc.title} className="card p-6">
              <div className="text-3xl mb-4">{svc.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{svc.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Tactics */}
      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="section-label">My Approach</span>
            <h2 className="section-title mb-6">
              Specific tactics that work for{" "}
              <span className="gradient-text">{niche.toLowerCase()}</span>
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Every niche has its own seasonality, customer journey, and competitive landscape.
              Here's what I focus on for {niche.toLowerCase()} specifically.
            </p>
          </div>
          <div className="space-y-4">
            {tactics.map((t, i) => (
              <div key={t.title} className="flex gap-4 bg-gray-50 rounded-xl p-5">
                <div className="w-8 h-8 rounded-full bg-coffee-100 text-coffee-700 font-bold text-sm flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t.title}</h4>
                  <p className="text-sm text-gray-500">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Testimonial */}
      <SectionWrapper className="bg-coffee-50">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-label">What Clients Say</span>
          <TestimonialCard {...testimonial} />
          <Link href="/contact" className="btn-primary mt-8">
            Let's talk about your {niche.toLowerCase()} <ArrowRight size={16} />
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                  <CheckCircle2 size={18} className="text-coffee-600 mt-0.5 shrink-0" />
                  {item.q}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed pl-6">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline={ctaHeadline} />
    </>
  );
}
