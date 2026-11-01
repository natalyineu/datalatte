// Currency support for the calculators.
// Benchmarks (cost per lead, from LocaliQ) are published in US dollars. They are converted to the visitor's
// currency with FIXED reference rates, so the calculators stay static and need no live exchange-rate calls.
import fx from "@/data/fx.json";

export type CurrencyCode = "USD" | "GBP" | "EUR" | "AUD" | "CAD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  perUsd: number; // units of this currency per 1 US dollar
}

// ECB reference rates via Frankfurter, stored in src/data/fx.json and refreshed weekly by
// .github/workflows/update-fx.yml (scripts/update-fx.mjs). Not live: they are fixed until the next refresh.
const d = new Date(`${fx.date}T00:00:00Z`);
export const FX_DATE = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",   name: "US dollar",          perUsd: 1 },
  { code: "GBP", symbol: "£",   name: "British pound",      perUsd: fx.rates.GBP },
  { code: "EUR", symbol: "€",   name: "Euro",               perUsd: fx.rates.EUR },
  { code: "AUD", symbol: "A$",  name: "Australian dollar",  perUsd: fx.rates.AUD },
  { code: "CAD", symbol: "C$",  name: "Canadian dollar",    perUsd: fx.rates.CAD },
];

export const STORAGE_KEY = "dl-currency";

export function getCurrency(code: string | null | undefined): Currency {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

export function formatMoney(n: number, code: CurrencyCode, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

const EURO_ZONES = new Set([
  "Berlin", "Paris", "Madrid", "Rome", "Amsterdam", "Brussels", "Vienna", "Dublin", "Lisbon", "Helsinki",
  "Athens", "Luxembourg", "Bratislava", "Ljubljana", "Tallinn", "Riga", "Vilnius", "Malta", "Zagreb",
]);
const CANADA_ZONES = new Set(["Toronto", "Vancouver", "Edmonton", "Winnipeg", "Halifax", "Regina", "St_Johns", "Montreal", "Calgary", "Ottawa"]);

// Best guess from the browser's time zone, then its language. The visitor can always change it.
export function detectCurrency(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const [area, city] = tz.split("/");
    if (area === "Australia") return "AUD";
    if (tz === "Europe/London") return "GBP";
    if (area === "Europe" && EURO_ZONES.has(city)) return "EUR";
    if (area === "America" && CANADA_ZONES.has(city)) return "CAD";
  } catch { /* fall through to language */ }

  const langs = typeof navigator !== "undefined" ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : [];
  for (const l of langs) {
    const region = (l.split("-")[1] || "").toUpperCase();
    if (region === "GB") return "GBP";
    if (region === "AU") return "AUD";
    if (region === "CA") return "CAD";
    if (["IE", "DE", "FR", "ES", "IT", "NL", "PT", "AT", "BE", "FI", "GR", "LU"].includes(region)) return "EUR";
    if (region === "US") return "USD";
  }
  return "USD";
}
