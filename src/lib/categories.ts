import type { Category } from "@data/products.schema";

/** Bilingual display labels for each category. */
export const CATEGORY_LABELS: Record<Category, { en: string; hi: string }> = {
  "hawan-samagri": { en: "Hawan Samagri", hi: "हवन सामग्री" },
  "havan-samidha": { en: "Havan Samidha", hi: "हवन समिधा" },
  "pooja-items": { en: "Puja Items", hi: "पूजा सामग्री" },
  "pooja-moli": { en: "Pooja Moli & Threads", hi: "पूजा मोली व धागे" },
  "incense-dhoop": { en: "Incense & Dhoop", hi: "अगरबत्ती व धूप" },
  "incense-sticks": { en: "Incense Sticks", hi: "अगरबत्ती" },
  "camphor-tablet": { en: "Camphor", hi: "कपूर" },
  "cotton-wicks": { en: "Cotton Wicks", hi: "सूती बातियाँ" },
  sandalwood: { en: "Sandalwood Powder", hi: "चंदन पाउडर" },
  briquettes: { en: "Biomass Briquettes", hi: "बायोमास ब्रिकेट्स" },
  "epoxy-resin": { en: "Epoxy Resin", hi: "एपॉक्सी रेज़िन" },
  "new-items": { en: "New Items", hi: "नए उत्पाद" },
};

export function categoryLabel(category: Category, locale: string): string {
  const l = CATEGORY_LABELS[category];
  return locale === "hi" ? l.hi : l.en;
}
