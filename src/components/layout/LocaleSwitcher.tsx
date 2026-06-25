"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn("inline-flex rounded border border-border bg-surface p-0.5", className)}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            locale === l ? "grad-gold text-on-gold" : "text-text-secondary hover:text-text",
          )}
        >
          {t(l)}
        </button>
      ))}
    </div>
  );
}
