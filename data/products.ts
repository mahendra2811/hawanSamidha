import productsJson from "./products.json";
import {
  productsSchema,
  type Product,
  type Category,
  CATEGORIES,
} from "./products.schema";

/**
 * Validated product registry. Parsing happens once at module load; an invalid
 * products.json throws a clear Zod error and fails the build (MEGA_PROMPT §19).
 */
export const products: Product[] = productsSchema.parse(productsJson);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((p) => p.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

/** Categories that actually have at least one product, in canonical order. */
export function getAllCategories(): Category[] {
  const present = new Set(products.map((p) => p.category));
  return CATEGORIES.filter((c) => present.has(c));
}

/** Lowest-priced tier of a product (for "From ₹X" display), if any tier has a price. */
export function getLowestPricedTier(product: Product) {
  const priced = product.priceTiers.filter((t) => typeof t.price === "number");
  if (priced.length === 0) return undefined;
  return priced.reduce((lo, t) => (t.price! < lo.price! ? t : lo));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}
