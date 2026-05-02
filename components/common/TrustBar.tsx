"use client";

import { motion } from "framer-motion";

const BADGES = [
  { icon: "💳", label: "الدفع عند الاستلام" },
  { icon: "🚚", label: "توصيل داخل السعودية" },
  { icon: "⚡", label: "روتين رجال سريع" },
  { icon: "💬", label: "دعم واتساب" },
];

export function TrustBar() {
  return (
    <div className="bg-najd-green/20 border-y border-najd-green/30 py-3">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center flex-wrap gap-6 md:gap-10"
        >
          {BADGES.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg">{badge.icon}</span>
              <span className="text-stone/80 text-sm font-medium">
                {badge.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
