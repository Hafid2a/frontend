"use client";

import { use, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
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
            مشكلة يعاني منها كثير من الرجال يومياً وغالباً ما تُترك بدون حل
            واضح. {product.heroSubheading}
          </p>
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
        <div className="grid md:grid-cols-3 gap-6">
          {product.howToUse.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="w-12 h-12 bg-warm-sand/20 border border-warm-sand/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-warm-sand font-bold">{i + 1}</span>
              </div>
              <h3 className="text-warm-sand font-bold text-lg mb-2">
                {step.step}
              </h3>
              <p className="text-muted text-sm">{step.desc}</p>
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
                title: "صُمّم للسوق السعودي",
                desc: "نفهم مشاكل الرجل السعودي ونصمم حلولاً بناءً عليها.",
              },
              {
                icon: "⚡",
                title: "روتين سريع",
                desc: "منتجات تناسب الإيقاع اليومي بدون تعقيد.",
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
            ليه {product.nameAr} يستاهل يدخل روتينك؟
          </h2>
          <p className="text-muted mt-3 max-w-2xl mx-auto">
            مو منتج عشوائي تضيفه للدرج. هذا حل سريع لمشكلة يومية تأثر على
            مظهرك وانطباعك.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "مظهر أرتب",
              desc: "يساعدك تدخل الدوام أو المناسبة وأنت مسيطر على التفاصيل الصغيرة.",
            },
            {
              title: "روتين سريع",
              desc: "خطوات قليلة وواضحة تناسب الرجل اللي ما يحب التعقيد.",
            },
            {
              title: "ثقة قبل الخروج",
              desc: "لأن وجهك ولحيتك وعيونك جزء من أول انطباع عنك.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-warm-sand/15 bg-charcoal/70 p-6 text-right"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-najd-green/25 text-warm-sand">
                {i + 1}
              </div>
              <h3 className="text-stone font-medium mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-6">{item.desc}</p>
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
              عندك نفس المشكلة وتبي حل واضح
            </h2>
            <p className="text-muted leading-7">
              {product.nameAr} معمول للرجال اللي يبون نتيجة عملية بدون ما
              يدخلون في روتين طويل أو كلام تسويقي زايد.
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
            جاهز تختار عرض {product.nameAr}؟
          </h2>
          <p className="text-muted mb-6">
            العروض موجودة فوق الصفحة. اختر قطعتين أو ثلاث وارفع قيمة الطلب بدون
            ما تضيع الزبون بتكرار نفس البلوك.
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
