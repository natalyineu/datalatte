#!/usr/bin/env python3
"""
DataLatte — Daily Performance Report
Sends a detailed HTML email every morning via Resend.
Run: python3 scripts/daily_report.py
"""
import warnings; warnings.filterwarnings("ignore")
import json, urllib.request, urllib.error
from datetime import date, timedelta
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
SITE_URL        = "sc-domain:datalatte.pro"
GA4_PROPERTY_ID = "537670353"
RESEND_API_KEY  = __import__("os").environ.get("RESEND_API_KEY", "")
RESEND_AUDIENCE = "0cdfd587-fb63-4330-917e-df4e88bf96e8"
RESEND_FROM     = "DataLatte Reports <hi@datalatte.pro>"
REPORT_TO       = "rumiantsevanatali@gmail.com"
TOKEN_FILE      = Path(__file__).parent / "google_token.json"
GROQ_API_KEY    = __import__("os").environ.get("GROQ_API_KEY", "")

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
]

TODAY      = date.today()
YESTERDAY  = TODAY - timedelta(days=1)
W1_END     = YESTERDAY
W1_START   = YESTERDAY - timedelta(days=6)
W2_END     = W1_START - timedelta(days=1)
W2_START   = W2_END - timedelta(days=6)
D28_START  = TODAY - timedelta(days=28)
D28_PSTART = D28_START - timedelta(days=28)
D28_PEND   = D28_START - timedelta(days=1)

# ── Auth ──────────────────────────────────────────────────────────────────────
def get_creds():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        TOKEN_FILE.write_text(creds.to_json())
    return creds

# ── GSC ───────────────────────────────────────────────────────────────────────
def fetch_gsc(creds):
    from googleapiclient.discovery import build
    svc = build("searchconsole", "v1", credentials=creds)

    def q(dims, start, end, rows=25, **kw):
        body = {"startDate": str(start), "endDate": str(end),
                "dimensions": dims, "rowLimit": rows, **kw}
        return svc.searchanalytics().query(siteUrl=SITE_URL, body=body).execute().get("rows", [])

    def totals(start, end):
        rows = q(["device"], start, end, 5)
        cl = sum(r.get("clicks", 0) for r in rows)
        im = sum(r.get("impressions", 0) for r in rows)
        pos = sum(r.get("position",0)*r.get("impressions",0) for r in rows) / im if im else 0
        return cl, im, pos

    cl_yd, im_yd, _     = totals(YESTERDAY, YESTERDAY)
    cl_w1, im_w1, p_w1  = totals(W1_START, W1_END)
    cl_w2, im_w2, _     = totals(W2_START, W2_END)
    cl_28, im_28, p_28  = totals(D28_START, YESTERDAY)
    cl_28p, im_28p, _   = totals(D28_PSTART, D28_PEND)

    daily        = q(["date"],    YESTERDAY - timedelta(days=13), YESTERDAY, 14)
    queries_7d   = q(["query"],   W1_START, W1_END, 200)
    pages_7d     = q(["page"],    W1_START, W1_END, 200)
    countries    = q(["country"], D28_START, YESTERDAY, 10)

    top_queries      = sorted(queries_7d, key=lambda x: x.get("impressions",0), reverse=True)[:8]
    top_pages_impr   = sorted(pages_7d,   key=lambda x: x.get("impressions",0), reverse=True)[:7]
    countries_sorted = sorted(countries,  key=lambda x: x.get("impressions",0), reverse=True)[:7]
    opps = sorted(
        [r for r in queries_7d if r.get("impressions",0) >= 3
         and r.get("clicks",0) == 0 and r.get("position",99) <= 25],
        key=lambda x: x.get("impressions",0), reverse=True
    )[:6]

    blog_pages    = [r for r in pages_7d if "/blog/"     in r["keys"][0]]
    niche_pages   = [r for r in pages_7d if "/for/"      in r["keys"][0]]
    service_pages = [r for r in pages_7d if "/services/" in r["keys"][0]]

    return dict(
        cl_yd=cl_yd, im_yd=im_yd,
        cl_w1=cl_w1, im_w1=im_w1, pos_w1=round(p_w1,1),
        cl_w2=cl_w2, im_w2=im_w2,
        cl_28=cl_28, im_28=im_28, pos_28=round(p_28,1),
        cl_28p=cl_28p, im_28p=im_28p,
        daily=daily, top_queries=top_queries,
        top_pages_impr=top_pages_impr, countries=countries_sorted, opps=opps,
        blog_impr=sum(r.get("impressions",0) for r in blog_pages),
        blog_cl=sum(r.get("clicks",0) for r in blog_pages),
        niche_impr=sum(r.get("impressions",0) for r in niche_pages),
        niche_cl=sum(r.get("clicks",0) for r in niche_pages),
        service_impr=sum(r.get("impressions",0) for r in service_pages),
        service_cl=sum(r.get("clicks",0) for r in service_pages),
    )

