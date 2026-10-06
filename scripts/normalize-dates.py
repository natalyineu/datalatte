#!/usr/bin/env python3
"""Normalize blog frontmatter dates: quote style, nothing before site launch (2026-05-12), lastModified >= date, nothing in the future."""
import glob, re, sys
LAUNCH, TODAY = "2026-05-12", "2026-10-06"
rx = lambda k: re.compile(r"^%s:\s*['\"]?(\d{4}-\d\d-\d\d)['\"]?\s*$" % k, re.M)
changed = 0
for f in sorted(glob.glob("content/blog/*.mdx")):
    s = open(f, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---", s, re.S)
    if not m: continue
    fm = m.group(1)
    d, l = rx("date").search(fm), rx("lastModified").search(fm)
    if not d: continue
    date = min(max(d.group(1), LAUNCH), TODAY)
    lm = min(max(l.group(1) if l else date, date), TODAY)
    new = rx("date").sub(f'date: "{date}"', fm)
    if l: new = rx("lastModified").sub(f'lastModified: "{lm}"', new)
    else: new = new.replace(f'date: "{date}"', f'date: "{date}"\nlastModified: "{lm}"', 1)
    if new != fm:
        open(f, "w", encoding="utf-8").write(s.replace(fm, new, 1)); changed += 1
print("changed", changed)
