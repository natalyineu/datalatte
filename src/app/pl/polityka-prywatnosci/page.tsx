import type { Metadata } from "next";
import { plAlternates } from "@/lib/i18n";
import CookieSettingsLink from "@/components/pl/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Jak DataLatte przetwarza dane osobowe i pliki cookies na polskiej części serwisu datalatte.pro: cele, podstawy prawne, odbiorcy, Twoje prawa.",
  alternates: plAlternates("/pl/polityka-prywatnosci"),
};

const H = ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-9 mb-3">{children}</h2>;
const P = ({ children }: { children: React.ReactNode }) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{children}</p>;
const L = ({ children }: { children: React.ReactNode }) => <ul className="list-disc pl-6 space-y-1.5 text-gray-700 dark:text-gray-300 mb-3">{children}</ul>;

export default function Page() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Polityka prywatności</h1>
        <p className="text-sm text-gray-500 mb-8">Dotyczy polskiej części serwisu datalatte.pro (adresy zaczynające się od /pl). Ostatnia aktualizacja: 3 listopada 2026.</p>

        <H>1. Administrator danych</H>
        <P>Administratorem danych osobowych jest DataLatte, prowadzone przez Nataliię (dalej: „administrator”). Kontakt w sprawach danych osobowych: <a className="underline" href="mailto:hi@datalatte.pro">hi@datalatte.pro</a>.</P>

        <H>2. Jakie dane i w jakim celu przetwarzamy</H>
        <L>
          <li><strong>Formularz kontaktowy i formularz audytu</strong> (imię, e-mail, rodzaj działalności, treść wiadomości, adres strony lub profilu, jeśli go podasz). Cel: odpowiedź na wiadomość i przygotowanie audytu. Podstawa: art. 6 ust. 1 lit. b i f RODO (podjęcie działań na Twoje żądanie przed zawarciem umowy oraz uzasadniony interes administratora w obsłudze zapytań).</li>
          <li><strong>Porady o marketingu lokalnym e-mailem.</strong> Cel: wysyłanie wiadomości informacyjnych. Podstawa: Twoja zgoda (art. 6 ust. 1 lit. a RODO) oraz art. 172 Prawa telekomunikacyjnego. Zgoda jest dobrowolna i możesz ją wycofać w każdej chwili, klikając link w wiadomości lub pisząc na adres z punktu 1.</li>
          <li><strong>Statystyki odwiedzin</strong> (Google Analytics 4, Microsoft Clarity). Cel: zrozumienie, jak serwis jest używany, i jego ulepszanie. Podstawa: Twoja zgoda (art. 6 ust. 1 lit. a RODO i art. 173 Prawa telekomunikacyjnego). Na polskiej części serwisu skrypty te ładują się dopiero po kliknięciu „Akceptuję”.</li>
          <li><strong>Dane techniczne</strong> (adres IP, przeglądarka, czas żądania) w logach serwera hostingu. Cel: bezpieczeństwo i prawidłowe działanie serwisu. Podstawa: art. 6 ust. 1 lit. f RODO.</li>
        </L>

        <H>3. Pliki cookies i zgoda</H>
        <P>Niezbędne mechanizmy serwisu nie wymagają zgody. Cookies i podobne technologie analityczne uruchamiamy po wyrażeniu zgody w banerze. Wybór zapisujemy w pamięci przeglądarki (klucz dl-consent). Zgodę możesz zmienić lub wycofać w każdej chwili: <CookieSettingsLink />.</P>

        <H>4. Odbiorcy danych</H>
        <P>Dane przekazujemy podmiotom, które świadczą nam usługi (podmioty przetwarzające):</P>
        <L>
          <li>Vercel Inc. (hosting serwisu),</li>
          <li>Supabase Inc. (baza danych zapytań z formularzy),</li>
          <li>Resend (wysyłka wiadomości e-mail, w tym potwierdzeń i, za zgodą, porad),</li>
          <li>Telegram (powiadomienie administratora o nowym zapytaniu; zawiera imię, e-mail i fragment wiadomości),</li>
          <li>Google LLC (Google Analytics 4, po zgodzie) i Microsoft Corporation (Clarity, po zgodzie).</li>
        </L>
        <P>Część tych podmiotów ma siedzibę poza Europejskim Obszarem Gospodarczym, w szczególności w Stanach Zjednoczonych. Przekazanie odbywa się na podstawie decyzji Komisji Europejskiej o odpowiednim stopniu ochrony (EU-U.S. Data Privacy Framework), jeśli dany podmiot do niego przystąpił, lub standardowych klauzul umownych.</P>

        <H>5. Jak długo przechowujemy dane</H>
        <L>
          <li>Zapytania z formularzy: do czasu zakończenia sprawy, a następnie do upływu terminu przedawnienia ewentualnych roszczeń, nie dłużej niż 3 lata, chyba że zawrzemy umowę (wtedy zgodnie z przepisami o rozliczeniach).</li>
          <li>Dane na potrzeby porad e-mailem: do wycofania zgody.</li>
          <li>Dane analityczne: zgodnie z okresami ustawionymi w narzędziach Google i Microsoft.</li>
        </L>

        <H>6. Twoje prawa</H>
        <P>Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu wobec przetwarzania opartego na uzasadnionym interesie oraz wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed jej wycofaniem). Napisz na <a className="underline" href="mailto:hi@datalatte.pro">hi@datalatte.pro</a>. Masz też prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</P>

        <H>7. Dobrowolność podania danych</H>
        <P>Podanie imienia i e-maila jest potrzebne, żeby odpowiedzieć na wiadomość. Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu.</P>

        <H>8. Zmiany</H>
        <P>Politykę możemy aktualizować. Aktualna wersja zawsze znajduje się na tej stronie.</P>
      </div>
    </section>
  );
}
