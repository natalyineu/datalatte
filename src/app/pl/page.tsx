import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  TrendingUp,
  MapPin,
  BarChart3,
  Target,
  Search,
  Star,
  CheckCircle2,
  Zap,
  Bot,
  Mail,
  Globe,
  Share2,
} from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import CTABanner from "@/components/CTABanner";
import BlogCard from "@/components/BlogCard";
import ScrollReveal from "@/components/ScrollReveal";
import Reveal from "@/components/advertise/Reveal";
import CopyEmail from "@/components/advertise/CopyEmail";
import AnimatedCounter from "@/components/AnimatedCounter";
import HeroAnimated from "@/components/HeroAnimated";
import AnimatedDashboard from "@/components/AnimatedDashboard";
import { plAlternates } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "DataLatte: marketing lokalny oparty na danych dla małych firm" },
  description:
    "Google Ads, Meta Ads, lokalne SEO i Profil Firmy w Google dla kawiarni, salonów, groomerów i studiów fitness. Darmowy audyt, rozliczenie miesięczne, bez wiązania.",
  alternates: plAlternates("/pl"),
};

const niches = [
  {
    title: "Kawiarnie",
    subtitle: "Restauracje i punkty z kawą",
    href: "/pl/dla/kawiarni",
    emoji: "☕",
    color: "from-coffee-700 to-coffee-900",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
    kpis: ["Widoczność w Mapach Google", "Ruch pieszy dzięki reklamom", "Wzrost zamówień online"],
  },
  {
    title: "Salony fryzjerskie i kosmetyczne",
    subtitle: "Barberzy i spa",
    href: "/pl/dla/salonow",
    emoji: "✂️",
    color: "from-gray-700 to-gray-900",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    kpis: ["Nowe prośby o rezerwację", "Powroty stałych klientów", "Wzrost liczby opinii"],
  },
  {
    title: "Groomerzy",
    subtitle: "Opiekunowie zwierząt i weterynarze",
    href: "/pl/dla/groomerow",
    emoji: "🐾",
    color: "from-coffee-600 to-coffee-950",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    kpis: ["Pozycja w wynikach lokalnych", "Rezerwacje wizyt", "Większy lokalny zasięg"],
  },
  {
    title: "Studia fitness i jogi",
    subtitle: "Siłownie i trenerzy personalni",
    href: "/pl/dla/studiow-fitness",
    emoji: "🧘",
    color: "from-gray-800 to-gray-950",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    kpis: ["Zapisy na zajęcia próbne", "Zakupy karnetów", "Koszt pozyskania zapytania"],
  },
];

// Services without a Polish page yet link to the English page (flagged EN).
const services = [
  { icon: Target, title: "Google Ads", desc: "Pojaw się wtedy, gdy lokalni klienci szukają tego, co oferujesz. Każda wydana złotówka policzona.", href: "/pl/uslugi/google-ads", en: false, color: "text-coffee-700 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-900/40" },
  { icon: TrendingUp, title: "Meta Ads", desc: "Dotrzyj do swojego idealnego lokalnego klienta na Facebooku i Instagramie dzięki kreacjom, które przyciągają wzrok.", href: "/pl/uslugi/meta-ads", en: false, color: "text-coffee-600 dark:text-coffee-400 bg-coffee-50 dark:bg-coffee-900/20" },
  { icon: MapPin, title: "Profil Firmy w Google", desc: "Wygraj lokalne wyniki w Mapach. Więcej telefonów, tras i kliknięć z bezpłatnego ruchu organicznego.", href: "/pl/uslugi/profil-firmy-w-google", en: false, color: "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700" },
  { icon: Search, title: "Lokalne SEO", desc: "Pozycje na frazy, które przyprowadzają prawdziwych klientów, a nie tylko ruch dla pustych wskaźników.", href: "/pl/uslugi/lokalne-seo", en: false, color: "text-coffee-800 dark:text-coffee-200 bg-coffee-100 dark:bg-coffee-900/40" },
  { icon: BarChart3, title: "Analityka i raporty", desc: "Dokładnie wiesz, co działa. Czytelne pulpity, prosty język, bez przytłaczających danych.", href: "/services/analytics", en: true, color: "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700" },
  { icon: Bot, title: "Agenci AI i automatyzacja", desc: "Natychmiastowa odpowiedź na zapytania, odpowiedzi na opinie i przypomnienia o rezerwacjach, 24/7 bez zatrudniania nikogo.", href: "/services/ai-agents", en: true, color: "text-coffee-700 dark:text-coffee-300 bg-coffee-100 dark:bg-coffee-900/40" },
  { icon: Mail, title: "E-mail i SMS", desc: "Zamień jednorazowych gości w stałych klientów. Twoja lista to kanał o najwyższym zwrocie, jaki masz.", href: "/services/email-sms", en: true, color: "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700" },
  { icon: Share2, title: "Media społecznościowe", desc: "Regularne treści, prawdziwe zaangażowanie i profil, który zamienia obserwujących w stałych klientów.", href: "/services/social-media", en: true, color: "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700" },
  { icon: Globe, title: "Strony internetowe i landing pages", desc: "Strony nastawione na konwersję: mają przynosić telefony i rezerwacje, a nie tylko dobrze wyglądać.", href: "/services/website", en: true, color: "text-coffee-600 dark:text-coffee-400 bg-coffee-50 dark:bg-coffee-900/20" },
];

