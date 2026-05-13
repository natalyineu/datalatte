import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTABannerProps {
  headline?: string;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CTABanner({
  headline = "Ready to brew up better results?",
  sub      = "Let's take a look at your current setup — totally free, no pressure.",
  ctaLabel = "Get Your Free Marketing Audit",
  ctaHref  = "/contact",
}: CTABannerProps) {
  return (
    <section className="hero-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
          {headline}
        </h2>
        <p className="text-coffee-200 text-lg mb-8">{sub}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 bg-white text-coffee-900 font-bold px-8 py-4 rounded-xl hover:bg-coffee-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-lg"
        >
          {ctaLabel}
          <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
