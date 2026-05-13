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
          ? "border-najd-green bg-najd-green/8 shadow-sm"
          : "border-stone/15 bg-charcoal/60 hover:border-najd-green/40"
      }`}
      aria-pressed={isSelected}
    >
      {offer.badgeAr && (
        <span
          className={`absolute -top-3 right-3 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${
            isSelected
              ? "bg-najd-green text-white"
              : "bg-warm-sand text-white"
          }`}
        >
          {offer.badgeAr}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSelected && <Check className="w-4 h-4 text-najd-green" />}
          <span
            className={`text-lg font-bold ${isSelected ? "text-najd-green" : "text-stone"}`}
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
