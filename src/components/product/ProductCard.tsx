import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@data/products.schema";
import { pick } from "@/lib/i18n";
import { categoryLabel } from "@/lib/categories";
import { Badge } from "@/components/ui/Badge";
import { QuickAddButton } from "./QuickAddButton";

export function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const name = pick(product.name, locale);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-gold/30">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.heroImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges.map((b, i) => (
              <Badge key={i}>{pick(b, locale)}</Badge>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-text-muted">
          {categoryLabel(product.category, locale)}
        </p>
        <h3 className="line-clamp-2 font-medium leading-snug text-text">
          <Link href={`/products/${product.slug}`} className="transition-colors hover:text-gold">
            {name}
          </Link>
        </h3>
        <p className="mt-auto pt-2 text-sm text-gold">
          {locale === "hi" ? "मूल्य पूछताछ पर" : "Price on enquiry"}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 rounded border border-border px-3 py-2 text-center text-sm text-text-secondary transition-colors hover:border-gold/40 hover:text-text"
          >
            {locale === "hi" ? "देखें" : "View"}
          </Link>
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
