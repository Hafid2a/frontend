"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { OfferSelector } from "./OfferSelector";
import type { ProductConfig } from "@/config/products";

interface ProductHeroProps {
  product: ProductConfig;
}

export function ProductHero({ product }: ProductHeroProps) {
  const hasImage = Boolean(product.imageSrc);
  const imageFit = product.imageObjectFit ?? "cover";

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
            <div className="mx-auto max-w-md space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-card border border-najd-green/25 bg-najd-green/15 shadow-[0_20px_50px_-20px_rgba(194,70,111,0.35)]">
                {hasImage ? (
                  <>
                    <Image
                      src={product.imageSrc!}
                      alt={product.imageAlt || product.nameAr}
                      fill
                      sizes="(min-width: 768px) 28rem, 100vw"
                      className={imageFit === "contain" ? "object-contain" : "object-cover"}
                      priority
                    />
                    <div
                      className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-najd-green/[0.12] to-transparent"
                      aria-hidden
                    />
                  </>
                ) : (
                  <>
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-warm-sand/20">
                        <span className="font-arabic text-8xl font-bold text-warm-sand">
                          {product.nameAr[2]}
                        </span>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-najd-green/10 to-transparent" />
                  </>
                )}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[42%] bg-gradient-to-t from-charcoal/55 via-charcoal/20 to-transparent"
                  aria-hidden
                />

                <div className="absolute bottom-5 right-4 z-[3] max-w-[min(92%,17.5rem)] rounded-xl border border-warm-sand/25 bg-charcoal/92 px-3.5 py-3 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-5">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted">
                    يحارب
                  </p>
                  <p className="text-sm font-semibold leading-snug text-stone">{product.problemAr}</p>
                </div>
              </div>

              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {product.gallery.map((item) => (
                    <div
                      key={item.src}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-warm-sand/20 bg-charcoal/40"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 768px) 14rem, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 md:order-1"
          >
            <div className="mb-3 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-sm text-najd-green">
                  ★
                </span>
              ))}
              <span className="mr-2 text-sm text-muted">
                4.8 ({product.reviews.length * 47} تقييم)
              </span>
            </div>

            <p className="mb-2 text-sm font-semibold tracking-tight text-najd-green md:text-base">
              {product.displayTaglineAr}
            </p>
            <h1 className="mb-3 text-balance text-4xl font-bold leading-snug text-stone md:text-5xl">
              {product.nameAr}
            </h1>
            <p className="text-muted text-lg mb-6">{product.heroSubheading}</p>

            <ul className="mb-8 space-y-2">
              {product.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-najd-green stroke-[2.6]" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>

            {product.ingredientsTeaserAr && product.ingredientsTeaserAr.length > 0 && (
              <div className="mb-8 rounded-2xl border border-warm-sand/20 bg-charcoal/50 px-4 py-4 sm:px-5">
                <p className="mb-3 text-right text-xs font-semibold uppercase tracking-wide text-najd-green">
                  لمحة المكوّنات
                </p>
                <ul className="space-y-2.5">
                  {product.ingredientsTeaserAr.map((line, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-stone/85"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-najd-green" aria-hidden />
                      <span className="flex-1">{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-warm-sand/10 pt-3 text-right text-xs leading-relaxed text-muted">
                  المصدر الرسمي لقائمة INCI ومدة الصلاحية هو غلاف المنتج الذي بين يديكِ.
                </p>
              </div>
            )}

            <OfferSelector product={product} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
