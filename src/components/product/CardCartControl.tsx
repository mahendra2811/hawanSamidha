"use client";

import { ShoppingBag, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Product } from "@data/products.schema";
import { useCart } from "@/store/cart";
import { displayTier } from "@/lib/product-utils";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Full-width add-to-cart that becomes an inline −/qty/+ bar once the product is
 * in the cart. Dropping to 0 removes the line and reverts to the button.
 * Lives outside the card's PDP link, so its clicks never navigate.
 */
export function CardCartControl({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const tier = displayTier(product);
  const qty = useCart(
    (s) => s.lines.find((l) => l.slug === product.slug && l.tierId === tier.id)?.qty ?? 0,
  );
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  function addOne() {
    add({
      slug: product.slug,
      tierId: tier.id,
      name: product.name,
      image: product.heroImage,
      tierLabel: tier.label,
      packaging: tier.packaging,
      price: tier.price,
    });
  }

  if (qty === 0) {
    return (
      <button type="button" onClick={addOne} className={buttonClasses("primary", "md", "w-full")}>
        <ShoppingBag size={16} aria-hidden />
        {t("addToCart")}
      </button>
    );
  }

  return (
    <div
      className="grad-gold flex h-11 w-full items-center justify-between rounded px-1 text-on-gold"
      role="group"
      aria-label={t("quantity")}
    >
      <button
        type="button"
        onClick={() => (qty <= 1 ? remove(product.slug, tier.id) : setQty(product.slug, tier.id, qty - 1))}
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded hover:bg-black/10"
      >
        <Minus size={18} aria-hidden />
      </button>
      <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={addOne}
        aria-label="Increase quantity"
        className="grid h-9 w-9 place-items-center rounded hover:bg-black/10"
      >
        <Plus size={18} aria-hidden />
      </button>
    </div>
  );
}
