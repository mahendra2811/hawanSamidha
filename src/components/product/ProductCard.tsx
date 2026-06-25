import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Product } from "@data/products.schema";
import { pick } from "@/lib/i18n";
import { categoryLabel } from "@/lib/categories";
import { displayTier } from "@/lib/product-utils";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { CardCartControl } from "./CardCartControl";

export function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const name = pick(product.name, locale);
  const tier = displayTier(product);
  const hasPrice = typeof tier.price === "number";
  const estLabel = hasPrice
    ? locale === "hi"
      ? `अनुमानित ${formatINR(tier.price!)} से`
      : `Est. from ${formatINR(tier.price!)}`
    : null;

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-gold/30">
      {/* Image + details link to the PDP. The cart control below is outside this
          link, so tapping it never navigates. */}
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        {/* Fixed image box per breakpoint (mobile / tablet / desktop). object-cover
            zooms the image to fill the box so every product image is the same size. */}
        <div className="relative h-40 overflow-hidden bg-elevated sm:h-48 lg:h-56">
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
        </div>

        {/* Reserved heights keep every card identical regardless of name length
            or whether a price is shown. */}
        <div className="flex flex-col gap-0.5 p-3 sm:p-4">
          <p className="h-3.5 truncate text-[10px] uppercase tracking-wide text-text-muted sm:text-xs">
            {categoryLabel(product.category, locale)}
          </p>
          <h3 className="line-clamp-2 h-9 text-sm font-medium leading-snug text-text transition-colors group-hover:text-gold">
            {name}
          </h3>
          <p className="h-4 text-xs">
            {estLabel && (
              <>
                <span className="font-semibold text-gold">{estLabel}</span>
                <span className="ml-1 text-[10px] text-text-muted">· {pick(tier.label, locale)}</span>
              </>
            )}
          </p>
        </div>
      </Link>

      <div className="p-3 pt-0 sm:p-4 sm:pt-0">
        <CardCartControl product={product} />
      </div>
    </article>
  );
}
