export { size, contentType } from "@/lib/og-service";
import { generateServiceOg } from "@/lib/og-service";
export default function OgImage() {
  return generateServiceOg("google-ads");
}
