"use client";

import { useEffect, useState } from "react";

/** Tracks document visibility so idle FAB animations can pause on a hidden tab. */
export function useTabVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}
