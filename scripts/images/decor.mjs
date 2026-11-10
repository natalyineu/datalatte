// Deterministic per-slug decoration (same slug -> same picture) so every cover/card is visually unique.
export function seedOf(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
export function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const ACCS = ["#d4a574", "#c98f5b", "#e0b98a", "#bf8a5f", "#d9a066"];
export function decor(slug, { w = 1200, h = 630, textRight = 700 } = {}) {
  const r = rng(seedOf(slug)), pick = (a) => a[Math.floor(r() * a.length)], acc = pick(ACCS);
  const styles = ["rings", "dots", "bubbles", "stripes", "arc"]; const a = pick(styles); let b = pick(styles); if (b === a) b = styles[(styles.indexOf(a) + 2) % styles.length];
  const out = []; const gx = 0.55 + r() * 0.35, gy = r() * 0.5;
  const glyphPos = pick([[930, 70], [940, 360], [880, 250], [980, 150]]);
  const draw = (st) => {
    if (st === "rings") { const cx = w * (0.6 + r() * 0.4), cy = h * r() * 0.8, n = 2 + Math.floor(r() * 3); for (let i = 0; i < n; i++) out.push(`<circle cx="${cx | 0}" cy="${cy | 0}" r="${60 + i * 45 + (r() * 20 | 0)}" fill="none" stroke="${acc}" stroke-opacity="${(0.10 + r() * 0.08).toFixed(2)}" stroke-width="2"/>`); }
    if (st === "dots") { const x0 = textRight + r() * 220, y0 = 40 + r() * 330, cols = 4 + Math.floor(r() * 4), rows = 3 + Math.floor(r() * 4), gap = 26 + (r() * 12 | 0); for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) out.push(`<circle cx="${(x0 + i * gap) | 0}" cy="${(y0 + j * gap) | 0}" r="3.2" fill="${acc}" fill-opacity="0.28"/>`); }
    if (st === "bubbles") { const n = 6 + Math.floor(r() * 6); for (let i = 0; i < n; i++) out.push(`<circle cx="${(560 + r() * 620) | 0}" cy="${(r() * 600) | 0}" r="${(5 + r() * 38) | 0}" fill="${acc}" fill-opacity="${(0.05 + r() * 0.13).toFixed(2)}"/>`); }
    if (st === "stripes") { const x0 = 760 + r() * 280, y0 = 380 + r() * 120, n = 5 + Math.floor(r() * 4); for (let i = 0; i < n; i++) out.push(`<line x1="${(x0 + i * 22) | 0}" y1="${y0 | 0}" x2="${(x0 + i * 22 + 90) | 0}" y2="${(y0 - 90) | 0}" stroke="${acc}" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round"/>`); }
    if (st === "arc") { const cx = w * (0.75 + r() * 0.3), cy = h * (0.7 + r() * 0.4), rad = 170 + r() * 150; out.push(`<circle cx="${cx | 0}" cy="${cy | 0}" r="${rad | 0}" fill="${acc}" fill-opacity="0.07"/><circle cx="${cx | 0}" cy="${cy | 0}" r="${(rad * 0.62) | 0}" fill="none" stroke="${acc}" stroke-opacity="0.16" stroke-width="2"/>`); }
  };
  draw(a); draw(b);
  return { acc, shapes: out.join(""), glyphPos, gx: (gx * 100) | 0, gy: (gy * 100) | 0 };
}
