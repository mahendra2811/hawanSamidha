"use client";

import { useTranslations } from "next-intl";
import { useCart, selectTotalQty, selectSubtotal } from "@/store/cart";
import { formatINR } from "@/lib/format";

export function CartSummary() {
  const t = useTranslations("Cart");
  const totalQty = useCart(selectTotalQty);
  const subtotal = useCart(selectSubtotal);

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-text-secondary">{t("totalQty")}</dt>
        <dd className="font-medium text-text">{totalQty}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-text-secondary">{t("subtotal")}</dt>
        <dd className="font-semibold text-gold">
          {subtotal === null ? t("priceOnEnquiry") : formatINR(subtotal)}
        </dd>
      </div>
    </dl>
  );
}