# ── GA4 ───────────────────────────────────────────────────────────────────────
def fetch_ga4(creds):
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest, OrderBy

    client = BetaAnalyticsDataClient(credentials=creds)
    prop   = f"properties/{GA4_PROPERTY_ID}"

    def run(dims, mets, start, end, order_met=None, limit=10):
        order = ([OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_met), desc=True)]
                 if order_met else [])
        return client.run_report(RunReportRequest(
            property=prop,
            date_ranges=[DateRange(start_date=str(start), end_date=str(end))],
            dimensions=[Dimension(name=d) for d in dims],
            metrics=[Metric(name=m) for m in mets],
            order_bys=order, limit=limit,
        ))

    def mv(r, idx): return float(r.rows[0].metric_values[idx].value) if r.rows else 0

    ov_w1  = run([], ["sessions","totalUsers","screenPageViews","bounceRate",
                       "averageSessionDuration","newUsers","engagedSessions"], W1_START, W1_END)
    ov_w2  = run([], ["sessions","totalUsers","screenPageViews"], W2_START, W2_END)
    ov_28  = run([], ["sessions","totalUsers"], D28_START, YESTERDAY)
    ov_28p = run([], ["sessions","totalUsers"], D28_PSTART, D28_PEND)

    sources   = run(["sessionDefaultChannelGroup"], ["sessions","bounceRate"], W1_START, W1_END, "sessions", 7)
    pages     = run(["pagePath"], ["screenPageViews","averageSessionDuration","bounceRate"], W1_START, W1_END, "screenPageViews", 8)
    countries = run(["country"],  ["sessions"], W1_START, W1_END, "sessions", 6)
    devices   = run(["deviceCategory"], ["sessions","bounceRate"], W1_START, W1_END, "sessions", 3)
    daily_ga  = run(["date"], ["sessions","screenPageViews"], W1_START, W1_END, None, 7)

    return dict(
        sess=mv(ov_w1,0), users=mv(ov_w1,1), pv=mv(ov_w1,2),
        bounce=mv(ov_w1,3)*100, dur=mv(ov_w1,4), new_u=mv(ov_w1,5), engaged=mv(ov_w1,6),
        prev_sess=mv(ov_w2,0), prev_users=mv(ov_w2,1), prev_pv=mv(ov_w2,2),
        sess_28=mv(ov_28,0), users_28=mv(ov_28,1),
        prev_sess_28=mv(ov_28p,0), prev_users_28=mv(ov_28p,1),
        sources=sources, pages=pages, countries=countries, devices=devices, daily=daily_ga,
    )

# ── Resend ────────────────────────────────────────────────────────────────────
def fetch_resend():
    def get(path):
        req = urllib.request.Request(
            f"https://api.resend.com{path}",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}",
                     "User-Agent": "DataLatte-Reporter/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    try:
        contacts   = get(f"/audiences/{RESEND_AUDIENCE}/contacts").get("data", [])
        total      = len(contacts)
        subscribed = sum(1 for c in contacts if not c.get("unsubscribed"))
        recent     = sorted(contacts, key=lambda c: c.get("created_at",""), reverse=True)[:4]
    except Exception:
        total, subscribed, recent = 0, 0, []
    try:
        broadcasts = get("/broadcasts").get("data", [])
        broadcasts = sorted(broadcasts, key=lambda b: b.get("sent_at") or b.get("created_at",""), reverse=True)[:4]
    except Exception:
        broadcasts = []
    return dict(total=total, subscribed=subscribed, recent=recent, broadcasts=broadcasts)

