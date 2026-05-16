"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  CreditCard,
  HandHeart,
  Headphones,
  MapPin,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { getOrder } from "@/lib/api";
import { trackPurchase, generateEventId } from "@/lib/tracking";
import { SITE_CONFIG } from "@/config/site";
import { PRODUCT_MAP, PRODUCTS } from "@/config/products";
import { CallWindowBanner } from "@/components/thank-you/CallWindowBanner";
import { ThankYouSuggestions } from "@/components/thank-you/ThankYouSuggestions";

const cream = "#fbf6f0";
const ink = "#1d1416";
const subtle = "#6f5f63";

const TRUST_BADGES = [
  { Icon: BadgeCheck, label: "مرخّص SFDA" },
  { Icon: Truck, label: "شحن داخل المملكة" },
  { Icon: CreditCard, label: "الدفع عند الاستلام" },
  { Icon: ShieldCheck, label: "ضمان ٣٠ يوم" },
  { Icon: Headphones, label: "دعم واتساب" },
] as const;

const TIMELINE_STEPS = [
  {
    tag: "الآن",
    Icon: CheckCircle2,
    title: "استلمنا طلبك",
    desc: "حُجز المخزون باسمك — لا حاجة لأي دفع على الموقع.",
    tone: "bg-najd-green text-white",
  },
  {
    tag: "خلال دقائق",
    Icon: PhoneCall,
    title: "مكالمة تأكيد العنوان",
    desc: "نأخذ منكِ الحيّ والشارع وأقرب نقطة معروفة — أسرع وأدقّ من الكتابة.",
    tone: "bg-najd-green/15 text-najd-green",
  },
  {
    tag: "٢–٤ أيام",
    Icon: PackageCheck,
    title: "تسليم عند الباب",
    desc: "ادفعي للمندوب نقداً أو بمدى وقت الاستلام — حسب توفّر الناقل.",
    tone: "bg-warm-sand/15 text-warm-sand",
  },
  {
    tag: "بعد ~أسبوع",
    Icon: Sparkles,
    title: "لاحظي الفرق",
    desc: "ثبات أهدأ في المكياج وإحساس أخف تحت الإيشارب مع الاستخدام المنتظم.",
    tone: "bg-stone/10 text-stone",
  },
] as const;

const COD_FAQS = [
  {
    q: "ما هي الساعات اللي تتصلون فيها؟",
    a: "نتصل من الساعة ٩ صباحاً حتى ٩ مساءً بتوقيت السعودية. إذا طلبتِ خارج هذه الساعات، نتصل في أول يوم عمل صباحاً.",
  },
  {
    q: "ماذا لو فاتني الاتصال؟",
    a: "نعاود الاتصال خلال ساعة، أو راسلينا على واتساب برقم الطلب وسنرتّب وقتاً يناسبك — الطلب يبقى محجوزاً.",
  },
  {
    q: "كم تستغرق المكالمة؟",
    a: "دقيقة إلى دقيقتين فقط — للتأكد من العنوان وموعد التسليم المناسب لكِ.",
  },
  {
    q: "هل يمكنني تعديل الطلب أو إضافة منتج؟",
    a: "نعم — يمكنكِ إخبار ممثل الخدمة وقت الاتصال، أو مراسلتنا على واتساب قبل الشحن.",
  },
  {
    q: "هل يمكنني تغيير العنوان لاحقاً؟",
    a: "ممكن قبل تسليم الشحنة للناقل. تواصلي بسرعة على واتساب برقم الطلب لتعديل العنوان قبل أن يخرج.",
  },
] as const;

function purchaseEventIdForOrder(orderNumber: string): string {
  if (typeof window === "undefined") {
    return generateEventId("purchase_confirmed");
  }
  const key = `najd_purchase_eid_${orderNumber}`;
  const stored = sessionStorage.getItem(key);
  if (stored) {
    sessionStorage.removeItem(key);
    return stored;
  }
  return generateEventId("purchase_confirmed");
}

/** Image + display name resolution from product slug, falling back to backend data. */
function resolveProductMedia(slug: string) {
  const cfg = PRODUCT_MAP[slug];
  return {
    image: cfg?.imageSrc,
    imageAlt: cfg?.imageAlt,
    objectFit: cfg?.imageObjectFit ?? "cover",
    displayTagline: cfg?.displayTaglineAr,
    nameOverride: cfg?.nameAr,
  };
}

