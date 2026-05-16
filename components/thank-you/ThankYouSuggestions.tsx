"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { PRODUCTS, type ProductConfig } from "@/config/products";

interface ThankYouSuggestionsProps {
  /** Slugs already in this confirmed order — we hide those. */
  excludeSlugs: string[];
}

function preferredOfferOf(product: ProductConfig) {
  return product.offers.find((o) => o.qty === 2) ?? product.offers[0];
}

export function ThankYouSuggestions({ excludeSlugs }: ThankYouSuggestionsProps) {
  const excluded = new Set(excludeSlugs);
  const suggestions = PRODUCTS.filter((p) => !excluded.has(p.slug));

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4 }}
      className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] md:p-9"
    >
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-najd-green/20 bg-najd-green/10 px-3 py-1 text-[11px] font-medium text-najd-green">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          أكملي روتين نجد
        </span>
        <h2 className="mt-3 text-xl font-medium text-stone md:text-2xl">
          المنتجات اللي تكمّل خطّك — قبل تسليم الطلب
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          أضيفي أحدها لطلب قادم بنفس عرض الإطلاق — كل قطعة تشتغل مع البقية تحت
          الإيشارب والجو السعودي.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((product) => {
          const offer = preferredOfferOf(product);
          const fit = product.imageObjectFit ?? "cover";
          const href = `/products/${product.slug}`;
          return (
            <article
              key={product.slug}
              className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-stone/10 bg-[#FAFAF8] transition hover:border-najd-green/30 hover:bg-white"
            >
              <Link
                href={href}
                className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-charcoal/50"
                aria-label={`اطّلعي على ${product.nameAr}`}
              >
                {product.imageSrc ? (
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt || product.nameAr}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                    className={
                      fit === "contain" ? "object-contain p-4" : "object-cover"
                    }
                  />
                ) : (
                  <span className="font-arabic text-4xl text-warm-sand">
                    {product.nameAr[0]}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium text-najd-green shadow-sm backdrop-blur">
                  {product.displayTaglineAr}
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-5 text-right">
                <div className="flex items-center justify-end gap-1 text-[11px] text-warm-sand">
                  <Star className="h-3 w-3 fill-current" aria-hidden />
                  <span>4.8 · مشتريات مؤكّدة</span>
                </div>

                <h3 className="line-clamp-2 text-base font-medium leading-snug text-stone">
                  {product.nameAr}
                </h3>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                  {product.shortDescAr}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-stone/[0.06] pt-3">
                  <div className="text-right">
                    <p className="text-[10px] text-muted">قطعتين</p>
                    <p className="text-base font-medium tabular-nums text-najd-green">
                      {offer.priceSar}
                      <span className="mr-1 text-[11px] text-muted">ر.س</span>
                    </p>
                    {offer.compareAtSar ? (
                      <p className="text-[10px] tabular-nums text-muted line-through">
                        {offer.compareAtSar} ر.س
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 rounded-xl bg-najd-green px-3 py-2 text-xs font-medium text-white transition hover:bg-najd-green/90"
                  >
                    اطّلعي
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
        ⚠️ هذا الطلب جاهز للشحن — يمكنك إضافة المنتج إلى طلب جديد لاحقاً، أو
        طلبه من المندوب وقت تأكيد المكالمة.
      </p>
    </motion.section>
  );
}
