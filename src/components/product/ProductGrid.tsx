import type { Product } from "@data/products.schema";
import { ProductCard } from "./ProductCard";

/**
 * Equal fractional columns per breakpoint (proper ratio division of the row):
 * 2 (mobile) / 3 (tablet) / 4 (desktop). Each card fills its column and has a
 * fixed image height + reserved text heights, so all cards are the same size.
 */
export function ProductGrid({ products, locale }: { products: Product[]; locale: string }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.slug} className="flex">
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
