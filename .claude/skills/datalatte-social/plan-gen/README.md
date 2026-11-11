# Content plan generator

- `content-plan/plan-YYYY-MM-DD.json`: atoms (date, kind reel|card|carousel, theme, hook, big, line, src, take, slug)
- `gen7.js`: renders reels (Playwright + ffmpeg), 4:5 cards, carousel slides into ./out (needs ./audio.py)
- `audio.py`: synthesized music + SFX
- `build_rows.py [token]`: builds per-platform posts (FB/IG/Threads/X/Telegram scheduled, LinkedIn draft) and POSTs to edge function plan-insert with a one-time token (social_settings.insert_token)
- Upload media to bucket social-media (temporary anon insert policy), run build_rows.py.
