import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NichePagePL from "@/components/pl/NichePagePL";
import { PL_NICHES, plNicheBySlug } from "@/content/pl/niches";
import { plAlternates } from "@/lib/i18n";

export const dynamicParams = false;
export const generateStaticParams = () => PL_NICHES.map((n) => ({ slug: n.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = plNicheBySlug((await params).slug);
  if (!n) return {};
  return { title: n.seoTitle, description: n.seoDescription, alternates: plAlternates(n.path), openGraph: { title: n.seoTitle, description: n.seoDescription, url: `https://datalatte.pro${n.path}`, locale: "pl_PL", type: "website" } };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const n = plNicheBySlug((await params).slug);
  if (!n) notFound();
  return <NichePagePL n={n} />;
}
