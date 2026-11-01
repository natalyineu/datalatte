"use client";

import { useCallback, useEffect, useState } from "react";
import { CURRENCIES, STORAGE_KEY, detectCurrency, formatMoney, getCurrency, type CurrencyCode } from "@/lib/currency";

// Starts as USD (matches the server render), then switches to the saved choice or a detected one after mount.
export function useCurrency() {
  const [code, setCode] = useState<CurrencyCode>("USD");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* storage unavailable */ }
    const initial = CURRENCIES.some(c => c.code === saved) ? (saved as CurrencyCode) : detectCurrency();
    setCode(initial);
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCode(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage unavailable */ }
  }, []);

  const currency = getCurrency(code);
  const fmt = useCallback((n: number, decimals = 0) => formatMoney(n, code, decimals), [code]);
  const fromUsd = useCallback((usd: number) => usd * currency.perUsd, [currency.perUsd]);

  return { currency, setCurrency, fmt, fromUsd };
}