const whyCards = [
  { icon: Zap, title: "Naprawdę oparte na danych", desc: "Każda decyzja w kampanii opiera się na liczbach, nie na przeczuciu. Widzisz dokładnie, za co płacisz." },
  { icon: CheckCircle2, title: "Strategie dla konkretnej branży", desc: "Kawiarnia i studio jogi mają zupełnie inne ścieżki klienta. Nie używam kopiowanych schematów." },
  { icon: Star, title: "Uczciwa, przejrzysta praca", desc: "Bez długich umów, bez zasłony dymnej. Jasne cele, jasne wyniki i prawdziwa rozmowa." },
];

const steps = [
  { step: "01", title: "Darmowy audyt", desc: "Sprawdzam Twoją obecną widoczność: Google Ads, profil w Google, stronę, social media, i mówię wprost, co Cię hamuje." },
  { step: "02", title: "Rozmowa o strategii", desc: "Ustalamy priorytety. Dostajesz jasny plan z oczekiwanymi efektami, bez obietnic, których nie mogę dotrzymać." },
  { step: "03", title: "Wdrożenie i start", desc: "Konfiguruję kampanie, porządkuję profile i przygotowuję materiały. Szybko, bez nieskończonych akceptacji." },
  { step: "04", title: "Pomiar i poprawki", desc: "Dostajesz pulpit, który naprawdę da się przeczytać. Co miesiąc sprawdzamy, co działa, i wzmacniamy to." },
];

