import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import { HUBS, getHub, getHubCopy, postTitle } from "@/lib/hubs";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export function generateStaticParams() { return HUBS.map((h) => ({ slug: h.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = getHub(slug); if (!hub) return {};
  const copy = getHubCopy(slug);
  const url = `https://datalatte.pro/guides/${slug}`;
  return {
    title: copy.seoTitle ?? hub.title,
    description: copy.description ?? `${hub.title}. ${hub.count} practical articles on one page, from the basics to advanced tactics, written for small businesses.`,
    alternates: { canonical: url },
    openGraph: { title: copy.seoTitle ?? hub.title, url, siteName: "DataLatte", type: "website" },
    robots: copy.intro?.length ? { index: true, follow: true } : { index: false, follow: true }, // hubs without editorial copy stay out of the index
  };
}

const SERVICE: Record<string, string> = { "maps-seo": "/services/google-business-profile", ads: "/services/google-ads", social: "/services/meta-ads", email: "/services/email-sms", ai: "/services/ai-agents" };

export default async function HubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getHub(slug); if (!hub) notFound();
  const copy = getHubCopy(slug);
  const startHere = (copy.startHere?.length ? copy.startHere.filter((s) => hub.posts.includes(s)) : []).concat(hub.posts).filter((s, i, a) => a.indexOf(s) === i).slice(0, 12);
  const rest = hub.posts.filter((s) => !startHere.includes(s));
  const topic = slug.split("-").slice(1).join("-");
  const service = SERVICE[topic] ?? (hub.niche ? "/services/google-ads" : "/services");
  const url = `https://datalatte.pro/guides/${slug}`;
  const schema = [
    breadcrumbSchema([{ name: "Home", url: "https://datalatte.pro" }, { name: "Guides", url: "https://datalatte.pro/guides" }, { name: hub.title, url }]),
    { "@context": "https://schema.org", "@type": "CollectionPage", name: hub.title, url, mainEntity: { "@type": "ItemList", itemListElement: startHere.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: `https://datalatte.pro/blog/${s}`, name: postTitle(s) })) } },
    ...(copy.faq?.length ? [faqSchema(copy.faq)] : []),
  ];
  return (
    <>
      {schema.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <section className="hero-gradient py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-coffee-200 mb-4"><Link href="/guides" className="hover:underline">Guides</Link> / {hub.title.split(":")[0]}</nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{hub.title}</h1>
          <p className="text-coffee-200">{hub.count} articles in one place, best ones first.</p>
        </div>
      </section>
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          {copy.intro?.map((p, i) => <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-lg">{p}</p>)}
          <h2 className="section-title !text-2xl md:!text-3xl mt-10 mb-5">Start here</h2>
          <ol className="space-y-3">
            {startHere.map((s, i) => (
              <li key={s} className="card p-4"><span className="text-coffee-700 dark:text-coffee-300 font-bold mr-2">{i + 1}.</span><Link href={`/blog/${s}`} className="font-semibold text-gray-900 dark:text-gray-50 hover:underline">{postTitle(s)}</Link></li>
            ))}
          </ol>
          {rest.length > 0 && (
            <details className="mt-8">
              <summary className="cursor-pointer font-semibold text-coffee-700 dark:text-coffee-300">All {hub.count} articles in this guide</summary>
              <ul className="mt-4 space-y-2 columns-1 text-sm">
                {rest.map((s) => <li key={s}><Link href={`/blog/${s}`} className="text-gray-600 dark:text-gray-300 hover:underline">{postTitle(s)}</Link></li>)}
              </ul>
            </details>
          )}
          {copy.faq?.length ? (
            <>
              <h2 className="section-title !text-2xl md:!text-3xl mt-12 mb-5">FAQ</h2>
              {copy.faq.map((f) => (<div key={f.q} className="mb-5"><h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">{f.q}</h3><p className="text-gray-600 dark:text-gray-300">{f.a}</p></div>))}
            </>
          ) : null}
          <p className="mt-10 text-gray-600 dark:text-gray-300">Want help applying this? See <Link className="text-coffee-700 dark:text-coffee-300 underline" href={service}>how I can help</Link> or <Link className="text-coffee-700 dark:text-coffee-300 underline" href="/contact">write to me</Link>.</p>
        </div>
      </SectionWrapper>
      <CTABanner headline="Not sure where to start?" sub="Tell me about your business. I reply with a short, honest action plan." ctaLabel="Talk to me" ctaHref="/contact" />
    </>
  );
}
