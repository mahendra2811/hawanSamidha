"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Buyer details saved on-device so checkout is one tap. Not sent anywhere until
 * the user submits an enquiry. Prefills the checkout enquiry form.
 */
type ProfileState = {
  name: string;
  mobile: string;
  email: string;
  hasHydrated: boolean;
  save: (p: { name?: string; mobile?: string; email?: string }) => void;
  setHydrated: () => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: "",
      mobile: "",
      email: "",
      hasHydrated: false,
      save: (p) => set(p),
      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "ammedi-profile-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ name: s.name, mobile: s.mobile, email: s.email }),
      onRehydrateStorage: () => (s) => s?.setHydrated(),
    },
  ),
);