# ── AI Recommendations via Groq ───────────────────────────────────────────────
def fetch_ai_recommendations(gsc, ga4, rs):
    ctr_w1  = gsc['cl_w1'] / gsc['im_w1'] * 100 if gsc['im_w1'] else 0
    top_opps = [f"  - \"{r['keys'][0]}\" pos {r.get('position',0):.0f}, {r.get('impressions',0)} impr, 0 clicks"
                for r in gsc['opps'][:4]]
    top_q    = [f"  - \"{r['keys'][0]}\" cl={r.get('clicks',0)} im={r.get('impressions',0)} pos={r.get('position',0):.1f}"
                for r in gsc['top_queries'][:5]]
    top_p    = [f"  - {r['keys'][0].replace('https://datalatte.pro','')} im={r.get('impressions',0)} cl={r.get('clicks',0)}"
                for r in gsc['top_pages_impr'][:4]]

    prompt = f"""You are a content strategist for DataLatte.pro — a local marketing agency for small businesses (coffee shops, hair salons, pet groomers, fitness studios) in the US, UK, AU, CA.

Here is this week's Google Search Console data ({W1_START} to {W1_END}):

Queries getting impressions but 0 clicks (top opportunities):
{chr(10).join(top_opps) if top_opps else "  - none"}

Top queries by impressions this week:
{chr(10).join(top_q)}

Top pages by impressions:
{chr(10).join(top_p)}

Content performance (impressions / clicks):
- Blog: {gsc['blog_impr']} impr / {gsc['blog_cl']} clicks
- Niche landing pages (/for/*): {gsc['niche_impr']} impr / {gsc['niche_cl']} clicks
- Service pages: {gsc['service_impr']} impr / {gsc['service_cl']} clicks

CTR: {ctr_w1:.1f}% (industry avg ~3%). Avg position: {gsc['pos_w1']}.

Give exactly 4 recommendations focused on CONTENT — what to write or fix this week. For each:
- Name a specific blog post title or page to improve (based on the queries above)
- Explain in one sentence why (which query, what opportunity)
- Suggest one concrete improvement (new H1, add FAQ section, target this keyword, etc.)

Format:
[NEW POST] — Write: "Exact title here" — targets query "X" which has N impressions and 0 clicks
[IMPROVE] — Fix: /url/of/page — add [specific element] to capture query "X"
[NEW POST] — ...
[IMPROVE] — ...

Use only data from above. No generic advice."""

    try:
        key = GROQ_API_KEY or __import__("os").environ.get("GROQ_API_KEY", "")
        payload = json.dumps({
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 600,
            "temperature": 0.4,
        }).encode()
        req = urllib.request.Request(
            "https://api.groq.com/openai/v1/chat/completions",
            data=payload, method="POST",
            headers={"Authorization": f"Bearer {key}",
                     "Content-Type": "application/json",
                     "User-Agent": "DataLatte-Reporter/1.0"},
        )
        with urllib.request.urlopen(req, timeout=20) as r:
            data = json.loads(r.read())
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"  ⚠ AI recommendations failed: {e}")
        return None

# ── HTML primitives ───────────────────────────────────────────────────────────
C_DARK  = "#0f1c2e"
C_GOLD  = "#c9a96e"
C_BLUE  = "#2563a8"
C_GREEN = "#1e7e4f"
C_RED   = "#b02a2a"
C_AMBER = "#b86e00"
C_BG    = "#f0ede7"

def db(cur, prev, rev=False):
    """Delta badge — coloured arrow + %"""
    if not prev: return '<span style="color:#aaa">—</span>'
    d = (cur - prev) / prev * 100
    up = d > 0
    good = up if not rev else not up
    fg = C_GREEN if good else C_RED
    sym = "▲" if up else "▼"
    return f'<span style="color:{fg};font-weight:700">{sym}&thinsp;{abs(d):.0f}%</span>'

def pc(pos):
    """Position chip"""
    if pos <= 10:   bg, fg = "#d4edda", C_GREEN
    elif pos <= 20: bg, fg = "#fff3cd", C_AMBER
    else:           bg, fg = "#f8d7da", C_RED
    return f'<span style="background:{bg};color:{fg};padding:1px 6px;font-size:11px;font-weight:700">{pos:.1f}</span>'

def mb(val, mx, w=75, c=C_BLUE):
    """Mini bar chart"""
    if not mx: return ""
    f = max(2, int(val / mx * w))
    return (f'<table cellpadding="0" cellspacing="0" style="display:inline-table;vertical-align:middle">'
            f'<tr><td width="{f}" height="5" bgcolor="{c}" style="font-size:0">&nbsp;</td>'
            f'<td width="{w-f}" height="5" bgcolor="#dde3ec" style="font-size:0">&nbsp;</td></tr></table>')

