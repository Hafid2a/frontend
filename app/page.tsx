"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrustBar } from "@/components/common/TrustBar";
import { ProductCard } from "@/components/common/ProductCard";
import { ReviewCard } from "@/components/common/ReviewCard";
import { PRODUCTS } from "@/config/products";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const HOME_FAQS = [
  {
    q: "هل الدفع عند الاستلام متاح؟",
    a: "نعم، الدفع يكون عند استلام الطلب. لا تحتاج بطاقة أو حساب.",
  },
  {
    q: "كم يستغرق التوصيل؟",
    a: "2-4 أيام عمل داخل المملكة العربية السعودية.",
  },
  {
    q: "هل المنتجات مناسبة للبشرة الحساسة؟",
    a: "نوصي بالبدء بكمية صغيرة ومراقبة تفاعل بشرتك. كل منتج له تعليمات استخدام محددة.",
  },
  {
    q: "كيف أتأكد أن طلبي وصل؟",
    a: "ستتلقى رسالة تأكيد وقد نتواصل معك لتأكيد الطلب قبل الشحن.",
  },
  {
    q: "هل يمكن طلب أكثر من منتج؟",
    a: "نعم، يمكنك إضافة أي منتج للسلة وإتمام طلب واحد يصلك بشحنة واحدة.",
  },
  {
    q: "كيف أتواصل مع الدعم؟",
    a: "عبر واتساب. فريقنا يرد خلال ساعات.",
  },
];

