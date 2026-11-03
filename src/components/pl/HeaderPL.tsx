"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import clsx from "clsx";
import { PL_TO_EN } from "@/lib/i18n";

const services = [
  { label: "Wszystkie usługi", href: "/pl/uslugi" },
  { label: "Google Ads", href: "/pl/uslugi/google-ads" },
  { label: "Meta Ads (Facebook i Instagram)", href: "/pl/uslugi/meta-ads" },
  { label: "Lokalne SEO", href: "/pl/uslugi/lokalne-seo" },
  { label: "Profil Firmy w Google", href: "/pl/uslugi/profil-firmy-w-google" },
];

export default function HeaderPL() {
  const [open, setOpen] = useState(false);
  const [servOpen, setServOpen] = useState(false);
  const [mobServ, setMobServ] = useState(false);
  const pathname = usePathname();
  const enHref = PL_TO_EN[pathname] ?? "/";

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/pl" className="flex items-center gap-1 font-display font-bold text-xl">
            <span className="text-coffee-800 dark:text-coffee-300">Data</span>
            <span className="text-coffee-500">Latte</span>
            <span className="text-coffee-400 text-2xl leading-none">☕</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <div className="relative" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => setServOpen(false)}>
              <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium py-2" onClick={() => setServOpen(!servOpen)} aria-expanded={servOpen}>
                Usługi <ChevronDown size={15} className={clsx("transition-transform", servOpen && "rotate-180")} />
              </button>
              {servOpen && (
                <div className="absolute top-full left-0 pt-1 w-64 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2">
                    {services.map((s) => (
                      <Link key={s.href} href={s.href} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-coffee-700 dark:hover:text-coffee-300 hover:bg-coffee-50 dark:hover:bg-gray-700">{s.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/pl/blog" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">Blog</Link>
            <Link href="/pl/kontakt" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">Kontakt</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href={enHref} hrefLang="en" className="rounded-lg border border-gray-300 dark:border-gray-600 px-2.5 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-coffee-500" aria-label="Switch to English">EN</Link>
            <Link href="/pl/darmowy-audyt" className="btn-primary text-sm py-2.5 px-5">Darmowy audyt</Link>
          </div>

          <button className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-6 pt-2 space-y-1">
          <button className="flex items-center justify-between w-full py-3 text-gray-700 dark:text-gray-200 font-medium" onClick={() => setMobServ(!mobServ)}>
            Usługi <ChevronDown size={16} className={clsx("transition-transform", mobServ && "rotate-180")} />
          </button>
          {mobServ && (
            <div className="pl-4 space-y-1">
              {services.map((s) => (<Link key={s.href} href={s.href} className="block py-2 text-sm text-gray-600 dark:text-gray-300" onClick={() => setOpen(false)}>{s.label}</Link>))}
            </div>
          )}
          <Link href="/pl/blog" className="block py-3 text-gray-700 dark:text-gray-200 font-medium" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/pl/kontakt" className="block py-3 text-gray-700 dark:text-gray-200 font-medium" onClick={() => setOpen(false)}>Kontakt</Link>
          <Link href={enHref} hrefLang="en" className="block py-3 text-gray-700 dark:text-gray-200 font-medium" onClick={() => setOpen(false)}>English version (EN)</Link>
          <Link href="/pl/darmowy-audyt" className="btn-primary w-full justify-center mt-3" onClick={() => setOpen(false)}>Darmowy audyt</Link>
        </div>
      )}
    </header>
  );
}
