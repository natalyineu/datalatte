import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, "../content/blog");

// Curated Unsplash photo IDs by category (landscape orientation, high quality)
const CATEGORY_PHOTOS = {
  "Programmatic Advertising": [
    "1460925895917-afdab827c52f",
    "1551288049-bebda4e38f71",
    "1432888498266-38ffec3eaf0a",
    "1504868584819-f8e8b4b6d7e3",
    "1486312338219-ce68d2c6f44d",
  ],
  "Google Ads": [
    "1573804633927-bfcbcd909acd",
    "1460925895917-afdab827c52f",
    "1563986768494-4dee2763ff3f",
    "1516321318423-f06f85e504b3",
    "1432888498266-38ffec3eaf0a",
  ],
  "Local SEO": [
    "1497366216548-37526070297c",
    "1486312338219-ce68d2c6f44d",
    "1519389950473-47ba0277781c",
    "1552664730-d307ca884978",
    "1562577309-4932fdd64cd1",
  ],
  "Email & SMS Marketing": [
    "1596526131083-e8c633964a7f",
    "1484807352052-23338990c6c6",
    "1557200134-90327ee9fafa",
    "1516321318423-f06f85e504b3",
    "1432888498266-38ffec3eaf0a",
  ],
  "Social Media": [
    "1611162617474-5b21e879e113",
    "1562577309-4932fdd64cd1",
    "1563986768494-4dee2763ff3f",
    "1551288049-bebda4e38f71",
    "1557200134-90327ee9fafa",
  ],
  "Meta Ads": [
    "1611162617474-5b21e879e113",
    "1563986768494-4dee2763ff3f",
    "1552664730-d307ca884978",
    "1516321318423-f06f85e504b3",
    "1484807352052-23338990c6c6",
  ],
  "Marketing Strategy": [
    "1552664730-d307ca884978",
    "1454165804606-c3d57bc86b40",
    "1519389950473-47ba0277781c",
    "1486312338219-ce68d2c6f44d",
    "1504868584819-f8e8b4b6d7e3",
  ],
  "Analytics & Tracking": [
    "1551288049-bebda4e38f71",
    "1460925895917-afdab827c52f",
    "1504868584819-f8e8b4b6d7e3",
    "1573804633927-bfcbcd909acd",
    "1454165804606-c3d57bc86b40",
  ],
  "Website & CRO": [
    "1486312338219-ce68d2c6f44d",
    "1563986768494-4dee2763ff3f",
    "1432888498266-38ffec3eaf0a",
    "1519389950473-47ba0277781c",
    "1516321318423-f06f85e504b3",
  ],
  "AI & Automation": [
    "1677442135703-1787eea5ce01",
    "1555255707-c07966088b7b",
    "1485827404703-89b55fcc595e",
    "1526374965328-7f61d4dc18c5",
    "1460925895917-afdab827c52f",
  ],
  "Content Marketing": [
    "1499750310107-5fef28a66643",
    "1519389950473-47ba0277781c",
    "1454165804606-c3d57bc86b40",
    "1504868584819-f8e8b4b6d7e3",
    "1486312338219-ce68d2c6f44d",
  ],
  "TikTok Ads": [
    "1611162617474-5b21e879e113",
    "1563986768494-4dee2763ff3f",
    "1557200134-90327ee9fafa",
    "1562577309-4932fdd64cd1",
    "1484807352052-23338990c6c6",
  ],
  "Instagram Marketing": [
    "1611162617474-5b21e879e113",
    "1557200134-90327ee9fafa",
    "1562577309-4932fdd64cd1",
    "1563986768494-4dee2763ff3f",
    "1519389950473-47ba0277781c",
  ],
  "Google Business Profile": [
    "1497366216548-37526070297c",
    "1573804633927-bfcbcd909acd",
    "1562577309-4932fdd64cd1",
    "1519389950473-47ba0277781c",
    "1486312338219-ce68d2c6f44d",
  ],
  "Facebook Ads": [
    "1563986768494-4dee2763ff3f",
    "1516321318423-f06f85e504b3",
    "1611162617474-5b21e879e113",
    "1484807352052-23338990c6c6",
    "1551288049-bebda4e38f71",
  ],
  default: [
    "1460925895917-afdab827c52f",
    "1432888498266-38ffec3eaf0a",
    "1519389950473-47ba0277781c",
    "1551288049-bebda4e38f71",
    "1454165804606-c3d57bc86b40",
  ],
};

function getUnsplashUrl(photoId) {
  return `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`;
}

function getPhotoForCategory(category, slugHash) {
  const pool = CATEGORY_PHOTOS[category] || CATEGORY_PHOTOS.default;
  return pool[slugHash % pool.length];
}

function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffff;
  }
  return h;
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
let updated = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("picsum.photos")) continue;

  // Extract category from frontmatter
  const categoryMatch = content.match(/^category:\s*["']?(.+?)["']?\s*$/m);
  const category = categoryMatch ? categoryMatch[1].trim() : "default";

  const slug = file.replace(".mdx", "");
  const photoId = getPhotoForCategory(category, simpleHash(slug));
  const newUrl = getUnsplashUrl(photoId);

  const newContent = content.replace(
    /^image:\s*["']https:\/\/(?:fastly\.)?picsum\.photos[^"'\n]*["']?\s*$/m,
    `image: "${newUrl}"`
  );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    updated++;
  }
}

console.log(`Updated ${updated} files.`);
