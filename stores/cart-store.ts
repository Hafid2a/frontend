"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  lineId: string;
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  offerQty: number;
  unitLabel: string;
  priceSar: number;
  compareAtSar?: number;
  image?: string;
  addedFrom?: string;
}

export const OFFER_PRICES: Record<number, number> = { 1: 199, 2: 279, 3: 349 };

export function dedupeCartItems(items: CartItem[]) {
  const latestByProduct = new Map<string, CartItem>();

  for (const item of items) {
    latestByProduct.set(item.slug, item);
  }

  return Array.from(latestByProduct.values());
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addOffer: (item: Omit<CartItem, "lineId">) => void;
  addCrossSell: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getSuggestedCrossSell: () => string | null;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addOffer: (item) => {
        const lineId = `${item.slug}-${item.offerQty}-${Date.now()}`;
        set(() => ({
          items: [{ ...item, lineId }],
          isOpen: true,
        }));
      },

      addCrossSell: (item) => {
        const existing = get().items.find((i) => i.slug === item.slug);
        if (existing) return;
        const lineId = `${item.slug}-cs-${Date.now()}`;
        set((state) => ({
          items: [...state.items, { ...item, lineId }],
        }));
      },

      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((i) => i.lineId !== lineId),
        }));
      },

      clearCart: () => set({ items: [], isOpen: false }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        return dedupeCartItems(get().items).reduce(
          (sum, item) => sum + item.priceSar,
          0
        );
      },

      getSuggestedCrossSell: () => {
        const slugs = new Set(get().items.map((i) => i.slug));
        const all = ["najd-clear", "najd-align", "najd-rest"];
        for (const slug of all) {
          if (!slugs.has(slug)) return slug;
        }
        return null;
      },
    }),
    { name: "najd-cart" }
  )
);
