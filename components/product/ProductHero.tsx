"use client";



import Image from "next/image";

import { motion } from "framer-motion";

import { OfferSelector } from "./OfferSelector";

import type { ProductConfig } from "@/config/products";



interface ProductHeroProps {

  product: ProductConfig;

}



export function ProductHero({ product }: ProductHeroProps) {

  const hasImage = Boolean(product.imageSrc);

  const imageFit = product.imageObjectFit ?? "cover";

  const fromPrice = Math.min(...product.offers.map((o) => o.priceSar));

  const reviewCount = product.reviews.length * 47;



  return (

    <section className="border-b border-stone/10 bg-gradient-to-b from-deep-night via-deep-night to-charcoal/30 py-12 md:py-16">

      <div className="mx-auto max-w-6xl px-4">

        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14 lg:gap-16">

          {/* Product visual */}

          <motion.div

            initial={{ opacity: 0, x: 20 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.5 }}

            className="order-1 md:order-2"

          >

            <div className="mx-auto max-w-md space-y-4">

              <div className="rounded-3xl border border-stone/10 bg-charcoal/35 p-3 shadow-inner md:p-4">

                <div className="relative aspect-square overflow-hidden rounded-2xl border border-najd-green/25 bg-najd-green/15 shadow-[0_20px_50px_-20px_rgba(194,70,111,0.35)]">

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



          {/* Content — وصف مختصر فقط؛ التفاصيل تحت بالصفحة */}

          <motion.div

            initial={{ opacity: 0, x: -20 }}

            animate={{ opacity: 1, x: 0 }}

            transition={{ duration: 0.5, delay: 0.1 }}

            className="order-2 md:order-1"

          >

            <div className="rounded-3xl border border-stone/10 bg-charcoal/45 p-6 shadow-[0_24px_80px_-48px_rgba(29,20,22,0.45)] backdrop-blur-md md:p-8">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone/10 pb-4">

                <div className="flex flex-wrap items-center gap-2">

                  <div className="flex items-center gap-0.5">

                    {[1, 2, 3, 4, 5].map((s) => (

                      <span key={s} className="text-base text-najd-green md:text-lg">

                        ★

                      </span>

                    ))}

                  </div>

                  <span className="text-sm font-medium text-stone">

                    4.8

                    <span className="mr-1.5 text-muted">({reviewCount} تقييم)</span>

                  </span>

                </div>

                <div className="min-w-0 shrink-0 text-end">

                  <p className="text-[11px] font-medium text-muted">يبدأ السعر من</p>

                  <p className="font-arabic text-xl font-bold tabular-nums text-najd-green md:text-2xl">

                    {fromPrice}{" "}

                    <span className="text-base font-semibold tracking-normal">ر.س</span>

                  </p>

                </div>

              </div>



              <p className="mb-3 text-sm font-semibold text-najd-green md:text-base">

                {product.displayTaglineAr}

              </p>

              <h1 className="mb-3 text-balance text-3xl font-bold leading-snug text-stone md:text-[2.35rem] md:leading-[1.15]">

                {product.nameAr}

              </h1>

              <p className="mb-5 text-sm leading-relaxed text-muted md:text-base">

                {product.shortDescAr}

              </p>

              <p className="mb-6 text-xs leading-relaxed text-muted md:text-sm">

                الدفع عند الاستلام · شحن داخل السعودية · التفاصيل الكاملة على غلاف الدفعة

              </p>



              <div className="border-t border-stone/10 pt-6">

                <p className="mb-4 text-center text-sm font-bold text-stone">اختر العرض المناسب</p>

                <OfferSelector product={product} />

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>

  );

}


