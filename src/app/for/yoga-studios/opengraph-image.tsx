export { size, contentType } from "@/lib/og-niche";
import { generateNicheOg } from "@/lib/og-niche";
export default function OgImage() {
  return generateNicheOg("yoga-studios");
}