def fmtd(s):
    m, sec = divmod(int(s), 60)
    return f"{m}m{sec:02d}s"

def shead(title, sub=""):
    s = f'&ensp;<span style="font-size:10px;color:#8a9aaa;font-weight:400;text-transform:none;letter-spacing:0">{sub}</span>' if sub else ""
    return (f'<tr bgcolor="#eef1f6"><td colspan="9" style="padding:9px 20px 8px;'
            f'font-size:10px;font-weight:800;color:#1a2a3a;letter-spacing:0.08em;'
            f'text-transform:uppercase;border-top:2px solid {C_BLUE}">{title}{s}</td></tr>')

def th(*cols):
    cells = "".join(
        f'<td style="padding:5px {"20px" if i==0 else "10px"} 5px {"20px" if i==0 else ("20px" if i==len(cols)-1 else "10px")};'
        f'font-size:10px;font-weight:700;color:#8a9aaa;text-transform:uppercase;letter-spacing:0.05em;'
        f'text-align:{"left" if i==0 else "right"};border-bottom:1px solid #ddd8ce">{c}</td>'
        for i, c in enumerate(cols))
    return f'<tr bgcolor="#f7f5f0">{cells}</tr>'

def tr(*cols, alt=False):
    bg = ' bgcolor="#f2f0eb"' if alt else ' bgcolor="#faf8f4"'
    cells = "".join(
        f'<td style="padding:5px {"20px" if i==0 else "10px"} 5px {"20px" if i==0 else ("20px" if i==len(cols)-1 else "10px")};'
        f'font-size:11px;color:#2c3e50;text-align:{"left" if i==0 else "right"};'
        f'border-bottom:1px solid #ede8e0">{c}</td>'
        for i, c in enumerate(cols))
    return f"<tr{bg}>{cells}</tr>"

def kpi4(items):
    """Row of 4 KPI cards on dark bg"""
    cells = "".join(
        f'<td align="center" style="padding:14px 6px;border-right:{"1px solid #1e3050" if i<len(items)-1 else "none"};width:{100//len(items)}%">'
        f'<p style="margin:0;font-size:9px;color:#5a7090;letter-spacing:0.08em;text-transform:uppercase">{lab}</p>'
        f'<p style="margin:5px 0 3px;font-size:22px;font-weight:900;color:#fff;line-height:1">{val}</p>'
        f'<p style="margin:0;font-size:11px">{badge}</p></td>'
        for i, (lab, val, badge) in enumerate(items))
    return f'<tr>{cells}</tr>'

def kpi4_light(items):
    """Row of 4 KPI cards on light bg"""
    cells = "".join(
        f'<td align="center" style="padding:12px 6px;border-right:{"1px solid #e4dfd4" if i<len(items)-1 else "none"};width:{100//len(items)}%">'
        f'<p style="margin:0;font-size:9px;color:#8a9aaa;letter-spacing:0.08em;text-transform:uppercase">{lab}</p>'
        f'<p style="margin:5px 0 3px;font-size:20px;font-weight:800;color:#1a2a3a;line-height:1">{val}</p>'
        f'<p style="margin:0;font-size:11px">{badge}</p></td>'
        for i, (lab, val, badge) in enumerate(items))
    return f'<tr bgcolor="#f7f5f0" style="border:1px solid #ddd8ce">{cells}</tr>'

def section_divider(num, title):
    return (f'<tr><td colspan="9" bgcolor="{C_DARK}" style="padding:10px 20px">'
            f'<span style="font-size:11px;font-weight:900;color:{C_GOLD};letter-spacing:0.06em">'
            f'{num}&ensp;/&ensp;</span>'
            f'<span style="font-size:11px;font-weight:700;color:#8a9aaa;letter-spacing:0.04em;text-transform:uppercase">{title}</span>'
            f'</td></tr>')

