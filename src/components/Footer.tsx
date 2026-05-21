import Link from "next/link";
import { Mail, MessageCircle, MapPin, Linkedin } from "lucide-react";

const footerLinks = {
  "Industries": [
    { label: "Coffee Shops",          href: "/for/coffee-shops" },
    { label: "Restaurants",           href: "/for/restaurants" },
    { label: "Hair & Beauty Salons",  href: "/for/hair-salons" },
    { label: "Pet Groomers",          href: "/for/pet-groomers" },
    { label: "Fitness Studios",       href: "/for/fitness-studios" },
    { label: "Dentists",              href: "/for/dentists" },
    { label: "Cleaning Services",     href: "/for/cleaning-services" },
    { label: "Real Estate Agents",    href: "/for/real-estate-agents" },
    { label: "Startups",              href: "/for/startups" },
    { label: "Freelancers",           href: "/for/freelancers" },
    { label: "Growing Businesses",    href: "/for/medium-business" },
  ],
  "Services": [
    { label: "Google Ads",              href: "/services/google-ads" },
    { label: "Meta Ads",                href: "/services/meta-ads" },
    { label: "TikTok Ads",              href: "/services/tiktok-ads" },
    { label: "Google Business Profile", href: "/services/google-business-profile" },
    { label: "Local SEO",               href: "/services/local-seo" },
    { label: "Content Marketing",       href: "/services/content-marketing" },
    { label: "Reputation Management",   href: "/services/reputation-management" },
    { label: "Video Marketing",         href: "/services/video-marketing" },
    { label: "CRO",                     href: "/services/cro" },
    { label: "AI Agents",               href: "/services/ai-agents" },
    { label: "Email & SMS",             href: "/services/email-sms" },
    { label: "Social Media",            href: "/services/social-media" },
    { label: "Analytics & Reporting",   href: "/services/analytics" },
    { label: "Website Design",          href: "/services/website" },
  ],
  "Free Tools": [
    { label: "Budget Calculator",       href: "/tools/marketing-budget-calculator" },
    { label: "AI Agent Builder",        href: "/tools/ai-agent-builder" },
    { label: "Free Marketing Audit",    href: "/free-audit" },
  ],
  "Company": [
    { label: "About Nataliia",          href: "/about" },
    { label: "Blog",                    href: "/blog" },
    { label: "Contact",                 href: "/contact" },
    { label: "Free Audit",              href: "/free-audit" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-10">

          {/* Brand */}
          <div className="md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-1.5 font-display font-bold text-xl mb-4">
              <span className="text-coffee-300">Data</span>
              <span className="text-coffee-500">Latte</span>
              <span className="text-coffee-400 text-2xl leading-none">☕</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Data-driven local marketing for the businesses that make our neighborhoods great.
              Brew up better results — without the guesswork.
            </p>
            <div className="space-y-3">
              <a href="mailto:hi@datalatte.pro" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail size={15} /> hi@datalatte.pro
              </a>
              <a href="https://wa.me/48503589781" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <MessageCircle size={15} /> +48 503 589 781
              </a>
              <span className="flex items-start gap-2 text-sm">
                <MapPin size={15} className="shrink-0 mt-0.5" />
                <span>Bałtyk Business Square<br />Poznań, Poland</span>
              </span>
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.linkedin.com/company/datalattepro/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on LinkedIn"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <Linkedin size={16} className="text-gray-300" />
              </a>
              <a
                href="https://t.me/datalattepro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Telegram"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-300">
                  <path d="M21.8 3.1L2.2 10.7c-1.3.5-1.3 1.3-.2 1.6l5 1.6 1.9 5.8c.3.8.4 1.1 1.1 1.1.6 0 .9-.3 1.2-.6l2.9-2.8 5.9 4.4c1.1.6 1.9.3 2.2-.9l3.9-18.3c.4-1.6-.6-2.3-1.3-1.5z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-white font-semibold text-sm mb-4">{group}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-coffee-900 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} DataLatte. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
