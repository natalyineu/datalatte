import fs from "fs";
import path from "path";
import { CITIES } from "./locationData";

/** Only link to posts that exist and are indexable (noindex posts are not worth linking to from landing pages). */
let live: Set<string> | null = null;
function isLive(slug: string): boolean {
  if (!live) {
    live = new Set();
    const dir = path.join(process.cwd(), "content/blog");
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".mdx")) continue;
      const head = fs.readFileSync(path.join(dir, f), "utf8").slice(0, 1500);
      if (!/^noindex:\s*true/m.test(head)) live.add(f.replace(/\.mdx$/, ""));
    }
  }
  return live.has(slug);
}
const blogHref = (prefix: string, niche: string, slug: string) => `/blog/${prefix}-for-${niche}-in-${slug}`;
const existing = (links: { label: string; href: string }[]) => links.filter((l) => isLive(l.href.replace("/blog/", "")));

const US_CITIES = CITIES.filter((c) => !c.country || c.country === "US");

export function getCityGuideLinks(niche: string): { label: string; href: string }[] {
  return existing(US_CITIES.map(({ city, stateCode, slug }) => ({
    label: `${city}, ${stateCode}`,
    href: blogHref("google-ads", niche, slug),
  })));
}

export interface CityServiceGroup {
  service: string;
  links: { label: string; href: string }[];
}

export function getCityServiceGroups(niche: string): CityServiceGroup[] {
  return [
    {
      service: "Google Ads",
      links: existing(US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: blogHref("google-ads", niche, slug),
      }))),
    },
    {
      service: "Meta Ads",
      links: existing(US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: blogHref("meta-ads", niche, slug),
      }))),
    },
    {
      service: "Local SEO",
      links: existing(US_CITIES.map(({ city, stateCode, slug }) => ({
        label: `${city}, ${stateCode}`,
        href: blogHref("local-seo", niche, slug),
      }))),
    },
  ];
}
