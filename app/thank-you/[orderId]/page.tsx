"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "@/lib/api";
import { trackPurchase, generateEventId } from "@/lib/tracking";
import { SITE_CONFIG } from "@/config/site";

export default function ThankYouPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    retry: 2,
  });

  useEffect(() => {
    if (order) {
      const eventId = generateEventId("purchase_confirmed");
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
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-warm-sand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">جاري تحميل تفاصيل طلبك...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <span className="text-6xl block mb-4">🎉</span>
          <h1 className="text-stone font-bold text-3xl mb-3">
            تم استلام طلبك يا بطل!
          </h1>
          <p className="text-muted mb-6">
            رقم طلبك: <span className="text-warm-sand font-bold">{orderId}</span>
          </p>
          <p className="text-muted text-sm mb-8">
            سيتواصل معك فريقنا قريباً لتأكيد الطلب قبل الشحن.
          </p>
          <Link
            href="/"
            className="bg-najd-green text-white px-8 py-3 rounded-btn font-bold hover:bg-najd-green/80 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl block mb-4"
        >
          🎉
        </motion.span>
        <h1 className="text-stone font-bold text-3xl md:text-4xl mb-2">
          تم استلام طلبك يا بطل.
        </h1>
        <p className="text-muted text-lg">
          شكراً {order.customer_name}! كل شيء ماشٍ بشكل ممتاز.
        </p>
      </motion.div>

      {/* Order details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-charcoal rounded-card border border-white/10 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-warm-sand font-bold text-sm">
            #{order.order_number}
          </span>
          <h2 className="text-stone font-bold">تفاصيل الطلب</h2>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2 ${
                i < order.items.length - 1
                  ? "border-b border-white/5"
                  : ""
              }`}
            >
              <span className="text-warm-sand font-bold">
                {item.line_total_sar} ريال
              </span>
              <div className="text-right">
                <p className="text-stone text-sm">{item.product_name_ar}</p>
                <p className="text-muted text-xs">
                  {item.quantity} × {item.unit_price_sar} ريال
                  {item.is_upsell && (
                    <span className="mr-2 text-warm-sand">• إضافة خاصة</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between">
          <span className="text-warm-sand font-bold text-xl">
            {order.total_sar} ريال
          </span>
          <span className="text-muted text-sm">الإجمالي (عند الاستلام)</span>
        </div>
      </motion.div>

      {/* Phone confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-najd-green/20 border border-najd-green/30 rounded-2xl p-5 mb-6"
      >
        <h3 className="text-stone font-bold mb-3 text-right">📞 تأكيد الطلب</h3>
        <p className="text-muted text-sm leading-relaxed text-right">
          قد يتواصل معك فريقنا على رقمك المنتهي بـ{" "}
          <span className="text-warm-sand font-bold">{order.phone_last4}</span>{" "}
          لتأكيد الطلب قبل الشحن. احرص على الرد.
        </p>
      </motion.div>

      {/* Delivery expectations */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { icon: "📦", label: "تحضير", time: "اليوم" },
          { icon: "🚚", label: "شحن", time: "1-2 يوم" },
          { icon: "🏠", label: "استلام", time: "2-4 أيام" },
        ].map((step, i) => (
          <div
            key={i}
            className="bg-charcoal rounded-2xl border border-white/10 p-4 text-center"
          >
            <span className="text-2xl block mb-1">{step.icon}</span>
            <p className="text-stone text-xs font-semibold">{step.label}</p>
            <p className="text-warm-sand text-xs">{step.time}</p>
          </div>
        ))}
      </motion.div>

      {/* WhatsApp support */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <a
          href={SITE_CONFIG.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-success/20 border border-success/30 rounded-2xl p-4 hover:bg-success/30 transition-colors"
        >
          <span className="text-2xl">💬</span>
          <div className="text-right">
            <p className="text-stone font-bold text-sm">دعم واتساب</p>
            <p className="text-muted text-xs">أي سؤال؟ نحن هنا.</p>
          </div>
        </a>
      </motion.div>

      {/* Back to shop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <Link
          href="/products"
          className="text-muted text-sm hover:text-stone transition-colors"
        >
          تصفح باقي منتجات نجد ←
        </Link>
      </motion.div>
    </div>
  );
}
