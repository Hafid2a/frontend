"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductConfig } from "@/config/products";

interface ProductCardProps {
  product: ProductConfig;
}

export function ProductCard({ product }: ProductCardProps) {
  const preferredOffer =
    product.offers.find((offer) => offer.qty === 2) ?? product.offers[0];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-charcoal rounded-card border border-warm-sand/20 overflow-hidden group hover:border-warm-sand/50 transition-colors"
    >
      <div className="bg-najd-green/30 aspect-square flex items-center justify-center relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-warm-sand/20 flex items-center justify-center">
          <span className="text-warm-sand text-5xl font-bold font-arabic">
            {product.nameAr[2]}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
        <div className="absolute bottom-3 right-3">
          <span className="bg-najd-green/80 text-stone text-xs px-2 py-1 rounded-full">
            {product.problemAr}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-warm-sand text-xs">
              ★
            </span>
          ))}
          <span className="text-muted text-xs mr-1">4.8</span>
        </div>
        <h3 className="text-stone font-bold text-lg">{product.nameAr}</h3>
        <p className="text-muted text-sm mt-1 line-clamp-2">
          {product.shortDescAr}
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="mb-1 inline-block rounded-full bg-warm-sand/15 px-2 py-0.5 text-[11px] text-warm-sand">
              الأكثر اختياراً
            </span>
            <p className="text-warm-sand font-medium">
              قطعتين — {preferredOffer.priceSar} ريال
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            className="bg-najd-green text-white text-sm px-4 py-2 rounded-btn hover:bg-najd-green/80 transition-colors whitespace-nowrap"
          >
            اختر العرض
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
