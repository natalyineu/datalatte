import Link from "next/link";
import { ArrowRight, CheckCircle2, X, Check, ChevronRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import ScrollReveal from "@/components/ScrollReveal";
import { breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/schema";

interface ServicePageProps {
  service: string;
  path: string; // e.g. /pl/uslugi/google-ads
  titles?: { basics?: string; process?: string; included?: string; bestFor?: string; faq?: string };
  tagline: string;
  description: string;
  icon: string;
  accentClass: string;
  whatItIs: string;
  howItWorks: { step: string; title: string; desc: string }[];
  included: string[];
  notIncluded?: string[];
  bestFor: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  beforeAfter?: { before: string; after: string }[];
  stats?: { value: string; label: string }[];
}

const DEFAULT_STATS = [
  { value: "10+",    label: "lat doświadczenia w marketingu" },
  { value: "48 h",   label: "na pierwszy audyt" },
  { value: "0",      label: "umów na rok" },
  { value: "Wprost", label: "kontakt z Nataliią" },
];

const DEFAULT_BEFORE_AFTER = [
  { before: "Nie wiesz, co naprawdę działa",            after: "Jasny raport co tydzień: co działa i dlaczego" },
  { before: "Płacisz agencji, która Cię nie słucha",    after: "Bezpośredni kontakt z osobą, która prowadzi kampanie" },
  { before: "Budżet idzie w dym, bez jasnego zwrotu",   after: "Koszt pozyskania klienta liczony od pierwszego dnia" },
  { before: "Umowa na 12 miesięcy",                      after: "Rozliczenie miesięczne, rezygnacja w każdej chwili" },
  { before: "Ogólne kampanie, ogólne wyniki",            after: "Strategia pod Twoją branżę i Twoje miasto" },
];

export default function ServicePage({
  service, path, titles = {}, tagline, description, icon, accentClass,
  whatItIs, howItWorks, included, bestFor, faqs, relatedLinks,
  beforeAfter = DEFAULT_BEFORE_AFTER,
  stats = DEFAULT_STATS,
}: ServicePageProps) {
  const serviceUrl = `https://datalatte.pro${path}`;
  const breadcrumb = breadcrumbSchema([
    { name: "Strona główna", url: "https://datalatte.pro/pl" },
    { name: "Usługi", url: "https://datalatte.pro/pl/uslugi" },
    { name: service, url: serviceUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema({ name: service, description, url: serviceUrl })) }} />
      {faqs?.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }} />}

      {/* ── Hero ── */}
      <section className={`relative overflow-hidden ${accentClass} pt-24 pb-28 px-4 sm:px-6 lg:px-8`}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Floating badges */}
        <div className="absolute left-6 top-20 lg:left-16 lg:top-24 hidden sm:block animate-float opacity-90">
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">Darmowy audyt</span>
            <span className="text-green-300 font-bold">w 48 godzin</span>
          </div>
        </div>
        <div className="absolute right-6 top-24 lg:right-20 lg:top-28 hidden sm:block animate-float-r opacity-90" style={{ animationDelay: "0.8s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/70">Rozliczenie miesięczne</span>
            <span className="text-green-300 font-bold">bez wiązania</span>
          </div>
        </div>
        <div className="absolute left-12 bottom-16 lg:left-28 hidden lg:block animate-float opacity-75" style={{ animationDelay: "1.5s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-coffee-400 animate-pulse shrink-0" />
            <span className="text-white/70">Raport tygodniowy</span>
            <span className="text-coffee-200 font-bold">co poniedziałek</span>
          </div>
        </div>
        <div className="absolute right-10 bottom-20 lg:right-24 hidden lg:block animate-float-r opacity-75" style={{ animationDelay: "0.4s" }}>
          <div className="bg-black/40 backdrop-blur border border-white/15 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
            <span className="text-white/70">Start</span>
            <span className="text-blue-200 font-bold">gotowe w 5 dni ✓</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-6xl mb-5 animate-float" style={{ animationDelay: "0.2s" }}>{icon}</div>
          <span className="inline-block bg-white/10 border border-white/20 text-white/70 text-xs font-mono px-4 py-1.5 rounded-full mb-5 tracking-wider uppercase">
            {service}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">{tagline}</h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-5 leading-relaxed text-lg">{description}</p>
          {/* Monospace flow indicator */}
          <p className="text-white/80 text-xs font-mono mb-10 max-w-2xl mx-auto tracking-wide">
            {howItWorks.map((s, i) => (
              <span key={s.step}>
                {s.title}
                {i < howItWorks.length - 1 && <span className="mx-2 text-coffee-600 dark:text-coffee-400">→</span>}
              </span>
            ))}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pl/darmowy-audyt" className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-100 transition-all hover:shadow-lg dark:bg-gray-900 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-white">
              Poproś o darmowy audyt <ArrowRight size={17} />
            </Link>
            <Link href="/pl/kontakt" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              Napisz do nas →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-gray-950 border-b border-gray-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08} direction="up">
              <div>
                <div className="text-xl font-bold text-coffee-300">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ── Before / After ── */}
      <SectionWrapper>
        <div className="text-center mb-10">
          <span className="section-label">Różnica</span>
          <h2 className="section-title">Brzmi znajomo? <span className="gradient-text">Oto rozwiązanie.</span></h2>
        </div>
        <div className="max-w-3xl mx-auto divide-y divide-gray-100 dark:divide-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            <div className="px-5 py-3 border-r border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <X size={13} className="text-red-400" /> Przed
            </div>
            <div className="px-5 py-3 flex items-center gap-2">
              <Check size={13} className="text-green-500" /> Z DataLatte
            </div>
          </div>
          {beforeAfter.map((row, i) => (
            <div key={i} className="grid grid-cols-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="px-5 py-3.5 text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700 flex items-start gap-2">
                <X size={13} className="text-red-400 shrink-0 mt-0.5" />
                {row.before}
              </div>
              <div className="px-5 py-3.5 text-gray-800 dark:text-gray-200 flex items-start gap-2">
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                {row.after}
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── What it is ── */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-5xl mx-auto">
          <div className={`grid gap-10 items-start ${stats && stats.length > 0 ? "md:grid-cols-[1fr_300px]" : ""}`}>
            {/* Text column */}
            <div>
              <span className="section-label">Podstawy</span>
              <h2 className="section-title mb-8">{titles.basics ?? `Czym naprawdę jest ${service}?`}</h2>
              <div className="space-y-6">
                {whatItIs.split(/\n\n|\\n\\n/).map((para, i) => {
                  if (i === 0) return (
                    <p key={i} className="text-gray-800 dark:text-gray-200 leading-relaxed text-xl">{para}</p>
                  );
                  if (i === 1) return (
                    <div key={i} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-coffee-100 dark:border-gray-700 shadow-sm">
                      <div className="shrink-0 w-1 rounded-full bg-coffee-400 self-stretch" />
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{para}</p>
                    </div>
                  );
                  return (
                    <div key={i} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">Częsty błąd, którego warto unikać</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{para}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats sidebar */}
            {stats && stats.length > 0 && (
              <div className="space-y-3 md:sticky md:top-24">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border border-coffee-100 dark:border-gray-700 shadow-sm">
                    <div className="text-3xl font-bold text-coffee-800 dark:text-coffee-300 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* ── How it works — architecture flow ── */}
      <section className="bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-coffee-400 uppercase tracking-widest">Mój proces</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
              {titles.process ?? <>Jak pracuję z <span className="text-coffee-400">{service}</span></>}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed dark:text-gray-400">
              Jasny, powtarzalny proces, dzięki któremu zawsze wiesz, na jakim etapie jesteśmy.
            </p>
          </div>
          {/* First row: up to 4 steps as horizontal cards */}
          <div className="flex flex-col sm:flex-row items-stretch gap-0 mb-4">
            {howItWorks.slice(0, 4).map((item, i) => (
              <div key={item.step} className="flex-1 relative">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full mx-1 first:ml-0 last:mr-0">
                  <div className="text-xs font-mono text-coffee-500 mb-2 uppercase tracking-widest">{item.step}</div>
                  <div className="text-white font-semibold mb-2 text-sm">{item.title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{item.desc}</div>
                </div>
                {i < Math.min(howItWorks.length, 4) - 1 && (
                  <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-coffee-700 rounded-full items-center justify-center">
                    <ChevronRight size={10} className="text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Overflow steps (5+) in a second row */}
          {howItWorks.length > 4 && (
            <div className="flex flex-col sm:flex-row items-stretch gap-0">
              {howItWorks.slice(4).map((item, i) => (
                <div key={item.step} className="flex-1 relative">
                  <div className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-5 h-full mx-1 first:ml-0">
                    <div className="text-xs font-mono text-coffee-600 mb-2 uppercase tracking-widest dark:text-coffee-400">{item.step}</div>
                    <div className="text-white/80 font-semibold mb-2 text-sm">{item.title}</div>
                    <div className="text-gray-500 text-xs leading-relaxed dark:text-gray-400">{item.desc}</div>
                  </div>
                  {i < howItWorks.slice(4).length - 1 && (
                    <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-coffee-800 rounded-full items-center justify-center">
                      <ChevronRight size={10} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Included ── */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Co zawiera usługa</span>
            <h2 className="section-title">{titles.included ?? `Wszystko w usłudze ${service}`}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {included.map((item, i) => (
              <ScrollReveal key={item} delay={i * 0.05}>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl px-5 py-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:border-coffee-300 dark:hover:border-coffee-700 hover:shadow-md transition-all group h-full">
                <CheckCircle2 size={17} className="text-coffee-500 shrink-0 mt-0.5 group-hover:text-coffee-600 transition-colors" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Best for ── */}
      <SectionWrapper className="bg-coffee-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Czy to dla Ciebie?</span>
            <h2 className="section-title">{titles.bestFor ?? `${service} sprawdza się najlepiej dla:`}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {bestFor.map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-5 border border-coffee-100 dark:border-gray-700 hover:border-coffee-400 dark:hover:border-coffee-600 hover:shadow-md transition-all animate-card-rise"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <CheckCircle2 size={17} className="text-coffee-600 shrink-0 mt-0.5 dark:text-coffee-400" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">{titles.faq ?? `Pytania o ${service}`}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <ScrollReveal key={item.q} delay={i * 0.07}>
              <div className="card p-6 hover:border-coffee-300 hover:shadow-md transition-all">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.q}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Related ── */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Zobacz powiązane usługi</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="btn-outline text-sm py-2 px-5">
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* ── From the Blog ── */}
      <SectionWrapper>
        <div className="max-w-4xl mx-auto text-center">
          <span className="section-label">Bezpłatne poradniki</span>
          <h2 className="section-title mb-2">Czytaj nasz <span className="gradient-text">blog</span></h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-xl mx-auto">Praktyczne poradniki marketingu lokalnego: dane, budżety i porównania platform.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pl/blog" className="btn-outline text-sm py-2 px-5">Wszystkie artykuły <ArrowRight size={13} /></Link>
            <Link href="/pl/blog/ranking-kawiarni-poznan-google-maps-2026" className="btn-outline text-sm py-2 px-5">Ranking kawiarni w Poznaniu <ArrowRight size={13} /></Link>
          </div>
        </div>
      </SectionWrapper>

      <CTABanner headline="Gotowy na lepsze wyniki?" sub="Sprawdzimy Twoje obecne działania. Za darmo, bez zobowiązań." ctaLabel="Poproś o darmowy audyt" ctaHref="/pl/darmowy-audyt" />
    </>
  );
}
