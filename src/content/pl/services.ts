// Polish service pages (phase 1). Written for the Polish market, not a literal translation:
// no unsourced statistics, no features that do not exist in Poland (e.g. Local Services Ads), no prices.

export interface PlService {
  slug: string;
  path: string;
  service: string;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  tagline: string;
  description: string;
  icon: string;
  accentClass: string;
  titles: { basics: string; process: string; included: string; bestFor: string; faq: string };
  whatItIs: string;
  howItWorks: { step: string; title: string; desc: string }[];
  included: string[];
  bestFor: string[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; href: string }[];
  stats?: { value: string; label: string }[];
  short: string; // one-liner for the overview cards
}

export const PL_SERVICES: PlService[] = [
  {
    slug: "google-ads",
    path: "/pl/uslugi/google-ads",
    service: "Google Ads",
    navLabel: "Google Ads",
    seoTitle: "Google Ads dla kawiarni, salonów i lokalnych firm",
    seoDescription: "Prowadzenie kampanii Google Ads dla lokalnych firm w Polsce. Płacisz za kliknięcia osób, które właśnie szukają Twojej usługi. Konfiguracja, strategia i optymalizacja w cenie.",
    short: "Reklamy w wyszukiwarce i w Mapach. Płacisz tylko za kliknięcia osób, które aktywnie Cię szukają.",
    tagline: "Pojaw się wtedy, gdy ktoś w Twojej okolicy właśnie Cię szuka. Płacisz za kliknięcie.",
    description: "Google Ads wyświetla Twoją firmę na górze wyników w chwili, gdy potencjalny klient wpisuje to, co oferujesz. Dobrze prowadzona kampania to najkrótsza droga od „ktoś szuka” do „klient wchodzi do lokalu”.",
    icon: "🎯",
    accentClass: "bg-gradient-to-br from-coffee-900 to-coffee-950",
    titles: {
      basics: "Czym naprawdę są reklamy Google Ads?",
      process: "Jak pracuję z kampaniami Google Ads",
      included: "Co dostajesz w usłudze Google Ads",
      bestFor: "Google Ads sprawdza się najlepiej dla:",
      faq: "Pytania o Google Ads",
    },
    whatItIs:
      "Google Ads to system reklam płatnych za kliknięcie. Twoje reklamy mogą pojawiać się w wynikach wyszukiwania, w Mapach Google, na YouTube i na stronach partnerskich. Dla lokalnej firmy najcenniejsze są reklamy w wyszukiwarce: wybierasz frazy, na przykład „kawiarnia w pobliżu” albo „fryzjer Poznań”, a reklama pokazuje się nad wynikami organicznymi. Płacisz dopiero wtedy, gdy ktoś w nią kliknie.\n\nSiła tego kanału to intencja. Osoba, która wpisuje frazę w Google, już czegoś szuka. To zupełnie inna sytuacja niż w mediach społecznościowych, gdzie reklama przerywa komuś przewijanie. Dlatego w lejku sprzedażowym Google Ads stoi na samym dole: zbiera popyt, który już istnieje.\n\nNajczęstszy błąd właścicieli firm to szerokie dopasowanie fraz bez listy wykluczeń. Salon, który licytuje samo słowo „fryzjer”, płaci za kliknięcia osób szukających pracy, kursów albo usług dla zwierząt. Budżet kończy się w kilka tygodni i wnioski są takie, że „Google Ads nie działa”. Działa, ale wymaga uporządkowanej struktury kampanii, wykluczeń i mierzenia wyniku.",
    howItWorks: [
      { step: "01", title: "Audyt i analiza", desc: "Zaczynam od audytu Twojego konta (jeśli już je masz) i analizy lokalnych fraz: czego szukają ludzie, jak duża jest konkurencja i jaki budżet ma sens." },
      { step: "02", title: "Struktura kampanii", desc: "Buduję grupy reklam wokół jednego tematu, listy wykluczeń i targetowanie geograficzne dopasowane do tego, gdzie naprawdę obsługujesz klientów, a nie do całego miasta." },
      { step: "03", title: "Teksty reklam", desc: "Nagłówki i opisy pisane pod intencję wyszukiwania. Testuję kilka wariantów i poprawiam je na podstawie klikalności i konwersji." },
      { step: "04", title: "Pomiar konwersji", desc: "Zanim kampania ruszy, ustawiam pomiar telefonów, formularzy i rezerwacji. Czego nie da się zmierzyć, tego nie da się poprawić." },
      { step: "05", title: "Optymalizacja i raport", desc: "Cotygodniowe poprawki stawek, przegląd wyszukiwanych haseł pod kątem nowych fraz i wykluczeń, praca nad wynikiem jakości. Raport w prostym języku." },
    ],
    included: [
      "Założenie konta lub pełny audyt istniejącego",
      "Analiza fraz i konkurencji w Twoim mieście",
      "Struktura kampanii i grup reklam",
      "Teksty reklam, reklamy responsywne i testy A/B",
      "Targetowanie geograficzne i do grup odbiorców",
      "Lista wykluczeń i przegląd wyszukiwanych haseł",
      "Konfiguracja pomiaru: telefony, formularze, rezerwacje, zakupy",
      "Rozszerzenia reklam: telefon, lokalizacja, linki do podstron",
      "Remarketing do osób, które odwiedziły stronę",
      "Kampanie Performance Max, jeśli pasują do Twojego biznesu",
      "Wskazówki do strony docelowej i jej optymalizacji",
      "Cotygodniowe poprawki i miesięczny raport",
    ],
    bestFor: [
      "Kawiarnie, które chcą być widoczne dla wyszukiwań „w pobliżu”",
      "Salony fryzjerskie i kosmetyczne reklamujące konkretne usługi",
      "Groomerzy w miastach z dużą konkurencją",
      "Studia fitness szukające zapisów na zajęcia próbne",
      "Sklepy internetowe uruchamiające Zakupy Google i Performance Max",
      "Firmy z kilkoma lokalizacjami, które potrzebują spójnych kampanii",
      "Każda firma, której klienci szukają w Google, zanim kupią",
    ],
    faqs: [
      { q: "Ile budżetu potrzebuję na Google Ads?", a: "To zależy od miasta, branży i konkurencji. Nie podaję kwot z głowy: w darmowym audycie sprawdzam ceny kliknięć dla Twoich fraz w Planerze słów kluczowych Google i proponuję budżet startowy, który pozwoli zebrać wiarygodne dane. Moje wynagrodzenie jest osobne i jawne." },
      { q: "Po jakim czasie zobaczę efekty?", a: "Ruch pojawia się w dniu uruchomienia kampanii. Pierwsze tygodnie to jednak okres nauki: zbieramy dane i poprawiamy kampanię. Stabilne wyniki zwykle przychodzą po kilku miesiącach pracy." },
      { q: "Konkurencja reklamuje się wszędzie. Czy mogę z nią walczyć?", a: "Często tak. Duży budżet nie oznacza mądrej kampanii. Dokładne targetowanie lokalne, dobre wykluczenia i trafne reklamy pozwalają mniejszym firmom wygrywać z większymi, ale źle prowadzonymi kontami." },
      { q: "Czy muszę mieć stronę internetową?", a: "W reklamach w wyszukiwarce tak, potrzebujesz miejsca, do którego prowadzisz ruch. Jeśli strona słabo konwertuje, powiem Ci o tym. Rozszerzenia reklam pozwalają też generować telefony i prośby o wskazanie drogi bezpośrednio z reklamy." },
      { q: "Wcześniej próbowałem Google Ads i straciłem pieniądze. Co będzie inaczej?", a: "Zwykle zawodzą trzy rzeczy: szerokie dopasowanie bez wykluczeń, brak pomiaru konwersji i strona, która nie pasuje do reklamy. Zaczynam od audytu, co poszło nie tak, zanim wydam choć złotówkę." },
      { q: "Jaki koszt pozyskania zapytania jest realny dla mojej branży?", a: "Nie podaję uśrednionych liczb, bo w Polsce nie ma jednego wiarygodnego benchmarku dla małych firm lokalnych. W audycie szacuję koszt na podstawie danych Planera słów kluczowych i mierzę go na Twoich realnych wynikach od pierwszego tygodnia." },
      { q: "Czy prowadzić jednocześnie Google Ads i SEO?", a: "Tak, te kanały się uzupełniają. Reklamy dają szybką widoczność i dane o tym, które frazy konwertują. Te dane wzmacniają strategię SEO. Gdy pozycje organiczne dla frazy rosną, można ograniczyć wydatki na reklamę." },
      { q: "Co to jest wynik jakości (Quality Score)?", a: "To ocena Google, od 1 do 10, tego jak trafne są względem siebie fraza, reklama i strona docelowa. Wyższy wynik zwykle oznacza niższy koszt kliknięcia. Poprawianie go to jedna z najtańszych optymalizacji, jakie robię." },
    ],
    stats: [
      { value: "48 h", label: "na pierwszy audyt konta" },
      { value: "Co tydzień", label: "poprawki stawek i fraz" },
      { value: "Co miesiąc", label: "raport w prostym języku" },
      { value: "0", label: "umów na rok" },
    ],
    relatedLinks: [
      { label: "Meta Ads", href: "/pl/uslugi/meta-ads" },
      { label: "Lokalne SEO", href: "/pl/uslugi/lokalne-seo" },
      { label: "Profil Firmy w Google", href: "/pl/uslugi/profil-firmy-w-google" },
    ],
  },
  {
    slug: "meta-ads",
    path: "/pl/uslugi/meta-ads",
    service: "Meta Ads",
    navLabel: "Meta Ads (Facebook i Instagram)",
    seoTitle: "Meta Ads: reklamy na Facebooku i Instagramie dla lokalnych firm",
    seoDescription: "Reklamy na Facebooku i Instagramie dla kawiarni, salonów, groomerów i studiów fitness. Docieraj do ludzi z Twojej okolicy, zanim zaczną szukać. Konfiguracja i optymalizacja.",
    short: "Reklamy na Facebooku i Instagramie, które docierają do ludzi z okolicy, zanim zaczną szukać.",
    tagline: "Dotrzyj do klientów z okolicy na Facebooku i Instagramie, zanim zaczną Cię szukać.",
    description: "Meta Ads pokazują Twoją ofertę ludziom z Twojego miasta, którzy jeszcze nie wiedzą, że istniejesz. To dobry kanał dla firm z atrakcyjnym wizualnie efektem: kawiarni, salonów, studiów i groomerów.",
    icon: "📱",
    accentClass: "bg-gradient-to-br from-coffee-900 to-gray-950",
    titles: {
      basics: "Czym są reklamy Meta Ads?",
      process: "Jak pracuję z reklamami Meta",
      included: "Co dostajesz w usłudze Meta Ads",
      bestFor: "Meta Ads sprawdza się najlepiej dla:",
      faq: "Pytania o reklamy na Facebooku i Instagramie",
    },
    whatItIs:
      "Meta Ads to system reklamowy Facebooka i Instagrama. Reklamy mogą pojawiać się w aktualnościach, w relacjach (stories), w Reels i w wiadomościach. Najważniejsza różnica wobec Google: ludzie nie szukają wtedy Twojej usługi, więc reklama musi zwrócić ich uwagę, zanim zaczną jej szukać.\n\nDla lokalnej firmy to dobre narzędzie do budowania rozpoznawalności i wprowadzania nowej oferty w okolicy: sezonowego menu, zajęć próbnych, promocji na pierwszą wizytę. Targetowanie pozwala dotrzeć do mieszkańców konkretnych dzielnic, w wybranym wieku i z wybranymi zainteresowaniami.\n\nNajczęstszy błąd to „promowanie posta” przyciskiem w aplikacji zamiast pełnej kampanii. Promowany post ma ograniczone targetowanie i nie mierzy tego, co ważne: zapytań, rezerwacji i wizyt. Dobra kampania zaczyna się od oferty, której nowy klient nie odmówi, i od pomiaru, który pokazuje, co z niej wynika.",
    howItWorks: [
      { step: "01", title: "Odbiorcy i strategia", desc: "Określam, kogo chcemy dotrzeć w Twoim mieście: wiek, dzielnice, zainteresowania, i jakie są realistyczne cele kampanii." },
      { step: "02", title: "Oferta i brief kreatywny", desc: "Pomagam sformułować ofertę dla nowych klientów i przygotowuję brief do zdjęć i krótkich filmów. Materiały dostarczasz Ty lub robimy je razem." },
      { step: "03", title: "Konfiguracja kampanii", desc: "Struktura kampanii od zasięgu po konwersję, teksty do wszystkich miejsc wyświetlania, formularze zapytań, jeśli są potrzebne." },
      { step: "04", title: "Piksel i konwersje", desc: "Ustawiam piksel Meta i zdarzenia konwersji, żeby widzieć, które reklamy przynoszą zapytania i rezerwacje, a nie tylko polubienia." },
      { step: "05", title: "Testy i optymalizacja", desc: "Testuję oferty, obrazy i teksty, wyłączam to, co nie działa, i skaluję to, co działa. Raport miesięczny z konkretnymi wnioskami." },
    ],
    included: [
      "Założenie konta reklamowego lub audyt istniejącego",
      "Analiza odbiorców i strategia targetowania",
      "Struktura kampanii (od świadomości do konwersji)",
      "Teksty reklam do wszystkich miejsc wyświetlania",
      "Briefy kreatywne do zdjęć i filmów",
      "Formularze zapytań w reklamie, jeśli pasują do oferty",
      "Konfiguracja piksela Meta i zdarzeń konwersji",
      "Testy A/B ofert i kreacji",
      "Podobni odbiorcy tworzeni z listy Twoich klientów",
      "Remarketing do odwiedzających stronę i oglądających filmy",
      "Miesięczny raport i przegląd strategii",
    ],
    bestFor: [
      "Salony fryzjerskie i kosmetyczne z efektownymi zdjęciami „przed i po”",
      "Studia fitness i jogi oferujące zajęcia próbne",
      "Kawiarnie promujące sezonowe menu i wydarzenia",
      "Groomerzy z materiałami „przed i po”",
      "Firmy, które chcą zbudować lokalną rozpoznawalność",
      "Każda lokalna firma z ofertą, która zachęca nowych klientów",
    ],
    faqs: [
      { q: "Jaki budżet potrzebuję na reklamy Meta?", a: "Nie ma jednej kwoty. Zależy od miasta, oferty i celu. W audycie proponuję budżet testowy, który pozwoli zebrać wiarygodne dane w kilka tygodni, i nie obiecuję wyników, zanim je zobaczymy. Moje wynagrodzenie jest osobne i jawne." },
      { q: "Czy potrzebuję profesjonalnych zdjęć i filmów?", a: "Nie zawsze. Często lepiej działają prawdziwe, dobrze oświetlone zdjęcia i krótkie filmy z telefonu niż drogie, sztuczne produkcje. Dam Ci brief: co sfotografować, jak i w jakim formacie." },
      { q: "Czym różni się promowanie posta od prawdziwej reklamy?", a: "Promowany post ma ograniczone opcje targetowania i celów. Pełna kampania w Menedżerze reklam pozwala wybrać dokładnych odbiorców, cel (zapytania, wizyty, rezerwacje), umiejscowienie i mierzyć wynik." },
      { q: "Mam mało obserwujących. Czy to szkodzi reklamom?", a: "Nie. Liczba obserwujących nie decyduje o tym, komu reklama się wyświetla. Ważniejsze są oferta, kreacja i targetowanie." },
      { q: "Próbowałem reklam na Facebooku i nic z tego nie wyszło. Co będzie inaczej?", a: "Zwykle brakuje trzech rzeczy: konkretnej oferty dla nowego klienta, mierzenia zapytań i cierpliwości na testy. Zaczynam od przeglądu, co poszło nie tak, zanim ruszy nowa kampania." },
      { q: "Po jakim czasie widać efekty?", a: "Reklamy zaczynają się wyświetlać od razu, ale algorytm potrzebuje czasu na naukę. Pierwsze wnioski są po kilku tygodniach testów, stabilny wynik zwykle po kilku miesiącach." },
      { q: "Facebook czy Instagram, a może oba?", a: "To zależy od Twoich klientów. Sprawdzam, gdzie są Twoi odbiorcy i jakie materiały już masz, zwykle zaczynam od obu miejsc wyświetlania, a potem zawężam budżet na to, co daje zapytania." },
      { q: "Jaka oferta działa na lokalnym rynku?", a: "Konkretna i łatwa do przyjęcia dla kogoś, kto Cię nie zna: zajęcia próbne, pierwsza wizyta w promocyjnej cenie, zestaw dla nowych klientów. Wspólnie dobieramy ofertę, która nie psuje Ci marży." },
    ],
    stats: [
      { value: "48 h", label: "na pierwszy audyt" },
      { value: "Co miesiąc", label: "raport i wnioski" },
      { value: "Testy A/B", label: "ofert i kreacji" },
      { value: "0", label: "umów na rok" },
    ],
    relatedLinks: [
      { label: "Google Ads", href: "/pl/uslugi/google-ads" },
      { label: "Lokalne SEO", href: "/pl/uslugi/lokalne-seo" },
      { label: "Profil Firmy w Google", href: "/pl/uslugi/profil-firmy-w-google" },
    ],
  },
  {
    slug: "lokalne-seo",
    path: "/pl/uslugi/lokalne-seo",
    service: "Lokalne SEO",
    navLabel: "Lokalne SEO",
    seoTitle: "Lokalne SEO dla kawiarni, salonów i firm usługowych",
    seoDescription: "Lokalne SEO dla firm z jednym lub kilkoma lokalami: audyt, frazy, optymalizacja strony, wpisy w katalogach i dane strukturalne. Pozycje, które przynoszą klientów, nie sam ruch.",
    short: "Widoczność w wynikach lokalnych i Mapach: audyt, frazy, strona, katalogi, dane strukturalne.",
    tagline: "Zajmij pozycje w wyszukiwaniach, które przynoszą klientów, a nie tylko wejścia na stronę.",
    description: "Lokalne SEO sprawia, że Twoja firma pojawia się w wynikach wyszukiwania i w Mapach Google, gdy ktoś w okolicy szuka tego, co robisz. To kanał, który pracuje dla Ciebie także wtedy, gdy nie płacisz za reklamy.",
    icon: "🔎",
    accentClass: "bg-gradient-to-br from-coffee-950 to-gray-900",
    titles: {
      basics: "Czym jest lokalne SEO?",
      process: "Jak pracuję nad lokalnym SEO",
      included: "Co dostajesz w usłudze lokalne SEO",
      bestFor: "Lokalne SEO sprawdza się najlepiej dla:",
      faq: "Pytania o lokalne SEO",
    },
    whatItIs:
      "Lokalne SEO to praca nad tym, żeby Twoja firma była widoczna w wynikach wyszukiwania i w Mapach Google dla fraz z lokalnym zamiarem, na przykład „kawiarnia Jeżyce” albo „fryzjer w pobliżu”. Obejmuje Profil Firmy w Google, treść strony, spójne dane firmy w katalogach i dane, które pomagają wyszukiwarce zrozumieć, czym się zajmujesz.\n\nGoogle podaje, że wyniki lokalne zależą głównie od trafności, odległości i rozpoznawalności, a rozpoznawalność wynika między innymi z liczby opinii i liczby stron, które linkują do firmy. Google zaznacza też, że nie da się zapłacić za lepszą pozycję w wynikach lokalnych. To dobra wiadomość dla małych firm: uporządkowany profil i regularne opinie naprawdę robią różnicę.\n\nNajczęstszy błąd to niespójne dane: inny adres w Google, inny na stronie i jeszcze inny w katalogu, albo brak strony, która odpowiada na pytania klientów. Zaczynamy więc od audytu i porządków, a dopiero potem budujemy nowe treści i wpisy.",
    howItWorks: [
      { step: "01", title: "Audyt lokalnego SEO", desc: "Sprawdzam Profil Firmy w Google, stronę, spójność danych i pozycje Twoje oraz konkurentów dla kluczowych fraz w Twojej okolicy." },
      { step: "02", title: "Mapa fraz", desc: "Dobieram frazy do podstron: co ludzie wpisują, gdy szukają Twojej usługi w mieście lub dzielnicy, i która podstrona ma na nie odpowiadać." },
      { step: "03", title: "Optymalizacja strony", desc: "Poprawiam tytuły, opisy, nagłówki, dane kontaktowe i mapę, tak by strona odpowiadała na pytania klientów i była czytelna na telefonie." },
      { step: "04", title: "Katalogi i spójność danych", desc: "Porządkuję wpisy w katalogach i na mapach, żeby nazwa, adres i telefon były takie same wszędzie, i dodaję brakujące ważne wpisy." },
      { step: "05", title: "Treści i dane strukturalne", desc: "Planuję treści lokalne i dodaję dane strukturalne (LocalBusiness), które mówią Google, czym jest firma, gdzie jest i kiedy jest otwarta." },
    ],
    included: [
      "Audyt lokalnego SEO",
      "Analiza pozycji konkurentów",
      "Analiza i mapowanie lokalnych fraz",
      "Optymalizacja kluczowych podstron",
      "Optymalizacja Profilu Firmy w Google",
      "Audyt i porządkowanie wpisów w katalogach",
      "Dodanie ważnych brakujących wpisów",
      "Dane strukturalne LocalBusiness i pokrewne",
      "Brief do treści lokalnych",
      "Przegląd linkowania wewnętrznego",
      "Sprawdzenie szybkości strony i Core Web Vitals",
      "Miesięczny raport pozycji",
    ],
    bestFor: [
      "Firmy, które nie miały jeszcze podstaw SEO",
      "Lokale w miastach, gdzie konkurencja ma słabe lokalne SEO",
      "Właściciele, którzy chcą ruchu niezależnego od reklam",
      "Kawiarnie, salony, groomerzy i studia w miastach o średniej konkurencji",
      "Firmy, które niedawno otworzyły nowy lokal lub zmieniły adres",
      "Każda firma, która chce z czasem ograniczyć zależność od płatnych reklam",
    ],
    faqs: [
      { q: "Po jakim czasie lokalne SEO zaczyna działać?", a: "To praca na miesiące, nie na dni. Pierwsze poprawki są widoczne szybciej, ale trwałe pozycje wymagają czasu. Nie obiecuję konkretnych pozycji i nie podaję uśrednionych terminów, bo zależą od konkurencji w Twoim mieście." },
      { q: "Czy muszę prowadzić blog, żeby mieć lokalne SEO?", a: "Nie musisz, ale pomaga. Najpierw porządkujemy profil, stronę i dane firmy. Treści dodajemy, gdy odpowiadają na realne pytania klientów, na przykład cennik, dojazd lub oferta." },
      { q: "Mam kilka lokali. Czy to komplikuje sprawę?", a: "Trochę, ale da się to ułożyć. Każdy lokal powinien mieć własny profil, własną podstronę i spójne dane. Pomagam to zaplanować." },
      { q: "Czym różni się lokalne SEO od zwykłego SEO?", a: "Zwykłe SEO walczy o pozycje w całym kraju lub w internecie. Lokalne SEO dotyczy fraz z lokalnym zamiarem i wyników w Mapach, gdzie ważne są odległość, opinie i spójność danych firmy." },
      { q: "Czy lokalne SEO się opłaca w porównaniu z Google Ads?", a: "To różne narzędzia. Reklamy dają szybką widoczność, ale przestają działać, gdy przestajesz płacić. Lokalne SEO buduje widoczność, która zostaje. Często dobrze działają razem. Konkretne porównanie robię w audycie, na Twoich frazach." },
      { q: "Moja firma jest nowa. Czy lokalne SEO ma sens?", a: "Tak, i warto zacząć od razu: założyć i zweryfikować Profil Firmy, uporządkować dane i zacząć zbierać opinie. Wczesne dobre nawyki oszczędzają później dużo pracy." },
      { q: "Co to są cytowania lokalne i dlaczego mają znaczenie?", a: "To wpisy z nazwą, adresem i telefonem Twojej firmy w katalogach i na mapach. Spójne dane pomagają Google upewnić się, że to ta sama firma. Niespójne wprowadzają zamieszanie." },
      { q: "Czy mogę robić lokalne SEO sam?", a: "Podstawy tak: profil, opinie, spójność danych. Mój artykuł z rankingiem kawiarni w Poznaniu zawiera listę kontrolną. Specjalista przydaje się przy audycie, danych strukturalnych i porównaniu z konkurencją." },
    ],
    stats: [
      { value: "Audyt", label: "profilu, strony i danych firmy" },
      { value: "Co miesiąc", label: "raport pozycji" },
      { value: "LocalBusiness", label: "dane strukturalne" },
      { value: "0", label: "umów na rok" },
    ],
    relatedLinks: [
      { label: "Profil Firmy w Google", href: "/pl/uslugi/profil-firmy-w-google" },
      { label: "Google Ads", href: "/pl/uslugi/google-ads" },
      { label: "Meta Ads", href: "/pl/uslugi/meta-ads" },
    ],
  },
  {
    slug: "profil-firmy-w-google",
    path: "/pl/uslugi/profil-firmy-w-google",
    service: "Profil Firmy w Google",
    navLabel: "Profil Firmy w Google",
    seoTitle: "Profil Firmy w Google: optymalizacja wizytówki dla lokalnych firm",
    seoDescription: "Optymalizacja Profilu Firmy w Google (wizytówki w Mapach): kategorie, atrybuty, zdjęcia, opinie, wpisy. Darmowy kanał, który większość firm wykorzystuje tylko w części.",
    short: "Darmowa wizytówka w Mapach i wyszukiwarce: kategorie, atrybuty, zdjęcia, opinie.",
    tagline: "Darmowy kanał lokalny, który większość firm wykorzystuje tylko w części.",
    description: "Profil Firmy w Google (dawniej Google Moja Firma) to wizytówka, którą ludzie widzą, gdy szukają Cię w wyszukiwarce i w Mapach. Uzupełniony i aktualny profil to najtańsza droga do większej liczby telefonów i wizyt.",
    icon: "📍",
    accentClass: "bg-gradient-to-br from-coffee-900 to-coffee-950",
    titles: {
      basics: "Czym jest Profil Firmy w Google?",
      process: "Jak pracuję nad Profilem Firmy w Google",
      included: "Co dostajesz w usłudze Profil Firmy w Google",
      bestFor: "Optymalizacja profilu sprawdza się najlepiej dla:",
      faq: "Pytania o Profil Firmy w Google",
    },
    whatItIs:
      "Profil Firmy w Google to bezpłatna wizytówka firmy w wyszukiwarce i w Mapach. Zawiera adres, godziny otwarcia, kategorie, zdjęcia, opinie, przycisk połączenia i trasy. Dla lokalnej firmy to często pierwsze, co zobaczy potencjalny klient.\n\nGoogle podaje, że firmy z kompletnymi i dokładnymi informacjami częściej pokazują się w wynikach lokalnych, i wymienia jako dane do uzupełnienia adres, godziny otwarcia (także specjalne, na święta), kategorię i atrybuty. Google zaznacza też, że więcej opinii i dobre oceny mogą poprawiać pozycję lokalną, a za lepszą pozycję nie da się zapłacić.\n\nNajczęstszy błąd to profil założony i porzucony: nieaktualne godziny, jedna kategoria, kilka starych zdjęć, opinie bez odpowiedzi. Taki profil nie pomaga i może odstraszać. Zaczynamy od audytu, a potem ustawiamy prosty rytm utrzymania.",
    howItWorks: [
      { step: "01", title: "Pełny audyt profilu", desc: "Sprawdzam kompletność danych, kategorie, atrybuty, zdjęcia, opinie, odpowiedzi i to, co widzi klient na telefonie." },
      { step: "02", title: "Kategorie i atrybuty", desc: "Dobieram główną kategorię, które najlepiej opisuje Twoją działalność, kilka dodatkowych oraz atrybuty ważne dla klientów, takie jak Wi-Fi czy miejsca na zewnątrz." },
      { step: "03", title: "Opis, usługi i zdjęcia", desc: "Poprawiam opis firmy i listę usług oraz podpowiadam, jakie zdjęcia dodać (zewnątrz lokalu, wnętrze, oferta) i co usunąć." },
      { step: "04", title: "Strategia opinii", desc: "Ustalamy, jak prosić klientów o opinie zgodnie z zasadami Google (link lub kod QR), i przygotowuję wzory odpowiedzi na opinie pozytywne i negatywne." },
      { step: "05", title: "Wpisy i utrzymanie", desc: "Konfiguruję wpisy w profilu, ustawiam godziny świąteczne i prosty miesięczny przegląd, żeby profil nie wyszedł z użycia." },
    ],
    included: [
      "Pełny audyt profilu",
      "Dobór kategorii i atrybutów",
      "Poprawa opisu firmy",
      "Kompletna lista usług z opisami",
      "Wskazówki dotyczące zdjęć i filmów",
      "Strategia próśb o opinie i wzory tekstów",
      "Wzory odpowiedzi na opinie pozytywne i negatywne",
      "Godziny otwarcia i godziny specjalne",
      "Sekcja produktów dla firm sprzedających towary",
      "Link do rezerwacji lub zapisu",
      "Miesięczne śledzenie wyników (wyświetlenia, telefony, trasy)",
    ],
    bestFor: [
      "Każda lokalna firma z niedokończonym profilem",
      "Firmy, które nie pokazują się w pierwszej piątce wyników lokalnych",
      "Firmy z małą liczbą opinii w Google",
      "Firmy, które nigdy nie sprawdzały, jakich fraz używają klienci",
      "Kawiarnie, salony, groomerzy i studia, które chcą darmowych wejść z Map",
      "Firmy, które niedawno zmieniły adres lub ofertę",
    ],
    faqs: [
      { q: "Po jakim czasie zobaczę efekty optymalizacji profilu?", a: "Część zmian, na przykład godziny i atrybuty, jest widoczna po zatwierdzeniu przez Google. Pozycje i opinie zmieniają się wolniej. Nie obiecuję konkretnych terminów, bo zależą od konkurencji w Twoim mieście." },
      { q: "Mam już profil. Czy potrzebuję tej usługi?", a: "Jeśli profil jest kompletny i aktualny, może nie. W audycie sprawdzam to uczciwie i mówię, co warto poprawić, a czego nie." },
      { q: "Czy pomożesz, gdy profil został zawieszony albo mam duplikaty?", a: "Pomagam przejść procedurę zgłoszeń i weryfikacji, ale decyzję podejmuje Google. Nie mam wpływu na jej wynik i nie obiecuję go." },
      { q: "Czy opinie naprawdę wpływają na pozycję?", a: "Google podaje, że prominence, czyli rozpoznawalność, zależy między innymi od liczby opinii, i że więcej opinii oraz dobre oceny mogą poprawiać pozycję lokalną." },
      { q: "Ile opinii potrzebuję, żeby pokazać się wyżej?", a: "Google nie podaje progu. W naszej analizie 210 kawiarni z Poznania mediana to 219 opinii, a najlepiej zaprezentowane miejsca mają ich co najmniej kilkaset. To punkt odniesienia, nie wymóg." },
      { q: "Czym różni się optymalizacja profilu od lokalnego SEO?", a: "Profil to jeden element lokalnego SEO. Lokalne SEO obejmuje jeszcze stronę, wpisy w katalogach i dane strukturalne. Wiele firm zaczyna od profilu, bo daje najszybszy efekt przy małym nakładzie." },
      { q: "Czy odpowiadać na negatywne opinie?", a: "Tak, spokojnie i rzeczowo. Google zaznacza, że odpowiedzi mają być rozmowne, a nie promocyjne, i że nie należy w nich oferować rabatów. Dostajesz wzory odpowiedzi." },
      { q: "Czy mogę mieć jednocześnie Profil Firmy i reklamy Google Ads?", a: "Tak. Profil działa organicznie, a reklamy dodają widoczność. Dobrze prowadzony profil poprawia też skuteczność reklam lokalnych." },
    ],
    stats: [
      { value: "Audyt", label: "kompletności profilu" },
      { value: "QR i link", label: "do próśb o opinie" },
      { value: "Wzory", label: "odpowiedzi na opinie" },
      { value: "0", label: "umów na rok" },
    ],
    relatedLinks: [
      { label: "Lokalne SEO", href: "/pl/uslugi/lokalne-seo" },
      { label: "Google Ads", href: "/pl/uslugi/google-ads" },
      { label: "Ranking kawiarni w Poznaniu", href: "/pl/blog/ranking-kawiarni-poznan-google-maps-2026" },
    ],
  },
];

export const plServiceBySlug = (slug: string) => PL_SERVICES.find((s) => s.slug === slug)!;
