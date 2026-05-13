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
    q: "هل ستضيفون منتجات جديدة؟",
    a: "نعم. مجموعة نجد تتوسع بمراحل؛ أي إصدار جديد يُعرَض هنا بعد ما يمر على نفس معايير الشفافية وعناية البشرة.",
  },
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

/** أيقونات تعريفية لصفحة الرئيسية — أضف مفتاحاً عند إضافة منتج جديد */
const HOME_PILLAR_ICON: Record<string, string> = {
  "najd-thabat-al-khat": "✨",
  "najd-darag-al-nahar": "☀️",
  "najd-safa-al-jabha": "💧",
};

const homePillars = PRODUCTS.map((p) => ({
  icon: HOME_PILLAR_ICON[p.slug] ?? "✨",
  problem: p.problemAr,
  desc: p.shortDescAr,
  slug: p.slug,
  product: p.nameAr,
}));

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
            ما يكفيّني مظهر العبوة — المهم أن كل منتج يشرح مشكل حقيقي: ثبات، حماية
            من الشمس، وخط الجبهة. مع نجد فهمت وش يخدم وجهي تحت الإيشارب والجو،
            والمجموعة واضحة، والدفع عند الاستلام يبسّط قراري.
          </p>
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="rounded-full bg-najd-green/20 px-3 py-1 text-xs text-najd-green">
              مشتري مؤكد
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-stone font-medium">سارة العتيبي</p>
                <p className="text-muted text-xs">٢١ سنة · الخبر</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-najd-green text-warm-sand">
                س
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
            محورنا مستحضرات وجه للبنات في السعودية تحت الإيشارب والحرّ والتكييف:
            تركيبات موضّحة، أوقات استخدام واقعية، وتوسّع تدريجي — من غير ما نخسر
            الثقة أو نكثّر الضجيج.
          </p>
        </motion.div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            ["متجر عام", "عشرات المنتجات بدون تركيز"],
            ["نجد", "عناية بالبشرة أولاً، ومجموعة تكبر مع الوقت"],
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
      {/* ── Hero — خلفية ناعمة + طبقات زجاجية (مستوحاة من نمط المتاجر الراقية) ── */}
      <section className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f18] via-deep-night to-deep-night" />
        <div className="absolute inset-0 bg-gradient-to-br from-najd-green/25 via-transparent to-warm-sand/[0.07]" />
        <div className="absolute top-0 right-0 h-[28rem] w-[28rem] rounded-full bg-najd-green/15 blur-3xl translate-x-1/4 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 h-[22rem] w-[22rem] rounded-full bg-warm-sand/10 blur-3xl -translate-x-1/3 translate-y-1/4" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(255,255,255,0.06),transparent_55%)]" />

        <div className="relative w-full max-w-7xl xl:max-w-[90rem] 2xl:max-w-[96rem] mx-auto px-4 sm:px-6 py-12 md:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.32fr)] md:gap-x-10 lg:gap-x-12 xl:gap-x-14 items-stretch md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-none mt-8 md:mt-0 rounded-[24px] border border-white/[0.14] bg-white/[0.045] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-2xl backdrop-saturate-150 sm:rounded-[28px] sm:p-7 md:rounded-[32px] md:p-8 md:shadow-[0_32px_100px_-28px_rgba(0,0,0,0.7)]"
          >
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 backdrop-blur-md">
                <span className="text-amber-100/90 text-xs font-semibold">
                  وجه تحت الإيشارب والجو — خط كوزميتيك من نجد
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-najd-green/35 bg-najd-green/[0.12] px-3.5 py-1.5 backdrop-blur-md">
                <span className="w-2 h-2 shrink-0 bg-warm-sand rounded-full animate-pulse shadow-[0_0_8px_rgba(232,185,168,0.65)]" />
                <span className="text-stone/95 text-xs font-medium">
                  الدفع عند الاستلام داخل السعودية
                </span>
              </div>
            </div>

            <h1 className="mb-3 space-y-2 drop-shadow-sm">
              <span className="block text-warm-sand text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.65rem] md:leading-tight">
                نجد
              </span>
              <span className="block max-w-[22rem] text-balance text-stone/95 text-[0.95rem] leading-snug sm:max-w-xl sm:text-base md:max-w-lg md:text-lg md:leading-relaxed">
                ثبات للمكياج، حماية نهارية، وتهيئة خط الجبهة — عناية موضّعة بلا
                تعقيد، وثقة مع نجد من أول مرة.
              </span>
            </h1>
            <p className="text-muted text-base md:text-lg mb-2 leading-relaxed">
              ثلاثة منتجات في خط واحد: برايمر ثبات، واقي وجه SPF خفيف، وسيروم موضّع
              للجبهة وخط الإيشارب — بلغة تجميلية واضحة على العبوّة، بدون ادِّعاء طبي.
              مع الوقت نزيد إصدارات جديدة بنفس المعيار.
            </p>
            <p className="text-warm-sand/85 text-sm mb-8 leading-relaxed">
              بشرة أولاً · شفافية في الوصف · جودة تعبئة مدروسة · توصيل خلال 2–4
              أيام عمل داخل السعودية
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="bg-najd-green text-white px-8 py-4 rounded-btn text-base hover:bg-najd-green/85 transition-colors text-center shadow-lg shadow-najd-green/25"
              >
                استكشف مجموعة نجد
              </Link>
              <Link
                href="/products/najd-thabat-al-khat"
                className="border border-white/20 bg-white/[0.06] text-stone px-8 py-4 rounded-btn text-base backdrop-blur-sm hover:bg-white/[0.1] transition-colors text-center"
              >
                ابدئي بثبات الخط
              </Link>
              <Link
                href="#routine"
                className="border border-white/12 bg-transparent text-muted px-8 py-4 rounded-btn text-base hover:bg-white/[0.05] hover:text-stone transition-colors text-center sm:px-6"
              >
                قارن المنتجات
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
              <div className="flex -space-x-2 space-x-reverse">
                {["س", "د", "ر", "ن"].map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-najd-green/90 border-2 border-white/15 flex items-center justify-center shadow-sm"
                  >
                    <span className="text-warm-sand text-xs font-bold">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-stone/80 text-sm">+2,400 طلب داخل السعودية</p>
            </div>
          </motion.div>

          {/* Hero: بانر المجموعة — إطار زجاجي فوق الخلفية */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 md:order-none w-full md:min-w-0 flex justify-center md:justify-end"
          >
            <div className="w-[calc(100%+1.5rem)] max-w-none -mx-3 sm:w-full sm:max-w-xl sm:mx-auto md:max-w-none md:w-full md:mx-0">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.16] bg-white/[0.06] p-2 pb-2 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.72)] backdrop-blur-2xl backdrop-saturate-150 sm:rounded-[26px] sm:p-3 md:rounded-[32px] md:p-4 md:pb-3 lg:p-5 lg:pb-4 md:shadow-[0_40px_110px_-24px_rgba(0,0,0,0.78)]">
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-najd-green/[0.08]"
                  aria-hidden
                />

                <Link
                  href="/products"
                  className="relative z-10 flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-gradient-to-br from-najd-green/35 via-deep-night to-charcoal px-8 py-16 transition duration-300 hover:border-warm-sand/35 hover:shadow-[0_0_40px_-10px_rgba(199,91,126,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-sand md:min-h-[280px] md:rounded-2xl"
                >
                  <div className="text-center">
                    <span className="text-6xl md:text-7xl drop-shadow-lg" aria-hidden>
                      🧴
                    </span>
                    <p className="mt-5 text-lg font-semibold text-stone md:text-xl">
                      خط الإيشارب والجو
                    </p>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                      برايمر، واقي نهاري، وسيروم موضّع — عبوّة مهيَّأة ومعلومات
                      واضحة على التغليف
                    </p>
                  </div>
                  <span className="pointer-events-none absolute -left-16 top-12 h-40 w-40 rounded-full bg-warm-sand/15 blur-3xl" />
                  <span className="pointer-events-none absolute -right-12 bottom-0 h-36 w-36 rounded-full bg-najd-green/30 blur-3xl" />
                </Link>

                {/* تحت الصورة: تباين قوي (ما فوق البانر الأبيض) */}
                <div className="relative z-20 mt-2 flex flex-wrap items-stretch justify-between gap-2 sm:mt-2.5 md:mt-3">
                  <div className="min-w-0 flex-1 rounded-xl border border-warm-sand/25 bg-deep-night/92 px-2.5 py-2 shadow-md backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-2">
                    <p className="text-right text-[10px] leading-snug text-warm-sand sm:text-[11px]">
                      <span className="text-warm-sand" aria-hidden>
                        ★★★★★
                      </span>
                    </p>
                    <p className="text-right text-[11px] text-stone mt-0.5 sm:text-xs">
                      تقييم العملاء ٤٫٨ من ٥
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 rounded-xl border border-najd-green/35 bg-deep-night/92 px-2.5 py-2 shadow-md backdrop-blur-sm sm:rounded-2xl sm:px-3 sm:py-2">
                    <p className="text-right text-[11px] text-stone sm:text-xs">
                      الدفع عند الاستلام
                    </p>
                    <p className="text-right text-[10px] text-muted mt-0.5 leading-snug sm:text-[11px]">
                      بدون بطاقة — تسليم يد بيد
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
            ابدئي من مشكلة وجهك اليوم
          </h2>
          <p className="text-muted">
            كل صنف يشرح مشكلة وجه حقيقية تحت الإيشارب والجو — والقائمة تتوسع دون
            تعقيد على الاختيار.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {homePillars.map((item, i) => (
            <motion.div
              key={item.slug}
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
              مجموعة نجد الحالية
            </h2>
            <p className="text-muted">
              ثبات، حماية نهارية، وتهيئة موضّعة لخط الجبهة — إصدارات جديدة بنفس
              المعيار لاحقاً
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            معيار نجد: البشرة أولاً
          </h2>
          <p className="text-muted">
            أي منتج جديد يمر على نفس القواعد قبل ما يظهر لك
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🧴",
              title: "بشرة أولاً، لا مفاجآت",
              desc: "نركّز على ملاءمة التركيبة للجو المحلي ووضوح المكوّنات وبساطة الاستخدام قبل الخروج وبعد العناية.",
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
            اختَر خطك من المجموعة
          </h2>
          <p className="text-muted">
            نفس القائمة تكبر — ارجع هنا أي وقت لمطابقة منتج جديد مع احتياجك
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          اطلبي خط نجد اليوم
        </h2>
        <p className="text-muted text-lg mb-8">
          ثلاثة منتجات للوجه تحت الإيشارب والحرّ — جرّبي نجد اليوم، والدفع عند
          الاستلام.
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
