"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  PhoneCall,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckoutStore } from "@/stores/checkout-store";
import { dedupeCartItems, useCartStore } from "@/stores/cart-store";
import { normalizeSaudiMobile } from "@/lib/phone";
import { createOrder, useBackendProxy, useMockOrdersApi } from "@/lib/api";
import { generateEventId } from "@/lib/event-id";
import { trackInitiateCheckout } from "@/lib/tracking";
import { UpsellModal } from "./UpsellModal";
import type { CreateOrderResponse } from "@/lib/api";
import { SITE_CONFIG } from "@/config/site";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  phone: z.string().refine(
    (v) => normalizeSaudiMobile(v) !== null,
    "يرجى إدخال رقم جوال سعودي صحيح (مثال: 0512345678)"
  ),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

/** تصنيف خطأ الدفع: الشبكة تُخطئ غالباً بحظر VPN بينما المشكلة API/CORS. */
function checkoutErrorKind(message: string): "network" | "geo" | "other" {
  const m = message.trim();
  if (
    m === "Failed to fetch" ||
    /networkerror|load failed|fetch failed|network request failed/i.test(m)
  ) {
    return "network";
  }
  if (
    /\bHTTP 502\b|\bHTTP 503\b|تعذّر الاتصال بطلبات المتجر|تعذّر الوصول لـ FastAPI/i.test(
      m
    )
  ) {
    return "network";
  }
  if (
    m.includes("تعذر إتمام الطلب") ||
    m.includes("تعذّر إتمام الطلب") ||
    m.includes("خدمة التحقق غير متاحة") ||
    m.includes("التحقق غير متاحة") ||
    (m.includes("المملكة") &&
      (m.includes("VPN") || m.includes("بروكسي") || m.includes("افتراضية")))
  ) {
    return "geo";
  }
  return "other";
}

