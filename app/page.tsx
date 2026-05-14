"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrustBar } from "@/components/common/TrustBar";
import { ProductCard } from "@/components/common/ProductCard";
import { ReviewCard } from "@/components/common/ReviewCard";
import { PRODUCTS } from "@/config/products";
import { useState } from "react";
import {
  ChevronDown,
  ShoppingBag,
  PhoneCall,
  PackageCheck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const HOME_FAQS = [
  {
    q: "هل عندكم ضمان استرجاع؟",
    a: "نعم، ضمان رضا ٣٠ يوم. إذا ما لاحظتي فرقاً مع روتين نجد، تواصلي معنا ونرجّع لكِ المبلغ كاملاً بدون أسئلة.",
  },
  {
    q: "هل الدفع عند الاستلام متاح؟",
    a: "نعم، الدفع يكون عند استلام الطلب — بدون بطاقة ولا حساب. اسمكِ ورقم جوالكِ فقط لتأكيد الطلب.",
  },
  {
    q: "كم يستغرق التوصيل؟",
    a: "٢–٤ أيام عمل داخل جميع مدن المملكة العربية السعودية. تتلقّين رسالة تأكيد فور خروج الطلب من المخزن.",
  },
  {
    q: "هل المنتجات مناسبة للبشرة الحساسة؟",
    a: "نوصي بالبدء بكمية صغيرة ومراقبة تفاعل بشرتكِ، مع اختبار رقعة خلف الأذن قبل أول استخدام كامل. كل منتج له تعليمات استخدام محددة على العبوة.",
  },
  {
    q: "هل ستضيفون منتجات جديدة؟",
    a: "نعم. مجموعة نجد تتوسع بمراحل؛ أي إصدار جديد يُعرَض هنا بعد ما يمر على نفس معايير الشفافية وعناية البشرة.",
  },
  {
    q: "هل يمكن طلب أكثر من منتج؟",
    a: "نعم، يمكنكِ إضافة أي منتج للسلة وإتمام طلب واحد يصلكِ بشحنة واحدة — مع نفس ضمان الـ٣٠ يوم.",
  },
  {
    q: "كيف أتواصل مع الدعم؟",
    a: "عبر واتساب. فريقنا يرد خلال ساعات أيام العمل ويساعدكِ في اختيار الصنف المناسب لكِ.",
  },
];

const ORDER_STEPS = [
  {
    num: "١",
    icon: ShoppingBag,
    title: "اختاري روتينكِ",
    desc: "ثلاثة منتجات تستهدف ثلاث حاجات: ثبات المكياج، حماية النهار، وتهيئة خط الجبهة. اختاري وحدة أو الخط كامل.",
  },
  {
    num: "٢",
    icon: PhoneCall,
    title: "أكّدي طلبكِ (بدون دفع)",
    desc: "اسمكِ ورقم جوالكِ فقط. فريقنا بيتواصل معكِ لتأكيد العنوان قبل الشحن — بدون بطاقة ولا التزام.",
  },
  {
    num: "٣",
    icon: PackageCheck,
    title: "استلمي وادفعي",
    desc: "نوصل الطلب لباب بيتكِ خلال ٢–٤ أيام عمل داخل المملكة، والدفع نقد أو مدى وقت الاستلام.",
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
              className="bg-charcoal rounded-2xl border border-stone/10 overflow-hidden"
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
  "face-primer": "✨",
  "face-sunscreen-spf50": "☀️",
  "forehead-serum": "💧",
};

const homePillars = PRODUCTS.map((p) => ({
  icon: HOME_PILLAR_ICON[p.slug] ?? "✨",
  problem: p.problemAr,
  desc: p.shortDescAr,
  slug: p.slug,
  product: p.nameAr,
  displayTagline: p.displayTaglineAr,
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
          <div className="mt-6 flex items-center justify-between border-t border-stone/10 pt-5">
            <span className="rounded-full bg-najd-green/20 px-3 py-1 text-xs text-najd-green">
              مشتري مؤكد
            </span>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-stone font-medium">سارة العتيبي</p>
                <p className="text-muted text-xs">٢١ سنة · الخبر</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-najd-green text-white shadow-sm">
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
                  : "border-stone/10 bg-charcoal/60"
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
      {/* ── Hero — هيكل Nama Beauty + ألوان Najd (cream + rose) ── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(194,70,111,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute top-0 -left-32 h-72 w-72 rounded-full bg-najd-green/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-24 h-64 w-64 rounded-full bg-warm-sand/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-2 md:order-none text-right"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-najd-green/25 bg-najd-green/[0.08] px-3.5 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-najd-green" />
              <span className="text-[11px] font-semibold text-najd-green">
                صيدلية الجمال السعودية · مرخّصة SFDA
              </span>
            </div>

            <h1 className="mb-5 space-y-1.5">
              <span className="block text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.15] text-stone">
                كوزميتيك سعودي
              </span>
              <span className="block text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.15] text-najd-green">
                للوجه تحت الإيشارب والجو
              </span>
            </h1>

            <p className="mb-6 max-w-xl text-base md:text-[1.05rem] leading-relaxed text-muted">
              ثلاث منتجات سعودية مدروسة — برايمر يثبّت المكياج، واقٍ SPF بملمس
              أخف، وسيروم موضّع للجبهة. لغة كوزميتيك واضحة على العبوة، توصيل
              داخل المملكة، والدفع عند الاستلام.
            </p>

            <div className="mb-7 flex flex-wrap gap-2">
              {[
                { label: "SFDA", sub: "مرخّص" },
                { label: "COD", sub: "دفع عند الاستلام" },
                { label: "٢–٤ أيام", sub: "توصيل" },
                { label: "٣٠ يوم", sub: "ضمان" },
              ].map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2 rounded-full border border-warm-sand/25 bg-ink/85 px-3 py-1.5 shadow-sm"
                >
                  <strong
                    className="font-latin text-[11px] font-bold text-najd-green"
                    dir="ltr"
                  >
                    {chip.label}
                  </strong>
                  <span className="text-[11px] text-stone/75">{chip.sub}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-btn bg-najd-green px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-najd-green/25 transition hover:bg-najd-green/90"
              >
                اكتشفي مجموعة نجد
              </Link>
              <Link
                href="#routine"
                className="inline-flex items-center gap-2 rounded-full border border-najd-green/30 bg-najd-green/[0.06] px-5 py-2.5 text-sm font-semibold text-najd-green transition hover:bg-najd-green/[0.12]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-najd-green text-white">
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
                قارني المنتجات
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2 space-x-reverse">
                {["س", "د", "ر", "ن"].map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-najd-green border-2 border-deep-night shadow-sm"
                  >
                    <span className="text-white text-xs font-bold">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <strong className="text-stone">+٢٬٤٠٠ طلب</strong> داخل المملكة
              </p>
            </div>
          </motion.div>

          {/* Hero: بانر المجموعة — إطار زجاجي فوق الخلفية */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-none"
          >
            <div className="relative overflow-hidden rounded-[28px] border border-warm-sand/20 bg-charcoal shadow-[0_28px_70px_-24px_rgba(120,50,70,0.18)]">
              <div className="pointer-events-none absolute inset-2 z-20 rounded-[22px] border border-najd-green/10" />

              <div className="relative aspect-[5/6] md:aspect-[4/5]">
                  <Image
                    src="/brand/lineup-hero.png"
                    alt="خط الإيشارب والجو — برايمر، واقي نهاري، وسيروم موضّع"
                    fill
                    priority
                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                <div className="absolute inset-x-0 top-0 z-20 px-5 pt-5 md:px-6 md:pt-6 text-center">
                  <span
                    className="block font-latin text-base md:text-lg font-bold tracking-[0.35em] text-stone/85 drop-shadow-sm"
                    dir="ltr"
                  >
                    NAJD
                  </span>
                  <span className="mt-1 block text-[11px] md:text-xs text-stone/65 drop-shadow-sm">
                    للعناية بالوجه
                  </span>
                </div>
              </div>

              {/* SFDA badge — Nama-style ribbon */}
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-30 flex items-center gap-2 rounded-2xl border border-najd-green/20 bg-white/95 px-3 py-2 shadow-[0_6px_18px_-6px_rgba(120,50,70,0.25)] backdrop-blur-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-najd-green/15 text-najd-green">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight text-right">
                  <span
                    className="font-latin text-[9px] font-bold uppercase tracking-[0.15em] text-najd-green"
                    dir="ltr"
                  >
                    SFDA Licensed
                  </span>
                  <span className="text-[11px] font-medium text-stone">
                    مرخّص من الغذاء والدواء
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-warm-sand/25 bg-ink px-3 py-2.5 shadow-sm">
                <p className="text-warm-sand text-sm leading-none" aria-hidden>
                  ★★★★★
                </p>
                <p className="mt-1 text-[11px] text-stone">
                  تقييم العملاء ٤٫٨ من ٥
                </p>
              </div>
              <div className="rounded-2xl border border-najd-green/25 bg-ink px-3 py-2.5 shadow-sm">
                <p className="text-[12px] font-semibold text-stone">
                  الدفع عند الاستلام
                </p>
                <p className="mt-0.5 text-[11px] text-muted leading-snug">
                  بدون بطاقة — تسليم يد بيد
                </p>
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
              className="bg-charcoal rounded-card border border-stone/10 p-6 hover:border-warm-sand/30 transition-colors group"
            >
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <p className="text-najd-green text-sm font-semibold mb-1">
                {item.displayTagline}
              </p>
              <h3 className="text-stone font-bold text-xl mb-2">{item.product}</h3>
              <p className="text-muted text-sm leading-relaxed mb-1">{item.problem}</p>
              <p className="text-muted text-sm leading-relaxed mb-4 opacity-90">
                {item.desc}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-warm-sand text-sm font-semibold hover:underline"
                >
                  اطّلعي على {item.product} ←
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

      {/* ── Brand Standard — 4 Pillars ── */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <motion.div {...fadeUp} className="text-center mb-12">
          <p className="text-warm-sand text-sm mb-2">ليش نجد</p>
          <h2 className="text-stone font-bold text-3xl md:text-4xl mb-3">
            خط متخصص، مو رفّ من العشرات
          </h2>
          <p className="text-muted max-w-xl mx-auto leading-7">
            نجد مبني على أربعة أركان لا نتنازل عنها: التخصص، الشفافية، فحص قبل
            الشحن، وراحة العميلة السعودية.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {[
            {
              icon: "🧴",
              title: "كوزميتيك متخصص للوجه",
              desc: "خط واحد للوجه تحت الإيشارب والجو المحلي — مستحضرات تجميلية خارجية بلغة واضحة وبدون ادِّعاء طبي.",
              accent: "from-najd-green/25 to-najd-green/5",
            },
            {
              icon: "📋",
              title: "شفافية في الوصف",
              desc: "كل منتج يشرح المشكلة الحقيقية ووقت الاستخدام والكمية المناسبة — بدون وعود غير واقعية أو إعلانات مبالغ فيها.",
              accent: "from-warm-sand/25 to-warm-sand/5",
            },
            {
              icon: "✅",
              title: "فحص جودة قبل الشحن",
              desc: "كل طلب يمرّ بفحص عبوّة وتغليف قبل الخروج من المخزن — مهيَّأ ليصلكِ سليماً.",
              accent: "from-success/25 to-success/5",
            },
            {
              icon: "🇸🇦",
              title: "راحة العميلة السعودية",
              desc: "الدفع عند الاستلام، توصيل ٢–٤ أيام لجميع المناطق، دعم واتساب، وضمان استرجاع ٣٠ يوم.",
              accent: "from-najd-green/25 to-warm-sand/10",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-warm-sand/15 bg-charcoal/85 p-6 transition-colors hover:border-warm-sand/35"
            >
              <div
                className={`pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.accent} blur-2xl opacity-70`}
                aria-hidden
              />
              <div className="relative flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-warm-sand/20 bg-charcoal/70 text-2xl">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-stone font-bold text-lg mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
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
                <div className="bg-charcoal rounded-card border border-stone/10 p-6 hover:border-najd-green/60 transition-colors group cursor-pointer">
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

      {/* ── How to Order — 3 Steps ── */}
      <section className="py-16 bg-deep-night border-y border-warm-sand/10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-warm-sand text-sm mb-2">طريقة الطلب</p>
            <h2 className="text-stone font-bold text-3xl md:text-4xl mb-3">
              من الطلب لباب بيتكِ في ٣ خطوات
            </h2>
            <p className="text-muted max-w-xl mx-auto leading-7">
              بدون دفع أونلاين · بدون التزام · بدون مخاطرة
            </p>
          </motion.div>

          <div className="relative grid gap-5 md:grid-cols-3 md:gap-6">
            <div className="pointer-events-none absolute right-[16.66%] left-[16.66%] top-[3.5rem] hidden h-px bg-gradient-to-l from-transparent via-warm-sand/30 to-transparent md:block" />

            {ORDER_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="relative rounded-2xl border border-warm-sand/15 bg-charcoal/70 p-6 text-center backdrop-blur-sm"
                >
                  <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-najd-green text-white shadow-[0_8px_30px_-12px_rgba(194,70,111,0.55)]">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                    <span className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full border border-warm-sand/40 bg-deep-night text-xs font-bold text-warm-sand">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-stone font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...fadeUp} className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-btn bg-najd-green px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-najd-green/85 shadow-lg shadow-najd-green/25"
            >
              ابدئي طلبكِ الآن
            </Link>
            <p className="text-muted text-xs mt-3">
              ضمان استرجاع ٣٠ يوم · شحن داخل السعودية
            </p>
          </motion.div>
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
          className="inline-block bg-warm-sand text-deep-night px-10 py-4 rounded-btn font-bold text-lg hover:bg-warm-sand/80 transition-colors shadow-lg shadow-warm-sand/15"
        >
          تسوق الآن
        </Link>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-warm-sand">✓</span> ضمان استرجاع ٣٠ يوم
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-warm-sand">✓</span> الدفع عند الاستلام
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-warm-sand">✓</span> شحن داخل السعودية
          </span>
        </div>
      </motion.section>
    </div>
  );
}
