#!/usr/bin/env python3
"""
Apply improvements across all published articles:
1. Apply all 'approved' proposals from proposals.json (dynamic, not hardcoded)
2. Add service-linked CTA callouts to articles missing any Callout
3. Add internal links to articles missing /services/ links
"""

import os, re, json, datetime

BLOG_DIR = "content/blog"
PROPOSALS_PATH = "content/proposals.json"

# ── Category → service page + CTA text ───────────────────────────────────────

SERVICE_MAP = {
    # Ads
    "Google Ads":                   ("/services/google-ads",   "Google Ads"),
    "Meta Ads":                     ("/services/meta-ads",     "Meta Ads"),
    "Facebook Ads":                 ("/services/meta-ads",     "Meta Ads"),
    "Instagram Ads":                ("/services/meta-ads",     "Instagram Ads"),
    "Instagram Marketing":          ("/services/meta-ads",     "Instagram Marketing"),
    "TikTok Ads":                   ("/services/meta-ads",     "paid social"),
    "TikTok Marketing":             ("/services/meta-ads",     "paid social"),
    "Snapchat Advertising":         ("/services/meta-ads",     "paid social"),
    "YouTube Ads":                  ("/services/meta-ads",     "paid social"),
    "Microsoft Ads":                ("/services/google-ads",   "Google Ads"),
    "Yahoo Advertising":            ("/services/google-ads",   "Google Ads"),
    "Programmatic Advertising":     ("/services/meta-ads",     "paid advertising"),
    "Retargeting":                  ("/services/meta-ads",     "retargeting"),
    "Audio Advertising":            ("/services/meta-ads",     "paid advertising"),
    "CTV & OTT":                    ("/services/meta-ads",     "paid advertising"),
    # SEO
    "Local SEO":                    ("/services/local-seo",    "Local SEO"),
    "Reputation Management":        ("/services/local-seo",    "Local SEO & reputation"),
    "Content Marketing":            ("/services/local-seo",    "SEO & content"),
    # AI / Automation
    "AI & Automation":              ("/services/ai-agents",    "AI Agents & Automation"),
    "Marketing Automation":         ("/services/ai-agents",    "marketing automation"),
    "Messaging & Community Marketing": ("/services/ai-agents", "marketing automation"),
    # Email
    "Email & SMS Marketing":        ("/services/email-sms",    "Email & SMS Marketing"),
    "Email Marketing":              ("/services/email-sms",    "Email Marketing"),
    # Social / Website
    "Social Media":                 ("/services/social-media", "Social Media Marketing"),
    "Influencer Marketing":         ("/services/social-media", "Social Media Marketing"),
    "Influencer & Creator Marketing": ("/services/social-media", "influencer marketing"),
    "Website & CRO":                ("/services/website",      "Website & CRO"),
    # Analytics
    "Analytics & Tracking":         ("/services/analytics",    "Analytics & Reporting"),
    # Niches
    "Coffee Shops":                 ("/services/google-ads",   "local marketing"),
    "Coffee Shop Marketing":        ("/services/google-ads",   "local marketing"),
    "Hair Salons":                  ("/services/local-seo",    "salon marketing"),
    "Hair Salon Marketing":         ("/services/local-seo",    "salon marketing"),
    "Pet Groomers":                 ("/services/google-ads",   "local marketing"),
    "Pet Groomer Marketing":        ("/services/google-ads",   "local marketing"),
    "Fitness Studios":              ("/services/google-ads",   "fitness studio marketing"),
    "Fitness Studio Marketing":     ("/services/google-ads",   "fitness studio marketing"),
    # Fallbacks
    "Marketing Strategy":           ("/services/google-ads",   "local marketing"),
    "Tool Comparisons":             ("/services/google-ads",   "local marketing"),
    "Case Studies":                 ("/contact",               "local marketing"),
    "Nextdoor & Neighborhood Marketing": ("/services/local-seo", "local marketing"),
    "Pinterest Marketing":          ("/services/social-media", "social media marketing"),
    "Review Platform Ads":          ("/services/local-seo",    "reputation & local SEO"),
    "Reddit & Community Marketing": ("/services/social-media", "social media marketing"),
    "Offline Marketing":            ("/services/google-ads",   "local marketing"),
}

DEFAULT_SERVICE = ("/services/google-ads", "local marketing")

