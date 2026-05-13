"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductConfig } from "@/config/products";

interface ProductMechanismProps {
  product: ProductConfig;
}

export function ProductMechanism({ product }: ProductMechanismProps) {
  return (
    <section className="py-16 bg-najd-green/10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-stone font-bold text-3xl mb-2">
            كيف يشتغل {product.nameAr}؟
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-sm leading-relaxed md:text-base">
            {product.mechanismSubheading ??
              "آلية عمل المكونات بشكل مبسط"}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          {product.mechanismPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal rounded-card p-6 border border-stone/10"
            >
              {!point.imageSrc && (
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-najd-green">
                  <span className="text-lg font-bold text-warm-sand">{i + 1}</span>
                </div>
              )}
              {point.imageSrc && (
                <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-xl border border-najd-green/25 bg-charcoal/60">
                  <Image
                    src={point.imageSrc}
                    alt={point.imageAlt ?? `${point.title} — ${point.desc}`}
                    fill
                    sizes="(min-width: 768px) 320px, 33vw"
                    className="object-cover object-center"
                  />
                </div>
              )}
              {point.imageSrc ? (
                <p className="sr-only">
                  {point.title} {point.desc}
                </p>
              ) : (
                <>
                  <h3 className="mb-2 text-lg font-bold text-stone">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{point.desc}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-charcoal/60 rounded-2xl p-4 border border-warm-sand/10 text-center"
        >
          <p className="text-muted text-sm">
            <span className="text-warm-sand">⚠️ تنبيه: </span>
            {product.safetyNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
