/**
 * Transform the scraped IndiaMART catalogue into a schema-valid products.json.
 *
 *   extracted/gangaagro_catalog.json  ->  data/products.json
 *                                     +   public/products/<slug>/*.{jpg,jpeg,png}
 *
 * Run: `npm run build:products` (also runs automatically before `npm run build`).
 *
 * Re-running is idempotent. Adding/updating products = re-scrape + re-run this.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productsSchema, type Category, type Unit } from "../data/products.schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXTRACTED = path.resolve(ROOT, "..", "extracted");
const CATALOG = path.join(EXTRACTED, "gangaagro_catalog.json");
const OUT_JSON = path.join(ROOT, "data", "products.json");
const PUBLIC_PRODUCTS = path.join(ROOT, "public", "products");

// ── Source types (loose; we validate the OUTPUT) ────────────────────────────
interface SrcProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
  specifications?: Record<string, string>;
  imagesLocal?: string[];
}

// ── Category mapping: scraped label -> schema enum ───────────────────────────
const CATEGORY_MAP: Record<string, Category> = {
  "Biomass Briquettes": "briquettes",
  "Camphor Tablet": "camphor-tablet",
  "Cotton Wicks": "cotton-wicks",
  "Epoxy Resin And Hardener": "epoxy-resin",
  "Havan Samidha": "havan-samidha",
  "Hawan Samagri": "hawan-samagri",
  "Incense & Dhoop Stick": "incense-dhoop",
  "Incense Sticks": "incense-sticks",
  "New Items": "new-items",
  "Pooja Moli": "pooja-moli",
  "Puja Items": "pooja-items",
  "Sandalwood Powder": "sandalwood",
};

// Short SKU prefix per category -> codes like "BRQ-01". Deterministic (depends
// only on catalogue order), so re-running keeps each product's code stable.
const CODE_PREFIX: Record<Category, string> = {
  "hawan-samagri": "HSM",
  "havan-samidha": "SMD",
  "pooja-items": "PUJ",
  "pooja-moli": "MOL",
  "incense-dhoop": "DHP",
  "incense-sticks": "INC",
  "camphor-tablet": "CAM",
  "cotton-wicks": "WCK",
  sandalwood: "SND",
  briquettes: "BRQ",
  "epoxy-resin": "EPX",
  "new-items": "NEW",
};

// HSN codes where confidently applicable (MEGA_PROMPT §1: 4401, 4403, 9403).
const HSN_BY_CATEGORY: Partial<Record<Category, string>> = {
  briquettes: "4401",
  sandalwood: "4401",
  "havan-samidha": "4403",
  "new-items": "9403",
};

// Categories that get a curated "featured" flag on their first product.
const FEATURED_CATEGORIES: Category[] = [
  "hawan-samagri",
  "havan-samidha",
  "incense-sticks",
  "sandalwood",
  "camphor-tablet",
  "pooja-moli",
  "pooja-items",
  "briquettes",
];

// ── Hindi dictionary (phrase -> Devanagari), applied longest-phrase-first ────
const HI: Array<[string, string]> = [
  // multi-word phrases first
  ["biomass briquettes", "बायोमास ब्रिकेट्स"],
  ["biomass briquette", "बायोमास ब्रिकेट"],
  ["white coal", "सफेद कोयला"],
  ["mustard stalk", "सरसों डंठल"],
  ["pure handicraft hardwood sawdust", "शुद्ध हस्तशिल्प हार्डवुड बुरादा"],
  ["hardwood sawdust", "हार्डवुड बुरादा"],
  ["saw dust", "लकड़ी का बुरादा"],
  ["sawdust", "लकड़ी का बुरादा"],
  ["hawan samidha", "हवन समिधा"],
  ["havan samidha", "हवन समिधा"],
  ["hawan samagri", "हवन सामग्री"],
  ["havan samagri", "हवन सामग्री"],
  ["hawan dhoop batti", "हवन धूप बाती"],
  ["mango wood planks", "आम की लकड़ी प्लैंक"],
  ["mango wood", "आम की लकड़ी"],
  ["aam ki lakdi", "आम की लकड़ी"],
  ["anjani putra", "अंजनी पुत्र"],
  ["mul shanti", "मूल शांति"],
  ["epoxy resin and hardener", "एपॉक्सी रेज़िन और हार्डनर"],
  ["epoxy resin", "एपॉक्सी रेज़िन"],
  ["epoxy hardeners", "एपॉक्सी हार्डनर"],
  ["wood fillers", "वुड फिलर"],
  ["crystal clear", "क्रिस्टल क्लियर"],
  ["mistri bond", "मिस्त्री बॉन्ड"],
  ["cotton jyoti batti", "सूती ज्योति बाती"],
  ["cotton wicks", "सूती बातियाँ"],
  ["cotton batti", "सूती बाती"],
  ["jyoti batti", "ज्योति बाती"],
  ["pooja kapda", "पूजा कपड़ा"],
  ["puja kapda", "पूजा कपड़ा"],
  ["janeu thread", "जनेऊ धागा"],
  ["pooja moli thread", "पूजा मोली धागा"],
  ["pooja moli", "पूजा मोली"],
  ["pooja kalawa", "पूजा कलावा"],
  ["coya kalawa", "कोया कलावा"],
  ["mothana moli", "मोथना मोली"],
  ["moli gola", "मोली गोला"],
  ["moli kalawa", "मोली कलावा"],
  ["blue label moli", "ब्लू लेबल मोली"],
  ["sapt mrittika", "सप्त मृत्तिका"],
  ["puja accessories", "पूजा सामग्री"],
  ["puja items", "पूजा सामग्री"],
  ["pooja gangajal", "पूजा गंगाजल"],
  ["pooja thali", "पूजा थाली"],
  ["pooja box", "पूजा बॉक्स"],
  ["pooja janeu", "पूजा जनेऊ"],
  ["kumkum powder", "कुमकुम पाउडर"],
  ["hanuman sindoor", "हनुमान सिंदूर"],
  ["gangajal bottle", "गंगाजल बोतल"],
  ["natural gangajal", "प्राकृतिक गंगाजल"],
  ["jasmine oil", "चमेली का तेल"],
  ["ashtagandha powder", "अष्टगंध पाउडर"],
  ["astagandha powder", "अष्टगंध पाउडर"],
  ["incense dhoop & sticks", "अगरबत्ती धूप व स्टिक"],
  ["incense dhoop", "अगरबत्ती धूप"],
  ["aromatic incense sticks", "सुगंधित अगरबत्ती"],
  ["premium incense sticks", "प्रीमियम अगरबत्ती"],
  ["premium incense stick", "प्रीमियम अगरबत्ती"],
  ["natural incense stick", "प्राकृतिक अगरबत्ती"],
  ["masala agarbatti", "मसाला अगरबत्ती"],
  ["incense sticks fragrances", "अगरबत्ती सुगंध"],
  ["incense sticks", "अगरबत्ती"],
  ["incense stick", "अगरबत्ती"],
  ["agarbatti box", "अगरबत्ती बॉक्स"],
  ["dhoop sticks", "धूप स्टिक"],
  ["dhoop stick", "धूप स्टिक"],
  ["dhoop batti", "धूप बाती"],
  ["gopi chandan", "गोपी चंदन"],
  ["red chandan powder", "लाल चंदन पाउडर"],
  ["white chandan powder", "सफेद चंदन पाउडर"],
  ["chandan powder", "चंदन पाउडर"],
  ["chandan tikka", "चंदन टिक्का"],
  ["red sandal wood", "लाल चंदन"],
  ["sandalwood incense sticks", "चंदन अगरबत्ती"],
  ["sandalwood powder", "चंदन पाउडर"],
  ["sandal wood", "चंदन"],
  ["kesar chandan", "केसर चंदन"],
  ["rita powder", "रीठा पाउडर"],
  ["reetha powder", "रीठा पाउडर"],
  ["camphor tablet", "कपूर गोली"],
  ["bhimseni camphor", "भीमसेनी कपूर"],
  ["smokeless camphor", "धुआँ रहित कपूर"],
  ["wooden khadau padukas", "लकड़ी की खड़ाऊ पादुका"],
  ["khadau padukas", "खड़ाऊ पादुका"],
  ["wooden agarbatti box", "लकड़ी का अगरबत्ती बॉक्स"],
  ["wooden book stand", "लकड़ी का बुक स्टैंड"],
  ["book stand", "बुक स्टैंड"],
  ["navgrah", "नवग्रह"],
  // single words
  ["ammedi", "अम्मेदी"],
  ["brand", "ब्रांड"],
  ["packing", "पैकिंग"],
  ["premium", "प्रीमियम"],
  ["natural", "प्राकृतिक"],
  ["aromatic", "सुगंधित"],
  ["loose", "लूज़"],
  ["pure", "शुद्ध"],
  ["large", "बड़ी"],
  ["loban", "लोबान"],
  ["mogra", "मोगरा"],
  ["lavender", "लैवेंडर"],
  ["jasmine", "चमेली"],
  ["gugal", "गुग्गल"],
  ["guggal", "गुग्गल"],
  ["chandan", "चंदन"],
  ["camphor", "कपूर"],
  ["biocoal", "जैविक कोयला"],
  ["sindoor", "सिंदूर"],
  ["kumkum", "कुमकुम"],
  ["gangajal", "गंगाजल"],
  ["gomutra", "गोमूत्र"],
  ["bhasmi", "भस्मी"],
  ["roli", "रोली"],
  ["kalawa", "कलावा"],
  ["moli", "मोली"],
  ["janeu", "जनेऊ"],
  ["thali", "थाली"],
  ["paduka", "पादुका"],
  ["khadau", "खड़ाऊ"],
  ["samidha", "समिधा"],
  ["samagri", "सामग्री"],
  ["agarbatti", "अगरबत्ती"],
  ["incense", "अगरबत्ती"],
  ["dhoop", "धूप"],
  ["batti", "बाती"],
  ["wick", "बाती"],
  ["wicks", "बातियाँ"],
  ["briquette", "ब्रिकेट"],
  ["briquettes", "ब्रिकेट्स"],
  ["powder", "पाउडर"],
  ["tablet", "गोली"],
  ["bottle", "बोतल"],
  ["thread", "धागा"],
  ["planks", "प्लैंक"],
  ["box", "बॉक्स"],
  ["oil", "तेल"],
  ["kesar", "केसर"],
  ["tikka", "टिक्का"],
  ["accessories", "सामग्री"],
  ["wooden", "लकड़ी का"],
  ["wood", "लकड़ी"],
  ["cotton", "सूती"],
  ["pooja", "पूजा"],
  ["puja", "पूजा"],
  ["hawan", "हवन"],
  ["havan", "हवन"],
  ["coal", "कोयला"],
  // colors / materials / common spec values
  ["white", "सफेद"],
  ["red", "लाल"],
  ["brown", "भूरा"],
  ["orange", "नारंगी"],
  ["yellow", "पीला"],
  ["blue", "नीला"],
  ["green", "हरा"],
  ["black", "काला"],
  ["boiler", "बॉयलर"],
  ["temple", "मंदिर"],
  ["made in india", "भारत में निर्मित"],
  ["in stock", "स्टॉक में"],
  ["round", "गोल"],
  ["jumbo roll", "जंबो रोल"],
  // measurement / packaging vocabulary
  ["single piece", "एक नग"],
  ["per piece", "प्रति नग"],
  ["mm", "मिमी"],
  ["kg", "किग्रा"],
  ["gm", "ग्राम"],
  ["gram", "ग्राम"],
  ["litre", "लीटर"],
  ["liter", "लीटर"],
  ["ml", "मिली"],
  ["roll", "रोल"],
  ["reel", "रील"],
  ["bag", "बैग"],
  ["carton", "कार्टन"],
  ["piece", "नग"],
  ["set", "सेट"],
  ["silk", "रेशम"],
  ["and", "और"],
];

// Sort longest-first so phrases win over their component words.
HI.sort((a, b) => b[0].length - a[0].length);

function toHindi(input: string): string {
  if (!input) return input;
  let out = input;
  for (const [en, hi] of HI) {
    // case-insensitive, respecting word-ish boundaries around alpha runs
    const re = new RegExp(`(^|[^a-zA-Z\\u0900-\\u097F])(${escapeRe(en)})(?=$|[^a-zA-Z])`, "gi");
    out = out.replace(re, (_m, pre) => `${pre}${hi}`);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['"’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleCaseClean(s: string): string {
  return s.replace(/\s{2,}/g, " ").trim();
}

const UNIT_MAP: Record<string, Unit> = {
  tonne: "tonne",
  kg: "kg",
  pack: "pack",
  piece: "piece",
  "cubic feet": "cubic-feet",
  bottle: "bottle",
  carton: "carton",
  dozen: "dozen",
};

const UNIT_LABEL: Record<Unit, { en: string; hi: string }> = {
  tonne: { en: "Per Tonne", hi: "प्रति टन" },
  kg: { en: "Per Kg", hi: "प्रति किग्रा" },
  gram: { en: "Per Gram", hi: "प्रति ग्राम" },
  quintal: { en: "Per Quintal", hi: "प्रति क्विंटल" },
  pack: { en: "Per Pack", hi: "प्रति पैक" },
  carton: { en: "Per Carton", hi: "प्रति कार्टन" },
  piece: { en: "Per Piece", hi: "प्रति नग" },
  bag: { en: "Per Bag", hi: "प्रति बैग" },
  bottle: { en: "Per Bottle", hi: "प्रति बोतल" },
  dozen: { en: "Per Dozen", hi: "प्रति दर्जन" },
  "cubic-feet": { en: "Per Cubic Feet", hi: "प्रति घन फुट" },
};

function parsePrice(price: string): { value?: number; unit: Unit } {
  const value = (() => {
    const m = price.match(/₹\s*([\d,]+)/);
    if (!m) return undefined;
    const n = Number(m[1].replace(/,/g, ""));
    return Number.isFinite(n) ? n : undefined;
  })();
  const um = price.match(/\/\s*([A-Za-z ]+)\s*$/);
  const unitKey = (um ? um[1].trim().toLowerCase() : "pack").replace(/\s+/g, " ");
  const unit = UNIT_MAP[unitKey] ?? "pack";
  return { value, unit };
}

// Spec keys that are catalogue meta, not product attributes.
const SPEC_SKIP = new Set([
  "Availability",
  "Price",
  "Ships from",
  "Shipping",
  "View in Hindi",
]);

const SPEC_KEY_HI: Record<string, string> = {
  Material: "सामग्री",
  Color: "रंग",
  "Usage/Application": "उपयोग",
  "Usage/ Application": "उपयोग",
  "Usage Application": "उपयोग",
  Usage: "उपयोग",
  "Packaging Type": "पैकेजिंग प्रकार",
  "Packaging Size": "पैकेजिंग आकार",
  Form: "रूप",
  Shape: "आकार",
  Size: "आकार",
  Fragrance: "सुगंध",
  "Fragrance Type": "सुगंध प्रकार",
  "Country of Origin": "मूल देश",
  "Pack Size": "पैक आकार",
  Finish: "फिनिश",
  "Shelf Life": "शेल्फ लाइफ",
  Grade: "ग्रेड",
  "Burning Time": "जलने का समय",
  Weight: "वजन",
  "Net Weight": "शुद्ध वजन",
  Brand: "ब्रांड",
  "Wood Type": "लकड़ी का प्रकार",
  Diameter: "व्यास",
  Type: "प्रकार",
  Thickness: "मोटाई",
  Length: "लंबाई",
  "Stick Length": "स्टिक लंबाई",
  "Base Material": "आधार सामग्री",
  Ingredients: "सामग्री",
  "Key Ingredients": "मुख्य सामग्री",
  Deity: "देवता",
  "Ideal For": "उपयुक्त",
  Capacity: "क्षमता",
  Features: "विशेषताएँ",
};

function pickPackaging(specs: Record<string, string>): { en: string; hi: string } {
  const raw =
    specs["Packaging Size"] ||
    specs["Pack Size"] ||
    specs["Weight/Packaging Size"] ||
    specs["Packaging Size/ Weight"] ||
    specs["Packaging Type"] ||
    "";
  if (!raw) return { en: "Standard pack", hi: "मानक पैक" };
  const en = titleCaseClean(raw);
  return { en, hi: toHindi(en) };
}

function buildShortEn(p: SrcProduct): string {
  const desc = p.description ?? "";
  const m =
    desc.match(/Offering\s+(.+?)\s+at\s+₹/i) ||
    desc.match(/Offering\s+(.+?)\s+in\s+[A-Z]/);
  let core = m ? m[1] : "";
  core = titleCaseClean(core.replace(/\s*,\s*Packaging Size:.*$/i, (s) => s));
  if (!core || core.length < 3) {
    return `${p.name} by Ammedi — available for wholesale enquiry.`;
  }
  // Trim overly long cores.
  if (core.length > 150) core = core.slice(0, 147).trim() + "…";
  return core;
}

function buildLongEn(p: SrcProduct, specs: Record<string, string>): string {
  const bits: string[] = [];
  const keys = ["Material", "Wood Type", "Usage/Application", "Usage", "Fragrance", "Form", "Color"];
  for (const k of keys) {
    if (specs[k]) bits.push(`${k.replace("/Application", "")}: ${titleCaseClean(specs[k])}`);
    if (bits.length >= 3) break;
  }
  const pkg = specs["Packaging Size"] || specs["Pack Size"] || specs["Packaging Type"];
  const attrs = bits.length ? ` ${bits.join(". ")}.` : "";
  const pkgLine = pkg ? ` Packaging: ${titleCaseClean(pkg)}.` : "";
  return (
    `${p.name} by Ammedi (Ganga Agro Industries, Jodhpur, Rajasthan).` +
    attrs +
    pkgLine +
    ` Supplied to wholesale buyers in bulk quantities; price confirmed on enquiry.`
  );
}

function parseIngredients(specs: Record<string, string>) {
  const raw = specs["Ingredients"] || specs["Key Ingredients"];
  if (!raw) return [];
  return raw
    .split(/[,/;]+| and /i)
    .map((s) => titleCaseClean(s))
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 12)
    .map((en) => ({ name: { en, hi: toHindi(en) } }));
}

function buildBadges(p: SrcProduct, specs: Record<string, string>) {
  const badges: Array<{ en: string; hi: string }> = [];
  if (/premium/i.test(p.name)) badges.push({ en: "Premium", hi: "प्रीमियम" });
  if ((specs["Country of Origin"] || "").toLowerCase().includes("made in india")) {
    badges.push({ en: "Made in India", hi: "भारत में निर्मित" });
  }
  return badges.slice(0, 2);
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8")) as { products: SrcProduct[] };
  const src = catalog.products ?? [];

  // Reset image output dir.
  fs.rmSync(PUBLIC_PRODUCTS, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC_PRODUCTS, { recursive: true });

  const usedSlugs = new Set<string>();
  const firstSeenCategory = new Set<Category>();
  const codeCounters: Record<string, number> = {};

  const out = src.map((p) => {
    const category = CATEGORY_MAP[p.category];
    if (!category) throw new Error(`Unmapped category "${p.category}" (product ${p.id})`);
    const specs = p.specifications ?? {};

    // Short unique SKU, e.g. "BRQ-01" (sequential within each category).
    const seq = (codeCounters[category] = (codeCounters[category] ?? 0) + 1);
    const code = `${CODE_PREFIX[category]}-${String(seq).padStart(2, "0")}`;

    // slug (dedupe with id suffix)
    let slug = slugify(p.name);
    if (usedSlugs.has(slug)) slug = `${slug}-${p.id}`;
    usedSlugs.add(slug);

    // images -> public/products/<slug>/
    const destDir = path.join(PUBLIC_PRODUCTS, slug);
    fs.mkdirSync(destDir, { recursive: true });
    const imagesLocal = p.imagesLocal ?? [];
    const images: string[] = [];
    let heroImage = "";
    imagesLocal.forEach((rel, i) => {
      const srcPath = path.join(EXTRACTED, rel);
      if (!fs.existsSync(srcPath)) return;
      const ext = path.extname(rel).toLowerCase();
      const fname = `${i + 1}${ext}`;
      fs.copyFileSync(srcPath, path.join(destDir, fname));
      images.push(`/products/${slug}/${fname}`);
      if (i === 0) {
        fs.copyFileSync(srcPath, path.join(destDir, `hero${ext}`));
        heroImage = `/products/${slug}/hero${ext}`;
      }
    });
    if (!heroImage && images.length) heroImage = images[0];
    if (!heroImage) throw new Error(`No usable image for ${slug}`);

    // price tier
    const { value, unit } = parsePrice(p.price);
    const packaging = pickPackaging(specs);
    const tier = {
      id: `per-${unit}`,
      label: UNIT_LABEL[unit],
      packaging,
      unit,
      quantity: 1,
      minOrderQty: 1,
      priceOnEnquiry: true,
      ...(typeof value === "number" ? { price: value } : {}),
      inStock: (specs["Availability"] || "In Stock").toLowerCase().includes("stock"),
    };

    // descriptions
    const shortEn = buildShortEn(p);
    const viewHi = (specs["View in Hindi"] || "").trim();
    const shortHi = viewHi.length > 4 ? titleCaseClean(viewHi) : toHindi(shortEn);
    const longEn = buildLongEn(p, specs);

    // specs (bilingual, filtered)
    const specifications = Object.entries(specs)
      .filter(([k]) => !SPEC_SKIP.has(k))
      .map(([k, v]) => ({
        label: { en: k, hi: SPEC_KEY_HI[k] || k },
        value: { en: titleCaseClean(v), hi: toHindi(titleCaseClean(v)) },
      }));

    // featured: first product encountered in a featured category
    let featured = false;
    if (FEATURED_CATEGORIES.includes(category) && !firstSeenCategory.has(category)) {
      featured = true;
      firstSeenCategory.add(category);
    }

    const nameEn = titleCaseClean(p.name);
    return {
      slug,
      code,
      name: { en: nameEn, hi: toHindi(nameEn) },
      category,
      brand: "Ammedi",
      shortDescription: { en: shortEn, hi: shortHi },
      longDescription: { en: longEn, hi: toHindi(longEn) },
      heroImage,
      images,
      ingredients: parseIngredients(specs),
      specifications,
      priceTiers: [tier],
      ...(HSN_BY_CATEGORY[category] ? { hsnCode: HSN_BY_CATEGORY[category] } : {}),
      featured,
      badges: buildBadges(p, specs),
      seo: {
        title: {
          en: `${nameEn} — Wholesale | Ammedi`,
          hi: `${toHindi(nameEn)} — थोक | अम्मेदी`,
        },
        description: { en: shortEn, hi: shortHi },
      },
    };
  });

  // Validate before writing.
  const parsed = productsSchema.parse(out);
  fs.writeFileSync(OUT_JSON, JSON.stringify(parsed, null, 2) + "\n", "utf8");

  const featuredCount = parsed.filter((p) => p.featured).length;
  const withPrice = parsed.filter((p) => p.priceTiers.some((t) => typeof t.price === "number")).length;
  console.log(
    `✓ Wrote ${parsed.length} products to data/products.json ` +
      `(${featuredCount} featured, ${withPrice} with parsed price). Images -> public/products/<slug>/.`,
  );
}

main();
