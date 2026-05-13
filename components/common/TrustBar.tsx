"use client";

import { motion } from "framer-motion";

const BADGES = [
  { icon: "🧴", label: "عناية بالبشرة أولاً" },
  { icon: "💳", label: "الدفع عند الاستلام" },
  { icon: "🚚", label: "توصيل داخل السعودية" },
  { icon: "💬", label: "دعم واتساب" },
];

export function TrustBar() {
  return (
    <div className="border-y border-white/10 bg-white/[0.04] py-3.5 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center flex-wrap gap-5 md:gap-10"
        >
          {BADGES.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 backdrop-blur-md"
            >
              <span className="text-lg leading-none">{badge.icon}</span>
              <span className="text-stone/90 text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
