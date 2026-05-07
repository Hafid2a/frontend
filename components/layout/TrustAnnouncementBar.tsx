"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, PhoneCall, ShieldCheck, Truck } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    text: "متجر نجد الرسمي — عناية ليلية للبنات",
  },
  {
    icon: PhoneCall,
    text: "تأكيد الطلب بالجوال قبل الشحن",
  },
  {
    icon: Truck,
    text: "توصيل داخل السعودية والدفع عند الاستلام",
  },
  {
    icon: BadgeCheck,
    text: "فحص وتغليف قبل خروج الطلب",
  },
];

export function TrustAnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = trustItems[activeIndex];
  const Icon = activeItem.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % trustItems.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="border-t border-warm-sand/10 bg-najd-green text-stone shadow-[0_10px_35px_rgba(199,91,126,0.35)]">
      <div className="mx-auto flex h-12 max-w-6xl items-center overflow-hidden px-4 md:h-11">
        <div className="relative flex min-w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              className="flex items-center justify-center gap-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-warm-sand" />
              <p className="truncate text-center text-xs font-medium md:text-sm">
                {activeItem.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
