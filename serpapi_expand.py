#!/usr/bin/env python3
"""
SerpApi SEO Semantic Core Expansion — DataLatte.pro
Runs ~25 SERP queries (PAA + Related Searches) and 135 autocomplete queries.
"""

import json
import time
import requests
from pathlib import Path
from urllib.parse import quote_plus

# ─── Config ───────────────────────────────────────────────────────────────────
API_KEY = "108563bdbcda63cac0d233e5dcc06cef2bbbb7d60aa389b4ea510e254365ec6d"
BASE_URL = "https://serpapi.com/search"
OUTPUT_DIR = Path("/Users/nataliiamakota/Desktop/claude/datalatte/seo-research/serpapi-raw")
SEO_DIR   = Path("/Users/nataliiamakota/Desktop/claude/datalatte/seo-research")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ─── Seed keywords: top 2-3 per cluster by relevance score ────────────────────
SEED_KEYWORDS = {
    # CLUSTER 1 — Google Ads for Small Business
    "C1": {
        "name": "Google Ads for Small Business",
        "keywords": [
            "how to use google ads for small business",        # 601
            "how much is google ads for small business",       # 600
            "how to set up google ads for small business",     # 560
        ]
    },
    # CLUSTER 2 — Local SEO for Small Business
    "C2": {
        "name": "Local SEO for Small Business",
        "keywords": [
            "how to improve local seo for small businesses",   # 601
            "what is local seo for small businesses",          # 601
            "what is local seo and why is it important",       # 600
        ]
    },
    # CLUSTER 3 — Facebook Ads for Local Business
    "C3": {
        "name": "Facebook Ads for Local Business",
        "keywords": [
            "how to run facebook ads for local business",      # 601
            "how to run facebook ads for small businesses",    # 600
            "how much are facebook ads for small business",    # 562
        ]
    },
    # CLUSTER 4 — Marketing Automation for Small Business
    "C4": {
        "name": "Marketing Automation for Small Business",
        "keywords": [
            "what does marketing automation do",               # 600
            "best marketing automation for small businesses",  # 552
            "why is marketing automation important",           # 553
        ]
    },
    # CLUSTER 5 — Google Business Profile Optimization
    "C5": {
        "name": "Google Business Profile Optimization",
        "keywords": [
            "what is google business profile optimization",    # 601
            "how to do google business profile optimization",  # 600
            "google business profile optimization checklist",  # 562
        ]
    },
    # CLUSTER 6 — Influencer Marketing for Salons (Breakout)
    "C6": {
        "name": "Influencer Marketing for Salons",
        "keywords": [
            "salon influencers",                               # 601
            "best marketing for salons",                       # 600
            "salon marketing examples",                        # 601
        ]
    },
    # CLUSTER 7 — Email Marketing for Coffee Shops
    "C7": {
        "name": "Email Marketing for Coffee Shops",
        "keywords": [
            "email marketing for coffee shop",                 # 601
            "marketing strategies for coffee shop",            # 600
            "how to market a coffee shop",                     # 553
        ]
    },
    # CLUSTER 8 — Responsive Search Ads
    "C8": {
        "name": "Responsive Search Ads",
        "keywords": [
            "google responsive search ads examples",           # 601
            "what is a responsive search ad in google ads",    # 600
            "google responsive search ads best practices",     # 552
        ]
    },
    # CLUSTER 9 — Dog Grooming Marketing
    "C9": {
        "name": "Dog Grooming Marketing",
        "keywords": [
            "dog grooming marketing ideas",                    # 601
            "how to advertise dog grooming business",          # 600
            "how to get dog grooming clients",                 # 555
        ]
    },
    # CLUSTER 10 — Email Marketing for Small Business
    "C10": {
        "name": "Email Marketing for Small Business",
        "keywords": [
            "email marketing ideas for small business",        # 601
            "email marketing strategy for small business",     # 600
            "is email marketing profitable",                   # 556
        ]
    },
}

# ─── Breakout keywords for autocomplete ───────────────────────────────────────
BREAKOUT_KEYWORDS = [
    "influencer marketing for salons",
    "email marketing for coffee shops",
    "responsive search ads small business",
    "viral marketing for gyms",
    "content marketing for salons",
]