export function CheckoutModal() {
  const { isOpen, closeCheckout } = useCheckoutStore();
  const { items, getTotal, clearCart } = useCartStore();
  const displayItems = dedupeCartItems(items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResponse, setOrderResponse] =
    useState<CreateOrderResponse | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setCheckoutError(null);
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const isMockOrdersApi = useMockOrdersApi();
  const usesBackendProxy = useBackendProxy();
  const resolvedApiBase = SITE_CONFIG.apiUrl.replace(/\/$/, "");

  const onSubmit = async (data: CheckoutForm) => {
    const phone = normalizeSaudiMobile(data.phone)!;
    setIsSubmitting(true);
    setCheckoutError(null);

    const purchaseEventId = generateEventId("purchase");
    const initiateEventId = generateEventId("initiate_checkout");

    trackInitiateCheckout(
      { total: getTotal(), items: displayItems.map((i) => ({ slug: i.slug })) },
      initiateEventId
    );

    try {
      const payload = {
        customer_name: data.name,
        phone,
        items: displayItems.map((i) => ({
          product_id: i.slug,
          offer_qty: i.offerQty,
          price_sar: i.priceSar,
        })),
        event_ids: {
          initiate_checkout: initiateEventId,
          purchase: purchaseEventId,
        },
        landing_page:
          typeof window !== "undefined" ? window.location.href : undefined,
        referrer:
          typeof window !== "undefined" ? document.referrer : undefined,
        browser: {
          user_agent:
            typeof window !== "undefined" ? navigator.userAgent : undefined,
        },
      };

      const response = await createOrder(payload);
      if (!response?.order_id?.trim()) {
        throw new Error("استجابة غير مكتملة من الخادم — تحقق من تشغيل الباكند.");
      }
      setOrderResponse(response);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          `najd_purchase_eid_${response.order_id}`,
          purchaseEventId
        );
      }

      const thankYouPath = `/thank-you/${encodeURIComponent(response.order_id)}`;

      if (response.upsell) {
        setShowUpsell(true);
      } else {
        clearCart();
        closeCheckout();
        reset();
        /* من داخل createPortal أحياناً router.push ما يحدّثش المسار — إعادة تحميل كاملة أوثق */
        if (typeof window !== "undefined") {
          window.location.assign(thankYouPath);
        } else {
          router.push(thankYouPath);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مجدداً";
      setCheckoutError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpsellDone = () => {
    setShowUpsell(false);
    clearCart();
    closeCheckout();
    reset();
    if (orderResponse?.order_id?.trim()) {
      const thankYouPath = `/thank-you/${encodeURIComponent(orderResponse.order_id)}`;
      if (typeof window !== "undefined") {
        window.location.assign(thankYouPath);
      } else {
        router.push(thankYouPath);
      }
    }
  };

  const checkoutErrKind = checkoutError
    ? checkoutErrorKind(checkoutError)
    : null;

  return (
    <>
      {mounted &&
        createPortal(
          <>
            <AnimatePresence>
              {isOpen && !showUpsell && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeCheckout}
                    className="fixed inset-0 z-[60] bg-black/70"
                  />
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 18 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 18 }}
                    className="fixed inset-0 z-[60] grid place-items-center p-4"
                  >
                    <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-warm-sand/20 bg-charcoal text-stone shadow-2xl">
                      <div className="flex items-center justify-between px-6 pb-4 pt-5">
                        <button
                          onClick={closeCheckout}
                          className="rounded-full p-1.5 transition-colors hover:bg-stone/10"
                          aria-label="إغلاق"
                        >
                          <X className="h-6 w-6 text-stone" />
                        </button>
                        <h2 className="text-2xl font-medium text-stone">
                          إتمام الطلب
                        </h2>
                      </div>

                      {isMockOrdersApi ? (
                        <div
                          role="status"
                          className="mx-6 mb-1 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-right text-xs text-amber-900"
                        >
                          <p className="font-medium text-amber-900">
                            وضع تجريبي نشط — لا يوجد فلتر دولة أو VPN
                          </p>
                          <p className="mt-1 leading-relaxed text-amber-800/90">
                            الطلبات تُحفظ داخل المتجر فقط (بدون الباكند). ضع{" "}
                            <span className="font-mono text-[10px] dir-ltr inline-block">
                              NEXT_PUBLIC_MOCK_ORDERS=false
                            </span>{" "}
                            في <span className="font-mono">.env.local</span> وأعد
                            تشغيل <span className="font-mono">npm run dev</span> لتفعيل
                            MaxMind على السيرفر الحقيقي.
                          </p>
                        </div>
                      ) : null}

                      {!isMockOrdersApi && !usesBackendProxy ? (
                        <div
                          role="status"
                          className="mx-6 mb-1 rounded-2xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 text-right text-xs text-sky-50/95"
                        >
                          <p className="font-medium text-sky-100">
                            الاتصال بالـ API مباشرة من المتصفح (بروكسي Next معطّل)
                          </p>
                          <p className="mt-1 leading-relaxed text-sky-100/85">
                            تأكد أن أصل الموقع (مثلاً{" "}
                            <span className="font-mono text-[10px] dir-ltr">
                              https://najdofficial.com
                            </span>
                            ) مضاف في{" "}
                            <span className="font-mono text-[10px] dir-ltr">
                              CORS_ORIGINS
                            </span>{" "}
                            على الباكند.
                          </p>
                        </div>
                      ) : null}

                      <div className="border-y border-warm-sand/15 bg-deep-night px-6 py-3">
                        <div className="mb-3 flex justify-center">
                          <span className="inline-flex items-center gap-2 rounded-full border border-warm-sand/25 bg-warm-sand/10 px-4 py-2 text-xs text-warm-sand">
                            <Flame className="h-3.5 w-3.5" />
                            آخر 24 ساعة على عرض الإطلاق
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs text-muted">
                          <span>4.9</span>
                          <span className="text-warm-sand">★★★★★</span>
                          <span>+1,200 طلب داخل السعودية</span>
                        </div>
                      </div>

                      <div className="space-y-4 px-6 py-5">
                        <p className="text-right text-sm text-muted">طلبك</p>
                        <div className="space-y-3">
                          {displayItems.map((item) => (
                            <div
                              key={item.lineId}
                              className="flex items-center justify-between gap-3"
                            >
                              <span className="text-sm font-medium text-warm-sand">
                                {item.priceSar} ر.س
                              </span>
                              <div className="min-w-0 flex-1 text-right">
                                <p className="truncate text-sm font-medium text-stone">
                                  {item.nameAr}
                                </p>
                                <p className="text-xs text-muted">
                                  {item.unitLabel}
                                </p>
                              </div>
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-najd-green/30 text-warm-sand">
                                {item.nameAr[2]}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-stone/10 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-medium text-warm-sand">
                              {getTotal()} ر.س
                            </span>
                            <span className="text-lg font-medium text-stone">
                              الإجمالي
                            </span>
                          </div>
                          <p className="mt-2 flex items-center justify-center gap-1 text-xs text-najd-green">
                            <CheckCircle2 className="h-4 w-4" />
                            الدفع عند الاستلام · تأكيد بالجوال قبل الشحن
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 pb-5">
                        {checkoutError ? (
                          <div
                            role="alert"
                            className="rounded-2xl border border-error/50 bg-error/15 px-4 py-3 text-right"
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle
                                className="mt-0.5 h-5 w-5 shrink-0 text-error"
                                aria-hidden
                              />
                              <div className="min-w-0 flex-1">
                                {checkoutErrKind === "network" ? (
                                  <>
                                    <p className="text-sm font-medium text-stone">
                                      {isDev
                                        ? "لا يوجد اتصال بالخادم (فشل الطلب)"
                                        : "تعذّر إرسال الطلب مؤقتاً"}
                                    </p>
                                    {isDev ? (
                                      <>
                                        <p className="mt-1 text-xs leading-relaxed text-muted">
                                          {usesBackendProxy ? (
                                            <>
                                              الطلب يمر عبر البروكسي الداخلي. تأكد أن
                                              الباكند يعمل وأن عنوان الـAPI صحيح في متغيرات
                                              البيئة، ثم أعد المحاولة.
                                            </>
                                          ) : (
                                            <>
                                              المتصفح يتصل مباشرة بـ API. تأكد أن العنوان
                                              يفتح وأن CORS يسمح بأصل الموقع.
                                            </>
                                          )}
                                        </p>
                                        <p className="mt-2 text-[11px] leading-relaxed text-muted">
                                          <strong className="font-medium">تجربة بدون باكند:</strong>{" "}
                                          في{" "}
                                          <span dir="ltr" className="font-mono text-[10px]">
                                            .env.local
                                          </span>{" "}
                                          ضع{" "}
                                          <span dir="ltr" className="font-mono text-[10px]">
                                            NEXT_PUBLIC_MOCK_ORDERS=true
                                          </span>
                                          ثم أعد تشغيل{" "}
                                          <span dir="ltr" className="font-mono text-[10px]">
                                            npm run dev
                                          </span>
                                          .
                                        </p>
                                        {!usesBackendProxy && (
                                          <p className="mt-2 text-[11px] leading-relaxed text-muted">
                                            <span className="block font-medium text-stone">
                                              عنوان الطلبات الحالي:
                                            </span>
                                            <span
                                              dir="ltr"
                                              className="mt-1 block break-all font-mono text-[10px] text-stone"
                                            >
                                              {resolvedApiBase}/orders
                                            </span>
                                          </p>
                                        )}
                                        {checkoutError ? (
                                          <p
                                            dir="ltr"
                                            className="mt-2 break-all font-mono text-[10px] text-muted"
                                          >
                                            {checkoutError}
                                          </p>
                                        ) : null}
                                      </>
                                    ) : (
                                      <p className="mt-1 text-xs leading-relaxed text-muted">
                                        تحقّقي من اتصال الإنترنت ثم أعيدي المحاولة بعد قليل.
                                        إذا استمرّ الخطأ، تواصلي معنا عبر{" "}
                                        <a
                                          href="/contact"
                                          className="text-najd-green underline underline-offset-2"
                                        >
                                          صفحة اتصل بنا
                                        </a>
                                        .
                                      </p>
                                    )}
                                  </>
                                ) : checkoutErrKind === "geo" ? (
                                  <>
                                    <p className="text-sm font-medium text-stone">
                                      تعذّر إتمام الطلب من هذا الاتصال
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted">
                                      {checkoutError}
                                    </p>
                                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                                      الطلبات متاحة من داخل المملكة فقط (أو رقم الاختبار
                                      المصرّح مثل 0550505044 عندما يصل الطلب للباكند). تأكد
                                      أنك داخل السعودية وأنك لا تستخدم VPN أو بروكسي، ثم
                                      أعد المحاولة.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-sm font-medium text-stone">
                                      لم يكتمل الطلب
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted">
                                      {checkoutError}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div>
                          <label className="mb-2 block text-right text-sm font-medium text-stone">
                            الاسم الكامل
                          </label>
                          <input
                            {...register("name")}
                            placeholder="مثال: محمد العتيبي"
                            className="w-full rounded-2xl border border-stone/15 bg-deep-night px-4 py-4 text-right text-stone placeholder-muted outline-none transition-colors focus:border-warm-sand"
                          />
                          {errors.name && (
                            <p className="mt-1 text-right text-xs text-error">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-right text-sm font-medium text-stone">
                            رقم الجوال السعودي
                          </label>
                          <input
                            {...register("phone")}
                            placeholder="05XXXXXXXX"
                            type="tel"
                            dir="ltr"
                            className="w-full rounded-2xl border border-stone/15 bg-deep-night px-4 py-4 text-right text-stone placeholder-muted outline-none transition-colors focus:border-warm-sand"
                          />
                          {errors.phone ? (
                            <p className="mt-1 text-right text-xs text-error">
                              {errors.phone.message}
                            </p>
                          ) : (
                            <p className="mt-1 text-center text-xs text-muted">
                              رقم جوال سعودي صحيح (05XXXXXXXX) لتأكيد التوصيل.
                            </p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || displayItems.length === 0}
                          className="w-full rounded-2xl bg-najd-green py-4 text-lg font-medium text-white transition-colors hover:bg-najd-green/90 disabled:opacity-60"
                        >
                          {isSubmitting
                            ? "جاري إرسال الطلب..."
                            : "تأكيد الطلب بالدفع عند الاستلام"}
                        </button>
                      </form>

                      <div className="grid grid-cols-3 gap-2 border-t border-stone/10 px-6 pb-6 pt-4 text-center">
                        <div className="space-y-1">
                          <ShieldCheck className="mx-auto h-5 w-5 text-najd-green" />
                          <p className="text-[11px] text-stone">بدون دفع الآن</p>
                        </div>
                        <div className="space-y-1">
                          <PhoneCall className="mx-auto h-5 w-5 text-najd-green" />
                          <p className="text-[11px] text-stone">نتصل للتأكيد</p>
                        </div>
                        <div className="space-y-1">
                          <Truck className="mx-auto h-5 w-5 text-najd-green" />
                          <p className="text-[11px] text-stone">توصيل السعودية</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {orderResponse?.upsell && showUpsell && (
              <UpsellModal
                upsell={orderResponse.upsell}
                orderId={orderResponse.order_id}
                onDone={handleUpsellDone}
              />
            )}
          </>,
          document.body
        )}
    </>
  );
}
