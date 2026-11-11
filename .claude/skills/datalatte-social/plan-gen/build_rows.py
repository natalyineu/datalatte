import json, sys, urllib.request, datetime
PLAN = json.load(open('/home/user/datalatte/content-plan/plan-2026-11-23.json'))
STO = 'https://olsxxfwvwsycwzihbmdn.supabase.co/storage/v1/object/public/social-media/'
SITE = 'https://www.datalatte.pro'
TAGS = {
 'holiday': '#holidaymarketing #blackfriday #smallbusiness #localbusiness',
 'sports': '#ctv #streamingads #localmarketing #smallbusiness',
 'ai': '#aisearch #localseo #aiforbusiness #smallbusiness',
 'ads': '#googleads #ppc #localbusiness #smallbusinessmarketing',
 'coffee': '#googlereviews #coffeeshop #localbusiness #smallbusinessmarketing',
 'food': '#restaurantmarketing #ctv #localbusiness #smallbusiness',
 'fitness': '#fitnessstudio #gymmarketing #newyear #smallbusiness',
 'email': '#emailmarketing #smsmarketing #localbusiness #smallbusiness',
 'social': '#socialmedia #smallbusinessmarketing #localbusiness #marketingtips',
}
CTA = {'reel': 'Read the guide', 'card': 'Read the guide', 'carousel': 'Read the guide'}
def utc(date, hh, mm):  # Europe/Warsaw (CET = UTC+1 until late March)
    d = datetime.datetime.fromisoformat(f'{date}T{hh:02d}:{mm:02d}:00') - datetime.timedelta(hours=1)
    return d.strftime('%Y-%m-%dT%H:%M:%SZ')
def link(a, src):
    return f"{SITE}{a['slug']}?utm_source={src}&utm_medium=social&utm_campaign=plan-{a['date']}&utm_content={a['kind']}"
def facts(a):
    if a['kind'] == 'carousel':
        return '\n'.join(f"• {s['big']}: {s['line']} ({s['src']})" for s in a['slides'])
    return f"{a['big']} {a['line']}. Source: {a['src']}."
def media(a):
    d = a['date']
    if a['kind'] == 'reel': return dict(media_url=STO + f'reel-p-{d}.mp4', media_type='video', content_type='reel')
    if a['kind'] == 'card': return dict(media_url=STO + f'card-p-{d}.png', media_type='image', content_type='image')
    n = 2 + len(a['slides'])
    urls = [STO + f'car-p-{d}-{i}.png' for i in range(1, n + 1)]
    return dict(media_url=urls[0], media_type='image', media_urls=urls, content_type='carousel')
def trunc(s, n):
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0] + '…'
rows = []
for a in PLAN:
    d, m = a['date'], media(a)
    base = dict(group_key=f"plan-{d}", **m)
    title = lambda p: f"Plan {d} {a['kind']} {p}: {a['hook']}"
    fb = f"{a['hook']}\n\n{facts(a)}\n\n{a['take']}\n\n{CTA[a['kind']]}:\n{link(a, 'facebook')}"
    ig = f"{a['hook']}\n\n{facts(a)}\n\n{a['take']}\n\n{CTA[a['kind']]}: link in bio 👆\n\n{TAGS[a['theme']]}"
    thr_core = f"{a['hook']} {facts(a).replace(chr(10), ' ')}"
    lk = link(a, 'threads')
    thr = trunc(thr_core, 330) + f" {a['take']}"
    thr = trunc(thr, 360) + f"\n\n{lk}"
    xt = trunc(f"{a['hook']} {facts(a).replace(chr(10), ' ')} {a['take']}", 250) + " Link in profile."
    for p, txt in (('facebook', fb), ('instagram', ig), ('threads', thr)):
        rows.append(dict(platform=p, status='scheduled', title=title(p), content=txt, scheduled_at=utc(d, 12, 0), **base))
    xb = dict(base)
    if a['kind'] == 'carousel': xb.update(media_type='image'); xb.pop('media_urls', None)
    rows.append(dict(platform='twitter', status='scheduled', title=title('twitter'), content=xt, scheduled_at=utc(d, 12, 0), **xb))
    if d >= '2026-12-04':  # Telegram dailies already exist through 03 Dec
        tg = f"{a['hook']}\n\n{facts(a)}\n\n{a['take']}\n\n{CTA[a['kind']]}:\n\n{link(a, 'telegram')}"
        rows.append(dict(platform='telegram', status='scheduled', title=title('telegram'), content=tg, scheduled_at=utc(d, 12, 0), group_key=f"plan-{d}", content_type='link'))
    wd = datetime.date.fromisoformat(d).weekday()
    if wd < 5:  # LinkedIn weekdays, manual publishing (draft)
        li = f"{a['hook']}\n\n{facts(a)}\n\n{a['take']}\n\nGuide in the first comment.\n---COMMENT---\n{CTA[a['kind']]}:\n{link(a, 'linkedin')}"
        rows.append(dict(platform='linkedin', status='draft', title=title('linkedin'), content=li, scheduled_at=utc(d, 12, 5), **{k: v for k, v in base.items() if k != 'media_urls'}))
json.dump(rows, open('rows.json', 'w'))
from collections import Counter
print(len(rows), Counter((r['platform'], r['status']) for r in rows))
mx = max(len(r['content']) for r in rows if r['platform'] == 'threads'); print('max threads len', mx)
mx = max(len(r['content']) for r in rows if r['platform'] == 'twitter'); print('max x len', mx)
if len(sys.argv) > 1:
    req = urllib.request.Request(f'https://olsxxfwvwsycwzihbmdn.supabase.co/functions/v1/plan-insert?token={sys.argv[1]}', data=json.dumps({'rows': rows}).encode(),
        headers={'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sc3h4Znd2d3N5Y3d6aWhibWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzk4MzAsImV4cCI6MjA5NTcxNTgzMH0.kZrQ9Q42wt4eIBU5dtu22jqbg2_GWtPrnsqF8zswbeg', 'Content-Type': 'application/json'})
    try: print(urllib.request.urlopen(req, timeout=120).read().decode())
    except urllib.error.HTTPError as e: print('ERR', e.code, e.read().decode()[:400])
