"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/cn";

export function MobileMenu() {
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={tc("menu")}
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded text-text transition-colors hover:text-gold"
      >
        {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-t border-border bg-base/95 backdrop-blur">
          <nav aria-label="Mobile" className="px-4 py-4">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded px-3 py-3 text-base font-medium transition-colors",
                        active ? "bg-surface text-gold" : "text-text-secondary hover:bg-surface",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-border pt-4">
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