function getLatestPosts(count = 3) {
  const dir = path.join(process.cwd(), "content/blog-pl");
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      return {
        slug: file.replace(".mdx", ""),
        title: String(data.title ?? ""),
        description: String(data.description ?? ""),
        category: String(data.category ?? ""),
        date: String(data.date ?? ""),
        readTime: String(data.readTime ?? "5 min czytania"),
        image: String(data.image ?? ""),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

const homeFaqs = [
  { q: "Ile kosztuje marketing lokalny?", a: "Cenę ustalam po darmowym audycie, bo zależy od zakresu, miasta i konkurencji. Moje wynagrodzenie jest jawne i osobne od budżetu reklamowego, a rozliczamy się miesięcznie, bez ukrytych opłat." },
  { q: "Czy pracujesz z firmami spoza Polski?", a: "Tak. Pracuję z małymi firmami w Polsce, USA, Wielkiej Brytanii, Australii, Kanadzie i nie tylko. Cała praca odbywa się zdalnie, a kontakt to głównie e-mail i umówione rozmowy wideo." },
  { q: "Po jakim czasie zobaczę efekty?", a: "Google Ads i optymalizacja Profilu Firmy w Google mogą dać efekty w ciągu 2–4 tygodni. Lokalne SEO zwykle potrzebuje 3–6 miesięcy, by pokazać wyraźny wzrost pozycji. Podczas darmowego audytu zawsze mówię uczciwie, jakie terminy są realne." },
  { q: "Co obejmuje darmowy audyt marketingu?", a: "Sprawdzam Twój Profil Firmy w Google, stronę, ewentualne działające konta reklamowe i trzech lokalnych konkurentów. Dostajesz pisemny raport z konkretnymi wnioskami i planem priorytetów w ciągu 48 godzin, bez rozmowy sprzedażowej." },
  { q: "Czym DataLatte różni się od agencji marketingowej?", a: "Pracujesz bezpośrednio ze mną, osobą z ponad 10-letnim doświadczeniem w marketingu. Nie ma opiekunów klienta, nie ma juniorów i nie ma długich umów. Każda decyzja opiera się na danych i jest wyjaśniona prostym językiem." },
  { q: "A jeśli próbowałem Google Ads i nie zadziałało?", a: "To najczęstsza historia, jaką słyszę. W większości przypadków kampanie zawodziły przez szerokie dopasowanie fraz, brak listy wykluczeń albo kierowanie ruchu na stronę główną zamiast na dedykowaną stronę. To da się naprawić. Darmowy audyt pokaże dokładnie, co poszło nie tak." },
];

export default function Page() {
  const latestPosts = getLatestPosts();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-white blur-3xl dark:bg-gray-900" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-coffee-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <HeroAnimated lang="pl" />
            <div className="mt-2 lg:mt-0">
              <AnimatedDashboard lang="pl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: 10, suffix: "+", label: "lat doświadczenia" },
            { value: 1500, suffix: "+", label: "opublikowanych poradników" },
            { value: 15, suffix: "+", label: "platform reklamowych" },
            { value: 100, suffix: "%", label: "oparte na danych" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-coffee-700 dark:text-coffee-300">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Niches */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="section-label">Branże, którym pomagam</span>
            <h2 className="section-title">
              Marketing stworzony dla{" "}
              <span className="gradient-text">Twojej branży</span>
            </h2>
            <p className="section-subtitle mt-4 max-w-2xl mx-auto">
              Ogólnych porad marketingowych jest mnóstwo. Specjalizuję się w czterech typach lokalnych firm
              i wiem, jakie dźwignie działają w każdej z nich.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {niches.map((niche, i) => (
            <ScrollReveal key={niche.href} delay={i * 0.1} direction="up">
              <Link href={niche.href} className="niche-card h-72 group block">
                <Image
                  src={niche.image}
                  alt={niche.title}
                  fill
                  priority={i === 0}
                  unoptimized={niche.image.startsWith("http")}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${niche.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="text-3xl mb-2">{niche.emoji}</div>
                  <h3 className="text-white font-bold text-lg leading-tight">{niche.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{niche.subtitle}</p>
                  <ul className="space-y-1">
                    {niche.kpis.map((kpi) => (
                      <li key={kpi} className="flex items-center gap-1.5 text-xs text-white/80">
                        <CheckCircle2 size={11} className="text-coffee-300 shrink-0" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-1 text-white text-sm font-semibold group-hover:gap-2 transition-all">
                    Dowiedz się więcej <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </SectionWrapper>

      {/* Services */}
      <SectionWrapper>
        <div className="text-center mb-12">
          <span className="section-label">Co robię</span>
          <h2 className="section-title">
            Marketing lokalny na całej ścieżce klienta,{" "}
            <span className="gradient-text">bez waty słownej</span>
          </h2>
          <p className="section-subtitle mt-4 max-w-xl mx-auto">
            Od bycia znalezionym w Mapach Google po zamianę zainteresowania w płacących klientów.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-5 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-coffee-500" /> Rozliczenie miesięczne</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-coffee-500" /> Bez umów na rok</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-coffee-500" /> Bezpośredni kontakt ze mną</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-coffee-500" /> Darmowy audyt na start</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <ScrollReveal key={svc.href} delay={i * 0.07} direction="up">
              <Link
                href={svc.href}
                className="card p-6 group hover:-translate-y-1 transition-transform duration-200 block h-full"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${svc.color}`}>
                  <svc.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-coffee-700 dark:group-hover:text-coffee-300 transition-colors">
                  {svc.title}
                  {svc.en && <span className="ml-2 align-middle rounded border border-gray-300 dark:border-gray-600 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400">EN</span>}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{svc.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-coffee-700 dark:text-coffee-300 group-hover:gap-2 transition-all">
                  Poznaj usługę <ArrowRight size={13} />
                </span>
              </Link>
            </ScrollReveal>
          ))}

          {/* Catchall card */}
          <div className="card p-6 bg-gradient-to-br from-coffee-700 to-coffee-900 text-white">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Zap size={22} className="text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2">Nie wiesz, czego potrzebujesz?</h3>
            <p className="text-coffee-200 text-sm leading-relaxed mb-5">
              Porozmawiajmy o Twoich celach. Powiem uczciwie, które kanały mają sens dla Twojej firmy w tej chwili.
            </p>
            <Link
              href="/pl/darmowy-audyt"
              className="inline-flex items-center gap-1 bg-white text-coffee-900 font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-coffee-100 transition-colors dark:bg-gray-900 dark:text-coffee-100 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Poproś o darmowy audyt <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Why DataLatte */}
      <SectionWrapper id="how-it-works" className="bg-coffee-50 dark:bg-gray-900/40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label">Dlaczego DataLatte</span>
            <h2 className="section-title mb-6">
              Marketing{" "}
              <span className="text-coffee-700 dark:text-coffee-300">tak ciepły jak Twoje latte</span>,
              {" "}tak ostry jak Twoje dane
            </h2>
            <p className="text-gray-500 dark:text-gray-300 leading-relaxed mb-5">
              Nie jestem dużą agencją. Prowadzę jednoosobową firmę z głęboką wiedzą o marketingu lokalnym
              i szczerą pasją do analityki. To znaczy, że masz moją pełną uwagę, a nie przekazanie
              juniorowi do obsługi klienta.
            </p>

            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Ponad 10 lat doświadczenia, między innymi w</p>
              <div className="flex flex-wrap gap-2">
                {["OMD", "Dentsu", "BBDO", "GroupM"].map((agency) => (
                  <span key={agency} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-coffee-100 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
                    {agency}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {whyCards.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-coffee-100 dark:bg-coffee-900/40 flex items-center justify-center shrink-0">
                    <item.icon size={19} className="text-coffee-700 dark:text-coffee-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/pl/o-mnie" className="btn-outline mt-8">
              O mnie i moim podejściu
            </Link>
          </div>

          <div className="space-y-4">
            {steps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1} direction="left">
                <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-coffee-100 dark:border-gray-700 hover:border-coffee-300 dark:hover:border-coffee-700 hover:shadow-md transition-all duration-200">
                  <div className="text-2xl font-bold text-coffee-400 font-display shrink-0 w-10">{item.step}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Blog */}
      <SectionWrapper className="bg-gray-50 dark:bg-gray-900/40">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Z bloga</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Marketing lokalny,{" "}
              <span className="gradient-text">wyjaśniony prosto</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/pl/blog/ranking-kawiarni-poznan-google-maps-2026"
              className="flex items-center gap-1.5 text-xs font-semibold text-coffee-700 bg-coffee-50 border border-coffee-200 px-3 py-1.5 rounded-full hover:bg-coffee-100 transition-colors dark:text-coffee-300 dark:bg-coffee-900/20 dark:border-coffee-800 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Globe size={13} />
              Ranking 210 kawiarni z Poznania
            </Link>
            <Link href="/pl/blog" className="flex items-center gap-1.5 text-coffee-700 font-semibold hover:gap-3 transition-all text-sm dark:text-coffee-300">
              Wszystkie artykuły <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post, i) => (
            <ScrollReveal key={post.slug} delay={i * 0.1}>
              <BlogCard
                title={post.title}
                excerpt={post.description}
                slug={post.slug}
                basePath="/pl/blog"
                category={post.category}
                date={new Date(post.date).toLocaleDateString("pl-PL", { year: "numeric", month: "short", day: "numeric" })}
                rawDate={post.date}
                readTime={post.readTime}
                image={post.image}
              />
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/pl/blog" className="btn-outline">Zobacz wszystkie artykuły</Link>
        </div>
      </SectionWrapper>

      {/* Sponsored placements and partnerships (English pages) */}
      <section className="bg-gradient-to-br from-gray-950 via-coffee-950 to-coffee-900 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "40px 40px" }} aria-hidden />
        <div className="max-w-6xl mx-auto relative">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-block bg-white/10 border border-white/20 text-coffee-300 text-sm font-medium px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                Dla marek, narzędzi i agencji
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-balance">
                Chcesz pokazać swój produkt{" "}
                <span className="text-coffee-400">właścicielom lokalnych firm?</span>
              </h2>
              <p className="text-lg text-white/65 max-w-2xl mx-auto">
                Współpracujemy też z markami: oznaczone jako sponsorowane wzmianki w naszych poradnikach oraz partnerstwa przy recenzjach, wspólnych materiałach i badaniach. Ceny od 150 USD.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { name: "Wzmianka sponsorowana", price: "od 150 USD", text: "50 do 100 słów w istniejącym poradniku, tam, gdzie czytelnicy porównują opcje." },
              { name: "Sekcja sponsorowana", price: "od 300 USD", text: "150 do 300 słów plus wiersz w tabeli porównawczej, fakty sprawdzone." },
              { name: "Artykuł sponsorowany", price: "od 600 USD", text: "Nowy artykuł na ponad 1 200 słów, zbadany i opisany ze źródłami przez nas." },
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-coffee-300 text-sm font-semibold mb-1">{c.name}</div>
                  <div className="text-3xl font-bold text-white mb-3">{c.price}</div>
                  <p className="text-sm text-white/65">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/advertise" className="inline-flex items-center gap-2 bg-coffee-500 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-coffee-400 transition-all hover:shadow-xl hover:shadow-coffee-900/30">
              Reklama u nas (EN) <ArrowRight size={17} />
            </Link>
            <Link href="/partnerships" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/85 font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all">
              Partnerstwa (EN) →
            </Link>
            <a href="mailto:hi@datalatte.pro" className="text-white/80 underline decoration-coffee-400 underline-offset-4 hover:text-white text-sm sm:ml-3">hi@datalatte.pro</a>
            <CopyEmail />
          </div>
          <p className="text-center text-xs text-white/45 mt-6">Każde płatne miejsce jest oznaczone jako Sponsored i używa linków z rel=&quot;sponsored&quot;.</p>
        </div>
      </section>

      {/* FAQ */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="section-label">Najczęstsze pytania</span>
            <h2 className="section-title">Wszystko, co warto wiedzieć <span className="gradient-text">przed startem</span></h2>
          </div>
          <div className="space-y-4">
            {homeFaqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-semibold text-gray-900 dark:text-gray-100 hover:bg-coffee-50 dark:hover:bg-gray-800 transition-colors">
                  {faq.q}
                  <span className="text-coffee-500 dark:text-coffee-400 shrink-0 text-xl font-light group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-500 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            Masz jeszcze pytania?{" "}
            <Link href="/pl/kontakt" className="text-coffee-700 dark:text-coffee-300 font-semibold hover:underline">
              Napisz do mnie
            </Link>{" "}
            , odpowiadam w ciągu jednego dnia roboczego.
          </p>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <CTABanner
        headline="Gotowy na lepsze wyniki?"
        sub="Sprawdzimy Twoje obecne działania. Za darmo, bez zobowiązań."
        ctaLabel="Poproś o darmowy audyt"
        ctaHref="/pl/darmowy-audyt"
      />
    </>
  );
}
