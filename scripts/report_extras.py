"""
Extra analytics for scripts/daily_report.py (pure functions, no Google deps).
GSC rows are the raw Search Console API dicts: {"keys": [...], "clicks", "impressions", "ctr", "position"}.
"""
import json, os, re, subprocess, urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://datalatte.pro"
NEAR_MIN_IMPR = 50          # near-top pages: min impressions in 7d
BUCKETS = [("1–3", 0, 3), ("4–10", 3, 10), ("11–20", 10, 20), ("21–50", 20, 50), ("50+", 50, 10**6)]


def im(r): return r.get("impressions", 0)
def cl(r): return r.get("clicks", 0)
def ps(r): return r.get("position", 0)
def k0(r): return r["keys"][0]
def short(url): return url.replace(SITE, "").replace("https://www.datalatte.pro", "") or "/"


def wavg_pos(rows):
    t = sum(im(r) for r in rows)
    return sum(ps(r) * im(r) for r in rows) / t if t else 0


# ── 1. Position distribution ──────────────────────────────────────────────────
def position_buckets(rows):
    """Impressions/clicks per position bucket (by query average position)."""
    out = {b[0]: {"impr": 0, "clicks": 0, "n": 0} for b in BUCKETS}
    for r in rows:
        p = ps(r)
        for name, lo, hi in BUCKETS:
            if lo < p <= hi or (name == "1–3" and p <= 3):
                out[name]["impr"] += im(r); out[name]["clicks"] += cl(r); out[name]["n"] += 1
                break
    return out


# ── 2. Near-top pages (positions 8–20) ────────────────────────────────────────
def near_top_pages(rows, lo=8, hi=20, min_impr=NEAR_MIN_IMPR, n=6):
    c = [r for r in rows if lo <= ps(r) <= hi and im(r) >= min_impr]
    return sorted(c, key=im, reverse=True)[:n]


# ── 3. Movers ─────────────────────────────────────────────────────────────────
def movers_pages(cur, prev, min_impr=20, n=4):
    pm = {k0(r): r for r in prev}
    cm = {k0(r): r for r in cur}
    deltas = []
    for u in set(pm) | set(cm):
        c, p = cm.get(u), pm.get(u)
        ci, pi = (im(c) if c else 0), (im(p) if p else 0)
        if max(ci, pi) < min_impr:
            continue
        deltas.append(dict(url=u, cur=ci, prev=pi, delta=ci - pi,
                           pos=ps(c) if c else None, pos_prev=ps(p) if p else None))
    gain = sorted([d for d in deltas if d["delta"] > 0], key=lambda d: -d["delta"])[:n]
    loss = sorted([d for d in deltas if d["delta"] < 0], key=lambda d: d["delta"])[:n]
    return gain, loss


def movers_queries_pos(cur, prev, min_impr=10, n=3):
    pm = {k0(r): r for r in prev}
    out = []
    for r in cur:
        p = pm.get(k0(r))
        if p and im(r) >= min_impr and im(p) >= min_impr:
            out.append(dict(q=k0(r), impr=im(r), pos=ps(r), pos_prev=ps(p), diff=ps(p) - ps(r)))
    up = sorted([o for o in out if o["diff"] > 0.5], key=lambda o: -o["diff"])[:n]
    down = sorted([o for o in out if o["diff"] < -0.5], key=lambda o: o["diff"])[:n]
    return up, down


# ── 4. New pages in search ────────────────────────────────────────────────────
def _by_page(page_date):
    d = {}
    for r in page_date:
        d.setdefault(r["keys"][0], []).append((r["keys"][1], im(r), cl(r), ps(r)))
    return d


def new_pages(page_date, w1_start, w1_end):
    """Pages with first-ever impressions (within the loaded history) inside the last 7 days."""
    out = []
    for url, rows in _by_page(page_date).items():
        dates = sorted(x[0] for x in rows if x[1] > 0)
        if dates and str(w1_start) <= dates[0] <= str(w1_end):
            tot = sum(x[1] for x in rows if x[0] >= str(w1_start))
            p = (sum(x[3] * x[1] for x in rows if x[0] >= str(w1_start)) / tot) if tot else 0
            out.append(dict(url=url, first=dates[0], impr=tot, pos=p))
    return sorted(out, key=lambda x: -x["impr"])


