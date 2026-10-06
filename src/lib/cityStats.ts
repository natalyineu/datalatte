import type { NicheSlug } from "@/lib/locationData";

/**
 * Real local-market data per niche × city, taken from our own Google Maps scrape
 * (Supabase `leads` table). Only cities listed here get an indexable page with a
 * "by the numbers" section; every other city page stays noindex until data exists.
 * To add a city: collect leads with scripts/collect-leads.mjs, re-run the SQL below,
 * and add an entry.
 *
 *   select niche, city, count(*), round(avg(rating),2), percentile_cont(0.5) within group
 *   (order by reviews_count), count(*) filter (where reviews_count<50),
 *   count(*) filter (where reviews_count>=200) from leads group by niche, city;
 */
export interface CityStats {
  businesses: number;      // businesses analysed (listed on Google Maps with a website)
  avgRating: number;
  medianReviews: number;
  under50: number;         // businesses with fewer than 50 reviews
  over200: number;         // businesses with 200+ reviews
  asOf: string;
}

export const CITY_STATS: Partial<Record<`${NicheSlug}:${string}`, CityStats>> = {
  "coffee-shops:denver-co":    { businesses: 177, avgRating: 4.45, medianReviews: 340, under50: 2,  over200: 15, asOf: "Oct 2026" },
  "hair-salons:denver-co":     { businesses: 84,  avgRating: 4.87, medianReviews: 203, under50: 2,  over200: 46, asOf: "Oct 2026" },
  "pet-groomers:denver-co":    { businesses: 24,  avgRating: 4.69, medianReviews: 174, under50: 4,  over200: 8,  asOf: "Oct 2026" },
  "fitness-studios:denver-co": { businesses: 113, avgRating: 4.87, medianReviews: 72,  under50: 44, over200: 11, asOf: "Oct 2026" },
};

export function getCityStats(niche: NicheSlug, citySlug: string): CityStats | undefined {
  return CITY_STATS[`${niche}:${citySlug}`];
}
