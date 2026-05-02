"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { dedupeCartItems, useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { CartItem } from "./CartItem";
import { CrossSellCarousel } from "./CrossSellCarousel";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotal } = useCartStore();
  const { openCheckout } = useCheckoutStore();
  const displayItems = dedupeCartItems(items);
  const total = getTotal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeCart}
                  className="fixed inset-0 z-50 bg-black/60"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 18 }}
                  transition={{ type: "spring", damping: 24, stiffness: 220 }}
                  className="fixed inset-0 z-50 grid place-items-center p-4"
                >
                  <div className="flex max-h-[60vh] w-full max-w-md flex-col overflow-hidden rounded-card border border-white/10 bg-charcoal shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 p-5">
                      <button
                        onClick={closeCart}
                        className="rounded-full p-2 transition-colors hover:bg-white/10"
                        aria-label="إغلاق السلة"
                      >
                        <X className="h-5 w-5 text-stone" />
                      </button>
                      <h2 className="text-lg font-medium text-stone">سلتي</h2>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto p-4">
                      {displayItems.length === 0 ? (
                        <div className="py-16 text-center text-muted">
                          <p className="mb-3 text-4xl">🛒</p>
                          <p>السلة فارغة</p>
                        </div>
                      ) : (
                        <>
                          {displayItems.map((item) => (
                            <CartItem key={item.lineId} item={item} />
                          ))}
                          <CrossSellCarousel />
                        </>
                      )}
                    </div>

                    {displayItems.length > 0 && (
                      <div className="space-y-3 border-t border-white/10 p-4">
                        <div className="flex items-center justify-around text-xs text-muted">
                          <span>💳 الدفع عند الاستلام</span>
                          <span>📞 تأكيد بالجوال</span>
                          <span>💬 دعم واتساب</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-medium text-warm-sand">
                            {total} ريال
                          </span>
                          <span className="text-sm font-medium text-muted">
                            الإجمالي
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            closeCart();
                            openCheckout();
                          }}
                          className="w-full rounded-btn bg-najd-green py-4 text-base font-medium text-white transition-colors hover:bg-najd-green/80"
                        >
                          أكمل الطلب والدفع عند الاستلام
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      <CheckoutModal />
    </>
  );
}
