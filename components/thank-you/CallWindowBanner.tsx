"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Moon, PhoneIncoming, Sun } from "lucide-react";
import {
  computeCallWindow,
  safeParseDate,
  type CallWindowState,
} from "@/lib/call-window";

interface CallWindowBannerProps {
  /** ISO string from the backend (`order.created_at`); anchors the 10-min promise. */
  orderCreatedAt: string | null | undefined;
  /** Last 4 digits of the customer's phone, for "للرقم المنتهي بـ ****" line. */
  phoneLast4: string | null | undefined;
}

function formatCountdown(minutes: number): string {
  if (minutes <= 0) return "أي لحظة الآن";
  if (minutes === 1) return "أقل من دقيقة";
  if (minutes < 10) return `~${minutes} دقائق`;
  return "~10 دقائق";
}

function formatOutsideWaitLabel(state: CallWindowState): string {
  if (state.hoursUntilCall <= 0) {
    const m = Math.max(1, state.minutesUntilCall);
    return `بعد ~${m} دقيقة`;
  }
  if (state.hoursUntilCall === 1) return "بعد ~ساعة واحدة";
  if (state.hoursUntilCall === 2) return "بعد ~ساعتين";
  if (state.hoursUntilCall < 11) return `بعد ~${state.hoursUntilCall} ساعات`;
  return `بعد ~${state.hoursUntilCall} ساعة`;
}

export function CallWindowBanner({
  orderCreatedAt,
  phoneLast4,
}: CallWindowBannerProps) {
  const createdAt = useMemo(() => safeParseDate(orderCreatedAt), [orderCreatedAt]);
  /* Render an SSR-safe placeholder first, then hydrate with live KSA time. */
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="rounded-[24px] border border-najd-green/20 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded-full bg-najd-green/10" />
        <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-stone/5" />
      </div>
    );
  }

  const state = computeCallWindow(now, createdAt);
  const isInside = state.insideWindow;
  const Icon = isInside ? PhoneIncoming : state.isTomorrow ? Moon : Sun;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-[28px] border shadow-[0_24px_70px_rgba(194,70,111,0.18)] ${
        isInside
          ? "border-najd-green/30 bg-gradient-to-br from-[#fff6f8] via-white to-[#fff0d8]"
          : "border-warm-sand/30 bg-gradient-to-br from-[#fff0e2] via-white to-[#f6ecff]"
      }`}
    >
      {/* Decorative pulse glow when call is imminent — purely cosmetic. */}
      {isInside && !state.promiseElapsed ? (
        <motion.span
          aria-hidden
          initial={{ scale: 0.6, opacity: 0.55 }}
          animate={{ scale: 1.25, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-najd-green/25 blur-2xl"
        />
      ) : null}

      <div className="relative grid gap-5 p-6 sm:p-8 md:grid-cols-[auto,1fr,auto] md:items-center md:gap-7">
        <div className="flex items-center gap-3">
          <span
            className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ring-1 ${
              isInside
                ? "bg-najd-green text-white ring-najd-green/40"
                : "bg-warm-sand text-white ring-warm-sand/40"
            }`}
          >
            <Icon className="h-7 w-7" strokeWidth={1.9} aria-hidden />
            {isInside && !state.promiseElapsed ? (
              <motion.span
                aria-hidden
                animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border-2 border-white/70"
              />
            ) : null}
          </span>
          <div className="hidden flex-col text-right md:flex">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-najd-green/80 font-latin">
              NAJD · Confirmation
            </span>
            <span className="text-xs text-muted">بتوقيت السعودية {state.ksaNowLabel}</span>
          </div>
        </div>

        <div className="text-right">
          {isInside ? (
            <>
              <p className="text-[12px] font-medium text-najd-green">
                خطوة وحدة باقية لتأكيد طلبك
              </p>
              <h2 className="mt-1 text-2xl font-medium leading-snug text-stone md:text-[28px]">
                {state.promiseElapsed
                  ? "فريقنا يحاول الاتصال بك الآن"
                  : "سنتصل بك خلال أقل من ١٠ دقائق"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
                توقّعي اتصالاً من <strong className="text-stone">رقم سعودي</strong>{" "}
                قد لا يكون محفوظاً عندكِ — احرصي على الرد ليصلك طلبك خلال
                <span className="mx-1 font-medium tabular-nums text-stone">٢–٤</span>
                أيام عمل.
              </p>
            </>
          ) : (
            <>
              <p className="text-[12px] font-medium text-warm-sand">
                استلمنا طلبك — موعد التأكيد محجوز لك
              </p>
              <h2 className="mt-1 text-2xl font-medium leading-snug text-stone md:text-[28px]">
                نتصل بك صباحاً
                <span className="mx-2 inline-flex items-center rounded-xl bg-warm-sand/15 px-2 py-0.5 text-base text-warm-sand">
                  ٩:٠٠ ص
                </span>
                {state.isTomorrow ? "بإذن الله" : ""}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
                خارج ساعات الاتصال (٩ ص – ٩ م بتوقيت السعودية). توقّعي اتصالاً
                من <strong className="text-stone">رقم سعودي</strong> قد لا يكون
                محفوظاً عندكِ — أبقي جوّالكِ قريباً.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border px-5 py-3 text-center shadow-sm ${
              isInside
                ? "border-najd-green/25 bg-white text-najd-green"
                : "border-warm-sand/25 bg-white text-warm-sand"
            }`}
          >
            <span className="text-[11px] font-medium text-muted">
              {isInside ? "الاتصال المتوقّع" : "أقرب موعد للمكالمة"}
            </span>
            <span className="mt-1 text-lg font-medium tabular-nums">
              {isInside
                ? formatCountdown(state.minutesUntilCall)
                : `${state.expectedCallLabel} ص`}
            </span>
            {!isInside ? (
              <span className="mt-0.5 text-[11px] text-muted">
                {formatOutsideWaitLabel(state)}
              </span>
            ) : (
              <span className="mt-0.5 text-[11px] text-muted">
                ضمن ساعات اتصال نجد
              </span>
            )}
          </div>

          {phoneLast4 ? (
            <p className="flex items-center justify-end gap-1.5 text-[11px] text-muted">
              <BellRing className="h-3.5 w-3.5 text-najd-green" aria-hidden />
              على الجوال المنتهي بـ
              <span className="font-mono tabular-nums text-stone">
                {phoneLast4}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative border-t border-stone/[0.06] bg-white/60 px-6 py-3 sm:px-8">
        <p className="text-right text-[12px] leading-relaxed text-muted">
          💡 جهّزي اسم <strong className="text-stone">الحي والشارع</strong> وأقرب
          نقطة معروفة — نأخذ منكِ العنوان شفهياً في المكالمة، بدون كتابته على
          الموقع.
        </p>
      </div>
    </motion.div>
  );
}
