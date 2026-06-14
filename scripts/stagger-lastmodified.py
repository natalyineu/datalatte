#!/usr/bin/env python3
"""
Stagger lastModified dates across country guide MDX files.
- Sort files alphabetically
- Assign dates starting from 2026-05-01, incrementing by 1 day every 4 articles
- Articles 1-4 get 2026-05-01, articles 5-8 get 2026-05-02, etc.
- Only changes lastModified: field; date: field is left untouched.
"""

import os
import re
import glob
from datetime import date, timedelta

content_dir = os.path.join(os.path.dirname(__file__), "..", "content", "blog")
pattern = os.path.join(content_dir, "local-marketing-*-small-business-2026.mdx")

files = sorted(glob.glob(pattern))
print(f"Found {len(files)} files")

start_date = date(2026, 5, 1)
updated = 0

for i, filepath in enumerate(files):
    # Compute the date: increment by 1 day every 4 articles (0-indexed)
    assigned_date = start_date + timedelta(days=i // 4)
    date_str = assigned_date.strftime("%Y-%m-%d")

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace lastModified: "YYYY-MM-DD" in frontmatter only
    new_content = re.sub(
        r'^(lastModified:\s*")[^"]*(")',
        rf'\g<1>{date_str}\g<2>',
        content,
        flags=re.MULTILINE
    )

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated += 1

    filename = os.path.basename(filepath)
    print(f"[{i+1:3d}] {filename} → {date_str}")

print(f"\nDone. Updated {updated} files.")