# Map breakout keywords to their cluster IDs (for tagging in expanded file)
BREAKOUT_CLUSTER_MAP = {
    "influencer marketing for salons": "C6",
    "email marketing for coffee shops": "C7",
    "responsive search ads small business": "C8",
    "viral marketing for gyms": "C6",   # nearest salon/gym cluster; standalone
    "content marketing for salons": "C6",
}

# ─── Helpers ──────────────────────────────────────────────────────────────────
def serpapi_get(params: dict, retries: int = 2) -> dict:
    """Make a SerpApi request, return parsed JSON or empty dict on failure."""
    params["api_key"] = API_KEY
    for attempt in range(retries + 1):
        try:
            r = requests.get(BASE_URL, params=params, timeout=30)
            if r.status_code == 200:
                return r.json()
            else:
                print(f"  ⚠ HTTP {r.status_code} — {r.text[:120]}")
        except Exception as e:
            print(f"  ⚠ Exception: {e}")
        if attempt < retries:
            time.sleep(2)
    return {}

# ─── Step 1: SERP queries for PAA + Related Searches ─────────────────────────
print("=" * 70)
print("STEP 1: SERP queries (PAA + Related Searches)")
print("=" * 70)

paa_data: dict[str, list] = {}
related_data: dict[str, list] = {}
serp_requests = 0
serp_skipped = 0

for cluster_id, cluster_info in SEED_KEYWORDS.items():
    for kw in cluster_info["keywords"]:
        print(f"\n[{cluster_id}] Querying: {kw}")
        params = {
            "engine": "google",
            "q": kw,
            "hl": "en",
            "gl": "us",
            "num": 10,
        }
        data = serpapi_get(params)
        serp_requests += 1

        if not data:
            print("  → SKIPPED (empty response)")
            serp_skipped += 1
            time.sleep(1)
            continue

        # Extract PAA
        paa_list = []
        for item in data.get("related_questions", []):
            paa_list.append({
                "question": item.get("question", ""),
                "snippet": item.get("snippet", ""),
                "source_title": item.get("source", {}).get("title", "") if isinstance(item.get("source"), dict) else "",
                "source_url": item.get("source", {}).get("link", "") if isinstance(item.get("source"), dict) else "",
            })
        paa_data[kw] = paa_list
        print(f"  → PAA: {len(paa_list)} questions")

        # Extract Related Searches
        rel_list = [item.get("query", "") for item in data.get("related_searches", []) if item.get("query")]
        related_data[kw] = rel_list
        print(f"  → Related: {len(rel_list)} searches")

        time.sleep(1)

print(f"\nSERP step done. Requests: {serp_requests}, Skipped: {serp_skipped}")

# ─── Step 2: Autocomplete for Breakout keywords ───────────────────────────────
print("\n" + "=" * 70)
print("STEP 2: Autocomplete expansion for Breakout keywords")
print("=" * 70)

autocomplete_data: dict[str, dict] = {}
auto_requests = 0
auto_skipped = 0

for bkw in BREAKOUT_KEYWORDS:
    print(f"\nBreakout keyword: {bkw}")
    autocomplete_data[bkw] = {}

    # Base (no suffix)
    params = {
        "engine": "google_autocomplete",
        "q": bkw,
        "hl": "en",
        "gl": "us",
    }
    data = serpapi_get(params)
    auto_requests += 1
    if data:
        suggestions = [s.get("value", "") for s in data.get("suggestions", []) if s.get("value")]
        autocomplete_data[bkw]["base"] = suggestions
        print(f"  base → {len(suggestions)} suggestions")
    else:
        autocomplete_data[bkw]["base"] = []
        auto_skipped += 1
        print("  base → SKIPPED")
    time.sleep(1)

    # a–z suffixes
    for letter in "abcdefghijklmnopqrstuvwxyz":
        query = f"{bkw} {letter}"
        params = {
            "engine": "google_autocomplete",
            "q": query,
            "hl": "en",
            "gl": "us",
        }
        data = serpapi_get(params)
        auto_requests += 1
        if data:
            suggestions = [s.get("value", "") for s in data.get("suggestions", []) if s.get("value")]
            autocomplete_data[bkw][letter] = suggestions
        else:
            autocomplete_data[bkw][letter] = []
            auto_skipped += 1
        time.sleep(1)

    letter_count = sum(len(v) for k, v in autocomplete_data[bkw].items())
    print(f"  Total suggestions for '{bkw}': {letter_count}")

