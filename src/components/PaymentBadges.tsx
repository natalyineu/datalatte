const METHODS: { name: string; mark: React.ReactNode }[] = [
  { name: "Visa", mark: <span className="font-extrabold italic tracking-tight text-[15px]">VISA</span> },
  {
    name: "Mastercard",
    mark: (
      <svg viewBox="0 0 32 20" className="h-5 w-8" aria-hidden="true">
        <circle cx="12" cy="10" r="8" fill="#a8855f" />
        <circle cx="20" cy="10" r="8" fill="#5c3d24" fillOpacity="0.85" />
      </svg>
    ),
  },
  { name: "PayPal", mark: <span className="font-extrabold italic text-[14px]">PayPal</span> },
  { name: "Stripe", mark: <span className="font-extrabold text-[15px] tracking-tight">stripe</span> },
  { name: "Wise", mark: <span className="font-extrabold text-[15px]">wise</span> },
  { name: "Revolut", mark: <span className="font-bold text-[14px] tracking-tight">Revolut</span> },
  { name: "Crypto", mark: <span className="font-bold text-[13px]">₿ Crypto</span> },
  { name: "Bank transfer", mark: <span className="font-semibold text-[12px] leading-tight text-center">Bank<br />transfer</span> },
];

export default function PaymentBadges({ label = "Secure payments" }: { label?: string }) {
  return (
    <div className="border-t border-coffee-900 pt-6 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-xs uppercase tracking-wider opacity-60">{label}</p>
      <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
        {METHODS.map((m) => (
          <li
            key={m.name}
            title={m.name}
            aria-label={m.name}
            className="h-10 min-w-[64px] px-3 flex items-center justify-center rounded-md border border-coffee-200 bg-white text-coffee-800"
          >
            {m.mark}
          </li>
        ))}
      </ul>
    </div>
  );
}
