#!/usr/bin/env python3
"""Splits prose paragraphs longer than 70 words at sentence boundaries (target <= ~55 words each).
Skips lists, tables, headings, JSX, code, blockquotes, and never splits inside [..](..) links, backticks or ** emphasis.
Usage: python3 scripts/audit/split-long-paragraphs.py [--apply]"""
import re,glob,os,sys
APPLY='--apply' in sys.argv
ABBR=re.compile(r'(?:\b(?:vs|e\.g|i\.e|approx|inc|ltd|co|no|dr|mr|mrs|ms|st|etc|u\.s|u\.k|est|avg|min|max|fig)|\b[A-Z])\.$',re.I)
def balanced(s):
    return s.count('[')==s.count(']') and s.count('(')==s.count(')') and s.count('`')%2==0 and s.count('**')%2==0
def split_para(p,limit=70,target=55):
    if len(p.split())<=limit: return [p]
    # candidate boundaries: ". " "! " "? " followed by capital/digit/quote
    parts=re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“(\[*])',p)
    out=[];cur=''
    for sent in parts:
        cand=(cur+' '+sent).strip() if cur else sent
        if cur and (ABBR.search(cur) or not balanced(cur)):
            cur=cand; continue            # not a real boundary yet
        if cur and len(cand.split())>target and len(cur.split())>=15:
            out.append(cur); cur=sent
        else: cur=cand
    if cur:
        if out and len(cur.split())<10: out[-1]=out[-1]+' '+cur
        else: out.append(cur)
    return out
tot=dict(files=0,paras=0)
for f in sorted(glob.glob('content/blog/*.mdx')):
    raw=open(f).read(); head,sep,body=raw.partition('\n---\n')
    if not sep or 'noindex' in head: continue
    blocks=re.split(r'(\n{2,})',body); changed=0; fence=False; res=[]
    for b in blocks:
        if re.fullmatch(r'\n{2,}',b): res.append(b); continue
        st=b.strip()
        if st.startswith('```') : fence=not fence if st.count('```')%2==1 else fence
        prose=(not fence and st and not st.startswith(('#','|','<','-','*','+','>','```','!','[!','1.','2.','3.','4.','5.','6.','7.','8.','9.','---','{')) and '\n' not in st)
        if prose and len(st.split())>70:
            pieces=split_para(st)
            if len(pieces)>1: changed+=1; res.append('\n\n'.join(pieces)); continue
        res.append(b)
    if changed:
        tot['files']+=1; tot['paras']+=changed
        if APPLY: open(f,'w').write(head+sep+''.join(res))
print(('APPLIED' if APPLY else 'DRY RUN'),tot)