print(f"\nAutocomplete step done. Requests: {auto_requests}, Skipped: {auto_skipped}")

# ─── Step 3: Write raw JSON output files ─────────────────────────────────────
print("\n" + "=" * 70)
print("STEP 3: Writing output files")
print("=" * 70)

total_paa = sum(len(v) for v in paa_data.values())
total_related_unique = len(set(q for qs in related_data.values() for q in qs))
all_auto_suggestions = set()
for bkw_data in autocomplete_data.values():
    for suggestions in bkw_data.values():
        all_auto_suggestions.update(suggestions)
total_auto_unique = len(all_auto_suggestions)

# File 1: paa-all.json
paa_out = {
    "generated": "2026-05-14",
    "total_questions": total_paa,
    "data": paa_data,
}
with open(OUTPUT_DIR / "paa-all.json", "w", encoding="utf-8") as f:
    json.dump(paa_out, f, indent=2, ensure_ascii=False)
print(f"✓ paa-all.json — {total_paa} questions")

# File 2: related-searches.json
related_out = {
    "generated": "2026-05-14",
    "total_unique_queries": total_related_unique,
    "data": related_data,
}
with open(OUTPUT_DIR / "related-searches.json", "w", encoding="utf-8") as f:
    json.dump(related_out, f, indent=2, ensure_ascii=False)
print(f"✓ related-searches.json — {total_related_unique} unique queries")

# File 3: autocomplete-expanded.json
auto_out = {
    "generated": "2026-05-14",
    "total_unique_suggestions": total_auto_unique,
    "data": autocomplete_data,
}
with open(OUTPUT_DIR / "autocomplete-expanded.json", "w", encoding="utf-8") as f:
    json.dump(auto_out, f, indent=2, ensure_ascii=False)
print(f"✓ autocomplete-expanded.json — {total_auto_unique} unique suggestions")

# ─── Step 4: Build expanded keyword clusters file ─────────────────────────────
# Load original keyword sets per cluster (for dedup)
ORIGINAL_KEYWORDS: dict[str, set] = {}
for cid, cinfo in SEED_KEYWORDS.items():
    ORIGINAL_KEYWORDS[cid] = set(kw.lower() for kw in cinfo["keywords"])

