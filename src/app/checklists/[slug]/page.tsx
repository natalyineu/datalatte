import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { checklists, getChecklist, getTotalItems } from "@/lib/checklists";
import ChecklistClient from "./ChecklistClient";

export function generateStaticParams() {
  return checklists.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const checklist = getChecklist(slug);

  if (!checklist) {
    return { title: "Checklist Not Found" };
  }

  const totalItems = getTotalItems(checklist);
  const url = `https://datalatte.pro/checklists/${slug}`;

  return {
    title: checklist.title,
    description: `${checklist.description} ${totalItems}-item checklist with ${checklist.sections.length} sections. ${checklist.timeEstimate} · ${checklist.difficulty}.`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${checklist.title} | DataLatte`,
      description: checklist.description,
      url,
      type: "website",
    },
  };
}

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const checklist = getChecklist(slug);

  if (!checklist) {
    notFound();
  }

  return <ChecklistClient checklist={checklist} />;
}
