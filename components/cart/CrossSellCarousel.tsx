"use client";

import { useCartStore, OFFER_PRICES } from "@/stores/cart-store";
import { PRODUCTS } from "@/config/products";

const crossSellCopy: Record<string, string> = {
  "face-primer": "كمّلي روتينكِ بدرع النهار أو صفاء الجبهة حسب احتياجكِ.",
  "face-sunscreen-spf50": "أضيفي صفاء الجبهة مساءً أو ثبات الخط صباحاً لروتين أكثر اتزاناً.",
  "forehead-serum": "ثبات الخط صباحاً ودرع النهار يكمّلان تهيئة الوجه قبل الخروج.",
};

export function CrossSellCarousel() {
  const { items, addCrossSell } = useCartStore();
  const slugsInCart = new Set(items.map((i) => i.slug));

  const suggestedProducts = PRODUCTS.filter((product) => !slugsInCart.has(product.slug));
  if (suggestedProducts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-warm-sand/20 bg-deep-night p-4">
      <p className="mb-3 text-right text-xs text-muted">
        كمل طلبك بمنتج ثاني من نجد
      </p>
      <div className="space-y-3">
        {suggestedProducts.map((product) => (
          <div key={product.slug} className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-najd-green/30">
              <span className="font-arabic font-medium text-warm-sand">
                {product.nameAr[2]}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-sm font-medium text-stone">{product.nameAr}</p>
              <p className="line-clamp-2 text-xs text-muted">
                {crossSellCopy[product.slug]}
              </p>
            </div>
            <button
              onClick={() =>
                addCrossSell({
                  productId: product.slug,
                  slug: product.slug,
                  nameAr: product.nameAr,
                  nameEn: product.nameEn,
                  offerQty: 1,
                  unitLabel: "قطعة واحدة",
                  priceSar: OFFER_PRICES[1],
                  addedFrom: "cross_sell",
                })
              }
              className="whitespace-nowrap rounded-lg bg-najd-green px-3 py-2 text-xs text-white transition-colors hover:bg-najd-green/80"
            >
              أضفه بـ {OFFER_PRICES[1]} ريال
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
