"use client";

import { useEffect, useState } from "react";

function readTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

/**
 * Live-tracks the site's light/dark theme (set as `data-theme` on <html> by
 * ThemeToggle / the no-flash inline script in the layout). Any component that
 * needs to render differently per theme — not just via CSS tokens — can use
 * this instead of re-implementing DOM observation.
 */
export function useTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
