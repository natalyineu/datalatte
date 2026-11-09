#!/usr/bin/env python3
"""Triage all blog posts: rewrite / merge / remove / keep. Local only, no network.
Usage: triage_all.py [--ahrefs HTML200.csv(utf16)] [--gsc-not-indexed Table.csv]
Output: data/triage/triage.csv + summary on stdout."""
import csv, glob, json, os, re, sys, collections
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
a = sys.argv[1:]
opt = lambda n: a[a.index(n)+1] if n in a else None
fm_re = re.compile(r'^---\n(.*?)\n---\n(.*)$', re.S)
prot = {p['slug'] for p in json.load(open(f'{R}/data/protected-placements.json'))}
gsc = {}
for u, c, i, p in json.load(open(f'{R}/data/analytics/gsc-pages-90d.json'))['pages']:
    gsc[u.replace('/blog/', '').strip('/')] = (c, i, p)
ah = {}
if opt('--ahrefs'):
    for r in csv.DictReader(open(opt('--ahrefs'), encoding='utf-16'), delimiter='\t'):
        s = re.sub(r'^https://datalatte\.pro/blog/', '', r['URL'])
        ah[s] = (int(r['No. of referring domains'] or 0), int(r['No. of href inlinks'] or 0))
cni = set()
if opt('--gsc-not-indexed'):
    for r in csv.DictReader(open(opt('--gsc-not-indexed'))):
        cni.add(re.sub(r'^https://datalatte\.pro/blog/', '', r['URL']))
rows = []
for f in sorted(glob.glob(f'{R}/content/blog/*.mdx')):
    s = os.path.basename(f)[:-4]
    m = fm_re.match(open(f).read())
    if not m: continue
    fm, body = m.groups()
    g = lambda k: (re.search(rf'^{k}:\s*"?(.*?)"?\s*$', fm, re.M) or [None, ''])[1]
    title = g('title'); words = len(re.findall(r'\w+', body))
    stem = re.sub(r'\s+(in|for)\s+[A-Z][\w .\-]*(,\s*[A-Z]{2})?(\s*\(.*\))?(\s*[|:–-].*)?$', '', title)
    stem = re.sub(r'\b(20\d\d)\b', '', stem).lower().strip()
    rows.append(dict(slug=s, title=title, noindex=bool(re.search(r'^noindex:\s*true', fm, re.M)), words=words,
        lastmod=g('lastModified') or g('date'), sources=bool(re.search(r'^#+\s*Sources', body, re.M | re.I)),
        faq=bool(re.search(r'^#+\s*FAQ', body, re.M | re.I)), statrow='<StatRow' in body,
        firstp=bool(re.search(r"\b(I|we|our team|my clients|we've|I've)\b", body[:6000])), stem=stem))
fam = collections.Counter(r['stem'] for r in rows)
out = []
for r in rows:
    s = r['slug']; c, i, p = gsc.get(s, (0, 0, 0)); rd, inl = ah.get(s, (0, 0))
    tmpl = bool(re.search(r',\s*[A-Z]{2}\b', r['title'])) or bool(re.search(r'(dooh|ctv)', s)) and fam[r['stem']] >= 4
    quality = r['sources'] and r['statrow'] and not r['firstp']
    if s in prot: act, why = 'KEEP-PROTECTED', 'paid placement'
    elif rd > 0 and (r['noindex'] or not quality):
        act, why = 'REWRITE-P1', f'{rd} referring domains'
    elif r['noindex']:
        if tmpl or r['words'] < 700: act, why = ('REMOVE-301' if i == 0 else 'REWRITE-P3'), 'template family' if tmpl else 'thin'
        elif i > 0: act, why = 'REWRITE-P1', f'{i} impressions while noindex'
        else: act, why = 'REWRITE-P2', 'unique topic, no signal'
    else:
        if quality: act, why = 'KEEP-OK', 'sourced + StatRow'
        elif i > 0 or s in cni: act, why = 'REWRITE-P1', 'indexable, weak, ' + ('crawled-not-indexed' if s in cni else f'{i} impr')
        else: act, why = 'REWRITE-P2', 'indexable, weak, no signal'
    out.append([s, act, why, r['noindex'], r['words'], r['sources'], r['statrow'], r['firstp'], c, i, p, rd, inl, int(tmpl), r['stem'][:50], r['title'][:70]])
os.makedirs(f'{R}/data/triage', exist_ok=True)
w = csv.writer(open(f'{R}/data/triage/triage.csv', 'w'))
w.writerow('slug action why noindex words sources statrow firstperson clicks impr pos refdomains inlinks template stem title'.split()); w.writerows(out)
print(collections.Counter(o[1] for o in out).most_common()); print(len(out))
print('template-family noindex:', sum(1 for o in out if o[13] and o[3]), 'families>=4:', sum(1 for k, n in fam.items() if n >= 4))
print('top families:', fam.most_common(8))
