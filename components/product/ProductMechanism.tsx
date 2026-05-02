"use client";

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
          <p className="text-muted">آلية عمل المكونات بشكل مبسط</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {product.mechanismPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal rounded-card p-6 border border-white/10"
            >
              <div className="w-10 h-10 bg-najd-green rounded-xl flex items-center justify-center mb-4">
                <span className="text-warm-sand font-bold text-lg">{i + 1}</span>
              </div>
              <h3 className="text-stone font-bold text-lg mb-2">{point.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{point.desc}</p>
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
