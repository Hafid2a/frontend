"use client";

import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PRODUCTS, PRODUCT_MAP } from "@/config/products";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductMechanism } from "@/components/product/ProductMechanism";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { StickyAddToCart } from "@/components/common/StickyAddToCart";
import { generateEventId } from "@/lib/event-id";
import { trackViewContent } from "@/lib/tracking";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const product = PRODUCT_MAP[slug];

  useEffect(() => {
    if (product) {
      const eventId = generateEventId("view_content");
      trackViewContent(
        {
          slug: product.slug,
          nameAr: product.nameAr,
          price: product.offers[0].priceSar,
        },
        eventId
      );
    }
  }, [product]);

  if (!product) notFound();

  const crossSell = PRODUCT_MAP[product.crossSellSlug];

  return (
    <div>
      {/* Product Hero with offer selector */}
      <div id="offers">
        <ProductHero product={product} />
      </div>

      {/* Pain agitation */}
      <motion.section
        {...fadeUp}
        className="py-12 max-w-4xl mx-auto px-4 text-center"
      >
        <div className="bg-charcoal/60 border border-error/20 rounded-card p-8">
          <span className="text-4xl mb-4 block">❗</span>
          <h2 className="text-stone font-bold text-2xl mb-3">
            {product.problemAr}
          </h2>
          <p className="text-muted leading-relaxed">
            وقت الخروج والحرّ والتكييف، كثير من البنات يحسبن ذوباناً للمكياج أو
            بهتاناً أو احتكاكاً حوالين الجبهة — بدون خط موضّح للوجه تحت الإيشارب.{" "}
            {product.heroSubheading}
          </p>

          {product.descriptionImage && (
            <figure className="mt-10 text-center">
              <div className="mx-auto inline-block max-w-2xl overflow-hidden rounded-card border border-warm-sand/20 bg-deep-night/60 p-2">
                <Image
                  src={product.descriptionImage.src}
                  alt={product.descriptionImage.alt}
                  width={1200}
                  height={1800}
                  sizes="(min-width: 768px) 42rem, 100vw"
                  className="mx-auto h-auto max-h-[min(70vh,920px)] w-full object-contain"
                />
              </div>
              {product.descriptionImage.captionAr && (
                <figcaption className="mt-4 text-xs leading-relaxed text-muted md:text-sm">
                  {product.descriptionImage.captionAr}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </motion.section>

      {/* Mechanism */}
      <ProductMechanism product={product} />

      {/* How to use */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl">طريقة الاستخدام</h2>
          <p className="text-muted mt-2">بسيطة وما تأخذ وقت</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          {product.howToUse.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal rounded-2xl p-6 border border-white/10 text-center"
            >
              {!step.imageSrc && (
                <div className="w-12 h-12 bg-warm-sand/20 border border-warm-sand/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-warm-sand font-bold">{i + 1}</span>
                </div>
              )}
              {step.imageSrc && (
                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-xl border border-warm-sand/15 bg-deep-night/50">
                  <Image
                    src={step.imageSrc}
                    alt={step.imageAlt ?? `${step.step} — ${step.desc}`}
                    fill
                    sizes="(min-width: 768px) 280px, 100vw"
                    className="object-contain object-center"
                  />
                </div>
              )}
              {step.imageSrc ? (
                <p className="sr-only">
                  {step.step} {step.desc}
                </p>
              ) : (
                <>
                  <h3 className="text-warm-sand font-bold text-lg mb-2">
                    {step.step}
                  </h3>
                  <p className="text-muted text-sm">{step.desc}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why NAJD */}
      <section className="py-16 bg-najd-green/10">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-stone font-bold text-3xl">لماذا نجد؟</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: "🇸🇦",
                title: "صُمّم للبنات في السعودية",
                desc: "نفهم إيقاع الدوام والجامعة والمناسبات والجو المحلي ونقدّم تعليمات واقعية بدون ادِّعاء طبي.",
              },
              {
                icon: "⚡",
                title: "روتين عملي صباحاً ومساءً",
                desc: "خطوات قليلة بعد التنظيف — ثبات، واقي نهاري، أو تهيئة موضّعة حسب الصنف.",
              },
              {
                icon: "💳",
                title: "دفع عند الاستلام",
                desc: "لا بطاقة، لا حساب، لا مخاطرة. ادفع لما يوصلك.",
              },
              {
                icon: "📦",
                title: "توصيل داخل المملكة",
                desc: "2-4 أيام عمل لأي مدينة سعودية.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-charcoal/60 rounded-2xl p-5 border border-white/10"
              >
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-stone font-bold mb-1">{item.title}</h3>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ProductReviews product={product} />

      {/* Product outcome */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <p className="text-warm-sand text-sm mb-2">الفرق اللي تحسّه</p>
          <h2 className="text-stone font-medium text-3xl">
            ليه {product.nameAr} يستاهل يكون جزءاً من روتين وجهكِ؟
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            مو منتج عشوائي تضيفينه على الرف. هذا جزء من عناية خارجية تجميلية
            للوجه تحت الإيشارب والجو وفق الوصف على التعبئة والفئة المستهدفة.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {(
            [
              {
                title: "مظهر أكثر اتزاناً",
                desc: "كل صنف يستهدف احتياجاً محدداً: ثبات، حماية من الشمس، أو تهيئة خط الجبهة حيث ينطبق ذلك على منتجكم.",
                imageSrc: "/images/najd/trio-balanced-look.png",
                imageAlt:
                  "مظهر أكثر اتزاناً: كل صنف يستهدف احتياجاً محدداً — ثبات، حماية من الشمس، أو تهيئة خط الجبهة حيث ينطبق ذلك على منتجكم. مستحضر تجميلي موضَّع فقط (النص في الصورة).",
              },
              {
                title: "وقت استخدام واضح",
                desc: "صباح أو مساء حسب الصنف — من غير تعقيد قبل الدوام أو المناسبة.",
                imageSrc: "/images/najd/outcome-usage-time-clear.png",
                imageAlt:
                  "وقت استخدام واضح. صباح أو مساء حسب الصنف — من غير تعقيد قبل الدوام أو المناسبة. شعار نجد.",
                imageFit: "contain" as const,
              },
              {
                title: "ثقة في التفاصيل",
                desc: "طبقة تتحكّمين بكميتها؛ راجعي العبوّة لأي تحذير خاص بالعين أو المناطق الحساسة.",
                imageSrc: "/images/najd/outcome-trust-in-details.png",
                imageAlt:
                  "ثقة في التفاصيل. طبقة تتحكّمين بكميتها؛ راجعي العبوّة لأي تحذير خاص بالعين أو المناطق الحساسة. شعار نجد.",
                imageFit: "contain" as const,
              },
            ] as Array<
              | {
                  title: string;
                  desc: string;
                  imageSrc: string;
                  imageAlt: string;
                  imageFit?: "cover" | "contain";
                }
              | { title: string; desc: string }
            >
          ).map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-warm-sand/15 bg-charcoal/70 p-6 text-right"
            >
              {"imageSrc" in item && item.imageSrc ? (
                <>
                  <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-xl border border-najd-green/20 bg-deep-night">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt ?? `${item.title} — ${item.desc}`}
                      fill
                      sizes="(min-width: 768px) 320px, 100vw"
                      className={`${
                        item.imageFit === "contain"
                          ? "object-contain"
                          : "object-cover"
                      } object-center`}
                    />
                  </div>
                  <p className="sr-only">
                    {item.title} {item.desc}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-najd-green/25 text-warm-sand">
                    {i + 1}
                  </div>
                  <h3 className="text-stone font-medium mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-6">{item.desc}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Fit checklist */}
      <section className="py-14 bg-deep-night border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <p className="text-warm-sand text-sm mb-2">مناسب لك إذا</p>
            <h2 className="text-stone font-medium text-3xl mb-4">
              عندكِ نفس الاحتياج وتبين تجربة واضحة
            </h2>
            <p className="text-muted leading-7">
              {product.nameAr} مهيَّأ لتجربة تجميلية خارجية؛ اتبعي تعليمات العبوّة
              والترتيب مع باقي خط نجد إن كان مناسباً لكِ.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="space-y-3">
            {product.bullets.slice(0, 4).map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-charcoal/70 p-4 text-right"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-najd-green text-xs text-white">
                  ✓
                </span>
                <p className="text-stone/90 text-sm leading-6">{bullet}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bundle Reminder */}
      {crossSell && (
        <motion.section
          {...fadeUp}
          className="py-12 bg-najd-green/10 border-y border-najd-green/20"
        >
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-warm-sand text-sm font-bold mb-1">
                  اجمع الاثنين معاً
                </p>
                <h3 className="text-stone font-bold text-2xl">
                  {product.nameAr} + {crossSell.nameAr}
                </h3>
                <p className="text-muted text-sm mt-1">
                  روتين مكتمل بدل منتج واحد
                </p>
              </div>
              <Link
                href={`/products/${crossSell.slug}`}
                className="bg-najd-green text-white px-6 py-3 rounded-btn font-bold hover:bg-najd-green/80 transition-colors whitespace-nowrap"
              >
                تعرف على {crossSell.nameAr}
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* FAQ */}
      <ProductFAQ product={product} />

      {/* Final CTA */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="bg-najd-green/20 rounded-card border border-najd-green/30 p-8 text-center"
        >
          <h2 className="text-stone font-medium text-3xl mb-2">
            جاهزة تختارين عرض {product.nameAr}؟
          </h2>
          <p className="text-muted mb-6">
            العروض موجودة أعلى الصفحة. اختاري قطعتين أو ثلاث وادمجي أكثر من صنف
            في طلب واحد إن كان مناسباً لكم.
          </p>
          <Link
            href="#offers"
            className="inline-flex items-center justify-center rounded-btn bg-najd-green px-8 py-4 text-white transition-colors hover:bg-najd-green/80"
          >
            ارجع للعروض واختر الكمية
          </Link>
        </motion.div>
      </section>

      {/* Sticky mobile CTA */}
      <StickyAddToCart product={product} />
    </div>
  );
}
