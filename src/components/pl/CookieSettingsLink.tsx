"use client";
export default function CookieSettingsLink() {
  return (
    <button type="button" className="hover:text-white" onClick={() => window.dispatchEvent(new Event("dl-consent-open"))}>
      Ustawienia cookies
    </button>
  );
}
