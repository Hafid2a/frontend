"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { trackAddToCart } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import { OfferCard } from "@/components/common/OfferCard";
import type { ProductConfig } from "@/config/products";

interface OfferSelectorProps {
  product: ProductConfig;
}

export function OfferSelector({ product }: OfferSelectorProps) {
  const [selectedQty, setSelectedQty] = useState(product.defaultOfferQty);
  const { addOffer } = useCartStore();

  const selectedOffer = product.offers.find((o) => o.qty === selectedQty)!;

  const handleAddToCart = () => {
    addOffer({
      productId: product.slug,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      offerQty: selectedQty,
      unitLabel: selectedOffer.labelAr,
      priceSar: selectedOffer.priceSar,
      compareAtSar: selectedOffer.compareAtSar,
      addedFrom: "product_page",
    });

    const eventId = generateEventId("add_to_cart");
    trackAddToCart(
      {
        slug: product.slug,
        nameAr: product.nameAr,
        price: selectedOffer.priceSar,
        qty: selectedQty,
      },
      eventId
    );
  };

  return (
    <div className="space-y-3">
      {product.offers.map((offer) => (
        <OfferCard
          key={offer.qty}
          offer={offer}
          isSelected={selectedQty === offer.qty}
          onSelect={() => setSelectedQty(offer.qty)}
        />
      ))}

      <button
        onClick={handleAddToCart}
        className="w-full bg-najd-green text-white py-4 rounded-btn font-bold text-lg hover:bg-najd-green/80 transition-colors mt-4"
      >
        اختر {selectedOffer.labelAr} — {selectedOffer.priceSar} ريال
      </button>

      <p className="text-muted text-xs text-center">
        💳 الدفع عند الاستلام • 🚚 توصيل داخل السعودية
      </p>
    </div>
  );
}
