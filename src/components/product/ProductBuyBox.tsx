"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@data/products.schema";
import { pick } from "@/lib/i18n";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { Button } from "@/components/ui/Button";
import { EnquiryActions } from "@/components/cart/EnquiryActions";
import { PriceTierSelector } from "./PriceTierSelector";
import { buildProductEnquiry } from "@/lib/enquiry";

export function ProductBuyBox({ product }: { product: Product }) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const add = useCart((s) => s.add);
  const openCart = useUi((s) => s.openCart);

  const [tierId, setTierId] = useState(product.priceTiers[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const tier = product.priceTiers.find((x) => x.id === tierId) ?? product.priceTiers[0];

  function onAdd() {
    add({
      slug: product.slug,
      tierId: tier.id,
      name: product.name,
      image: product.heroImage,
      tierLabel: tier.label,
      packaging: tier.packaging,
      price: tier.price,
      qty,
    });
    setAdded(true);
    openCart();
    window.setTimeout(() => setAdded(false), 1500);
  }

  const message = buildProductEnquiry(
    pick(product.name, locale),
    pick(tier.label, locale),
    qty,
    locale,
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
          {t("selectTier")}
        </h2>
        <PriceTierSelector
          tiers={product.priceTiers}
          value={tierId}
          onChange={setTierId}
          locale={locale}
          label={t("selectTier")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div>
          <span className="mb-2 block text-sm font-semibold uppercase tracking-wide text-text-muted">
            {t("quantity")}
          </span>
          <QtyStepper value={qty} onChange={setQty} label={t("quantity")} />
        </div>
        <p className="text-sm text-gold">{t("priceOnEnquiry")}</p>
      </div>

      <Button onClick={onAdd} size="lg" className="w-full sm:w-auto">
        {added ? <Check size={18} aria-hidden /> : <ShoppingBag size={18} aria-hidden />}
        {added ? t("added") : t("addToCart")}
      </Button>

      <div className="border-t border-border pt-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
          {t("enquireTitle")}
        </h2>
        <EnquiryActions message={message} />
      </div>
    </div>
  );
}
