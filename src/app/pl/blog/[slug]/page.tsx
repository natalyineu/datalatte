import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { mdxComponents } from "@/components/pl/mdxComponentsPL";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import CTABanner from "@/components/CTABanner";
import { plAlternates } from "@/lib/i18n";

export const dynamicParams = false;
const dir = path.join(process.cwd(), "content/blog-pl");

const load = (slug: string) => {
  const f = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(f)) return null;
  return matter(fs.readFileSync(f, "utf8"));
};

export function generateStaticParams() {
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = load(slug);
  if (!p) return {};
  const d = p.data;
  return {
    title: d.title,
    description: d.description,
    alternates: plAlternates(`/pl/blog/${slug}`),
    openGraph: { title: d.title, description: d.description, url: `https://datalatte.pro/pl/blog/${slug}`, locale: "pl_PL", type: "article", images: d.image ? [d.image] : undefined },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = load(slug);
  if (!p) notFound();
  const d = p.data;
  const date = new Date(d.date).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: d.title, description: d.description, inLanguage: "pl",
    datePublished: d.date, dateModified: d.lastModified ?? d.date, image: d.image,
    author: { "@type": "Person", name: d.author, url: "https://datalatte.pro/about" },
    publisher: { "@type": "Organization", name: "DataLatte", url: "https://datalatte.pro" },
    mainEntityOfPage: `https://datalatte.pro/pl/blog/${slug}`,
  };
  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto mb-8">
          <Link href="/pl/blog" className="inline-flex items-center gap-1 text-sm text-coffee-700 dark:text-coffee-300 hover:underline mb-4"><ArrowLeft size={14} /> Wszystkie artykuły</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">{d.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span><span>·</span><span>{d.author}</span><span>·</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {d.readTime}</span>
          </div>
        </div>
        <div className="flex gap-12 items-start">
          <div className="flex-1 min-w-0 max-w-3xl mx-auto">
            <TableOfContents source={p.content} variant="mobile" />
            <div className="prose-datalatte">
              <MDXRemote source={p.content} components={mdxComponents} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
          </div>
          <TableOfContents source={p.content} variant="desktop" />
        </div>
      </div>
      <CTABanner headline="Chcesz to samo dla swojej firmy?" sub="Sprawdzę Twoją widoczność w Google i napiszę, co poprawić w pierwszej kolejności." ctaLabel="Poproś o darmowy audyt" ctaHref="/pl/darmowy-audyt" />
    </>
  );
}
