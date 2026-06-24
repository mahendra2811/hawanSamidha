"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Product, Category } from "@data/products.schema";
import { CATEGORY_LABELS } from "@/lib/categories";
import { ProductGrid } from "./ProductGrid";
import { cn } from "@/lib/cn";

export function ProductsExplorer({ products, locale }: { products: Product[]; locale: string }) {
  const t = useTranslations("Products");
  const [active, setActive] = useState<Category | "all">("all");

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  const chip = (selected: boolean) =>
    cn(
      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
      selected ? "grad-gold text-base" : "border border-border bg-surface text-text-secondary hover:text-text",
    );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("title")}>
        <button type="button" onClick={() => setActive("all")} className={chip(active === "all")}>
          {t("all")}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            aria-pressed={active === c}
            className={chip(active === c)}
          >
            {locale === "hi" ? CATEGORY_LABELS[c].hi : CATEGORY_LABELS[c].en}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-text-muted" aria-live="polite">
        {t("resultsCount", { count: filtered.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-text-muted">{t("empty")}</p>
      ) : (
        <ProductGrid products={filtered} locale={locale} />
      )}
    </div>
  );
}
