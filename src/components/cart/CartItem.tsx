"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CartLine } from "@/store/cart";
import { useCart } from "@/store/cart";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { pick } from "@/lib/i18n";
import { formatINR } from "@/lib/format";

export function CartItem({ line }: { line: CartLine }) {
  const locale = useLocale();
  const t = useTranslations("Cart");
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  return (
    <div className="flex gap-3 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-border bg-elevated">
        <Image
          src={line.image}
          alt={pick(line.name, locale)}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{pick(line.name, locale)}</p>
        <p className="text-xs text-text-muted">
          {pick(line.tierLabel, locale)} · {pick(line.packaging, locale)}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QtyStepper
            value={line.qty}
            onChange={(q) => setQty(line.slug, line.tierId, q)}
            label={t("item")}
          />
          <button
            type="button"
            onClick={() => remove(line.slug, line.tierId)}
            aria-label={t("remove")}
            className="grid h-9 w-9 place-items-center rounded text-text-muted transition-colors hover:text-danger"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </div>
        <p className="mt-1 text-sm text-gold">
          {typeof line.price === "number"
            ? formatINR(line.price * line.qty)
            : t("priceOnEnquiry")}
        </p>
      </div>
    </div>
  );
}
