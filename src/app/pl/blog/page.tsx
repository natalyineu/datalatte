import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Blog o marketingu lokalnym",
  description: "Praktyczne analizy i poradniki marketingu lokalnych firm w Polsce, oparte na danych.",
  alternates: plAlternates("/pl/blog"),
};

export default function Page() {
  const dir = path.join(process.cwd(), "content/blog-pl");
  const posts = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => ({ slug: f.replace(/\.mdx$/, ""), ...matter(fs.readFileSync(path.join(dir, f), "utf8")).data }))
    .sort((a: any, b: any) => String(b.date).localeCompare(String(a.date)));
  return (
    <section className="py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Analizy i poradniki marketingu lokalnych firm w Polsce.</p>
        <div className="space-y-4">
          {posts.map((p: any) => (
            <Link key={p.slug} href={`/pl/blog/${p.slug}`} className="card p-6 block">
              <p className="text-xs text-coffee-600 mb-1">{p.category} · {p.readTime}</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1.5">{p.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
