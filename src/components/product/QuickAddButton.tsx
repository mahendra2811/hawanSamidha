"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@data/products.schema";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { displayTier } from "@/lib/product-utils";
import { buttonClasses } from "@/components/ui/Button";

export function QuickAddButton({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);
  const [added, setAdded] = useState(false);

  function onAdd() {
    const tier = displayTier(product);
    add({
      slug: product.slug,
      tierId: tier.id,
      name: product.name,
      image: product.heroImage,
      tierLabel: tier.label,
      packaging: tier.packaging,
      price: tier.price,
    });
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`${t("addToCart")} — ${locale === "hi" ? product.name.hi : product.name.en}`}
      className={buttonClasses("secondary", "sm", "shrink-0")}
    >
      {added ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
      {added ? t("added") : t("addToCart")}
    </button>
  );
}
