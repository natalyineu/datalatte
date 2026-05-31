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
              That&apos;s my neighbourhood. I walk that street almost every Saturday morning,
              usually on the way to a café, never in a rush. The light hits those buildings in a
              way that still catches me off guard after three years. I think that&apos;s a good
              sign — it means I haven&apos;t stopped noticing.
            </p>
            <p>
              When I first moved here, I did what I always do in a new city: mapped every café
              worth visiting. Not on Google Maps — in my head. An internal list of where the
              espresso is right and where the sofa by the window is always free. It took about
              three weeks. I was very motivated.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1186.jpg" alt="Wanda café summer terrace in Poznań" caption="Wanda — one of my favourite Poznań spots" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Wanda became a regular pretty quickly. A summer terrace, good coffee, the kind of
              outdoor setup where you can sit for two hours and nobody looks at you like
              you&apos;ve overstayed your welcome. The menu has something called a &quot;Wanda
              latte&quot; and I have tried to resist ordering it every single time and failed
              every single time.
            </p>
            <p>
              Coffee, for me, has never just been about the drink. It&apos;s the whole ritual —
              choosing where to go, walking there, sitting with something in your hands and
              nowhere urgent to be. I&apos;ve had some of my best ideas over a second coffee I
              definitely didn&apos;t need. There&apos;s something about that unhurried state
              that makes everything clearer.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1209.jpg" alt="Coffee and cheesecake at an outdoor café" caption="Coffee + cheesecake. Non-negotiable." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I did not plan for the cheesecake. I never do. That&apos;s the thing about café
              mornings — you go in for a coffee and then the pastry case makes a very compelling
              argument and suddenly you&apos;re forty minutes in with a fork in your hand and no
              regrets whatsoever. The cheesecake was very good, by the way. Obviously.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0378.jpg" alt="Coffee to go on a Poznań street" caption="Saturday morning, every Saturday" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Sometimes the café is wherever you&apos;re already walking. I have a real weakness
              for the takeaway coffee as a concept — it gives you something to hold and a reason
              to be outside, which is sometimes all you need. That cup has something written on it
              in Polish that translates roughly to &quot;swap texting for meeting up.&quot; Very
              pointed. I was alone. I kept walking.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1081.jpg" alt="Coffee with flowers at a café table" caption="Sometimes the view outside doesn't matter at all" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              This was taken at a place with flowers on every table and enormous windows looking
              onto the street. The kind of café that makes you feel like you&apos;re inside a
              painting. I sat there for two hours. I ordered a second coffee I did not need.
              I would do it again immediately.
            </p>
          </Prose>
          <Pullquote>
            Coffee isn&apos;t a theme for me. It&apos;s a whole orientation toward the world.
          </Pullquote>
        </div>

        <Photo src="/images/personal/p_IMG_0406.jpg" alt="Meringue cake and coffee in a cosy café" caption="When the cake matches the coffee" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              That meringue is from a café where everything on the menu looked exactly like
              this — too beautiful to eat, too good not to. I&apos;ve made peace with the fact
              that I&apos;m the kind of person who photographs dessert before eating it. It
              takes about four seconds and I stand by it completely.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1038.jpg" alt="Rainy day at a café, city street outside" caption="Rainy days have their charm too" />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Not every café morning is precious and curated. Some are a rainy Tuesday at
              somewhere familiar because you need somewhere warm to sit and think. That counts
              too. What I like about coffee culture is that it has room for all of it — the
              slow Saturday flat white and the emergency americano in the rain.
            </p>
            <p>
              Also, rain in Poznań is genuinely quite nice sometimes. The city gets quieter.
              The café gets cozier. I have no complaints.
            </p>
          </Prose>
        </div>

        {/* Cat */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4">
          <Prose>
            <p>
              I also cat-sit for a friend pretty regularly. His name is Ragnar. He&apos;s a
              Scottish Fold with a very flat face and the kind of calm, intense stare that
              suggests he knows exactly what you&apos;re thinking and is mostly unimpressed by
              it. He has never once been excited to see me. He is always very pleased when I
              open the food cabinet.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_1221.jpg" alt="Scottish Fold cat looking up with huge golden eyes" caption="Ragnar. He does not care about your KPIs." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              He sat like this for about twenty minutes. I still don&apos;t know what he wanted.
              Probably just to be observed. Cat-sitting is, honestly, one of my favourite
              things — there&apos;s a cat, the cat wants food, you provide food, and then you
              sit on the sofa together and nobody needs to say anything. The best kind of company.
            </p>
          </Prose>
        </div>

        {/* Croatia */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4">
          <Prose>
            <p>
              I lived in Zagreb for a while — which meant I got to know Croatia properly, not
              just as a tourist but as a place people actually live. I loved it. The pace, the
              coffee culture, the way evenings in the old town feel completely unhurried. When
              I left Zagreb I stayed connected to the country — every summer I go back to
              the coast.
            </p>
            <p>
              I&apos;ve been to Dubrovnik, Split, Šibenik, Zadar. Each one has its own old
              town, its own light, its own particular version of beautiful. The Adriatic does
              something to your nervous system that I can&apos;t explain scientifically but
              can report anecdotally: three days of looking at that colour of water and you
              start breathing differently.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0548.jpg" alt="Crystal clear turquoise Adriatic Sea" caption="The Adriatic. That colour is real, not a filter." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I took that photo from a pier. The water was so clear you could see the bottom
              ten metres down. There were fish. I just stood there for a while. No thoughts,
              no agenda. Just the water and the light and the very specific sound the Adriatic
              makes when it hits stone.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0674.jpg" alt="Latte macchiato with sunglasses next to the Adriatic" caption="Coffee + sea. Basically my brand." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Finding a café that&apos;s actually on the water — tables-over-the-sea on the
              water — is one of those things I actively search for every trip. This one had a
              railing and the Adriatic right below it. I ordered a latte, put on my sunglasses,
              and felt extremely at peace with every decision I had ever made.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0541.jpg" alt="Barcaffè espresso on a Croatian café terrace" caption="Barcaffè — Italy's coffee culture, Croatia's setting." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Barcaffè is everywhere on the Croatian coast — Italian-influenced, small cups,
              fast and serious, usually at a little counter or a tiny table with the sea
              somewhere nearby. It&apos;s a completely different coffee experience from what
              I drink in Poznań. I love both for completely different reasons. Coffee tastes
              like where you are.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0556.jpg" alt="Ice cream cone in front of a Croatian church tower" caption="Gelato in the old town. Mandatory." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              The rule is: if you&apos;re in an old town in Croatia and you see a gelateria,
              you stop. It doesn&apos;t matter if you just ate. It doesn&apos;t matter if
              it&apos;s 10am. You stop, you choose carefully, you walk and eat and look at
              the church tower and feel like you&apos;re doing exactly the right thing.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0544.jpg" alt="Croatian old town street with flags stretching overhead" caption="The old towns never get old." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              I&apos;ve walked through a lot of Croatian old towns now. They&apos;re all
              different — Dubrovnik is dramatic, Split is alive, Zadar is quietly beautiful —
              but they all have this. Narrow stone streets, flags overhead, the sound of your
              own footsteps echoing off walls that have been there for centuries. I never want
              to leave any of them.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0528.jpg" alt="Loquat tree heavy with yellow fruit against blue sky" caption="The trees are different there. Everything is." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              Loquat trees. I had never seen one before Croatia. Now I look for them every time.
              There&apos;s something about that particular shade of orange-yellow against a
              completely blue sky that I find genuinely joyful — the kind of small, specific
              pleasure you only notice when you&apos;re moving slowly and paying attention.
              Croatia taught me to move more slowly.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0608.jpg" alt="Pizza beside ancient stone columns in Croatia" caption="Pizza next to a 2000-year-old wall. Regular Tuesday." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Prose>
            <p>
              This pizza was excellent. The column next to it was approximately 2,000 years
              old and had been incorporated into the restaurant wall as if that were completely
              normal. Nobody around me seemed particularly amazed. I was amazed enough for the
              whole table.
            </p>
          </Prose>
        </div>

        <Photo src="/images/personal/p_IMG_0570.jpg" alt="Stone sea wall with the Adriatic and islands beyond" caption="Where I go when I need to remember what actually matters." />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <Prose>
            <p>
              This is the view that resets everything. I sit here with a coffee or without one,
              I look at the water and the islands, and whatever I was stressed about before
              the trip stops feeling quite so important. I always come back from Croatia with
              better ideas, a clearer head, and an embarrassing number of photos that are
              basically all the same coffee cup from slightly different angles.
            </p>
          </Prose>
          <Pullquote>
            No regrets. Never any regrets.
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
