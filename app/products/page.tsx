"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/common/ProductCard";
import { TrustBar } from "@/components/common/TrustBar";
import { PRODUCTS } from "@/config/products";

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "primer", label: "ثبات المكياج" },
  { id: "spf", label: "حماية نهارية" },
  { id: "hairline", label: "خط الجبهة" },
  { id: "gifts", label: "هدية" },
];

const FILTER_MAP: Record<string, string[]> = {
  primer: ["face-primer"],
  spf: ["face-sunscreen-spf50"],
  hairline: ["forehead-serum"],
  gifts: PRODUCTS.map((p) => p.slug),
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
};

export default function ProductsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) =>
          (FILTER_MAP[activeFilter] || []).includes(p.slug)
        );

  return (
    <div>
      {/* Hero */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-stone font-bold text-4xl md:text-5xl mb-4">
            وجه تحت الإيشارب والجو السعودي.{" "}
            <span className="text-warm-sand">ثلاثة منتجات، خط واحد من نجد.</span>
          </h1>
          <p className="text-muted text-lg">
            ثبات للمكياج، واقي نهاري خفيف، وسيروم موضّع لخط الجبهة — مستحضرات
            تجميلية خارجية بلا ادِّعاء طبي، مع الشفافية والدفع عند الاستلام.
          </p>
        </motion.div>
      </section>

      <TrustBar />

      {/* Filters */}
      <section className="py-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-najd-green text-white"
                  : "bg-charcoal text-muted border border-stone/10 hover:border-warm-sand/30 hover:text-stone"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="pb-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.slug}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-najd-green/5">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-stone font-bold text-3xl">مقارنة المنتجات</h2>
          </motion.div>
          <table className="w-full text-right min-w-[600px]">
            <thead>
              <tr className="border-b border-stone/10">
                <th className="text-muted text-sm font-medium py-3 px-4">
                  المعيار
                </th>
                {PRODUCTS.map((p) => (
                  <th
                    key={p.slug}
                    className="max-w-[12rem] px-2 py-3 text-center align-bottom text-xs font-bold leading-snug text-stone md:max-w-[14rem] md:px-3 md:text-sm"
                  >
                    {p.nameAr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone/5">
              {[
                {
                  label: "المشكلة",
                  values: PRODUCTS.map((p) => p.problemAr),
                },
                {
                  label: "أفضل وقت للاستخدام",
                  values: PRODUCTS.map((p) => p.compareWhenAr),
                },
                {
                  label: "الميزة البارزة",
                  values: PRODUCTS.map((p) => p.compareHighlightAr),
                },
                {
                  label: "السعر يبدأ من",
                  values: PRODUCTS.map((p) => `${p.offers[0].priceSar} ريال`),
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-charcoal/30 transition-colors">
                  <td className="text-muted text-sm py-3 px-4">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className="text-stone text-sm py-3 px-4 text-center"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <motion.section {...fadeUp} className="py-16 text-center max-w-3xl mx-auto px-4">
        <h2 className="text-stone font-bold text-3xl mb-4">
          ما زلت تفكر؟
        </h2>
        <p className="text-muted mb-6">
          ادفع عند الاستلام. ما فيه مخاطرة.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="rounded-btn border border-warm-sand/30 bg-charcoal px-4 py-3 text-center text-xs font-bold leading-snug text-warm-sand transition-colors hover:bg-warm-sand/10 sm:px-6 sm:text-sm"
            >
              {p.nameAr}
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
