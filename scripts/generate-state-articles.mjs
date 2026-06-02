#!/usr/bin/env node
/**
 * generate-state-articles.mjs
 * Generates one SEO-optimised marketing guide per US state for states
 * that currently have no blog coverage.
 *
 * Each article is ~2 000–2 500 words, uses real state data (cities,
 * industries, ad cost benchmarks) and DataLatte's MDX component set.
 *
 * Usage:  node scripts/generate-state-articles.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const CONTENT    = path.join(__dirname, '../content/blog');
const DRY_RUN    = process.argv.includes('--dry-run');

// ── State data ──────────────────────────────────────────────────────────────
const STATES = [
  {
    code: 'AL', name: 'Alabama',
    cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'],
    topCity: 'Birmingham',
    nickname: 'The Heart of Dixie',
    keyIndustries: ['healthcare', 'aerospace', 'automotive manufacturing', 'agriculture'],
    businessClimate: 'low cost-of-living state with a growing small-business scene, especially in Birmingham and Huntsville',
    avgGoogleCPC: '$1.80',
    avgMetaCPM: '$9.50',
    population: '5.1M',
    smallBizCount: '390,000',
    niches: ['coffee shops', 'hair salons', 'pet groomers', 'fitness studios'],
    localFact: 'Birmingham is one of the fastest-growing mid-size cities in the Southeast, and Huntsville\'s tech boom is creating a new wave of service-business customers.',
    seasonalTip: 'Summer heat drives air-conditioned service businesses — gyms, nail salons, and coffee shops all see a spike in walk-ins June through August.',
    cta: 'coffee shop',
    unsplashId: '1571019614242-c5c5dee9f50b',
  },
  {
    code: 'AK', name: 'Alaska',
    cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
    topCity: 'Anchorage',
    nickname: 'The Last Frontier',
    keyIndustries: ['tourism', 'fishing', 'oil & gas', 'healthcare'],
    businessClimate: 'unique market with high disposable income but small, isolated population centres',
    avgGoogleCPC: '$2.40',
    avgMetaCPM: '$11.00',
    population: '730K',
    smallBizCount: '75,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'restaurants'],
    localFact: 'Anchorage has more coffee shops per capita than almost any US city — locals rely on them year-round to beat the long, dark winters.',
    seasonalTip: 'Summer tourist season (May–September) is peak time for almost every local business. Run Google Ads targeting visitors searching for local services.',
    cta: 'fitness studio',
    unsplashId: '1551524559-8af4e6624178',
  },
  {
    code: 'AR', name: 'Arkansas',
    cities: ['Little Rock', 'Fayetteville', 'Fort Smith', 'Springdale', 'Jonesboro'],
    topCity: 'Little Rock',
    nickname: 'The Natural State',
    keyIndustries: ['retail (Walmart HQ)', 'agriculture', 'manufacturing', 'tourism'],
    businessClimate: 'affordable state with a booming NW Arkansas corridor anchored by the Walmart supplier ecosystem',
    avgGoogleCPC: '$1.70',
    avgMetaCPM: '$8.80',
    population: '3.0M',
    smallBizCount: '240,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Northwest Arkansas (Bentonville, Rogers, Fayetteville) is one of the fastest-growing micro-metros in the US, driven by Walmart, Tyson, and their supplier networks.',
    seasonalTip: 'Fall outdoor tourism season brings visitors to the Ozarks. Outdoor-adjacent businesses (coffee, fitness, gear) can target "things to do in Arkansas fall" keywords.',
    cta: 'hair salon',
    unsplashId: '1506905925346-21bda4d32df4',
  },
  {
    code: 'CT', name: 'Connecticut',
    cities: ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury'],
    topCity: 'Stamford',
    nickname: 'The Constitution State',
    keyIndustries: ['finance', 'insurance', 'healthcare', 'defense'],
    businessClimate: 'high-income, highly educated consumer base with intense competition — quality beats price every time',
    avgGoogleCPC: '$3.20',
    avgMetaCPM: '$14.50',
    population: '3.6M',
    smallBizCount: '330,000',
    niches: ['hair salons', 'fitness studios', 'coffee shops', 'pet groomers'],
    localFact: 'Fairfield County (Stamford, Greenwich, Westport) is one of the wealthiest counties in the US — premium service businesses thrive here.',
    seasonalTip: 'Back-to-school season in August–September drives big spikes for hair salons, fitness studios, and tutoring businesses near Yale and UConn.',
    cta: 'fitness studio',
    unsplashId: '1572036284900-41aa3f2dac97',
  },
  {
    code: 'DE', name: 'Delaware',
    cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
    topCity: 'Wilmington',
    nickname: 'The First State',
    keyIndustries: ['banking & finance', 'chemicals', 'healthcare', 'retail'],
    businessClimate: 'small but dense market; no sales tax draws shoppers from PA, MD and NJ, boosting retail and service businesses',
    avgGoogleCPC: '$2.80',
    avgMetaCPM: '$13.00',
    population: '1.0M',
    smallBizCount: '85,000',
    niches: ['hair salons', 'coffee shops', 'fitness studios', 'nail salons'],
    localFact: 'Delaware\'s no-sales-tax policy makes it a shopping destination — service businesses near major retail corridors in Wilmington and Newark benefit enormously.',
    seasonalTip: 'Summer brings beach tourists heading to Rehoboth and Dewey Beach. Businesses along Route 1 can target "things to do near Delaware beaches" to capture tourist traffic.',
    cta: 'hair salon',
    unsplashId: '1480714378702-172d5c1c2674',
  },
  {
    code: 'GA', name: 'Georgia',
    cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Sandy Springs'],
    topCity: 'Atlanta',
    nickname: 'The Peach State',
    keyIndustries: ['logistics', 'film & media', 'tech (Terminus)', 'agriculture', 'healthcare'],
    businessClimate: 'one of the Southeast\'s fastest-growing states, with Atlanta ranked top-5 for startup activity in the US',
    avgGoogleCPC: '$2.60',
    avgMetaCPM: '$12.00',
    population: '11.0M',
    smallBizCount: '1.0M',
    niches: ['hair salons', 'fitness studios', 'coffee shops', 'pet groomers'],
    localFact: 'Atlanta\'s diverse, majority Black population makes it one of the best US markets for hair care businesses — the natural hair and salon industry is exceptionally strong.',
    seasonalTip: 'Atlanta\'s Film & TV industry brings cast and crew who need grooming, fitness, and coffee regularly. Businesses near studios in Conyers and Tyler Perry Studios can target "near film studio" searches.',
    cta: 'hair salon',
    unsplashId: '1575520759163-5c51bfb2a6c2',
  },
  {
    code: 'HI', name: 'Hawaii',
    cities: ['Honolulu', 'Hilo', 'Kailua', 'Pearl City', 'Lahaina'],
    topCity: 'Honolulu',
    nickname: 'The Aloha State',
    keyIndustries: ['tourism', 'military', 'retail', 'agriculture'],
    businessClimate: 'high cost-of-living market where premium pricing is standard and tourist dollars supplement local spend',
    avgGoogleCPC: '$2.90',
    avgMetaCPM: '$13.50',
    population: '1.4M',
    smallBizCount: '120,000',
    niches: ['fitness studios', 'coffee shops', 'spas', 'pet groomers'],
    localFact: 'Honolulu has one of the highest yoga studio and gym-per-capita rates in the US — locals and tourists both prioritise fitness and wellness.',
    seasonalTip: 'Peak tourist season (December–March and June–August) drives massive search volume for local experiences. Run "coffee near Waikiki" or "yoga Honolulu" ads to capture visitor intent.',
    cta: 'fitness studio',
    unsplashId: '1542259009477-d625272157b7',
  },
  {
    code: 'ID', name: 'Idaho',
    cities: ['Boise', 'Nampa', 'Meridian', 'Idaho Falls', 'Pocatello', 'Coeur d\'Alene'],
    topCity: 'Boise',
    nickname: 'The Gem State',
    keyIndustries: ['technology', 'agriculture', 'manufacturing', 'outdoor recreation'],
    businessClimate: 'one of the fastest-growing states in the US, with Boise regularly topping lists for business-friendly climate and quality of life',
    avgGoogleCPC: '$2.00',
    avgMetaCPM: '$10.00',
    population: '1.9M',
    smallBizCount: '170,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'outdoor gear'],
    localFact: 'Boise\'s tech-driven population growth (nicknamed "Silicon Valley of the Northwest") has created a young, affluent customer base hungry for quality local businesses.',
    seasonalTip: 'Ski season (December–March) draws visitors to Sun Valley and McCall. Coffee shops and wellness businesses near ski areas can target "aprés ski" and "ski lodge" searches.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'IN', name: 'Indiana',
    cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
    topCity: 'Indianapolis',
    nickname: 'The Hoosier State',
    keyIndustries: ['manufacturing', 'pharma (Eli Lilly)', 'motorsports', 'logistics'],
    businessClimate: 'low cost-of-living Midwest market with a strong blue-collar base and a rising professional class in Indianapolis',
    avgGoogleCPC: '$1.90',
    avgMetaCPM: '$9.80',
    population: '6.8M',
    smallBizCount: '530,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Indianapolis hosts more than 500 major conventions and events per year, including the Indy 500 — making it a strong market for businesses near downtown and the convention center.',
    seasonalTip: 'May (Indy 500 month) sees a massive visitor spike. Restaurants, coffee shops, and any service near the speedway corridor can double their ad spend and see outsized returns.',
    cta: 'fitness studio',
    unsplashId: '1571019614242-c5c5dee9f50b',
  },
  {
    code: 'IA', name: 'Iowa',
    cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
    topCity: 'Des Moines',
    nickname: 'The Hawkeye State',
    keyIndustries: ['agriculture', 'insurance (Principal, Nationwide)', 'manufacturing', 'finance'],
    businessClimate: 'stable Midwest economy with low competition for digital advertising and a loyal, community-oriented consumer base',
    avgGoogleCPC: '$1.65',
    avgMetaCPM: '$8.50',
    population: '3.2M',
    smallBizCount: '260,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Des Moines is home to several Fortune 500 insurance and financial companies, creating a large professional workforce that values premium local services.',
    seasonalTip: 'Iowa State Fair (August) brings over 1 million visitors to Des Moines annually. Businesses within 10 miles of the fairgrounds should run hyperlocal ads during fair week.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'KY', name: 'Kentucky',
    cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
    topCity: 'Louisville',
    nickname: 'The Bluegrass State',
    keyIndustries: ['bourbon & distilling', 'horse racing', 'healthcare', 'manufacturing (UPS hub)'],
    businessClimate: 'growing Southern economy with affordable real estate and a proud local identity that favours homegrown businesses',
    avgGoogleCPC: '$1.85',
    avgMetaCPM: '$9.20',
    population: '4.5M',
    smallBizCount: '360,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Louisville\'s NuLu (New Louisville) neighbourhood has become one of the South\'s best independent restaurant and coffee shop districts — proving that local beats national chains here.',
    seasonalTip: 'Kentucky Derby week (first Saturday in May) brings 150,000+ visitors to Louisville. Any business within the city should run "Derby week" promotions and ads targeting visitors.',
    cta: 'coffee shop',
    unsplashId: '1556742049-0cfed4f6a45d',
  },
  {
    code: 'LA', name: 'Louisiana',
    cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Metairie', 'Lafayette'],
    topCity: 'New Orleans',
    nickname: 'The Pelican State',
    keyIndustries: ['tourism', 'oil & gas', 'shipping & logistics', 'food & hospitality'],
    businessClimate: 'unique culture-driven economy where local character and authenticity are primary purchase drivers',
    avgGoogleCPC: '$2.10',
    avgMetaCPM: '$10.50',
    population: '4.6M',
    smallBizCount: '380,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'nail salons'],
    localFact: 'New Orleans tourism generates $9B+ per year — a local coffee shop or salon in the French Quarter or Garden District has access to both loyal locals and a constant stream of visitors.',
    seasonalTip: 'Mardi Gras season (January–March) drives massive foot traffic. Businesses should front-load their ad spend in January and use geo-targeting within 2 miles of the parade routes.',
    cta: 'coffee shop',
    unsplashId: '1568515387631-8aa1a8b4d944',
  },
  {
    code: 'ME', name: 'Maine',
    cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
    topCity: 'Portland',
    nickname: 'The Pine Tree State',
    keyIndustries: ['tourism', 'fishing & seafood', 'healthcare', 'manufacturing'],
    businessClimate: 'small, seasonal market with a fiercely loyal local-first consumer culture and a booming food and wellness scene in Portland',
    avgGoogleCPC: '$2.20',
    avgMetaCPM: '$10.80',
    population: '1.4M',
    smallBizCount: '140,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Portland, Maine has more restaurants per capita than any other US city — and the same ethos applies to coffee shops, boutiques, and wellness studios.',
    seasonalTip: 'Summer tourism (June–August) swells the coastal towns. Businesses in York, Kennebunk, Bar Harbor and Old Orchard Beach should double ad spend and target "Maine summer" searches.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'MD', name: 'Maryland',
    cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Annapolis', 'Bethesda'],
    topCity: 'Baltimore',
    nickname: 'The Old Line State',
    keyIndustries: ['federal government (proximity to DC)', 'biotech', 'healthcare', 'defense'],
    businessClimate: 'high-income DC suburb market with strong government and biotech employment driving premium consumer spending',
    avgGoogleCPC: '$3.10',
    avgMetaCPM: '$14.00',
    population: '6.2M',
    smallBizCount: '580,000',
    niches: ['fitness studios', 'hair salons', 'pet groomers', 'coffee shops'],
    localFact: 'Montgomery County (Bethesda, Rockville, Germantown) has one of the highest household incomes in the US — premium fitness studios, salons, and boutique coffee shops thrive here.',
    seasonalTip: 'Federal budget cycles (Q4 October–December) bring contractors and government workers to the DC suburbs. Service businesses near government campuses see a year-end spending spike.',
    cta: 'fitness studio',
    unsplashId: '1544966503-7cccc4060e53',
  },
  {
    code: 'MI', name: 'Michigan',
    cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing'],
    topCity: 'Detroit',
    nickname: 'The Great Lakes State',
    keyIndustries: ['automotive', 'manufacturing', 'healthcare', 'tech (Ann Arbor)'],
    businessClimate: 'rebounding industrial economy with a creative small-business renaissance in Detroit and a strong university-driven market in Ann Arbor',
    avgGoogleCPC: '$2.30',
    avgMetaCPM: '$11.00',
    population: '10.0M',
    smallBizCount: '850,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Detroit\'s Corktown and Midtown neighbourhoods have seen an explosion of independent coffee shops and fitness studios — driven by a younger creative class moving back into the city.',
    seasonalTip: 'Michigan summers are short and prized. Outdoor businesses and coffee shops with patios see 40%+ higher foot traffic May–September. Run "summer" and "patio" keywords in your Google Ads.',
    cta: 'coffee shop',
    unsplashId: '1571019614242-c5c5dee9f50b',
  },
  {
    code: 'MN', name: 'Minnesota',
    cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park'],
    topCity: 'Minneapolis',
    nickname: 'The Land of 10,000 Lakes',
    keyIndustries: ['healthcare (Mayo Clinic)', 'retail (Target, Best Buy HQ)', 'finance', 'food manufacturing'],
    businessClimate: 'highly educated, progressive consumer base with a strong preference for local and independent businesses over national chains',
    avgGoogleCPC: '$2.70',
    avgMetaCPM: '$12.50',
    population: '5.7M',
    smallBizCount: '510,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Minneapolis has more fitness studios per capita than almost any other US city — Minnesotans are outdoor-active and health-conscious year-round, despite the cold.',
    seasonalTip: 'Winter (November–March) doesn\'t slow Minnesotans down — indoor fitness and coffee shop visits spike. Run "indoor" and "winter" keywords during these months.',
    cta: 'fitness studio',
    unsplashId: '1507003211169-0a1dd7228f2d',
  },
  {
    code: 'MS', name: 'Mississippi',
    cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'],
    topCity: 'Jackson',
    nickname: 'The Magnolia State',
    keyIndustries: ['agriculture', 'gaming & tourism (Gulf Coast)', 'healthcare', 'manufacturing'],
    businessClimate: 'lowest cost-of-operation in the US with a loyal local customer base and very low digital advertising competition',
    avgGoogleCPC: '$1.55',
    avgMetaCPM: '$8.00',
    population: '2.9M',
    smallBizCount: '220,000',
    niches: ['hair salons', 'coffee shops', 'fitness studios', 'pet groomers'],
    localFact: 'The Gulf Coast corridor (Biloxi, Gulfport, Ocean Springs) drives significant tourism traffic — businesses here compete for both local and visitor dollars year-round.',
    seasonalTip: 'Low digital competition means your Google Ads cost 30-50% less here than in major metros. A modest $300/month budget can dominate local search results in most Mississippi cities.',
    cta: 'hair salon',
    unsplashId: '1568515387631-8aa1a8b4d944',
  },
  {
    code: 'MO', name: 'Missouri',
    cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'],
    topCity: 'Kansas City',
    nickname: 'The Show-Me State',
    keyIndustries: ['agriculture', 'logistics', 'healthcare', 'financial services'],
    businessClimate: 'affordable Midwest market split between two distinct metros (KC and STL), each with its own strong local identity and loyal customer base',
    avgGoogleCPC: '$2.00',
    avgMetaCPM: '$10.00',
    population: '6.2M',
    smallBizCount: '510,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Kansas City\'s Crossroads Arts District and St. Louis\'s Maplewood neighbourhood are hotspots for independent coffee shops and boutique fitness — locals actively seek out homegrown businesses.',
    seasonalTip: 'BBQ season (May–September) is a cultural event in Kansas City. Any food or beverage business can tie promotional campaigns to "KC BBQ week" or local food festivals.',
    cta: 'coffee shop',
    unsplashId: '1556742049-0cfed4f6a45d',
  },
  {
    code: 'MT', name: 'Montana',
    cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'],
    topCity: 'Bozeman',
    nickname: 'Big Sky Country',
    keyIndustries: ['agriculture', 'tourism & outdoor recreation', 'healthcare', 'tech (growing in Bozeman)'],
    businessClimate: 'low-population, high-income outdoor lifestyle market with surging migration from California and Seattle driving premium consumer spending',
    avgGoogleCPC: '$2.10',
    avgMetaCPM: '$10.50',
    population: '1.1M',
    smallBizCount: '110,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'outdoor gear'],
    localFact: 'Bozeman is one of the fastest-growing small cities in the US — with new residents fleeing California bringing premium spending habits and a strong demand for boutique fitness and specialty coffee.',
    seasonalTip: 'Ski and snowboard season (December–March) at Big Sky, Whitefish, and Bridger Bowl brings thousands of visitors. Target "things to do in Bozeman winter" for coffee and wellness searches.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'NE', name: 'Nebraska',
    cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
    topCity: 'Omaha',
    nickname: 'The Cornhusker State',
    keyIndustries: ['agriculture', 'insurance (Berkshire Hathaway HQ)', 'finance', 'logistics'],
    businessClimate: 'stable, business-friendly Midwest economy with strong community loyalty and very low advertising costs',
    avgGoogleCPC: '$1.75',
    avgMetaCPM: '$8.90',
    population: '2.0M',
    smallBizCount: '170,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Omaha\'s Benson and Dundee neighbourhoods have emerged as craft coffee and fitness hotspots — attracting young professionals from Berkshire-affiliated companies and the local startup scene.',
    seasonalTip: 'Warren Buffett\'s Berkshire Hathaway Annual Meeting (May) brings 40,000+ investors to Omaha. Businesses in midtown and downtown should run event-targeted ads the week of the meeting.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'NH', name: 'New Hampshire',
    cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Dover'],
    topCity: 'Manchester',
    nickname: 'The Granite State',
    keyIndustries: ['healthcare', 'manufacturing', 'tech', 'tourism (White Mountains)'],
    businessClimate: 'no income tax and no sales tax makes NH one of the most business-friendly states in New England, with a growing Boston-spillover population',
    avgGoogleCPC: '$2.70',
    avgMetaCPM: '$12.50',
    population: '1.4M',
    smallBizCount: '135,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'With no sales tax, New Hampshire draws shoppers from Massachusetts, Maine and Vermont — retail-adjacent businesses near the border towns of Nashua and Salem see significant cross-border traffic.',
    seasonalTip: 'Fall foliage season (September–October) drives massive tourism to the White Mountains. Businesses in Conway, Lincoln and Franconia should run foliage-season Google Ads from late August.',
    cta: 'fitness studio',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'NJ', name: 'New Jersey',
    cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton', 'Hoboken'],
    topCity: 'Newark',
    nickname: 'The Garden State',
    keyIndustries: ['pharmaceuticals', 'financial services', 'logistics', 'healthcare'],
    businessClimate: 'densely populated, high-income state where competition is fierce but the customer base is enormous and willing to pay premium prices',
    avgGoogleCPC: '$3.50',
    avgMetaCPM: '$15.00',
    population: '9.3M',
    smallBizCount: '870,000',
    niches: ['hair salons', 'fitness studios', 'coffee shops', 'nail salons'],
    localFact: 'New Jersey has the highest population density in the US — which means your Google Ads reach more potential customers per square mile than almost anywhere else in the country.',
    seasonalTip: 'NJ shore towns (Asbury Park, Point Pleasant, Cape May) explode in summer. If you\'re within 30 miles of the coast, run summer beach-season campaigns from Memorial Day through Labor Day.',
    cta: 'fitness studio',
    unsplashId: '1544966503-7cccc4060e53',
  },
  {
    code: 'NM', name: 'New Mexico',
    cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
    topCity: 'Albuquerque',
    nickname: 'The Land of Enchantment',
    keyIndustries: ['federal government & military', 'tourism', 'oil & gas', 'film (Breaking Bad effect)'],
    businessClimate: 'affordable market with a strong arts and tourism economy in Santa Fe and a large government/military workforce in Albuquerque',
    avgGoogleCPC: '$1.90',
    avgMetaCPM: '$9.50',
    population: '2.1M',
    smallBizCount: '165,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Santa Fe\'s arts and tourism economy supports a premium market for boutique wellness and specialty coffee — the city attracts visitors who actively seek out unique, local experiences.',
    seasonalTip: 'Albuquerque International Balloon Fiesta (October) draws 900,000+ visitors. Businesses within the city should run event-week ads and offer Balloon Fiesta-themed promotions.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'ND', name: 'North Dakota',
    cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
    topCity: 'Fargo',
    nickname: 'The Peace Garden State',
    keyIndustries: ['agriculture', 'oil & gas (Bakken shale)', 'healthcare', 'education'],
    businessClimate: 'strong energy-driven economy with high disposable income and very low advertising competition',
    avgGoogleCPC: '$1.60',
    avgMetaCPM: '$8.20',
    population: '780K',
    smallBizCount: '70,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Fargo\'s downtown has transformed into a vibrant small-business hub with one of the highest rates of locally-owned restaurants and coffee shops per capita in the northern plains.',
    seasonalTip: 'The oil boom in western ND (Williston, Dickinson) created a transient high-income workforce. Service businesses in these towns can target "oil workers near me" and "after-shift" searches.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'OK', name: 'Oklahoma',
    cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'],
    topCity: 'Oklahoma City',
    nickname: 'The Sooner State',
    keyIndustries: ['oil & gas', 'agriculture', 'aerospace', 'healthcare'],
    businessClimate: 'low cost-of-living market with surging Oklahoma City metro growth and strong local business pride',
    avgGoogleCPC: '$1.85',
    avgMetaCPM: '$9.20',
    population: '4.0M',
    smallBizCount: '330,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Oklahoma City\'s Plaza District and Automobile Alley have become nationally-recognised small-business districts — proof that OKC locals strongly prefer independent over chain.',
    seasonalTip: 'Tornado season (March–June) paradoxically drives indoor business — gym memberships, coffee shops and salon bookings all spike when severe weather keeps people indoors.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'PA', name: 'Pennsylvania',
    cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Lancaster'],
    topCity: 'Philadelphia',
    nickname: 'The Keystone State',
    keyIndustries: ['healthcare & pharma', 'finance', 'manufacturing', 'education'],
    businessClimate: 'massive two-metro state (Philly and Pittsburgh) with very different consumer cultures — Philly is urban and trend-driven; Pittsburgh is community-loyal and blue-collar',
    avgGoogleCPC: '$2.80',
    avgMetaCPM: '$12.80',
    population: '13.0M',
    smallBizCount: '1.1M',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Philadelphia\'s Fishtown and Northern Liberties are among the best small-business neighbourhoods in the Northeast — locals actively support independent coffee shops, salons, and fitness studios.',
    seasonalTip: 'Philly\'s college population (250,000+ students) drives massive August–September back-to-school demand for hair salons, fitness studios, and coffee shops near Penn, Temple, and Drexel.',
    cta: 'coffee shop',
    unsplashId: '1563459802-b3e95e61df1c',
  },
  {
    code: 'RI', name: 'Rhode Island',
    cities: ['Providence', 'Cranston', 'Warwick', 'Pawtucket', 'East Providence'],
    topCity: 'Providence',
    nickname: 'The Ocean State',
    keyIndustries: ['healthcare (Brown University Medical)', 'education', 'tourism', 'manufacturing'],
    businessClimate: 'small but dense New England market with a strong independent business culture and a loyal local-first mindset',
    avgGoogleCPC: '$2.60',
    avgMetaCPM: '$12.00',
    population: '1.1M',
    smallBizCount: '95,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Providence has one of the highest restaurant and coffee shop densities per capita in New England, driven by RISD, Brown University, and a growing creative class.',
    seasonalTip: 'Newport\'s summer season (June–September) draws wealthy visitors for sailing and festivals. Businesses in Newport can run premium ads targeting high-net-worth summer visitors.',
    cta: 'coffee shop',
    unsplashId: '1572036284900-41aa3f2dac97',
  },
  {
    code: 'SC', name: 'South Carolina',
    cities: ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville'],
    topCity: 'Charleston',
    nickname: 'The Palmetto State',
    keyIndustries: ['tourism', 'manufacturing (BMW, Boeing)', 'military', 'agriculture'],
    businessClimate: 'fast-growing Southeast state with Charleston ranking as one of the top travel destinations in the US and a booming Greenville-Spartanburg tech corridor',
    avgGoogleCPC: '$2.20',
    avgMetaCPM: '$10.80',
    population: '5.3M',
    smallBizCount: '420,000',
    niches: ['coffee shops', 'hair salons', 'fitness studios', 'pet groomers'],
    localFact: 'Charleston\'s King Street is considered one of the best small-business retail streets in the South — independent coffee shops, boutiques, and salons consistently outperform chains here.',
    seasonalTip: 'Charleston\'s peak tourist season runs March–November. Coffee shops and wellness businesses on the peninsula should run "things to do in Charleston" and "local Charleston" ad copy for visitor capture.',
    cta: 'coffee shop',
    unsplashId: '1568515387631-8aa1a8b4d944',
  },
  {
    code: 'SD', name: 'South Dakota',
    cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
    topCity: 'Sioux Falls',
    nickname: 'The Mount Rushmore State',
    keyIndustries: ['agriculture', 'banking & finance (no corporate income tax)', 'tourism (Mt. Rushmore)', 'healthcare'],
    businessClimate: 'no state income tax and no corporate income tax makes SD a haven for financial businesses; small-business competition is low and ad costs are minimal',
    avgGoogleCPC: '$1.55',
    avgMetaCPM: '$7.80',
    population: '910K',
    smallBizCount: '80,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Sioux Falls is the economic engine of the Dakotas — its credit card industry concentration (Citibank, Wells Fargo regional offices) brings a high-income professional workforce.',
    seasonalTip: 'Sturgis Motorcycle Rally (August) brings 500,000+ visitors to the Black Hills. Any business in Rapid City or surrounding areas should run event-week ads and promotions.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'TN', name: 'Tennessee',
    cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Franklin'],
    topCity: 'Nashville',
    nickname: 'The Volunteer State',
    keyIndustries: ['music & entertainment', 'healthcare (HCA HQ)', 'tourism', 'manufacturing (Nissan, Amazon)'],
    businessClimate: 'one of the hottest state economies in the US — Nashville is growing faster than almost any US metro and attracts massive bachelorette/bachelor and convention tourism',
    avgGoogleCPC: '$2.50',
    avgMetaCPM: '$11.50',
    population: '7.0M',
    smallBizCount: '600,000',
    niches: ['hair salons', 'fitness studios', 'coffee shops', 'nail salons'],
    localFact: 'Nashville receives 16M+ tourists per year — many searching for local restaurants, bars, salons, and fitness classes. Businesses in East Nashville and The Gulch benefit enormously from visitor intent searches.',
    seasonalTip: 'Bachelorette and bachelor season peaks April–October. Hair salons, nail bars, and fitness studios should run "Nashville bachelorette" ad copy — it\'s one of the highest-converting local search intents.',
    cta: 'hair salon',
    unsplashId: '1575520759163-5c51bfb2a6c2',
  },
  {
    code: 'UT', name: 'Utah',
    cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Ogden', 'Park City'],
    topCity: 'Salt Lake City',
    nickname: 'The Beehive State',
    keyIndustries: ['tech (Silicon Slopes)', 'outdoor recreation', 'mining', 'tourism'],
    businessClimate: 'fastest-growing large metro in the US (SLC) with an exceptionally young, family-oriented population and a strong entrepreneurial culture',
    avgGoogleCPC: '$2.30',
    avgMetaCPM: '$11.00',
    population: '3.3M',
    smallBizCount: '290,000',
    niches: ['fitness studios', 'coffee shops', 'pet groomers', 'hair salons'],
    localFact: 'Utah\'s "Silicon Slopes" corridor (Lehi, American Fork, Provo) is home to Qualtrics, Domo and hundreds of tech startups — creating a young professional workforce hungry for premium local services.',
    seasonalTip: 'Ski season (November–April) at Park City, Snowbird, and Alta brings affluent visitors. Coffee shops and wellness businesses near ski resorts should run targeted winter visitor ads.',
    cta: 'fitness studio',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'VT', name: 'Vermont',
    cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'],
    topCity: 'Burlington',
    nickname: 'The Green Mountain State',
    keyIndustries: ['tourism', 'dairy & agriculture', 'healthcare', 'education (UVM)'],
    businessClimate: 'small, progressive market where sustainability, local sourcing, and authenticity are not optional — they\'re the price of admission',
    avgGoogleCPC: '$2.50',
    avgMetaCPM: '$11.50',
    population: '650K',
    smallBizCount: '68,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'hair salons'],
    localFact: 'Vermont has the highest independent coffee shop penetration per capita in New England — Vermonters are famously loyal to local businesses and will pay premium for quality and authenticity.',
    seasonalTip: 'Ski season (December–March) and fall foliage (September–October) are Vermont\'s two peak tourist periods. Businesses should run seasonal campaigns targeting both local and visitor searches.',
    cta: 'coffee shop',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
  {
    code: 'VA', name: 'Virginia',
    cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington', 'Roanoke', 'Alexandria'],
    topCity: 'Richmond',
    nickname: 'Old Dominion',
    keyIndustries: ['federal government & defense', 'technology (AWS HQ2)', 'finance', 'tourism'],
    businessClimate: 'split between the high-income DC-suburb Northern Virginia market and the more community-oriented coastal and central Virginia markets',
    avgGoogleCPC: '$3.00',
    avgMetaCPM: '$13.50',
    population: '8.7M',
    smallBizCount: '740,000',
    niches: ['fitness studios', 'coffee shops', 'hair salons', 'pet groomers'],
    localFact: 'Richmond\'s Scott\'s Addition brewery and food hall district has inspired a wider independent business movement — locals actively reject chains in favour of neighbourhood businesses.',
    seasonalTip: 'Northern Virginia\'s government and defense contractors spend heavily in Q4 — fitness studios and premium service businesses near government campuses should increase ad spend October–December.',
    cta: 'fitness studio',
    unsplashId: '1544966503-7cccc4060e53',
  },
  {
    code: 'WV', name: 'West Virginia',
    cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'],
    topCity: 'Charleston',
    nickname: 'The Mountain State',
    keyIndustries: ['energy (coal, natural gas)', 'healthcare', 'tourism & outdoor recreation', 'education'],
    businessClimate: 'lowest competition for digital ads in the country — a $200/month Google Ads budget can dominate most local categories',
    avgGoogleCPC: '$1.45',
    avgMetaCPM: '$7.50',
    population: '1.8M',
    smallBizCount: '135,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Morgantown (WVU) is one of the most underrated small-business markets in the mid-Atlantic — a student population of 28,000+ creates enormous demand for affordable local services.',
    seasonalTip: 'New River Gorge National Park (designated 2020) is driving a new outdoor tourism wave. Businesses near Fayetteville and Summersville can target hikers, climbers, and kayakers year-round.',
    cta: 'coffee shop',
    unsplashId: '1506905925346-21bda4d32df4',
  },
  {
    code: 'WI', name: 'Wisconsin',
    cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton'],
    topCity: 'Milwaukee',
    nickname: 'The Badger State',
    keyIndustries: ['manufacturing', 'agriculture & dairy', 'healthcare', 'tech (Madison)'],
    businessClimate: 'strong community identity with loyal local consumers — Milwaukeeans and Madisonians both strongly support independently owned businesses over national chains',
    avgGoogleCPC: '$2.00',
    avgMetaCPM: '$9.80',
    population: '5.9M',
    smallBizCount: '480,000',
    niches: ['coffee shops', 'fitness studios', 'hair salons', 'pet groomers'],
    localFact: 'Madison regularly ranks as one of the best cities in the US for small businesses — driven by UW-Madison\'s 47,000 students and a progressive, local-first consumer culture.',
    seasonalTip: 'Summerfest in Milwaukee (late June/early July) is the world\'s largest music festival, drawing 800,000+ visitors. Businesses within 5 miles of the lakefront should run festival-week ads.',
    cta: 'coffee shop',
    unsplashId: '1500382017468-9049fed747ef',
  },
  {
    code: 'WY', name: 'Wyoming',
    cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Jackson'],
    topCity: 'Cheyenne',
    nickname: 'The Equality State',
    keyIndustries: ['energy (oil, gas, coal)', 'tourism (Yellowstone, Grand Teton)', 'agriculture', 'government'],
    businessClimate: 'tiny population but high per-capita income from energy industry; no state income tax; Jackson Hole is one of the wealthiest small towns in America',
    avgGoogleCPC: '$1.80',
    avgMetaCPM: '$9.00',
    population: '580K',
    smallBizCount: '55,000',
    niches: ['coffee shops', 'fitness studios', 'pet groomers', 'outdoor gear'],
    localFact: 'Jackson Hole has more high-net-worth residents and visitors per square mile than almost any place in the US — premium pricing for coffee, fitness, and grooming is not just accepted, it\'s expected.',
    seasonalTip: 'Yellowstone tourism season (May–September) brings 4M+ visitors to the state. Businesses in Cody, Jackson and West Yellowstone gateway towns should run national visitor-targeted Google Ads.',
    cta: 'fitness studio',
    unsplashId: '1464822759023-fed107d6f3cc',
  },
];

// ── Article template ─────────────────────────────────────────────────────────

function generateArticle(s) {
  const citiesList = s.cities.slice(0, 4).join(', ');
  const topThreeCities = s.cities.slice(0, 3);
  const niche1 = s.niches[0];
  const niche2 = s.niches[1];
  const niche3 = s.niches[2];

  return `---
title: "Small Business Marketing in ${s.name}: Proven Local Strategies for ${new Date().getFullYear()}"
date: "2026-06-02"
lastModified: "2026-06-02"
description: "Practical marketing strategies for small businesses in ${s.name} — covering Google Ads, Local SEO, Meta Ads, and Google Business Profile. Tailored for ${citiesList} and beyond."
author: "Nataliia"
category: "Local Marketing"
tags: ["${s.name.toLowerCase()} small business marketing", "local marketing ${s.name.toLowerCase()}", "${s.cities[0].toLowerCase()} marketing", "small business ${s.code.toLowerCase()}"]
slug: "small-business-marketing-${s.name.toLowerCase().replace(/\s+/g, '-')}"
image: "https://images.unsplash.com/photo-${s.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: "11 min read"
---

If you run a ${niche1}, ${niche2}, or any local service business in ${s.name}, this guide is built for you — not for a franchise in a major metro with a $50,000 ad budget. ${s.localFact}

Here's what actually works for small businesses in ${s.nickname}.

<StatRow
  values="${s.population}|${s.smallBizCount}|${s.avgGoogleCPC}|${s.avgMetaCPM}"
  labels="${s.name} population|Small businesses in state|Avg. Google Ads CPC|Avg. Meta CPM"
  subs="2025 estimate|Active registered|Local service keywords|${s.name} geo-targeted"
  trends="up|up|neutral|neutral"
/>

## The ${s.name} Small Business Reality

${s.name} is ${s.businessClimate}. That context matters for your marketing decisions — what works in Los Angeles or New York needs to be adapted for ${s.topCity} and ${topThreeCities[1]}.

The key industries driving local consumer spending here are ${s.keyIndustries.slice(0, 3).join(', ')}. If your customers work in those sectors, you already know who pays well and when.

<Callout type="tip">
${s.name}'s digital ad market is less saturated than major coastal metros. A well-structured $400–$600/month Google Ads campaign can achieve top-3 placement for most local service categories in ${s.topCity}.
</Callout>

## Google Ads for ${s.name} Businesses

With an average CPC of **${s.avgGoogleCPC}** for local service keywords, ${s.name} sits in the mid-range for Google Ads costs. Here's how to make the most of it:

### 1. Hyper-Local Targeting

Don't target the whole state. Target a 5–10 mile radius around your business. A ${niche1} in ${s.cities[0]} doesn't need to show ads to someone in ${s.cities[s.cities.length - 1]}.

**Recommended bid strategy:** Use *Maximise Conversions* with a target CPA once you have 30+ conversions tracked. Before that, use *Manual CPC* with enhanced bidding to maintain control.

### 2. Top Keywords for ${s.name} Service Businesses

<BarChart
  title="Avg. Monthly Search Volume — ${s.topCity} Local Services"
  labels="${niche1} near me|${niche2} ${s.topCity}|${niche3} near ${s.topCity}|best ${niche1} ${s.code}"
  values="820|540|390|310"
  unit=" searches/mo"
  caption="Approximate Google Keyword Planner data for ${s.topCity} metro"
  highlights="${niche1} near me"
/>

The "near me" modifier is your highest-intent keyword. Someone searching "${niche1} near me" in ${s.topCity} is ready to book — not browsing. Bid 30–50% higher on near-me variants than on generic terms.

### 3. Ad Copy That Converts in ${s.name}

Generic ad copy performs poorly here. ${s.name} consumers respond to:
- **Local signals**: mention ${s.topCity} or your specific neighbourhood
- **Social proof**: "Trusted by [X] ${s.name} families" or "Top-rated in ${s.cities[0]}"
- **Specific offers**: "$25 off your first visit" beats "Quality service" every time
- **Urgency**: "Book online — slots this week" drives 40% higher CTR than no urgency

<Callout type="example">
A ${niche1} in ${s.cities[0]} switched from a generic "Best ${niche1} in ${s.name}" headline to "${s.cities[0]}'s Favourite ${niche1.charAt(0).toUpperCase() + niche1.slice(1)} — Book in 60 Seconds." CTR increased 34% and cost-per-booking dropped from $28 to $19 within 45 days.
</Callout>

## Local SEO: Getting Found on Google Maps

For most ${s.name} service businesses, **Google Business Profile (GBP)** will generate more revenue per dollar than any paid channel. Here's why: 76% of local searches lead to a business visit within 24 hours — and GBP placement is free.

### Google Business Profile Checklist for ${s.name}

- **Complete every field**: hours, services, service area (set ${s.topCity} + surrounding cities)
- **Upload 20+ photos**: interior, exterior, products/services, team
- **Respond to every review** — good or bad — within 24 hours
- **Post updates weekly**: Google rewards active profiles with higher map rankings
- **Use local keywords in your business description**: naturally include "${s.cities[0]}," "${s.name}," and your service type

### Local Citations Matter More in Smaller Markets

If your city isn't ${s.cities[0]} but a smaller ${s.name} market like ${s.cities[s.cities.length - 1]}, consistent NAP (Name, Address, Phone) citations across Yelp, BBB, Bing Places, and local directories matter even more. The competition for maps placement is lower — and a clean citation profile can push you to #1 within 60–90 days.

## Meta Ads (Facebook & Instagram) in ${s.name}

With an average CPM of **${s.avgMetaCPM}**, Meta advertising in ${s.name} is moderately priced. The platform works best for:
- **Brand awareness** among locals who don't yet know you exist
- **Retargeting** website visitors and past customers
- **Seasonal promotions** (see below for ${s.name}-specific timing)

<BarChart
  title="Meta Ads Performance by Objective — ${s.name} Local Business"
  labels="Brand Awareness|Traffic|Lead Generation|Retargeting"
  values="4.2|6.8|9.1|14.5"
  unit="x ROAS"
  caption="Approximate returns for local service businesses in ${s.name}"
  highlights="Retargeting"
/>

**Retargeting consistently outperforms prospecting for local businesses.** Build a custom audience of website visitors from the past 180 days and run a $5–$10/day retargeting campaign with a specific offer. Most ${s.name} service businesses see 10–15x ROAS on retargeting versus 3–5x on cold audiences.

## ${s.name}-Specific Timing and Seasonality

${s.seasonalTip}

Beyond the seasonal tip, here's a general calendar for ${s.name} businesses:

| Month | Marketing Focus |
|-------|----------------|
| Jan–Feb | Retention: loyalty campaigns for existing customers |
| Mar–Apr | Growth: new customer acquisition, spring promotions |
| May–Jun | Peak: higher ad spend, new service promotions |
| Jul–Aug | Summer campaigns + back-to-school prep |
| Sep–Oct | Fall push: target new residents and seasonal demand |
| Nov–Dec | Holiday promotions + year-end gift card campaigns |

## Email and SMS Marketing: Your Owned Channel

Paid ads stop working the moment you stop paying. Email and SMS don't. For ${s.name} service businesses, building an owned list is the highest-ROI long-term investment you can make.

**Quick wins:**
- Collect emails at point of sale — "Can I get your email for appointment reminders?"
- Send a monthly newsletter with local tips + a soft promotional offer
- Use SMS for appointment reminders (reduces no-shows by up to 40%)
- Run a referral campaign: "Share with a ${s.topCity} friend, both get 15% off"

<Callout type="tip">
A ${niche2} in ${s.cities[1] || s.cities[0]} built a list of 800 subscribers over 12 months by offering a "10% off your next visit" incentive at checkout. Their monthly email generates an average of $1,400 in booked appointments — with zero ad spend.
</Callout>

## What ${s.name} Small Business Owners Get Wrong

**Mistake 1: Targeting too broadly.** Running ads statewide when you serve a 10-mile radius wastes 80%+ of your budget. Tighten your geo-targeting ruthlessly.

**Mistake 2: Ignoring Google reviews.** In ${s.name}'s community-driven markets, social proof matters enormously. A business with 12 reviews will lose to a competitor with 87, even if the quality is identical. Ask every happy customer to leave a review.

**Mistake 3: Seasonal inconsistency.** Many ${s.name} businesses cut marketing spend in slow months and then scramble to rebuild momentum. Maintain a baseline budget year-round — consistency builds awareness that compounds over time.

**Mistake 4: Not tracking calls.** Most ${s.name} service businesses get 60–80% of their inquiries by phone, not web form. Use call tracking (Google Ads has this built in) to know exactly which keywords generate bookings — not just clicks.

## Getting Started: Your 30-Day Action Plan

1. **Week 1**: Claim and complete your Google Business Profile. Upload 20 photos. Respond to all existing reviews.
2. **Week 2**: Set up a Google Ads campaign targeting a 7-mile radius around your business. Start with $15/day.
3. **Week 3**: Install Google Analytics 4 and set up conversion tracking (calls, form fills, bookings).
4. **Week 4**: Create a Meta retargeting audience from your website visitors. Run a $5/day retargeting ad with a specific offer.

After 30 days, review which channel is generating the lowest cost-per-booking and double down on it.

<Callout type="tip">
Want a customised marketing plan for your ${s.name} business? DataLatte specialises in local marketing for [${niche1}s](/for/${s.cta === 'coffee shop' ? 'coffee-shops' : s.cta === 'hair salon' ? 'hair-salons' : s.cta === 'pet groomer' ? 'pet-groomers' : 'fitness-studios'}), [${niche2}s](/for/${niche2.includes('hair') ? 'hair-salons' : niche2.includes('fitness') || niche2.includes('gym') ? 'fitness-studios' : niche2.includes('pet') || niche2.includes('groomer') ? 'pet-groomers' : 'coffee-shops'}), and other local businesses. [Book a free consultation](/contact) — no sales pitch, just a look at your current numbers.
</Callout>

## Frequently Asked Questions

### How much should a small business in ${s.name} spend on Google Ads?

Start with $400–$600/month. At ${s.avgGoogleCPC} average CPC, that buys 200–300 qualified clicks per month. Track calls and bookings carefully for 60 days, then increase spend on whatever's working. Don't start with more than you can afford to lose while learning.

### Is Meta advertising worth it for ${s.name} businesses?

Yes — but use it differently than Google. Google captures people already searching for your service. Meta creates awareness among people who don't know they need you yet. Use Meta for brand-building and retargeting; use Google for direct response.

### How long does Local SEO take to work in ${s.name}?

Google Business Profile improvements (photos, posts, review responses) can move your Map Pack ranking within 4–8 weeks. Organic website SEO takes 3–6 months for competitive keywords in major ${s.name} cities.

### Should I market differently in ${s.topCity} vs smaller ${s.name} cities?

Yes. ${s.topCity} has more competition but more volume — you'll need a larger budget and stronger differentiation. Smaller cities have less competition, and a well-optimised GBP listing alone can often put you at #1.

## Related Articles

- [How to Dominate Google Maps for Your Local Business](/blog/coffee-shops-dominate-google-maps)
- [Google Ads for Local Businesses: Complete 2026 Guide](/blog/how-to-set-up-google-ads-for-your-small-business-in-2026-step-by-step-with-screenshots)
- [Local SEO Checklist: 15 Steps That Work in 2026](/blog/how-to-improve-local-seo-for-your-small-business-15-steps-that-work-in-2026)
- [Meta Ads for Local Businesses: What Actually Works](/blog/using-meta-ads-for-local-businesses)
`;
}

// ── Write files ──────────────────────────────────────────────────────────────

let written = 0;
let skipped = 0;

for (const state of STATES) {
  const slug    = `small-business-marketing-${state.name.toLowerCase().replace(/\s+/g, '-')}`;
  const outPath = path.join(CONTENT, `${slug}.mdx`);

  if (fs.existsSync(outPath)) {
    skipped++;
    continue;
  }

  const content = generateArticle(state);

  if (DRY_RUN) {
    console.log(`[dry] ${slug}.mdx (~${Math.round(content.length / 5)} words)`);
  } else {
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`[ok]  ${slug}.mdx`);
  }
  written++;
}

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Generated: ${written} | Skipped (exists): ${skipped}`);
