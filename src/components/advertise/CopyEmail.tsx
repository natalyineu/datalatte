"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

const EMAIL = "hi@datalatte.pro";

export default function CopyEmail({ className = "" }: { className?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement("textarea");
      t.value = EMAIL;
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(t);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? "Email copied" : "Copy email address"}
      title={done ? "Copied" : "Copy email"}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/20 transition-colors align-middle ${className}`}
    >
      {done ? <Check size={15} className="text-green-400" aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}
