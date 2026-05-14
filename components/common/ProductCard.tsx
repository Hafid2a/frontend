"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductConfig } from "@/config/products";

interface ProductCardProps {
  product: ProductConfig;
}

export function ProductCard({ product }: ProductCardProps) {
  const preferredOffer =
    product.offers.find((offer) => offer.qty === 2) ?? product.offers[0];
  const href = `/products/${product.slug}`;
  const imageFit = product.imageObjectFit ?? "cover";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-card border border-warm-sand/20 bg-charcoal transition-colors hover:border-warm-sand/50"
    >
      <Link href={href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-warm-sand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-najd-green/30">
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.imageAlt || product.nameAr}
              fill
              sizes="(min-width: 1024px) 320px, 50vw"
              className={imageFit === "contain" ? "object-contain" : "object-cover"}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-warm-sand/20">
              <span className="font-arabic text-5xl font-bold text-warm-sand">
                {product.nameAr[2]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
          <div className="absolute bottom-3 right-3 max-w-[min(92%,14rem)]">
            <span className="block rounded-full bg-najd-green px-2 py-1 text-center text-[11px] font-medium leading-snug text-white shadow-sm line-clamp-2">
              {product.displayTaglineAr}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-xs text-warm-sand">
                ★
              </span>
            ))}
            <span className="mr-1 text-xs text-muted">4.8</span>
          </div>
          <h3 className="text-lg font-bold text-stone">{product.nameAr}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {product.shortDescAr}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <span className="mb-1 inline-block rounded-full bg-warm-sand/15 px-2 py-0.5 text-[11px] text-warm-sand">
                الأكثر اختياراً
              </span>
              <p className="font-medium text-warm-sand">
                قطعتين — {preferredOffer.priceSar} ريال
              </p>
            </div>
            <span className="whitespace-nowrap rounded-btn bg-najd-green px-4 py-2 text-sm text-white transition-colors group-hover:bg-najd-green/80">
              اختر العرض
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
