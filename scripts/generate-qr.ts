/**
 * Generate a print-ready QR code per product, encoding the short QR-info URL
 * `${SITE_URL}/p/<slug>`. Outputs SVG + PNG into /public/qr/<slug>.{svg,png}.
 *
 * Run: `npm run generate:qr`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { getAllSlugs } from "../data/products";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "qr");
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://hawanproducts.com").replace(/\/$/, "");

const OPTS = {
  errorCorrectionLevel: "H" as const,
  margin: 4, // generous quiet zone for print
  color: { dark: "#150F0C", light: "#FFFFFF" },
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const slugs = getAllSlugs();
  for (const slug of slugs) {
    const url = `${SITE_URL}/p/${slug}`;
    await QRCode.toFile(path.join(OUT, `${slug}.png`), url, { ...OPTS, width: 512 });
    const svg = await QRCode.toString(url, { ...OPTS, type: "svg" });
    fs.writeFileSync(path.join(OUT, `${slug}.svg`), svg, "utf8");
  }
  console.log(`✓ Generated ${slugs.length} QR codes (svg + png) -> public/qr/ pointing at ${SITE_URL}/p/<slug>`);
}

main();
