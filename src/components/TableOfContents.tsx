"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface TableOfContentsProps {
  /** Raw MDX source — pass `content` from getPost(). */
  source: string;
}

export default function TableOfContents({ source }: TableOfContentsProps) {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Parse headings from raw markdown source
  const headings: Heading[] = [];
  const lines = source.split("\n");
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    const h3 = line.match(/^###\s+(.+)/);
    if (h2) {
      const text = h2[1].replace(/\*+/g, "").trim();
      headings.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/\*+/g, "").trim();
      headings.push({ id: slugify(text), text, level: 3 });
    }
  }

  // Don't render if fewer than 3 headings
  if (headings.length < 3) return null;

  // Observe which heading is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ── Desktop: sticky sidebar ─────────────────────────────────────────── */}
      <nav
        aria-label="Table of contents"
        className="hidden xl:block sticky top-24 self-start w-56 shrink-0 text-sm"
      >
        <p className="flex items-center gap-1.5 font-semibold text-gray-700 mb-3 text-xs uppercase tracking-wide">
          <List size={13} /> On this page
        </p>
        <ul className="space-y-1 border-l border-gray-200 pl-3">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${h.id}`}
                className={`block py-0.5 leading-snug transition-colors hover:text-coffee-700 ${
                  active === h.id
                    ? "text-coffee-700 font-medium border-l-2 border-coffee-500 -ml-[13px] pl-[11px]"
                    : "text-gray-500"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Mobile: collapsible at top of article ───────────────────────────── */}
      <div className="xl:hidden mb-8 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <List size={14} /> On this page
          </span>
          <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <ul className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-3">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 hover:text-coffee-700 transition-colors"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
