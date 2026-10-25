#!/usr/bin/env python3
"""Stage 5a: repoint internal /blog/ links that hit a 301 source to its destination, and unlink (keep anchor text)
links to noindex or missing posts. Also reports orphans (indexable posts with no inbound contextual link).
Usage: python3 scripts/audit/fix-internal-links.py [--apply]"""
import re,glob,os,sys,collections
APPLY='--apply' in sys.argv
cfg=open('next.config.ts').read()
redir=dict(re.findall(r'source:\s*"/blog/([a-z0-9-]+)",\s*destination:\s*"/blog/([a-z0-9-]+)"',cfg))
def resolve(s):
    seen=0
    while s in redir and seen<5: s=redir[s]; seen+=1
    return s
files={os.path.basename(f)[:-4]:f for f in glob.glob('content/blog/*.mdx')}
idx={s:('noindex: true' not in open(f).read().split('\n---\n',1)[0]) for s,f in files.items()}
LINK=re.compile(r'\[([^\]]+)\]\(/blog/([a-z0-9-]+)/?([#?][^)\s]*)?\)')
st=collections.Counter()
for s,f in files.items():
    raw=open(f).read(); head,sep,body=raw.partition('\n---\n')
    if not sep or not idx[s]: continue   # only touch indexable sources
    def rep(m):
        text,slug,tail=m.group(1),m.group(2),m.group(3) or ''
        tgt=resolve(slug)
        if tgt!=slug and idx.get(tgt):
            st['repointed']+=1; return f'[{text}](/blog/{tgt}{tail})'
        if tgt not in idx:
            if slug in ('category','ctv-advertising','dooh-advertising','local-marketing-guides'): return m.group(0)
            st['unlinked_missing']+=1; return text
        if not idx[tgt]:
            st['unlinked_noindex']+=1; return text
        return m.group(0)
    nb=LINK.sub(rep,body)
    if nb!=body and APPLY: open(f,'w').write(head+sep+nb)
inb=collections.Counter()
for s,f in files.items():
    if not idx[s]: continue
    body=open(f).read().partition('\n---\n')[2]
    for m in set(re.findall(r'\]\(/blog/([a-z0-9-]+)',body)):
        t=resolve(m)
        if t!=s and idx.get(t): inb[t]+=1
orph=[s for s in idx if idx[s] and inb[s]==0]
print(('APPLIED' if APPLY else 'DRY RUN'),dict(st),"| indexable:",sum(idx.values()),"orphans:",len(orph))
open('/tmp/claude-0/-home-user-datalatte/c25f6807-b8ea-5ec0-a564-1f2791260f1d/scratchpad/orphans.txt','w').write('\n'.join(orph))