def coverage(page_date, d28_start, sitemap_total):
    seen = {u for u, rows in _by_page(page_date).items()
            if any(x[0] >= str(d28_start) and x[1] > 0 for x in rows)}
    seen_blog = sum(1 for u in seen if "/blog/" in u)
    return dict(with_impr=len(seen), blog=seen_blog, sitemap=sitemap_total)


# ── 5. Content waves → effect ─────────────────────────────────────────────────
def _git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, timeout=60).stdout


def content_waves(days=35, min_files=10):
    """Commits that touched ≥ min_files blog posts: [{date, subject, new:set, edited:set}]"""
    log = _git("log", f"--since={days} days ago", "--no-merges", "--name-status",
               "--pretty=format:@@%cs|%s", "--", "content/blog")
    waves, cur = [], None
    for line in log.splitlines():
        if line.startswith("@@"):
            if cur: waves.append(cur)
            d, s = line[2:].split("|", 1)
            cur = dict(date=d, subject=s, new=set(), edited=set())
        elif cur and line.strip():
            parts = line.split("\t")
            if len(parts) >= 2 and parts[-1].endswith(".mdx"):
                slug = Path(parts[-1]).stem
                (cur["new"] if parts[0].startswith("A") else cur["edited"]).add(slug)
    if cur: waves.append(cur)
    return [w for w in waves if len(w["new"]) + len(w["edited"]) >= min_files]


def wave_effect(page_date, yesterday, waves=None, min_days_after=3, window=7):
    """Impressions/day and position before vs after each wave, for the pages it touched."""
    waves = content_waves() if waves is None else waves
    bp = _by_page(page_date)
    res = []
    for w in waves:
        d0 = date.fromisoformat(w["date"])
        slugs = w["new"] | w["edited"]
        urls = [u for u in bp if u.rsplit("/", 1)[-1] in slugs and "/blog/" in u]
        b_lo, b_hi = d0 - timedelta(days=window), d0 - timedelta(days=1)
        a_lo, a_hi = d0 + timedelta(days=1), min(d0 + timedelta(days=window), yesterday)
        days_after = (a_hi - a_lo).days + 1
        row = dict(date=w["date"], subject=w["subject"], new=len(w["new"]), edited=len(w["edited"]),
                   days_after=max(days_after, 0), pending=days_after < min_days_after)
        if not row["pending"]:
            def agg(lo, hi):
                rows = [x for u in urls for x in bp[u] if str(lo) <= x[0] <= str(hi)]
                ti = sum(x[1] for x in rows)
                n_days = (hi - lo).days + 1
                return ti / n_days, (sum(x[3] * x[1] for x in rows) / ti if ti else 0), sum(x[2] for x in rows)
            row["b_ipd"], row["b_pos"], row["b_cl"] = agg(b_lo, b_hi)
            row["a_ipd"], row["a_pos"], row["a_cl"] = agg(a_lo, a_hi)
            row["pages_seen"] = len(urls)
        res.append(row)
    return sorted(res, key=lambda r: r["date"], reverse=True)


# ── 6. Brand vs non-brand, query types ────────────────────────────────────────
BRAND_RE = re.compile(r"data\s?latte", re.I)


def brand_split(rows):
    b = [r for r in rows if BRAND_RE.search(k0(r))]
    n = [r for r in rows if not BRAND_RE.search(k0(r))]
    f = lambda rs: dict(impr=sum(im(r) for r in rs), clicks=sum(cl(r) for r in rs), pos=wavg_pos(rs), n=len(rs))
    return dict(brand=f(b), nonbrand=f(n))


TYPE_RULES = [
    ("Questions",    re.compile(r"^(how|what|why|when|where|which|who|can|should|is|are|does|do)\b|\?", re.I)),
    ("Cost / price", re.compile(r"\b(cost|price|pricing|cheap|how much|budget|fees?)\b", re.I)),
    ("Best / vs",    re.compile(r"\b(best|top|vs|versus|compare|comparison|alternatives?|review|reviews)\b", re.I)),
    ("Local",        re.compile(r"\b(near me|local)\b", re.I)),
]


