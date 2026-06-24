"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/store/cart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EnquiryForm } from "./EnquiryForm";
import { buttonClasses } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export function CheckoutClient() {
  const tc = useTranslations("Checkout");
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hasHydrated);

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface py-20 text-center">
        <ShoppingBag size={40} className="text-text-muted" aria-hidden />
        <p className="font-medium text-text">{tc("emptyCart")}</p>
        <p className="text-sm text-text-muted">{tc("emptyCartHint")}</p>
        <Link href="/products" className={buttonClasses("primary", "md")}>
          {tc("browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section aria-label={tc("summaryTitle")}>
        <h2 className="mb-4 font-display text-xl font-semibold text-text">{tc("summaryTitle")}</h2>
        <div className="rounded-2xl border border-border bg-surface px-5">
          <div className="divide-y divide-border">
            {lines.map((line) => (
              <CartItem key={`${line.slug}__${line.tierId}`} line={line} />
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-surface p-5">
          <CartSummary />
        </div>
      </section>

      <section aria-label={tc("title")}>
        <EnquiryForm />
      </section>
    </div>
  );
}
