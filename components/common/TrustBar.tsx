"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Truck, Wallet } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "كوزميتيك متخصص",
    sub: "خط واحد للوجه تحت الإيشارب والجو",
  },
  {
    icon: Wallet,
    title: "الدفع عند الاستلام",
    sub: "بلا بطاقة ولا حساب — تسليم يد بيد",
  },
  {
    icon: Truck,
    title: "توصيل داخل المملكة",
    sub: "٢–٤ أيام عمل لجميع المدن",
  },
  {
    icon: BadgeCheck,
    title: "ضمان استرجاع ٣٠ يوم",
    sub: "ما حسّيتي بفرق؟ نرجّع المبلغ",
  },
];

export function TrustBar() {
  return (
    <div className="border-y border-warm-sand/15 bg-charcoal/60 py-5 backdrop-blur-xl backdrop-saturate-150 md:py-6">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {BADGES.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-warm-sand/15 bg-charcoal/55 px-3 py-3 backdrop-blur-md transition-colors hover:border-warm-sand/35 md:px-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-najd-green/25 text-warm-sand md:h-10 md:w-10">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 text-right">
                  <p className="text-xs font-semibold leading-tight text-stone md:text-sm">
                    {badge.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10.5px] leading-snug text-muted md:text-xs">
                    {badge.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
