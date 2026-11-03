"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const NICHES = [
  { value: "coffee", label: "Kawiarnia" },
  { value: "salon", label: "Fryzjer / kosmetyka" },
  { value: "grooming", label: "Groomer / usługi dla zwierząt" },
  { value: "fitness", label: "Studio fitness / joga" },
  { value: "other", label: "Inna działalność" },
];

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 dark:focus:ring-coffee-800/30 outline-none transition text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400";

export default function ContactFormPL({ audit = false }: { audit?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [f, setF] = useState({ name: "", email: "", niche: "", website: "", message: "" });
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacy) return;
    setStatus("loading");
    const message = [audit ? "Darmowy audyt." : "", f.website ? `Strona/profil: ${f.website}` : "", f.message].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.email, name: f.name, niche: f.niche || undefined, message, form_type: audit ? "ready" : "explore", locale: "pl", consent_marketing: marketing }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  }

  if (status === "success")
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={44} className="text-green-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dziękuję, wiadomość dotarła ☕</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Odpiszę w ciągu jednego dnia roboczego, zwykle szybciej.</p>
      </div>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-1.5">Imię</label><input className={inputCls} value={f.name} onChange={set("name")} required autoComplete="given-name" placeholder="Anna" /></div>
        <div><label className="block text-sm font-medium mb-1.5">E-mail</label><input className={inputCls} type="email" value={f.email} onChange={set("email")} required autoComplete="email" placeholder="anna@twojafirma.pl" /></div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Rodzaj działalności</label>
        <select className={inputCls} value={f.niche} onChange={set("niche")}>
          <option value="">Wybierz</option>
          {NICHES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
        </select>
      </div>
      {audit && (
        <div><label className="block text-sm font-medium mb-1.5">Strona internetowa lub profil w Google/Instagramie</label><input className={inputCls} value={f.website} onChange={set("website")} placeholder="https://… lub nazwa i miasto" /></div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1.5">{audit ? "Co chcesz poprawić? (opcjonalnie)" : "Wiadomość"}</label>
        <textarea className={inputCls} rows={4} value={f.message} onChange={set("message")} required={!audit} placeholder={audit ? "Np. mało nowych klientów, słabe opinie, reklamy bez efektu" : "W czym mogę pomóc?"} />
      </div>
      <label className="flex gap-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} required className="mt-0.5" />
        <span>Zapoznałem/am się z <Link href="/pl/polityka-prywatnosci" className="underline text-coffee-700 dark:text-coffee-300">polityką prywatności</Link>. Wiem, że moje dane posłużą do odpowiedzi na wiadomość. (wymagane)</span>
      </label>
      <label className="flex gap-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5" />
        <span>Chcę dostawać e-mailem porady o marketingu lokalnym. Mogę zrezygnować w każdej chwili. (opcjonalne)</span>
      </label>
      <button disabled={status === "loading" || !privacy} className="btn-primary w-full justify-center disabled:opacity-60">
        {status === "loading" ? "Wysyłanie…" : audit ? "Poproś o darmowy audyt" : "Wyślij wiadomość"} <ArrowRight size={16} />
      </button>
      {status === "error" && <p className="text-sm text-red-600">Nie udało się wysłać. Napisz bezpośrednio na hi@datalatte.pro.</p>}
    </form>
  );
}
