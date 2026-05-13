"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Headphones,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getOrder } from "@/lib/api";
import { trackPurchase, generateEventId } from "@/lib/tracking";
import { SITE_CONFIG } from "@/config/site";

const cream = "#fbf6f0";
const ink = "#1d1416";
const subtle = "#6f5f63";

const ORDER_STEPS = [
  {
    num: "١",
    title: "مراجعة سريعة",
    desc: "فريق نجد يمرّ على تفاصيل طلبك ويتأكد أن كل شيء جاهز.",
  },
  {
    num: "٢",
    title: "تأكيد بالجوال",
    desc: "قد نتصل أو نرسل رسالة لتثبيت الطلب — ردّك يسرّع الشحن.",
  },
  {
    num: "٣",
    title: "توصيل ودفع عند الباب",
    desc: "الدفع فقط عند الاستلام. بدون بطاقة على الموقع.",
  },
] as const;

const TRUST_BADGES = [
  { Icon: ShieldCheck, label: "متجر نجد الرسمي" },
  { Icon: Truck, label: "شحن داخل المملكة" },
  { Icon: CreditCard, label: "الدفع عند الاستلام" },
  { Icon: Headphones, label: "دعم واتساب" },
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
            تم استلام طلبك يا بطل
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: subtle }}>
            رقم الطلب:{" "}
            <span className="font-mono text-najd-green dir-ltr">{orderId}</span>
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed" style={{ color: subtle }}>
            سيتواصل فريقنا معك قريباً عند الحاجة لتأكيد الطلب قبل الشحن.
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

  return (
    <ThankYouShell>
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
                  لن يُرسل هذا الطلب إلى جدول المبيعات أو منصات الإعلانات. استخدمه
                  للتجربة فقط؛ احذفه من التقارير أو تجاهله في العمليات.
                </p>
              </div>
            ) : null}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] px-4 py-2 text-sm text-[#111827] shadow-sm" style={{ backgroundColor: cream }}>
              <Package className="h-4 w-4 text-najd-green" aria-hidden />
              <span className="font-mono dir-ltr tracking-tight text-najd-green">
                {displayNumber}
              </span>
            </div>

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5EF] shadow-inner">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
              >
                <CheckCircle2
                  className="h-11 w-11 text-najd-green"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </motion.div>
            </div>

            <h1 className="max-w-xl text-3xl font-medium leading-snug text-[#111827] md:text-4xl">
              شكراً لك،{" "}
              <span className="text-najd-green">{order.customer_name}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: subtle }}>
              طلبك مؤكد عندنا. نحدّثك عبر الجوال عند الحاجة، ونوصلك داخل
              السعودية مع الدفع عند الاستلام.
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

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 md:space-y-10 md:py-14">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_20px_60px_rgba(17,24,39,0.06)] md:p-9"
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-medium text-najd-green">ماذا بعد؟</p>
            <h2 className="mt-1 text-xl font-medium text-[#111827] md:text-2xl">
              من الطلب إلى باب بيتك
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: subtle }}>
              مسار بسيط: مراجعة، تأكيد، ثم شحن — بنفس روح صفحات التأكيد النظيفة
              في المتاجر الرائدة.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {ORDER_STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-black/[0.05] bg-[#FAFAF8] p-5 text-right transition hover:border-najd-green/20"
              >
                <div className="mb-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-medium text-najd-green shadow-sm ring-1 ring-black/[0.04]">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#111827]">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: subtle }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[24px] border border-najd-green/20 bg-[#E8F5EF]/60 p-5 md:p-6"
        >
          <div className="flex items-start gap-3 text-right">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.05]">
              <Phone className="h-5 w-5 text-najd-green" aria-hidden />
            </div>
            <div>
              <h2 className="text-base font-medium text-[#111827]">انتبه لجوالك</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: subtle }}>
                قد نتواصل معك على الرقم المنتهي بـ{" "}
                <span className="font-semibold tabular-nums text-najd-green">
                  {order.phone_last4 ?? "****"}
                </span>{" "}
                لتأكيد الطلب قبل الشحن. الرد السريع يساعدنا نوصلك أسرع.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_60px_rgba(17,24,39,0.06)]"
        >
          <div className="flex flex-col gap-2 border-b border-black/[0.06] bg-[#FAFAF8] px-6 py-5 text-right sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-[#111827]">ملخص الطلب</h2>
              <p className="text-xs" style={{ color: subtle }}>
                الإجمالي مستحق عند الاستلام فقط
              </p>
            </div>
            <span className="inline-flex w-fit rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 font-mono text-xs text-najd-green dir-ltr">
              #{order.order_number}
            </span>
          </div>

          <ul className="divide-y divide-black/[0.05] px-6">
            {order.items.map((item, i) => (
              <li
                key={`${item.product_slug}-${i}`}
                className="flex items-start justify-between gap-4 py-4"
              >
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-sm font-medium text-[#111827]">
                    {item.product_name_ar}
                    {item.is_upsell && (
                      <span className="mr-2 text-xs font-normal text-warm-sand">
                        (عرض مميز)
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: subtle }}>
                    الكمية {item.quantity} ·{" "}
                    <span className="tabular-nums">{item.unit_price_sar}</span> ريال
                    / وحدة
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium tabular-nums text-najd-green">
                  {item.line_total_sar} ر.س
                </p>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 border-t border-black/[0.06] bg-[#FAFAF8] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="text-right">
              <p className="text-xs" style={{ color: subtle }}>
                المبلغ المستحق
              </p>
              <p className="mt-1 text-3xl font-medium tabular-nums text-[#111827]">
                {order.total_sar}
                <span className="mr-1 text-lg" style={{ color: subtle }}>
                  ريال
                </span>
              </p>
            </div>
            <p className="max-w-[14rem] rounded-xl border border-black/[0.06] bg-white px-3 py-2 text-[11px] leading-relaxed text-[#374151]">
              لا نحتفظ ببطاقتك على الموقع. الدفع يتم مع المندوب عند التسليم.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 text-right shadow-sm">
            <h3 className="text-sm font-medium text-[#111827]">تعديل الطلب؟</h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: subtle }}>
              راسلنا على واتساب برقم الطلب قبل الشحن وسنقترح أقرب حل.
            </p>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white p-5 text-right shadow-sm">
            <h3 className="text-sm font-medium text-[#111827]">متى أدفع؟</h3>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: subtle }}>
              فقط عند استلام الشحنة. تجربة واضحة بدون دفع مسبق على المتجر.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row-reverse"
        >
          <a
            href={SITE_CONFIG.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-3 rounded-[16px] bg-najd-green px-5 py-4 text-sm font-medium text-white shadow-lg shadow-najd-green/25 transition hover:bg-najd-green/90"
          >
            <MessageCircle className="h-5 w-5" />
            <span>تحدث معنا على واتساب</span>
          </a>
          <Link
            href="/products"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[16px] border border-black/[0.1] bg-white px-5 py-4 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#FAFAF8]"
          >
            <span>تصفح منتجات نجد</span>
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        <p className="pb-8 text-center text-xs" style={{ color: subtle }}>
          <Link href="/" className="underline-offset-4 hover:underline">
            العودة للرئيسية
          </Link>
        </p>
      </div>
    </ThankYouShell>
  );
}

function ThankYouShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: cream, color: ink }}
    >
      {children}
    </div>
  );
}
