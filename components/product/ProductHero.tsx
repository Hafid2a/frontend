"use client";

import { motion } from "framer-motion";
import { OfferSelector } from "./OfferSelector";
import type { ProductConfig } from "@/config/products";

interface ProductHeroProps {
  product: ProductConfig;
}

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2"
          >
            <div className="aspect-square max-w-md mx-auto bg-najd-green/20 rounded-card border border-najd-green/30 flex items-center justify-center relative overflow-hidden">
              <div className="w-40 h-40 rounded-full bg-warm-sand/20 flex items-center justify-center">
                <span className="text-warm-sand text-8xl font-bold font-arabic">
                  {product.nameAr[2]}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-najd-green/10 to-transparent" />
              <div className="absolute bottom-6 right-6 bg-charcoal/90 rounded-2xl px-4 py-3 border border-warm-sand/20">
                <p className="text-muted text-xs mb-1">يحارب</p>
                <p className="text-warm-sand font-bold text-sm">
                  {product.problemAr}
                </p>
              </div>
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-warm-sand/25 bg-stone/95 px-3 py-3 shadow-2xl md:left-5 md:right-auto md:max-w-[250px]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-najd-green text-sm text-warm-sand">
                    ✓
                  </span>
                  <div className="min-w-0 text-right">
                    <p className="truncate text-xs font-medium text-deep-night md:text-sm">
                      متجر نجد الرسمي
                    </p>
                    <p className="truncate text-[11px] text-muted md:text-xs">
                      تأكيد وفحص قبل الشحن
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-warm-sand text-sm">
                  ★
                </span>
              ))}
              <span className="text-muted text-sm mr-2">
                4.8 ({product.reviews.length * 47} تقييم)
              </span>
            </div>

            <h1 className="text-stone font-bold text-4xl md:text-5xl mb-3 leading-tight">
              {product.heroHeadline}
            </h1>
            <p className="text-muted text-lg mb-6">{product.heroSubheading}</p>

            <ul className="space-y-2 mb-8">
              {product.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-stone/80 text-sm">
                  <span className="text-warm-sand mt-0.5">✓</span>
                  {bullet}
                </li>
              ))}
            </ul>

            <OfferSelector product={product} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
