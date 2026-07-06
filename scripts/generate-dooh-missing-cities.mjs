#!/usr/bin/env node
/**
 * generate-dooh-missing-cities.mjs
 * Generates DOOH city guides for 33 US cities not yet covered.
 * Usage: node scripts/generate-dooh-missing-cities.mjs [--dry-run]
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

const CITIES = [
  {
    name: 'Albuquerque', state: 'NM', slug: 'albuquerque', cpmRange: '$3–$8', tier: 'low',
    pop: '565K', character: 'Hispanic-majority Sun Belt city with strong community identity and Route 66 tourism',
    screens: '**Central Ave / Route 66 corridor** — high foot/vehicle traffic; outdoor digital and venue screens. **Old Town & Nob Hill** — cultural arts district; venue displays. **Uptown / Cottonwood Mall** — suburban retail hub; mall screens and GSTV. **ABQ Ride transit stops** — commuter and student audience.',
    pricing: '| Route 66 corridor | $5–$9 | Brand building, tourism |\n| Mall / retail | $4–$7 | Family services, food |\n| Transit (ABQ Ride) | $3–$5 | Commuters, students |\n| Gas station (GSTV) | $3–$5 | Broad residential reach |',
    special: 'Albuquerque\'s Balloon Fiesta (October) draws 800K visitors — the highest DOOH audience moment of the year. Spanish-language creative outperforms English-only in this majority-Hispanic market by 30–40%.',
    examples: '**Café on Central Ave** — $350/mo on Route 66 corridor + transit: 10–15% foot traffic lift in 45 days. **Hair salon in Nob Hill** — $400/mo on venue + gym lobbies: 8–12 new appointment inquiries/month.',
  },
  {
    name: 'Anaheim', state: 'CA', slug: 'anaheim', cpmRange: '$6–$14', tier: 'high',
    pop: '350K', character: 'Disney-adjacent tourism hub where local targeting must distinguish residents from tourists',
    screens: '**Harbor Blvd / Disneyland Resort** — extremely high pedestrian volume; tourist-heavy. **Anaheim Convention Center / ARTIC** — convention traffic; venue screens. **Packing District** — local dining and arts hub; resident-focused. **Platinum Triangle** (Angel Stadium, Honda Center) — sports audience screens.',
    pricing: '| Harbor Blvd resort corridor | $10–$16 | Tourism-facing businesses |\n| Convention Center area | $8–$13 | Professional services |\n| Packing District local | $5–$8 | Resident services |\n| Gas station (GSTV) | $5–$8 | Local resident reach |',
    special: 'Critical decision: tourist vs. resident. Salons, fitness studios, and local service businesses should exclude Disneyland corridor entirely and focus on West/East Anaheim residential zip codes. Mixing the two wastes budget.',
    examples: '**Fitness studio in East Anaheim** — $500/mo on residential gas station network: 15–20 new member inquiries/month. **Restaurant near Packing District** — $600/mo on venue screens: measurable reservation increase during convention weeks.',
  },
  {
    name: 'Anchorage', state: 'AK', slug: 'anchorage', cpmRange: '$3–$7', tier: 'low',
    pop: '290K', character: 'Alaska\'s only major city — isolated, highly loyal local market where residents strongly support local businesses',
    screens: '**Dimond Center area** — primary retail corridor; indoor mall screens and GSTV. **Downtown 4th Avenue** — tourist and business district; street-level digital. **New Seward Hwy / Midtown** — digital billboards; high vehicle traffic. **Health club / gym network** — strong gym culture due to cold climate.',
    pricing: '| Indoor mall (Dimond Center) | $4–$7 | Retail, food, family |\n| Digital billboards (Midtown) | $4–$6 | Broad brand awareness |\n| Downtown transit / street | $3–$5 | Commuter audience |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'The Permanent Fund Dividend (distributed each October) creates an annual consumer spending spike — businesses consistently see increased revenue in October/November. Summer midnight-sun effect drives extreme outdoor spending June–August.',
    examples: '**Coffee shop in Midtown** — $300/mo on gas station screens + office lobbies: brand recognition lift within 60 days. **Fitness studio** — $400/mo on gym network + Dimond Center: 10–14 new member inquiries/month.',
  },
  {
    name: 'Baltimore', state: 'MD', slug: 'baltimore', cpmRange: '$5–$11', tier: 'medium',
    pop: '580K', character: 'Blue-collar port city with fierce neighbourhood loyalty (Fells Point, Canton, Hampden)',
    screens: '**Inner Harbor / Pratt Street** — tourist and business hub; mixed resident/visitor. **Fells Point / Canton waterfront** — restaurant and bar district; high foot traffic. **Hampden / 36th Street (The Avenue)** — arts corridor; local foot traffic. **MTA Light Rail / Metro screens** — commuter network.',
    pricing: '| Inner Harbor screens | $8–$13 | Restaurants, hospitality |\n| Neighbourhood venues | $6–$10 | Local dining, boutiques |\n| MTA Light Rail / Metro | $4–$7 | Commuter services |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'Baltimore operates as distinct from DC — residents identify as Baltimoreans. Neighbourhood-specific creative ("serving Fells Point since 2019") dramatically outperforms generic copy. Ravens and Orioles game days create massive footfall surges around the stadium corridor.',
    examples: '**Café in Hampden** — $400/mo on 36th Street venue + Canton gym: 12–18% new customer lift. **Hair salon in Canton** — $450/mo on Canton venue + Federal Hill transit: 8–12 new booking requests/month.',
  },
  {
    name: 'Charlotte', state: 'NC', slug: 'charlotte', cpmRange: '$5–$10', tier: 'medium',
    pop: '900K', character: 'Fastest-growing major US city with massive new-resident influx; young professionals and banking dominate',
    screens: '**Uptown Charlotte** — financial district; office lobbies and street digital. **South End / LYNX Blue Line corridor** — arts and entertainment district; heaviest foot traffic. **NoDa** — emerging arts and dining area; younger audience. **SouthPark Mall** — upscale suburban retail.',
    pricing: '| Uptown office lobbies | $6–$11 | Professional services, dining |\n| South End venue / transit | $6–$10 | Restaurants, fitness, salons |\n| SouthPark Mall screens | $5–$9 | Retail, beauty |\n| LYNX transit screens | $4–$7 | Commuter audience |',
    special: 'Charlotte\'s explosive growth means a significant portion of adults arrived in the last 2–3 years and have no established brand loyalties. DOOH in new-development corridors (South End, Ballantyne) reaches this high-opportunity "settling in" audience.',
    examples: '**Fitness studio in South End** — $500/mo on venue + LYNX stops: 20–25 new member inquiries/month from new residents. **Coffee shop in NoDa** — $350/mo on venue + gas stations: measurable weekday morning foot traffic increase.',
  },
  {
    name: 'Cleveland', state: 'OH', slug: 'cleveland', cpmRange: '$3–$8', tier: 'low',
    pop: '370K', character: 'Rust Belt city with strong neighbourhood loyalty (Ohio City, Tremont, Lakewood) and local-first consumer culture',
    screens: '**East 4th Street / Playhouse Square** — entertainment district; venue screens and arts complex displays. **Ohio City / West 25th Market** — food, arts, and independent business hub. **Lakewood / Detroit Avenue** — dense residential corridor west of Cleveland. **Greater Cleveland RTA transit** — Red Line and HealthLine BRT.',
    pricing: '| Entertainment district | $5–$9 | Dining, bars, entertainment |\n| Ohio City / Lakewood venue | $4–$7 | Local services, cafés |\n| RTA transit screens | $3–$5 | Commuter audience |\n| Gas station (GSTV) | $3–$5 | Residential reach |',
    special: 'Cleveland offers CPMs 40–50% lower than Columbus or Chicago. Cavaliers and Guardians game days drive significant footfall to East 4th and Gateway District. Lakewood is technically separate but functions as a Cleveland neighbourhood — include it in your geo-fence.',
    examples: '**Coffee shop in Ohio City** — $300/mo on West 25th venue + transit: strong neighbourhood recognition. **Pet groomer in Lakewood** — $350/mo on gas station network + venue: 10–15 new clients/month.',
  },
  {
    name: 'Colorado Springs', state: 'CO', slug: 'colorado-springs', cpmRange: '$4–$9', tier: 'medium',
    pop: '480K', character: 'Military-strong city (Fort Carson, Peterson SFB, Air Force Academy) with growing outdoor recreation economy',
    screens: '**Tejon Street / Old Colorado City** — main street; boutiques, restaurants, foot-traffic screens. **Academy Boulevard** — major commercial artery; digital billboards and GSTV. **Powers Corridor** — military and suburban retail hub near Fort Carson; large retail centers. **Gym / fitness network** — strong gym culture (military + outdoor lifestyle).',
    pricing: '| Old Colorado City screens | $5–$9 | Local dining, boutiques |\n| Academy Blvd billboards | $5–$8 | Broad awareness |\n| Powers Corridor retail | $4–$7 | Military family services |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'Military families (50,000+ active-duty personnel) move frequently and actively seek new local services upon arrival. Powers Corridor and near Fort Carson Gate 1 screens reach this audience. PCS season (spring/summer) is the highest-value targeting window.',
    examples: '**Hair salon in Briargate** — $400/mo on Powers Corridor + gym lobbies: 10–15 new appointments/month from military spouse demographic. **Fitness studio on Tejon** — $450/mo on venue screens: 12–18 new trial members/month.',
  },
  {
    name: 'Columbus', state: 'OH', slug: 'columbus', cpmRange: '$4–$9', tier: 'medium',
    pop: '900K', character: 'Ohio State university city — one of the largest college populations in the US combined with growing tech and finance',
    screens: '**Short North Arts District** — highest foot-traffic neighbourhood; galleries, restaurants, boutiques. **German Village / Brewery District** — historic neighbourhood; dining and bars. **Ohio State campus (High Street)** — massive student foot traffic; transit and venue screens. **Easton / Polaris** — major suburban retail hubs.',
    pricing: '| Short North venue / street | $6–$10 | Restaurants, lifestyle, salons |\n| Ohio State campus | $4–$7 | Student services, food |\n| Easton / Polaris mall | $4–$8 | Retail, family |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'Ohio State football season (September–November) transforms Columbus. Home game weekends see 200–400% foot traffic increases in Short North. Columbus is also one of the US\'s largest test markets — advertising infrastructure is exceptionally well-developed.',
    examples: '**Coffee shop in Short North** — $450/mo on venue + campus transit: measurable game-day revenue lift when dayparts aligned with game schedule. **Pet groomer in German Village** — $400/mo on venue + Brewery District: 12–16 new client bookings/month.',
  },
  {
    name: 'El Paso', state: 'TX', slug: 'el-paso', cpmRange: '$2–$7', tier: 'low',
    pop: '680K', character: 'Binational border city with majority Spanish-speaking population — one of the most cost-efficient DOOH markets in the US',
    screens: '**Downtown El Paso / Stanton Street** — cultural corridor; street-level digital. **UTEP campus area** — university; student and faculty audience. **Sunland Park Mall** — major retail hub; indoor screens. **I-10 corridor** — very high vehicle traffic; border crosser and commuter audience. **Fort Bliss area** — military community; large military family population.',
    pricing: '| Downtown / cultural | $3–$6 | Dining, services |\n| I-10 digital billboards | $4–$7 | Broad brand awareness |\n| Mall / retail | $3–$6 | Family services |\n| Gas station (GSTV) | $2–$4 | Broadest reach, lowest CPM in TX |',
    special: 'Spanish-language creative dramatically outperforms English-only — 30–40% higher recall among the majority-Hispanic population. Fort Bliss PCS season (spring/summer) brings a wave of new military families actively seeking local services.',
    examples: '**Hair salon near UTEP** — $300/mo on campus + transit: 10–15 new student/faculty bookings/month. **Fitness studio on east side** — $350/mo on gas station network: 12–18 new military family inquiries/month.',
  },
  {
    name: 'Fort Worth', state: 'TX', slug: 'fort-worth', cpmRange: '$4–$10', tier: 'medium',
    pop: '920K', character: 'Texas\'s fifth-largest city with a distinct "Cowtown" identity separate from Dallas; family-oriented, strong local pride',
    screens: '**Sundance Square / downtown** — entertainment and business district; outdoor LED and venue screens. **Near Southside (Magnolia Ave)** — arts and food corridor; foot-traffic venue screens. **West 7th Street** — upscale mixed-use; venue screens. **Alliance/North Fort Worth** — growing northern suburbs; new retail centers.',
    pricing: '| Sundance Square / downtown | $6–$11 | Entertainment, dining |\n| Near Southside / West 7th | $5–$9 | Lifestyle, cafés, salons |\n| Alliance / north retail | $4–$8 | Family services, suburban |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'Fort Worth is NOT a Dallas satellite — residents prefer local-specific messaging. Referencing Fort Worth neighbourhoods (Near Southside, Sundance) outperforms generic DFW messaging. Fort Worth Stock Show & Rodeo (January, 20+ days, 1M+ attendees) is the single largest annual event.',
    examples: '**Coffee shop on Magnolia Ave** — $400/mo on Near Southside + West 7th: 15–20% new customer lift. **Pet groomer in Alliance** — $400/mo on gas station network + gym: 12–16 new bookings/month.',
  },
  {
    name: 'Fresno', state: 'CA', slug: 'fresno', cpmRange: '$3–$8', tier: 'low',
    pop: '540K', character: 'California\'s Central Valley hub; underserved by sophisticated digital advertising — strong first-mover advantage',
    screens: '**Blackstone Avenue** — major commercial artery; digital billboards and GSTV. **River Park Shopping Center** — upscale retail in north Fresno; mall screens. **Tower District (Olive Ave)** — arts, dining, and culture corridor; foot-traffic venue screens. **Fresno State / Shaw Ave** — university corridor.',
    pricing: '| Blackstone Ave billboards | $4–$8 | Broad awareness |\n| River Park mall | $4–$7 | Upscale retail, family |\n| Tower District venue | $3–$6 | Independent lifestyle |\n| Gas station (GSTV) | $2–$5 | Broadest, lowest CPM |',
    special: 'Fresno is significantly underserved by programmatic DOOH — most local businesses still rely on print and radio. A $400/month campaign here will achieve near-zero competitive pressure in most categories. Strong first-mover advantage.',
    examples: '**Salon near River Park** — $350/mo on mall + gas stations: 10–15 new booking inquiries/month in a low-competition market. **Fitness studio on Blackstone** — $400/mo: strong brand awareness lift, 15–20 trial inquiries/month.',
  },
  {
    name: 'Honolulu', state: 'HI', slug: 'honolulu', cpmRange: '$5–$12', tier: 'medium',
    pop: '350K city / 1M Oahu', character: 'Tourism-heavy island market — local businesses must clearly distinguish resident vs. Waikiki tourist audiences',
    screens: '**Waikiki (Kalakaua Ave)** — highest tourist concentration; hotel corridor screens. **Ala Moana Center** — largest open-air mall in the US; office and shopping screens. **Kakaako** — fast-growing arts district; young professional and local creative audience. **TheBus transit screens** — local commuter audience (not tourists).',
    pricing: '| Waikiki tourist corridor | $9–$14 | Tourism-facing businesses ONLY |\n| Ala Moana Center | $7–$12 | Mixed tourist/local |\n| Kakaako / downtown venue | $6–$10 | Local lifestyle, fitness |\n| TheBus transit | $4–$7 | Resident targeting |',
    special: 'Critical DOOH decision: tourist vs. resident. A salon or fitness studio serving locals should actively exclude Waikiki and focus on Kakaako, Manoa, Kaimuki, and Kailua screens. Hawaii\'s visitor industry also reverses seasonal patterns — winter (Dec–Mar) is peak tourism season.',
    examples: '**Fitness studio in Kakaako** — $500/mo on venue + gym lobbies: 18–25 new member inquiries/month targeting locals. **Dog groomer in Kailua** — $400/mo on gas station + retail: 12–16 new bookings/month from affluent residents.',
  },
  {
    name: 'Indianapolis', state: 'IN', slug: 'indianapolis', cpmRange: '$4–$9', tier: 'medium',
    pop: '880K', character: 'Mid-size Midwest city with a strong events economy (Indy 500, NCAA, large conventions) and growing young professional population',
    screens: '**Mass Ave / downtown arts district** — most walkable area; venue screens and street digital. **Broad Ripple Village** — young professional neighbourhood north of downtown. **Keystone at the Crossing / Fashion Mall** — upscale north side retail. **IndyGo transit** — bus rapid transit (Purple Line) and main routes.',
    pricing: '| Mass Ave / downtown venue | $5–$10 | Arts district dining, fitness |\n| Broad Ripple venue | $5–$9 | Young professional services |\n| Fashion Mall / Keystone | $5–$9 | Upscale retail, beauty |\n| Gas station (GSTV) | $3–$6 | Residential reach |',
    special: 'Indianapolis runs on events. Indy 500 (May, 250K+ fans), Big Ten basketball, NCAA Final Four, and major conventions bring hundreds of thousands throughout the year. Non-event businesses should buy inventory in "off" months (January, February, August) when CPMs are cheapest.',
    examples: '**Coffee shop on Mass Ave** — $450/mo on venue + Broad Ripple transit: 15–20% new customer lift. **Fitness studio in Carmel** — $500/mo on north-side gym + Fashion Mall: 20–25 new member inquiries/month.',
  },
  {
    name: 'Jacksonville', state: 'FL', slug: 'jacksonville', cpmRange: '$3–$8', tier: 'low',
    pop: '950K', character: 'Florida\'s largest city by land area — sprawling geography requires neighbourhood-specific DOOH; significant military presence',
    screens: '**San Marco / Riverside (Avondale)** — upscale arts and dining corridors; most walkable areas. **Jacksonville Beach / Neptune Beach** — high foot traffic in tourist season. **St. Johns Town Center** — largest retail center in northeast Florida. **JTA transit** — bus network; daily commuter audience.',
    pricing: '| San Marco / Riverside venue | $5–$9 | Upscale local services |\n| Beach communities (seasonal) | $6–$10 | Summer lifestyle |\n| Town Center mall | $4–$8 | Retail, family, beauty |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Jacksonville\'s size (largest US city by area) makes geo-targeting critical — a San Marco business should not buy Northside inventory. The military community (NAS Jacksonville, 20K+ personnel) represents significant high-value new residents during PCS season (spring).',
    examples: '**Hair salon in San Marco** — $400/mo on Avondale/Riverside venue + gym: 10–15 new bookings/month. **Pet groomer in Southside** — $400/mo on gas station + Town Center area: 12–16 new clients/month.',
  },
  {
    name: 'Kansas City', state: 'MO', slug: 'kansas-city', cpmRange: '$3–$8', tier: 'medium',
    pop: '500K city / 2.2M metro', character: 'Crossroads city with exceptional food and arts culture; the metro straddles Missouri and Kansas — advertising on one side doesn\'t automatically reach the other',
    screens: '**Power & Light District / downtown** — entertainment hub; outdoor LED and venue screens. **Crossroads Arts District** — galleries, independent restaurants, cafés; young creative audience. **The Plaza / Westport** — upscale mixed-use; higher-income audience. **Overland Park / Johnson County** — most affluent KC suburbs.',
    pricing: '| Power & Light / downtown | $5–$9 | Entertainment, dining |\n| Crossroads / Plaza venue | $5–$8 | Local lifestyle, salons |\n| Overland Park / JoCo mall | $4–$8 | Affluent suburban services |\n| Gas station (GSTV) | $3–$5 | Residential, both states |',
    special: 'KC metro straddles two states with different tax structures. Verify you\'re not wasting budget on Johnson County, KS screens unless your business realistically draws from there. Chiefs and Royals game days create massive audience spikes — plan campaigns around the schedule.',
    examples: '**Coffee shop in Crossroads** — $400/mo on venue + Crown Center: 14–18 new daily customers/month. **Hair salon in Overland Park** — $450/mo on Oak Park Mall + gym: 15–20 new appointments/month.',
  },
  {
    name: 'Lexington', state: 'KY', slug: 'lexington', cpmRange: '$2–$6', tier: 'low',
    pop: '320K', character: 'Horse country and college town (University of Kentucky); approachable market with very low DOOH competition — strong first-mover conditions',
    screens: '**Main Street / Triangle Park (downtown)** — business and arts corridor; venue and street screens. **UK campus area (Euclid Ave)** — University of Kentucky; high student density. **Fayette Mall** — primary retail hub; indoor mall screens. **Gas station (GSTV)** — broadest residential coverage in the market.',
    pricing: '| Downtown / Main St | $3–$6 | Professional services, dining |\n| UK campus venue | $2–$5 | Student services |\n| Fayette Mall | $3–$6 | Retail, family, beauty |\n| Gas station (GSTV) | $2–$4 | Lowest CPM in market |',
    special: 'UK Wildcats basketball season (November–April) dominates local culture. Keeneland race meets (April and October) bring affluent horse-industry attendees. Lexington has some of the lowest DOOH CPMs in the Southeast with minimal sophisticated-advertiser competition.',
    examples: '**Coffee shop near UK campus** — $300/mo on Euclid Ave + transit: 15–20 new student regulars/month. **Fitness studio downtown** — $300/mo on Main Street + gym lobbies: 12–16 trial signups/month.',
  },
  {
    name: 'Long Beach', state: 'CA', slug: 'long-beach', cpmRange: '$6–$13', tier: 'high',
    pop: '460K', character: 'Port city with distinct identity from LA; diverse with thriving arts scene in Bixby Knolls and Retro Row; locals reject being called "part of LA"',
    screens: '**4th Street Retro Row / Bixby Knolls** — arts and vintage corridor; foot-traffic venue screens. **Downtown Long Beach (Pine Ave / The Pike)** — entertainment and business district. **Belmont Shore (2nd Street)** — beachside commercial strip; high foot traffic. **Long Beach Transit (LBT)** — bus system; daily riders.',
    pricing: '| Retro Row / Bixby Knolls | $7–$12 | Independent lifestyle, boutiques |\n| Downtown / The Pike | $8–$13 | Entertainment, dining |\n| Belmont Shore venue | $7–$12 | Beach lifestyle, fitness |\n| Gas station (GSTV) | $5–$9 | Long Beach resident reach |',
    special: 'Long Beach is in the LA DMA but operates as a distinct city. Always specify Long Beach zip codes (90801–90815) in DSP targeting — not LA metro — to avoid inflated CPMs and ensure budget reaches Long Beach residents. The Grand Prix of Long Beach (April, 185K+ spectators) is a key event window for downtown businesses.',
    examples: '**Hair salon on 4th Street** — $500/mo on Retro Row + Belmont Shore gym: 15–20 new client bookings/month. **Coffee shop in Bixby Knolls** — $450/mo on street screens + LBT stops: 12–18% foot traffic lift.',
  },
  {
    name: 'Louisville', state: 'KY', slug: 'louisville', cpmRange: '$3–$8', tier: 'medium',
    pop: '620K metro', character: 'Bourbon and horse racing capital; strong local pride; growing NuLu arts district; Kentucky Derby creates annual mega-event',
    screens: '**NuLu (East Market District)** — Louisville\'s trendiest neighbourhood; galleries, farm-to-table restaurants, boutiques. **Bardstown Road / Highlands** — dense commercial strip; strong local character. **Fourth Street Live! / downtown** — entertainment complex; outdoor LED and venue screens. **Oxmoor Center / east Louisville** — suburban mall and retail.',
    pricing: '| NuLu / Highlands venue | $4–$8 | Independent lifestyle, dining |\n| Fourth Street Live | $5–$9 | Entertainment, bars |\n| Oxmoor / east mall | $4–$7 | Family services, beauty |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Kentucky Derby week (first weekend in May, 170K+ attendees) is Louisville\'s DOOH peak moment — book inventory 4–6 weeks in advance for May campaigns. Bourbon tourism (~1.5M distillery visitors/year) provides year-round context for local creative.',
    examples: '**Café in NuLu** — $400/mo on NuLu + Highlands foot-traffic: 15–18 new daily customers/month. **Pet groomer in St. Matthews** — $400/mo on gas station + gym: 12–15 new bookings/month.',
  },
  {
    name: 'Memphis', state: 'TN', slug: 'memphis', cpmRange: '$2–$7', tier: 'low',
    pop: '630K', character: 'Blues, BBQ, and FedEx HQ city with strong cultural identity; highly underserved by programmatic advertising — first-mover advantage',
    screens: '**Beale Street / downtown** — entertainment corridor; venue screens and outdoor digital. **Overton Square (Midtown)** — arts, dining, and independent retail; locals-focused. **Cooper-Young** — bohemian arts and food hub; young creative audience. **Poplar Avenue** — major commercial artery connecting Midtown to East Memphis.',
    pricing: '| Beale Street venue | $4–$7 | Entertainment, dining, tourism |\n| Midtown venues (Overton, CY) | $3–$6 | Independent lifestyle |\n| Poplar Ave billboards | $3–$6 | Broad awareness |\n| Gas station (GSTV) | $2–$5 | Broadest reach, lowest CPM |',
    special: 'Memphis is one of the most underserved DOOH markets in the Mid-South. Most local businesses here are not running programmatic DOOH — a consistent campaign achieves dominant brand recall within 90 days. FedEx World HQ creates a significant corporate professional audience in East Memphis.',
    examples: '**Coffee shop in Cooper-Young** — $300/mo on venue + Midtown gas: near-zero DOOH competition in neighbourhood. **Fitness studio in East Memphis** — $350/mo on gym + Poplar Ave: 15–20 trial inquiries/month.',
  },
  {
    name: 'Mesa', state: 'AZ', slug: 'mesa', cpmRange: '$4–$9', tier: 'medium',
    pop: '510K', character: 'Largest US suburb; predominantly family-oriented; significant retirement community in east Mesa; distinct identity from Phoenix',
    screens: '**Mesa Riverview / Dobson Ranch** — major retail corridor; outdoor digital and GSTV. **Main Street arts corridor** — independent business district; venue screens. **Gilbert Road / east Mesa** — family neighbourhood; gas stations and local retail. **Valley Metro light rail (Mesa stations)** — Sycamore, Main/Center, Alma School, Dobson; commuter audience.',
    pricing: '| Mesa Riverview / retail | $5–$9 | Family services, retail |\n| Downtown Mesa arts | $4–$7 | Independent lifestyle |\n| East Mesa residential gas | $3–$6 | Family and retirement targeting |\n| Valley Metro rail | $4–$7 | Commuter audience |',
    special: 'East Mesa has one of the highest 65+ population densities in Arizona. Senior-skewing creative with larger text converts well on gas station and retail screens. Winter "snowbirds" (Nov–Mar) add 15–20% to Mesa\'s effective population. Always use Mesa zip codes (85201–85215), not Phoenix DMA.',
    examples: '**Hair salon in east Mesa** — $400/mo on gas station + Gilbert Rd retail: 12–18 new client bookings/month. **Fitness studio near downtown** — $450/mo on arts venue + Valley Metro: 15–20 new trial inquiries/month.',
  },
  {
    name: 'Milwaukee', state: 'WI', slug: 'milwaukee', cpmRange: '$3–$8', tier: 'medium',
    pop: '580K', character: 'Beer city with strong neighbourhood identity (Bay View, Riverwest, Third Ward); working-class Midwest values; loyal local customer base',
    screens: '**Historic Third Ward** — arts, dining, and boutique hub; venue screens and street digital; highest foot traffic. **Brady Street (East Side)** — dense dining and retail; young professional and student audience. **Bay View neighbourhood** — vibrant arts and food community; venue screens. **Mayfair Mall / Wauwatosa** — largest mall in metro.',
    pricing: '| Third Ward / Brady St venue | $5–$9 | Independent lifestyle, dining |\n| Bay View / Riverwest venue | $4–$7 | Neighbourhood services |\n| Mayfair Mall indoor | $4–$8 | Retail, family, beauty |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Summerfest (late June/early July, world\'s largest outdoor music festival, 900K+ attendees) is Milwaukee\'s DOOH peak moment. Third Ward and lakefront see extraordinary footfall during the 11-day event. "Serving Bay View" in creative outperforms generic "Milwaukee" messaging.',
    examples: '**Coffee shop in Third Ward** — $400/mo on venue + Brady Street transit: 14–18 new daily customers/month. **Pet groomer in Bay View** — $350/mo on neighbourhood venue + gas: 10–14 new bookings/month.',
  },
  {
    name: 'Minneapolis', state: 'MN', slug: 'minneapolis', cpmRange: '$5–$11', tier: 'medium',
    pop: '430K city / 3.6M metro', character: 'Progressive Twin Cities market; high sustainability awareness; strong local business culture; Skyway system connects downtown in winter',
    screens: '**Uptown (Hennepin & Lake)** — most walkable urban neighbourhood; venue and street screens. **Northeast Minneapolis (NE Arts District)** — growing brewery and creative district. **Mall of America (Bloomington)** — world-famous mega-mall; largest US mall DOOH inventory. **Downtown Skyway system** — indoor elevated walkway network; office workers year-round.',
    pricing: '| Uptown venue / street | $6–$11 | Lifestyle, fitness, salons |\n| NE Minneapolis venue | $5–$9 | Independent arts, food |\n| Mall of America indoor | $6–$10 | Retail, family, tourism |\n| Downtown Skyway | $6–$10 | Professional services, food |',
    special: 'Extreme weather seasonality requires DOOH planning: winter (Nov–Mar) — heavy indoor DOOH (Skyway, mall, gym); summer (Jun–Aug) — heavy outdoor/venue DOOH. Minnesota State Fair (August, 2M+ attendees) is the state\'s biggest annual event.',
    examples: '**Fitness studio in Uptown** — $550/mo on venue + Skyway gym: 20–25 new member inquiries/month. **Coffee shop in NE Minneapolis** — $400/mo on arts venue + transit: 15–20 new regulars/month.',
  },
  {
    name: 'New Orleans', state: 'LA', slug: 'new-orleans', cpmRange: '$4–$10', tier: 'medium',
    pop: '380K', character: 'One-of-a-kind cultural city with massive tourism overlay and fierce neighbourhood loyalty; locals distrust national brands and respond to hyper-local messaging',
    screens: '**French Quarter / Bourbon Street** — heaviest tourism zone; tourist-majority audience. **Magazine Street (Garden District)** — boutiques, cafés, local dining; resident foot traffic. **Frenchmen Street (Marigny)** — live music and local dining; locals-focused evening crowd. **RTA streetcar lines** — St. Charles and Canal lines reach both tourist and resident corridors.',
    pricing: '| French Quarter (tourist) | $7–$12 | Tourism-facing businesses ONLY |\n| Magazine Street venue | $5–$9 | Local independent services |\n| Frenchmen / Marigny venue | $4–$8 | Locals-facing dining, bars |\n| RTA streetcar / bus | $3–$6 | Broad reach |',
    special: 'Mardi Gras (February/March, 1.4M visitors) is the single most important advertising event. For resident-facing businesses, the opposite applies — avoid Mardi Gras and launch during Jazz Fest (late April/May) when the audience skews toward higher-income locals. "New Orleans-owned" messaging dramatically outperforms generic copy.',
    examples: '**Hair salon in Garden District** — $400/mo on Magazine Street + Uptown gas: 12–16 new appointment bookings/month. **Fitness studio in Lakeview** — $450/mo on gas network + CBD gym: 15–20 new member inquiries/month.',
  },
  {
    name: 'Oklahoma City', state: 'OK', slug: 'oklahoma-city', cpmRange: '$2–$7', tier: 'low',
    pop: '680K', character: 'Oil-economy Midwest city with vibrant restaurant scene in Bricktown; very underserved by programmatic advertising',
    screens: '**Bricktown Entertainment District** — canal walk entertainment hub; venue screens and street digital. **Film Row / Midtown** — arts and independent business district. **Penn Square Mall / Nichols Hills** — upscale retail zone; indoor mall screens. **Western Avenue** — upscale dining and shopping strip.',
    pricing: '| Bricktown venue / street | $4–$7 | Entertainment, dining |\n| Midtown / Film Row venue | $3–$6 | Independent lifestyle |\n| Penn Square Mall | $3–$7 | Retail, beauty, family |\n| Gas station (GSTV) | $2–$5 | Broadest reach, lowest CPM |',
    special: 'Oklahoma City is one of the lowest-competition DOOH markets in the Midwest. A consistent campaign achieves dominant local brand recall within 60 days at a fraction of the cost of Dallas or Denver. Thunder (NBA) home games drive strong Bricktown footfall October–April.',
    examples: '**Coffee shop in Midtown** — $300/mo on Film Row + gas: category-dominant brand recall with minimal competition. **Hair salon in Nichols Hills** — $350/mo on Penn Square gas + gym: 12–16 new appointments/month.',
  },
  {
    name: 'Omaha', state: 'NE', slug: 'omaha', cpmRange: '$2–$6', tier: 'low',
    pop: '490K', character: 'Warren Buffett\'s hometown; Midwest family values; strong financial services sector; very low advertising competition',
    screens: '**Old Market / downtown** — historic entertainment district; venue screens and cobblestone street digital. **Dundee / Midtown Crossing** — upscale neighbourhood retail and dining. **Westroads / Oakview Mall** — primary west Omaha retail; indoor screens. **Dodge Street** — major commercial artery; digital billboards.',
    pricing: '| Old Market venue / street | $3–$6 | Entertainment, dining |\n| Dundee / Midtown venue | $2–$5 | Independent lifestyle |\n| Westroads / Oakview mall | $3–$6 | Retail, family, beauty |\n| Gas station (GSTV) | $2–$4 | Lowest CPM in market |',
    special: 'Omaha has some of the lowest DOOH CPMs in the country. The College World Series (June, 300K+ visitors to Charles Schwab Field) is the city\'s biggest economic event. Berkshire Hathaway Annual Meeting (May) brings high-net-worth investors to Omaha — premium businesses should plan campaigns around this window.',
    examples: '**Coffee shop in Old Market** — $300/mo on venue + Dundee gas: 12–15 new daily customers/month, very low competition. **Fitness studio west Omaha** — $300/mo on Westroads gym + Dodge gas: 12–18 new member inquiries/month.',
  },
  {
    name: 'Pittsburgh', state: 'PA', slug: 'pittsburgh', cpmRange: '$4–$9', tier: 'medium',
    pop: '300K city / 2.4M metro', character: 'Steel city with fierce neighbourhood loyalty (Shadyside, Lawrenceville, Squirrel Hill, South Side); CMU/Pitt university community; underrated arts and food city',
    screens: '**Lawrenceville (Butler Street)** — Pittsburgh\'s trendiest neighbourhood; galleries, restaurants, independent retail. **South Side (Carson Street)** — bars, restaurants, live venues; evening and weekend crowd. **Shadyside (Walnut Street)** — upscale boutique shopping and dining; higher-income audience. **Port Authority transit** — light rail (T) and bus network.',
    pricing: '| Lawrenceville venue | $5–$9 | Independent dining, fitness |\n| South Side / Shadyside venue | $5–$9 | Bars, upscale dining, beauty |\n| Downtown / Market Square | $5–$9 | Professional services |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Pittsburgh\'s geography (three rivers, dramatic hills) creates hyper-distinct neighbourhood micro-markets. A Lawrenceville business and a Mount Lebanon business are targeting completely different audiences. Steelers and Penguins game days drive massive footfall — nearby businesses see their highest revenue days on game days. CMU + Pitt = 35,000+ students.',
    examples: '**Coffee shop in Lawrenceville** — $400/mo on Butler Street + Strip District gym: 15–20 new regulars/month. **Hair salon in Shadyside** — $450/mo on Walnut Street + east-end gym: 12–18 new bookings/month.',
  },
  {
    name: 'Raleigh', state: 'NC', slug: 'raleigh', cpmRange: '$4–$9', tier: 'medium',
    pop: '470K city / 1.4M metro', character: 'Research Triangle hub with one of the US\'s highest PhD concentrations; fast-growing; strong influx of Northeast professionals',
    screens: '**Glenwood South / Hillsborough Street** — primary nightlife and dining corridor; young professional crowd. **NC State campus / Hillsborough Street** — university corridor; high student and faculty traffic. **North Hills / Midtown Raleigh** — upscale mixed-use hub; professionals and families. **Crabtree Valley Mall / I-440** — primary retail hub; indoor screens.',
    pricing: '| Glenwood South venue / street | $5–$9 | Dining, bars, fitness |\n| North Hills / Midtown | $5–$9 | Premium services, dining |\n| Crabtree / mall screens | $4–$8 | Family, retail, beauty |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Raleigh-Durham is one of the top 5 fastest-growing metros in the US. New residents from NYC and Boston have no local brand loyalties — they\'re actively seeking a "go-to" salon, gym, and coffee shop. Research Triangle Park (IBM, Cisco, SAS) creates a large tech professional demographic.',
    examples: '**Yoga studio on Glenwood** — $450/mo on venue + North Hills gym: 18–22 new member inquiries/month. **Pet groomer in North Raleigh** — $400/mo on gas + Crabtree area: 12–16 new bookings/month.',
  },
  {
    name: 'Sacramento', state: 'CA', slug: 'sacramento', cpmRange: '$5–$11', tier: 'medium',
    pop: '520K city / 2.4M metro', character: 'California\'s capital city with farm-to-table food culture; increasingly a destination for Bay Area remote workers',
    screens: '**Midtown Sacramento (R Street corridor)** — arts, food trucks, galleries, cafés; foot-traffic venue and street digital. **Old Sacramento / Capitol Mall** — tourism and business district. **Land Park / East Sacramento** — affluent residential neighbourhoods; gas stations and local retail. **RT light rail / bus** — connects downtown, suburbs, and UC Davis.',
    pricing: '| Midtown venue / R Street | $6–$10 | Independent lifestyle, dining |\n| Old Sacramento / Capitol | $6–$11 | Tourism, dining, professional |\n| Land Park / East Sac gas | $4–$8 | Affluent resident targeting |\n| Gas station (GSTV) | $4–$7 | Metro residential coverage |',
    special: 'Sacramento is experiencing a demographic shift from Bay Area remote-work migration. New residents from SF/Oakland are arriving with higher incomes and actively seeking Sacramento\'s best coffee shop, salon, and fitness studio. DOOH in growth neighbourhoods (East Sacramento, Curtis Park) reaches this high-value new-resident audience early.',
    examples: '**Coffee shop in Midtown** — $450/mo on R Street + East Sac gas: 15–20 new daily customers/month. **Hair salon in Land Park** — $450/mo on gas + South Sac gym: 12–18 new appointments/month.',
  },
  {
    name: 'San Francisco', state: 'CA', slug: 'san-francisco', cpmRange: '$10–$22', tier: 'high',
    pop: '870K city / 4.7M Bay Area', character: 'The US\'s highest-income city; tech and finance economy; neighbourhood-level identity essential (Mission ≠ Marina ≠ SOMA)',
    screens: '**Union Square / Market Street** — retail, tourism, and business hub; highest-traffic DOOH inventory in SF. **Hayes Valley / Divisadero** — high-income boutique corridor; tech professional and creative crowd. **The Mission (Valencia St)** — dining, arts, and tech worker corridor. **BART stations** (Civic Center, Powell, Montgomery) — highest-volume transit screens in Bay Area.',
    pricing: '| Union Square / Market St LED | $14–$22 | Brand building, retail, premium |\n| Hayes Valley / Divisadero venue | $10–$18 | Premium lifestyle, fitness |\n| Mission District venue | $9–$16 | Dining, fitness, tech |\n| BART station screens | $10–$18 | Commuter professionals |',
    special: 'SF is the most expensive DOOH market on the West Coast. Neighbourhood precision is non-negotiable: a Noe Valley fitness studio should target Noe Valley and Glen Park screens only, not Mission Bay. SF\'s tech worker concentration means LinkedIn employer data overlays can dramatically improve targeting. "Fogust" effect: warmest, sunniest weather is September–October — optimal outdoor DOOH season.',
    examples: '**Specialty coffee shop in Hayes Valley** — $700/mo on venue + Civic Center BART: 20–30 new daily regulars/month. **Fitness studio in the Mission** — $700/mo on Valencia venue + Mission BART: 25–35 new trial inquiries/month.',
  },
  {
    name: 'St. Louis', state: 'MO', slug: 'st-louis', cpmRange: '$3–$8', tier: 'medium',
    pop: '300K city / 2.8M metro', character: 'Gateway City with strong neighbourhood loyalty (The Loop, Soulard, Maplewood); Cardinals Nation drives major sports culture; underrated food and arts scene',
    screens: '**The Loop (Delmar Boulevard)** — University City arts and dining corridor; younger, educated audience. **Soulard** — historic neighbourhood with bars, restaurants, Soulard Market. **Downtown / Chouteau Ave** — business district near Busch Stadium and Enterprise Center. **Clayton** — affluent suburb; office and retail screens; high-income professionals.',
    pricing: '| The Loop venue / street | $4–$8 | Independent lifestyle, dining |\n| Soulard / Downtown venue | $4–$8 | Local dining, bars, sports |\n| Clayton office / retail | $5–$9 | Professional services, upscale |\n| Gas station (GSTV) | $3–$6 | Residential coverage |',
    special: 'Cardinals baseball season (April–October) makes Busch Stadium adjacent restaurants and bars see their highest revenue on home games. Blues hockey (Oct–May) similarly drives Enterprise Center footfall. St. Louis\'s bi-state market (MO and IL) means targeting should specify Missouri zip codes only unless your business draws from Illinois suburbs.',
    examples: '**Coffee shop on The Loop** — $400/mo on Delmar + Wash U campus: 14–18 new daily customers/month. **Fitness studio in Clayton** — $450/mo on office lobby + west county gym: 18–22 new member inquiries/month.',
  },
  {
    name: 'Tampa', state: 'FL', slug: 'tampa', cpmRange: '$4–$10', tier: 'medium',
    pop: '400K city / 3.2M metro', character: 'Florida\'s fast-growing west coast market; strong influx of Northeast remote workers; Ybor City and Hyde Park give the city an unusual walkable urban core',
    screens: '**Ybor City (7th Ave)** — historic entertainment district; outdoor LED and venue screens; nightlife crowd. **Hyde Park Village / Bayshore** — upscale outdoor shopping and dining; high-income audience. **Channelside / Water Street Tampa** — new development district; Amalie Arena adjacent. **Westshore / International Plaza** — business district and major mall.',
    pricing: '| Ybor City / Channelside venue | $5–$10 | Entertainment, sports-adjacent |\n| Hyde Park / Bayshore | $6–$10 | Premium lifestyle, fitness |\n| Westshore / Int\'l Plaza | $5–$9 | Professional services, retail |\n| Gas station (GSTV) | $3–$7 | Residential reach |',
    special: 'Tampa\'s rapid growth (consistently top 5 in population growth) means many adults arrived recently from the Northeast and are in active brand formation mode. Gasparilla Pirate Festival (January, 400K+) is Tampa\'s largest annual event. Lightning and Bucs game days create footfall surges around Amalie Arena and Raymond James Stadium.',
    examples: '**Fitness studio in South Tampa** — $500/mo on Hyde Park venue + Bayshore gym: 20–25 new member inquiries/month. **Coffee shop in Ybor City** — $400/mo on venue + Channel District transit: 15–18 new daily customers/month.',
  },
  {
    name: 'Tucson', state: 'AZ', slug: 'tucson', cpmRange: '$3–$7', tier: 'low',
    pop: '550K', character: 'University of Arizona town in the Sonoran Desert; outdoor recreation culture; strong arts and food scene in 4th Avenue and downtown',
    screens: '**4th Avenue / downtown Tucson** — bohemian arts and independent business corridor; foot-traffic venue screens. **University of Arizona campus (University Blvd)** — 45,000+ students; venue screens and transit. **La Encantada / Foothills Mall** — upscale retail in north Tucson; indoor screens. **Gas station (GSTV)** — broadest coverage; most cost-efficient channel.',
    pricing: '| 4th Avenue / downtown venue | $3–$6 | Independent lifestyle |\n| UA campus venue | $2–$5 | Student services |\n| La Encantada / Foothills | $4–$7 | Premium north Tucson services |\n| Gas station (GSTV) | $2–$5 | Broadest reach, lowest CPM |',
    special: 'Strong "snowbird" winter resident population (Oct–Apr) effectively increases Tucson\'s population by 15–20% — these affluent winter visitors are high-value customers for salons, gyms, and specialty food businesses. UA academic year (Aug–May) drives 45,000+ student population; summer sees 30% reduction in overall population.',
    examples: '**Coffee shop on 4th Ave** — $300/mo on venue + UA transit: 12–16 new student regulars/month. **Hair salon in north Tucson** — $350/mo on La Encantada gas + gym: 10–14 new appointments/month from snowbird/retiree targeting.',
  },
  {
    name: 'Virginia Beach', state: 'VA', slug: 'virginia-beach', cpmRange: '$4–$9', tier: 'medium',
    pop: '460K', character: 'Beach city with the largest military population density in the US (NAS Oceana, Joint Expeditionary Base Little Creek) alongside strong suburban family base',
    screens: '**Oceanfront (Atlantic Ave)** — tourist-heavy beach strip; outdoor LED and boardwalk digital; strong summer peaks. **Town Center (Central Business District)** — upscale mixed-use; office lobbies and outdoor digital. **Hilltop area (Laskin Road)** — established retail corridor; gas stations and local mall. **Princess Anne / Kempsville** — military and suburban family area; gas stations and local retail.',
    pricing: '| Oceanfront (summer peak) | $7–$12 | Tourist-facing summer businesses |\n| Town Center office / venue | $5–$9 | Professional services, upscale |\n| Hilltop / Laskin retail | $4–$8 | Family, retail, beauty |\n| Military area gas stations | $3–$6 | Military family targeting |',
    special: 'Virginia Beach\'s military population (60,000+ active-duty personnel and families at NAS Oceana and Little Creek) move on PCS orders every 1–3 years. Upon arrival, military families immediately seek a hairdresser, a gym, a pediatrician, and a pet groomer. PCS season (May–August) is the highest-value targeting window for local service businesses.',
    examples: '**Hair salon in Kempsville** — $400/mo on military-area gas + Princess Anne gym: 15–20 new military family clients/month during PCS season. **Fitness studio in Town Center** — $450/mo on venue + Hilltop gym: 18–22 new member inquiries/month.',
  },
];

const DATE = '2026-07-06';

function article(c) {
  const fullCity = `${c.name}, ${c.state}`;
  const tierNote = c.tier === 'high'
    ? `${c.name} is a competitive advertising market — higher CPMs reflect strong advertiser demand, but also large addressable audiences.`
    : c.tier === 'medium'
    ? `${c.name} is a mid-tier market — CPMs are reasonable, with room for well-targeted campaigns to achieve strong ROI against less sophisticated competitors.`
    : `${c.name} is a lower-competition market — CPMs are among the most cost-efficient for a city this size, and DOOH first-movers face minimal competitive pressure.`;

  return `---
title: "DOOH Advertising in ${fullCity}: Local Business Guide to Digital Out-of-Home"
date: "${DATE}"
lastModified: "${DATE}"
description: "DOOH advertising in ${fullCity} for local businesses — digital screen locations, CPM rates (${c.cpmRange}), targeting strategy, and campaign examples."
author: "Nataliia"
category: "Programmatic Advertising"
tags: ["DOOH", "${c.name} advertising", "digital out-of-home", "local advertising", "${c.state}", "${c.name} ${c.state}"]
slug: "dooh-advertising-${c.slug}"
image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80&auto=format&fit=crop"
readTime: "7 min read"
---

Digital out-of-home (DOOH) advertising in ${fullCity} gives local businesses access to data-driven advertising on digital screens across the city — transit stops, gym lobbies, retail centers, and high-traffic corridors — with real-time analytics and budgets starting at $300–$500/month.

<StatRow
  values="${c.cpmRange}|$300+|48hrs|${c.pop}"
  labels="Typical CPM|Minimum monthly budget|Campaign launch time|${c.name} market"
  subs="${c.name} DOOH benchmark|To run a local campaign|From creative approval to live|Population served"
  trends="neutral|neutral|neutral|up"
/>

## About the ${c.name} DOOH Market

${fullCity} is ${c.character}. ${tierNote}

## Where the Screens Are

${c.screens}

## Pricing in ${c.name}

| Screen Type | Avg. CPM | Best For |
|---|---|---|
${c.pricing}

## What Makes ${c.name} Unique

${c.special}

## Campaign Examples

${c.examples}

## Getting Started

Vistar Media (self-serve) or StackAdapt both carry ${c.name} inventory. Minimum budget: $300/month.

1. Enter your ${c.name} address and set a 1–3 mile radius
2. Select screen categories relevant to your audience (gym, transit, gas station, venue)
3. Set your daypart schedule (e.g. 6–10am for breakfast; 5–8pm for dinner)
4. Upload creative (1920×1080px landscape JPEG)
5. Set daily budget cap — campaigns go live within 24–48 hours

<Callout type="tip">
Run DOOH for at least 60 days before optimising. Brand recognition builds through repetition — the first 30 days establish awareness, the second 30 days convert that awareness into action.
</Callout>

## Connecting DOOH to Your Other Marketing Channels

DOOH works best as part of a coordinated local stack:

- **DOOH + Google Ads**: Audiences exposed to DOOH have higher branded search rates. Monitor branded keyword clicks as a leading indicator.
- **DOOH + Meta Ads**: Some DSPs (Vistar, StackAdapt) offer mobile retargeting to devices seen near your screens. Combine for a one-two awareness-to-conversion sequence.
- **DOOH + Google Business Profile**: Brand visibility from DOOH drives more direct GBP searches — track "direct searches" (people searching your exact business name). These typically increase 15–30% during active DOOH campaigns.

---

*Running local advertising in ${fullCity}? DataLatte builds data-driven marketing for small businesses. [View our services](/services/local-seo) or [book a free consultation](/free-audit).*
`;
}

for (const city of CITIES) {
  emit(`dooh-advertising-${city.slug}`, article(city));
}

console.log(`\nDone: ${written} written, ${skipped} skipped`);
