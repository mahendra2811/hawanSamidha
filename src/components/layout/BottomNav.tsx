"use client";

import { useState } from "react";
import { Home, LayoutGrid, ShoppingCart, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useCart, selectTotalQty } from "@/store/cart";
import { useUi } from "@/store/ui";
import { MoreSheet } from "./MoreSheet";
import { cn } from "@/lib/cn";

/**
 * Fixed mobile bottom navigation: Home · Products · Cart · More.
 * Stays above the cart drawer / More sheet (z-50) so it's always an easy way
 * back — tapping any tab dismisses an open drawer/sheet, and Cart/More toggle.
 */
export function BottomNav() {
  const tn = useTranslations("Nav");
  const tc = useTranslations("Cart");
  const tm = useTranslations("Common");
  const pathname = usePathname();
  const cartOpen = useUi((s) => s.cartOpen);
  const openCart = useUi((s) => s.openCart);
  const closeCart = useUi((s) => s.closeCart);
  const count = useCart(selectTotalQty);
  const hydrated = useCart((s) => s.hasHydrated);
  const [moreOpen, setMoreOpen] = useState(false);

  const overlayOpen = cartOpen || moreOpen;
  const homeActive = pathname === "/" && !overlayOpen;
  const productsActive = pathname.startsWith("/products") && !overlayOpen;

  // Dismiss any open overlay (used when navigating away via a tab).
  function dismiss() {
    closeCart();
    setMoreOpen(false);
  }

  const itemCls = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
      active ? "text-gold" : "text-text-muted hover:text-text",
    );

  return (
    <>
      <nav
        aria-label="Bottom"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-base/95 backdrop-blur md:hidden"
      >
        <ul className="flex items-stretch">
          <li className="flex flex-1">
            <Link
              href="/"
              onClick={dismiss}
              aria-current={homeActive ? "page" : undefined}
              className={itemCls(homeActive)}
            >
              <Home size={22} aria-hidden />
              {tn("home")}
            </Link>
          </li>
          <li className="flex flex-1">
            <Link
              href="/products"
              onClick={dismiss}
              aria-current={productsActive ? "page" : undefined}
              className={itemCls(productsActive)}
            >
              <LayoutGrid size={22} aria-hidden />
              {tn("products")}
            </Link>
          </li>
          <li className="flex flex-1">
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                if (cartOpen) closeCart();
                else openCart();
              }}
              className={itemCls(cartOpen)}
              aria-label={tc("open")}
              aria-pressed={cartOpen}
            >
              <span className="relative">
                <ShoppingCart size={22} aria-hidden />
                {hydrated && count > 0 && (
                  <span className="grad-gold absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-on-gold">
                    {count}
                  </span>
                )}
              </span>
              {tc("label")}
            </button>
          </li>
          <li className="flex flex-1">
            <button
              type="button"
              onClick={() => {
                closeCart();
                setMoreOpen((v) => !v);
              }}
              className={itemCls(moreOpen)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
            >
              <Menu size={22} aria-hidden />
              {tm("more")}
            </button>
          </li>
        </ul>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
