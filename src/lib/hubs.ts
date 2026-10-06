import fs from "fs";
import path from "path";
import matter from "gray-matter";
import hubsData from "../../data/hubs.json";

export interface Hub { slug: string; title: string; niche: string | null; count: number; posts: string[] }
export interface HubCopy { seoTitle?: string; description?: string; intro?: string[]; faq?: { q: string; a: string }[]; startHere?: string[] }

export const HUBS = hubsData as Hub[];
const contentDir = path.join(process.cwd(), "content/blog");
const copyDir = path.join(process.cwd(), "data/hub-copy");

export function getHub(slug: string): Hub | undefined { return HUBS.find((h) => h.slug === slug); }

export function getHubCopy(slug: string): HubCopy {
  try { return JSON.parse(fs.readFileSync(path.join(copyDir, `${slug}.json`), "utf8")); } catch { return {}; }
}

/** slug -> hub for every post (first hub that lists it). Used for the "Part of the guide" link on articles. */
let postHub: Map<string, Hub> | null = null;
export function hubForPost(slug: string): Hub | undefined {
  if (!postHub) { postHub = new Map(); for (const h of HUBS) for (const p of h.posts) if (!postHub.has(p)) postHub.set(p, h); }
  return postHub.get(slug);
}

export function postTitle(slug: string): string {
  try { return String(matter(fs.readFileSync(path.join(contentDir, `${slug}.mdx`), "utf8")).data.title ?? slug); } catch { return slug; }
}
