import Link from "next/link";
import { Package } from "lucide-react";

const cream = "#F4F0E7";
const ink = "#111827";
const subtle = "#5B554A";

export default function ThankYouIndexPage() {
  return (
    <div
      className="min-h-[70vh] px-4 py-16 font-sans md:py-24"
      style={{ backgroundColor: cream, color: ink }}
    >
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
          <Package className="h-7 w-7 text-najd-green" aria-hidden />
        </div>
        <h1 className="text-2xl font-medium md:text-3xl">صفحة الشكر</h1>
        <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: subtle }}>
          هنا تظهر تفاصيل طلبك بعد ما تكمل الشراء من السلة. المتصفح ينتقل تلقائياً
          إلى رابط مثل{" "}
          <span className="font-mono text-xs text-najd-green dir-ltr">
            /thank-you/NAJD-…
          </span>{" "}
          وما يكونش رابط ثابت في القائمة عشان ما يظهر رقم طلبك لأي زائر.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row-reverse sm:flex-wrap">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-[14px] bg-najd-green px-8 py-3.5 text-sm font-medium text-white transition hover:bg-najd-green/90"
          >
            تسوق المنتجات
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[14px] border border-black/[0.1] bg-white px-8 py-3.5 text-sm font-medium text-[#111827] shadow-sm transition hover:bg-[#FAFAF8]"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
