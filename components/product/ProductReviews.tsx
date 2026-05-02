"use client";

import { motion } from "framer-motion";
import { ReviewCard } from "@/components/common/ReviewCard";
import type { ProductConfig } from "@/config/products";

interface ProductReviewsProps {
  product: ProductConfig;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const totalRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
    product.reviews.length;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-warm-sand text-xl">
                ★
              </span>
            ))}
          </div>
          <p className="text-warm-sand font-bold text-2xl">
            {totalRating.toFixed(1)} / 5
          </p>
          <h2 className="text-stone font-bold text-3xl mt-2">
            ماذا يقول العملاء
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {product.reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ReviewCard {...review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
