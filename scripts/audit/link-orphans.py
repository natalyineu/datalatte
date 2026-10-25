#!/usr/bin/env python3
"""Stage 5b: give every orphan (indexable post with no inbound contextual link) 2 inbound links from topically
similar indexable posts that were NOT rewritten recently (so 3-6-link rule of rewritten posts stays intact).
Appends/extends a '## Related guides' list at the end of the source. Max 3 additions per source.
Usage: python3 scripts/audit/link-orphans.py [--apply]"""
import re,glob,os,sys,collections,json
APPLY='--apply' in sys.argv
files={os.path.basename(f)[:-4]:f for f in glob.glob('content/blog/*.mdx')}
meta={}
for s,f in files.items():
    head,sep,body=open(f).read().partition('\n---\n')
    if 'noindex: true' in head: continue
    ti=re.search(r'^title:\s*"?(.*?)"?\s*$',head,re.M); lm=re.search(r'lastModified: "?([\d-]+)',head)
    tags=re.search(r'^tags:\s*\[(.*?)\]',head,re.M)
    meta[s]=dict(title=(ti.group(1) if ti else s).replace('"','').strip(),lm=lm.group(1) if lm else '',
      tags=set(t.strip(' "\'').lower() for t in tags.group(1).split(',')) if tags else set(),body=body)
STOP=set('the a an and or for of to in on with how what why is are your you small business businesses local guide complete 2026 best vs'.split())
tok=lambda s:set(w for w in re.split(r'[^a-z0-9]+',s.lower()) if w and w not in STOP)
imp={}
try:
    for u,c,i,p in json.load(open('data/analytics/gsc-pages-90d.json'))['pages']:
        if u.startswith('/blog/'): imp[u[6:].strip('/')]=i
except Exception: pass
cfg=open('next.config.ts').read()
redir=dict(re.findall(r'source:\s*"/blog/([A-Za-z0-9-]+)",\s*destination:\s*"/blog/([A-Za-z0-9-]+)"',cfg))
inb=collections.Counter()
for s,m in meta.items():
    for t in set(re.findall(r'\]\(/blog/([A-Za-z0-9-]+)',m['body'])):
        t=redir.get(t,t)
        if t!=s and t in meta: inb[t]+=1
orph=[s for s in meta if inb[s]==0]
cands=[s for s,m in meta.items() if m['lm']<'2026-10-07' and '## Related guides' not in m['body']]
added=collections.Counter(); plan=collections.defaultdict(list)
for o in sorted(orph,key=lambda s:-imp.get(s,0)):
    to=tok(o)|meta[o]['tags']
    scored=[]
    for c in cands:
        if c==o or added[c]>=3: continue
        tc=tok(c)|meta[c]['tags']
        j=len(to&tc)/max(1,len(to|tc))
        if j>0: scored.append((j+min(imp.get(c,0),200)/4000,c))
    scored.sort(reverse=True)
    for _,c in scored[:2]:
        plan[c].append(o); added[c]+=1
n=0
for c,targets in plan.items():
    f=files[c]; head,sep,body=open(f).read().partition('\n---\n')
    block='\n\n## Related guides\n\n'+'\n'.join(f'- [{meta[t]["title"]}](/blog/{t})' for t in targets)+'\n'
    n+=len(targets)
    if APPLY: open(f,'w').write(head+sep+body.rstrip('\n')+block)
print(('APPLIED' if APPLY else 'DRY RUN'),'orphans',len(orph),'sources',len(plan),'links',n,'orphans covered',len({t for v in plan.values() for t in v}))
