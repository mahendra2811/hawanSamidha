"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type L = { en: string; hi: string };

/**
 * A cart line is identified by product slug + tier id. We store a lightweight
 * snapshot (name/image/tier) so the cart drawer renders without pulling the full
 * product dataset into the client bundle. Price is optional (Phase 0 = enquiry).
 */
export type CartLine = {
  slug: string;
  tierId: string;
  qty: number;
  name: L;
  image: string;
  tierLabel: L;
  packaging: L;
  price?: number;
};

export function lineKey(slug: string, tierId: string): string {
  return `${slug}__${tierId}`;
}

type CartState = {
  lines: CartLine[];
  hasHydrated: boolean;
  add: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  remove: (slug: string, tierId: string) => void;
  setQty: (slug: string, tierId: string, qty: number) => void;
  clear: () => void;
  setHydrated: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hasHydrated: false,
      add: ({ qty = 1, ...line }) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.slug === line.slug && l.tierId === line.tierId,
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === line.slug && l.tierId === line.tierId ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, qty }] };
        }),
      remove: (slug, tierId) =>
        set((state) => ({
          lines: state.lines.filter((l) => !(l.slug === slug && l.tierId === tierId)),
        })),
      setQty: (slug, tierId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.slug === slug && l.tierId === tierId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "ammedi-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const selectTotalQty = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);

/** Subtotal in INR if every line has a price; otherwise null (price on enquiry). */
export const selectSubtotal = (s: CartState): number | null => {
  if (s.lines.length === 0) return null;
  if (!s.lines.every((l) => typeof l.price === "number")) return null;
  return s.lines.reduce((sum, l) => sum + (l.price ?? 0) * l.qty, 0);
};
