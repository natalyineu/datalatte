import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePagePL from "@/components/pl/ServicePagePL";
import { PL_SERVICES } from "@/content/pl/services";
import { plAlternates } from "@/lib/i18n";

export function generateStaticParams() {
  return PL_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = PL_SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: plAlternates(s.path),
    openGraph: { title: s.seoTitle, description: s.seoDescription, url: `https://datalatte.pro${s.path}`, locale: "pl_PL", siteName: "DataLatte", type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = PL_SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const { slug: _slug, seoTitle, seoDescription, navLabel, short, ...props } = s;
  void _slug; void seoTitle; void seoDescription; void navLabel; void short;
  return <ServicePagePL {...props} />;
}
