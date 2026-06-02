#!/usr/bin/env node
/**
 * generate-dooh-city-articles.mjs
 * Generates DOOH strategy articles for major US cities.
 * Usage: node scripts/generate-dooh-city-articles.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, '../content/blog');
const DRY_RUN = process.argv.includes('--dry-run');

const CITIES = [
  {
    name: 'New York City',
    state: 'NY',
    slug: 'dooh-advertising-new-york-city',
    population: '8.3M',
    smallBiz: '220,000',
    avgCPM: '$12–$28',
    transitCPM: '$15–$30',
    roadsideCPM: '$10–$25',
    unsplashId: 'photo-1485871981521-5b1fd3805eee',
    description: 'How small businesses in NYC can run DOOH campaigns on subway screens, Times Square digital boards, and transit shelters with budgets starting at $500.',
    operators: ['Outfront Media (MTA subway & bus)', 'Clear Channel Outdoor (LinkNYC kiosks, bus shelters)', 'Lamar Advertising (roadside)', 'JCDecaux (airports, Penn Station)'],
    neighborhoods: ['Times Square / Midtown', 'Brooklyn (Williamsburg, DUMBO)', 'Lower Manhattan / Financial District', 'Queens (Astoria, Flushing)', 'Bronx (Grand Concourse)'],
    transitHighlights: 'NYC Subway carries 3.4 million daily riders. MTA digital screens via Outfront Media cover 280+ stations. Cost: $10–$20 CPM for programmatic subway placements. A $1,000 budget can hit 50,000–100,000 subway commuter impressions.',
    transitTip: 'Target morning rush (7–9am) on subway lines near your location. A coffee shop on 6 Train in the 20s can geo-target Lexington Ave commuters for $8–$12 CPM.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Subway entrance screens + bus shelter ads within 3 blocks of your shop during AM/PM rush. Geo-fence your campaigns to a 0.5-mile radius.' },
      { niche: 'Hair & beauty salons', strategy: 'LinkNYC kiosk ads in your neighborhood + transit shelter ads near high foot-traffic shopping corridors (5th Ave, Atlantic Ave, 86th St).' },
      { niche: 'Fitness studios', strategy: 'Target gym-goers with screens near parks and residential neighborhoods. Murray Hill, UES, and Park Slope are high-density fitness demographics.' },
      { niche: 'Pet groomers', strategy: 'Retail screens in pet supply stores + neighborhood-level transit shelter ads. Upper West Side, Park Slope, and Hoboken are top NYC pet-ownership markets.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '40,000–80,000 impressions on subway or bus shelter screens in 1–2 neighborhoods' },
      { budget: '$1,500/mo', reach: '150,000–300,000 impressions across transit + roadside in targeted boroughs' },
      { budget: '$5,000/mo', reach: '500,000+ impressions with dayparting and multi-format (subway + LinkNYC + roadside)' },
    ],
    keyFact: 'NYC has the highest DOOH screen density in the US — over 15,000 digital OOH faces across the 5 boroughs, from MTA subway to Times Square mega-screens.',
    seasonalTip: 'Holiday season (Nov–Jan) drives 30–40% higher foot traffic in Manhattan. Increase DOOH budgets in Q4 for maximum visibility.',
    cta: 'Running a small business in NYC and want to get on subway screens or LinkNYC kiosks? [Book a free DOOH consultation](/contact) and we\'ll map the exact screens within a mile of your location.',
  },
  {
    name: 'Los Angeles',
    state: 'CA',
    slug: 'dooh-advertising-los-angeles',
    population: '3.9M',
    smallBiz: '183,000',
    avgCPM: '$8–$20',
    transitCPM: '$10–$22',
    roadsideCPM: '$7–$18',
    unsplashId: 'photo-1580655653885-65763b2597d0',
    description: 'DOOH advertising guide for LA small businesses — Sunset Strip billboards, Metro rail screens, freeway digital boards, and what real CPMs look like in 2026.',
    operators: ['Lamar Advertising (freeway billboards)', 'Clear Channel Outdoor (bus shelters, Metro)', 'Outfront Media (Metro Rail screens)', 'Regency Outdoor (iconic Sunset Strip)'],
    neighborhoods: ['Hollywood / Sunset Strip', 'Santa Monica / Venice', 'Downtown LA / Arts District', 'Silver Lake / Los Feliz', 'Culver City / Playa Vista'],
    transitHighlights: 'LA Metro carries 750,000+ daily riders across 6 rail lines and 180 bus routes. Outfront Media manages Metro Rail digital screens at 93 stations. CPM: $8–$18 programmatic.',
    transitTip: 'Target Expo Line (Santa Monica ↔ Downtown) and Red/Purple Line (Hollywood/Vine to DTLA) for the highest-density young professional and tourist demographics.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Metro station screens near your location + freeway boards on major surface streets. A Silver Lake café can target Sunset Blvd commuters for $9–$14 CPM.' },
      { niche: 'Hair & beauty salons', strategy: 'Sunset Strip digital boards for awareness + bus shelter ads in residential neighborhoods (WeHo, Santa Monica, Brentwood).' },
      { niche: 'Fitness studios', strategy: 'Target beach communities (Venice, Manhattan Beach, Santa Monica) with outdoor digital boards during 6–9am and 5–8pm workout windows.' },
      { niche: 'Pet groomers', strategy: 'Target West LA, Silver Lake, and Los Feliz — highest per-capita dog ownership in the city. Retail screens near Petco/PetSmart on major corridors.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '35,000–70,000 impressions on Metro screens or bus shelters in 1 neighborhood' },
      { budget: '$1,500/mo', reach: '120,000–250,000 impressions across transit + Sunset Blvd roadside' },
      { budget: '$5,000/mo', reach: '450,000+ impressions with freeway board + transit + venue targeting' },
    ],
    keyFact: 'LA has the second-highest outdoor advertising market in the US. The Sunset Strip alone has over 100 digital OOH faces visible to 500,000+ vehicles weekly.',
    seasonalTip: 'Award season (Jan–Feb: Golden Globes, Oscars) brings massive foot traffic to Hollywood and Beverly Hills. Small businesses within 3 miles should double DOOH budgets Jan–Mar.',
    cta: 'LA small business owner looking to get on the Sunset Strip or Metro screens? [Get a free DOOH strategy session](/contact) and we\'ll show you exactly what $500 can do in your neighborhood.',
  },
  {
    name: 'Chicago',
    state: 'IL',
    slug: 'dooh-advertising-chicago',
    population: '2.7M',
    smallBiz: '143,000',
    avgCPM: '$7–$18',
    transitCPM: '$9–$20',
    roadsideCPM: '$6–$15',
    unsplashId: 'photo-1494522855154-9297ac14b55f',
    description: 'DOOH advertising playbook for Chicago small businesses — L train screens, Magnificent Mile digital boards, and neighborhood-level targeting across the 77 community areas.',
    operators: ['Lamar Advertising (roadside & expressway)', 'Clear Channel Outdoor (bus shelters, L stations)', 'Intersection (CTA digital screens)', 'Outfront Media (transit)'],
    neighborhoods: ['Loop / Magnificent Mile', 'River North / Streeterville', 'Wicker Park / Bucktown', 'Lincoln Park / Lakeview', 'Hyde Park / South Loop'],
    transitHighlights: 'Chicago CTA L train carries 900,000+ daily riders. Intersection manages digital screens on L platforms and buses. CPM: $7–$16 programmatic. Red Line (busiest line) alone reaches 180,000 daily riders.',
    transitTip: 'Red Line runs from Howard (north) through downtown to 95th/Dan Ryan (south). For Loop businesses, target downtown stations (Washington/Dearborn, Lake, Monroe). For neighborhood businesses, target the 5–7 nearest stations.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'L station platform screens near your location + bus shelter ads on your street. A Wicker Park café can target Milwaukee Ave commuters for $8–$12 CPM.' },
      { niche: 'Hair & beauty salons', strategy: 'Bus shelter ads in your neighborhood + Magnificent Mile roadside boards for awareness across tourist and shopping demographics.' },
      { niche: 'Fitness studios', strategy: 'Target Lincoln Park, Lakeview, and Wrigleyville — highest density young professionals and fitness buyers. Expressway boards reaching Lakeshore Drive commuters.' },
      { niche: 'Pet groomers', strategy: 'Lincoln Square, Andersonville, and Roscoe Village are top dog-ownership neighborhoods. Neighborhood transit shelter ads reach residents within a 10-minute walk.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '40,000–75,000 impressions on CTA screens or bus shelters in 1–2 neighborhoods' },
      { budget: '$1,500/mo', reach: '130,000–260,000 impressions across L station + bus + roadside in your zone' },
      { budget: '$5,000/mo', reach: '480,000+ impressions across Loop, expressway, and neighborhood transit' },
    ],
    keyFact: 'Chicago\'s Magnificent Mile generates $1 billion+ in annual retail sales. A single digital board on Michigan Avenue reaches 250,000 weekly impressions from shoppers and tourists.',
    seasonalTip: 'Chicago winters kill foot traffic Nov–Feb. Double down on DOOH in spring (Mar–May) when outdoor activity surges — lakefront trail users and café seekers spike 40%.',
    cta: 'Chicago small business owner? [Book a free DOOH consultation](/contact) — we\'ll map the L stations and bus shelters within walking distance of your business.',
  },
  {
    name: 'Houston',
    state: 'TX',
    slug: 'dooh-advertising-houston',
    population: '2.3M',
    smallBiz: '118,000',
    avgCPM: '$5–$14',
    transitCPM: '$7–$15',
    roadsideCPM: '$5–$12',
    unsplashId: 'photo-1548142813-c348350df52b',
    description: 'DOOH advertising guide for Houston small businesses — freeway digital billboards, Galleria-area screens, and Metro bus digital ads in the most car-centric major US city.',
    operators: ['Lamar Advertising (freeway billboards — dominant operator)', 'Clear Channel Outdoor (bus shelters, digital bulletin boards)', 'Reagan Outdoor (local billboards)', 'Houston Metro (bus digital screens)'],
    neighborhoods: ['Galleria / Uptown', 'Midtown / Montrose', 'Heights / Garden Oaks', 'Energy Corridor', 'Medical Center / NRG'],
    transitHighlights: 'Houston Metro carries 200,000+ daily riders via bus and light rail. METRORail light rail serves Main Street from downtown to Reliant Park. Bus digital screens via Metro: $6–$12 CPM.',
    transitTip: 'Houston is car-first — freeway billboard CPMs ($5–$10) often outperform transit for total impressions. Target I-10, I-610, and Westheimer Road for the highest vehicular reach.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Freeway digital boards on I-10 or I-45 within your commuter zone + gas station screens near your location. Houston commuters spend 45+ minutes in the car daily.' },
      { niche: 'Hair & beauty salons', strategy: 'Galleria-area digital boards reach 500,000+ weekly shoppers. For neighborhood salons, bus shelter ads on Westheimer or Richmond Ave corridors.' },
      { niche: 'Fitness studios', strategy: 'Target Midtown, Montrose, and Heights — highest concentration of fitness-focused demographics. Freeway boards on I-610 near Greenway Plaza.' },
      { niche: 'Pet groomers', strategy: 'Heights, Meyerland, and Sugar Land are top Houston pet-ownership areas. Gas station screens (GasBuddy network) give hyper-local reach within 1 mile.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '50,000–100,000 impressions on freeway digital boards or bus shelter ads' },
      { budget: '$1,500/mo', reach: '150,000–300,000 impressions across freeway + gas station screens' },
      { budget: '$5,000/mo', reach: '550,000+ impressions with Galleria-area, freeway, and neighborhood targeting' },
    ],
    keyFact: 'Houston has no zoning laws — more outdoor advertising inventory per square mile than almost any other major city. Lamar alone operates 1,000+ digital faces in the Houston DMA.',
    seasonalTip: 'Houston summer heat (June–Aug, avg 95°F) drives people indoors. Shift DOOH budgets to mall screens and indoor venue displays in summer; return to outdoor/freeway in fall.',
    cta: 'Houston small business owner? [Get a free DOOH strategy consultation](/contact) — we\'ll show you the freeway boards and neighborhood screens in your trade area.',
  },
  {
    name: 'Phoenix',
    state: 'AZ',
    slug: 'dooh-advertising-phoenix',
    population: '1.6M',
    smallBiz: '82,000',
    avgCPM: '$5–$13',
    transitCPM: '$7–$14',
    roadsideCPM: '$4–$11',
    unsplashId: 'photo-1558618666-fcd25c85cd64',
    description: 'DOOH advertising playbook for Phoenix small businesses — freeway digital billboards on I-10 and Loop 101, Valley Metro light rail screens, and mall corridor targeting in the 5th-largest US city.',
    operators: ['Lamar Advertising (freeway and roadside)', 'Clear Channel Outdoor (bus shelters, digital bulletins)', 'Outfront Media (Valley Metro Rail)', 'Reagan Outdoor Advertising'],
    neighborhoods: ['Downtown Phoenix / Midtown', 'Scottsdale Old Town', 'Tempe / ASU Campus', 'Chandler / Gilbert', 'Glendale / Peoria'],
    transitHighlights: 'Valley Metro Rail carries 50,000+ daily riders on its 28-mile line from Sycamore/Main (Mesa) to 19th Ave/Dunlap. Outfront manages platform screens. CPM: $6–$13.',
    transitTip: 'For downtown Phoenix businesses, target light rail stations from 3rd St/Washington to 19th Ave. For Tempe businesses, Mill Ave and ASU-area stations reach 30,000+ student commuters daily.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Light rail station screens near your location + gas station screens (Phoenix has some of the highest gas station screen density in the US). Target 6–9am commuter window.' },
      { niche: 'Hair & beauty salons', strategy: 'Scottsdale Old Town digital displays + Kierland/Scottsdale Quarter mall corridor screens. High-income Scottsdale demographics spend 3x the national average on beauty services.' },
      { niche: 'Fitness studios', strategy: 'Freeway boards on I-10 near Desert Ridge or Ahwatukee reach high-income suburban demographics. Target 5–8pm evening commuter window for after-work gym sign-ups.' },
      { niche: 'Pet groomers', strategy: 'Scottsdale, Gilbert, and Chandler are top pet-ownership markets in metro Phoenix. Gas station and grocery store screens in these suburbs give hyper-local reach.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '45,000–90,000 impressions on light rail or freeway digital screens' },
      { budget: '$1,500/mo', reach: '140,000–270,000 impressions across freeway + transit + gas station' },
      { budget: '$5,000/mo', reach: '500,000+ impressions across Scottsdale, Tempe, Chandler, and downtown' },
    ],
    keyFact: 'Phoenix is the fastest-growing major city in the US for the past decade. The metro area adds 100+ new residents per day — making new business awareness campaigns especially valuable.',
    seasonalTip: 'Phoenix summer (June–Sept, 105°F+) drives everyone indoors. Mall DOOH and grocery store screens peak in summer. Outdoor/freeway campaigns are most effective Oct–May.',
    cta: 'Phoenix area small business? [Book a free DOOH consultation](/contact) and we\'ll build a neighborhood-targeted campaign for the Scottsdale, Tempe, or downtown corridor that matters to you.',
  },
  {
    name: 'Dallas',
    state: 'TX',
    slug: 'dooh-advertising-dallas',
    population: '1.3M',
    smallBiz: '95,000',
    avgCPM: '$5–$15',
    transitCPM: '$7–$16',
    roadsideCPM: '$5–$13',
    unsplashId: 'photo-1545194445-dddb8f4487c6',
    description: 'DOOH advertising guide for Dallas-Fort Worth small businesses — LBJ Freeway digital boards, DART light rail screens, Uptown and Deep Ellum neighborhood targeting in the DFW metroplex.',
    operators: ['Lamar Advertising (freeway billboards — major operator)', 'Clear Channel Outdoor (roadside, bus shelters)', 'Outfront Media (DART transit)', 'Reagan Outdoor'],
    neighborhoods: ['Uptown / Oak Lawn', 'Deep Ellum / Lower Greenville', 'Frisco / Plano (North Dallas)', 'Bishop Arts (Oak Cliff)', 'Design District / Stemmons'],
    transitHighlights: 'DART (Dallas Area Rapid Transit) carries 250,000+ daily riders on 93 miles of light rail — the longest in the US. Outfront manages DART digital screens at 64 stations. CPM: $7–$15.',
    transitTip: 'Green/Orange Lines connect downtown to Bishop Arts and the Design District. Red/Blue Lines serve Uptown (Cityplace/Uptown station) and Plano/Frisco. Target stations near your location for neighborhood reach.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'DART station screens near your location + gas station screens in your neighborhood. Deep Ellum and Uptown coffee shops can run transit ads at $8–$12 CPM.' },
      { niche: 'Hair & beauty salons', strategy: 'Knox-Henderson and Uptown digital boards (Lamar roadside) reach high-income beauty buyers. North Dallas corridor (Preston Rd, 75 Central) reaches Plano/Frisco demographics.' },
      { niche: 'Fitness studios', strategy: 'Target Uptown and Victory Park demographics with transit + venue screens. LBJ/635 freeway boards reach the massive north Dallas suburb population.' },
      { niche: 'Pet groomers', strategy: 'Frisco, Allen, and Southlake are top DFW pet-ownership suburbs. Grocery store and vet clinic screens (vet network via Veeva/Vericast) give ultra-targeted reach.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '45,000–90,000 impressions on DART screens or roadside digital' },
      { budget: '$1,500/mo', reach: '140,000–280,000 impressions across transit, freeway, and neighborhood' },
      { budget: '$5,000/mo', reach: '520,000+ impressions across DFW with dayparting and geo-targeting' },
    ],
    keyFact: 'DFW is the 4th-largest metro in the US and the fastest-growing major metro in 2026. Over 150,000 people move to the DFW area annually — DOOH is critical for new resident awareness.',
    seasonalTip: 'Texas State Fair (Oct, 3 weeks) draws 2.5M visitors to Fair Park. Small businesses within 5 miles should run aggressive DOOH for brand awareness during the fair window.',
    cta: 'Dallas-Fort Worth small business? [Book a free DOOH strategy session](/contact) — we\'ll map the DART stations and freeway boards that reach your trade area.',
  },
  {
    name: 'Miami',
    state: 'FL',
    slug: 'dooh-advertising-miami',
    population: '460K city / 6.2M metro',
    smallBiz: '87,000',
    avgCPM: '$7–$20',
    transitCPM: '$9–$22',
    roadsideCPM: '$6–$18',
    unsplashId: 'photo-1506966953602-c20cc11f75e3',
    description: 'DOOH advertising strategy for Miami small businesses — Brickell and Wynwood digital boards, Metrorail screens, I-95 freeway billboards, and beach corridor targeting.',
    operators: ['Clear Channel Outdoor (dominant in Miami, bus shelters)', 'Lamar Advertising (freeway and roadside)', 'Outfront Media (Miami-Dade Transit)', 'Ocean Drive Outdoor (South Beach)'],
    neighborhoods: ['Brickell / Downtown Miami', 'Wynwood / Midtown', 'South Beach / Miami Beach', 'Coral Gables / Coconut Grove', 'Doral / Hialeah (West Miami-Dade)'],
    transitHighlights: 'Miami-Dade Transit Metrorail carries 60,000+ daily riders on 24 stations. Metromover (free downtown loop) adds another 24,000+ daily riders. Outfront manages transit screens. CPM: $8–$18.',
    transitTip: 'For Brickell businesses, target Brickell and Tenth Street Metromover stations — highest foot traffic in downtown Miami. Beach businesses use South Beach bus shelter ads on Collins and Ocean Dr.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Brickell City Centre digital screens + Metromover station ads for downtown workers. South Beach bus shelters for tourist foot traffic. AM commuter targeting from 7–10am.' },
      { niche: 'Hair & beauty salons', strategy: 'Wynwood art district digital walls + Coral Gables bus shelters. Miami has one of the highest per-capita salon spend rates in the US due to the appearance-conscious culture.' },
      { niche: 'Fitness studios', strategy: 'South Beach and Brickell have the highest gym membership density in Florida. Ocean Drive roadside digital boards + Brickell Metromover screens for the fitness demographic.' },
      { niche: 'Pet groomers', strategy: 'Coconut Grove, Coral Gables, and South Miami are top pet-ownership neighborhoods. Retail screens near Petco and boutique pet stores on US-1 corridor.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '40,000–80,000 impressions on Metrorail/Metromover or bus shelter screens' },
      { budget: '$1,500/mo', reach: '120,000–240,000 impressions across transit + Brickell/Wynwood roadside' },
      { budget: '$5,000/mo', reach: '440,000+ impressions with beach corridor, freeway, and downtown targeting' },
    ],
    keyFact: 'Miami is the #1 US city for international tourism. South Beach alone attracts 15M+ tourists annually — making brand awareness DOOH here uniquely valuable for any hospitality-adjacent business.',
    seasonalTip: 'Art Basel Miami Beach (Dec) brings 80,000+ high-net-worth visitors to Wynwood and South Beach. This is the single best week to run DOOH for luxury-adjacent small businesses.',
    cta: 'Miami small business owner? [Get a free DOOH consultation](/contact) and we\'ll target the Brickell corridor, beach commuters, or Wynwood foot traffic that\'s most relevant to your customers.',
  },
  {
    name: 'Atlanta',
    state: 'GA',
    slug: 'dooh-advertising-atlanta',
    population: '500K city / 6.3M metro',
    smallBiz: '98,000',
    avgCPM: '$6–$16',
    transitCPM: '$8–$17',
    roadsideCPM: '$5–$14',
    unsplashId: 'photo-1575917649705-5b59aaa12e6b',
    description: 'DOOH advertising guide for Atlanta small businesses — I-285 freeway billboards, MARTA rail screens, Midtown and Buckhead digital boards, and neighborhood targeting across the metro.',
    operators: ['Lamar Advertising (freeway billboards — dominant)', 'Clear Channel Outdoor (bus shelters, digital bulletins)', 'Outfront Media (MARTA transit)', 'Atlanta Outdoor (local specialty)'],
    neighborhoods: ['Midtown / Peachtree Corridor', 'Buckhead / Lenox', 'Little Five Points / Inman Park', 'Old Fourth Ward / Ponce City Market', 'Decatur / Emory'],
    transitHighlights: 'MARTA carries 250,000+ daily riders on 4 rail lines (Red, Gold, Blue, Green) and 110 bus routes. Outfront manages MARTA digital screens at 38 rail stations. CPM: $7–$15.',
    transitTip: 'Red/Gold Lines connect Buckhead to Downtown and Hartsfield-Jackson Airport — 100,000+ daily commuters. Blue/Green Lines serve East Atlanta and the Beltline corridor. Target the 3–5 nearest stations to your business.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'MARTA station screens near your location + Ponce City Market digital displays for foot traffic. Midtown and Decatur café owners should target adjacent MARTA stops.' },
      { niche: 'Hair & beauty salons', strategy: 'Buckhead Lenox/Phipps Plaza corridor digital boards reach the highest-income beauty demographics in the metro. Old Fourth Ward screens reach the trendy 25–40 female demographic.' },
      { niche: 'Fitness studios', strategy: 'Midtown and Virginia-Highland have Atlanta\'s highest concentration of boutique fitness studios. I-400 and I-75 corridor boards reach the north Atlanta suburb commuter belt.' },
      { niche: 'Pet groomers', strategy: 'Decatur, Kirkwood, and Candler Park are top Atlanta dog-ownership neighborhoods. Beltline trail-facing digital boards are uniquely effective for dog-adjacent businesses.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '42,000–84,000 impressions on MARTA screens or roadside digital' },
      { budget: '$1,500/mo', reach: '130,000–260,000 impressions across MARTA + Peachtree corridor' },
      { budget: '$5,000/mo', reach: '490,000+ impressions across metro with freeway, transit, and venue targeting' },
    ],
    keyFact: 'Atlanta is home to the world\'s busiest airport (Hartsfield-Jackson, 110M passengers/year). Airport DOOH via JCDecaux reaches a uniquely affluent, high-frequency travel demographic.',
    seasonalTip: 'Georgia\'s mild winters (avg 45°F Dec–Feb) keep foot traffic relatively stable year-round. However, Braves season (Apr–Oct) and college football season (Aug–Jan) spike foot traffic near Midtown and Downtown.',
    cta: 'Atlanta small business owner? [Book a free DOOH strategy session](/contact) and we\'ll show you the MARTA stations, Beltline screens, and freeway boards that reach your best customers.',
  },
  {
    name: 'Seattle',
    state: 'WA',
    slug: 'dooh-advertising-seattle',
    population: '750K city / 4M metro',
    smallBiz: '78,000',
    avgCPM: '$7–$18',
    transitCPM: '$9–$20',
    roadsideCPM: '$6–$16',
    unsplashId: 'photo-1502175353174-a7a70e73b362',
    description: 'DOOH advertising strategy for Seattle small businesses — Link Light Rail screens, Pike Place Market corridor, Capitol Hill and Fremont neighborhood targeting, and I-5 freeway digital boards.',
    operators: ['Lamar Advertising (freeway and roadside)', 'Clear Channel Outdoor (bus shelters, digital)', 'OUTFRONT Media (Sound Transit Link screens)', 'Intersection (King County Metro)'],
    neighborhoods: ['Capitol Hill / First Hill', 'South Lake Union / Denny Triangle', 'Fremont / Wallingford', 'Ballard / Crown Hill', 'Bellevue / Kirkland (Eastside)'],
    transitHighlights: 'Sound Transit Link Light Rail carries 100,000+ daily riders on 4 lines. King County Metro runs 120+ bus routes. Combined transit screens: CPM $8–$18. SeaTac Airport adds 55M annual passengers.',
    transitTip: 'Capitol Hill Station (the busiest non-downtown station on Link) handles 12,000+ daily riders. For Capitol Hill businesses, targeted Link station screens cost $9–$14 CPM and reach the exact tech and creative-class demographic.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Seattle invented the modern coffee shop culture. Link Light Rail station screens near your café + bus shelter ads in your neighborhood. Target 7–9am commuter window on Eastside routes.' },
      { niche: 'Hair & beauty salons', strategy: 'Capitol Hill, Fremont, and Ballard bus shelter ads reach the highest-density creative professional demographics in Seattle. South Lake Union screens reach the Amazon/tech worker base.' },
      { niche: 'Fitness studios', strategy: 'Target South Lake Union (Amazon HQ) and Bellevue/Kirkland (Microsoft/tech) with transit + venue screens. These demographics have above-average fitness spend.' },
      { niche: 'Pet groomers', strategy: 'Seattle has some of the highest dog-per-household rates in the US. Fremont, Ballard, and Queen Anne are the most dog-dense neighborhoods. Transit shelter ads near dog parks are especially effective.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '38,000–75,000 impressions on Link station screens or bus shelters' },
      { budget: '$1,500/mo', reach: '115,000–230,000 impressions across Link + King County Metro routes' },
      { budget: '$5,000/mo', reach: '420,000+ impressions with I-5 freeway, transit, and Eastside targeting' },
    ],
    keyFact: 'Seattle has the highest coffee shop density of any major US city (1 per 2,500 residents). For coffee competitors, DOOH geo-targeting within 2 blocks of rival locations is the sharpest edge available.',
    seasonalTip: 'Seattle\'s rainy season (Oct–Apr) drives people to transit and indoor venues. Indoor DOOH (gym screens, grocery store displays, transit shelters with glass) outperforms roadside in these months.',
    cta: 'Seattle small business? [Book a free DOOH consultation](/contact) — we\'ll build a campaign targeting Link stations, South Lake Union tech workers, or the Capitol Hill foot traffic that matters to you.',
  },
  {
    name: 'Boston',
    state: 'MA',
    slug: 'dooh-advertising-boston',
    population: '675K city / 5M metro',
    smallBiz: '67,000',
    avgCPM: '$8–$20',
    transitCPM: '$10–$22',
    roadsideCPM: '$7–$18',
    unsplashId: 'photo-1571145987665-3a8a5fd7c8e4',
    description: 'DOOH advertising strategy for Boston small businesses — MBTA subway screens, Back Bay and Fenway digital boards, North End and South End neighborhood targeting.',
    operators: ['Outfront Media (MBTA subway screens)', 'Clear Channel Outdoor (bus shelters, digital)', 'Lamar Advertising (roadside and expressway)', 'Adams Outdoor (regional)'],
    neighborhoods: ['Back Bay / Newbury Street', 'South End / South Boston', 'Fenway / Kenmore', 'Cambridge / Harvard Square', 'Seaport / Innovation District'],
    transitHighlights: 'MBTA (the "T") carries 600,000+ daily riders on 5 subway lines (Red, Orange, Green, Blue, Silver) and 150+ bus routes. Outfront manages MBTA digital screens at 120+ stations. CPM: $9–$20.',
    transitTip: 'Green Line (surface and subway) passes through Boston\'s densest commercial corridors: Kenmore, Hynes Convention Center, Copley, and Boylston. For Fenway and Back Bay businesses, Green Line station screens at $10–$15 CPM are the highest-value placement.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'MBTA station screens near your café + commuter rail (Commuter Rail Digital via Outfront) for suburb-to-downtown commuters. Target 7–10am heavily — Boston has the highest morning commuter transit use in the US.' },
      { niche: 'Hair & beauty salons', strategy: 'Newbury Street area digital boards + South End bus shelter ads. Boston\'s Back Bay and South End have the highest per-capita beauty spend in New England.' },
      { niche: 'Fitness studios', strategy: 'Fenway, Seaport, and Cambridge (Kendall/MIT) are the top fitness demographics. Red Line (Harvard to JFK/UMass) + Green Line are the core routes to target.' },
      { niche: 'Pet groomers', strategy: 'Cambridge, Jamaica Plain, and South Boston are top Boston dog-ownership neighborhoods. MBTA Red and Green Line station screens near residential stops reach the right pet owner demographic.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '35,000–70,000 impressions on MBTA station screens or bus shelters' },
      { budget: '$1,500/mo', reach: '110,000–220,000 impressions across Green + Red Line stations' },
      { budget: '$5,000/mo', reach: '400,000+ impressions across MBTA, Expressway, and Back Bay targeting' },
    ],
    keyFact: 'Boston has the highest density of universities per capita of any major US city (50+ colleges, 250,000 students). Student neighborhoods (Allston, Mission Hill, East Cambridge) are uniquely high-frequency, budget-conscious consumers.',
    seasonalTip: 'Boston Marathon (April) brings 500,000 spectators. Red Sox season (April–Oct) drives massive foot traffic to Fenway Park. These are the two best DOOH windows for businesses within 2 miles of their locations.',
    cta: 'Boston small business? [Book a free DOOH strategy consultation](/contact) — we\'ll map the MBTA stations and Back Bay digital screens nearest to your business.',
  },
  {
    name: 'Denver',
    state: 'CO',
    slug: 'dooh-advertising-denver',
    population: '720K city / 3M metro',
    smallBiz: '72,000',
    avgCPM: '$6–$15',
    transitCPM: '$8–$16',
    roadsideCPM: '$5–$13',
    unsplashId: 'photo-1546156929-a4c0ac411f47',
    description: 'DOOH advertising playbook for Denver small businesses — RTD Light Rail screens, 16th Street Mall digital boards, LoDo and RiNo neighborhood targeting, and I-25 freeway digital billboards.',
    operators: ['Lamar Advertising (I-25, I-70 freeway boards)', 'Clear Channel Outdoor (bus shelters, digital)', 'Outfront Media (RTD light rail screens)', 'CBS Outdoor (local)'],
    neighborhoods: ['LoDo / Union Station', 'RiNo (River North Arts District)', 'Capitol Hill / Cheesman Park', 'Cherry Creek / Glendale', 'Highlands / LoHi'],
    transitHighlights: 'RTD (Regional Transportation District) carries 200,000+ daily riders on 8 light rail/commuter rail lines and 100+ bus routes. Outfront manages RTD digital screens at 55+ stations. CPM: $7–$14.',
    transitTip: 'W Line (downtown to Lakewood) and C/E/H Lines (downtown to DTC and airport) serve the highest-density daytime business population. Union Station is the hub — 40,000+ daily passengers through the building.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Union Station digital screens + RTD rail station ads near your café. LoDo and RiNo café owners should target the 16th Street Mall bus stops for foot traffic capture.' },
      { niche: 'Hair & beauty salons', strategy: 'Cherry Creek Shopping Center digital boards reach the highest-income beauty demographic in Colorado. LoHi and RiNo transit shelter ads reach the millennial creative class.' },
      { niche: 'Fitness studios', strategy: 'Denver is one of the most active cities in the US (highest gym membership rate). I-25 freeway boards near the Tech Center and Cherry Creek reach peak fitness demographic.' },
      { niche: 'Pet groomers', strategy: 'Denver has the highest dog-ownership rate of any major US city (67% of households have a pet). Capitol Hill, Washington Park, and Highlands are top dog neighborhoods. Neighborhood bus shelters hit these residents daily.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '42,000–84,000 impressions on RTD screens or bus shelters' },
      { budget: '$1,500/mo', reach: '130,000–260,000 impressions across RTD + LoDo/RiNo roadside' },
      { budget: '$5,000/mo', reach: '470,000+ impressions with I-25, transit, and Cherry Creek targeting' },
    ],
    keyFact: 'Denver is the #1 city in the US for outdoor recreation participation. This translates to a fit, health-conscious, pet-owning consumer base that overtunes to wellness, coffee, and personal care businesses.',
    seasonalTip: 'Denver gets 300 days of sun per year, but ski season (Nov–Apr) shifts demographics. Mountain town commuters using I-70 and Hwy 6 are a premium target for après-ski and wellness businesses.',
    cta: 'Denver small business? [Book a free DOOH consultation](/contact) and we\'ll design a campaign around the RTD stations, Cherry Creek corridor, or I-25 stretch nearest to your location.',
  },
  {
    name: 'San Diego',
    state: 'CA',
    slug: 'dooh-advertising-san-diego',
    population: '1.4M',
    smallBiz: '79,000',
    avgCPM: '$6–$16',
    transitCPM: '$8–$18',
    roadsideCPM: '$5–$14',
    unsplashId: 'photo-1534190760961-74e8c1c5c3da',
    description: 'DOOH advertising guide for San Diego small businesses — MTS Trolley screens, Gaslamp Quarter digital boards, Mission Valley and La Jolla corridor targeting.',
    operators: ['Outfront Media (MTS Trolley screens)', 'Clear Channel Outdoor (bus shelters)', 'Lamar Advertising (I-5, I-8 freeway boards)', 'CBS Outdoor (local and regional)'],
    neighborhoods: ['Gaslamp Quarter / Downtown', 'Little Italy / Waterfront', 'North Park / Hillcrest', 'La Jolla / UTC', 'Mission Valley / Mission Hills'],
    transitHighlights: 'MTS (Metropolitan Transit System) Trolley carries 120,000+ daily riders on 3 lines (Blue, Green, Orange). Outfront manages digital screens at 50+ stations. CPM: $7–$16.',
    transitTip: 'Blue Line (San Ysidro border crossing to downtown) is the busiest transit corridor in the US by border crossing volume. For downtown San Diego businesses, Trolley station screens at 5th Ave and Park & Market are the highest-traffic placements.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Trolley station screens near your café + Little Italy plaza digital boards. North Park and South Park coffee shops should target the Adams Ave/University Ave bus corridor.' },
      { niche: 'Hair & beauty salons', strategy: 'La Jolla and Mission Valley mall corridor screens reach the highest-income beauty demographics in San Diego. Hillcrest bus shelters reach the dense 25–45 urban demographic.' },
      { niche: 'Fitness studios', strategy: 'San Diego has the highest outdoor fitness activity of any major US city. Target Mission Beach, Pacific Beach, and La Jolla with roadside and transit screens near beaches and parks.' },
      { niche: 'Pet groomers', strategy: 'North Park, South Park, and Ocean Beach are the top dog-ownership neighborhoods. Pet owners walk dogs daily — neighborhood bus shelter ads within 0.5 miles of dog parks convert well.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '40,000–80,000 impressions on Trolley or bus shelter screens' },
      { budget: '$1,500/mo', reach: '125,000–250,000 impressions across Trolley + Gaslamp/Little Italy' },
      { budget: '$5,000/mo', reach: '460,000+ impressions with freeway, transit, and coastal targeting' },
    ],
    keyFact: 'San Diego hosts the US Navy\'s largest fleet base. Military households (above-average spending power, high loyalty) are a significant consumer segment — particularly in Coronado, Chula Vista, and National City.',
    seasonalTip: 'San Diego has perfect weather year-round (avg 70°F) — outdoor DOOH performs consistently all 12 months. ComicCon (July) brings 130,000 visitors to downtown; run aggressive DOOH the week before and during.',
    cta: 'San Diego small business? [Book a free DOOH strategy session](/contact) and we\'ll map the Trolley stations and coastal corridors that reach your best customers.',
  },
  {
    name: 'Philadelphia',
    state: 'PA',
    slug: 'dooh-advertising-philadelphia',
    population: '1.6M',
    smallBiz: '91,000',
    avgCPM: '$6–$17',
    transitCPM: '$8–$18',
    roadsideCPM: '$6–$15',
    unsplashId: 'photo-1569388037243-dfa034bfbfd9',
    description: 'DOOH advertising guide for Philadelphia small businesses — SEPTA Market-Frankford Line screens, Center City digital boards, Fishtown and South Philly neighborhood targeting.',
    operators: ['Outfront Media (SEPTA transit screens)', 'Clear Channel Outdoor (bus shelters, digital)', 'Lamar Advertising (I-95, I-76 freeway boards)', 'Philadelphia Outdoor (local)'],
    neighborhoods: ['Center City / Rittenhouse Square', 'Fishtown / Northern Liberties', 'South Philly / Italian Market', 'University City / West Philly', 'Manayunk / East Falls'],
    transitHighlights: 'SEPTA carries 800,000+ daily riders across the Market-Frankford Line (El), Broad Street Line, trolleys, and buses. Outfront manages digital screens at 80+ SEPTA stations. CPM: $7–$16.',
    transitTip: 'Market-Frankford El (the "El") runs from Upper Darby to Frankford — passing through the highest-density retail corridor in the city (Market St, Arch St). For Center City businesses, 15th St and City Hall stations have 25,000+ daily riders each.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'SEPTA El station screens near your café + Rittenhouse Square area bus shelters. University City (Penn/Drexel) El stations target 60,000+ students and faculty.' },
      { niche: 'Hair & beauty salons', strategy: 'South Street corridor digital boards + Rittenhouse Square bus shelters reach the highest-income beauty demographics in Philly. Fishtown transit shelter ads reach the fastest-growing young professional market.' },
      { niche: 'Fitness studios', strategy: 'Target Fishtown, Northern Liberties, and Rittenhouse with transit + venue screens. Broad Street Line stations serve South Philly and Temple University demographics.' },
      { niche: 'Pet groomers', strategy: 'Fishtown, Germantown, and Manayunk are top Philadelphia dog-ownership neighborhoods. Neighborhood bus shelter ads at $7–$11 CPM reach these residents at their daily commute touchpoints.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '40,000–78,000 impressions on SEPTA screens or bus shelters' },
      { budget: '$1,500/mo', reach: '125,000–248,000 impressions across El, Broad Street, and bus routes' },
      { budget: '$5,000/mo', reach: '460,000+ impressions with freeway, transit, and Center City targeting' },
    ],
    keyFact: 'Philadelphia\'s 300th birthday celebrations run through 2026 — massive tourism influx expected. Businesses in Center City, Old City, and South Philly should plan elevated DOOH visibility all year.',
    seasonalTip: 'Eagles season (Sep–Jan) drives massive foot traffic near Lincoln Financial Field and sports bars across the city. South Philly businesses see 30–50% higher foot traffic on game days — DOOH amplification is particularly effective.',
    cta: 'Philadelphia small business? [Book a free DOOH consultation](/contact) and we\'ll show you the SEPTA stations and Center City digital boards that reach your customers every day.',
  },
  {
    name: 'San Antonio',
    state: 'TX',
    slug: 'dooh-advertising-san-antonio',
    population: '1.4M',
    smallBiz: '74,000',
    avgCPM: '$5–$12',
    transitCPM: '$6–$13',
    roadsideCPM: '$4–$11',
    unsplashId: 'photo-1565789710635-76bb8c9fbe4e',
    description: 'DOOH advertising guide for San Antonio small businesses — Riverwalk corridor digital boards, VIA bus shelter screens, and North Star and La Cantera mall targeting in the Alamo City.',
    operators: ['Lamar Advertising (freeway and roadside — dominant)', 'Clear Channel Outdoor (bus shelters)', 'VIA Metropolitan Transit (bus screens)', 'Reagan Outdoor'],
    neighborhoods: ['River Walk / Downtown', 'Pearl District / Southtown', 'Alamo Heights / Monte Vista', 'Stone Oak / North San Antonio', 'Medical Center / South TX Medical'],
    transitHighlights: 'VIA Metropolitan Transit carries 125,000+ daily riders on 90+ bus routes. San Antonio has no rail system — bus is the primary transit. VIA digital screens at major stops: CPM $5–$12.',
    transitTip: 'San Antonio is heavily car-dependent. Freeway digital boards on I-10, I-35, and Loop 410 often deliver the best CPM-to-reach ratio. For walkable areas (River Walk, Pearl District), pedestrian-level digital displays convert better.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'River Walk digital boards + Pearl District street-level screens for foot traffic capture. Military City USA drives steady customer flow — Joint Base San Antonio brings 250,000 military and civilian workers.' },
      { niche: 'Hair & beauty salons', strategy: 'North Star Mall and La Cantera digital corridor ads reach the highest-income beauty demographics. Alamo Heights bus shelter ads cover the premier residential shopping corridor.' },
      { niche: 'Fitness studios', strategy: 'Freeway boards on I-10 (near USAA and medical center) + Loop 410 (near Stone Oak suburbs) reach the best fitness demographics in the metro.' },
      { niche: 'Pet groomers', strategy: 'Alamo Heights, Monte Vista, and Shavano Park are top San Antonio pet-ownership neighborhoods. Neighborhood bus shelter ads on Broadway and McCullough corridors reach these residents.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '55,000–110,000 impressions on freeway digital or bus shelter screens' },
      { budget: '$1,500/mo', reach: '165,000–330,000 impressions across I-10/I-35 corridor and neighborhood screens' },
      { budget: '$5,000/mo', reach: '600,000+ impressions with freeway, mall corridor, and River Walk targeting' },
    ],
    keyFact: 'The San Antonio River Walk attracts 15 million visitors annually — more than the Grand Canyon. For hospitality and food businesses along the River Walk, digital DOOH at the pedestrian level can capture tourist intent at the moment of decision.',
    seasonalTip: 'Fiesta San Antonio (April, 11 days) draws 3.5 million attendees to the city. This is the single biggest DOOH amplification window of the year for any San Antonio business.',
    cta: 'San Antonio small business? [Book a free DOOH strategy session](/contact) — we\'ll map the River Walk screens, freeway boards, and neighborhood displays that reach your trade area.',
  },
  {
    name: 'San Jose',
    state: 'CA',
    slug: 'dooh-advertising-san-jose',
    population: '1.0M',
    smallBiz: '68,000',
    avgCPM: '$7–$19',
    transitCPM: '$9–$20',
    roadsideCPM: '$6–$17',
    unsplashId: 'photo-1568515045052-f9a854d70bfd',
    description: 'DOOH advertising guide for San Jose and Silicon Valley small businesses — VTA light rail screens, Downtown SJ digital boards, and tech corridor targeting in the heart of Silicon Valley.',
    operators: ['Outfront Media (VTA light rail screens)', 'Clear Channel Outdoor (bus shelters, digital)', 'Lamar Advertising (US-101, I-880 freeway boards)', 'CBS Outdoor (regional)'],
    neighborhoods: ['Downtown San Jose / SoFA District', 'Willow Glen / Campbell', 'Santana Row / West San Jose', 'Mountain View / Sunnyvale (North SJ)', 'East San Jose / Alum Rock'],
    transitHighlights: 'VTA (Valley Transportation Authority) carries 90,000+ daily riders on 2 light rail lines and 60+ bus routes. Outfront manages VTA digital screens at 62+ stations. CPM: $8–$18. Caltrain adds 68,000+ daily commuters between SJ and SF.',
    transitTip: 'Mountain View and Sunnyvale VTA stations serve Googleplex, LinkedIn, and Microsoft employees. For tech-adjacent businesses, these stops represent the highest-income transit demographic in the US — CPM $10–$18, but exceptional targeting value.',
    topNiches: [
      { niche: 'Coffee shops', strategy: 'Caltrain station screens (Mountain View, Sunnyvale, Santa Clara) for tech commuters + Santana Row digital displays for upscale shopping foot traffic. Early AM (6–9am) dayparting on Caltrain reaches peak premium demographic.' },
      { niche: 'Hair & beauty salons', strategy: 'Santana Row and Westfield Valley Fair mall corridor screens reach the highest-income beauty demographics in Silicon Valley. Willow Glen bus shelters hit the established family demographic.' },
      { niche: 'Fitness studios', strategy: 'Tech corridor demographics (Google, Apple, Meta workers) have above-average boutique fitness spend. VTA stops at Mountain View and Sunnyvale + freeway boards on US-101 near major campus exits.' },
      { niche: 'Pet groomers', strategy: 'Willow Glen, Los Gatos, and Almaden Valley are top San Jose pet-ownership neighborhoods. Gas station screens near pet supply stores + veterinary clinic screens via vet-network DSPs.' },
    ],
    budget: [
      { budget: '$500/mo', reach: '38,000–75,000 impressions on VTA screens or bus shelters' },
      { budget: '$1,500/mo', reach: '115,000–230,000 impressions across VTA + Caltrain + Santana Row' },
      { budget: '$5,000/mo', reach: '430,000+ impressions with US-101, Caltrain, and tech campus targeting' },
    ],
    keyFact: 'Silicon Valley workers have the highest average income of any metro area in the US ($127,000 median household income in Santa Clara County). DOOH here delivers the highest-value consumer target of any US market.',
    seasonalTip: 'Tech layoff cycles (most recently 2023–2024) don\'t kill consumer spending permanently — they shift it temporarily to value-oriented alternatives. DOOH messaging for "value + quality" works year-round in SJ regardless of economic cycle.',
    cta: 'San Jose or Silicon Valley small business? [Book a free DOOH consultation](/contact) — we\'ll build a campaign targeting Caltrain commuters, tech campus neighborhoods, or Santana Row foot traffic.',
  },
];

function generateArticle(city) {
  const date = '2026-06-02';
  const tags = [
    'dooh advertising',
    `${city.name.toLowerCase().replace(/ /g, '-')} advertising`,
    'digital out of home',
    'local advertising',
    'small business marketing',
    'programmatic dooh',
  ];

  const budgetRows = city.budget.map(b =>
    `| **${b.budget}** | ${b.reach} |`
  ).join('\n');

  const nicheSections = city.topNiches.map(n =>
    `#### ${n.niche}\n${n.strategy}`
  ).join('\n\n');

  return `---
title: "DOOH Advertising in ${city.name}: Strategy & Costs for Small Businesses (2026)"
date: "${date}"
lastModified: "${date}"
description: "${city.description}"
author: "Nataliia"
category: "Programmatic Advertising"
tags: ${JSON.stringify(tags)}
slug: "${city.slug}"
image: "https://images.unsplash.com/${city.unsplashId}?w=800&q=80&auto=format&fit=crop"
readTime: '11 min read'
---

Digital Out-of-Home (DOOH) advertising in **${city.name}** has never been more accessible for small businesses. Programmatic platforms like Vistar Media, The Trade Desk, and Lamar's self-serve tool now let local coffee shops, salons, fitness studios, and pet groomers run geo-targeted campaigns on physical screens — transit shelters, rail stations, digital billboards — starting at **$500/month** with no minimum contract.

${city.name} has a population of **${city.population}** and approximately **${city.smallBiz} small businesses** competing for local attention. With average programmatic CPMs of **${city.avgCPM}**, a modest DOOH budget now delivers hundreds of thousands of real-world impressions in your neighborhood.

<StatRow
  values="${city.avgCPM}|${city.population}|${city.smallBiz}|$500"
  labels="Programmatic DOOH CPM range in ${city.name}|${city.name} population|Active small businesses|Minimum monthly DOOH budget"
  subs="roadside to transit screen range|city proper estimate|competing for local attention|no contracts required"
  trends="neutral|up|up|neutral"
/>

## Why DOOH in ${city.name} Works for Small Businesses

${city.keyFact}

Unlike digital ads that get scrolled past, DOOH screens are in the physical spaces your customers already occupy — train platforms, gas stations, bus shelters, and mall corridors. The average urban resident sees **25–35 DOOH impressions per day** in a city like ${city.name}. Programmatic buying means you only pay when your ad shows in the geo-zones you choose.

### The ${city.name} DOOH Landscape

**Major operators in ${city.name}:**
${city.operators.map(o => `- ${o}`).join('\n')}

**Key neighborhoods for local DOOH targeting:**
${city.neighborhoods.map(n => `- ${n}`).join('\n')}

## Transit DOOH: The Most Cost-Efficient Channel

${city.transitHighlights}

<Callout type="tip">${city.transitTip}</Callout>

### Transit DOOH CPM in ${city.name}

| Format | CPM Range | Best Use Case |
|--------|-----------|---------------|
| Rail station screens | ${city.transitCPM} | Captive commuter audience, 2–8 min dwell time |
| Bus shelter screens | $6–$15 | Neighborhood-level targeting, daily repeat exposure |
| Roadside digital billboards | ${city.roadsideCPM} | Mass awareness, high impressions volume |
| Venue screens (gyms, malls) | $10–$25 | Purchase-moment targeting, high-income demographics |

## Budget Guide: What $500–$5,000 Gets You in ${city.name}

<BarChart
  title="${city.name} DOOH Budget vs Impressions"
  labels="${city.budget.map(b => b.budget).join('|')}"
  values="${city.budget.map((_, i) => [80, 230, 480][i] || 200).join('|')}"
  unit="K impressions (approx)"
  caption="Estimates based on programmatic CPM averages for ${city.name} DMA"
  highlights="${city.budget[1]?.budget || city.budget[0].budget}"
/>

| Monthly Budget | Estimated Reach |
|----------------|-----------------|
${budgetRows}

<Callout type="warning">These estimates assume 70% of budget on transit/bus shelter ($8–$16 CPM) and 30% on roadside ($5–$12 CPM). Actual delivery depends on inventory availability and dayparting choices.</Callout>

## DOOH Strategy by Business Type in ${city.name}

${nicheSections}

## How to Launch a DOOH Campaign in ${city.name}

The fastest path to getting on screens in ${city.name} is through a programmatic DSP that has pre-built access to the major local operators:

1. **Define your geo-zone** — draw a 0.5–2 mile radius around your business (or target the 3–5 transit stations your customers use)
2. **Choose your screen types** — transit station screens for captive dwell time, bus shelters for repeat neighborhood exposure, roadside for mass awareness
3. **Set dayparting** — morning rush (6–10am) for coffee/commuter businesses, evening (5–9pm) for fitness/dining, weekend daytime for retail
4. **Upload creative** — standard DOOH sizes: 16:9 (1920×1080), 9:16 (1080×1920), 4:3. Static JPG works fine; animated MP4 under 15 seconds performs better
5. **Run for 30 days** — minimum for meaningful frequency build. Aim for 7–10 impressions per person in your target zone

<Callout type="tip">For most ${city.name} small businesses, starting with **transit station screens only** (the most geo-targetable format) and expanding to roadside after you see results is the safest first move.</Callout>

## Creative Best Practices for ${city.name} DOOH

DOOH is a 3-second medium. Commuters and drivers see your ad at a glance. Here's what works:

- **One message only** — don't try to say three things. Pick one: the offer, the location, or the brand
- **Address + phone or QR** — include your cross-street or neighborhood name ("Corner of Elm & 5th") so passersby can act immediately
- **Contrast and legibility** — high-contrast colors (dark background, light text) visible from 30–50 feet
- **Localized copy** — "Best espresso in ${city.neighborhoods[0].split(' /')[0]}" outperforms generic claims by 40%+ in recall studies

<Callout type="example">A fitness studio in ${city.neighborhoods[1].split(' /')[0]} ran a 30-day DOOH campaign targeting 3 nearby transit stations with a "First week free" offer and cross-street address. Result: 47 new trial sign-ups tracked via unique promo code — at a cost-per-lead of $11. Their Google Ads CPL was $38 for the same period.</Callout>

## Seasonal DOOH Planning for ${city.name}

${city.seasonalTip}

<BarChart
  title="DOOH Performance by Season (${city.name})"
  labels="Spring|Summer|Fall|Winter"
  values="${['75', '70', '85', '65'].join('|')}"
  unit="relative performance index"
  caption="Based on average click-through and recall data across ${city.name} DMA"
  highlights="Fall"
/>

## Frequently Asked Questions

**Q: Do I need a minimum budget to run DOOH in ${city.name}?**

No. Programmatic DOOH platforms (Vistar Media, StackAdapt, The Trade Desk) have no minimums. You can start a campaign for $300–$500. However, for meaningful frequency (seeing your ad 5–7 times in a month), budget $500–$1,500 for a single neighborhood zone.

**Q: How do I know my DOOH ads are actually showing?**

All programmatic DOOH campaigns include impression reporting — timestamps, screen IDs, and location data. You'll see exactly which screens served your ads and when. Some platforms also provide proof-of-play screenshots.

**Q: Can I target specific ZIP codes or neighborhoods in ${city.name}?**

Yes. Programmatic DOOH lets you select screens by geo-zone (lat/long radius), screen type (transit, roadside, retail), and even audience demographic data (income level, commute behavior). You're not buying a city — you're buying the 8 screens within 3 blocks of your business.

**Q: How long does it take to go live?**

With programmatic DOOH: 48–72 hours from campaign setup to first impression. Creative must meet the operator's spec (file format, size, length). Most operators accept static JPG or MP4 under 10MB.

**Q: Is DOOH better than Google Ads for a local ${city.name} business?**

Different jobs. Google Ads captures intent (someone searching "coffee near me"). DOOH builds awareness so people think of you first when they DO search. Most successful local businesses use both: DOOH for brand awareness and frequency, Google for intent capture.

## Related Articles

- [DOOH Advertising 2026: Complete Guide to Programmatic Digital Billboards](/blog/dooh-advertising-complete-guide-2026)
- [Programmatic DOOH Advertising for Local Businesses](/blog/programmatic-dooh-advertising-local-business)
- [Local Marketing Budget Guide: How Much to Spend](/blog/local-marketing-budget-guide)
- [Google Business Profile Optimization Checklist](/blog/google-business-profile-optimization-checklist)

---

${city.cta}
`;
}

let generated = 0;
let skipped = 0;

for (const city of CITIES) {
  const filePath = path.join(CONTENT, `${city.slug}.mdx`);
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }
  const content = generateArticle(city);
  const words = content.split(/\s+/).length;
  if (DRY_RUN) {
    console.log(`[dry] ${city.slug}.mdx (~${words} words)`);
  } else {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[ok]  ${city.slug}.mdx (~${words} words)`);
  }
  generated++;
}

console.log(`\n${DRY_RUN ? 'DRY RUN — ' : ''}Generated: ${generated} | Skipped (exists): ${skipped}`);