function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="py-16 bg-najd-green/5">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl">أسئلة شائعة</h2>
        </motion.div>
        <div className="space-y-3">
          {HOME_FAQS.map((faq, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.05 }}
              className="bg-charcoal rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right"
                aria-expanded={openIndex === i}
              >
                <ChevronDown
                  className={`w-5 h-5 text-muted transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
                <span className="text-stone font-semibold text-sm flex-1 text-right mr-3">
                  {faq.q}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const allReviews = PRODUCTS.flatMap((p) => p.reviews.slice(0, 1));

function DecisionProofSection() {
  return (
    <section className="py-16 bg-deep-night">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="rounded-[28px] border border-warm-sand/15 bg-charcoal/80 p-6 md:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-1 text-warm-sand">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>
            <span className="text-4xl text-warm-sand/25">“</span>
          </div>
          <p className="text-right text-stone leading-8 md:text-lg">
            بصراحة كنت أحسبها نفس منتجات الإعلانات. طلبت نجد كلير بعد ما تعبت
            من حبوب الحلاقة، واللي خلاني أكمل الطلب إن الموقع واضح: دفع عند
            الاستلام، تأكيد بالجوال، والمنتج موجه لمشكلة واحدة مو كلام عام.
            بعد ما شفت الروتين بسيط، أخذت عرض القطعتين.
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="rounded-full bg-najd-green/20 px-3 py-1 text-xs text-najd-green">
              مشتري مؤكد
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-stone font-medium">عبدالله الحربي</p>
                <p className="text-muted text-xs">29 سنة · الرياض</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-najd-green text-warm-sand">
                ع
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mt-16 text-center">
          <p className="text-warm-sand text-sm mb-3">ليش نجد؟</p>
          <h2 className="text-stone font-medium text-4xl md:text-5xl mb-4">
            قارن، وقرر بنفسك
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-7">
            لا نبيعك منتج مجهول بصورة حلوة. كل منتج في نجد مربوط بمشكلة واضحة،
            عرض واضح، ودفع عند الاستلام عشان القرار يكون أسهل.
          </p>
        </motion.div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            ["متجر عشوائي", "منتجات كثيرة بدون تركيز"],
            ["نجد", "ثلاث مشاكل رجال وثلاث حلول واضحة"],
            ["الشراء", "اسم ورقم فقط والدفع عند الاستلام"],
          ].map(([title, desc], i) => (
            <motion.div
              key={title}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-5 text-center ${
                title === "نجد"
                  ? "border-warm-sand/35 bg-najd-green/20"
                  : "border-white/10 bg-charcoal/60"
              }`}
            >
              <h3 className="text-stone font-medium mb-2">{title}</h3>
              <p className="text-muted text-sm leading-6">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-najd-green/30 via-deep-night to-deep-night" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-najd-green/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-warm-sand/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-najd-green/30 border border-najd-green/50 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-warm-sand rounded-full animate-pulse" />
              <span className="text-warm-sand text-xs font-medium">
                الدفع عند الاستلام داخل السعودية
              </span>
            </div>

            <h1 className="text-stone font-bold text-5xl md:text-6xl leading-tight mb-4">
              نجد.{" "}
              <span className="text-warm-sand">حضورك</span>
              <br />
              قبل كلامك.
            </h1>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              روتين رجال سعودي لثلاث مشاكل حقيقية: حبوب الحلاقة، فوضى اللحية،
              وآثار السهر. بسيط، سريع، وبدون تعقيد.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="bg-najd-green text-white px-8 py-4 rounded-btn font-bold text-base hover:bg-najd-green/80 transition-colors text-center"
              >
                تسوق منتجات نجد
              </Link>
              <Link
                href="#routine"
                className="border border-warm-sand/40 text-warm-sand px-8 py-4 rounded-btn font-bold text-base hover:bg-warm-sand/10 transition-colors text-center"
              >
                اعرف روتينك
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2 space-x-reverse">
                {["ع", "م", "ف", "خ"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-najd-green border-2 border-deep-night flex items-center justify-center"
                  >
                    <span className="text-warm-sand text-xs font-bold">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted text-sm">
                +2,400 طلب داخل السعودية
              </p>
            </div>
          </motion.div>

          {/* Hero product visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-najd-green/20 rounded-card border border-najd-green/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-warm-sand/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-warm-sand text-6xl font-bold font-arabic">
                      ن
                    </span>
                  </div>
                  <p className="text-stone/60 text-sm">نجد — عناية الرجل</p>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-charcoal border border-warm-sand/30 rounded-2xl px-3 py-2 shadow-xl">
                <p className="text-warm-sand text-xs font-bold">⭐ 4.8/5</p>
                <p className="text-muted text-xs">تقييم العملاء</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-charcoal border border-najd-green/30 rounded-2xl px-3 py-2 shadow-xl">
                <p className="text-stone text-xs font-bold">💳 COD</p>
                <p className="text-muted text-xs">الدفع عند الاستلام</p>
              </div>
              <div className="absolute bottom-4 right-4 max-w-[250px] rounded-2xl border border-warm-sand/25 bg-stone/95 px-4 py-3 text-right shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-najd-green text-warm-sand">
                    ✓
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-deep-night">
                      متجر نجد الرسمي
                    </p>
                    <p className="truncate text-xs text-muted">
                      تأكيد وفحص قبل الشحن
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── Problems ── */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl mb-3">
            ثلاث مشاكل، ثلاثة حلول.
          </h2>
          <p className="text-muted">
            نجد صُمّم لمشاكل الرجل السعودي اليومية بعد الحلاقة وقبل الاجتماع.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔴",
              problem: "حبوب الحلاقة",
              desc: "احمرار وحبوب بعد كل موس أو مكينة. يخليك تتجنب النظر في المرايا.",
              slug: "najd-clear",
              product: "نجد كلير",
            },
            {
              icon: "💈",
              problem: "فوضى اللحية",
              desc: "لحية كثيفة ومنتفشة ما تنضبط. تعطي انطباع مو زين قبل أي لقاء.",
              slug: "najd-align",
              product: "نجد ألاين",
            },
            {
              icon: "😴",
              problem: "آثار السهر",
              desc: "هالات وتعب تحت العين يبانون وإن كنت نشيط. يخليك تبدو أكبر من عمرك.",
              slug: "najd-rest",
              product: "نجد ريست",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal rounded-card border border-white/10 p-6 hover:border-warm-sand/30 transition-colors group"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="text-stone font-bold text-xl mb-2">
                {item.problem}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                {item.desc}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-warm-sand text-sm font-semibold hover:underline"
                >
                  الحل: {item.product} ←
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-16 bg-najd-green/5">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-stone font-bold text-3xl mb-2">
              منتجات نجد الثلاثة
            </h2>
            <p className="text-muted">اختر المنتج اللي يناسب مشكلتك</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.slug}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Standard ── */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl mb-2">
            معيار نجد للجودة
          </h2>
          <p className="text-muted">نهتم بالتفاصيل قبل ما يصلك المنتج</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🔬",
              title: "اختيار مكونات مدروس",
              desc: "نختار المكونات بناءً على فعاليتها وملاءمتها لبشرة الرجل.",
            },
            {
              icon: "✅",
              title: "فحص جودة قبل الشحن",
              desc: "كل طلب يمر بفحص قبل الخروج من المخزن.",
            },
            {
              icon: "📦",
              title: "تغليف يحافظ على المنتج",
              desc: "تغليف مصمم لحماية المنتج طوال رحلة التوصيل.",
            },
            {
              icon: "💬",
              title: "دعم واضح بعد الطلب",
              desc: "فريق واتساب يرد على استفساراتك بسرعة.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-charcoal rounded-2xl p-5 border border-white/10"
            >
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-stone font-bold mb-1">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="py-16 bg-najd-green/5">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-warm-sand text-xl">
                  ★
                </span>
              ))}
            </div>
            <h2 className="text-stone font-bold text-3xl">
              من تجارب العملاء
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {allReviews.map((review, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <ReviewCard {...review} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DecisionProofSection />

      {/* ── Routine Builder ── */}
      <section id="routine" className="py-16 max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="text-stone font-bold text-3xl mb-2">
            اختر مشكلتك
          </h2>
          <p className="text-muted">
            نجد يعطيك الحل المناسب بسرعة
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map((p, i) => (
            <motion.div key={p.slug} {...fadeUp} transition={{ delay: i * 0.1 }}>
              <Link href={`/products/${p.slug}`}>
                <div className="bg-charcoal rounded-card border border-white/10 p-6 hover:border-najd-green/60 transition-colors group cursor-pointer">
                  <div className="w-16 h-16 bg-najd-green/20 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-warm-sand text-3xl font-bold font-arabic">
                      {p.nameAr[2]}
                    </span>
                  </div>
                  <p className="text-muted text-xs mb-1">المشكلة</p>
                  <h3 className="text-stone font-bold text-lg mb-2">
                    {p.problemAr}
                  </h3>
                  <p className="text-muted text-sm mb-4">{p.shortDescAr}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-warm-sand font-medium text-sm">
                      قطعتين — {p.offers.find((offer) => offer.qty === 2)?.priceSar ?? 279} ريال
                    </span>
                    <span className="text-najd-green group-hover:text-warm-sand transition-colors text-sm font-semibold">
                      {p.nameAr} ←
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Offer Band ── */}
      <motion.section
        {...fadeUp}
        className="py-12 bg-najd-green/20 border-y border-najd-green/30"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-stone font-bold text-2xl mb-2">
            وفّر أكثر مع عروض الكمية
          </h2>
          <p className="text-muted mb-6">
            خذ قطعتين وادفع 279 ريال بدل 398 — توفير 119 ريال
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-charcoal rounded-2xl border border-warm-sand/30 px-6 py-4 text-center">
              <p className="text-muted text-xs mb-1">الأكثر اختياراً</p>
              <p className="text-warm-sand font-bold text-2xl">279 ريال</p>
              <p className="text-stone text-sm">قطعتين من أي منتج</p>
              <p className="text-muted text-xs line-through mt-1">398 ريال</p>
            </div>
            <div className="bg-charcoal rounded-2xl border border-najd-green/30 px-6 py-4 text-center">
              <p className="text-muted text-xs mb-1">أفضل قيمة</p>
              <p className="text-warm-sand font-bold text-2xl">349 ريال</p>
              <p className="text-stone text-sm">ثلاث قطع من أي منتج</p>
              <p className="text-muted text-xs line-through mt-1">597 ريال</p>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-block mt-6 bg-najd-green text-white px-8 py-3 rounded-btn font-bold hover:bg-najd-green/80 transition-colors"
          >
            اختر عرضك الآن
          </Link>
        </div>
      </motion.section>

      {/* ── FAQ ── */}
      <HomeFAQ />

      {/* ── Final CTA ── */}
      <motion.section
        {...fadeUp}
        className="py-20 text-center max-w-3xl mx-auto px-4"
      >
        <h2 className="text-stone font-bold text-4xl md:text-5xl mb-4">
          ابدأ بروتين نجد اليوم
        </h2>
        <p className="text-muted text-lg mb-8">
          طلبك ما يأخذ دقيقة. والدفع عند الاستلام.
        </p>
        <Link
          href="/products"
          className="inline-block bg-warm-sand text-deep-night px-10 py-4 rounded-btn font-bold text-lg hover:bg-warm-sand/80 transition-colors"
        >
          تسوق الآن
        </Link>
      </motion.section>
    </div>
  );
}
