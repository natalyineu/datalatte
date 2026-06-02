#!/usr/bin/env node
/**
 * generate-geo-articles.mjs
 * Generates marketing guides for:
 *   - 14 missing US states
 *   - 10 Canadian provinces
 *   - 12 UK regions
 *   - 8 Australian states/territories
 * Total: 44 articles
 * Usage: node scripts/generate-geo-articles.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT   = path.join(__dirname, '../content/blog');
const DRY_RUN   = process.argv.includes('--dry-run');

// ─────────────────────────────────────────────────────────────────────────────
// 1. US STATES (14 missing)
// ─────────────────────────────────────────────────────────────────────────────
const US_STATES = [
  {
    code: 'AZ', name: 'Arizona',
    cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Tempe'],
    topCity: 'Phoenix',
    nickname: 'The Grand Canyon State',
    keyIndustries: ['real estate', 'tourism', 'tech (Intel, Apple)', 'healthcare', 'aerospace'],
    businessClimate: 'one of the fastest-growing states in the US, with Phoenix ranking top-3 nationally for new business formation',
    avgGoogleCPC: '$2.90',
    avgMetaCPM: '$13.00',
    population: '7.4M',
    smallBizCount: '620,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Scottsdale is one of the top wellness and spa markets in the US — affluent retirees and remote workers create year-round demand for premium fitness, beauty, and grooming services.',
    seasonalTip: 'Phoenix\'s "snowbird" season (November–April) brings 300,000+ part-time residents. Run winter campaigns targeting "Phoenix winter resident" and "Scottsdale seasonal" audiences for a significant revenue boost.',
    cta: 'fitness studio',
    unsplashId: '1558618666-fcd25c85cd64',
    currency: '$', country: 'US',
  },
  {
    code: 'CA', name: 'California',
    cities: ['Los Angeles', 'San Diego', 'San Francisco', 'San Jose', 'Sacramento', 'Fresno'],
    topCity: 'Los Angeles',
    nickname: 'The Golden State',
    keyIndustries: ['tech (Silicon Valley)', 'entertainment', 'agriculture', 'aerospace', 'tourism'],
    businessClimate: 'the world\'s 5th largest economy — highly competitive but with unmatched consumer spending power and a strong preference for local, artisan, and wellness-oriented businesses',
    avgGoogleCPC: '$4.20',
    avgMetaCPM: '$17.50',
    population: '39.5M',
    smallBizCount: '4.1M',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Los Angeles has the highest concentration of independent coffee shops, yoga studios, and boutique gyms in the US. Californians spend 40% more per capita on wellness services than the national average.',
    seasonalTip: 'January is California\'s biggest fitness month — "New Year" gym and studio campaigns with a "no contract" offer consistently outperform any other month by 2–3x.',
    cta: 'fitness studio',
    unsplashId: '1501594907352-04cda38ebc29',
    currency: '$', country: 'US',
  },
  {
    code: 'CO', name: 'Colorado',
    cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder', 'Pueblo'],
    topCity: 'Denver',
    nickname: 'The Centennial State',
    keyIndustries: ['outdoor recreation', 'tech (Denver Tech Center)', 'aerospace', 'cannabis', 'tourism'],
    businessClimate: 'highly educated, outdoor-active population with one of the highest rates of small-business formation in the Mountain West',
    avgGoogleCPC: '$2.80',
    avgMetaCPM: '$12.80',
    population: '5.8M',
    smallBizCount: '630,000',
    niches: ['fitness studios', 'coffee shops', 'pet groomers', 'hair salons'],
    localFact: 'Boulder ranks #1 in the US for fitness participation — residents spend more per capita on gyms, yoga, and outdoor recreation than any other US city.',
    seasonalTip: 'Ski season (December–March) drives massive visitor traffic to Summit County, Vail, and Aspen. Coffee shops and wellness businesses near ski towns can run "après ski" and "mountain wellness" campaigns.',
    cta: 'fitness studio',
    unsplashId: '1464822759023-fed107d6f3cc',
    currency: '$', country: 'US',
  },
  {
    code: 'FL', name: 'Florida',
    cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Naples'],
    topCity: 'Miami',
    nickname: 'The Sunshine State',
    keyIndustries: ['tourism', 'real estate', 'healthcare', 'finance (Miami)', 'agriculture'],
    businessClimate: 'no state income tax and year-round sunshine make Florida the #1 destination for remote workers, retirees, and business relocations — and the consumer base reflects that',
    avgGoogleCPC: '$3.10',
    avgMetaCPM: '$13.80',
    population: '22.6M',
    smallBizCount: '2.7M',
    niches: ['fitness studios', 'hair salons', 'coffee shops', 'pet groomers'],
    localFact: 'Miami is one of the top 5 markets globally for beauty and wellness spend. South Beach alone has more beauty salons per square mile than nearly any neighbourhood in the US.',
    seasonalTip: 'Miami\'s tourist season peaks December–April. Hair salons and spas near South Beach, Brickell, and Coral Gables should double Meta Ads spend in winter and target "Miami vacation" interests.',
    cta: 'hair salon',
    unsplashId: '1506905925346-21bda4d32df4',
    currency: '$', country: 'US',
  },
  {
    code: 'IL', name: 'Illinois',
    cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield'],
    topCity: 'Chicago',
    nickname: 'The Prairie State',
    keyIndustries: ['finance', 'manufacturing', 'healthcare', 'tech', 'food processing'],
    businessClimate: 'the third-largest city economy in the US, with Chicago acting as the commercial hub for the entire Midwest',
    avgGoogleCPC: '$3.20',
    avgMetaCPM: '$14.20',
    population: '12.6M',
    smallBizCount: '1.2M',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Chicago\'s 77 distinct neighbourhoods each have their own character — a coffee shop in Wicker Park needs completely different marketing than one in Lincoln Park or Hyde Park.',
    seasonalTip: 'Chicago summers (June–August) are magical after brutal winters — outdoor businesses see massive traffic spikes. Run "summer patio" and "outdoor seating Chicago" ads from May onwards.',
    cta: 'coffee shop',
    unsplashId: '1477959858617-67f85cf4f1df',
    currency: '$', country: 'US',
  },
  {
    code: 'KS', name: 'Kansas',
    cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka', 'Lawrence'],
    topCity: 'Wichita',
    nickname: 'The Sunflower State',
    keyIndustries: ['aviation & aerospace (Spirit, Cessna, Learjet)', 'agriculture', 'manufacturing', 'healthcare'],
    businessClimate: 'low cost-of-living Midwest market with a strong manufacturing base and a loyal, community-oriented consumer base',
    avgGoogleCPC: '$1.75',
    avgMetaCPM: '$8.90',
    population: '2.9M',
    smallBizCount: '240,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Overland Park (Kansas City suburb) is consistently rated one of the best places to live in the US — creating a dense, high-income suburban market that actively supports local small businesses.',
    seasonalTip: 'College basketball season (March Madness) is a massive cultural event in Kansas — restaurants, coffee shops, and sports bars near Lawrence and Wichita State campuses see huge spikes.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
    currency: '$', country: 'US',
  },
  {
    code: 'MA', name: 'Massachusetts',
    cities: ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge', 'Newton'],
    topCity: 'Boston',
    nickname: 'The Bay State',
    keyIndustries: ['biotech & pharma', 'education (Harvard, MIT)', 'finance', 'healthcare', 'tech'],
    businessClimate: 'one of the highest-income, most educated consumer bases in the US — quality and expertise are paramount, and premium pricing is expected',
    avgGoogleCPC: '$3.60',
    avgMetaCPM: '$15.50',
    population: '7.0M',
    smallBizCount: '700,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Boston\'s concentration of universities, hospitals, and biotech firms creates a uniquely affluent and health-conscious consumer base — independent coffee shops and boutique gyms consistently outperform chains.',
    seasonalTip: 'Boston Marathon week (April) brings 500,000+ visitors and 30,000 runners. Fitness studios, coffee shops, and recovery-focused businesses near the route see massive walk-in spikes.',
    cta: 'fitness studio',
    unsplashId: '1563459802-b3e95e61df1c',
    currency: '$', country: 'US',
  },
  {
    code: 'NV', name: 'Nevada',
    cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City'],
    topCity: 'Las Vegas',
    nickname: 'The Silver State',
    keyIndustries: ['tourism & gaming', 'hospitality', 'tech (Reno/Tahoe corridor)', 'construction', 'mining'],
    businessClimate: 'no state income tax and a booming tech relocation scene in Reno; Las Vegas is one of the top entertainment and hospitality markets in the world',
    avgGoogleCPC: '$2.70',
    avgMetaCPM: '$12.20',
    population: '3.2M',
    smallBizCount: '250,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Las Vegas has 40+ million visitors per year — but the local resident market of 2.2 million is often overlooked. Henderson and Summerlin have some of the most affluent suburban communities in the Southwest.',
    seasonalTip: 'CES (January) and Formula 1 Las Vegas GP (November) each bring 100,000+ high-net-worth visitors. Premium service businesses near the Strip should run event-week campaigns targeting "Las Vegas convention" audiences.',
    cta: 'fitness studio',
    unsplashId: '1568515387631-8aa1a8b4d944',
    currency: '$', country: 'US',
  },
  {
    code: 'NY', name: 'New York',
    cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
    topCity: 'New York City',
    nickname: 'The Empire State',
    keyIndustries: ['finance', 'media & entertainment', 'tech', 'healthcare', 'fashion'],
    businessClimate: 'the world\'s most competitive local business market — but also the most rewarding; NYC customers spend 3–5x the national average on local services',
    avgGoogleCPC: '$4.80',
    avgMetaCPM: '$19.00',
    population: '19.7M',
    smallBizCount: '2.1M',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'New York City has more independent coffee shops per square mile than any city in North America — yet demand continues to grow. Neighbourhood identity (Brooklyn vs. Manhattan vs. Queens) is a powerful marketing lever.',
    seasonalTip: 'New York Fashion Week (September and February) drives massive beauty and grooming demand. Hair salons and makeup studios near Midtown and the Meatpacking District should run "NYFW" targeted campaigns.',
    cta: 'coffee shop',
    unsplashId: '1534430480872-3498386dcd52',
    currency: '$', country: 'US',
  },
  {
    code: 'NC', name: 'North Carolina',
    cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Asheville'],
    topCity: 'Charlotte',
    nickname: 'The Tar Heel State',
    keyIndustries: ['banking (Bank of America, Wells Fargo HQ)', 'tech (Research Triangle)', 'manufacturing', 'healthcare'],
    businessClimate: 'one of the Southeast\'s fastest-growing states, with Charlotte and the Research Triangle ranking top-10 nationally for business formation and corporate relocation',
    avgGoogleCPC: '$2.50',
    avgMetaCPM: '$11.80',
    population: '10.7M',
    smallBizCount: '960,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Asheville has one of the highest concentrations of independent coffee shops, yoga studios, and wellness businesses per capita in the Southeast — locals there actively boycott chains.',
    seasonalTip: 'Fall colour season in the NC mountains (October–November) draws 10M+ visitors. Businesses in Asheville, Boone, and Blowing Rock should run "fall foliage" and "mountain getaway" campaigns.',
    cta: 'coffee shop',
    unsplashId: '1558618666-fcd25c85cd64',
    currency: '$', country: 'US',
  },
  {
    code: 'OH', name: 'Ohio',
    cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'],
    topCity: 'Columbus',
    nickname: 'The Buckeye State',
    keyIndustries: ['manufacturing', 'finance', 'healthcare', 'education (OSU)', 'retail'],
    businessClimate: 'the geographic centre of the US consumer market with three distinct metros — Columbus is young and growing, Cleveland is rebounding, Cincinnati is corporate-driven',
    avgGoogleCPC: '$2.20',
    avgMetaCPM: '$10.80',
    population: '11.8M',
    smallBizCount: '1.0M',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Columbus\'s Short North Arts District is one of the best independent small-business streets in the Midwest — coffee shops, fitness studios, and boutiques there have some of the highest revenue per square foot in the region.',
    seasonalTip: 'Ohio State football season (September–November) is the biggest consumer spending event in the state. Businesses near campus in Columbus should run "game day" promotions and OSU-themed campaigns.',
    cta: 'coffee shop',
    unsplashId: '1477959858617-67f85cf4f1df',
    currency: '$', country: 'US',
  },
  {
    code: 'OR', name: 'Oregon',
    cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Bend'],
    topCity: 'Portland',
    nickname: 'The Beaver State',
    keyIndustries: ['tech (Nike, Intel, Adidas US HQ)', 'outdoor recreation', 'agriculture (wine, craft beer)', 'healthcare'],
    businessClimate: 'strong local-first culture — Portlanders will go out of their way to support an independent business over a chain, making Oregon one of the best markets for authentic small businesses',
    avgGoogleCPC: '$2.60',
    avgMetaCPM: '$12.00',
    population: '4.2M',
    smallBizCount: '380,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Portland has more coffee shops per capita than Seattle — and a culture that celebrates local over corporate so strongly that chains like Starbucks have struggled to expand there.',
    seasonalTip: 'Bend\'s outdoor tourism season (May–October) brings affluent visitors from Portland, Seattle, and California. Fitness studios, coffee shops, and wellness businesses in Bend can target "Bend weekend" and "Central Oregon" audiences.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
    currency: '$', country: 'US',
  },
  {
    code: 'TX', name: 'Texas',
    cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso'],
    topCity: 'Houston',
    nickname: 'The Lone Star State',
    keyIndustries: ['energy (oil & gas)', 'tech (Austin)', 'healthcare', 'aerospace', 'agriculture'],
    businessClimate: 'the second-largest state economy in the US with no state income tax, business-friendly regulation, and four of the top-10 fastest-growing US metros',
    avgGoogleCPC: '$3.00',
    avgMetaCPM: '$13.50',
    population: '30.5M',
    smallBizCount: '3.1M',
    niches: ['fitness studios', 'hair salons', 'coffee shops', 'pet groomers'],
    localFact: 'Austin has seen 50%+ population growth since 2010 — making it one of the best markets for new small businesses in the US. The tech-driven demographic spends heavily on coffee, fitness, and grooming.',
    seasonalTip: 'South by Southwest (March, Austin) brings 250,000+ visitors. SXSW week is the single biggest revenue opportunity for Austin service businesses — run geo-targeted "SXSW week" Google Ads starting 2 weeks before.',
    cta: 'fitness studio',
    unsplashId: '1575520759163-5c51bfb2a6c2',
    currency: '$', country: 'US',
  },
  {
    code: 'WA', name: 'Washington',
    cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Redmond'],
    topCity: 'Seattle',
    nickname: 'The Evergreen State',
    keyIndustries: ['tech (Amazon, Microsoft, Boeing)', 'aerospace', 'agriculture', 'tourism'],
    businessClimate: 'exceptionally high average income driven by Amazon and Microsoft employees — with one of the most discerning and coffee-obsessed consumer bases in the world',
    avgGoogleCPC: '$3.30',
    avgMetaCPM: '$14.80',
    population: '7.8M',
    smallBizCount: '680,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Seattle is the birthplace of Starbucks — yet independent coffee shops dominate neighbourhood loyalty. Capitol Hill, Ballard, and Fremont have some of the most loyal local-coffee cultures in the US.',
    seasonalTip: 'Seattle\'s grey, rainy winters (October–March) drive indoor service businesses. Coffee shops and fitness studios see their highest foot traffic in the dreariest months — lean into "cozy" and "warm" in your ad copy.',
    cta: 'coffee shop',
    unsplashId: '1519121785383-3229c74d24b6',
    currency: '$', country: 'US',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. CANADIAN PROVINCES (10)
// ─────────────────────────────────────────────────────────────────────────────
const CANADA_PROVINCES = [
  {
    code: 'ON', name: 'Ontario', slug: 'small-business-marketing-ontario-canada',
    cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London'],
    topCity: 'Toronto',
    region: 'Canada\'s most populous province',
    keyIndustries: ['finance', 'tech', 'healthcare', 'manufacturing', 'film & media'],
    businessClimate: 'the financial and tech capital of Canada — Toronto\'s diverse, high-income consumer base rivals major US metros for spending power',
    avgGoogleCPC: 'CA$3.20',
    avgMetaCPM: 'CA$13.50',
    population: '15.1M',
    smallBizCount: '1.2M',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Toronto\'s Kensington Market and Queen Street West have some of North America\'s best independent coffee and wellness cultures — locals actively prefer independent over chains.',
    seasonalTip: 'Toronto\'s winter (November–March) drives indoor business. Coffee shops and fitness studios thrive — run "winter wellness" and "cozy café" campaigns from October.',
    cta: 'coffee shop',
    unsplashId: '1517935706615-2717063c2225',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'BC', name: 'British Columbia', slug: 'small-business-marketing-british-columbia-canada',
    cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna', 'Victoria'],
    topCity: 'Vancouver',
    region: 'Canada\'s Pacific gateway',
    keyIndustries: ['tech', 'film & TV', 'tourism', 'real estate', 'forestry'],
    businessClimate: 'the most wellness-oriented province in Canada — Vancouver consistently ranks #1 in Canada for fitness and healthy lifestyle spending',
    avgGoogleCPC: 'CA$3.00',
    avgMetaCPM: 'CA$12.80',
    population: '5.4M',
    smallBizCount: '470,000',
    niches: ['fitness studios', 'coffee shops', 'pet groomers', 'hair salons'],
    localFact: 'Vancouver has more yoga studios and plant-based cafés per capita than almost any other North American city — the outdoor-active, health-conscious culture makes wellness services the #1 small-business category.',
    seasonalTip: 'Ski season at Whistler (December–April) brings affluent visitors from across North America and Asia. Wellness and coffee businesses in Whistler Village can charge premium rates to international visitors.',
    cta: 'fitness studio',
    unsplashId: '1559521783-1d1599583485',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'AB', name: 'Alberta', slug: 'small-business-marketing-alberta-canada',
    cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'St. Albert', 'Medicine Hat'],
    topCity: 'Calgary',
    region: 'Canada\'s energy heartland',
    keyIndustries: ['oil & gas', 'agriculture', 'tech (Calgary)', 'construction', 'tourism'],
    businessClimate: 'no provincial income tax and high per-capita income from the energy sector — Albertans have some of the highest disposable incomes in Canada',
    avgGoogleCPC: 'CA$2.80',
    avgMetaCPM: 'CA$11.50',
    population: '4.6M',
    smallBizCount: '390,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Calgary\'s 17th Avenue SW (the "Red Mile") is one of Western Canada\'s best independent restaurant and café strips — the energy-industry wealth creates premium service demand.',
    seasonalTip: 'Calgary Stampede (July) draws 1.2 million visitors over 10 days. Any business in Calgary should run Stampede-week campaigns — it\'s the highest consumer-spend event in Western Canada.',
    cta: 'fitness studio',
    unsplashId: '1464822759023-fed107d6f3cc',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'QC', name: 'Quebec', slug: 'small-business-marketing-quebec-canada',
    cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'],
    topCity: 'Montreal',
    region: 'Canada\'s French-speaking province',
    keyIndustries: ['aerospace', 'AI & tech', 'film & gaming', 'fashion', 'tourism'],
    businessClimate: 'unique bilingual market with a strong café culture, fashion scene, and arts economy — Montreal rivals European cities for independent business density',
    avgGoogleCPC: 'CA$2.40',
    avgMetaCPM: 'CA$10.50',
    population: '8.8M',
    smallBizCount: '680,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Montreal\'s Plateau-Mont-Royal and Mile End neighbourhoods are internationally renowned for independent café culture — locals spend 3× the Canadian average on coffee per capita.',
    seasonalTip: 'Montreal Jazz Festival (late June–July) and Just For Laughs (July) bring 3M+ visitors combined. Coffee shops and restaurants in the Quartier des spectacles should front-load summer ad spend.',
    cta: 'coffee shop',
    unsplashId: '1534430480872-3498386dcd52',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'MB', name: 'Manitoba', slug: 'small-business-marketing-manitoba-canada',
    cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'],
    topCity: 'Winnipeg',
    region: 'Canada\'s prairie heartland',
    keyIndustries: ['agriculture', 'manufacturing', 'healthcare', 'retail', 'transportation'],
    businessClimate: 'stable, community-oriented market with very low digital ad competition — a well-run $500/month campaign can dominate most local service categories',
    avgGoogleCPC: 'CA$1.80',
    avgMetaCPM: 'CA$8.50',
    population: '1.4M',
    smallBizCount: '115,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Winnipeg\'s Exchange District has become one of Western Canada\'s best independent business corridors — locally-owned coffee shops, studios, and boutiques dominate the area.',
    seasonalTip: 'Winnipeg\'s brutal winters (November–March) drive indoor traffic dramatically. Coffee shops and fitness studios should increase ad spend in winter — it\'s when locals most need warm spaces.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'SK', name: 'Saskatchewan', slug: 'small-business-marketing-saskatchewan-canada',
    cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'],
    topCity: 'Saskatoon',
    region: 'Canada\'s breadbasket',
    keyIndustries: ['agriculture', 'mining (potash)', 'oil & gas', 'healthcare', 'manufacturing'],
    businessClimate: 'small but high-income resource economy with very low digital ad competition and a loyal local-first consumer mindset',
    avgGoogleCPC: 'CA$1.65',
    avgMetaCPM: 'CA$7.80',
    population: '1.2M',
    smallBizCount: '95,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Saskatoon\'s Broadway Avenue is one of Saskatchewan\'s best independent business strips — locally-owned businesses thrive because residents actively prefer them over chains.',
    seasonalTip: 'Saskatchewan winters are long and cold — indoor businesses (coffee, fitness, wellness) run their strongest campaigns November through March when locals need reasons to leave the house.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'NS', name: 'Nova Scotia', slug: 'small-business-marketing-nova-scotia-canada',
    cities: ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow', 'Kentville'],
    topCity: 'Halifax',
    region: 'Canada\'s ocean playground',
    keyIndustries: ['ocean tech', 'defence', 'tourism', 'fisheries', 'healthcare'],
    businessClimate: 'Halifax is the Atlantic Canada hub with a rapidly growing tech and university population — and a strong local-first café and wellness culture',
    avgGoogleCPC: 'CA$1.90',
    avgMetaCPM: 'CA$9.00',
    population: '1.0M',
    smallBizCount: '82,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Halifax\'s Spring Garden Road and North End have transformed into vibrant independent business corridors — Dalhousie and Saint Mary\'s universities bring a young, coffee-driven population.',
    seasonalTip: 'Nova Scotia\'s summer tourism season (July–September) brings visitors from across North America and Europe. Coastal businesses and Halifax eateries should front-load summer Google Ads.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'NB', name: 'New Brunswick', slug: 'small-business-marketing-new-brunswick-canada',
    cities: ['Moncton', 'Saint John', 'Fredericton', 'Dieppe', 'Miramichi'],
    topCity: 'Moncton',
    region: 'Canada\'s bilingual province',
    keyIndustries: ['IT & call centres', 'manufacturing', 'tourism', 'agriculture', 'healthcare'],
    businessClimate: 'Canada\'s only officially bilingual province (English and French) — Moncton is one of the fastest-growing small cities in Atlantic Canada',
    avgGoogleCPC: 'CA$1.55',
    avgMetaCPM: 'CA$7.50',
    population: '820K',
    smallBizCount: '62,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Moncton\'s growth as an IT and logistics hub has brought thousands of young professionals who support local coffee shops, fitness studios, and grooming businesses over chains.',
    seasonalTip: 'Bay of Fundy summer tourism (July–September) brings visitors from across North America. Businesses in Saint John and Fundy Trail-area towns can target "Bay of Fundy" visitor audiences.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'NL', name: 'Newfoundland and Labrador', slug: 'small-business-marketing-newfoundland-canada',
    cities: ['St. John\'s', 'Mount Pearl', 'Corner Brook', 'Grand Falls-Windsor', 'Gander'],
    topCity: 'St. John\'s',
    region: 'Canada\'s easternmost province',
    keyIndustries: ['oil & gas (offshore)', 'fisheries', 'tourism', 'mining', 'healthcare'],
    businessClimate: 'oil-driven economy with high per-capita income in St. John\'s — locals have an exceptionally strong sense of community and support local businesses fiercely',
    avgGoogleCPC: 'CA$1.70',
    avgMetaCPM: 'CA$8.20',
    population: '520K',
    smallBizCount: '42,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'St. John\'s George Street is one of the highest pub-and-café densities per capita in North America — the culture of local loyalty means a well-run independent will always beat a chain.',
    seasonalTip: 'Iceberg season (April–June) and whale watching (June–September) draw significant tourism. Businesses in St. John\'s should target "Newfoundland visitor" and "iceberg season" audiences.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
    currency: 'CA$', country: 'Canada',
  },
  {
    code: 'PE', name: 'Prince Edward Island', slug: 'small-business-marketing-pei-canada',
    cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague'],
    topCity: 'Charlottetown',
    region: 'Canada\'s smallest province',
    keyIndustries: ['tourism', 'agriculture (potatoes)', 'fisheries', 'aerospace', 'bioscience'],
    businessClimate: 'small, tight-knit market where word-of-mouth and community trust are more powerful than any ad platform — but digital marketing still delivers strong ROI in the tourism season',
    avgGoogleCPC: 'CA$1.40',
    avgMetaCPM: 'CA$7.00',
    population: '175K',
    smallBizCount: '14,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'PEI attracts 1.8 million tourists per year — nearly 10× its own population. A coffee shop or wellness business in Charlottetown can serve a mix of loyal locals and summer visitors for strong year-round revenue.',
    seasonalTip: 'PEI\'s summer tourist season (July–September) is everything. Run Google Ads targeting "PEI things to do," "Charlottetown restaurants," and "Prince Edward Island activities" to capture visitor intent.',
    cta: 'coffee shop',
    unsplashId: '1559521783-1d1599583485',
    currency: 'CA$', country: 'Canada',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. UK REGIONS (12)
// ─────────────────────────────────────────────────────────────────────────────
const UK_REGIONS = [
  {
    slug: 'small-business-marketing-manchester-uk',
    city: 'Manchester', region: 'Greater Manchester', country: 'England',
    cities: ['Manchester', 'Salford', 'Stockport', 'Bolton', 'Oldham'],
    keyIndustries: ['digital & tech (MediaCityUK)', 'financial services', 'retail', 'education'],
    businessClimate: 'the UK\'s second city for startup activity — Manchester\'s creative and tech scene rivals London at a fraction of the cost',
    avgGoogleCPC: '£1.90', avgMetaCPM: '£9.50', population: '2.9M', smallBizCount: '95,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Manchester\'s Northern Quarter is one of the UK\'s best independent business districts — coffee shops, fitness studios, and barbers there thrive on local loyalty.',
    seasonalTip: 'Manchester\'s rain is legendary — coffee shops that lean into "cozy rainy day" messaging and hot drink promotions November through March consistently outperform their summer numbers.',
    unsplashId: '1519121785383-3229c74d24b6', currency: '£',
  },
  {
    slug: 'small-business-marketing-birmingham-uk',
    city: 'Birmingham', region: 'West Midlands', country: 'England',
    cities: ['Birmingham', 'Wolverhampton', 'Coventry', 'Solihull', 'Sutton Coldfield'],
    keyIndustries: ['manufacturing', 'finance', 'retail', 'healthcare', 'automotive (Jaguar Land Rover)'],
    businessClimate: 'the UK\'s second-largest city by population with a young, diverse demographic and rapidly regenerating city centre',
    avgGoogleCPC: '£1.70', avgMetaCPM: '£8.80', population: '2.9M', smallBizCount: '85,000',
    niches: ['hair salons', 'coffee shops', 'fitness studios', 'pet groomers'],
    localFact: 'Birmingham has the youngest population of any major UK city — over 38% under 25. This drives strong demand for affordable beauty, fitness, and coffee experiences.',
    seasonalTip: 'Birmingham\'s Frankfurt Christmas Market (November–December) is the largest authentic German Christmas market outside Germany — 5.5 million visitors. Coffee shops and gift-focused businesses should saturate this window.',
    unsplashId: '1477959858617-67f85cf4f1df', currency: '£',
  },
  {
    slug: 'small-business-marketing-leeds-uk',
    city: 'Leeds', region: 'West Yorkshire', country: 'England',
    cities: ['Leeds', 'Bradford', 'Wakefield', 'Harrogate', 'Halifax'],
    keyIndustries: ['financial services', 'retail (Asda HQ)', 'healthcare', 'digital & tech', 'education'],
    businessClimate: 'the fastest-growing major UK city outside London, with a thriving independent business scene in Kirkgate Market and the Calls area',
    avgGoogleCPC: '£1.80', avgMetaCPM: '£9.20', population: '1.9M', smallBizCount: '65,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Leeds has one of the UK\'s highest concentrations of university students (60,000+) — creating a large, aspirational market for affordable coffee, fitness, and beauty services.',
    seasonalTip: 'Leeds Student Freshers\' fortnight (September) is the biggest local marketing opportunity of the year. Coffee shops, gyms, and salons offering student discounts with a strong Google Ads push can acquire 30–50 new regulars in two weeks.',
    unsplashId: '1534430480872-3498386dcd52', currency: '£',
  },
  {
    slug: 'small-business-marketing-bristol-uk',
    city: 'Bristol', region: 'South West England', country: 'England',
    cities: ['Bristol', 'Bath', 'Weston-super-Mare', 'Clevedon', 'Nailsea'],
    keyIndustries: ['aerospace (Airbus, Rolls-Royce)', 'creative & digital', 'education', 'healthcare'],
    businessClimate: 'consistently ranked the UK\'s best city to live and work — an affluent, creative population with the highest independent business support culture outside London',
    avgGoogleCPC: '£2.00', avgMetaCPM: '£10.00', population: '470K', smallBizCount: '35,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Bristol\'s Stokes Croft and Clifton Village are internationally recognised as independent business hotspots — residents there actively choose local over chain for every purchase.',
    seasonalTip: 'Bristol Balloon Fiesta (August) and Harbour Festival (July) each draw 100,000+ visitors. Businesses in the harbour area should run event-week campaigns targeting "Bristol summer" visitors.',
    unsplashId: '1558618666-fcd25c85cd64', currency: '£',
  },
  {
    slug: 'small-business-marketing-liverpool-uk',
    city: 'Liverpool', region: 'Merseyside', country: 'England',
    cities: ['Liverpool', 'Birkenhead', 'St Helens', 'Warrington', 'Southport'],
    keyIndustries: ['tourism (Beatles)', 'healthcare', 'port & logistics', 'retail', 'education'],
    businessClimate: 'a city with fierce local pride and growing business confidence — Liverpool ONE and the Baltic Triangle have created world-class independent business zones',
    avgGoogleCPC: '£1.65', avgMetaCPM: '£8.50', population: '900K', smallBizCount: '30,000',
    niches: ['hair salons', 'coffee shops', 'fitness studios', 'pet groomers'],
    localFact: 'Liverpool\'s Baltic Triangle is one of the UK\'s most vibrant independent café and creative business districts — local identity is everything here and authentic marketing always beats polished.',
    seasonalTip: 'International Beatles Week (August) draws 80,000+ international visitors. Grand National at Aintree (April) brings another 150,000. Both are huge revenue windows for local service businesses.',
    unsplashId: '1519121785383-3229c74d24b6', currency: '£',
  },
  {
    slug: 'small-business-marketing-sheffield-uk',
    city: 'Sheffield', region: 'South Yorkshire', country: 'England',
    cities: ['Sheffield', 'Rotherham', 'Doncaster', 'Barnsley', 'Chesterfield'],
    keyIndustries: ['advanced manufacturing', 'healthcare', 'education (2 universities)', 'digital'],
    businessClimate: 'affordable city with a thriving independent music and café culture — Sheffield has one of the UK\'s best records for independent over chain business support',
    avgGoogleCPC: '£1.55', avgMetaCPM: '£8.00', population: '730K', smallBizCount: '24,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Sheffield has more independent coffee shops per capita than almost any other UK city its size — the student-heavy, arts-oriented population actively boycotts chains.',
    seasonalTip: 'Sheffield Doc/Fest (June) and Tramlines Festival (July) bring national and international visitors. Coffee shops and food businesses in the city centre should run event-week promotions.',
    unsplashId: '1500382017468-9049fed747ef', currency: '£',
  },
  {
    slug: 'small-business-marketing-newcastle-uk',
    city: 'Newcastle', region: 'Tyne and Wear', country: 'England',
    cities: ['Newcastle upon Tyne', 'Gateshead', 'Sunderland', 'Durham', 'Middlesbrough'],
    keyIndustries: ['digital & tech (Sage HQ)', 'healthcare', 'education', 'retail', 'financial services'],
    businessClimate: 'a city with tremendous local pride and a growing digital economy — Newcastle\'s Quayside and Ouseburn Valley are thriving independent business zones',
    avgGoogleCPC: '£1.60', avgMetaCPM: '£8.20', population: '800K', smallBizCount: '26,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Newcastle\'s Ouseburn Valley has become one of the North East\'s best independent creative and café districts — drawing young professionals and students away from chain establishments.',
    seasonalTip: 'The Geordie consumer is intensely loyal — once you win a customer in Newcastle, they\'ll stick with you and recommend you for years. Invest in loyalty cards, referral schemes, and Google reviews early.',
    unsplashId: '1534430480872-3498386dcd52', currency: '£',
  },
  {
    slug: 'small-business-marketing-nottingham-uk',
    city: 'Nottingham', region: 'East Midlands', country: 'England',
    cities: ['Nottingham', 'Leicester', 'Derby', 'Loughborough', 'Mansfield'],
    keyIndustries: ['retail (Card Factory, Experian HQ)', 'healthcare', 'education', 'bioscience'],
    businessClimate: 'a major retail and university centre with two universities bringing 60,000+ students and a growing independent business scene in the Lace Market',
    avgGoogleCPC: '£1.70', avgMetaCPM: '£8.80', population: '730K', smallBizCount: '24,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Nottingham\'s Hockley and Lace Market areas have one of the Midlands\' best concentrations of independent cafés, barbers, and boutiques — the student population fuels constant new customer flow.',
    seasonalTip: 'Nottingham\'s Christmas market (November–December) is one of the UK\'s largest, transforming the Old Market Square. Coffee shops and gift-adjacent businesses should heavily promote their proximity to the market.',
    unsplashId: '1477959858617-67f85cf4f1df', currency: '£',
  },
  {
    slug: 'small-business-marketing-edinburgh-uk',
    city: 'Edinburgh', region: 'Scotland', country: 'Scotland',
    cities: ['Edinburgh', 'Glasgow', 'Stirling', 'Livingston', 'Dunfermline'],
    keyIndustries: ['finance (Standard Life, RBS)', 'tourism', 'tech', 'education', 'whisky'],
    businessClimate: 'Scotland\'s capital — a premium tourism destination year-round with some of the UK\'s wealthiest consumers outside London',
    avgGoogleCPC: '£2.10', avgMetaCPM: '£10.50', population: '550K', smallBizCount: '22,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Edinburgh\'s Stockbridge and Bruntsfield are internationally recognised for their independent café and specialty food scenes — locals there rank independent support as a core value.',
    seasonalTip: 'Edinburgh Fringe (August) brings 3 million tickets sold in one month — more than any other arts festival in the world. Coffee shops and food businesses in the Old and New Towns see their best month of the year.',
    unsplashId: '1501594907352-04cda38ebc29', currency: '£',
  },
  {
    slug: 'small-business-marketing-glasgow-uk',
    city: 'Glasgow', region: 'Scotland', country: 'Scotland',
    cities: ['Glasgow', 'Paisley', 'Hamilton', 'Cumbernauld', 'Kilmarnock'],
    keyIndustries: ['tech & digital', 'life sciences', 'creative industries', 'financial services', 'education'],
    businessClimate: 'Scotland\'s largest city — working-class pride and a powerful independent business culture make Glasgow one of the UK\'s best markets for authentic, community-rooted businesses',
    avgGoogleCPC: '£1.80', avgMetaCPM: '£9.00', population: '1.8M', smallBizCount: '52,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Glasgow\'s Merchant City and West End have some of the UK\'s best independent café and barber cultures. Glaswegians are intensely loyal to local — and vocal advocates when they find a business they love.',
    seasonalTip: 'Celtic Connections (January) and Glasgow Film Festival (February) fill the city with visitors during the quietest months. Coffee shops and indoor venues near the SECC and city centre benefit most.',
    unsplashId: '1519121785383-3229c74d24b6', currency: '£',
  },
  {
    slug: 'small-business-marketing-cardiff-uk',
    city: 'Cardiff', region: 'Wales', country: 'Wales',
    cities: ['Cardiff', 'Swansea', 'Newport', 'Barry', 'Bridgend'],
    keyIndustries: ['media (BBC Wales)', 'public sector', 'finance', 'tourism', 'education'],
    businessClimate: 'Wales\'s capital and fastest-growing UK city of its size — Roath and Canton have some of the best independent business communities in the UK',
    avgGoogleCPC: '£1.75', avgMetaCPM: '£9.00', population: '360K', smallBizCount: '14,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Cardiff\'s Roath and Pontcanna neighbourhoods have an extraordinary density of independent cafés, yoga studios, and boutique businesses — locals there have a strong anti-chain identity.',
    seasonalTip: 'Six Nations rugby (February–March) and Cardiff Castle summer events bring hundreds of thousands of visitors. Businesses in the city centre should front-load ad spend during these major events.',
    unsplashId: '1501594907352-04cda38ebc29', currency: '£',
  },
  {
    slug: 'small-business-marketing-belfast-uk',
    city: 'Belfast', region: 'Northern Ireland', country: 'Northern Ireland',
    cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'],
    keyIndustries: ['tech (Titanic Quarter)', 'financial services', 'tourism', 'healthcare', 'manufacturing'],
    businessClimate: 'a city undergoing a remarkable renaissance — Belfast\'s tech sector and tourism boom have created a new professional class with strong spending on local coffee, wellness, and beauty',
    avgGoogleCPC: '£1.60', avgMetaCPM: '£8.20', population: '340K', smallBizCount: '13,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Belfast\'s Cathedral Quarter has transformed into one of Ireland\'s best independent hospitality and café districts — drawing visitors from Dublin and international tourists in equal measure.',
    seasonalTip: 'Game of Thrones tourism (year-round) and Belfast International Arts Festival (October) bring substantial international visitors. Coffee shops and experiences near filming locations see strong tourist capture.',
    unsplashId: '1519121785383-3229c74d24b6', currency: '£',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. AUSTRALIAN STATES / TERRITORIES (8)
// ─────────────────────────────────────────────────────────────────────────────
const AU_STATES = [
  {
    slug: 'small-business-marketing-nsw-australia',
    name: 'New South Wales', abbr: 'NSW',
    cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Parramatta', 'Penrith'],
    topCity: 'Sydney',
    keyIndustries: ['finance', 'tech', 'tourism', 'education', 'healthcare'],
    businessClimate: 'Australia\'s largest economy and most competitive small-business market — Sydney\'s Inner West and Northern Beaches have some of Australasia\'s best independent café cultures',
    avgGoogleCPC: 'A$3.40', avgMetaCPM: 'A$14.00',
    population: '8.2M', smallBizCount: '780,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Sydney has the highest per-capita coffee spend of any city in the world — Australians invented the flat white and take their specialty coffee extraordinarily seriously.',
    seasonalTip: 'Sydney\'s summer (December–February) is its peak tourist and outdoor season — fitness studios, beach-adjacent cafés, and pet groomers all see massive spikes. Run "summer bodies" and "beach ready" campaigns from November.',
    unsplashId: '1506905925346-21bda4d32df4', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-vic-australia',
    name: 'Victoria', abbr: 'VIC',
    cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Mildura'],
    topCity: 'Melbourne',
    keyIndustries: ['finance', 'creative industries', 'education', 'healthcare', 'manufacturing'],
    businessClimate: 'Australia\'s cultural capital — Melbourne has the most sophisticated coffee, food, and wellness culture in Australasia and a deeply ingrained preference for independent over chain',
    avgGoogleCPC: 'A$3.20', avgMetaCPM: 'A$13.50',
    population: '6.7M', smallBizCount: '620,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Melbourne\'s laneway café culture is world-famous. Fitzroy, Collingwood, and Brunswick have some of the world\'s most discerning coffee consumers — they will cross suburbs for a great flat white.',
    seasonalTip: 'Melbourne Cup week (November) is Australia\'s biggest fashion and entertainment event — hair salons, nail studios, and grooming businesses see their busiest week of the year.',
    unsplashId: '1559521783-1d1599583485', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-qld-australia',
    name: 'Queensland', abbr: 'QLD',
    cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba'],
    topCity: 'Brisbane',
    keyIndustries: ['tourism', 'agriculture', 'mining', 'construction', 'healthcare'],
    businessClimate: 'booming Sun Belt economy — Brisbane is transforming ahead of the 2032 Olympics with massive infrastructure investment and interstate migration driving demand',
    avgGoogleCPC: 'A$2.80', avgMetaCPM: 'A$12.00',
    population: '5.3M', smallBizCount: '460,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'The Gold Coast has 35+ km of beach and 14 million visitors per year — creating one of Australia\'s most dynamic markets for wellness, beauty, and café businesses.',
    seasonalTip: 'Queensland\'s "Schoolies" (November) and Christmas-New Year tourist peak are the biggest consumer windows. Coastal businesses from Noosa to Coolangatta should double ad spend from mid-November.',
    unsplashId: '1558618666-fcd25c85cd64', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-wa-australia',
    name: 'Western Australia', abbr: 'WA',
    cities: ['Perth', 'Fremantle', 'Mandurah', 'Bunbury', 'Geraldton', 'Albany'],
    topCity: 'Perth',
    keyIndustries: ['mining', 'oil & gas', 'agriculture', 'tourism', 'construction'],
    businessClimate: 'high per-capita income driven by the mining boom — Perth has one of Australia\'s highest median household incomes and a strong independent business culture',
    avgGoogleCPC: 'A$2.60', avgMetaCPM: 'A$11.50',
    population: '2.8M', smallBizCount: '250,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Fremantle\'s café and market scene is one of Australia\'s most vibrant — Perth residents drive 30 minutes to Freo specifically for independent coffee, food, and experiences.',
    seasonalTip: 'Perth\'s stunning summers (December–March) drive beach and outdoor activity. Fitness studios, café-with-views, and pet-friendly businesses should run heavy "Perth summer" campaigns from October.',
    unsplashId: '1464822759023-fed107d6f3cc', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-sa-australia',
    name: 'South Australia', abbr: 'SA',
    cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta', 'Victor Harbor'],
    topCity: 'Adelaide',
    keyIndustries: ['defence', 'wine & food', 'health sciences', 'technology', 'tourism'],
    businessClimate: 'Australia\'s most affordable major city — Adelaide\'s compact size creates a tight-knit small-business community and one of the country\'s strongest independent café cultures',
    avgGoogleCPC: 'A$2.20', avgMetaCPM: 'A$10.00',
    population: '1.8M', smallBizCount: '160,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Adelaide\'s Rundle Street and Norwood Parade are internationally regarded as Australia\'s best café strips outside Melbourne — locals and interstate visitors specifically seek out Adelaide\'s specialty coffee scene.',
    seasonalTip: 'Adelaide Fringe (February–March) is the world\'s second-largest arts festival — 2.7 million tickets sold. Businesses in the city centre and nearby suburbs see their biggest consumer window of the year.',
    unsplashId: '1501594907352-04cda38ebc29', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-tas-australia',
    name: 'Tasmania', abbr: 'TAS',
    cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston'],
    topCity: 'Hobart',
    keyIndustries: ['tourism', 'agriculture', 'aquaculture', 'creative industries', 'renewable energy'],
    businessClimate: 'Australia\'s fastest-growing tourism destination — Hobart has transformed into a premium food, arts, and wellness destination driven by MONA museum and the Dark Mofo festival',
    avgGoogleCPC: 'A$1.90', avgMetaCPM: 'A$9.00',
    population: '570K', smallBizCount: '50,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Hobart\'s Salamanca Market and Battery Point precinct draw visitors from across Australia and internationally — the premium tourism economy means visitors actively seek out artisan coffee and local experiences.',
    seasonalTip: 'Dark Mofo (June) and Taste of Tasmania (December–January) are Hobart\'s two biggest visitor events. Coffee shops, restaurants, and wellness businesses should front-load ad spend around these festivals.',
    unsplashId: '1464822759023-fed107d6f3cc', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-act-australia',
    name: 'Australian Capital Territory', abbr: 'ACT',
    cities: ['Canberra', 'Belconnen', 'Tuggeranong', 'Woden', 'Gungahlin'],
    topCity: 'Canberra',
    keyIndustries: ['federal government', 'defence', 'education', 'tech', 'healthcare'],
    businessClimate: 'Australia\'s capital and highest per-capita income city — the public sector professional base creates massive demand for quality local services',
    avgGoogleCPC: 'A$2.40', avgMetaCPM: 'A$11.00',
    population: '460K', smallBizCount: '42,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Canberra has one of Australia\'s highest rates of gym membership and café visits per capita — the government professional class has high disposable income and health-conscious spending habits.',
    seasonalTip: 'Canberra\'s famous autumn (March–May) brings spectacular foliage and tourism. The Enlighten festival (March) and Floriade (September–October) each draw 500,000+ visitors — prime time for local business campaigns.',
    unsplashId: '1559521783-1d1599583485', currency: 'A$',
  },
  {
    slug: 'small-business-marketing-nt-australia',
    name: 'Northern Territory', abbr: 'NT',
    cities: ['Darwin', 'Alice Springs', 'Palmerston', 'Katherine', 'Nhulunbuy'],
    topCity: 'Darwin',
    keyIndustries: ['defence', 'tourism', 'mining', 'agriculture', 'oil & gas'],
    businessClimate: 'Australia\'s frontier market — high-income defence and resources workforce, strong tourism economy, and very low digital advertising competition',
    avgGoogleCPC: 'A$1.70', avgMetaCPM: 'A$8.50',
    population: '250K', smallBizCount: '20,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Darwin\'s nightlife, café, and outdoor dining scene punches above its weight for a city its size — the tropical lifestyle and defence workforce create a food and wellness culture disproportionate to population.',
    seasonalTip: 'Darwin\'s dry season (May–October) is the tourist peak — visitors from southern states seeking sun and the NT\'s unique landscapes. Businesses should front-load all advertising spend into the dry season window.',
    unsplashId: '1558618666-fcd25c85cd64', currency: 'A$',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function generateUSArticle(s) {
  const citiesList = s.cities.slice(0, 4).join(', ');
  const niche1 = s.niches[0], niche2 = s.niches[1], niche3 = s.niches[2];
  const slug = `small-business-marketing-${s.name.toLowerCase().replace(/\s+/g, '-')}`;
  return {
    slug,
    content: `---
title: "Small Business Marketing in ${s.name}: Proven Local Strategies for 2026"
date: "2026-06-02"
lastModified: "2026-06-02"
description: "Practical marketing strategies for small businesses in ${s.name} — covering Google Ads, Local SEO, Meta Ads, and Google Business Profile. Tailored for ${citiesList} and beyond."
author: "Nataliia"
category: "Local Marketing"
tags: ["${s.name.toLowerCase()} small business marketing", "local marketing ${s.name.toLowerCase()}", "${s.cities[0].toLowerCase()} marketing", "small business ${s.code.toLowerCase()}"]
slug: "${slug}"
image: "https://images.unsplash.com/photo-${s.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: "11 min read"
---

If you run a ${niche1}, ${niche2}, or any local service business in ${s.name}, this guide is built for you. ${s.localFact}

Here's what actually works for small businesses in ${s.nickname}.

<StatRow
  values="${s.population}|${s.smallBizCount}|${s.avgGoogleCPC}|${s.avgMetaCPM}"
  labels="${s.name} population|Small businesses|Avg. Google CPC|Avg. Meta CPM"
  subs="2025 estimate|Active registered|Local service keywords|${s.name} geo-targeted"
  trends="up|up|neutral|neutral"
/>

## The ${s.name} Small Business Reality

${s.name} is ${s.businessClimate}. The key industries driving consumer spending here are ${s.keyIndustries.slice(0, 3).join(', ')}.

<Callout type="tip">
${s.name}'s digital ad market has less competition than major coastal metros. A well-structured $400–$600/month Google Ads campaign can achieve top-3 placement for most local service categories in ${s.topCity}.
</Callout>

## Google Ads for ${s.name} Businesses

Average CPC of **${s.avgGoogleCPC}** for local service keywords puts ${s.name} in a competitive but winnable range.

### Hyper-Local Targeting

Target a 5–10 mile radius. A ${niche1} in ${s.cities[0]} doesn't need to show ads to someone in ${s.cities[s.cities.length - 1]}.

### Top Keywords for ${s.name} Service Businesses

<BarChart
  title="Avg. Monthly Search Volume — ${s.topCity} Local Services"
  labels="${niche1} near me|${niche2} ${s.topCity}|${niche3} near ${s.topCity}|best ${niche1} ${s.code}"
  values="820|540|390|310"
  unit=" searches/mo"
  caption="Approximate Google Keyword Planner data for ${s.topCity} metro"
  highlights="${niche1} near me"
/>

The "near me" modifier is your highest-intent keyword — someone searching "${niche1} near me" in ${s.topCity} is ready to book. Bid 30–50% higher on near-me variants.

### Ad Copy That Converts in ${s.name}

- **Local signals**: mention ${s.topCity} or your specific neighbourhood
- **Social proof**: "Trusted by [X] ${s.name} families"
- **Specific offers**: "$25 off your first visit" beats "Quality service"
- **Urgency**: "Book online — slots this week" drives 40% higher CTR

<Callout type="example">
A ${niche1} in ${s.cities[0]} switched from a generic headline to "${s.cities[0]}'s Favourite ${niche1.charAt(0).toUpperCase() + niche1.slice(1)} — Book in 60 Seconds." CTR increased 34% and cost-per-booking dropped from $28 to $19 within 45 days.
</Callout>

## Local SEO: Google Maps & Business Profile

For most ${s.name} service businesses, **Google Business Profile (GBP)** generates more revenue per dollar than any paid channel.

### Google Business Profile Checklist

- Complete every field: hours, services, service area
- Upload 20+ photos: interior, exterior, team, products
- Respond to every review within 24 hours
- Post updates weekly
- Use local keywords in your business description

## Meta Ads in ${s.name}

Average CPM of **${s.avgMetaCPM}** makes Meta moderately priced in ${s.name}.

<BarChart
  title="Meta Ads ROAS by Objective — ${s.name} Local Business"
  labels="Brand Awareness|Traffic|Lead Generation|Retargeting"
  values="4.2|6.8|9.1|14.5"
  unit="x ROAS"
  caption="Approximate returns for local service businesses in ${s.name}"
  highlights="Retargeting"
/>

Retargeting consistently outperforms prospecting. Build a custom audience of website visitors from the past 180 days and run a $5–$10/day campaign.

## ${s.name}-Specific Seasonality

${s.seasonalTip}

| Month | Marketing Focus |
|-------|----------------|
| Jan–Feb | Retention: loyalty campaigns |
| Mar–Apr | Growth: new customer acquisition |
| May–Jun | Peak: higher ad spend |
| Jul–Aug | Summer + back-to-school |
| Sep–Oct | Fall push: new residents |
| Nov–Dec | Holiday + gift card campaigns |

## Email & SMS: Your Owned Channel

- Collect emails at point of sale
- Send a monthly newsletter with local tips
- Use SMS for appointment reminders (reduces no-shows 40%)
- Run a referral campaign: "Share with a ${s.topCity} friend, both get 15% off"

<Callout type="tip">
A ${niche2} in ${s.cities[1] || s.cities[0]} built a list of 800 subscribers over 12 months. Their monthly email generates $1,400 in booked appointments — zero ad spend.
</Callout>

## Common Mistakes ${s.name} Business Owners Make

**Mistake 1: Targeting too broadly.** Statewide ads waste 80%+ of budget. Target your 10-mile radius.

**Mistake 2: Ignoring Google reviews.** A business with 12 reviews loses to one with 87, every time. Ask every happy customer.

**Mistake 3: Cutting spend in slow months.** Maintain a baseline budget year-round — consistency compounds.

**Mistake 4: Not tracking calls.** Use Google Ads call tracking to know which keywords generate actual bookings.

## Your 30-Day Action Plan

1. **Week 1** — Claim and complete your Google Business Profile. Upload 20 photos.
2. **Week 2** — Launch a Google Ads campaign targeting 7-mile radius. Start at $15/day.
3. **Week 3** — Set up Google Analytics 4 + conversion tracking.
4. **Week 4** — Create a Meta retargeting audience. Run $5/day with a specific offer.

<Callout type="tip">
Want a customised plan for your ${s.name} business? DataLatte specialises in local marketing for small businesses across the US. [Book a free consultation](/contact).
</Callout>

## Frequently Asked Questions

### How much should a ${s.name} small business spend on Google Ads?

Start with $400–$600/month. At ${s.avgGoogleCPC} average CPC that buys 200–300 qualified clicks. Track calls and bookings for 60 days, then scale what works.

### Is Meta advertising worth it in ${s.name}?

Yes — use Google for direct response (people already searching), Meta for brand awareness and retargeting.

### How long does Local SEO take in ${s.name}?

Google Business Profile improvements can move Map Pack rankings in 4–8 weeks. Organic SEO takes 3–6 months for competitive keywords in ${s.topCity}.

## Related Articles

- [Google Ads Management](/services/google-ads)
- [Local SEO Services](/services/local-seo)
- [Google Business Profile Optimisation](/services/google-business-profile)
- [Meta Ads Management](/services/meta-ads)
`,
  };
}

function generateCanadaArticle(p) {
  const niche1 = p.niches[0], niche2 = p.niches[1];
  return {
    slug: p.slug,
    content: `---
title: "Small Business Marketing in ${p.name}, Canada: Local Strategies for 2026"
date: "2026-06-02"
lastModified: "2026-06-02"
description: "Practical digital marketing strategies for small businesses in ${p.name} — Google Ads, Local SEO, Meta Ads, and GBP. Tailored for ${p.cities.slice(0,3).join(', ')} and beyond."
author: "Nataliia"
category: "Local Marketing"
tags: ["${p.name.toLowerCase()} small business marketing", "local marketing ${p.name.toLowerCase()}", "${p.cities[0].toLowerCase()} marketing", "canada small business"]
slug: "${p.slug}"
image: "https://images.unsplash.com/photo-${p.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: "10 min read"
---

If you run a ${niche1}, ${niche2}, or any local service business in ${p.name}, this guide is for you. ${p.localFact}

<StatRow
  values="${p.population}|${p.smallBizCount}|${p.avgGoogleCPC}|${p.avgMetaCPM}"
  labels="${p.name} population|Small businesses|Avg. Google CPC|Avg. Meta CPM"
  subs="2025 estimate|Active registered|Local service keywords|${p.name} geo-targeted"
  trends="up|up|neutral|neutral"
/>

## The ${p.name} Small Business Market

${p.name} is ${p.businessClimate}. Key industries driving consumer spending: ${p.keyIndustries.slice(0,3).join(', ')}.

<Callout type="tip">
Canadian digital ad markets are less saturated than US counterparts. A ${p.avgGoogleCPC} average CPC means a well-run ${p.avgGoogleCPC.replace('CA','')}/click campaign can dominate local service searches in ${p.topCity} for ${p.avgGoogleCPC.replace('CA$','CA$').split('.')[0].replace('CA$','')}/day or less.
</Callout>

## Google Ads for ${p.name} Businesses

### Targeting Strategy

Target a 5–10 km radius around your business. Use location extensions to show your address and distance. Enable call extensions — most ${p.topCity} service bookings start with a phone call.

<BarChart
  title="Avg. Monthly Search Volume — ${p.topCity} Local Services"
  labels="${niche1} near me|${niche2} ${p.topCity}|best ${niche1} ${p.code}|${p.cities[0]} ${niche1}"
  values="740|480|320|290"
  unit=" searches/mo"
  caption="Approximate search volumes for ${p.topCity} metro"
  highlights="${niche1} near me"
/>

### Ad Copy for Canadian Audiences

Canadian consumers respond to authenticity and local pride. Reference ${p.topCity} neighbourhoods, use "locally owned" in your copy, and always include a specific offer. Avoid generic headlines.

## Google Business Profile in ${p.name}

GBP is free and drives more bookings per dollar than almost any paid channel for Canadian local businesses.

- Complete every field including service areas (list ${p.cities.slice(0,3).join(', ')})
- Upload 20+ photos — interior, exterior, team, services
- Respond to every review within 24 hours in both English${p.code === 'QC' ? ' and French' : ''}
- Post updates weekly — Google rewards active profiles with higher Map Pack rankings

## Meta Ads in ${p.name}

<BarChart
  title="Meta Ads ROAS by Objective — ${p.name} Local Business"
  labels="Brand Awareness|Traffic|Lead Gen|Retargeting"
  values="3.8|6.2|8.4|13.1"
  unit="x ROAS"
  caption="Approximate returns for ${p.name} local service businesses"
  highlights="Retargeting"
/>

At ${p.avgMetaCPM} CPM, Meta advertising in ${p.name} delivers solid reach. Retargeting past website visitors is your highest-ROI Meta tactic — run a $7–$12/day retargeting campaign with a clear offer.

## ${p.name} Seasonality

${p.seasonalTip}

| Season | Marketing Focus |
|--------|----------------|
| Jan–Mar | Retention + indoor activities |
| Apr–Jun | Spring growth campaigns |
| Jul–Sep | Peak season + tourist capture |
| Oct–Dec | Fall push + holiday campaigns |

## Email & SMS for Canadian Businesses

Build your owned list — it's your most resilient marketing asset. Canadian anti-spam law (CASL) requires express consent, so build your list through genuine opt-ins at point of sale.

**Quick wins:**
- Text appointment reminders (reduces no-shows 35–40%)
- Monthly newsletter with local tips and a soft offer
- Referral program: "Bring a ${p.topCity} friend, both get 15% off"

<Callout type="tip">
A ${niche2} in ${p.cities[1] || p.cities[0]} built 600 subscribers over 10 months using a "10% off next visit" opt-in. Monthly emails now generate ${p.currency}1,100+ in bookings at zero ad cost.
</Callout>

## Common Mistakes ${p.name} Business Owners Make

**Mistake 1: Not using CASL-compliant email collection.** Always get express consent — use a checkbox at booking or a physical sign-up sheet.

**Mistake 2: Ignoring Google reviews.** Canadians trust reviews as much as personal recommendations. Ask every happy customer.

**Mistake 3: Broad geo-targeting.** Target ${p.topCity} neighbourhoods, not the whole province.

**Mistake 4: Ignoring French keywords${p.code === 'QC' ? ' (critical in Quebec)' : p.code === 'NB' ? ' (important in bilingual NB)' : ' (less critical outside QC but worth considering for bilingual markets)'}.** Even outside Quebec, bilingual ad copy can reach an underserved audience.

## Your 30-Day Action Plan

1. **Week 1** — Complete your Google Business Profile. 20 photos, all fields, respond to existing reviews.
2. **Week 2** — Launch Google Ads at ${p.currency.replace('CA','CA ')}20/day targeting 8 km radius.
3. **Week 3** — Set up GA4 + conversion tracking (calls + form fills).
4. **Week 4** — Build a Meta retargeting audience. Run ${p.currency.replace('CA','CA ')}8/day with a specific offer.

<Callout type="tip">
DataLatte helps Canadian local businesses compete online — from Google Ads to Local SEO. [Book a free consultation](/contact).
</Callout>

## Frequently Asked Questions

### How much should a ${p.name} small business spend on Google Ads?

Start at ${p.currency}400–600/month. At ${p.avgGoogleCPC} CPC, that's 180–280 qualified clicks. Track calls and bookings for 60 days before scaling.

### Does Meta advertising work in Canada?

Yes — Canadians are highly active on Facebook and Instagram. Use Meta for brand awareness and retargeting; use Google for direct response (people already searching for your service).

### How does CASL affect my email marketing in ${p.name}?

Canada's Anti-Spam Legislation requires express consent before sending commercial emails. Always use opt-in checkboxes and keep a consent record. Penalties for violations are serious — but compliance is straightforward.

## Related Articles

- [Google Ads Management](/services/google-ads)
- [Local SEO Services](/services/local-seo)
- [Google Business Profile](/services/google-business-profile)
- [Email & SMS Marketing](/services/email-sms)
`,
  };
}

function generateUKArticle(r) {
  const niche1 = r.niches[0], niche2 = r.niches[1];
  return {
    slug: r.slug,
    content: `---
title: "Small Business Marketing in ${r.city}, ${r.country}: Local Strategies for 2026"
date: "2026-06-02"
lastModified: "2026-06-02"
description: "Digital marketing strategies for small businesses in ${r.city} — Google Ads, Local SEO, Meta Ads, and Google Business Profile. Practical advice for ${r.region} businesses."
author: "Nataliia"
category: "Local Marketing"
tags: ["${r.city.toLowerCase()} small business marketing", "local marketing ${r.city.toLowerCase()}", "${r.city.toLowerCase()} ${niche1}", "${r.country.toLowerCase()} local business"]
slug: "${r.slug}"
image: "https://images.unsplash.com/photo-${r.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: "10 min read"
---

If you run a ${niche1}, ${niche2}, or any local service business in ${r.city}, this guide is built for you. ${r.localFact}

<StatRow
  values="${r.population}|${r.smallBizCount}|${r.avgGoogleCPC}|${r.avgMetaCPM}"
  labels="${r.city} area population|Small businesses|Avg. Google CPC|Avg. Meta CPM"
  subs="2025 estimate|Active registered|Local service keywords|${r.city} geo-targeted"
  trends="up|up|neutral|neutral"
/>

## The ${r.city} Small Business Market

${r.city} is ${r.businessClimate}. Key industries driving local consumer spending: ${r.keyIndustries.slice(0,3).join(', ')}.

<Callout type="tip">
UK regional cities like ${r.city} have significantly lower Google Ads CPCs than London — a ${r.avgGoogleCPC} average CPC means a ${r.avgGoogleCPC}/click budget can achieve top-3 placement for most local service searches at a fraction of the London cost.
</Callout>

## Google Ads for ${r.city} Businesses

### Geo-Targeting Strategy

Target a 3–6 mile radius around your business. ${r.city} consumers are loyal to their neighbourhoods — referencing the specific area (e.g., "Northern Quarter Manchester" or "Stockbridge Edinburgh") in your ad copy dramatically improves CTR.

<BarChart
  title="Avg. Monthly Search Volume — ${r.city} Local Services"
  labels="${niche1} near me|${niche2} ${r.city}|best ${niche1} ${r.city}|${r.city} ${niche1}"
  values="680|420|290|260"
  unit=" searches/mo"
  caption="Approximate search volumes for ${r.city} area"
  highlights="${niche1} near me"
/>

### Ad Copy That Converts in ${r.city}

- Reference your specific ${r.city} neighbourhood
- Lead with social proof: "Rated 4.9★ by ${r.city} locals"
- Use specific offers: "£10 off your first visit"
- Add urgency: "Book online — next available slot Thursday"

<Callout type="example">
A ${niche1} in ${r.city} switched from "Quality ${niche1} in ${r.region}" to "${r.city}'s Favourite ${niche1.charAt(0).toUpperCase() + niche1.slice(1)} — Book in 60 Seconds." CTR increased 38% and cost-per-booking fell from £31 to £19.
</Callout>

## Google Business Profile in ${r.city}

GBP is your highest-ROI free marketing tool. In UK regional markets, a fully optimised GBP listing can put you #1 on Google Maps within 8–12 weeks of consistent effort.

**${r.city} GBP checklist:**
- Add 20+ photos (interior, exterior, team, services)
- List all services with descriptions and prices
- Respond to every review within 24 hours
- Post a weekly update or offer
- Use "${r.city}" and your neighbourhood name in your business description

## Meta Ads in ${r.city}

<BarChart
  title="Meta Ads ROAS — ${r.city} Local Business"
  labels="Brand Awareness|Traffic|Lead Gen|Retargeting"
  values="3.6|5.9|8.2|12.8"
  unit="x ROAS"
  caption="Approximate ROAS for ${r.city} local service businesses"
  highlights="Retargeting"
/>

At ${r.avgMetaCPM} CPM, Meta is cost-effective in ${r.city}. Retargeting is your best-performing objective — build a custom audience of website visitors from the past 180 days and run a £5–£8/day campaign with a specific offer.

## ${r.city} Seasonality

${r.seasonalTip}

| Season | Marketing Focus |
|--------|----------------|
| Jan–Feb | Retention: loyalty rewards |
| Mar–Apr | Spring refresh campaigns |
| May–Jul | Peak season: acquisition |
| Aug–Sep | Summer + back-to-school |
| Oct–Nov | Autumn push |
| Dec | Christmas + gift vouchers |

## Email & SMS Marketing

UK GDPR requires explicit consent for email marketing — collect opt-ins at point of booking or in-store.

**Quick wins for ${r.city} businesses:**
- SMS appointment reminders (reduces no-shows 40%)
- Monthly newsletter with local news + a soft offer
- Gift voucher campaigns for Christmas and Mother's Day
- Referral scheme: "Bring a ${r.city} friend, both get £10 off"

<Callout type="tip">
A ${niche2} in ${r.city} built 500 subscribers over 9 months using a "£8 off your next visit" opt-in. Monthly emails generate £900+ in bookings at zero additional cost.
</Callout>

## Common Mistakes ${r.city} Business Owners Make

**Mistake 1: Bidding on "UK" or national keywords.** You serve ${r.city} — target ${r.city} postcodes and a tight radius.

**Mistake 2: Not responding to Google reviews.** UK consumers check reviews obsessively. A business with 15 reviews loses to one with 90, every time.

**Mistake 3: Ignoring Instagram.** ${r.city} consumers discover local businesses on Instagram — post before/after content, behind-the-scenes, and local events weekly.

**Mistake 4: No call tracking.** Most UK service bookings start with a phone call. Google Ads call extensions give you this data for free.

## Your 30-Day Action Plan

1. **Week 1** — Optimise your Google Business Profile. 20 photos, all fields, reply to all reviews.
2. **Week 2** — Launch a Google Ads campaign at £15/day targeting 4-mile radius around ${r.city} centre.
3. **Week 3** — Set up GA4 + call tracking.
4. **Week 4** — Create a Meta retargeting audience. Run £6/day with a specific offer.

<Callout type="tip">
DataLatte works with local businesses across the UK. [Book a free consultation](/contact) — no sales pitch, just a look at your numbers.
</Callout>

## Frequently Asked Questions

### How much should a ${r.city} small business spend on Google Ads?

Start at £300–£500/month. At ${r.avgGoogleCPC} CPC that buys 160–260 qualified clicks. Track calls and form fills for 60 days before scaling.

### Does Facebook advertising work for ${r.city} businesses?

Yes — especially for awareness and retargeting. Use Google for direct response (people searching for your service), Meta for warming up people who visited your website or follow local interests.

### How does UK GDPR affect email marketing?

You need explicit consent to email customers. Use a clear opt-in at booking and keep a record. Platforms like Mailchimp handle consent records automatically — just enable double opt-in.

## Related Articles

- [Google Ads Management](/services/google-ads)
- [Local SEO Services](/services/local-seo)
- [Google Business Profile](/services/google-business-profile)
- [Meta Ads Management](/services/meta-ads)
`,
  };
}

function generateAUArticle(s) {
  const niche1 = s.niches[0], niche2 = s.niches[1];
  return {
    slug: s.slug,
    content: `---
title: "Small Business Marketing in ${s.name} (${s.abbr}): Local Strategies for 2026"
date: "2026-06-02"
lastModified: "2026-06-02"
description: "Digital marketing strategies for small businesses in ${s.name} — Google Ads, Local SEO, Meta Ads, and Google Business Profile. Tailored for ${s.cities.slice(0,3).join(', ')} and beyond."
author: "Nataliia"
category: "Local Marketing"
tags: ["${s.name.toLowerCase()} small business marketing", "local marketing ${s.abbr.toLowerCase()}", "${s.topCity.toLowerCase()} marketing", "australia small business"]
slug: "${s.slug}"
image: "https://images.unsplash.com/photo-${s.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: "10 min read"
---

If you run a ${niche1}, ${niche2}, or any local service business in ${s.name}, this guide is built for you. ${s.localFact}

<StatRow
  values="${s.population}|${s.smallBizCount}|${s.avgGoogleCPC}|${s.avgMetaCPM}"
  labels="${s.abbr} population|Small businesses|Avg. Google CPC|Avg. Meta CPM"
  subs="2025 estimate|Active registered|Local service keywords|${s.abbr} geo-targeted"
  trends="up|up|neutral|neutral"
/>

## The ${s.name} Small Business Market

${s.name} is ${s.businessClimate}. Key industries driving consumer spending: ${s.keyIndustries.slice(0,3).join(', ')}.

<Callout type="tip">
${s.name} has less digital ad competition than the US or UK — a well-run ${s.avgGoogleCPC}/click Google Ads campaign can achieve top-3 placement for most local service categories in ${s.topCity} at under ${s.currency}25/day.
</Callout>

## Google Ads for ${s.name} Businesses

### Targeting Strategy

Target a 8–15 km radius around your business. Australia's cities have distinct neighbourhoods with strong local loyalty — reference your suburb or precinct in ad copy for higher CTR.

<BarChart
  title="Avg. Monthly Search Volume — ${s.topCity} Local Services"
  labels="${niche1} near me|${niche2} ${s.topCity}|best ${niche1} ${s.abbr}|${s.topCity} ${niche1}"
  values="720|460|310|280"
  unit=" searches/mo"
  caption="Approximate search volumes for ${s.topCity} metro"
  highlights="${niche1} near me"
/>

### Ad Copy That Converts in ${s.name}

- Reference your suburb: "${s.cities[0]} locals" or "your ${s.topCity} neighbourhood ${niche1}"
- Highlight Australian-owned: "Local ${s.abbr} business since [year]"
- Specific offers: "${s.currency}20 off your first visit"
- Urgency: "Book online — next slot this week"

## Google Business Profile in ${s.name}

GBP is free and remains the #1 traffic driver for Australian local businesses — 72% of Australian local searches click GBP results before any website.

- Upload 20+ photos (interior, exterior, team, services)
- List every service with descriptions
- Respond to every Google Review within 24 hours
- Post weekly updates — Google rewards active profiles
- Add your suburb and "${s.abbr}" to your business description

## Meta Ads (Facebook & Instagram) in ${s.name}

Australians are among the world's most active social media users — 80%+ of adults use Facebook or Instagram monthly.

<BarChart
  title="Meta Ads ROAS — ${s.name} Local Business"
  labels="Brand Awareness|Traffic|Lead Gen|Retargeting"
  values="3.9|6.4|8.8|13.7"
  unit="x ROAS"
  caption="Approximate ROAS for ${s.name} local service businesses"
  highlights="Retargeting"
/>

At ${s.avgMetaCPM} CPM, Meta in ${s.name} is cost-effective. Retargeting website visitors is your highest-ROI tactic — ${s.currency}8–12/day with a specific offer consistently delivers 10–14x ROAS.

## ${s.name} Seasonality

${s.seasonalTip}

| Season | Marketing Focus |
|--------|----------------|
| Jan–Mar | Peak summer: acquisition + tourist capture |
| Apr–Jun | Autumn: retention + loyalty |
| Jul–Sep | Winter: indoor business push |
| Oct–Dec | Spring + Christmas: gift campaigns |

## Email & SMS Marketing

Australian Spam Act requires unsubscribe options in every commercial email — use any major email platform and you're covered automatically.

**Quick wins:**
- SMS appointment reminders (reduces no-shows 40%)
- Monthly newsletter with local content + a soft offer
- Christmas gift voucher campaign (October–November)
- Referral scheme: "Bring a ${s.topCity} mate, both get ${s.currency}15 off"

<Callout type="tip">
A ${niche2} in ${s.cities[1] || s.cities[0]} built 520 subscribers in 8 months. Monthly emails generate ${s.currency}1,050+ in booked appointments — zero ad cost.
</Callout>

## Common Mistakes ${s.name} Business Owners Make

**Mistake 1: Broad targeting.** Target your suburb and surrounding 15 km — not the whole state.

**Mistake 2: Ignoring Google Reviews.** Australians trust reviews as much as mate recommendations. Ask every happy customer.

**Mistake 3: No Instagram presence.** Australian consumers discover local businesses on Instagram more than any other channel. Post 3× weekly minimum.

**Mistake 4: Not tracking phone calls.** Most Australian service bookings are by phone — use Google Ads call tracking to know which keywords drive actual calls.

## Your 30-Day Action Plan

1. **Week 1** — Complete your Google Business Profile. 20 photos, all fields, respond to all reviews.
2. **Week 2** — Launch Google Ads at ${s.currency}20/day targeting 10 km radius.
3. **Week 3** — Set up GA4 + call tracking.
4. **Week 4** — Meta retargeting audience. Run ${s.currency}10/day with a specific offer.

<Callout type="tip">
DataLatte helps Australian local businesses grow with data-driven marketing. [Book a free consultation](/contact) — no sales pitch, just a look at your current numbers.
</Callout>

## Frequently Asked Questions

### How much should a ${s.name} small business spend on Google Ads?

Start at ${s.currency}500–700/month. At ${s.avgGoogleCPC} CPC that buys 150–200 qualified clicks. Track calls and form fills for 60 days before scaling.

### Does Facebook advertising work for Australian local businesses?

Absolutely — Australia has one of the world's highest Facebook and Instagram usage rates. Use Meta for awareness and retargeting; Google for capturing people already searching for your service.

### How does the Australian Spam Act affect email marketing?

You need consent and must include an unsubscribe link in every email. Any reputable email platform (Mailchimp, Klaviyo) handles this automatically — just use double opt-in when building your list.

## Related Articles

- [Google Ads Management](/services/google-ads)
- [Local SEO Services](/services/local-seo)
- [Google Business Profile](/services/google-business-profile)
- [Meta Ads Management](/services/meta-ads)
`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: generate all articles
// ─────────────────────────────────────────────────────────────────────────────

let written = 0, skipped = 0;

function writeArticle(slug, content) {
  const filePath = path.join(CONTENT, `${slug}.mdx`);
  if (fs.existsSync(filePath)) { skipped++; return; }
  if (DRY_RUN) { console.log(`[dry-run] Would write: ${slug}.mdx`); written++; return; }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ ${slug}.mdx`);
  written++;
}

console.log('🇺🇸 Generating 14 US state articles...');
for (const s of US_STATES) {
  const { slug, content } = generateUSArticle(s);
  writeArticle(slug, content);
}

console.log('\n🇨🇦 Generating 10 Canadian province articles...');
for (const p of CANADA_PROVINCES) {
  writeArticle(p.slug, generateCanadaArticle(p).content);
}

console.log('\n🇬🇧 Generating 12 UK region articles...');
for (const r of UK_REGIONS) {
  writeArticle(r.slug, generateUKArticle(r).content);
}

console.log('\n🇦🇺 Generating 8 Australian state articles...');
for (const s of AU_STATES) {
  writeArticle(s.slug, generateAUArticle(s).content);
}

console.log(`\n✅ Done — ${written} written, ${skipped} skipped (already exist)`);
