import type { Product, PriceTier } from "@data/products.schema";

/** Lowest-priced tier, if any tier carries a price. */
export function lowestPricedTier(p: Product): PriceTier | undefined {
  const priced = p.priceTiers.filter((t) => typeof t.price === "number");
  if (priced.length === 0) return undefined;
  return priced.reduce((lo, t) => (t.price! < lo.price! ? t : lo));
}

/** The tier to show/quick-add by default. */
export function displayTier(p: Product): PriceTier {
  return lowestPricedTier(p) ?? p.priceTiers[0];
}
