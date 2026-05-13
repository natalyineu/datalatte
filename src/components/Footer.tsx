import Link from "next/link";
import { Mail, MessageCircle, MapPin } from "lucide-react";

const footerLinks = {
  "For Your Business": [
    { label: "Coffee Shops",            href: "/for/coffee-shops" },
    { label: "Hair & Beauty Salons",    href: "/for/hair-salons" },
    { label: "Pet Groomers",            href: "/for/pet-groomers" },
    { label: "Fitness & Yoga Studios",  href: "/for/fitness-studios" },
  ],
  Services: [
    { label: "Google Ads",              href: "/services/google-ads" },
    { label: "Meta Ads",                href: "/services/meta-ads" },
    { label: "Google Business Profile", href: "/services/google-business-profile" },
    { label: "Local SEO",               href: "/services/local-seo" },
    { label: "Analytics & Reporting",   href: "/services/analytics" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Blog",    href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-coffee-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
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
              <a href="mailto:hello@datalatte.pro" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <Mail size={15} /> hello@datalatte.pro
              </a>
              <a href="https://wa.me/1234567890" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                <MessageCircle size={15} /> WhatsApp / Text
              </a>
              <span className="flex items-center gap-2 text-sm">
                <MapPin size={15} /> Serving US Local Businesses
              </span>
            </div>
          </div>

          {/* Links */}
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
