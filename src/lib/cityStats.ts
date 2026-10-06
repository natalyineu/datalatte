import type { NicheSlug } from "@/lib/locationData";
import data from "../../data/city-stats.json";

/**
 * Real local-market data per niche x city, from our own Google Maps scrape (Apify).
 * File: data/city-stats.json, filled by scripts/collect-city-stats.mjs (GitHub workflow "Collect city stats").
 * A city page is indexable and listed in the sitemap only when it has data here (and enough businesses to be meaningful).
 */
export interface CityStats {
  businesses: number;      // businesses analysed on Google Maps
  avgRating: number;
  medianReviews: number;
  under50: number;         // businesses with fewer than 50 reviews
  over200: number;         // businesses with 200+ reviews
  asOf: string;
}

const MIN_BUSINESSES = 15;
const CITY_STATS = data as Record<string, CityStats>;

export function getCityStats(niche: NicheSlug, citySlug: string): CityStats | undefined {
  const s = CITY_STATS[`${niche}:${citySlug}`];
  return s && s.businesses >= MIN_BUSINESSES ? s : undefined;
}
