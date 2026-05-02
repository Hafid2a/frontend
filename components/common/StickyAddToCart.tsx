"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/cart-store";
import { trackAddToCart } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import type { ProductConfig } from "@/config/products";

interface StickyAddToCartProps {
  product: ProductConfig;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const { addOffer } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 480);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultOffer = product.offers.find(
    (o) => o.qty === product.defaultOfferQty
  )!;

  const handleAdd = () => {
    addOffer({
      productId: product.slug,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      offerQty: defaultOffer.qty,
      unitLabel: defaultOffer.labelAr,
      priceSar: defaultOffer.priceSar,
      compareAtSar: defaultOffer.compareAtSar,
      addedFrom: "sticky_cta",
    });
    const eventId = generateEventId("add_to_cart");
    trackAddToCart(
      {
        slug: product.slug,
        nameAr: product.nameAr,
        price: defaultOffer.priceSar,
        qty: defaultOffer.qty,
      },
      eventId
    );
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-transparent p-4 safe-area-pb"
        >
          <div className="mx-auto max-w-3xl">
            <button
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-3 rounded-[18px] bg-najd-green px-6 py-4 text-base font-medium text-white shadow-[0_12px_35px_rgba(11,107,79,0.45)] transition-colors hover:bg-najd-green/90"
            >
              <span className="text-lg leading-none">↑</span>
              <span>ابدأ روتين نجد الآن</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
