"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart, selectTotalQty } from "@/store/cart";
import { useUi } from "@/store/ui";

export function CartButton() {
  const t = useTranslations("Cart");
  const count = useCart(selectTotalQty);
  const hydrated = useCart((s) => s.hasHydrated);
  const openCart = useUi((s) => s.openCart);
  const show = hydrated && count > 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={t("open")}
      className="relative grid h-10 w-10 place-items-center rounded text-text transition-colors hover:text-gold"
    >
      <ShoppingBag size={22} aria-hidden />
      {show && (
        <span className="grad-gold absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold text-on-gold">
          {count}
        </span>
      )}
    </button>
  );
}
