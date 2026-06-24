/**
 * Generate neutral Agni-Gold placeholder assets (PWA icons + OG image).
 * The owner replaces these with final brand art later. Run: `npx tsx scripts/generate-placeholders.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ICONS = path.join(ROOT, "public", "icons");
const OG = path.join(ROOT, "public", "og");

function flame(cx: number, cy: number, s: number, fill: string) {
  // simple teardrop/diya flame
  return `<path d="M ${cx} ${cy - s} C ${cx + s * 0.7} ${cy - s * 0.2}, ${cx + s * 0.45} ${cy + s * 0.75}, ${cx} ${cy + s * 0.75} C ${cx - s * 0.45} ${cy + s * 0.75}, ${cx - s * 0.7} ${cy - s * 0.2}, ${cx} ${cy - s} Z" fill="${fill}"/>`;
}

function iconSvg(size: number, maskable = false) {
  const r = maskable ? 0 : size * 0.2;
  const cx = size / 2;
  const cy = size / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF8C32"/><stop offset="1" stop-color="#F5C84C"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#F5C84C" stop-opacity="0.5"/><stop offset="1" stop-color="#150F0C" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${r}" fill="#150F0C"/>
    <circle cx="${cx}" cy="${cy}" r="${size * 0.4}" fill="url(#glow)"/>
    <circle cx="${cx}" cy="${cy}" r="${size * 0.3}" fill="none" stroke="url(#g)" stroke-width="${size * 0.03}"/>
    ${flame(cx, cy + size * 0.05, size * 0.22, "url(#g)")}
  </svg>`;
}

function ogSvg() {
  const w = 1200;
  const h = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#150F0C"/><stop offset="0.6" stop-color="#3A1410"/><stop offset="1" stop-color="#7A1F1F"/>
      </linearGradient>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#FF8C32"/><stop offset="1" stop-color="#F5C84C"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="980" cy="315" r="170" fill="none" stroke="url(#g)" stroke-width="14"/>
    ${flame(980, 330, 120, "url(#g)")}
    <text x="90" y="300" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="96" fill="#F7ECDD">Ammedi</text>
    <text x="92" y="365" font-family="Arial, sans-serif" font-size="34" fill="#C9B8A4">Wholesale Havan &amp; Puja Products</text>
    <text x="92" y="410" font-family="Arial, sans-serif" font-size="26" fill="#8A7A68">Ganga Agro Industries · Jodhpur, since 2002</text>
  </svg>`;
}

async function main() {
  fs.mkdirSync(ICONS, { recursive: true });
  fs.mkdirSync(OG, { recursive: true });

  await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(ICONS, "icon-192.png"));
  await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(ICONS, "icon-512.png"));
  await sharp(Buffer.from(iconSvg(512, true))).png().toFile(path.join(ICONS, "maskable-512.png"));
  await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(ICONS, "apple-touch-icon.png"));
  await sharp(Buffer.from(ogSvg())).png().toFile(path.join(OG, "default.png"));

  console.log("✓ Placeholder icons -> public/icons/, OG -> public/og/default.png");
}

main();