# Build master keyword lists from original file content
CLUSTER_ORIGINAL_KEYWORDS: dict[str, set] = {
    "C1": set(k.lower() for k in [
        "how to use google ads for small business",
        "how much is google ads for small business",
        "how to set up google ads for small business",
        "google ads for small business cost",
        "google ads for small business free",
        "is google ads worth it for small business",
        "do google ads work for small business",
        "how effective is google ads for small business",
        "google ads for small local business",
    ]),
    "C2": set(k.lower() for k in [
        "how to improve local seo for small businesses",
        "what is local seo for small businesses",
        "what is local seo and why is it important",
        "why local seo matters for small businesses",
        "local seo for restaurants",
        "how much does seo cost for a small business",
        "local seo examples",
        "is seo worth it for small business",
        "why small businesses need seo",
    ]),
    "C3": set(k.lower() for k in [
        "how to run facebook ads for local business",
        "how to run facebook ads for small businesses",
        "how much are facebook ads for small business",
        "how to manage facebook advertising for small businesses",
        "how to make money running facebook ads for local businesses",
        "do facebook ads work for local businesses",
        "how much does a local facebook ad cost",
        "are facebook ads good for local businesses",
    ]),
    "C4": set(k.lower() for k in [
        "what does marketing automation do",
        "best marketing automation for small businesses",
        "best marketing automation platform for small business",
        "why is marketing automation important",
        "small business marketing automation tools",
        "why use marketing automation",
        "automation marketing strategies",
    ]),
    "C5": set(k.lower() for k in [
        "what is google business profile optimization",
        "how to do google business profile optimization",
        "google business profile optimization checklist",
        "google business profile optimization best practices",
        "google business profile optimization guide",
        "google business profile optimization 2026",
        "google business profile optimization cost",
        "google business profile optimization service",
    ]),
    "C6": set(k.lower() for k in [
        "salon influencers",
        "best marketing for salons",
        "salon marketing examples",
        "salon marketing ideas social media",
        "why is influencer marketing so effective",
        "influencer hair salon",
        "does influencer marketing increase sales",
    ]),
    "C7": set(k.lower() for k in [
        "email marketing for coffee shop",
        "marketing strategies for coffee shop",
        "how to market a coffee shop",
        "coffee shop marketing ideas",
        "coffee email campaign",
        "how to do marketing for a coffee shop",
    ]),
    "C8": set(k.lower() for k in [
        "google responsive search ads examples",
        "what is a responsive search ad in google ads",
        "google responsive search ads best practices",
        "responsive search ads benefits",
        "responsive search ads examples",
        "how do responsive search ads work",
    ]),
    "C9": set(k.lower() for k in [
        "dog grooming marketing ideas",
        "how to advertise dog grooming business",
        "how to get dog grooming clients",
        "how to promote my dog grooming business",
        "dog grooming advertising ideas",
        "how to get more dog grooming clients",
        "dog grooming marketing strategy",
        "where to advertise dog grooming",
        "pet grooming marketing ideas",
    ]),
    "C10": set(k.lower() for k in [
        "email marketing ideas for small business",
        "email marketing strategy for small business",
        "is email marketing profitable",
        "how long should a marketing email be",
        "marketing campaign ideas for small business",
        "when is email marketing most effective",
        "why is email marketing important for small businesses",
        "small business email marketing examples",
        "how to do email marketing for small business",
    ]),
}

# Per-cluster new keywords from PAA and Related
cluster_new_paa: dict[str, list[dict]] = {cid: [] for cid in SEED_KEYWORDS}
cluster_new_related: dict[str, list[str]] = {cid: [] for cid in SEED_KEYWORDS}
cluster_new_auto: dict[str, list[str]] = {cid: [] for cid in SEED_KEYWORDS}
cluster_seen: dict[str, set] = {cid: set(orig) for cid, orig in CLUSTER_ORIGINAL_KEYWORDS.items()}

# Cluster keyword → cluster ID mapping
KW_TO_CLUSTER = {}
for cid, cinfo in SEED_KEYWORDS.items():
    for kw in cinfo["keywords"]:
        KW_TO_CLUSTER[kw] = cid

def clean_kw(s: str) -> str:
    return s.strip().lower()

# Assign PAA and Related to clusters
for kw, paa_list in paa_data.items():
    cid = KW_TO_CLUSTER.get(kw)
    if not cid:
        continue
    for paa_item in paa_list:
        q = clean_kw(paa_item["question"])
        if q and q not in cluster_seen[cid]:
            cluster_seen[cid].add(q)
            cluster_new_paa[cid].append(paa_item)

for kw, rel_list in related_data.items():
    cid = KW_TO_CLUSTER.get(kw)
    if not cid:
        continue
    for rel in rel_list:
        r = clean_kw(rel)
        if r and r not in cluster_seen[cid]:
            cluster_seen[cid].add(r)
            cluster_new_related[cid].append(rel)

# Assign Autocomplete to clusters (breakout keywords)
BREAKOUT_TO_CLUSTER = {
    "influencer marketing for salons": "C6",
    "email marketing for coffee shops": "C7",
    "responsive search ads small business": "C8",
    "viral marketing for gyms": "C9",   # closest to gym/dog niche; no gym cluster; assign to C9
    "content marketing for salons": "C6",
}

for bkw, bkw_data in autocomplete_data.items():
    cid = BREAKOUT_TO_CLUSTER.get(bkw)
    if not cid:
        continue
    for suffix, suggestions in bkw_data.items():
        for sug in suggestions:
            s = clean_kw(sug)
            if s and s not in cluster_seen[cid]:
                cluster_seen[cid].add(s)
                cluster_new_auto[cid].append(sug)