# ── Parse AI recommendations ──────────────────────────────────────────────────
def render_ai_recs(raw_text):
    if not raw_text:
        return '<tr><td style="padding:12px 20px;font-size:12px;color:#888">AI recommendations unavailable.</td></tr>'

    tag_cfg = {
        "[NEW POST]":  (C_GREEN,    "✍", "#e8f7ef"),
        "[IMPROVE]":   (C_BLUE,     "↑", "#eef3fb"),
        "[QUICK WIN]": (C_AMBER,    "⚡", "#fdf5e6"),
        "[CONTENT]":   (C_BLUE,     "✍", "#eef3fb"),
        "[TECHNICAL]": ("#5a3e8a",  "⚙", "#f0edfb"),
        "[GROWTH]":    (C_GOLD,     "↗", "#fdf5e6"),
    }

    rows = ""
    for line in raw_text.split("\n"):
        line = line.strip()
        if not line:
            continue
        matched = False
        for tag, (fg, ic, bg) in tag_cfg.items():
            if line.startswith(tag):
                text = line[len(tag):].strip(" —:-")
                rows += (f'<tr bgcolor="{bg}"><td style="padding:10px 20px;border-bottom:1px solid #e8e2d8">'
                         f'<span style="font-size:10px;font-weight:800;color:{fg};letter-spacing:0.06em;text-transform:uppercase">'
                         f'{ic}&ensp;{tag[1:-1]}</span><br>'
                         f'<span style="font-size:12px;color:#1a2a3a;line-height:1.5">{text}</span>'
                         f'</td></tr>')
                matched = True
                break
        if not matched and line:
            rows += (f'<tr><td style="padding:6px 20px;font-size:12px;color:#444;'
                     f'border-bottom:1px solid #ede8e0">{line}</td></tr>')
    return rows

