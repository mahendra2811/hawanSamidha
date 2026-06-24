import type { Product } from "@data/products.schema";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, locale }: { products: Product[]; locale: string }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <li key={product.slug} className="flex">
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