# ─── Read original file and build expanded version ───────────────────────────
original_md = Path("/Users/nataliiamakota/Desktop/claude/datalatte/seo-research/02-keyword-clusters.md").read_text(encoding="utf-8")

# Split into clusters sections and inject new keywords
# We'll rebuild the file section by section
CLUSTER_HEADERS = {
    "C1": "## CLUSTER 1 — Google Ads for Small Business",
    "C2": "## CLUSTER 2 — Local SEO for Small Business",
    "C3": "## CLUSTER 3 — Facebook Ads for Local Business",
    "C4": "## CLUSTER 4 — Marketing Automation for Small Business",
    "C5": "## CLUSTER 5 — Google Business Profile Optimization",
    "C6": "## CLUSTER 6 — Influencer Marketing for Salons (🚨 Breakout)",
    "C7": "## CLUSTER 7 — Email Marketing for Coffee Shops (+150% trend)",
    "C8": "## CLUSTER 8 — Responsive Search Ads (Breakout)",
    "C9": "## CLUSTER 9 — Dog Grooming Marketing",
    "C10": "## CLUSTER 10 — Email Marketing for Small Business (Breakout)",
}

# For each cluster, append new keywords after its last original content section
# and before the next cluster header
lines = original_md.split("\n")
expanded_lines = []
i = 0
current_cluster = None

# Find which cluster we're in by looking for headers
cluster_end_positions = {}
for cid, header in CLUSTER_HEADERS.items():
    for idx, line in enumerate(lines):
        if line.strip() == header.strip():
            cluster_end_positions[cid] = idx
            break

# Determine end of each cluster block
sorted_clusters = sorted(cluster_end_positions.items(), key=lambda x: x[1])
cluster_blocks = []
for i_cl, (cid, start) in enumerate(sorted_clusters):
    if i_cl + 1 < len(sorted_clusters):
        end = sorted_clusters[i_cl + 1][1]
    else:
        end = None  # last cluster goes to end
    cluster_blocks.append((cid, start, end))

# Rebuild with injections
result_parts = []
prev_end = 0

for (cid, start, end) in cluster_blocks:
    # Text before cluster
    block_end = end if end is not None else len(lines)
    cluster_lines = lines[start:block_end]

    # Find the "---" at the end of the cluster to inject before it
    last_sep = None
    for j in range(len(cluster_lines) - 1, -1, -1):
        if cluster_lines[j].strip() == "---":
            last_sep = j
            break

    new_additions = []

    # Add PAA questions
    if cluster_new_paa[cid]:
        new_additions.append("")
        new_additions.append("### People Also Ask")
        for paa_item in cluster_new_paa[cid]:
            q = paa_item["question"]
            new_additions.append(f"- {q} [PAA]")

    # Add Related Searches
    if cluster_new_related[cid]:
        new_additions.append("")
        new_additions.append("### Related Searches")
        for rel in cluster_new_related[cid]:
            new_additions.append(f"- {rel} [RELATED]")

    # Add Autocomplete (only for breakout clusters)
    if cluster_new_auto[cid]:
        new_additions.append("")
        new_additions.append("### Autocomplete Expansions")
        for sug in cluster_new_auto[cid]:
            new_additions.append(f"- {sug} [AUTOCOMPLETE]")

    if last_sep is not None and new_additions:
        # Insert new_additions before the --- separator
        cluster_lines = cluster_lines[:last_sep] + new_additions + [""] + cluster_lines[last_sep:]
    elif new_additions:
        cluster_lines = cluster_lines + new_additions

    result_parts.append("\n".join(cluster_lines))

# Reconstruct full document
# header (before first cluster)
header_lines = lines[:sorted_clusters[0][1]]
full_expanded = "\n".join(header_lines) + "\n" + "\n".join(result_parts)

# Append summary at end
summary_section = lines[sorted_clusters[-1][1] + (cluster_blocks[-1][2] - cluster_blocks[-1][1] if cluster_blocks[-1][2] else 0):]
# Actually the summary is already included in last cluster block (end=None)

expanded_path = SEO_DIR / "02-keyword-clusters-expanded.md"
with open(expanded_path, "w", encoding="utf-8") as f:
    f.write(full_expanded)
