"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  CreditCard,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Truck,
} from "lucide-react";

const trustCards = [
  {
    icon: Truck,
    title: "توصيل سريع داخل السعودية",
    desc: "توصيل من 2 إلى 5 أيام عمل حسب المدينة والمنطقة.",
  },
  {
    icon: CreditCard,
    title: "الدفع عند الاستلام",
    desc: "ادفع بعد ما يوصلك الطلب. بدون بطاقة وبدون تعقيد.",
  },
  {
    icon: PhoneCall,
    title: "تأكيد الطلب بالجوال",
    desc: "نراجع الطلب قبل الشحن لرفع نسبة الاستلام والتوصيل.",
  },
  {
    icon: PackageCheck,
    title: "فحص وتغليف قبل الخروج",
    desc: "كل طلب يمر على فحص سريع وتغليف يحافظ على المنتج.",
  },
];

const footerSections = [
  {
    title: "منتجات نجد",
    links: [
      { label: "نجد ثبات الخط · برايمر", href: "/products/najd-thabat-al-khat" },
      { label: "نجد درع النهار · واقي SPF", href: "/products/najd-darag-al-nahar" },
      { label: "نجد صفاء الجبهة · سيروم موضّع", href: "/products/najd-safa-al-jabha" },
      { label: "كل المنتجات", href: "/products" },
    ],
  },
  {
    title: "قانوني",
    links: [
      { label: "سياسة الخصوصية", href: "#" },
      { label: "الشروط والأحكام", href: "#" },
      { label: "سياسة الشحن والتوصيل", href: "#" },
      { label: "سياسة الاستبدال", href: "#" },
    ],
  },
  {
    title: "الدعم",
    links: [
      { label: "تواصل معنا", href: "/contact" },
      { label: "عن نجد", href: "/about" },
      {
        label: "صفحة الشكر (بعد الشراء)",
        href: "/thank-you",
      },
      { label: "الدفع عند الاستلام", href: "/contact" },
      { label: "الشحن داخل السعودية فقط", href: "/contact" },
    ],
  },
];

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>("منتجات نجد");

  return (
    <footer className="mt-20 border-t border-warm-sand/10 bg-[#faf2f5] text-deep-night">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="-mx-4 mb-10 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {trustCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="min-w-[240px] snap-center rounded-2xl border border-najd-green/10 bg-white/55 p-4 shadow-sm md:min-w-0"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-najd-green/10 text-najd-green">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-deep-night">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted">{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="md:hidden">
          {footerSections.map((section) => {
            const isOpen = openSection === section.title;
            return (
              <div key={section.title} className="border-b border-deep-night/10">
                <button
                  onClick={() => setOpenSection(isOpen ? null : section.title)}
                  className="flex w-full items-center justify-between py-5 text-right"
                  aria-expanded={isOpen}
                >
                  <ChevronDown
                    className={`h-5 w-5 text-deep-night transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="text-lg font-medium text-deep-night">
                    {section.title}
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-3 pb-5 text-right">
                    {section.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block text-sm text-muted transition-colors hover:text-najd-green"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden grid-cols-3 gap-12 border-b border-deep-night/10 py-10 text-right md:grid">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-medium text-deep-night">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-muted transition-colors hover:text-najd-green"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center md:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} نجد. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-najd-green" />
              متجر نجد الرسمي
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5 text-najd-green" />
              دعم واتساب
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
