import type { Metadata } from "next";
import HeaderPL from "@/components/pl/HeaderPL";
import FooterPL from "@/components/pl/FooterPL";
import ConsentBanner from "@/components/pl/ConsentBanner";

export const metadata: Metadata = {
  title: { default: "DataLatte: marketing lokalny oparty na danych", template: "%s | DataLatte" },
  description: "Google Ads, Meta Ads, lokalne SEO i Profil Firmy w Google dla kawiarni, salonów, groomerów i studiów fitness. Mniej zgadywania, więcej klientów.",
  openGraph: { locale: "pl_PL", siteName: "DataLatte", type: "website" },
};

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="pl">
      {/* the root layout is shared with the English site, so set the document language for Polish pages here */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='pl'" }} />
      <HeaderPL />
      {children}
      <FooterPL />
      <ConsentBanner />
    </div>
  );
}
