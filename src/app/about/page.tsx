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
              Mine almost always involves walking somewhere in Poznań, ordering a flat white,
              and spending however long I want just being somewhere nice.
            </p>
            <p>
              I&apos;ve lived here for three years now. Long enough to have a mental map of every
              café worth sitting in, strong opinions about which streets are worth walking slowly,
              and a genuine feeling that this city is mine. Poznań surprised me when I arrived —
              it&apos;s quieter than Warsaw but not in a boring way. More like a place
              that&apos;s completely comfortable with itself.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1131.jpg" alt="Sunny Poznań street flanked by elegant buildings" caption="Home — Poznań, Poland. Still gets me every time." priority />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              When I first moved here, I did what I always do in a new city: mapped every café
              worth visiting. Not on Google Maps — in my head. An internal list of where the
              espresso is right and where the sofa by the window is always free.
            </p>
            <p>
              Wanda became a regular pretty quickly. A summer terrace, good coffee, the kind of
              outdoor setup where you can sit for two hours and nobody looks at you like
              you&apos;ve overstayed your welcome.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1186.jpg" alt="Wanda café summer terrace in Poznań" caption="Wanda — one of my favourite Poznań spots" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Coffee, for me, has never just been about the drink. It&apos;s the whole ritual —
              choosing where to go, walking there, sitting with something in your hands and
              nowhere urgent to be. I&apos;ve had some of my best ideas over a second coffee
              I definitely didn&apos;t need. There&apos;s something about that unhurried state
              that makes everything clearer.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1209.jpg" alt="Coffee and cheesecake at an outdoor café" caption="Coffee + cheesecake. Non-negotiable." />
        <Photo src="/images/personal/p_IMG_0378.jpg" alt="Coffee to go on a Poznań street" caption="Saturday morning, every Saturday" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I have a weakness for takeaway cups with something written on them that makes me
              feel vaguely understood. Saturday morning, walking nowhere in particular, coffee
              in hand — that&apos;s honestly the whole thing.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1081.jpg" alt="Coffee with flowers at a café table" caption="Sometimes the view outside doesn't matter at all" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Pullquote>
            Coffee isn&apos;t a theme for me. It&apos;s a whole orientation toward the world.
          </Pullquote>
        </div>

        <Photo src="/images/personal/p_IMG_0406.jpg" alt="Meringue cake and coffee in a cosy café" caption="When the cake matches the coffee" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Not every café morning is precious and curated. Some are a rainy Tuesday somewhere
              familiar because you need somewhere warm to sit and think. That counts too. What I
              like about coffee culture is that it has room for all of it — the craft flat white
              and the emergency americano.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1038.jpg" alt="Rainy day at a café, city street outside" caption="Rainy days have their charm too" />

        {/* Cat */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I also cat-sit for a friend pretty regularly. His name is Ragnar. He&apos;s a
              Scottish Fold with a very flat face and the kind of calm, intense stare that
              suggests he knows exactly what you&apos;re thinking and is mostly unimpressed by it.
            </p>
            <p>
              Cat-sitting is, honestly, one of my favourite things. There&apos;s a cat. The cat
              wants food. You provide food. Then you sit on the sofa together and nobody needs
              to talk. The best kind of company.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1221.jpg" alt="Scottish Fold cat looking up with huge golden eyes" caption="Ragnar. He does not care about your KPIs." />

        {/* Croatia */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I lived in Zagreb for a while — which meant I got to know Croatia properly, not
              just as a tourist but as a place people actually live. The coffee culture there is
              very real: Italian-influenced, small cups, espresso taken seriously, usually
              standing at a bar counter.
            </p>
            <p>
              Every summer I go back to the coast. I&apos;ve been to Dubrovnik, Split, Šibenik,
              Zadar — each with its own old town, its own light, its own pace. The Adriatic does
              something to your nervous system. Three days of looking at that colour of water and
              you start breathing differently.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0548.jpg" alt="Crystal clear turquoise Adriatic Sea" caption="The Adriatic. That colour is real, not a filter." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              There&apos;s always a café with a sea view involved. Coffee in front of me, the
              water close enough to hear, sunglasses on, nothing urgent. That&apos;s the Croatia
              I keep going back to.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0674.jpg" alt="Latte macchiato with sunglasses next to the Adriatic" caption="Coffee + sea. Basically my brand." />
        <Photo src="/images/personal/p_IMG_0541.jpg" alt="Barcaffè espresso on a Croatian café terrace" caption="Barcaffè — Italy's coffee culture, Croatia's setting." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Gelato in an old town is non-negotiable. The best way to see a place is on foot,
              slowly, with something in your hand.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0556.jpg" alt="Ice cream cone in front of a Croatian church tower" caption="Gelato in the old town. Mandatory." />
        <Photo src="/images/personal/p_IMG_0544.jpg" alt="Croatian old town street with flags stretching overhead" caption="The old towns never get old." />
        <Photo src="/images/personal/p_IMG_0528.jpg" alt="Loquat tree heavy with yellow fruit against blue sky" caption="The trees are different there. Everything is." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I grew up further north and every summer I&apos;m slightly amazed by how different
              the light is in Croatia, how unhurried everything feels. I once had pizza next to a
              Roman column that was just standing there, built into a wall, completely unremarkable
              to everyone who lived nearby. Croatia is full of things like that.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0608.jpg" alt="Pizza beside ancient stone columns in Croatia" caption="Pizza next to a 2000-year-old wall. Regular Tuesday." />
        <Photo src="/images/personal/p_IMG_0570.jpg" alt="Stone sea wall with the Adriatic and islands beyond" caption="Where I go when I need to remember what actually matters." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-10">
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
