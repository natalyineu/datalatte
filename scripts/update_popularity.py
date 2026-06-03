#!/usr/bin/env python3
"""
Fetch blog post click counts from GSC and write content/blog/popularity.json.
Run locally: python3 scripts/update_popularity.py
CI: set GOOGLE_TOKEN_JSON env var with the contents of google_token.json
"""

import json
import os
import sys
import warnings
warnings.filterwarnings("ignore")

from datetime import date, timedelta
from pathlib import Path

# ── Config ───────────────────────────────────────────────────────────────────
SITE_URL    = os.environ.get("GSC_SITE_URL", "sc-domain:datalatte.pro")
DAYS        = 28
TOKEN_FILE  = Path(__file__).parent / "google_token.json"
OUTPUT_FILE = Path(__file__).parent.parent / "content" / "blog" / "popularity.json"

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

END_DATE   = date.today()
START_DATE = END_DATE - timedelta(days=DAYS - 1)


# ── Auth ─────────────────────────────────────────────────────────────────────
def get_credentials():
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    from google_auth_oauthlib.flow import Flow

    # CI: read token from env var
    token_json = os.environ.get("GOOGLE_TOKEN_JSON")
    if token_json:
        TOKEN_FILE.write_text(token_json)

    if not TOKEN_FILE.exists():
        print("ERROR: No google_token.json found. Run gsc_ga_report.py first to authorize.")
        sys.exit(1)

    creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            print("Refreshing access token...")
            creds.refresh(Request())
            TOKEN_FILE.write_text(creds.to_json())
        else:
            print("ERROR: Token is invalid and cannot be refreshed. Re-authorize via gsc_ga_report.py.")
            sys.exit(1)

    return creds


# ── GSC fetch ────────────────────────────────────────────────────────────────
def fetch_all_blog_clicks(creds) -> dict[str, int]:
    """Return {slug: clicks} for all /blog/* pages in the last DAYS days."""
    from googleapiclient.discovery import build

    service = build("searchconsole", "v1", credentials=creds)

    clicks_by_slug: dict[str, int] = {}
    start_row = 0
    row_limit  = 25_000

    while True:
        body = {
            "startDate": START_DATE.isoformat(),
            "endDate":   END_DATE.isoformat(),
            "dimensions": ["page"],
            "dimensionFilterGroups": [{
                "filters": [{
                    "dimension": "page",
                    "operator": "contains",
                    "expression": "/blog/",
                }]
            }],
            "rowLimit":   row_limit,
            "startRow":   start_row,
        }
        resp = service.searchanalytics().query(siteUrl=SITE_URL, body=body).execute()
        rows = resp.get("rows", [])
        if not rows:
            break

        for row in rows:
            url    = row["keys"][0]           # e.g. https://datalatte.pro/blog/some-slug
            clicks = int(row.get("clicks", 0))
            if clicks == 0:
                continue
            # Extract slug from URL
            parts = url.rstrip("/").split("/blog/")
            if len(parts) == 2 and parts[1]:
                slug = parts[1].split("/")[0]  # drop any sub-path
                clicks_by_slug[slug] = clicks_by_slug.get(slug, 0) + clicks

        if len(rows) < row_limit:
            break  # last page
        start_row += row_limit

    return clicks_by_slug


# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print(f"Fetching GSC data: {START_DATE} → {END_DATE} ({DAYS} days)...")
    creds = get_credentials()
    clicks = fetch_all_blog_clicks(creds)

    if not clicks:
        print("WARNING: No click data returned. Check GSC access or date range.")
        sys.exit(0)

    # Sort by clicks desc for human-readable output
    sorted_clicks = dict(sorted(clicks.items(), key=lambda x: x[1], reverse=True))

    OUTPUT_FILE.write_text(json.dumps(sorted_clicks, indent=2))
    print(f"Saved {len(sorted_clicks)} posts to {OUTPUT_FILE}")
    print(f"Top 10:")
    for slug, n in list(sorted_clicks.items())[:10]:
        print(f"  {n:>6} clicks  {slug}")


if __name__ == "__main__":
    main()
