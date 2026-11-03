import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import CopyEmail from "@/components/advertise/CopyEmail";
import CookieSettingsLink from "@/components/pl/CookieSettingsLink";

export default function FooterPL() {
  return (
    <footer className="bg-coffee-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/pl" className="flex items-center gap-1.5 font-display font-bold text-xl mb-4">
              <span className="text-coffee-300">Data</span><span className="text-coffee-500">Latte</span><span className="text-coffee-400 text-2xl leading-none">☕</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">Marketing lokalny oparty na danych dla firm, które tworzą klimat naszych dzielnic. Więcej klientów, mniej zgadywania.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <a href="mailto:hi@datalatte.pro" className="flex items-center gap-2 text-sm hover:text-white"><Mail size={15} /> hi@datalatte.pro</a>
                <CopyEmail />
              </div>
              <a href="https://wa.me/48503589781" className="flex items-center gap-2 text-sm hover:text-white"><MessageCircle size={15} /> +48 503 589 781</a>
              <span className="flex items-start gap-2 text-sm"><MapPin size={15} className="shrink-0 mt-0.5" /><span>Bałtyk Business Square<br />Poznań</span></span>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Usługi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pl/uslugi/google-ads" className="hover:text-white">Google Ads</Link></li>
              <li><Link href="/pl/uslugi/meta-ads" className="hover:text-white">Meta Ads</Link></li>
              <li><Link href="/pl/uslugi/lokalne-seo" className="hover:text-white">Lokalne SEO</Link></li>
              <li><Link href="/pl/uslugi/profil-firmy-w-google" className="hover:text-white">Profil Firmy w Google</Link></li>
              <li><Link href="/pl/uslugi" className="hover:text-white">Wszystkie usługi</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Firma</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pl/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/pl/darmowy-audyt" className="hover:text-white">Darmowy audyt</Link></li>
              <li><Link href="/pl/kontakt" className="hover:text-white">Kontakt</Link></li>
              <li><Link href="/" hrefLang="en" className="hover:text-white">English version</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-coffee-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span>© {new Date().getFullYear()} DataLatte. Wszelkie prawa zastrzeżone.</span>
          <span className="flex gap-4">
            <Link href="/pl/polityka-prywatnosci" className="hover:text-white">Polityka prywatności</Link>
            <CookieSettingsLink />
          </span>
        </div>
      </div>
    </footer>
  );
}
