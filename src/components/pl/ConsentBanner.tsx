"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/components/AnalyticsScripts";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setShow(!localStorage.getItem(CONSENT_KEY)); } catch { setShow(true); }
    const reopen = () => setShow(true);
    window.addEventListener("dl-consent-open", reopen);
    return () => window.removeEventListener("dl-consent-open", reopen);
  }, []);

  function choose(v: "granted" | "denied") {
    try { localStorage.setItem(CONSENT_KEY, v); } catch { /* ignore */ }
    window.dispatchEvent(new Event("dl-consent-change"));
    setShow(false);
  }

  if (!show) return null;
  return (
    <div role="dialog" aria-label="Zgoda na pliki cookies" className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <p className="text-sm text-gray-700 dark:text-gray-200">
          Używamy plików cookies analitycznych (Google Analytics i Microsoft Clarity), żeby zobaczyć, które strony są przydatne. Włączymy je tylko za Twoją zgodą. Szczegóły w{" "}
          <Link href="/pl/polityka-prywatnosci" className="underline text-coffee-700 dark:text-coffee-300">polityce prywatności</Link>.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button onClick={() => choose("denied")} className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">Odrzucam</button>
          <button onClick={() => choose("granted")} className="rounded-xl bg-coffee-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-coffee-600">Akceptuję</button>
        </div>
      </div>
    </div>
  );
}
