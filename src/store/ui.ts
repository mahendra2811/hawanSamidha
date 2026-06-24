"use client";

import { create } from "zustand";

type UiState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const useUi = create<UiState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
}));