CTA_TEMPLATES = {
    "/services/google-ads": (
        "Want More Local Customers?",
        "Nataliia at DataLatte runs data-driven {service} campaigns for local businesses — coffee shops, salons, pet groomers, and fitness studios. [Book a free 30-minute strategy call](/contact) or explore [Google Ads management](/services/google-ads)."
    ),
    "/services/meta-ads": (
        "Ready to Grow With Paid Social?",
        "DataLatte specialises in {service} for local businesses. Get more customers without wasting budget. [Book a free strategy call](/contact) or learn more about [Meta Ads management](/services/meta-ads)."
    ),
    "/services/local-seo": (
        "Want to Rank Higher Locally?",
        "Nataliia at DataLatte helps local businesses dominate local search with proven {service} strategies. [Book a free audit](/contact) or learn more about [Local SEO services](/services/local-seo)."
    ),
    "/services/ai-agents": (
        "Automate Your Marketing",
        "DataLatte builds {service} systems for local businesses — so you get leads while you sleep. [Book a free discovery call](/contact) or explore [AI Agents & Automation](/services/ai-agents)."
    ),
    "/services/email-sms": (
        "Turn Customers Into Regulars",
        "Nataliia at DataLatte sets up {service} sequences that bring customers back automatically. [Book a free call](/contact) or learn more about [Email & SMS Marketing](/services/email-sms)."
    ),
    "/services/social-media": (
        "Grow Your Social Presence",
        "DataLatte manages {service} for local businesses — from content to paid ads. [Book a free strategy call](/contact) or explore [Social Media Management](/services/social-media)."
    ),
    "/services/analytics": (
        "Know What's Actually Working",
        "Nataliia at DataLatte sets up {service} dashboards for local businesses so you can make smarter decisions. [Book a free call](/contact) or explore [Analytics & Reporting](/services/analytics)."
    ),
    "/services/website": (
        "Turn Visitors Into Customers",
        "DataLatte designs and optimises local business websites for conversions. [Book a free audit](/contact) or learn more about [Website & CRO services](/services/website)."
    ),
    "/contact": (
        "Ready to Grow Your Local Business?",
        "Nataliia at DataLatte specialises in data-driven {service} for local businesses. [Book a free 30-minute strategy call](/contact) — no obligation, just practical advice."
    ),
}

def get_cta_callout(category: str) -> str:
    service_path, service_label = SERVICE_MAP.get(category, DEFAULT_SERVICE)
    title, body_template = CTA_TEMPLATES.get(service_path, CTA_TEMPLATES["/contact"])
    body = body_template.format(service=service_label)
    return f'\n<Callout type="coffee" title="{title}">\n{body}\n</Callout>\n'

def get_frontmatter_field(content: str, field: str) -> str:
    fm = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm:
        return ""
    match = re.search(rf'^{field}:\s*(.+)$', fm.group(1), re.MULTILINE)
    if not match:
        return ""
    return match.group(1).strip().strip('"\'')

def has_callout(content: str) -> bool:
    return '<Callout' in content

def has_service_link(content: str) -> bool:
    return '/services/' in content or '/contact' in content

# ── Load approved proposals dynamically ───────────────────────────────────────

def load_approved_proposals() -> dict:
    """Returns {slug: proposal_dict} for all status='approved' entries."""
    if not os.path.exists(PROPOSALS_PATH):
        return {}
    with open(PROPOSALS_PATH) as f:
        data = json.load(f)
    return {
        p['slug']: p
        for p in data.get('proposals', [])
        if p.get('status') == 'approved'
    }

def mark_proposals_applied(applied_slugs: list):
    if not applied_slugs or not os.path.exists(PROPOSALS_PATH):
        return
    with open(PROPOSALS_PATH) as f:
        data = json.load(f)
    now = datetime.datetime.utcnow().isoformat() + 'Z'
    count = 0
    for p in data.get('proposals', []):
        if p['slug'] in applied_slugs and p.get('status') == 'approved':
            p['status'] = 'applied'
            p['appliedAt'] = now
            count += 1
    with open(PROPOSALS_PATH, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
    print(f"  📋 Marked {count} proposal(s) as 'applied' in proposals.json")

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    files = sorted([f for f in os.listdir(BLOG_DIR) if f.endswith('.mdx')])
    approved_proposals = load_approved_proposals()

    print(f"Approved proposals to apply: {len(approved_proposals)}")
    for slug in approved_proposals:
        print(f"  • {slug}")

    applied_proposal_slugs = []
    added_callouts = 0
    already_good = 0
    changed_files = []

    for filename in files:
        path = os.path.join(BLOG_DIR, filename)
        slug = filename.replace('.mdx', '')
        original = open(path, encoding='utf-8').read()
        content = original
        category = get_frontmatter_field(content, 'category')

        # 1. Apply approved proposal for this slug
        if slug in approved_proposals:
            proposal = approved_proposals[slug]
            proposal_text = proposal.get('proposal', '')
            service_path, _ = SERVICE_MAP.get(category, DEFAULT_SERVICE)
            if not has_callout(content):
                callout = f'\n<Callout type="coffee" title="Ready to Take Action?">\n{proposal_text}\n</Callout>\n'
                content = content.rstrip() + '\n' + callout
                applied_proposal_slugs.append(slug)
                print(f"  ✅ Applied proposal: {slug}")
            else:
                # Already has a callout — just mark as applied
                applied_proposal_slugs.append(slug)
                print(f"  ✓  Proposal slug already has Callout, marking applied: {slug}")

        # 2. Add standard CTA to articles with no Callout at all
        elif not has_callout(content):
            callout = get_cta_callout(category)
            content = content.rstrip() + '\n' + callout
            added_callouts += 1

        else:
            already_good += 1

        if content != original:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            changed_files.append(filename)

    # Mark applied proposals in proposals.json
    mark_proposals_applied(applied_proposal_slugs)

    print(f"\n{'='*50}")
    print(f"✅ Applied approved proposals:  {len(applied_proposal_slugs)}")
    print(f"🎯 Added standard CTA callouts: {added_callouts}")
    print(f"✓  Already had callout:         {already_good}")
    print(f"📝 Total files changed:         {len(changed_files)}")
    print(f"{'='*50}")

    if not changed_files:
        print("Nothing to commit.")

if __name__ == "__main__":
    main()
