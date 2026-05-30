import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CTABanner from "@/components/CTABanner";
import { personSchema } from "@/lib/schema";

const ABOUT_URL = "https://datalatte.pro/about";
const ABOUT_TITLE = "About Nataliia — the person behind DataLatte";
const ABOUT_DESC =
  "I live in Poznań, I'm obsessed with coffee, I cat-sit for friends, and I escape to Croatia every year. Also: 10+ years in digital marketing at OMD, Dentsu, BBDO and GroupM.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESC,
  alternates: {
    canonical: ABOUT_URL,
    languages: {
      "en-US": ABOUT_URL,
      "en-GB": ABOUT_URL,
      "en-AU": ABOUT_URL,
      "en-CA": ABOUT_URL,
      "x-default": ABOUT_URL,
    },
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
    url: ABOUT_URL,
    siteName: "DataLatte",
    type: "profile",
    images: [{ url: "https://datalatte.pro/opengraph-image", width: 1200, height: 630, alt: "Nataliia — DataLatte" }],
  },
};

const agencies = [
  { name: "OMD",    desc: "Omnicom Group" },
  { name: "Dentsu", desc: "Global advertising" },
  { name: "BBDO",   desc: "Omnicom Creative" },
  { name: "GroupM", desc: "WPP media investment" },
];

// All photos with consistent 4:5 aspect ratio via fill + object-cover
const SIZES = "(max-width: 640px) calc(100vw - 32px), 672px";

function Photo({ src, alt, caption, priority = false }: {
  src: string; alt: string; caption: string; priority?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-12">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: "4/5" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={SIZES}
          priority={priority}
        />
      </div>
      <p className="text-sm text-gray-400 italic mt-3 text-center leading-snug">{caption}</p>
    </div>
  );
}

