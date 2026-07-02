"use client";

import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/use-theme";

/**
 * Light/dark toggle. Default is light (no attribute); dark sets
 * <html data-theme="dark">. Choice persists in localStorage and is applied
 * pre-paint by an inline script in the layout (so there's no flash).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const dark = useTheme() === "dark";

  function toggle() {
    const next = !dark;
    const root = document.documentElement;
    if (next) {
      root.setAttribute("data-theme", "dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      root.removeAttribute("data-theme");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={t("toggleTheme")}
      className={`grid h-10 w-10 place-items-center rounded text-text transition-colors hover:text-gold ${className ?? ""}`}
    >
      {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
    </button>
  );
}
