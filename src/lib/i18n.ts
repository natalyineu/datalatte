/** Polish site (phase 1). EN path -> PL path for pages that exist in both languages. */
export const BASE = "https://datalatte.pro";

export const EN_TO_PL: Record<string, string> = {
  "/": "/pl",
  "/services": "/pl/uslugi",
  "/services/google-ads": "/pl/uslugi/google-ads",
  "/services/meta-ads": "/pl/uslugi/meta-ads",
  "/services/local-seo": "/pl/uslugi/lokalne-seo",
  "/services/google-business-profile": "/pl/uslugi/profil-firmy-w-google",
  "/contact": "/pl/kontakt",
  "/about": "/pl/o-mnie",
  "/for/coffee-shops": "/pl/dla/kawiarni",
  "/for/hair-salons": "/pl/dla/salonow",
  "/for/pet-groomers": "/pl/dla/groomerow",
  "/for/fitness-studios": "/pl/dla/studiow-fitness",
  "/free-audit": "/pl/darmowy-audyt",
  "/privacy": "/pl/polityka-prywatnosci",
  "/blog/glovo-vs-wolt-which-is-better": "/pl/blog/glovo-vs-wolt-dla-restauracji-porownanie-prowizji",
  "/blog/online-booking-system-for-salons": "/pl/blog/system-rezerwacji-online-dla-salonow-porownanie-cen",
  "/blog/booksy-vs-vagaro-vs-fresha-best-booking-app-salons-2026": "/pl/blog/booksy-vs-vagaro-vs-fresha-koszty-dla-salonu",
  "/blog/best-marketing-automation-tools-small-business": "/pl/blog/najlepsze-narzedzia-marketing-automation-dla-malych-firm",
  "/blog/food-delivery-platform-advertising-comparison-europe": "/pl/blog/reklama-w-platformach-dostawy-jedzenia-w-europie-porownanie",
  "/blog/online-reviews-strategy-europe": "/pl/blog/strategia-opinii-online-dla-lokalnych-firm-w-europie",
  "/blog/poznan-cafes-google-maps-presence-ranking-2026": "/pl/blog/ranking-kawiarni-poznan-google-maps-2026",
};

export const PL_TO_EN: Record<string, string> = Object.fromEntries(Object.entries(EN_TO_PL).map(([en, pl]) => [pl, en]));

export const isPl = (pathname: string) => pathname === "/pl" || pathname.startsWith("/pl/");

/** hreflang block for an English page that has a Polish twin. */
export function withPl(enPath: string) {
  const pl = EN_TO_PL[enPath];
  const en = `${BASE}${enPath === "/" ? "" : enPath}`;
  return pl ? { "en-US": en, "en-GB": en, "en-AU": en, "en-CA": en, pl: `${BASE}${pl}`, "x-default": en } : { "en-US": en, "x-default": en };
}

/** Metadata `alternates` for a Polish page whose English twin is `enPath`. */
export function plAlternates(plPath: string) {
  const en = PL_TO_EN[plPath];
  const enUrl = en ? `${BASE}${en === "/" ? "" : en}` : undefined;
  return {
    canonical: `${BASE}${plPath}`,
    languages: { ...(enUrl ? { "en-US": enUrl, "x-default": enUrl } : {}), pl: `${BASE}${plPath}` },
  };
}
