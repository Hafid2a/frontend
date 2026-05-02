"use client";

import { create } from "zustand";

interface CheckoutStore {
  isOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  isOpen: false,
  openCheckout: () => set({ isOpen: true }),
  closeCheckout: () => set({ isOpen: false }),
}));