# ── Build email ───────────────────────────────────────────────────────────────
def build_email(gsc, ga4, rs, ai_recs_raw):
    g = gsc; a = ga4
    ctr_w1 = g['cl_w1'] / g['im_w1'] * 100 if g['im_w1'] else 0
    ctr_28  = g['cl_28'] / g['im_28'] * 100 if g['im_28'] else 0
    ppv     = a['pv'] / a['sess'] if a['sess'] else 0

    # ── GSC daily trend (7 days only to save space) ──
    daily7  = sorted(g['daily'], key=lambda x: x['keys'][0])[-7:]
    mx_im   = max((r.get('impressions',0) for r in daily7), default=1)
    gsc_d   = ""
    for i, r in enumerate(daily7):
        cl = int(r.get('clicks',0)); im = int(r.get('impressions',0))
        cl_s = f'<b style="color:{C_GREEN}">{cl}</b>' if cl else '<span style="color:#ccc">·</span>'
        gsc_d += tr(r['keys'][0][5:], mb(im,mx_im), f"{im:,}", cl_s, alt=i%2==0)

    # ── GA4 daily ──
    ga_ds  = sorted(a['daily'].rows, key=lambda x: x.dimension_values[0].value)
    mx_s   = max((int(float(r.metric_values[0].value)) for r in ga_ds), default=1)
    ga_d   = ""
    for i, r in enumerate(ga_ds):
        raw = r.dimension_values[0].value
        d   = f"{raw[4:6]}-{raw[6:]}"
        s   = int(float(r.metric_values[0].value))
        pv  = int(float(r.metric_values[1].value))
        ga_d += tr(d, mb(s,mx_s), f"{s:,}", f"{pv:,}", alt=i%2==0)

    # ── Queries ──
    mx_q  = max((r.get('impressions',0) for r in g['top_queries']), default=1)
    q_rows = "".join(tr(r['keys'][0][:44], mb(r.get('impressions',0),mx_q,60),
                        f"{r.get('impressions',0):,}", str(r.get('clicks',0)),
                        f"{r.get('ctr',0)*100:.1f}%", pc(r.get('position',0)), alt=i%2==0)
                     for i,r in enumerate(g['top_queries']))

    # ── Opportunities ──
    opp_rows = "".join(tr(r['keys'][0][:46], pc(r.get('position',0)),
                          f"{r.get('impressions',0):,}", "0", alt=i%2==0)
                       for i,r in enumerate(g['opps']))
    if not opp_rows:
        opp_rows = tr("No near-top queries this period")

    # ── Top pages ──
    mx_p  = max((r.get('impressions',0) for r in g['top_pages_impr']), default=1)
    p_rows = "".join(tr(r['keys'][0].replace("https://datalatte.pro","")[:46],
                        mb(r.get('impressions',0),mx_p,60),
                        f"{r.get('impressions',0):,}", str(r.get('clicks',0)),
                        pc(r.get('position',0)), alt=i%2==0)
                     for i,r in enumerate(g['top_pages_impr']))

    # ── Countries GSC ──
    mx_c  = max((r.get('impressions',0) for r in g['countries']), default=1)
    c_rows = "".join(tr(r['keys'][0].upper(), mb(r.get('impressions',0),mx_c,60),
                        f"{r.get('impressions',0):,}", str(r.get('clicks',0)),
                        f"{r.get('ctr',0)*100:.1f}%", pc(r.get('position',0)), alt=i%2==0)
                     for i,r in enumerate(g['countries']))

    # ── Traffic sources ──
    tot_s  = max(int(a['sess']),1)
    mx_src = max((int(float(r.metric_values[0].value)) for r in a['sources'].rows), default=1)
    src_rows = "".join(
        tr(r.dimension_values[0].value,
           mb(int(float(r.metric_values[0].value)),mx_src,60),
           f"{int(float(r.metric_values[0].value)):,}",
           f"{int(float(r.metric_values[0].value))/tot_s*100:.0f}%",
           f"{float(r.metric_values[1].value)*100:.0f}%", alt=i%2==0)
        for i,r in enumerate(a['sources'].rows))

    # ── GA4 pages ──
    ga_p = "".join(tr(r.dimension_values[0].value[:46],
                      f"{int(float(r.metric_values[0].value)):,}",
                      fmtd(float(r.metric_values[1].value)),
                      f"{float(r.metric_values[2].value)*100:.0f}%", alt=i%2==0)
                   for i,r in enumerate(a['pages'].rows))

    # ── GA4 countries ──
    mx_gc = max((int(float(r.metric_values[0].value)) for r in a['countries'].rows), default=1)
    gc_rows = "".join(tr(r.dimension_values[0].value,
                         mb(int(float(r.metric_values[0].value)),mx_gc,60),
                         f"{int(float(r.metric_values[0].value)):,}", alt=i%2==0)
                      for i,r in enumerate(a['countries'].rows))

    # ── Devices ──
    dev_rows = "".join(tr(r.dimension_values[0].value.capitalize(),
                          f"{int(float(r.metric_values[0].value)):,}",
                          f"{float(r.metric_values[1].value)*100:.0f}%", alt=i%2==0)
                       for i,r in enumerate(a['devices'].rows))

    # ── Clusters ──
    tot_im = max(g['blog_impr']+g['niche_impr']+g['service_impr'],1)
    cl_rows = (tr("Blog articles",        mb(g['blog_impr'],   tot_im,60), f"{g['blog_impr']:,}",    str(g['blog_cl']),    alt=False)
             + tr("Niche pages (/for/*)", mb(g['niche_impr'],  tot_im,60), f"{g['niche_impr']:,}",   str(g['niche_cl']),   alt=True)
             + tr("Service pages",        mb(g['service_impr'],tot_im,60), f"{g['service_impr']:,}", str(g['service_cl']), alt=False))

    # ── Resend broadcasts ──
    bc_rows = ""
    for i, b in enumerate(rs['broadcasts']):
        sent   = b.get("metrics",{}).get("delivered",0)
        opens  = b.get("metrics",{}).get("opened",0)
        clicks = b.get("metrics",{}).get("clicked",0)
        OR_v   = f"{opens/sent*100:.1f}%" if sent else "—"
        CTR_v  = f"{clicks/sent*100:.1f}%" if sent else "—"
        dt     = (b.get("sent_at") or b.get("created_at",""))[:10]
        st     = f'<span style="color:{C_GREEN if b.get("status")=="sent" else C_AMBER};font-weight:700">{b.get("status","")}</span>'
        bc_rows += tr(b.get("name","")[:36], st, f"{sent:,}", OR_v, CTR_v, dt, alt=i%2==0)

    ai_rows = render_ai_recs(ai_recs_raw)

    ret = rs['subscribed']/rs['total']*100 if rs['total'] else 0

    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:{C_BG};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="{C_BG}">
<tr><td align="center" style="padding:20px 0 32px">
<table width="600" cellpadding="0" cellspacing="0" bgcolor="#fff" style="border:1px solid #d4cfc6">

<!-- HEADER -->
<tr><td bgcolor="{C_DARK}" style="padding:0">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:18px 20px 14px">
<p style="margin:0;font-size:18px;font-weight:900;color:{C_GOLD}">DataLatte</p>
<p style="margin:2px 0 0;font-size:9px;color:#3a5070;letter-spacing:0.1em;text-transform:uppercase">Performance Intelligence Report</p>
</td>
<td align="right" style="padding:18px 20px 14px">
<p style="margin:0;font-size:12px;font-weight:700;color:#8a9aaa">{TODAY.strftime('%B %d, %Y')}</p>
<p style="margin:2px 0 0;font-size:10px;color:#3a5070">7d: {W1_START} — {W1_END}</p>
</td>
</tr>
<tr><td colspan="2" height="2" bgcolor="{C_GOLD}" style="font-size:0">&nbsp;</td></tr>
</table></td></tr>

