// Polish niche pages (phase 2). No invented statistics or testimonials: the only numbers come from our own Poznań cafe analysis.
export interface PlNiche {
  slug: string;
  path: string;
  enPath: string;
  name: string;
  emoji: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  sub: string;
  problems: string[];
  channels: { icon: string; title: string; desc: string; href: string }[];
  tactics: { title: string; detail: string }[];
  data?: { value: string; label: string }[];
  dataNote?: { text: string; href: string; linkLabel: string };
  faq: { q: string; a: string }[];
}

const GA = "/pl/uslugi/google-ads", MA = "/pl/uslugi/meta-ads", SEO = "/pl/uslugi/lokalne-seo", GBP = "/pl/uslugi/profil-firmy-w-google";

export const PL_NICHES: PlNiche[] = [
  {
    slug: "kawiarni", path: "/pl/dla/kawiarni", enPath: "/for/coffee-shops", name: "Kawiarnie", emoji: "☕",
    seoTitle: "Marketing dla kawiarni: Mapy Google, Instagram i lokalne reklamy",
    seoDescription: "Marketing dla kawiarni i punktów z kawą: Profil Firmy w Google, lokalne SEO, Google Ads i Meta Ads. Oparty na analizie 210 kawiarni z Poznania.",
    headline: "Więcej gości w lokalu, nie tylko więcej polubień",
    sub: "Kawiarnia żyje z ruchu pieszego i stałych klientów. Pomagam być widocznym tam, gdzie ludzie szukają kawy: w Mapach Google i w Instagramie.",
    problems: [
      "Ktoś wpisuje „kawiarnia w pobliżu”, a Ty nie pojawiasz się w wynikach, choć jesteś za rogiem.",
      "Profil w Google jest niepełny: stare godziny, kilka zdjęć, opinie bez odpowiedzi.",
      "Próbowałeś reklam na Facebooku i nie wiesz, czy cokolwiek dały.",
      "Nie wiesz, które działania naprawdę przyprowadzają gości, a które tylko dobrze wyglądają.",
      "Konkurencja z mniej znanym wnętrzem ma więcej opinii i wyżej w Mapach.",
    ],
    channels: [
      { icon: "📍", title: "Profil Firmy w Google", desc: "Kompletne dane, kategorie, zdjęcia i system zbierania opinii. To najtańszy kanał, bo darmowy.", href: GBP },
      { icon: "🔎", title: "Lokalne SEO", desc: "Frazy z dzielnicą i miastem, spójne dane i strona, która odpowiada na pytania gości.", href: SEO },
      { icon: "🎯", title: "Google Ads", desc: "Reklamy dla osób, które szukają kawiarni w Twojej okolicy, z budżetem, który możesz kontrolować.", href: GA },
      { icon: "📱", title: "Meta Ads", desc: "Sezonowe menu, nowości i wydarzenia dla mieszkańców Twojej dzielnicy na Instagramie i Facebooku.", href: MA },
    ],
    tactics: [
      { title: "Zacznij od profilu, nie od reklam", detail: "Profil w Google nic nie kosztuje, a to on decyduje, czy pojawisz się w wynikach lokalnych. Reklamy mają sens dopiero, gdy profil jest uporządkowany." },
      { title: "Zbieraj opinie w stałym rytmie", detail: "Dane z Poznania pokazują, że oceny prawie nie odróżniają kawiarni, a liczba opinii tak. Prosimy o opinie w dobrym momencie (kod QR przy kasie) i odpowiadamy na każdą." },
      { title: "Pokaż, że istniejesz poza Google", detail: "Link do strony lub Instagrama w profilu to podstawa. W Poznaniu co czwarta kawiarnia nie ma żadnego z nich." },
      { title: "Reklamuj to, co sezonowe", detail: "Nowe menu, wydarzenia i promocje dobrze działają w krótkich, lokalnych kampaniach na Instagramie." },
    ],
    data: [
      { value: "210", label: "kawiarni z Poznania w naszej analizie" },
      { value: "219", label: "mediana opinii w Google" },
      { value: "35%", label: "podaje własną stronę" },
      { value: "26%", label: "bez strony i bez profilu w mediach społecznościowych" },
    ],
    dataNote: { text: "Przeanalizowaliśmy 210 poznańskich kawiarni w Google Maps. Cały ranking, metodę i plan na 90 dni znajdziesz w artykule.", href: "/pl/blog/ranking-kawiarni-poznan-google-maps-2026", linkLabel: "Czytaj analizę" },
    faq: [
      { q: "Od czego zacząć w kawiarni z małym budżetem?", a: "Od Profilu Firmy w Google: kompletne dane, zdjęcia, kategorie i prośby o opinie. To nic nie kosztuje poza czasem i daje widoczność w Mapach." },
      { q: "Czy kawiarni opłaca się Google Ads?", a: "Czasem tak, szczególnie w miejscach z dużym ruchem turystów lub w okolicach biur. Sprawdzam to w audycie na Twoich frazach, zanim zaproponuję budżet." },
      { q: "Czy Instagram wystarczy?", a: "Instagram buduje wizerunek i zasięg, ale ludzie szukający kawiarni „w pobliżu” używają Google i Map. Najlepiej łączyć oba kanały." },
      { q: "Ile opinii potrzebuję?", a: "Google nie podaje progu. W Poznaniu mediana to 219 opinii, a każda kawiarnia z pierwszej dziesiątki naszego rankingu ma ich co najmniej 607. To punkt odniesienia, nie wymóg." },
      { q: "Czy robisz coś dla kawiarni z kilkoma lokalami?", a: "Tak. Każdy lokal powinien mieć własny profil, podstronę i spójne dane. Pomagam to zaplanować." },
    ],
  },
  {
    slug: "salonow", path: "/pl/dla/salonow", enPath: "/for/hair-salons", name: "Salony fryzjerskie i kosmetyczne", emoji: "✂️",
    seoTitle: "Marketing dla salonów fryzjerskich i kosmetycznych",
    seoDescription: "Marketing dla fryzjerów, barberów i salonów kosmetycznych: rezerwacje z Instagrama i Google, Profil Firmy, lokalne SEO i reklamy. Bez umów na rok.",
    headline: "Pełny kalendarz rezerwacji, a nie tylko ładne zdjęcia",
    sub: "Salon sprzedaje efekt, który widać na zdjęciu. Pomagam zamienić Instagram i wyszukiwarkę w rezerwacje od nowych klientów z okolicy.",
    problems: [
      "Instagram wygląda dobrze, ale rzadko zamienia się w rezerwacje.",
      "Nowi klienci szukają „fryzjer + dzielnica” w Google i trafiają do konkurencji.",
      "Opinie są rozproszone albo ich brakuje, a odpowiedzi nie ma kto pisać.",
      "Wolne terminy w tygodniu, a w weekendy komplet.",
      "Reklamy „promuj post” nie dają zapytań, tylko polubienia.",
    ],
    channels: [
      { icon: "📱", title: "Meta Ads", desc: "Reklamy ze zdjęciami „przed i po” dla mieszkańców Twojej okolicy, z ofertą dla nowych klientów.", href: MA },
      { icon: "📍", title: "Profil Firmy w Google", desc: "Lista usług, link do rezerwacji, zdjęcia prac i opinie, które widać przy wyszukiwaniu.", href: GBP },
      { icon: "🎯", title: "Google Ads", desc: "Reklamy na konkretne usługi, na przykład koloryzacja lub strzyżenie męskie, w Twojej dzielnicy.", href: GA },
      { icon: "🔎", title: "Lokalne SEO", desc: "Strona z cennikiem usług i frazami lokalnymi, która odpowiada na pytania przed rezerwacją.", href: SEO },
    ],
    tactics: [
      { title: "Oferta dla nowego klienta", detail: "Reklama działa najlepiej, gdy proponuje konkretny pierwszy krok, na przykład konsultację lub pierwszą wizytę. Dobieramy ją tak, żeby nie psuć marży." },
      { title: "Rezerwacja w dwóch kliknięciach", detail: "Link do rezerwacji w profilu Google i w Instagramie skraca drogę od zainteresowania do terminu." },
      { title: "Usługi jako osobne frazy", detail: "Ludzie szukają konkretnych usług, nie „salonu”. Osobne opisy usług w profilu i na stronie pomagają im Cię znaleźć." },
      { title: "Opinie po każdej wizycie", detail: "Prosta prośba z kodem QR i odpowiedzi na każdą opinię budują zaufanie nowych klientów." },
    ],
    faq: [
      { q: "Czy mam obiecane efekty?", a: "Nie obiecuję liczby rezerwacji. Mierzę zapytania i rezerwacje od pierwszego tygodnia i pokazuję, co działa." },
      { q: "Ile kosztują reklamy dla salonu?", a: "To zależy od miasta i konkurencji. W darmowym audycie sprawdzam ceny kliknięć i proponuję budżet testowy. Moje wynagrodzenie jest osobne i jawne." },
      { q: "Czy muszę mieć stronę internetową?", a: "Przy reklamach w wyszukiwarce tak. Przy reklamach na Instagramie wystarczy dobry profil i link do rezerwacji." },
      { q: "Czy pomożesz z zasadami reklamowania usług kosmetycznych?", a: "Pilnuję, żeby reklamy nie łamały zasad platform. Wątpliwości prawne, na przykład dotyczące zabiegów medycyny estetycznej, warto skonsultować z prawnikiem." },
    ],
  },
  {
    slug: "groomerow", path: "/pl/dla/groomerow", enPath: "/for/pet-groomers", name: "Groomerzy i usługi dla zwierząt", emoji: "🐾",
    seoTitle: "Marketing dla groomerów i firm usługowych dla zwierząt",
    seoDescription: "Marketing dla salonów groomerskich, hotelików i psich fryzjerów: Google Ads, Profil Firmy, lokalne SEO i Meta Ads dla właścicieli zwierząt w Twojej okolicy.",
    headline: "Właściciele zwierząt szukają kogoś zaufanego. Bądź pierwszy w wynikach",
    sub: "Klient oddaje Ci swojego psa, więc zaufanie jest wszystkim. Pomagam pokazać opinie, zdjęcia i dostępne terminy tam, gdzie ludzie szukają.",
    problems: [
      "Klienci szukają „groomer + dzielnica” i trafiają do kogoś, kto ma więcej opinii.",
      "Terminy zapełniają się nierówno i trudno przewidzieć obłożenie.",
      "Zdjęcia „przed i po” leżą w telefonie zamiast pracować na Twoją markę.",
      "Reklamy w Google przepalają budżet na frazy, które nie dotyczą grooming'u.",
      "Nie ma systemu, który przypomina stałym klientom o kolejnej wizycie.",
    ],
    channels: [
      { icon: "🎯", title: "Google Ads", desc: "Reklamy dla osób, które szukają groomera w okolicy, z wykluczeniami, które chronią budżet.", href: GA },
      { icon: "📍", title: "Profil Firmy w Google", desc: "Usługi, cennik orientacyjny, zdjęcia efektów i opinie właścicieli zwierząt.", href: GBP },
      { icon: "📱", title: "Meta Ads", desc: "Zdjęcia „przed i po” i oferta dla nowych klientów dla mieszkańców Twojej okolicy.", href: MA },
      { icon: "🔎", title: "Lokalne SEO", desc: "Strona z usługami, rasami i cennikiem, która odpowiada na pytania przed pierwszą wizytą.", href: SEO },
    ],
    tactics: [
      { title: "Wykluczenia w Google Ads", detail: "Frazy z „psem” i „kotem” przyciągają też osoby szukające weterynarza, karmy czy szkolenia. Lista wykluczeń oszczędza budżet." },
      { title: "Zdjęcia efektów", detail: "Efekt strzyżenia najlepiej sprzedaje się wizualnie. Dostajesz brief, jak fotografować i co publikować w profilu Google i na Instagramie." },
      { title: "Opinie od właścicieli", detail: "Właściciele zwierząt chętnie piszą opinie, gdy ktoś ich o to poprosi w dobrym momencie, na przykład przy odbiorze psa." },
      { title: "Powroty stałych klientów", detail: "Przypomnienie o kolejnej wizycie (SMS lub e-mail za zgodą klienta) wypełnia kalendarz tańszym kanałem niż reklamy." },
    ],
    faq: [
      { q: "Czy reklama w Google ma sens dla małego salonu groomerskiego?", a: "Często tak, bo klienci szukają usługi w okolicy. Zaczynamy od małego budżetu testowego i mierzymy telefony oraz rezerwacje." },
      { q: "Czy pomożesz z rezerwacjami online?", a: "Pomagam dobrać prosty sposób rezerwacji i podpiąć go pod profil Google i reklamy." },
      { q: "Czy robisz coś dla hoteli dla zwierząt i dog walkerów?", a: "Tak, zasady są podobne: lokalna widoczność, opinie i oferta dla nowych klientów." },
    ],
  },
  {
    slug: "studiow-fitness", path: "/pl/dla/studiow-fitness", enPath: "/for/fitness-studios", name: "Studia fitness i jogi", emoji: "🏋️",
    seoTitle: "Marketing dla studiów fitness, jogi i siłowni",
    seoDescription: "Marketing dla studiów fitness, jogi i siłowni: zapisy na zajęcia próbne z Google i Instagrama, Profil Firmy, lokalne SEO i reklamy, przez cały rok.",
    headline: "Zajęcia próbne przez cały rok, nie tylko w styczniu",
    sub: "Studio żyje z członków, którzy zostają. Pomagam pozyskiwać nowych przez zajęcia próbne i utrzymać zainteresowanie poza sezonem noworocznym.",
    problems: [
      "Zapisy rosną w styczniu i we wrześniu, a między nimi cisza.",
      "Nowe osoby szukają studia w okolicy, ale trafiają do większej sieci.",
      "Zajęcia próbne nie zamieniają się w karnety.",
      "Profil w Google nie pokazuje grafiku, opinii i zdjęć wnętrza.",
      "Reklamy przyciągają kliknięcia, a nie zapisy.",
    ],
    channels: [
      { icon: "📱", title: "Meta Ads", desc: "Kampanie na zajęcia próbne dla mieszkańców w zasięgu dojazdu do studia.", href: MA },
      { icon: "🎯", title: "Google Ads", desc: "Reklamy dla osób, które szukają „yoga + dzielnica” lub „siłownia w pobliżu”.", href: GA },
      { icon: "📍", title: "Profil Firmy w Google", desc: "Zdjęcia wnętrza, trenerzy, grafik, link do zapisów i opinie członków.", href: GBP },
      { icon: "🔎", title: "Lokalne SEO", desc: "Podstrony zajęć, cennik i dojazd, które odpowiadają na pytania przed pierwszą wizytą.", href: SEO },
    ],
    tactics: [
      { title: "Zajęcia próbne jako oferta", detail: "To naturalny pierwszy krok dla kogoś, kto Cię nie zna. Ważny jest prosty zapis i jasny kolejny krok po zajęciach." },
      { title: "Cały rok, nie tylko sezon", detail: "Planujemy kampanie wokół momentów, gdy ludzie wracają do rutyny: wrzesień, styczeń, wiosna. Poza nimi utrzymujemy stałą, mniejszą widoczność." },
      { title: "Pokaż miejsce i ludzi", detail: "Zdjęcia wnętrza i trenerów oraz opinie zmniejszają obawę przed pierwszą wizytą." },
      { title: "Mierz zapisy, nie kliknięcia", detail: "Ustawiam pomiar zapisów na zajęcia próbne i karnetów, żeby wiedzieć, który kanał naprawdę działa." },
    ],
    faq: [
      { q: "Czy reklamy zapełnią mi grafik?", a: "Nie obiecuję liczby zapisów. Mierzę je od pierwszego tygodnia i pokazuję koszt pozyskania jednego uczestnika zajęć próbnych." },
      { q: "Jak utrzymać zainteresowanie poza sezonem noworocznym?", a: "Stała, mniejsza widoczność w Google i na Instagramie, oferta zajęć próbnych i opinie członków. Plan ustalamy po audycie." },
      { q: "Czy pomagasz też małym studiom jogi i pilatesu?", a: "Tak, to dla nich lokalna widoczność ma największe znaczenie." },
    ],
  },
];
export const plNicheBySlug = (s: string) => PL_NICHES.find((n) => n.slug === s);
