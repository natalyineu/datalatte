import Link from "next/link";
import CopyEmail from "@/components/advertise/CopyEmail";
import { Mail, MessageCircle, MapPin, Linkedin, Instagram } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

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
    { label: "Competitor Analysis",      href: "/services/competitor-analysis" },
    { label: "Analytics & Reporting",   href: "/services/analytics" },
    { label: "Website Design",          href: "/services/website" },
  ],
  "Free Tools": [
    { label: "Budget Calculator",       href: "/tools/marketing-budget-calculator" },
    { label: "AI Agent Builder",        href: "/tools/ai-agent-builder" },
    { label: "Local SEO Grader",        href: "/tools/local-seo-grader" },
    { label: "Ad Break-Even Calculator", href: "/tools/ad-break-even-calculator" },
    { label: "Marketing Checklists",    href: "/checklists" },
    { label: "Free Marketing Audit",    href: "/free-audit" },
  ],
  "Company": [
    { label: "About Nataliia",          href: "/about" },
    { label: "Guides",                  href: "/guides" },
    { label: "Blog",                    href: "/blog" },
    { label: "Client Results",          href: "/results" },
    { label: "Case Studies",            href: "/case-studies" },
    { label: "⚡ Value Radar",          href: "/radar" },
    { label: "Reporting",               href: "/reporting" },
    { label: "Pricing",                 href: "/pricing" },
    { label: "Advertise",               href: "/advertise" },
    { label: "Partnerships",            href: "/partnerships" },
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
              <div className="flex items-center gap-2 flex-wrap">
                <a href="mailto:hi@datalatte.pro" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Mail size={15} /> hi@datalatte.pro
                </a>
                <CopyEmail />
              </div>
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
                href="https://x.com/datalattepro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on X (Twitter)"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
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
              <a
                href="https://www.instagram.com/datalattepro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Instagram"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <Instagram size={16} className="text-gray-300" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61596111221507"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Facebook"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300" aria-hidden="true">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
                </svg>
              </a>
              <a
                href="https://www.threads.com/@datalattepro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Threads"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300" aria-hidden="true">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/datalattepro/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Pinterest"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300" aria-hidden="true">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
              <a
                href="https://medium.com/@datalatte.pro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Medium"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
              <a
                href="https://clutch.co/profile/datalatte"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Clutch"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                {/* Clutch logo mark */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a7 7 0 110 14A7 7 0 0112 5zm0 2a5 5 0 100 10A5 5 0 0012 7zm0 2a3 3 0 110 6 3 3 0 010-6z"/>
                </svg>
              </a>
              <a
                href="https://www.crunchbase.com/organization/datalatte-pro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="DataLatte on Crunchbase"
                className="w-9 h-9 rounded-lg bg-coffee-900 hover:bg-coffee-700 flex items-center justify-center transition-colors"
              >
                {/* Crunchbase CB monogram */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M21 4H3a1 1 0 00-1 1v14a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1zM9.5 15.5A3.5 3.5 0 016 12a3.5 3.5 0 013.5-3.5c1.1 0 2.07.51 2.7 1.3l-1.44 1.44A1.5 1.5 0 009.5 10.5 1.5 1.5 0 008 12a1.5 1.5 0 001.5 1.5c.57 0 1.07-.32 1.33-.79l1.44 1.44A3.47 3.47 0 019.5 15.5zm8.5-.5h-1.5v-1H15v1h-1.5V9H15v1h1.5V9H18v6z"/>
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

        {/* Newsletter */}
        <div className="border-t border-coffee-900 mt-14 pt-12 pb-6">
          <div className="max-w-lg">
            <NewsletterForm source="footer" />
          </div>
        </div>

        <div className="border-t border-coffee-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} DataLatte. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/pl" hrefLang="pl" className="hover:text-white transition-colors">Polski</Link>
            <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
            <a href="/llms.txt" className="opacity-50 hover:opacity-100 hover:text-white transition-colors">llms.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