export default function ThankYouPage() {
  const raw = useParams()?.orderId;
  const orderId = useMemo(() => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return v ? decodeURIComponent(String(v)) : "";
  }, [raw]);

  const { data: order, isPending, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    retry: 2,
    enabled: orderId.length > 0,
  });

  const displayNumber = useMemo(
    () => (order?.order_number ? order.order_number : orderId),
    [order?.order_number, orderId]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    if (order.is_test_order) return;
    const eventId = purchaseEventIdForOrder(order.order_number);
    trackPurchase(
      {
        id: order.order_id,
        total: order.total_sar,
        items: order.items.map((item) => ({
          slug: item.product_slug,
          qty: item.quantity,
          price: item.unit_price_sar,
        })),
      },
      eventId
    );
  }, [order]);

  if (!orderId) {
    return (
      <ThankYouShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="text-lg text-[#111827]">رابط صفحة الشكر غير صحيح.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-[14px] bg-najd-green px-6 py-3 text-sm text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </ThankYouShell>
    );
  }

  if (isPending) {
    return (
      <div
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20"
        style={{ backgroundColor: cream, color: ink }}
      >
        <div
          className="h-11 w-11 animate-spin rounded-full border-2 border-najd-green border-t-transparent"
          aria-hidden
        />
        <p className="mt-5 text-sm" style={{ color: subtle }}>
          جاري تحميل تفاصيل طلبك...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <ThankYouShell>
        <div className="mx-auto max-w-lg px-4 py-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-najd-green/10">
            <Sparkles className="h-8 w-8 text-najd-green" aria-hidden />
          </div>
          <h1 className="text-2xl font-medium text-[#111827] md:text-3xl">
            تم استلام طلبك
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: subtle }}>
            رقم الطلب:{" "}
            <span className="font-mono text-najd-green dir-ltr">{orderId}</span>
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed" style={{ color: subtle }}>
            سيتواصل فريقنا معكِ قريباً لتأكيد العنوان قبل الشحن. إذا احتجتِ
            تعديل أو سؤال، راسلينا على واتساب برقم الطلب.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row-reverse">
            <Link
              href="/"
              className="rounded-[14px] bg-najd-green px-8 py-3.5 text-sm font-medium text-white transition hover:bg-najd-green/90"
            >
              العودة للرئيسية
            </Link>
            <a
              href={SITE_CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-najd-green/25 bg-white px-8 py-3.5 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#FAFAF8]"
            >
              <MessageCircle className="h-4 w-4 text-najd-green" />
              واتساب
            </a>
          </div>
        </div>
      </ThankYouShell>
    );
  }

  const orderedSlugs = order.items.map((i) => i.product_slug);
  const subtotal = order.items.reduce((s, i) => s + i.line_total_sar, 0);
  const showsCompare = subtotal < order.items.length * 199 * 1.5;
  const compareAtTotal = order.items.reduce(
    (s, i) => s + (i.quantity >= 2 ? i.quantity * 199 : i.line_total_sar),
    0
  );
  const savings = Math.max(0, compareAtTotal - order.total_sar);

  /* Social-proof reviews pulled from real product config (not invented testimonials). */
  const socialReviews = PRODUCTS.flatMap((p) =>
    p.reviews.slice(0, 1).map((r) => ({ ...r, productNameAr: p.nameAr }))
  ).slice(0, 3);

  return (
    <ThankYouShell>
      {/* ─────────── Confirmation hero ─────────── */}
      <div className="border-b border-black/[0.06] bg-white/80">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <p className="mb-4 font-latin text-[11px] font-medium uppercase tracking-[0.22em] text-najd-green/90">
              NAJD · تم استلام الطلب
            </p>

            {order.is_test_order ? (
              <div className="mb-5 max-w-lg rounded-2xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-right text-sm text-amber-950 shadow-sm">
                <p className="font-medium">طلب تجريبي (رقم اختبار)</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900/90">
                  لن يُرسل هذا الطلب إلى جدول المبيعات أو منصات الإعلانات.
                  استخدميه للتجربة فقط؛ تجاهليه في التقارير والعمليات.
                </p>
              </div>
            ) : null}

            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-4 py-2 text-sm shadow-sm"
              style={{ backgroundColor: cream }}
            >
              <PackageCheck className="h-4 w-4 text-najd-green" aria-hidden />
              <span className="font-mono dir-ltr tracking-tight text-najd-green">
                {displayNumber}
              </span>
            </div>

            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5EF] shadow-inner">
              <motion.span
                aria-hidden
                initial={{ scale: 0, opacity: 0.45 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-najd-green/30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <CheckCircle2
                  className="relative h-11 w-11 text-najd-green"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </motion.div>
            </div>

            <h1 className="max-w-xl text-3xl font-medium leading-snug text-[#111827] md:text-[40px]">
              شكراً لكِ،{" "}
              <span className="text-najd-green">{order.customer_name}</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: subtle }}
            >
              طلبك مؤكّد ومحجوز باسمك. الخطوة الوحيدة الباقية{" "}
              <strong className="text-stone">مكالمة قصيرة لتأكيد العنوان</strong>{" "}
              — بعدها يخرج طلبك للشحن داخل المملكة.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {TRUST_BADGES.map(({ Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-2 text-[11px] text-[#374151] shadow-sm sm:text-xs"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-najd-green" aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─────────── Body sections ─────────── */}
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:space-y-10 md:py-14">
        {/* 1) The single most-important conversion driver: call-window banner. */}
        <CallWindowBanner
          orderCreatedAt={order.created_at}
          phoneLast4={order.phone_last4}
        />

        {/* 2) Personal verification card — name + phone + address prep. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-[22px] border border-stone/10 bg-white p-5 text-right shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-najd-green/10 px-3 py-1 text-[11px] text-najd-green">
              <PhoneCall className="h-3.5 w-3.5" aria-hidden />
              ستصلكِ المكالمة على
            </div>
            <p className="text-sm leading-relaxed text-stone">
              الجوّال المنتهي بـ{" "}
              <span className="rounded-md bg-najd-green/10 px-2 py-0.5 text-base font-medium tabular-nums text-najd-green">
                {order.phone_last4 ?? "****"}
              </span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              لو هذا الرقم غير صحيح، راسلينا على واتساب بسرعة بقم الطلب لتعديله
              قبل خروج الطلب.
            </p>
          </div>
          <div className="rounded-[22px] border border-stone/10 bg-white p-5 text-right shadow-sm">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-warm-sand/15 px-3 py-1 text-[11px] text-warm-sand">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              جهّزي عنوانك للمكالمة
            </div>
            <ul className="space-y-1.5 text-sm leading-relaxed text-stone">
              <li>• المدينة والحيّ</li>
              <li>• اسم الشارع أو أقرب نقطة معروفة</li>
              <li>• ملاحظة مختصرة (دور، رقم شقة، إلخ)</li>
            </ul>
          </div>
        </motion.section>

        {/* 3) What happens now — 4-step timeline. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] md:p-9"
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-medium text-najd-green">ماذا يحدث الآن</p>
            <h2 className="mt-1 text-xl font-medium text-stone md:text-2xl">
              من الطلب إلى بشرة مرتاحة تحت الإيشارب
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              خطوات قصيرة وواضحة — من غير دفع مسبق وبدون التزام.
            </p>
          </div>

          <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.Icon;
              return (
                <li
                  key={step.title}
                  className="relative flex flex-col gap-3 rounded-2xl border border-stone/[0.06] bg-[#FAFAF8] p-5 text-right"
                >
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${step.tone}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="inline-block w-fit rounded-full border border-stone/10 bg-white px-2 py-0.5 text-[10px] text-muted">
                    {step.tag}
                  </span>
                  <h3 className="text-sm font-medium text-stone">
                    {idx + 1}. {step.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        </motion.section>

        {/* 4) Redesigned order summary — un-stuffed prices, thumbnails, clear columns. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(17,24,39,0.06)]"
        >
          <header className="flex flex-col gap-2 border-b border-black/[0.06] bg-[#FAFAF8] px-6 py-5 text-right sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-stone">ملخّص طلبك</h2>
              <p className="text-xs text-muted">
                الإجمالي يُدفع للمندوب عند الاستلام — لا شيء على الموقع
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-najd-green/20 bg-white px-3 py-1.5 text-xs">
              <span className="text-muted">رقم الطلب</span>
              <span className="font-mono text-najd-green dir-ltr">
                #{order.order_number}
              </span>
            </span>
          </header>

          <ul className="divide-y divide-stone/[0.06]">
            {order.items.map((item, i) => {
              const media = resolveProductMedia(item.product_slug);
              const displayName = media.nameOverride || item.product_name_ar;
              const fit = media.objectFit;
              return (
                <li
                  key={`${item.product_slug}-${i}`}
                  className="grid grid-cols-[64px,1fr,auto] items-center gap-4 px-6 py-5 sm:grid-cols-[88px,1fr,auto] sm:gap-5"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone/10 bg-charcoal/40">
                    {media.image ? (
                      <Image
                        src={media.image}
                        alt={media.imageAlt || displayName}
                        fill
                        sizes="88px"
                        className={
                          fit === "contain"
                            ? "object-contain p-1.5"
                            : "object-cover"
                        }
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-lg text-warm-sand">
                        {displayName[0]}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 text-right">
                    {item.is_upsell ? (
                      <span className="mb-1 inline-block rounded-full bg-warm-sand/15 px-2 py-0.5 text-[10px] text-warm-sand">
                        عرض مميز
                      </span>
                    ) : media.displayTagline ? (
                      <span className="mb-1 inline-block text-[10px] text-najd-green/80">
                        {media.displayTagline}
                      </span>
                    ) : null}
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-stone">
                      {displayName}
                    </p>
                    <p className="mt-1 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted">
                      <span>
                        الكمية{" "}
                        <span className="font-medium tabular-nums text-stone">
                          {item.quantity}
                        </span>
                      </span>
                      <span aria-hidden className="text-stone/30">
                        ·
                      </span>
                      <span className="tabular-nums">
                        {item.unit_price_sar} ر.س / وحدة
                      </span>
                    </p>
                  </div>

                  <div className="text-end">
                    <p className="text-[10px] uppercase tracking-wide text-muted">
                      إجمالي السطر
                    </p>
                    <p className="mt-0.5 text-base font-medium tabular-nums text-najd-green sm:text-lg">
                      {item.line_total_sar}
                      <span className="mr-1 text-[11px] text-muted">ر.س</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-stone/[0.06] bg-[#FAFAF8] px-6 py-5">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">المجموع الفرعي</dt>
                <dd className="tabular-nums text-stone">
                  {subtotal} <span className="text-xs text-muted">ر.س</span>
                </dd>
              </div>
              {showsCompare && savings > 0 ? (
                <div className="flex items-center justify-between text-warm-sand">
                  <dt>توفيرك مع عروض الكميّة</dt>
                  <dd className="tabular-nums">
                    -{savings} <span className="text-xs">ر.س</span>
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt className="text-muted">الشحن</dt>
                <dd className="text-[12px] font-medium text-najd-green">
                  حسب المنطقة · ٢–٤ أيام عمل
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-col gap-4 border-t border-stone/[0.08] pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-right">
                <p className="text-xs text-muted">المبلغ المستحق عند الاستلام</p>
                <p className="mt-1 text-3xl font-medium tabular-nums text-stone md:text-4xl">
                  {order.total_sar}
                  <span className="mr-1 text-base text-muted">ر.س</span>
                </p>
              </div>
              <p className="max-w-[16rem] rounded-xl border border-najd-green/20 bg-white px-3 py-2 text-[11px] leading-relaxed text-stone">
                💳 لا نحتفظ ببطاقتك على الموقع. الدفع يتم{" "}
                <strong className="text-najd-green">مع المندوب وقت التسليم</strong>.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 5) Excitement / results section — what they'll feel after a week. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="overflow-hidden rounded-[28px] border border-najd-green/15 bg-gradient-to-br from-white via-[#fff6f8] to-[#fff0e6] p-6 md:p-9"
        >
          <div className="mb-7 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-najd-green/10 px-3 py-1 text-[11px] font-medium text-najd-green">
              <HandHeart className="h-3.5 w-3.5" aria-hidden />
              لحظة فتح العلبة
            </span>
            <h2 className="mt-3 text-xl font-medium text-stone md:text-2xl">
              ماذا تتوقعين بعد التسليم
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
              نتائج فردية تختلف من بشرة لأخرى — لكن البنات اللي بنيوا روتينهم
              مع نجد لاحظوا الفرق خلال أسبوع.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone/[0.06] bg-white/80 p-5 text-right shadow-sm">
              <span className="text-[11px] font-medium uppercase tracking-wide text-najd-green/80 font-latin">
                Day 1
              </span>
              <h3 className="mt-2 text-sm font-medium text-stone">
                روتين الصبح يتثبت
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                طبقة رقيقة قبل الفونداشن — تثبيت أوضح وإحساس أخف من واقيكِ
                السابق.
              </p>
            </div>
            <div className="rounded-2xl border border-stone/[0.06] bg-white/80 p-5 text-right shadow-sm">
              <span className="text-[11px] font-medium uppercase tracking-wide text-najd-green/80 font-latin">
                Day 3
              </span>
              <h3 className="mt-2 text-sm font-medium text-stone">
                المكياج ما يذوب وقت الدوام
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                لمعة أهدأ تحت التكييف، وخطّ الجبهة تحت الإيشارب ما يحتاج
                ترميمات متكررة.
              </p>
            </div>
            <div className="rounded-2xl border border-stone/[0.06] bg-white/80 p-5 text-right shadow-sm">
              <span className="text-[11px] font-medium uppercase tracking-wide text-najd-green/80 font-latin">
                Week 1
              </span>
              <h3 className="mt-2 text-sm font-medium text-stone">
                ثقة في الصورة
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                مظهر بشرة منتظم بدون «قناع» أبيض في الصور أو احمرار خفيف من
                الإيشارب.
              </p>
            </div>
          </div>
        </motion.section>

        {/* 6) Social proof — real reviews from product config. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] md:p-9"
        >
          <div className="mb-7 grid items-end gap-3 sm:grid-cols-[1fr,auto]">
            <div className="text-right">
              <p className="text-xs font-medium text-najd-green">
                لستِ وحدكِ
              </p>
              <h2 className="mt-1 text-xl font-medium text-stone md:text-2xl">
                +١٢٠٠ طلب داخل المملكة — تقييم ٤.٩
              </h2>
            </div>
            <div className="flex items-center justify-end gap-1 text-warm-sand">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-current" aria-hidden />
              ))}
              <span className="mr-1 text-sm text-stone">4.9</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {socialReviews.map((r) => (
              <figure
                key={`${r.name}-${r.city}`}
                className="rounded-2xl border border-stone/[0.06] bg-[#FAFAF8] p-5 text-right"
              >
                <div className="mb-3 flex items-center justify-end gap-0.5 text-warm-sand">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= r.rating ? "fill-current" : ""
                      }`}
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-stone">
                  {r.text}
                </blockquote>
                <figcaption className="mt-3 text-[11px] text-muted">
                  <span className="font-medium text-stone">{r.name}</span> · {r.city}
                  <span className="block text-[10px] text-najd-green/80">
                    عن {r.productNameAr.split(" ").slice(0, 4).join(" ")}…
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </motion.section>

        {/* 7) Cross-sell — only products NOT already in this order. */}
        <ThankYouSuggestions excludeSlugs={orderedSlugs} />

        {/* 8) COD-specific FAQ. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] md:p-9"
        >
          <div className="mb-6 text-right">
            <p className="text-xs font-medium text-najd-green">قبل المكالمة</p>
            <h2 className="mt-1 text-xl font-medium text-stone md:text-2xl">
              أسئلة سريعة عن مكالمة التأكيد والتسليم
            </h2>
          </div>
          <div className="divide-y divide-stone/[0.06]">
            {COD_FAQS.map((item, idx) => (
              <details
                key={item.q}
                className="group py-4 text-right"
                open={idx === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-stone">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-stone/15 text-najd-green transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </motion.section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone/[0.1] bg-white px-5 py-4 text-sm font-medium text-stone shadow-sm transition hover:bg-[#FAFAF8]"
          >
            <span>تصفّحي مجموعة نجد</span>
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone/[0.1] bg-white px-5 py-4 text-sm font-medium text-stone shadow-sm transition hover:bg-[#FAFAF8]"
          >
            <Calendar className="h-4 w-4 text-najd-green" aria-hidden />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        <p className="pb-8 text-center text-[11px] text-muted">
          آخر تحديث على ساعات الاتصال: ٩ صباحاً – ٩ مساءً بتوقيت السعودية —
          نلتزم بالاتصال خلال أقل من ١٠ دقائق ضمن هذه الساعات.
        </p>
      </div>

      {/* Mobile-only sticky WhatsApp pill — ensures the confirmation channel is always one tap away. */}
      <a
        href={SITE_CONFIG.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center gap-2 rounded-full bg-najd-green px-5 py-3.5 text-sm font-medium text-white shadow-[0_18px_40px_rgba(194,70,111,0.35)] md:hidden"
        aria-label="افتحي واتساب نجد"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        واتساب نجد — تعديل أو سؤال
      </a>
    </ThankYouShell>
  );
}

function ThankYouShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen pb-20 font-sans md:pb-0"
      style={{ backgroundColor: cream, color: ink }}
    >
      {children}
    </div>
  );
}
