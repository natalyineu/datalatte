#!/usr/bin/env python3
"""Cross-checks numbers in a NEW article against its research pack. Usage: verify-facts.py <slug> <pack-id>
Prints numbers that appear in the article but not in any source text (excluding lines/paragraphs marked assumption)."""
import re,sys,json
slug,pack=sys.argv[1],sys.argv[2]
t=open(f'content/blog/{slug}.mdx').read()
body=re.sub(r'^---.*?\n---\n','',t,flags=re.S)
src=' '.join(r['markdown'] for r in json.load(open(f'data/research/new-{pack}.json'))['results'])
norm=lambda s:re.sub(r'[,\s]','',s.lower().replace('–','-').replace('—','-'))
S=norm(src)
pat=re.compile(r'\$?\d[\d,]*(?:\.\d+)?\s?(?:%|percent|million|billion|trillion|[mbtk]\b|days?|weeks?|hours?)?',re.I)
bad=[]
for para in re.split(r'\n\s*\n',body):
    if re.search(r'assumption|worked example|example',para,re.I): continue
    if para.lstrip().startswith(('<StatRow','## Sources','- [')): 
        pass
    for m in pat.findall(para):
        m=m.strip()
        core=re.sub(r'[^\d.]','',m)
        if len(core)<2: continue
        n=norm(m)
        if n in S or norm(core) in S: continue
        # allow bare numerals like dates/years already in the text
        if re.fullmatch(r'20\d\d',core): continue
        bad.append((m,para[:90].replace('\n',' ')))
seen=set();out=[]
for m,p in bad:
    if m in seen: continue
    seen.add(m);out.append((m,p))
print(slug,'unverified numbers:',len(out))
for m,p in out[:25]: print('  ',m,'|',p)