function PhotoWide({ src, alt, caption, priority = false }: {
  src: string; alt: string; caption: string; priority?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-12">
      <div className="relative w-full overflow-hidden rounded-2xl shadow-md" style={{ aspectRatio: "4/3" }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={SIZES}
          priority={priority}
        />
      </div>
      <p className="text-sm text-gray-400 italic mt-3 text-center leading-snug">{caption}</p>
    </div>
  );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 pt-16 pb-4">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-gray-600 leading-relaxed text-[17px]">{children}</div>;
}

function Pullquote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-coffee-300 pl-4 my-6 text-gray-700 font-medium italic text-lg leading-relaxed">
      {children}
    </blockquote>
  );
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />

      {/* ── Hero ── */}
      <section className="hero-gradient py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="shrink-0">
            <Image
              src="/images/founder.png"
              alt="Nataliia — founder of DataLatte"
              width={140}
              height={140}
              className="rounded-full ring-4 ring-white/20 shadow-2xl"
              style={{ width: 140, height: 140, objectFit: "cover" }}
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-coffee-300 text-sm font-semibold uppercase tracking-widest mb-2">About me</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hi, I&apos;m Nataliia. ☕
            </h1>
            <p className="text-coffee-200 text-lg leading-relaxed">
              I run DataLatte from Poznań. I help businesses grow with
              marketing that actually makes sense. But first, the important stuff.
            </p>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <div className="bg-white">

        {/* Opening */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
          <Prose>
            <p className="text-xl text-gray-800 font-medium leading-relaxed">
              The best way to understand someone is to know what they do on a Saturday morning.
              Mine almost always involves walking to a café, ordering a flat white, and spending
              an hour just being somewhere nice.
            </p>
            <p>
              That&apos;s not a hobby — it&apos;s basically who I am. I started DataLatte because
              I wanted to build something that felt real. A consultancy with a genuine point of view,
              run by an actual person, not a brand voice.
            </p>
            <Pullquote>The coffee in the name is not a metaphor. It&apos;s a lifestyle.</Pullquote>
          </Prose>
        </div>

        {/* ── Poznań & Coffee ── */}
        <Section emoji="☕" title="Poznań & my coffee obsession">
          <Prose>
            <p>
              I moved to Poznań and within about three weeks had mapped every café worth visiting.
              I explore the city&apos;s spots the way other people explore museums — with intention,
              notes, and strong opinions about what makes a good flat white.
            </p>
            <p>
              There&apos;s something about sitting in a good café — the light, the noise, the ritual
              of it — that makes me think better. I&apos;ve had some of my best ideas over a second
              coffee I definitely didn&apos;t need.
            </p>
          </Prose>
        </Section>

        <Photo src="/images/personal/p_IMG_1131.jpg" alt="Sunny Poznań street flanked by elegant buildings" caption="Home — Poznań, Poland. Still gets me every time." priority />
        <Photo src="/images/personal/p_IMG_1186.jpg" alt="Wanda café summer terrace in Poznań" caption="Wanda — one of my favourite Poznań spots" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
          <Prose>
            <p>
              Coffee isn&apos;t just a drink for me — it&apos;s an excuse to sit down, slow down,
              and be present somewhere. A café with flowers on the table and a good espresso
              beats a rooftop bar every time.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1209.jpg" alt="Coffee and cheesecake at an outdoor café" caption="Coffee + cheesecake. Non-negotiable." />
        <Photo src="/images/personal/p_IMG_0378.jpg" alt="Coffee to go on a Poznań street" caption="Saturday morning, every Saturday" />
        <Photo src="/images/personal/p_IMG_1081.jpg" alt="Coffee with flowers at a café table" caption="Sometimes the view outside doesn't matter at all" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
          <Pullquote>
            Coffee isn&apos;t a theme for me — it&apos;s a whole orientation toward the world.
          </Pullquote>
        </div>

        <PhotoWide src="/images/personal/p_IMG_0406.jpg" alt="Meringue cake and coffee in a cosy café" caption="When the cake matches the coffee" />
        <PhotoWide src="/images/personal/p_IMG_1038.jpg" alt="Rainy day at Starbucks, city street outside" caption="Rainy days have their charm too" />

        {/* ── Animals ── */}
        <Section emoji="🐾" title="Animals are my people">
          <Prose>
            <p>
              I&apos;m a huge animal lover. I regularly cat-sit for friends, which in practice
              means spending my weekends being watched very intensely by a Scottish Fold who
              has zero interest in my work calendar and absolute conviction that it&apos;s
              always feeding time.
            </p>
            <p>
              Honestly, best job I have. Animals are better at feedback than most clients —
              brutally honest, no fluff.
            </p>
          </Prose>
        </Section>

        <Photo src="/images/personal/p_IMG_1221.jpg" alt="Scottish Fold cat looking up with huge golden eyes" caption="My cat-sitting companion. No, she does not care about your KPIs." />

        {/* ── Croatia ── */}
        <Section emoji="🌊" title="Croatia is my reset button">
          <Prose>
            <p>
              Every year I go to Croatia and completely slow down. The Adriatic does something
              to your nervous system that I can&apos;t explain scientifically but can report
              anecdotally: three days there and I think more clearly than I have in months.
            </p>
            <p>
              I also drink a lot of coffee there — very Italian-influenced, espresso culture,
              small cups, taken seriously. I am extremely here for it.
            </p>
          </Prose>
        </Section>

        <Photo src="/images/personal/p_IMG_0548.jpg" alt="Crystal clear turquoise Adriatic Sea" caption="The Adriatic. That colour is real, not a filter." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
          <Prose>
            <p>
              Finding a café with a sea view is basically my version of a life goal. Coffee in
              front of me, the Adriatic ahead, sunglasses on, nothing urgent.
            </p>
          </Prose>
        </div>

        <PhotoWide src="/images/personal/p_IMG_0674.jpg" alt="Latte macchiato with sunglasses next to the Adriatic" caption="Coffee + sea. Basically my brand." />
        <PhotoWide src="/images/personal/p_IMG_0541.jpg" alt="Barcaffè espresso on a Croatian café terrace" caption="Barcaffè. Italy's coffee culture, Croatia's setting." />
        <Photo src="/images/personal/p_IMG_0556.jpg" alt="Ice cream cone in front of a Croatian church tower" caption="Gelato in the old town. Mandatory." />
        <Photo src="/images/personal/p_IMG_0544.jpg" alt="Croatian old town street with flags stretching overhead" caption="The old towns never get old." />
        <Photo src="/images/personal/p_IMG_0528.jpg" alt="Loquat tree heavy with yellow fruit against blue sky" caption="The trees are different there. Everything is different." />
        <PhotoWide src="/images/personal/p_IMG_0608.jpg" alt="Pizza beside ancient stone columns in Croatia" caption="Pizza next to a 2000-year-old wall. Regular Tuesday." />
        <Photo src="/images/personal/p_IMG_0570.jpg" alt="Stone sea wall with the Adriatic and islands beyond" caption="Where I go when I need to remember what actually matters." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4">
          <Pullquote>
            I always come back with better ideas, a clearer head, and an embarrassing number
            of photos that are basically all the same coffee cup from slightly different angles.
            No regrets.
          </Pullquote>
        </div>

        {/* ── Professional ── */}
        <div className="bg-gray-50 border-t border-gray-200 py-16 px-4 sm:px-6 mt-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              The professional bit
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Oh, and I do marketing.{" "}
              <span className="text-coffee-700">Seriously good marketing.</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-[17px]">
              <p>
                Before DataLatte, I spent 10+ years at{" "}
                <strong className="text-gray-800">OMD, Dentsu, BBDO, and GroupM</strong> —
                some of the biggest media networks in the world. Fortune 500 clients,
                multi-million dollar budgets, full-funnel strategies across Europe and the US.
                I know how to build marketing that works because I&apos;ve built a lot of it.
              </p>
              <p>
                I started DataLatte because I wanted to do the same work for businesses that
                actually talk to me like a human. You get senior strategy, not whoever was
                available. You work directly with me. That&apos;s the deal.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {agencies.map((a) => (
                <div key={a.name} className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-center shadow-sm">
                  <p className="font-bold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary">
                Work with me <ArrowRight size={16} />
              </Link>
              <Link href="/services/google-ads" className="btn-secondary">
                See what I do
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTABanner
        headline="Ready to work with someone who actually gives a damn?"
        sub="Start with a free audit. No pitch deck, no juniors — just me telling you what I'd do differently."
      />
    </>
  );
}
