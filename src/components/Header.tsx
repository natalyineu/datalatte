"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

const niches = [
  { label: "Coffee Shops",          href: "/for/coffee-shops" },
  { label: "Hair Salons",           href: "/for/hair-salons" },
  { label: "Pet Groomers",          href: "/for/pet-groomers" },
  { label: "Fitness Studios",       href: "/for/fitness-studios" },
  { label: "Startups",              href: "/for/startups" },
  { label: "Freelancers & Consultants", href: "/for/freelancers" },
  { label: "Growing Businesses",    href: "/for/medium-business" },
  { label: "Enterprise & Agencies", href: "/for/enterprise" },
];

const tools = [
  { label: "Budget Calculator ✨", href: "/tools/marketing-budget-calculator" },
  { label: "AI Agent Builder 🤖",  href: "/tools/ai-agent-builder" },
];

const services = [
  { label: "Google Ads",              href: "/services/google-ads" },
  { label: "Meta Ads",                href: "/services/meta-ads" },
  { label: "TikTok Ads",              href: "/services/tiktok-ads" },
  { label: "Google Business Profile", href: "/services/google-business-profile" },
  { label: "Local SEO",               href: "/services/local-seo" },
  { label: "Content Marketing",       href: "/services/content-marketing" },
  { label: "Reputation Management",   href: "/services/reputation-management" },
  { label: "Video Marketing",         href: "/services/video-marketing" },
  { label: "Analytics & Reporting",   href: "/services/analytics" },
  { label: "Conversion Rate Optimisation", href: "/services/cro" },
  { label: "AI Agents & Automation",  href: "/services/ai-agents" },
  { label: "Email & SMS Marketing",   href: "/services/email-sms" },
  { label: "Social Media",            href: "/services/social-media" },
  { label: "Website & Landing Pages", href: "/services/website" },
];

function DropdownMenu({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={15} className={clsx("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-600 hover:text-coffee-700 hover:bg-coffee-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [mobileNicheOpen, setMobileNicheOpen] = useState(false);
  const [mobileServOpen, setMobileServOpen]   = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 font-display font-bold text-xl">
            <span className="text-coffee-800">Data</span>
            <span className="text-coffee-500">Latte</span>
            <span className="text-coffee-400 text-2xl leading-none">☕</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu label="For Your Business" items={niches} />
            <DropdownMenu label="Services"           items={services} />
            <DropdownMenu label="Free Tools"         items={tools} />
            <Link
              href="/blog"
              className={clsx("text-gray-600 hover:text-gray-900 font-medium transition-colors", pathname === "/blog" && "text-coffee-700")}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={clsx("text-gray-600 hover:text-gray-900 font-medium transition-colors", pathname === "/about" && "text-coffee-700")}
            >
              About
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex">
            <Link href="/contact" className="btn-primary text-sm py-2.5 px-5">
              Get a Free Audit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-6 pt-2 space-y-1">
          <button
            className="flex items-center justify-between w-full py-3 text-gray-700 font-medium"
            onClick={() => setMobileNicheOpen(!mobileNicheOpen)}
          >
            For Your Business
            <ChevronDown size={16} className={clsx("transition-transform", mobileNicheOpen && "rotate-180")} />
          </button>
          {mobileNicheOpen && (
            <div className="pl-4 space-y-1">
              {niches.map((n) => (
                <Link key={n.href} href={n.href} className="block py-2 text-sm text-gray-600 hover:text-coffee-700" onClick={() => setMobileOpen(false)}>
                  {n.label}
                </Link>
              ))}
            </div>
          )}

          <button
            className="flex items-center justify-between w-full py-3 text-gray-700 font-medium"
            onClick={() => setMobileServOpen(!mobileServOpen)}
          >
            Services
            <ChevronDown size={16} className={clsx("transition-transform", mobileServOpen && "rotate-180")} />
          </button>
          {mobileServOpen && (
            <div className="pl-4 space-y-1">
              {services.map((s) => (
                <Link key={s.href} href={s.href} className="block py-2 text-sm text-gray-600 hover:text-coffee-700" onClick={() => setMobileOpen(false)}>
                  {s.label}
                </Link>
              ))}
            </div>
          )}

          {tools.map((t) => (
            <Link key={t.href} href={t.href} className="block py-3 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>{t.label}</Link>
          ))}
          <Link href="/blog"    className="block py-3 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/about"   className="block py-3 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/contact" className="btn-primary w-full justify-center mt-3" onClick={() => setMobileOpen(false)}>
            Get a Free Audit
          </Link>
        </div>
      )}
    </header>
  );
}