print(f"✓ 02-keyword-clusters-expanded.md written")

# ─── Step 5: Write expansion report ─────────────────────────────────────────
total_requests = serp_requests + auto_requests
total_skipped = serp_skipped + auto_skipped

# Cluster stats
cluster_stats = []
for cid, cinfo in SEED_KEYWORDS.items():
    orig_count = len(CLUSTER_ORIGINAL_KEYWORDS[cid])
    paa_count = len(cluster_new_paa[cid])
    rel_count = len(cluster_new_related[cid])
    auto_count = len(cluster_new_auto[cid])
    total_kw = orig_count + paa_count + rel_count + auto_count
    cluster_stats.append({
        "id": cid,
        "name": cinfo["name"],
        "original": orig_count,
        "paa": paa_count,
        "related": rel_count,
        "auto": auto_count,
        "total": total_kw,
    })

# Top 20 PAA questions by frequency (appeared for multiple seed keywords)
from collections import Counter
all_paa_questions = []
for paa_list in paa_data.values():
    for item in paa_list:
        if item["question"]:
            all_paa_questions.append(item["question"])
paa_counter = Counter(all_paa_questions)
top_paa = paa_counter.most_common(20)

# Top 20 Related Searches by frequency
all_related = []
for rel_list in related_data.values():
    all_related.extend(rel_list)
related_counter = Counter(all_related)
top_related = related_counter.most_common(20)

# Top 20 Autocomplete suggestions by frequency
auto_counter = Counter()
for bkw_data in autocomplete_data.values():
    for suggestions in bkw_data.values():
        auto_counter.update(suggestions)
top_auto = auto_counter.most_common(20)

report_lines = [
    "# SerpApi Expansion Report — DataLatte.pro",
    "Generated: 2026-05-14",
    "",
    "## API Usage Summary",
    f"- SERP requests (PAA + Related): {serp_requests}",
    f"- Autocomplete requests: {auto_requests}",
    f"- Total requests used: {total_requests} / 250",
    f"- Skipped (empty/error): {total_skipped}",
    "",
    "## Keywords Added Per Cluster",
    "| Cluster | Original | +PAA | +Related | +Autocomplete | Total |",
    "|---|---|---|---|---|---|",
]

for cs in cluster_stats:
    report_lines.append(
        f"| {cs['id']} — {cs['name']} | {cs['original']} | {cs['paa']} | {cs['related']} | {cs['auto']} | {cs['total']} |"
    )

report_lines += [
    "",
    "## Top 20 New PAA Questions (Highest Priority)",
    "(questions that appeared across multiple keywords = highest priority)",
    "",
]
for q, count in top_paa:
    report_lines.append(f"- [{count}x] {q}")

report_lines += [
    "",
    "## Top 20 New Related Searches",
    "",
]
for q, count in top_related:
    report_lines.append(f"- [{count}x] {q}")

report_lines += [
    "",
    "## Top 20 New Autocomplete Suggestions",
    "",
]
for q, count in top_auto:
    report_lines.append(f"- [{count}x] {q}")

report_path = SEO_DIR / "04-serpapi-expansion-report.md"
with open(report_path, "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines) + "\n")
print(f"✓ 04-serpapi-expansion-report.md written")

# ─── Final summary ────────────────────────────────────────────────────────────
print("\n" + "=" * 70)
print("FINAL SUMMARY")
print("=" * 70)
print(f"SERP requests:        {serp_requests}")
print(f"Autocomplete requests: {auto_requests}")
print(f"Total requests used:  {total_requests} / 250")
print(f"Skipped:              {total_skipped}")
print(f"PAA questions:        {total_paa}")
print(f"Unique related:       {total_related_unique}")
print(f"Unique autocomplete:  {total_auto_unique}")
print(f"\nOutput files written to:")
print(f"  {OUTPUT_DIR}/paa-all.json")
print(f"  {OUTPUT_DIR}/related-searches.json")
print(f"  {OUTPUT_DIR}/autocomplete-expanded.json")
print(f"  {SEO_DIR}/02-keyword-clusters-expanded.md")
print(f"  {SEO_DIR}/04-serpapi-expansion-report.md")
print("Done.")
