import { CITIES } from "./locationData";

const US_CITIES = CITIES.filter((c) => !c.country || c.country === "US");

export function getCityGuideLinks(niche: string): { label: string; href: string }[] {
  return US_CITIES.map(({ city, stateCode, slug }) => ({
    label: `${city}, ${stateCode}`,
    href: `/blog/google-ads-for-${niche}-in-${slug}`,
  }));
}

export interface CityServiceGroup {
  service: string;
  links: { label: string; href: string }[];
}

export function getCityServiceGroups(niche: string): CityServiceGroup[] {
  return [
    {
      service: "Google Ads",
      links: US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: `/blog/google-ads-for-${niche}-in-${slug}`,
      })),
    },
    {
      service: "Meta Ads",
      links: US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: `/blog/meta-ads-for-${niche}-in-${slug}`,
      })),
    },
    {
      service: "Local SEO",
      links: US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: `/blog/local-seo-for-${niche}-in-${slug}`,
      })),
    },
  ];
}