def query_types(rows):
    out = {name: [] for name, _ in TYPE_RULES}; out["Other"] = []
    for r in rows:
        for name, rx in TYPE_RULES:
            if rx.search(k0(r)):
                out[name].append(r); break
        else:
            out["Other"].append(r)
    return {n: dict(impr=sum(im(r) for r in rs), clicks=sum(cl(r) for r in rs), pos=wavg_pos(rs), n=len(rs))
            for n, rs in out.items()}


# ── 7. Devices ────────────────────────────────────────────────────────────────
def devices(w1, w2):
    p = {k0(r): r for r in w2}
    return [dict(device=k0(r).capitalize(), impr=im(r), clicks=cl(r), pos=ps(r),
                 impr_prev=im(p[k0(r)]) if k0(r) in p else 0)
            for r in sorted(w1, key=im, reverse=True)]


# ── 8. Sitemap size (coverage denominator) ────────────────────────────────────
def sitemap_total():
    try:
        req = urllib.request.Request("https://www.datalatte.pro/sitemap.xml", headers={"User-Agent": "DataLatte-Reporter/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return len(re.findall(r"<loc>", r.read().decode("utf-8", "ignore")))
    except Exception as e:
        print(f"  ⚠ sitemap fetch failed: {e}")
        return 0


# ── 9. Conversions (Supabase, optional) ───────────────────────────────────────
def conversions(w1_start, w2_start):
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not key:
        return None
    base = os.environ.get("SUPABASE_URL") or "https://olsxxfwvwsycwzihbmdn.supabase.co"

    def get(path):
        req = urllib.request.Request(f"{base}/rest/v1/{path}", headers={"apikey": key, "Authorization": f"Bearer {key}"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read())
    try:
        subs = get(f"contact_submissions?select=created_at,form_type&created_at=gte.{w2_start}&limit=1000")
        out_sent = get(f"outreach_emails?select=sent_at,replied_at&sent_at=gte.{w2_start}&limit=5000")
        replies = get(f"outreach_emails?select=replied_at&replied_at=gte.{w2_start}&limit=1000")
    except Exception as e:
        print(f"  ⚠ conversions failed: {e}")
        return None
    w1 = str(w1_start)
    cnt = lambda rows, f: sum(1 for r in rows if (r.get(f) or "")[:10] >= w1)
    types = {}
    for r in subs:
        if r["created_at"][:10] >= w1:
            types[r.get("form_type") or "?"] = types.get(r.get("form_type") or "?", 0) + 1
    return dict(forms=cnt(subs, "created_at"), forms_prev=len(subs) - cnt(subs, "created_at"), form_types=types,
                sent=cnt(out_sent, "sent_at"), sent_prev=len(out_sent) - cnt(out_sent, "sent_at"),
                replies=cnt(replies, "replied_at"), replies_prev=len(replies) - cnt(replies, "replied_at"))


# ── 10. Bing (from data/analytics/bing-latest.json written by analytics-fetch) ─
def bing_summary(w1_start, w2_start, path=ROOT / "data/analytics/bing-latest.json"):
    try:
        b = json.loads(Path(path).read_text())
    except Exception:
        return None
    rows = b.get("rows") or []
    s = lambda lo, hi, f: sum(r.get(f, 0) for r in rows if lo <= r["date"] <= hi)
    w1, w1e = str(w1_start), "9999"
    w2, w2e = str(w2_start), str(w1_start - timedelta(days=1))
    return dict(impr=s(w1, w1e, "impressions"), impr_prev=s(w2, w2e, "impressions"),
                clicks=s(w1, w1e, "clicks"), clicks_prev=s(w2, w2e, "clicks"),
                top_queries=sorted(b.get("queries") or [], key=lambda x: -x.get("impressions", 0))[:5],
                fetched=(b.get("fetchedAt") or "")[:10])
