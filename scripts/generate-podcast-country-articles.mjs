#!/usr/bin/env node
/**
 * generate-podcast-country-articles.mjs
 * Generates podcast advertising guides for UK, Australia, Canada, Ireland, New Zealand.
 * Usage: node scripts/generate-podcast-country-articles.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, '../content/blog');
const DRY_RUN = process.argv.includes('--dry-run');
let written = 0, skipped = 0;

function emit(slug, content) {
  const out = path.join(CONTENT, `${slug}.mdx`);
  if (fs.existsSync(out)) { skipped++; return; }
  if (DRY_RUN) { console.log(`[dry] ${slug}`); written++; return; }
  fs.writeFileSync(out, content, 'utf8');
  console.log(`[ok]  ${slug}`);
  written++;
}

const COUNTRIES = [
  {
    name: 'United Kingdom',
    short: 'UK',
    slug: 'uk',
    currency: 'GBP',
    cpmSymbol: '£',
    cpmRange: '£8–£22',
    listeners: '21M',
    weeklyListeners: '47%',
    avgEpisodes: '7.5',
    platforms: [
      { name: 'Spotify', detail: 'Largest podcast platform in the UK with 10M+ active podcast listeners. Self-serve programmatic ads available through Spotify Audience Network. CPMs: £10–£18. Demographic targeting by age, gender, and genre. Most UK podcasters now use Spotify as primary publishing platform.', cpm: '£10–£18' },
      { name: 'Apple Podcasts', detail: 'Second-largest platform in the UK. No programmatic ads — requires direct sponsorship agreements with individual podcast producers. Best for brands targeting premium professional audiences (BBC Sounds crossover, business podcasts). Host-read ads perform best.', cpm: 'Direct deal' },
      { name: 'BBC Sounds', detail: 'BBC\'s audio streaming platform — one of the most listened-to podcast apps in the UK due to brand trust. BBC does not accept external advertising on Sounds. However, BBC-affiliated podcast producers (independent productions commissioned by BBC) can run pre/post-roll on their own Spotify or Apple Podcasts feeds.', cpm: 'N/A (no ads)' },
      { name: 'Acast', detail: 'Stockholm-based platform with extremely strong UK presence — hosts many of the UK\'s top commercial podcasts (No Such Thing as a Fish, The Receipts, My Dad Wrote a Porno). Self-serve ad platform available with UK geo-targeting. CPMs: £12–£22 for targeted UK audiences.', cpm: '£12–£22' },
      { name: 'Global Player / DAX', detail: 'Global Radio\'s streaming app and its DAX (Digital Audio Exchange) programmatic platform covers podcast, streaming radio, and smart speaker inventory across the UK. Strong for local advertisers wanting to reach UK radio + podcast audiences together. CPMs: £8–£16.', cpm: '£8–£16' },
    ],
    localVsNational: 'UK podcast advertising is primarily a national medium — postcode-level targeting is not available on most platforms. For local UK businesses (a London café, an Edinburgh salon), podcast advertising works best for building brand awareness in a broad regional area (London, Scotland, North of England) rather than precise neighbourhood targeting. London-based small businesses get the best ROI from podcast ads because the Greater London audience (9M listeners) is large enough to reach meaningful customer volumes.',
    niches: [
      { biz: 'Coffee shops / cafés', strategy: 'Sponsor UK food and lifestyle podcasts (The Kitchen Cabinet, Dish, Sorted Food Podcast). Host-read ads on local foodie and commuter-focused shows. Emphasise regional identity ("East London\'s best espresso," "Manchester\'s favourite indie café"). Target morning commute listening slots.' },
      { biz: 'Hair salons / beauty', strategy: 'Sponsor beauty and wellness podcasts (Glow Job, The Beauty Conversation). Acast has strong UK beauty podcast inventory. 30-second mid-roll ads perform best — listeners are often getting ready while listening. Target female 25–44 on beauty and lifestyle genres.' },
      { biz: 'Pet groomers', strategy: 'Sponsor UK pet and animal podcasts (All Creatures, My Doggy Says). Niche targeting; lower CPMs. Pet owner household targeting on Spotify Audience Network. Strong seasonal campaigns around summer holiday pet care.' },
      { biz: 'Fitness studios / gyms', strategy: 'Sponsor fitness, running, and wellbeing podcasts (Run Mummy Run, The Fit Frenzy). January is the UK\'s highest podcast fitness advertising moment. Spotify Audience Network sports and fitness genre; Acast fitness publisher network.' },
    ],
    seasonality: 'January (New Year fitness and wellbeing push) is the UK\'s highest-ROI podcast advertising window for health, beauty, and lifestyle businesses. September (back-to-school and "back to routine" mindset) is a strong secondary window. The UK commuter podcast audience is significant — morning (7–9am) and evening (5–7pm) are peak listening times on workdays.',
    legal: 'The Advertising Standards Authority (ASA) and the Code of Broadcast Advertising (BCAP) apply to UK podcast ads. Sponsored content must be clearly labelled as advertising. Health claims require substantiation. Financial services advertising has additional FCA requirements. For most local small businesses (cafés, salons, gyms), standard ASA guidelines apply — avoid unsubstantiated superlatives ("best in London") without evidence.',
    budgetIntro: 'Minimum meaningful UK podcast campaign: £600–£800/month. This delivers approximately 40,000–80,000 targeted impressions on Spotify Audience Network or Acast with UK geo-targeting.',
    budgets: [
      { label: 'Trial (4 weeks)', amount: '£600–£900', desc: 'Spotify Audience Network or Acast UK; single genre or demographic target; tests audience response' },
      { label: 'Core campaign (3 months)', amount: '£900–£1,800/month', desc: 'Multi-platform (Spotify + Acast); genre + demographic targeting; host-read deal on one relevant podcast' },
      { label: 'Seasonal burst', amount: '£1,500–£3,000', desc: '4–6 week January or September push; maximises New Year or back-to-school windows' },
    ],
    faq: [
      { q: 'Can I target listeners in a specific UK city?', a: 'Partial city targeting is available on Spotify Audience Network and Acast — you can select England, Scotland, Wales, or Northern Ireland, and some platforms allow broad city-region targeting (London, Manchester, Birmingham). True postcode-level targeting is not available in UK podcast advertising. For hyper-local reach, combine podcast ads with local DOOH or Meta Ads.' },
      { q: 'Are host-read ads better than programmatic?', a: 'Host-read ads (where the podcast host personally endorses your business) consistently outperform programmatic insertion for conversion rate — studies show 3–5x higher recall for host-read versus standard pre-roll. However, they require direct deals with producers, typically cost £200–£800 per episode depending on audience size, and have longer lead times. For local businesses new to podcast advertising, start with programmatic to test the channel, then graduate to host-read deals on podcasts with proven audiences in your category.' },
      { q: 'What is the minimum budget to run podcast ads in the UK?', a: 'Spotify Audience Network and Acast both accept campaign starts from £500–£750 (approximately $600–$900 USD equivalent). This delivers 30,000–60,000 impressions. Below this threshold, the campaign is too small to generate meaningful data. For host-read deals, minimum is typically £150–£300 per episode.' },
    ],
  },
  {
    name: 'Australia',
    short: 'AU',
    slug: 'australia',
    currency: 'AUD',
    cpmSymbol: 'A$',
    cpmRange: 'A$12–A$30',
    listeners: '9.5M',
    weeklyListeners: '43%',
    avgEpisodes: '7.1',
    platforms: [
      { name: 'Spotify', detail: 'Dominant podcast platform in Australia. Spotify Audience Network available for programmatic podcast advertising with Australian geo-targeting. CPMs: A$14–A$22. Strong reach among under-40 urban audiences. Postcode-level targeting not available but state/metro area targeting is.', cpm: 'A$14–A$22' },
      { name: 'Apple Podcasts', detail: 'Second-largest platform; no programmatic ads. Direct sponsorship only. Australian podcast landscape has many Apple-primary publishers. For premium content adjacency, direct deals with Australian producer networks (Audioboom Australia, ARN/iHeartRadio) are the path.', cpm: 'Direct deal' },
      { name: 'iHeartRadio Australia (ARN)', detail: 'Australian Radio Network\'s streaming platform — covers both traditional radio streaming and podcast content. Strong for businesses wanting to reach metro-area radio + podcast audiences together. Programmatic through ARN Digital Audio. CPMs: A$12–A$20.', cpm: 'A$12–A$20' },
      { name: 'LiSTNR (SCA)', detail: 'Southern Cross Austereo\'s audio platform — covers Hit Network, Triple M, and podcast content. Strong for reaching Australian regional markets beyond Sydney and Melbourne. CPMs: A$10–A$18. Good for businesses targeting Brisbane, Adelaide, and Perth.', cpm: 'A$10–A$18' },
      { name: 'ABC Listen', detail: 'ABC\'s podcast and radio platform; reaches ABC\'s engaged, educated, left-leaning audience. ABC does not accept commercial advertising. However, podcasters who publish via ABC (independent producers, Schwartz Media) may have separate advertising arrangements through their own feeds on Spotify/Apple.', cpm: 'N/A (no ads)' },
    ],
    localVsNational: 'Australian podcast advertising is predominantly a capital city medium. Sydney (5M) and Melbourne (5M) dominate podcast listener demographics. For a Sydney café or Melbourne salon, state-level targeting on Spotify or ARN/LiSTNR delivers a meaningful local audience. Perth businesses benefit from lower CPMs and lower competition — Perth audiences are significantly underserved by sophisticated podcast advertisers, creating strong first-mover conditions.',
    niches: [
      { biz: 'Coffee shops / cafés', strategy: 'Sponsor Australian food and culture podcasts (Dish, The Cook Up with Adam Liaw Podcast, A Table For Two). Breakfast and commute listening is high — morning slot targeting. Café culture is a central Australian social institution; podcast audiences over-index for café visitors.' },
      { biz: 'Hair salons / beauty', strategy: 'Spotify Audience Network female 25–44 in beauty/fashion genre. Australian beauty podcast inventory is growing fast (Get It Girl, The Beauty IQ Podcast). Host-read deals on lifestyle podcasts deliver strong conversion for appointment-based businesses.' },
      { biz: 'Pet groomers', strategy: 'Australia has one of the world\'s highest pet ownership rates (69% of households). Sponsor pet and animal podcasts. Spotify audience segments: "pet owner households." Summer grooming campaigns (October–December) before beach season.' },
      { biz: 'Fitness studios', strategy: 'January and February are peak fitness podcast advertising windows in Australia — New Year + approaching summer creates strong demand for fitness brands. Kayo Sports (streaming) and fitness podcast adjacency. Sponsor Australian running and wellness shows (Health Code, Wellness Uncovered).' },
    ],
    seasonality: 'Australia\'s podcast seasonality is the inverse of northern hemisphere markets. January–February (summer peak) is the highest fitness and wellness advertising window — New Year resolutions + approaching summer drives strong intent for gym and health services. April–June (autumn) sees strong general podcast consumption as people shift indoors. The AFL and NRL football seasons (March–September) drive strong sports podcast engagement for Kayo-adjacent advertisers.',
    legal: 'The Australian Association of National Advertisers (AANA) Code of Ethics applies to podcast advertising. Sponsored content must be clearly identified as advertising. The Therapeutic Goods Administration (TGA) has specific rules for health claims — avoid unsubstantiated health benefit claims for fitness studios (no "cure" or "treat" language). The Australian Privacy Act governs audience data use in programmatic targeting — Australian podcast platforms comply with APP (Australian Privacy Principles).',
    budgetIntro: 'Minimum meaningful Australian podcast campaign: A$700–A$1,000/month. This delivers 35,000–70,000 impressions with state-level geo-targeting.',
    budgets: [
      { label: 'Trial (4 weeks)', amount: 'A$700–A$1,000', desc: 'Spotify Audience Network or ARN; state-level targeting; tests channel effectiveness' },
      { label: 'Core campaign (3 months)', amount: 'A$1,000–A$2,000/month', desc: 'Multi-platform (Spotify + LiSTNR); genre + demographic targeting; host-read deal on one Australian lifestyle podcast' },
      { label: 'Seasonal burst', amount: 'A$1,800–A$4,000', desc: '4–6 week January summer push or pre-Christmas November–December window' },
    ],
    faq: [
      { q: 'Which Australian podcast platform should I start with?', a: 'Start with Spotify Audience Network for programmatic campaigns — it has the widest reach and self-serve access with no minimum beyond A$500. For host-read deals, contact ARN (iHeartRadio) or SCA (LiSTNR) who represent many of Australia\'s top commercial podcast producers. If your target audience is educated, urban professionals, consider Schwartz Media\'s The Saturday Paper podcast network (direct deal required).' },
      { q: 'Can I target Sydney or Melbourne specifically?', a: 'State-level targeting (NSW for Sydney, VIC for Melbourne) is available on most platforms and effectively captures metropolitan audiences since 70%+ of NSW and VIC populations are in the capital cities. True suburb-level targeting is not available in Australian podcast advertising.' },
      { q: 'Is podcast advertising worth it for a small business in Perth or Adelaide?', a: 'Yes — Perth and Adelaide are significantly underserved by sophisticated podcast advertisers. CPMs in LiSTNR regional markets are 20–30% below Sydney/Melbourne rates. A Perth salon or Adelaide café running consistent podcast ads will achieve stronger brand recall than the same budget in Sydney, because competition from other local advertisers is much lower.' },
    ],
  },
  {
    name: 'Canada',
    short: 'CA',
    slug: 'canada',
    currency: 'CAD',
    cpmSymbol: 'C$',
    cpmRange: 'C$12–C$28',
    listeners: '11M',
    weeklyListeners: '41%',
    avgEpisodes: '6.8',
    platforms: [
      { name: 'Spotify', detail: 'Largest podcast platform in Canada. Spotify Audience Network available with Canadian geo-targeting (province-level: Ontario, BC, Quebec, Alberta). CPMs: C$14–C$22. French-language targeting available for Quebec — Spotify has French-language genre and audience segments. Strong reach among 18–44 urban Canadians.', cpm: 'C$14–C$22' },
      { name: 'Apple Podcasts', detail: 'Second-largest platform in Canada; no programmatic. Direct sponsorship with Canadian producers. For French-language Canadian businesses, Apple Podcasts hosts many Quebec-produced shows that run host-read deals directly.', cpm: 'Direct deal' },
      { name: 'CBC Listen', detail: 'CBC Radio One and CBC Podcasts streaming platform. CBC is one of Canada\'s most trusted media brands. CBC does not accept commercial advertising. However, CBC-produced podcasts (The Current, White Coat Black Art, Under the Influence) have enormous reach — host-read sponsorships with CBC independently produced shows are sometimes available.', cpm: 'N/A (CBC is ad-free)' },
      { name: 'iHeartRadio Canada (Stingray)', detail: 'Covers both radio streaming and podcasts across Canadian markets. Strong for reaching Toronto, Montreal, and Calgary audiences across radio + podcast together. CPMs: C$12–C$20.', cpm: 'C$12–C$20' },
      { name: 'Acast (Canadian inventory)', detail: 'Acast hosts several major Canadian podcast producers and allows Canadian geo-targeting. Strong for reaching Canada\'s educated, urban professional demographic. CPMs: C$14–C$24 for targeted Canadian audiences.', cpm: 'C$14–C$24' },
    ],
    localVsNational: 'Canadian podcast advertising is heavily concentrated in Toronto (Ontario), Vancouver (BC), and Montreal (Quebec). Province-level targeting is the most granular widely available option. For Toronto small businesses, Ontario targeting effectively captures the GTA (6M people). For Vancouver businesses, BC targeting delivers the Lower Mainland audience. Quebec requires a bilingual or French-language approach — Quebec audiences respond significantly better to French-language creative.',
    niches: [
      { biz: 'Coffee shops / cafés', strategy: 'Sponsor Canadian food and culture podcasts (Dead Ringer, Cheap Eats, The Dished Vancouver Podcast). Canadian café culture is strong in Toronto, Vancouver, and Montreal. Morning commute targeting on Spotify; transit commuter audience in Toronto is one of the highest podcast listening audiences in North America.' },
      { biz: 'Hair salons / beauty', strategy: 'Spotify Audience Network female 25–44 in beauty/lifestyle genre. Canadian beauty podcast landscape is growing (The F Word, Glam & Go). Host-read deals on Canadian women\'s lifestyle podcasts convert well for appointment-based services.' },
      { biz: 'Pet groomers', strategy: 'Canadian pet ownership rate is 57% of households. Spotify "pet owner" audience segments. Seasonal: summer grooming (May–August) and winter coat maintenance (October–December).' },
      { biz: 'Fitness studios', strategy: 'January is peak; February\'s "post-resolution" window is also strong in Canada. Sponsor Canadian running and wellness podcasts (The Running Podcast, The Ali Levine Show). Ontario and BC fitness audiences are above average for podcast listenership.' },
    ],
    seasonality: 'Canadian podcast seasonality is strongly driven by extreme winters. November–March sees peak CTV and podcast consumption as Canadians spend significantly more time indoors. January is the strongest advertising window for health, fitness, and wellness businesses. Summer (June–August) sees a moderate dip in podcast consumption in most major cities. Hockey season (October–April) drives strong sports podcast engagement — NHL podcast advertising is a significant Canadian category.',
    legal: 'The Advertising Standards Canada (ASC) Code applies to Canadian podcast advertising. Bilingual advertising requirements apply in federal contexts and in Quebec under the Charter of the French Language — for businesses operating in Quebec, French-language creative is legally required for provincial advertising and is strongly recommended for audience receptivity. CASL (Canadian Anti-Spam Legislation) governs email follow-up from podcast leads but does not directly affect podcast ad content.',
    budgetIntro: 'Minimum meaningful Canadian podcast campaign: C$700–C$1,000/month. This delivers 35,000–65,000 impressions with province-level geo-targeting.',
    budgets: [
      { label: 'Trial (4 weeks)', amount: 'C$700–C$1,000', desc: 'Spotify Audience Network; province targeting (Ontario or BC); single audience segment' },
      { label: 'Core campaign (3 months)', amount: 'C$1,000–C$2,000/month', desc: 'Spotify + Acast; genre + demographic targeting; optional host-read deal on Canadian lifestyle podcast' },
      { label: 'Seasonal burst (January)', amount: 'C$1,800–C$4,000', desc: 'January 3-week push maximum; fitness, beauty, and wellness businesses see highest ROI in this window' },
    ],
    faq: [
      { q: 'Do I need French-language creative for Quebec?', a: 'Yes, strongly recommended. Quebec audiences have among the lowest response rates to English-only advertising in North America — French-language creative typically performs 35–50% better in Quebec. Spotify and Acast support French-language genre targeting. If your business is located in Quebec, French-language podcast creative is both legally encouraged (under the Charter of the French Language) and commercially superior.' },
      { q: 'What\'s the best platform for Toronto small businesses?', a: 'Start with Spotify Audience Network targeting Ontario. Toronto has one of the highest podcast per-capita listening rates in North America (the daily TTC subway commute — averaging 45 minutes — is a major driver). Layer in Acast for premium Canadian content adjacency. The Toronto media market is sophisticated; host-read deals on local Toronto podcasts (The Big Story, Canadaland, Spacing Podcast) are available for businesses targeting a local-loyal Toronto audience.' },
      { q: 'How does Canadian podcast advertising compare to the US?', a: 'CPMs are 15–25% lower than equivalent US markets (e.g., Toronto vs. Chicago). Canadian audiences are slightly less exposed to podcast advertising than their US counterparts, creating better recall rates per impression for early-mover brands. The Canadian market is also bilingual (English + French), which means well-targeted campaigns in Quebec have relatively low competition from English-only national advertisers.' },
    ],
  },
  {
    name: 'Ireland',
    short: 'IE',
    slug: 'ireland',
    currency: 'EUR',
    cpmSymbol: '€',
    cpmRange: '€8–€18',
    listeners: '2.3M',
    weeklyListeners: '52%',
    avgEpisodes: '8.2',
    platforms: [
      { name: 'Spotify', detail: 'The dominant podcast platform in Ireland. Spotify Audience Network supports Irish geo-targeting. CPMs: €10–€16. Ireland\'s high Spotify adoption rate (particularly among 18–44 urban listeners in Dublin, Cork, and Galway) makes this the primary programmatic channel for Irish podcast advertising.', cpm: '€10–€16' },
      { name: 'Apple Podcasts', detail: 'Strong in Ireland, particularly among older professional listeners (35–55). No programmatic — requires direct sponsorship with Irish producers. Ireland has a vibrant independent podcast scene (Off the Ball, The Hard Shoulder, Second Captains) that accepts direct sponsorships.', cpm: 'Direct deal' },
      { name: 'RTÉ Radio Player', detail: 'RTÉ (Ireland\'s national public broadcaster) does not accept external advertising on its streaming apps. However, RTÉ-produced podcasts distributed via Apple Podcasts or Spotify have separate advertising arrangements. RTÉ Radio 1 (drama/documentary podcast) and RTÉ 2fm (music/talk) podcasts are available through standard platforms.', cpm: 'N/A (public broadcaster)' },
      { name: 'Acast (Irish inventory)', detail: 'Acast has Irish publisher inventory and supports Irish geo-targeting. Hosts several major Irish podcasts and can target Ireland as a country or Dublin specifically. CPMs: €10–€18. Strong for reaching Ireland\'s educated professional audience.', cpm: '€10–€18' },
      { name: 'Global / DAX (limited)', detail: 'Global\'s DAX programmatic platform has limited Irish inventory but is an option for businesses targeting both UK and Irish audiences simultaneously. CPMs: €8–€14.', cpm: '€8–€14' },
    ],
    localVsNational: 'Ireland\'s small geography (5.1M population) means "local" podcast advertising effectively means "national with Dublin concentration." Dublin contains one-third of Ireland\'s population and dominates the podcast listener demographic. For a Dublin café or Cork salon, Spotify\'s Irish geo-targeting effectively reaches the entire relevant local market. City-level sub-targeting is not available on most platforms, but Dublin is so dominant in Irish podcast listenership that national targeting is effectively Dublin-weighted.',
    niches: [
      { biz: 'Coffee shops / cafés', strategy: 'Irish café culture is strong in Dublin, Galway, and Cork. Sponsor Irish food and lifestyle podcasts. Morning commute targeting — the Dublin commuter audience (40-minute average journey) is a significant podcast listening block. DART and Luas commuters are among Ireland\'s highest podcast consumers.' },
      { biz: 'Hair salons / beauty', strategy: 'Sponsor Irish beauty and lifestyle podcasts (My Therapist Ghosted Me, Going For Gold). Female 25–44 targeting on Spotify. Host-read deals on Irish women\'s podcasts convert well for appointment-based services; Irish podcast audiences are highly loyal to shows they follow regularly.' },
      { biz: 'Pet groomers', strategy: 'Ireland\'s pet ownership rate rose significantly during COVID-19 and remains elevated. Spotify pet owner audience segments available for Irish targeting. Dog grooming specific seasonal campaigns (summer, Christmas).' },
      { biz: 'Fitness studios', strategy: 'January is Ireland\'s peak fitness advertising window. Sponsor Irish running and wellbeing podcasts (Running on Air, The Mindful Kind). Six Nations rugby season (February–March) drives strong sports podcast engagement — fitness businesses adjacent to rugby culture can align creative.' },
    ],
    seasonality: 'Ireland\'s podcast consumption peaks in the darker, wetter months (October–April). January is the single strongest advertising window for health and wellness businesses. Irish summer (June–August), while mild, sees slightly reduced podcast consumption as people spend more time outdoors. GAA (Gaelic games) season runs March–September and drives strong sports podcast engagement on platforms covering Irish sport.',
    legal: 'The Advertising Standards Authority for Ireland (ASAI) Code applies. Sponsored content must be clearly identified as advertising. Health claims require substantiation. Financial services advertising has additional Central Bank of Ireland requirements. GDPR (EU) applies fully to Irish podcast advertising audience data — all Irish podcast platforms must comply with GDPR consent requirements for targeted advertising.',
    budgetIntro: 'Minimum meaningful Irish podcast campaign: €500–€700/month. Ireland\'s smaller market means a lower absolute budget can deliver meaningful reach — €600/month on Spotify delivers approximately 40,000–60,000 targeted Irish impressions.',
    budgets: [
      { label: 'Trial (4 weeks)', amount: '€500–€700', desc: 'Spotify Audience Network Irish geo; single genre target; adequate for Irish market scale' },
      { label: 'Core campaign (3 months)', amount: '€700–€1,400/month', desc: 'Spotify + Acast Irish inventory; genre + demographic; optional host-read deal on Irish podcast' },
      { label: 'Seasonal burst (January)', amount: '€1,200–€2,500', desc: '4-week January fitness/wellness/beauty push — Ireland\'s highest-ROI podcast advertising window' },
    ],
    faq: [
      { q: 'Is Ireland too small for podcast advertising to be worthwhile?', a: 'Ireland\'s small size is actually an advantage — the entire relevant market (2.3M adult listeners) can be reached at lower absolute cost than most UK or US cities. Ireland has one of the highest weekly podcast listener rates in Europe (52%), meaning a higher proportion of your target audience is reachable via podcast than in many larger markets. For a Dublin-based business, a €600/month Spotify campaign delivers excellent coverage of the urban professional audience.' },
      { q: 'Should I run the same campaign in both Ireland and the UK?', a: 'If your business serves both markets (e.g., an e-commerce business or a franchise), yes — running UK and Irish campaigns simultaneously via Spotify Audience Network or Acast is straightforward. If you\'re a physical local business in Dublin, target Ireland only. UK and Irish podcast audiences are distinct; Irish consumers respond better to Irish-specific creative references (GAA, Dublin streets, Irish cultural touchpoints) than to UK-generic copy.' },
      { q: 'Which Irish podcast genres have the best CPMs for small businesses?', a: 'True crime and comedy podcasts in Ireland have the widest reach but the highest CPMs (€14–€18). Business and news podcasts (Second Captains, The Hard Shoulder) skew toward engaged professional listeners at moderate CPMs. Sports podcasts (Off the Ball, The42 Rugby Weekly) reach a male 18–45 demographic efficiently. For most small businesses, Spotify genre targeting on health/lifestyle or society/culture delivers the broadest relevant reach at €10–€14 CPMs.' },
    ],
  },
  {
    name: 'New Zealand',
    short: 'NZ',
    slug: 'new-zealand',
    currency: 'NZD',
    cpmSymbol: 'NZ$',
    cpmRange: 'NZ$10–NZ$22',
    listeners: '1.8M',
    weeklyListeners: '44%',
    avgEpisodes: '6.9',
    platforms: [
      { name: 'Spotify', detail: 'The dominant podcast platform in New Zealand. Spotify Audience Network supports NZ geo-targeting. CPMs: NZ$12–NZ$18. Strong reach among 18–44 urban listeners in Auckland, Wellington, and Christchurch. New Zealand\'s high smartphone adoption and commuting culture drives strong podcast consumption.', cpm: 'NZ$12–NZ$18' },
      { name: 'Apple Podcasts', detail: 'Strong platform in New Zealand, particularly among professional listeners. No programmatic — requires direct deals with NZ podcast producers. New Zealand has a growing independent podcast scene with shows available on Apple as primary platform.', cpm: 'Direct deal' },
      { name: 'RNZ (Radio New Zealand)', detail: 'New Zealand\'s public broadcaster. RNZ does not accept commercial advertising. However, RNZ-produced podcast content distributed via Spotify and Apple Podcasts reaches New Zealand\'s most educated and engaged listeners. Sponsoring independent NZ podcasters who guest on RNZ shows can provide credibility by association.', cpm: 'N/A (public broadcaster)' },
      { name: 'iHeartRadio NZ (NZME)', detail: 'NZME\'s streaming platform covering The Hits, Newstalk ZB, ZM, and podcast content. Programmatic audio advertising available with NZ geo-targeting. Strong for reaching New Zealand radio + podcast audiences simultaneously. CPMs: NZ$10–NZ$18.', cpm: 'NZ$10–NZ$18' },
      { name: 'Acast (NZ inventory)', detail: 'Limited but growing NZ inventory. Useful for businesses wanting to reach both Australian and New Zealand audiences via the same campaign (APAC targeting). CPMs: NZ$12–NZ$22 for targeted NZ audiences.', cpm: 'NZ$12–NZ$22' },
    ],
    localVsNational: 'New Zealand\'s podcast advertising is effectively a national medium — the entire country has 5M people, and Auckland alone contains one-third of the population. For Auckland businesses (café, salon, fitness studio), NZ national targeting on Spotify is effectively targeting the Auckland market with bonus reach in Wellington and Christchurch. City-level sub-targeting is not available; national NZ targeting is the standard granularity.',
    niches: [
      { biz: 'Coffee shops / cafés', strategy: 'New Zealand has world-class café culture — the flat white originated here. Sponsor NZ food, culture, and morning commute podcasts. Auckland commuter podcast listenership is high on public transport. The NZ café category is extremely competitive; podcast ads that emphasise provenance ("Auckland-roasted," "local beans") resonate strongly.' },
      { biz: 'Hair salons / beauty', strategy: 'Spotify female 25–44 in beauty/lifestyle genre for NZ audience. New Zealand beauty podcast scene is growing. Host-read deals on NZ lifestyle podcasts (The Spinoff, Completely Normal, The Business of Beauty NZ) convert well for appointment bookings.' },
      { biz: 'Pet groomers', strategy: 'New Zealand has high pet ownership rates (64% of households). Dog grooming is a strong category. Spotify NZ "pet owner" audience segments. Summer grooming campaigns (November–February) align with NZ summer and outdoor lifestyle.' },
      { biz: 'Fitness studios', strategy: 'New Zealand\'s outdoor and active culture means fitness podcast listeners are above-average fitness service purchasers. January (NZ summer) is the peak fitness advertising window. All Blacks and Black Ferns rugby seasons drive strong sports podcast engagement for fitness-adjacent businesses.' },
    ],
    seasonality: 'New Zealand\'s podcast seasonality is the inverse of northern hemisphere markets. January–March (peak summer) is the strongest fitness and wellness advertising window. April–June (autumn, approaching winter) sees rising podcast consumption as people shift indoors. June–August (NZ winter) is peak general podcast consumption. All Blacks rugby test season (June–November) is the dominant sports podcast driver.',
    legal: 'The Advertising Standards Authority (ASA New Zealand) Code of Ethics applies. Sponsored content must be clearly identified as advertising. Health claims require substantiation under the Fair Trading Act. The Privacy Act 2020 (NZ equivalent of GDPR) governs audience data use — all podcast platforms serving NZ audiences must comply with NZ privacy law for targeted advertising.',
    budgetIntro: 'Minimum meaningful New Zealand podcast campaign: NZ$500–NZ$750/month. New Zealand\'s small market means a lower absolute budget achieves meaningful national reach — NZ$600/month on Spotify delivers approximately 35,000–55,000 targeted NZ impressions.',
    budgets: [
      { label: 'Trial (4 weeks)', amount: 'NZ$500–NZ$750', desc: 'Spotify Audience Network NZ geo; single genre; adequate reach for NZ market scale' },
      { label: 'Core campaign (3 months)', amount: 'NZ$750–NZ$1,500/month', desc: 'Spotify + iHeartRadio NZ; genre + demographic targeting; optional host-read deal on NZ podcast' },
      { label: 'Seasonal burst (January)', amount: 'NZ$1,200–NZ$2,500', desc: 'January NZ summer push — peak fitness, wellness, and beauty advertising window' },
    ],
    faq: [
      { q: 'Should I run a combined Australia + New Zealand podcast campaign?', a: 'If your business serves both markets (an e-commerce brand or a service available online), a combined APAC campaign makes sense — Acast and Spotify both support combined AU+NZ targeting, and CPMs are similar. If you\'re a physical local business in Auckland, target New Zealand only. AU+NZ combined campaigns dilute the Auckland-specific budget; a NZ-only Spotify campaign is more cost-efficient for local businesses.' },
      { q: 'What are the best NZ podcasts for local business sponsorships?', a: 'The Spinoff Podcast, Kiwi Kids\' News (for family-oriented businesses), Rugby Heaven (sports-adjacent), and Completely Normal (lifestyle) are among New Zealand\'s most popular podcast brands with direct sponsorship opportunities. For programmatic, Spotify\'s NZ inventory covers most major NZ podcast publishers.' },
      { q: 'Is podcast advertising worth it in New Zealand given the small market size?', a: 'Yes, precisely because of the market size. New Zealand\'s 5M population means a consistent national podcast advertising presence is achievable for NZ$600–NZ$1,000/month — a budget that wouldn\'t even register in the Australian or UK markets. New Zealand podcast listeners have very high brand recall rates because they\'re less saturated by podcast advertising than AU or UK counterparts. First-mover local businesses build strong podcast brand presence quickly and affordably.' },
    ],
  },
];

const DATE = '2026-07-06';

function article(c) {
  const platformRows = c.platforms.map(p =>
    `**${p.name}** — ${p.detail} *CPM: ${p.cpm}*`
  ).join('\n\n');

  const nicheItems = c.niches.map(n =>
    `**${n.biz}**: ${n.strategy}`
  ).join('\n\n');

  const budgetRows = c.budgets.map(b =>
    `| ${b.label} | ${b.amount} | ${b.desc} |`
  ).join('\n');

  const faqItems = c.faq.map(f =>
    `**Q: ${f.q}**\n\n${f.a}`
  ).join('\n\n');

  const currencyNote = c.currency === 'GBP' ? '(GBP)' : c.currency === 'AUD' ? '(AUD)' : c.currency === 'CAD' ? '(CAD)' : c.currency === 'EUR' ? '(EUR)' : '(NZD)';

  return `---
title: "Podcast Advertising in ${c.name}: Local Business Guide to Audio Ads in 2026"
date: "${DATE}"
lastModified: "${DATE}"
description: "How local businesses in ${c.name} can advertise on Spotify, Apple Podcasts, and local podcast platforms in 2026. CPM rates ${currencyNote}, platform guide, and campaign examples."
author: "Nataliia"
category: "Programmatic Advertising"
tags: ["podcast advertising", "audio advertising", "${c.short} marketing", "local business marketing", "${c.name}", "Spotify ads", "programmatic audio"]
slug: "podcast-advertising-${c.slug}-local-business-guide"
image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80&auto=format&fit=crop"
readTime: "9 min read"
---

Podcast advertising in ${c.name} has crossed a threshold: ${c.listeners} people now listen to podcasts weekly, and the medium has matured from a niche experiment into a reliable local business advertising channel. For small businesses — coffee shops, hair salons, fitness studios, and pet groomers — podcast ads offer something rare: a non-skippable, high-attention format reaching an audience that is actively engaged with content they chose to listen to.

This guide covers the ${c.name} podcast advertising landscape: which platforms carry local inventory, what CPMs look like, how to set up geo-targeting, and what local businesses in ${c.name} are achieving with audio advertising.

<StatRow
  values="${c.listeners}|${c.weeklyListeners}%|${c.cpmRange}|${c.avgEpisodes}"
  labels="Weekly podcast listeners|Adults listening weekly|CPM range ${currencyNote}|Avg episodes/week per listener"
  subs="${c.name} podcast audience|Share of adult population|${c.name} podcast advertising benchmark|High engagement signal"
  trends="up|up|neutral|up"
/>

## The ${c.name} Podcast Landscape

${c.weeklyListeners}% of ${c.name} adults listen to podcasts weekly — one of the highest rates in the English-speaking world. This audience skews toward the 25–54 demographic, is above-average in income and education, and listens during commutes, exercise, and household tasks. These are exactly the habits that make podcast listeners attractive customers for local services.

## Platform Guide for ${c.name}

${platformRows}

## Local vs National Targeting

${c.localVsNational}

## Which Local Businesses Benefit Most

${nicheItems}

## Seasonality in ${c.name}

${c.seasonality}

## Creative Guide: What Makes a Good Podcast Ad

Podcast creative follows different rules from display or social media.

**Host-read ads** (where the podcast host personally endorses your business) consistently outperform pre-produced programmatic ads for conversion rate. Studies consistently show 3–5x higher purchase intent from host-read versus standard insertion. For local businesses, a host-read that includes the host's genuine personal experience ("I actually tried [business name] in [neighbourhood] and...") drives the highest trust and action.

**Programmatic pre-roll and mid-roll** work better at scale — you can reach 50,000 targeted listeners for a fixed CPM without negotiating individual deals with producers. Start here to test the channel; graduate to host-read deals once you've identified which audience segments are converting.

**15-second vs 30-second**: 30-second mid-roll ads have higher recall but cost 2–3x more than 15-second pre-roll. For local brand building, 30-second mid-roll (placed in the middle of an episode, when listener attention is highest) is recommended. For promotional offers with a clear call to action, 15-second pre-roll delivers efficient reach.

**Audio creative essentials**:
- Open with a strong first 3 seconds (name your business and the one benefit)
- Include a clear, simple call to action at the end (a URL, a phone number, or a specific offer)
- Audio is a sequential medium — do not try to communicate more than one message per ad
- Avoid background music that competes with voiceover clarity

## Budget Guide

${c.budgetIntro}

| Campaign Type | Budget (${c.currency}) | What It Delivers |
|---|---|---|
${budgetRows}

## Measuring Podcast Advertising Results

Podcast attribution is indirect — there are no clicks from an audio ad. Track these signals instead:

- **Branded search volume** (Google Search Console or Google Ads branded terms): typically increases 15–30% during active podcast campaigns
- **Promo code redemptions**: include a podcast-specific promo code in your ad ("mention podcasts for 10% off")
- **Google Business Profile direct searches**: people searching your exact business name increase as brand awareness builds
- **New customer survey**: add "how did you hear about us?" to your intake form or booking flow
- **Website direct traffic uplift**: track baseline before campaign, then compare during and after flight periods

Give podcast ads 60–90 days before assessing ROI. Audio builds brand familiarity through repeated exposure — the conversion path from podcast listener to customer is typically 2–4 weeks after the first impression.

## Legal Considerations in ${c.name}

${c.legal}

## Frequently Asked Questions

${faqItems}

---

*Running local advertising for a business in ${c.name}? DataLatte builds data-driven marketing strategies for small businesses. [View our services](/services/analytics) or [book a free consultation](/free-audit).*
`;
}

for (const country of COUNTRIES) {
  emit(`podcast-advertising-${country.slug}-local-business-guide`, article(country));
}

console.log(`\nDone: ${written} written, ${skipped} skipped`);
