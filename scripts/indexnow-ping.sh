#!/bin/bash
# Ping IndexNow API to speed up indexing of new/updated pages
# Run this after each deployment

KEY="YOUR_INDEXNOW_KEY"
HOST="datalatte.pro"
KEY_LOCATION="https://datalatte.pro/${KEY}.txt"

# Build URL list from sitemap
URLS=$(curl -s "https://datalatte.pro/sitemap.xml" | grep -oP '(?<=<loc>)[^<]+' | head -100)

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"${KEY_LOCATION}\",
    \"urlList\": [$(echo "$URLS" | sed 's/.*/"&"/' | paste -sd,)]
  }"

echo "IndexNow ping sent for ${HOST}"
