"use client";

import { Check } from "lucide-react";
import type { ProductOffer } from "@/config/products";

interface OfferCardProps {
  offer: ProductOffer;
  isSelected: boolean;
  onSelect: () => void;
}

export function OfferCard({ offer, isSelected, onSelect }: OfferCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-right p-4 rounded-2xl border-2 transition-all relative ${
        isSelected
          ? "border-warm-sand bg-warm-sand/10"
          : "border-white/20 bg-charcoal hover:border-white/40"
      }`}
      aria-pressed={isSelected}
    >
      {offer.badgeAr && (
        <span
          className={`absolute -top-3 right-3 text-xs px-2 py-0.5 rounded-full font-bold ${
            isSelected
              ? "bg-warm-sand text-deep-night"
              : "bg-najd-green text-white"
          }`}
        >
          {offer.badgeAr}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSelected && <Check className="w-4 h-4 text-warm-sand" />}
          <span
            className={`text-lg font-bold ${isSelected ? "text-warm-sand" : "text-stone"}`}
          >
            {offer.priceSar} ريال
          </span>
          {offer.compareAtSar && (
            <span className="text-muted line-through text-sm">
              {offer.compareAtSar}
            </span>
          )}
        </div>
        <span className="text-stone text-sm">{offer.labelAr}</span>
      </div>
    </button>
  );
}
