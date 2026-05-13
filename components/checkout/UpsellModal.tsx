"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { acceptUpsell, type UpsellSuggestion } from "@/lib/api";
import { generateEventId } from "@/lib/event-id";

interface UpsellModalProps {
  upsell: UpsellSuggestion;
  orderId: string;
  onDone: () => void;
}

export function UpsellModal({ upsell, orderId, onDone }: UpsellModalProps) {
  const total = upsell.expires_in_seconds || 15;
  const [countdown, setCountdown] = useState(total);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      onDone();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onDone]);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const eventId = generateEventId("upsell_accepted");
      await acceptUpsell(orderId, eventId);
    } catch {
      // Non-blocking — continue to thank you
    } finally {
      onDone();
    }
  };

  const progress = (countdown / total) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-charcoal rounded-card w-full max-w-md border border-warm-sand/30 overflow-hidden"
        >
          {/* Countdown bar */}
          <div className="h-1 bg-stone/10">
            <motion.div
              className="h-full bg-warm-sand"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <span className="bg-warm-sand/20 text-warm-sand text-xs px-3 py-1 rounded-full font-bold">
                عرض خاص — {countdown} ثانية
              </span>
            </div>

            <div className="w-20 h-20 rounded-2xl bg-najd-green/30 mx-auto mb-4 flex items-center justify-center">
              <span className="text-warm-sand text-2xl font-bold font-arabic">
                {upsell.product_name_ar[2]}
              </span>
            </div>

            <h2 className="text-stone font-bold text-2xl text-center mb-2">
              أضفها لطلبك الآن بـ {upsell.price_sar} ريال فقط
            </h2>
            <h3 className="text-warm-sand text-xl text-center mb-2">
              {upsell.product_name_ar}
            </h3>
            <p className="text-muted text-sm text-center mb-6">
              هذا العرض يظهر مرة واحدة بعد تأكيد الطلب. نضيفها لنفس الشحنة
              والدفع عند الاستلام.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full bg-warm-sand text-deep-night py-4 rounded-btn font-bold text-base hover:bg-warm-sand/80 disabled:opacity-60 transition-colors"
              >
                {isAccepting
                  ? "جاري الإضافة..."
                  : `أضفها للطلب بـ ${upsell.price_sar} ريال`}
              </button>
              <button
                onClick={onDone}
                className="w-full text-muted text-sm py-3 hover:text-stone transition-colors"
              >
                لا، أكمل طلبي بدونها
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
