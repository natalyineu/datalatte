#!/usr/bin/env python3
"""Removes sentences/bullets that leak the research process (source pack, supplied sources, 404 when checked...) from articles.
Usage: python3 strip-leaks.py [--apply] file...  (prints removed text)"""
import re,sys
APPLY='--apply' in sys.argv
PAT=re.compile(r"(source pack|source material|supplied sources?|sources (provided|supplied|checked here)|returned (an? )?(404|errors?)|when (checked|opened)|(was|were) not in the source|listed in the sources|materiałów źródłowych|zwróciły błędy|prices did not load|did not load)",re.I)
n=0
for f in [a for a in sys.argv[1:] if not a.startswith('--')]:
    t=open(f).read();head,sep,body=t.partition('\n---\n') if t.startswith('---') else ('','',t)
    if t.startswith('---'):
        m=re.match(r'(---\n.*?\n---\n)(.*)',t,re.S);head,body=m.group(1),m.group(2)
    out=[];removed=[]
    for line in body.split('\n'):
        if not PAT.search(line): out.append(line);continue
        if line.lstrip().startswith(('- ','* ','|')):
            removed.append(line);continue  # bullet/table row
        parts=re.split(r'(?<=[.!?])\s+',line);keep=[p for p in parts if not PAT.search(p)]
        removed+= [p for p in parts if PAT.search(p)]
        if keep: out.append(' '.join(keep))
        elif out and out[-1]=='' : pass
    new=head+'\n'.join(out)
    if removed:
        n+=1;print('==',f);[print('  -',r[:150]) for r in removed]
        if APPLY: open(f,'w').write(new)
print('files',n)
