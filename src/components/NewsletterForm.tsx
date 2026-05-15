"use client";

import { useState } from "react";

export default function NewsletterForm({ source = "blog" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-coffee-50 rounded-2xl p-8 max-w-lg mx-auto text-center">
        <div className="text-3xl mb-3">☕</div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">You're in!</h3>
        <p className="text-gray-500 text-sm">
          Check your inbox — a welcome email is on its way. See you next week!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-coffee-50 rounded-2xl p-8 max-w-lg mx-auto">
      <h3 className="font-bold text-gray-900 text-lg mb-2">Stay in the loop</h3>
      <p className="text-gray-500 text-sm mb-5">
        New posts weekly. No spam, no fluff — just practical local marketing tips.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-coffee-500 focus:ring-2 focus:ring-coffee-100 outline-none text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-coffee-700 hover:bg-coffee-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
