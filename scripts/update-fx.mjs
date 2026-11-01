#!/usr/bin/env node
// Refresh src/data/fx.json with ECB reference rates (via Frankfurter, free, no key).
// Used by the calculators to convert US-dollar benchmarks. Run weekly by .github/workflows/update-fx.yml.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../src/data/fx.json", import.meta.url);
const SYMBOLS = ["GBP", "EUR", "AUD", "CAD"];

const prev = JSON.parse(readFileSync(FILE, "utf8"));
const res = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${SYMBOLS.join(",")}`);
if (!res.ok) {
  console.error(`Frankfurter returned ${res.status}; keeping the previous rates`);
  process.exit(0);
}
const data = await res.json();

const next = {};
for (const s of SYMBOLS) {
  const v = Number(data.rates?.[s]);
  const old = Number(prev.rates[s]);
  // Reject anything that is not a number or moved more than 25% in one step (bad data, not a market move).
  if (!Number.isFinite(v) || v <= 0 || Math.abs(v / old - 1) > 0.25) {
    console.error(`Rejected ${s}: got ${data.rates?.[s]}, previous ${old}; keeping the previous rates`);
    process.exit(0);
  }
  next[s] = v;
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) {
  console.error("Unexpected date format; keeping the previous rates");
  process.exit(0);
}

writeFileSync(FILE, JSON.stringify({ source: "ECB reference rates via Frankfurter", base: "USD", date: data.date, rates: next }, null, 2) + "\n");
console.log(`fx.json updated: ${data.date}`, next);
