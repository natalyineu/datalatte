#!/usr/bin/env python3
"""Deterministic scrub of fabricated-content signals from unreviewed blog posts (no research, only deletions).
Removes: chart/StatRow components with no sources, paragraphs with first-person anecdotes / invented cases /
attributed stats without links, vague "Source: various" lines, headings left empty. Posts that end up thin
(<600 words) get noindex: true. Usage: python3 scripts/audit/scrub-fabricated.py [--apply] [--max-imp 5]
Skips noindex posts, posts rewritten since 2026-10-07 and posts with >= max-imp impressions in data/analytics/gsc-pages-90d.json."""
import re,glob,os,json,sys
APPLY='--apply' in sys.argv
MAXIMP=int(sys.argv[sys.argv.index('--max-imp')+1]) if '--max-imp' in sys.argv else 5
sys.path.insert(0,os.path.dirname(__file__))
FIRST=re.compile(r"\b(I've (seen|helped|worked|run|managed|built|tested|found)|I have (seen|helped|worked)|in my experience|my clients?|a client of mine|I worked with|I once|when I (started|worked|ran|helped)|we've helped|we helped|our clients?|DataLatte clients?|clients? I|we tested|we ran|we found that|our data|our analysis|our research)\b",re.I)
CASE=re.compile(r"\b(a|one|an)\s+([A-Z][a-z]+\s+){1,2}(salon|studio|café|cafe|coffee shop|groomer|gym|restaurant|barbershop|bakery|clinic|spa)\b[^.\n]{0,120}\b(saw|increased|grew|boosted|doubled|tripled|went from|gained|cut|reduced|generated)\b",re.I)
ORG=re.compile(r"\b(Forrester|Gartner|McKinsey|Salesforce|Oracle|IBM|Deloitte|HubSpot|Statista|Nielsen|Harvard Business Review|Google study|Meta study|SBA|Pew|BrightLocal|WordStream|Mailchimp|Yelp|Moz|Semrush|Ahrefs)\b[^.\n]{0,80}\b(\d{1,3}%|\$\d)",re.I)
VAGUE=re.compile(r"^\s*\**Source:?\**:?\s*(various|industry|studies|internal)[^\n]*$",re.I|re.M)
COMP=re.compile(r"<(BarChart|DonutChart|LineChart|Funnel|CompareBar|StatRow)\b.*?/>",re.S)
imp={}
try:
    for u,c,i,p in json.load(open('data/analytics/gsc-pages-90d.json'))['pages']:
        if u.startswith('/blog/'): imp[u[6:].strip('/')]=i
except Exception: pass
stats=dict(files=0,paras=0,comps=0,noindexed=0,kept=0)
for f in sorted(glob.glob('content/blog/*.mdx')):
    s=os.path.basename(f)[:-4]; raw=open(f).read()
    head,sep,body=raw.partition('\n---\n')
    if not sep or 'noindex' in head: continue
    lm=re.search(r'lastModified: "?([\d-]+)',head); 
    if lm and lm.group(1)>='2026-10-07': continue
    if imp.get(s,0)>=MAXIMP: continue
    ext=len(re.findall(r'\]\(https?://',body)); src='## Sources' in body
    risky=bool(FIRST.search(body) or CASE.search(body) or (ORG.search(body) and ext<2) or (ext==0 and not src and COMP.search(body)))
    if not risky: continue
    nb=body; removed_p=0; removed_c=0
    if ext<2:
        nb,k=COMP.subn('',nb); removed_c+=k
    nb=VAGUE.sub('',nb)
    # Callout blocks (single or multi-line) that carry anecdotes/invented cases
    def callout(m):
        nonlocal_removed.append(1)
        return '' if (FIRST.search(m.group(0)) or CASE.search(m.group(0))) else m.group(0)
    nonlocal_removed=[]
    nb=re.sub(r'<Callout\b[^>]*>.*?</Callout>',callout,nb,flags=re.S)
    removed_p+=sum(1 for _ in nonlocal_removed)*0
    out=[]
    for para in re.split(r'\n{2,}',nb):
        p=para.strip()
        if not p: continue
        isprose=not p.startswith(('#','|','<','-','*','1.','```','>'))
        bad=FIRST.search(p) or CASE.search(p) or (ORG.search(p) and ext<2)
        if bad and (isprose or p.startswith(('-','*','>'))):
            removed_p+=1; continue
        out.append(p)
    # last resort: any remaining single line (list item, table row, quote) with an anecdote pattern
    out=[ '\n'.join(l for l in p.split('\n') if not (FIRST.search(l) or CASE.search(l))) if (FIRST.search(p) or CASE.search(p)) else p for p in out]
    out=[p for p in out if p.strip()]
    # drop headings with no content after them (next block is another heading or end)
    clean=[]
    for i,p in enumerate(out):
        if re.match(r'#{2,4} ',p):
            nxt=out[i+1] if i+1<len(out) else ''
            if not nxt or re.match(r'#{2,4} ',nxt):
                if not re.match(r'##\s+(FAQ|Frequently)',p,re.I): continue
        clean.append(p)
    nb='\n\n'.join(clean)+'\n'
    words=len(re.sub(r'<[^>]+>','',nb).split())
    stats['files']+=1; stats['paras']+=removed_p; stats['comps']+=removed_c
    if words<600:
        stats['noindexed']+=1
        if 'noindex' not in head: head=head.rstrip('\n')+'\nnoindex: true'
    else: stats['kept']+=1
    if APPLY: open(f,'w').write(head+sep+nb)
print(('APPLIED' if APPLY else 'DRY RUN'),stats)
