#!/usr/bin/env python3
"""Scan unreviewed blog posts for signs of fabricated content (invented case studies, first-person anecdotes,
vague/unlinked statistics, truncation). Posts already rewritten and verified (lastModified 2026-10-08/10) and noindex posts are skipped.
Run from the repo root: python3 scripts/audit/fabrication-scan.py  (reads data/analytics/*.json for traffic)."""
import re,glob,os,json
g=json.load(open('data/analytics/gsc-latest.json')); a=json.load(open('data/analytics/ga4-latest.json'))
traffic={}
for p in g['pages']:
    u=p['keys'][0].replace('https://datalatte.pro','')
    if u.startswith('/blog/'): traffic[u[6:]]=traffic.get(u[6:],0)+p['impressions']+p['clicks']*20
for r in a['topPages']:
    s=r['dimensionValues'][0]['value']
    if s.startswith('/blog/'): traffic[s[6:]]=traffic.get(s[6:],0)+int(r['metricValues'][0]['value'])*5
FIRST=re.compile(r"\b(I've (seen|helped|worked|run|managed|built|tested|found)|I have (seen|helped|worked)|in my experience|my clients?|a client of mine|I worked with|I once|when I (started|worked|ran|helped)|we've helped|we helped|our clients?|DataLatte clients?|clients? I)\b",re.I)
CASE=re.compile(r"\b(a|one|an)\s+([A-Z][a-z]+\s+){1,2}(salon|studio|café|cafe|coffee shop|groomer|gym|restaurant|barbershop|bakery|clinic|spa)\b[^.\n]{0,120}\b(saw|increased|grew|boosted|doubled|tripled|went from|gained|cut|reduced|generated)\b",re.I)
ORG=re.compile(r"\b(Forrester|Gartner|McKinsey|Salesforce|Oracle|IBM|Deloitte|HubSpot|Statista|Nielsen|Harvard Business Review|Google study|Meta study|SBA|Pew|BrightLocal|WordStream|Mailchimp|Yelp|Moz|Semrush|Ahrefs)\b[^.\n]{0,80}\b(\d{1,3}%|\$\d)",re.I)
rows=[]
for f in glob.glob('content/blog/*.mdx'):
    s=os.path.basename(f)[:-4]; t=open(f).read(); parts=t.split('\n---\n',1); fm=parts[0]; body=parts[1] if len(parts)>1 else ''
    if 'noindex' in fm or re.search(r'lastModified: "2026-10-(08|10)"',fm): continue
    sc=0; why=[]
    n=len(FIRST.findall(body)); 
    if n: sc+=min(n,3)*2; why.append(f'first-person x{n}')
    n=len(CASE.findall(body))
    if n: sc+=min(n,3)*2; why.append(f'invented-case x{n}')
    ext=len(re.findall(r'\]\(https?://',body)); src='## Sources' in body
    # attributed stats without any external link
    n=len(ORG.findall(body))
    if n and ext<2: sc+=3; why.append(f'attributed-stats-no-links x{n}')
    elif n and not src: sc+=1
    if ext==0 and not src: sc+=2; why.append('no-sources')
    if re.search(r'<(BarChart|DonutChart|LineChart|Funnel|CompareBar)\b',body) and ext<2: sc+=2; why.append('charts-no-sources')
    if re.search(r'Source:\s*(various|industry|studies|internal)',body,re.I): sc+=3; why.append('vague-source')
    last=body.rstrip().splitlines()[-1] if body.strip() else ''
    if len(body.split())>200 and not re.search(r'[.!?)\]*|>`]$',last.strip()): sc+=3; why.append('truncated')
    if len(body.split())<700: sc+=2; why.append('thin')
    rows.append(dict(slug=s,score=sc,why=why,traffic=traffic.get(s,0),words=len(body.split())))
json.dump(rows,open('/tmp/fabrication-scan.json','w'))
import collections
print(len(rows))
for th in (3,5,7,9,11):
    print(th,sum(1 for r in rows if r['score']>=th), 'w/traffic',sum(1 for r in rows if r['score']>=th and r['traffic']>0))
