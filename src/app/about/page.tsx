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
  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
    images: ["https://datalatte.pro/opengraph-image"],
  },
};

const agencies = [
  { name: "OMD",    desc: "Omnicom Group" },
  { name: "Dentsu", desc: "Global advertising" },
  { name: "BBDO",   desc: "Omnicom Creative" },
  { name: "GroupM", desc: "WPP media investment" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />

      {/* ── Hero ── */}
      <section className="hero-gradient py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="shrink-0">
              <Image
                src="/images/founder.png"
                alt="Nataliia — founder of DataLatte"
                width={160}
                height={160}
                className="rounded-full ring-4 ring-white/20 shadow-2xl"
                style={{ width: 160, height: 160, objectFit: "cover" }}
                priority
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-coffee-300 text-sm font-semibold uppercase tracking-widest mb-2">About me</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Hi, I&apos;m Nataliia. ☕
              </h1>
              <p className="text-coffee-200 text-lg leading-relaxed">
                I run DataLatte from Poznań — a city I moved to and immediately fell in love with.
                I help businesses grow with marketing that actually makes sense.
                But first, the important stuff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main story ── */}
      <div className="bg-white">

        {/* Intro text */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            I think the best way to understand someone is to know what they do on a Saturday morning.
            Mine almost always involves walking to a café, ordering a flat white, and spending an hour
            just being somewhere nice. That&apos;s not a hobby — it&apos;s basically who I am.
          </p>
          <p className="text-gray-500 leading-relaxed">
            I started DataLatte because I wanted to build something that felt real. A consultancy with
            a genuine point of view, run by an actual person, not a brand voice. The coffee in the name
            is not a metaphor. It&apos;s a lifestyle.
          </p>
        </div>

        {/* ── Poznań ── */}
        <div className="border-t border-gray-100">

          {/* Full-width city photo */}
          <div className="px-4 sm:px-6 py-12 max-w-4xl mx-auto">
            <Image
              src="/images/personal/IMG_1131.jpg"
              alt="Poznań streets on a sunny summer day"
              width={1200}
              height={900}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <p className="text-sm text-gray-400 italic mt-3 text-center">
              Home — Poznań, Poland. Still gets me every time.
            </p>
          </div>

          {/* Text + Wanda terrace */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Poznań & my coffee obsession</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                I moved to Poznań and within about three weeks I had mapped every café worth visiting.
                I explore the city&apos;s spots the way other people explore museums — with intention,
                with notes, and with strong opinions about what makes a good flat white.
              </p>
              <p className="text-gray-600 leading-relaxed">
                There&apos;s something about sitting in a good café — the light, the noise,
                the ritual of it — that makes me think better. I&apos;ve had some of my best ideas
                over a second coffee I definitely didn&apos;t need.
              </p>
            </div>
            <div>
              <Image
                src="/images/personal/IMG_1186.jpg"
                alt="Wanda café summer terrace in Poznań"
                width={600}
                height={800}
                className="w-full h-auto rounded-2xl shadow-md"
              />
              <p className="text-xs text-gray-400 italic mt-2 text-center">Wanda — one of my favourite Poznań spots</p>
            </div>
          </div>

          {/* Coffee + cheesecake */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
            <Image
              src="/images/personal/IMG_1209.jpg"
              alt="Coffee and cheesecake at an outdoor café"
              width={800}
              height={1000}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Coffee + cheesecake. Non-negotiable.</p>
          </div>

          {/* Hand with coffee to go */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
            <Image
              src="/images/personal/IMG_0378.jpg"
              alt="Coffee to go on a Poznań street"
              width={800}
              height={1000}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Saturday morning, every Saturday</p>
          </div>

          {/* Coffee + flowers photo + text */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Image
                src="/images/personal/IMG_1081.jpg"
                alt="Coffee with flowers on a café table, view of a parking lot and sky"
                width={600}
                height={800}
                className="w-full h-auto rounded-2xl shadow-md"
              />
              <p className="text-xs text-gray-400 italic mt-2 text-center">Sometimes the view outside doesn't matter at all</p>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                I&apos;ve been to cafés with incredible views and cafés with a car park outside the
                window. Honestly? If the coffee is good and the vibe is right, it doesn&apos;t matter.
                A café with flowers on the table and a good espresso beats a rooftop bar every time.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This is probably why I ended up calling the business DataLatte. Coffee isn&apos;t a
                theme for me — it&apos;s a whole orientation toward the world.
              </p>
            </div>
          </div>

          {/* Meringue cake */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
            <Image
              src="/images/personal/IMG_0406.jpg"
              alt="Meringue cake and coffee in a café"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">When the cake matches the coffee</p>
          </div>

          {/* Rainy Starbucks */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-16">
            <Image
              src="/images/personal/IMG_1038.jpg"
              alt="Rainy day coffee and Starbucks bags by the window"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Rainy days have their charm too</p>
          </div>
        </div>

        {/* ── Animals ── */}
        <div className="bg-coffee-50 border-t border-coffee-100 py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <span className="text-3xl block mb-4">🐾</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Animals are my people</h2>
              <p className="text-gray-600 leading-relaxed">
                I&apos;m a huge animal lover. I regularly cat-sit for friends, which in practice means
                spending my weekends being watched very intensely by a Scottish Fold who has zero interest
                in my work calendar and absolute conviction that it&apos;s always feeding time.
                Honestly, best job I have.
              </p>
            </div>
            <Image
              src="/images/personal/IMG_1221.jpg"
              alt="Scottish Fold cat looking up with huge golden eyes"
              width={800}
              height={800}
              className="w-full max-w-lg mx-auto h-auto rounded-2xl shadow-xl block"
            />
            <p className="text-sm text-gray-400 italic mt-4 text-center">
              My cat-sitting companion. No, she does not care about your KPIs.
            </p>
          </div>
        </div>

        {/* ── Croatia ── */}
        <div className="border-t border-gray-100 py-16 px-4 sm:px-6">

          {/* Header text */}
          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-3xl block mb-4">🌊</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Croatia is my reset button</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every year I go to Croatia and I completely slow down. The Adriatic does something
              to your nervous system that I cannot explain scientifically but can report anecdotally:
              three days there and I think more clearly than I have in months.
            </p>
            <p className="text-gray-600 leading-relaxed">
              I also drink a lot of coffee there. Different coffee — very Italian-influenced,
              espresso culture, small cups, taken seriously. I am extremely here for it.
            </p>
          </div>

          {/* The sea - full width, hero moment */}
          <div className="max-w-4xl mx-auto mb-10">
            <Image
              src="/images/personal/IMG_0548.jpg"
              alt="Crystal clear turquoise Adriatic Sea, Croatia"
              width={1200}
              height={900}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            <p className="text-sm text-gray-400 italic mt-3 text-center">The Adriatic. That colour is real, not a filter.</p>
          </div>

          {/* Coffee + sea view + text */}
          <div className="max-w-4xl mx-auto mb-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Finding a café with a sea view is basically my version of a life goal. I&apos;ve spent
                a lot of time in Croatia searching for the perfect spot — coffee in front of me,
                the Adriatic ahead, sunglasses on, nothing urgent.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I always come back with better ideas, a clearer head, and an embarrassing number
                of photos that are basically all the same coffee cup from slightly different angles.
                No regrets.
              </p>
            </div>
            <div>
              <Image
                src="/images/personal/IMG_0674.jpg"
                alt="Latte macchiato with sunglasses next to the Adriatic Sea"
                width={800}
                height={600}
                className="w-full h-auto rounded-2xl shadow-md"
              />
              <p className="text-xs text-gray-400 italic mt-2 text-center">Coffee + sea. Basically my brand.</p>
            </div>
          </div>

          {/* Barcaffè */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
            <Image
              src="/images/personal/IMG_0541.jpg"
              alt="Barcaffè espresso with sunglasses on a Croatian café table"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Barcaffè. Italy&apos;s coffee culture, Croatia&apos;s setting.</p>
          </div>

          {/* Ice cream */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
            <Image
              src="/images/personal/IMG_0556.jpg"
              alt="Ice cream cone held up in front of a Croatian old town"
              width={800}
              height={1000}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Gelato in the old town. Mandatory.</p>
          </div>

          {/* Old town flags - full width */}
          <div className="max-w-4xl mx-auto mb-10">
            <Image
              src="/images/personal/IMG_0544.jpg"
              alt="Croatian flags hanging over an old town street"
              width={1200}
              height={900}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
            <p className="text-sm text-gray-400 italic mt-3 text-center">The old towns never get old.</p>
          </div>

          {/* Loquat tree */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
            <Image
              src="/images/personal/IMG_0528.jpg"
              alt="Loquat tree with yellow fruits against a bright blue Croatian sky"
              width={800}
              height={1000}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">The trees are different there. Everything is different.</p>
          </div>

          {/* Pizza */}
          <div className="max-w-2xl mx-auto px-4 sm:px-6 mb-10">
            <Image
              src="/images/personal/IMG_0608.jpg"
              alt="Pizza next to ancient stone walls in Croatia"
              width={800}
              height={600}
              className="w-full h-auto rounded-2xl shadow-md"
            />
            <p className="text-xs text-gray-400 italic mt-2 text-center">Pizza next to a 2000-year-old wall. Regular Tuesday.</p>
          </div>

          {/* Stone + sea - full width, closing Croatia */}
          <div className="max-w-4xl mx-auto mb-4">
            <Image
              src="/images/personal/IMG_0570.jpg"
              alt="Stone arch over the sea, Croatian coastline"
              width={1200}
              height={700}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            <p className="text-sm text-gray-400 italic mt-3 text-center">
              Where I go when I need to remember what actually matters.
            </p>
          </div>
        </div>

        {/* ── Professional bit ── */}
        <div className="bg-gray-50 border-t border-gray-200 py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">The professional bit</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-6">
              Oh, and I do marketing. Seriously good marketing.
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Before DataLatte, I spent 10+ years at{" "}
                <strong className="text-gray-800">OMD, Dentsu, BBDO, and GroupM</strong> — some
                of the biggest media networks in the world. I ran campaigns for Fortune 500 and
                FTSE 100 brands across Europe and the US. Multi-million dollar budgets, attribution
                models, full-funnel strategy, programmatic across DV360 and The Trade Desk. I know
                how to build marketing that works because I've built a lot of it.
              </p>
              <p>
                I started DataLatte because I wanted to do the same work for businesses that
                actually talk to me like a human being — and get senior strategy instead of being
                handed to whoever was available. You work directly with me. That&apos;s the deal.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