<!-- EXECUTIVE OVERVIEW -->
<tr><td bgcolor="{C_DARK}" style="padding:6px 0 16px">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 20px 6px"><p style="margin:0;font-size:9px;color:#3a5070;letter-spacing:0.1em;text-transform:uppercase;font-weight:700">Executive overview — 7-day window</p></td></tr>
{kpi4([
  ("Impressions", f"{g['im_w1']:,}", db(g['im_w1'],g['im_w2'])+' <span style="color:#3a5070;font-size:10px">WoW</span>'),
  ("Clicks (GSC)", str(g['cl_w1']),   db(g['cl_w1'],g['cl_w2'])+' <span style="color:#3a5070;font-size:10px">WoW</span>'),
  ("Sessions (GA4)", f"{int(a['sess']):,}", db(a['sess'],a['prev_sess'])+' <span style="color:#3a5070;font-size:10px">WoW</span>'),
  ("Avg position", str(g['pos_w1']), f'<span style="color:#3a5070;font-size:10px">target &lt;15</span>'),
])}
</table></td></tr>

<!-- === 01 GSC === -->
{section_divider("01","Google Search Console")}

<!-- KPIs 7d + 28d -->
<tr><td colspan="9">
<table width="100%" cellpadding="0" cellspacing="0">
{kpi4_light([
  ("7d Impressions", f"{g['im_w1']:,}", db(g['im_w1'],g['im_w2'])),
  ("7d Clicks",      str(g['cl_w1']),   db(g['cl_w1'],g['cl_w2'])),
  ("7d CTR",         f"{ctr_w1:.1f}%",  '<span style="color:#aaa;font-size:10px">avg 3%</span>'),
  ("28d Impressions",f"{g['im_28']:,}",  db(g['im_28'],g['im_28p'])),
])}
</table></td></tr>

<!-- Daily trend -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Daily trend","last 7 days")}
{th("Date","Impr","Impr","Clicks")}
{gsc_d}
</table></td></tr>

<!-- Top queries -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Top queries","last 7 days · by impressions")}
{th("Query","","Impr","Clicks","CTR","Pos")}
{q_rows if q_rows else tr("No query clicks this week")}
</table></td></tr>

<!-- Opportunities -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Near-top opportunities","pos &lt;25 · impr &ge;3 · 0 clicks")}
{th("Query","Pos","Impr","Clicks")}
{opp_rows}
</table></td></tr>

<!-- Top pages -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Top pages by impressions","last 7 days")}
{th("URL","","Impr","Clicks","Pos")}
{p_rows}
</table></td></tr>

<!-- Clusters -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Content cluster performance","last 7 days")}
{th("Cluster","Share","Impr","Clicks")}
{cl_rows}
</table></td></tr>

<!-- Countries -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Geographic breakdown","28 days · Search Console")}
{th("Country","","Impr","Clicks","CTR","Pos")}
{c_rows}
</table></td></tr>

<!-- === 02 GA4 === -->
{section_divider("02","Google Analytics 4")}

<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{kpi4_light([
  ("Sessions",  f"{int(a['sess']):,}",  db(a['sess'],   a['prev_sess'])),
  ("Users",     f"{int(a['users']):,}", db(a['users'],  a['prev_users'])),
  ("Pageviews", f"{int(a['pv']):,}",    db(a['pv'],     a['prev_pv'])),
  ("Bounce rate",f"{a['bounce']:.1f}%", '<span style="color:#aaa;font-size:10px">7d avg</span>'),
])}
{kpi4_light([
  ("Avg duration", fmtd(a['dur']),       '<span style="color:#aaa;font-size:10px">per session</span>'),
  ("New users",    f"{int(a['new_u']):,}",'<span style="color:#aaa;font-size:10px">first visits</span>'),
  ("28d sessions", f"{int(a['sess_28']):,}", db(a['sess_28'],a['prev_sess_28'])),
  ("28d users",    f"{int(a['users_28']):,}",db(a['users_28'],a['prev_users_28'])),
])}
</table></td></tr>

<!-- GA4 daily -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Sessions daily","last 7 days")}
{th("Date","","Sessions","Pageviews")}
{ga_d}
</table></td></tr>

