"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { buttonClasses } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartDrawer() {
  const t = useTranslations("Cart");
  const open = useUi((s) => s.cartOpen);
  const close = useUi((s) => s.closeCart);
  const lines = useCart((s) => s.lines);

  const isEmpty = lines.length === 0;

  return (
    <Drawer
      open={open}
      onClose={close}
      title={t("title")}
      footer={
        isEmpty ? undefined : (
          <div className="space-y-3">
            <CartSummary />
            <Link
              href="/checkout"
              onClick={close}
              className={buttonClasses("primary", "lg", "w-full")}
            >
              {t("proceed")}
            </Link>
            <button
              type="button"
              onClick={close}
              className={buttonClasses("ghost", "md", "w-full")}
            >
              {t("continue")}
            </button>
          </div>
        )
      }
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag size={40} className="text-text-muted" aria-hidden />
          <p className="font-medium text-text">{t("empty")}</p>
          <p className="text-sm text-text-muted">{t("emptyHint")}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {lines.map((line) => (
            <CartItem key={`${line.slug}__${line.tierId}`} line={line} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
