"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Hydrate the 3D scene only on the client, after first paint.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Mounts the particle canvas only when it won't hurt the experience:
 *  - never when prefers-reduced-motion is set
 *  - never on small screens (mobile LCP comes first; the CSS gradient remains)
 * Until then the parent's static gradient fallback is what the user sees.
 */
export function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Defer to the next frame so the canvas never competes with first paint.
    const id = requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wideEnough = window.innerWidth >= 768;
      if (!reduce && wideEnough) setEnabled(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <HeroScene />
    </div>
  );
}