<!-- Sources -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Traffic sources","last 7 days")}
{th("Channel","","Sessions","Share","Bounce")}
{src_rows}
</table></td></tr>

<!-- GA4 pages -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Top pages by pageviews","last 7 days")}
{th("Page","Views","Avg dur","Bounce")}
{ga_p}
</table></td></tr>

<!-- GA4 countries + devices side by side as separate tables -->
<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Countries","last 7 days · Analytics")}
{th("Country","","Sessions")}
{gc_rows}
</table></td></tr>

<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{shead("Devices","last 7 days")}
{th("Device","Sessions","Bounce")}
{dev_rows}
</table></td></tr>

<!-- === 03 RESEND === -->
{section_divider("03","Email Marketing (Resend)")}

<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">
{kpi4_light([
  ("Total contacts", str(rs['total']),      '<span style="color:#aaa;font-size:10px">all audiences</span>'),
  ("Subscribed",     str(rs['subscribed']), '<span style="color:#aaa;font-size:10px">active</span>'),
  ("Unsubscribed",   str(rs['total']-rs['subscribed']), '<span style="color:#aaa;font-size:10px">opted out</span>'),
  ("Retention",      f"{ret:.0f}%",         '<span style="color:#aaa;font-size:10px">sub/total</span>'),
])}
</table></td></tr>

{'<tr><td colspan="9"><table width="100%" cellpadding="0" cellspacing="0">' + shead("Broadcasts") + th("Name","Status","Delivered","Open rate","CTR","Date") + bc_rows + "</table></td></tr>" if bc_rows else ""}

<!-- === 04 AI RECOMMENDATIONS === -->
{section_divider("04","AI Recommendations")}
<tr><td colspan="9" style="padding:4px 0">
<table width="100%" cellpadding="0" cellspacing="0">
{ai_rows}
</table></td></tr>

<!-- FOOTER -->
<tr><td colspan="9" bgcolor="{C_DARK}" style="padding:12px 20px">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:10px;color:#2a3a4a">
datalatte.pro &ensp;
<a href="https://datalatte.pro" style="color:{C_GOLD};text-decoration:none">Site</a> &ensp;
<a href="https://search.google.com/search-console" style="color:{C_GOLD};text-decoration:none">GSC</a> &ensp;
<a href="https://analytics.google.com" style="color:{C_GOLD};text-decoration:none">GA4</a>
</td>
<td align="right" style="font-size:10px;color:#2a3a4a">{TODAY.strftime('%b %d, %Y')} &middot; auto-generated</td>
</tr></table>
</td></tr>

</table>
</td></tr></table>
</body></html>"""

# ── Send ──────────────────────────────────────────────────────────────────────
def send_email(subject, html):
    size_kb = len(html.encode()) / 1024
    print(f"  Email size: {size_kb:.1f} KB", "(⚠ may clip in Gmail)" if size_kb > 100 else "✓")
    payload = json.dumps({"from": RESEND_FROM, "to": [REPORT_TO],
                          "subject": subject, "html": html}).encode()
    req = urllib.request.Request(
        "https://api.resend.com/emails", data=payload, method="POST",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}",
                 "Content-Type": "application/json",
                 "User-Agent": "DataLatte-Reporter/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            resp = json.loads(r.read())
            print(f"  ✅ Sent — id={resp.get('id')}")
    except urllib.error.HTTPError as e:
        print(f"  ❌ Error {e.code}: {e.read().decode()}")

# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("🔐 Auth...")
    creds = get_creds()
    print("📡 GSC...")
    gsc = fetch_gsc(creds)
    print("📡 GA4...")
    ga4 = fetch_ga4(creds)
    print("📧 Resend...")
    rs = fetch_resend()
    print("🤖 AI recommendations...")
    ai_recs = fetch_ai_recommendations(gsc, ga4, rs)
    print("🏗  Building & sending...")
    send_email(
        f"DataLatte Report — {TODAY.strftime('%B %d, %Y')}",
        build_email(gsc, ga4, rs, ai_recs)
    )
    print(f"\nGSC 7d: {gsc['cl_w1']} clicks / {gsc['im_w1']:,} impr / pos {gsc['pos_w1']}")
    print(f"GA4 7d: {int(ga4['sess']):,} sessions / {int(ga4['users']):,} users")
    print(f"Resend: {rs['subscribed']}/{rs['total']} subscribed")
