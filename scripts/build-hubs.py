#!/usr/bin/env python3
"""Group indexable blog posts into pillar hubs (data/hubs.json). Re-run after adding posts. Copy lives in data/hub-copy/<slug>.json."""
import glob, re, json, collections, os
NICHE = {'coffee': ('Coffee Shop', r'coffee|cafe|café|barista|espresso|roaster'), 'salon': ('Hair Salon & Barbershop', r'salon|barber|hair|nail|beauty|spa\b|lash|brow'), 'pet': ('Pet Groomer', r'pet|dog|groom|vet\b|cat\b|kennel'), 'fitness': ('Fitness Studio', r'fitness|gym|yoga|pilates|crossfit|studio|personal-train|boxing')}
TOPIC = [('gbp', r'google-business-profile|gbp|google-maps|google-my-business|map-pack|local-pack|review|reputation|citation'), ('ads', r'google-ads|ppc|adwords|keyword|search-ads|lsa|local-services-ads'), ('social', r'instagram|facebook|meta-ads|tiktok|social|reels|pinterest|snapchat|youtube|influencer|nextdoor'), ('email', r'email|sms|newsletter|loyalty|whatsapp'), ('seo', r'seo|website|landing|schema|backlink|content|blog|conversion|cro'), ('ai', r'(^|-)ai(-|$)|chatbot|automation|agent|chatgpt')]
TOPIC_LABEL = {'maps-seo': 'Google Maps & Local SEO', 'ads': 'Google Ads', 'social': 'Social Media & Meta Ads', 'email': 'Email, SMS & Loyalty', 'ai': 'AI & Automation', 'guide': 'Marketing'}
def grp(t): return 'maps-seo' if t in ('gbp', 'seo') else t
posts = []
for f in glob.glob('content/blog/*.mdx'):
    fm = open(f, encoding='utf-8').read().split('---', 2)[1]
    if re.search(r'^noindex:\s*true', fm, re.M): continue
    g = lambda k: (re.search(rf'^{k}:\s*"?(.*?)"?\s*$', fm, re.M) or [None, ''])[1]
    posts.append(dict(s=f.split('/')[-1][:-4], cat=g('category'), date=g('date')))
imp = {}
try:
    for x in json.load(open('data/analytics/gsc-latest.json')).get('pages', []): imp[x['keys'][0].rsplit('/', 1)[-1]] = x['impressions']
except Exception: pass
raw = collections.defaultdict(list)
for p in posts:
    s = p['s']
    if re.match(r'(local-marketing-.*-small-business-2026|small-business-marketing-[a-z-]+-2026)$', s) or re.match(r'(dooh-|ctv-advertising-.*-guide$)', s) and False: continue
    if re.search(r'ctv|connected-tv|streaming', s): raw['topic:ctv'].append(p); continue
    if re.search(r'dooh|digital-out-of-home|billboard', s): raw['topic:dooh'].append(p); continue
    if re.search(r'programmatic|dsp|spotify|podcast|audio|pandora|iheart|display', s): raw['topic:programmatic'].append(p); continue
    n = next((k for k, (_, rx) in NICHE.items() if re.search(rx, s)), None)
    t = next((k for k, rx in TOPIC if re.search(rx, s)), 'general')
    if n: raw[f'{n}:{grp(t) if t != "general" else "guide"}'].append(p)
    else: raw[f'topic:{grp(t) if t != "general" else "strategy"}'].append(p)
MIN = 8
final = collections.defaultdict(list)
for k, v in raw.items():
    if k.startswith(('coffee:', 'salon:', 'pet:', 'fitness:')) and len(v) < MIN: final[k.split(':')[0] + ':guide'] += v
    else: final[k] += v
hubs = []
for k, v in final.items():
    kind, name = k.split(':')
    v.sort(key=lambda p: p['date'], reverse=True); v.sort(key=lambda p: -imp.get(p['s'], 0))
    if kind in NICHE:
        label = NICHE[kind][0]
        slug = f'{kind}-{name}' if name != 'guide' else f'{kind}-marketing'
        title = f'{label} Marketing: Complete Guide' if name == 'guide' else f'{label} {TOPIC_LABEL[name]}: Complete Guide'
        niche = kind
    else:
        names = {'ctv': 'Connected TV (CTV) Advertising', 'dooh': 'Digital Out-of-Home (DOOH) Advertising', 'programmatic': 'Programmatic & Audio Advertising', 'maps-seo': 'Local SEO & Google Business Profile', 'ads': 'Google Ads', 'social': 'Social Media & Meta Ads', 'email': 'Email & SMS Marketing', 'ai': 'AI & Marketing Automation', 'strategy': 'Local Marketing Strategy'}
        slug = f'{name}-guide' if kind == 'topic' else name; slug = {'ctv-guide': 'ctv-advertising-guide', 'dooh-guide': 'dooh-advertising-guide', 'programmatic-guide': 'programmatic-advertising-guide', 'maps-seo-guide': 'local-seo-guide', 'ads-guide': 'google-ads-guide', 'social-guide': 'social-media-marketing-guide', 'email-guide': 'email-sms-marketing-guide', 'ai-guide': 'ai-marketing-automation-guide', 'strategy-guide': 'local-marketing-strategy-guide'}.get(slug, slug)
        title = f'{names[name]}: Complete Guide for Local Businesses'; niche = None
    hubs.append(dict(slug=slug, title=title, niche=niche, count=len(v), posts=[p['s'] for p in v]))
hubs.sort(key=lambda h: -h['count'])
json.dump(hubs, open('data/hubs.json', 'w'), indent=1)
print(len(hubs), sum(h['count'] for h in hubs))
for h in hubs: print(h['slug'], h['count'])
