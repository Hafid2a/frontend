"use client";

import { Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemType } from "@/stores/cart-store";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-3 bg-deep-night rounded-2xl p-3">
      <div className="w-16 h-16 rounded-xl bg-najd-green/30 flex items-center justify-center flex-shrink-0">
        <span className="text-warm-sand font-bold text-lg font-arabic">
          {item.nameAr[2]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-stone font-medium text-sm truncate">{item.nameAr}</p>
        <p className="text-muted text-xs font-medium">{item.unitLabel}</p>
        <p className="text-warm-sand font-medium text-sm mt-1">
          {item.priceSar} ريال
        </p>
      </div>

      <button
        onClick={() => removeItem(item.lineId)}
        className="p-2 hover:bg-stone/10 rounded-lg transition-colors text-muted hover:text-error"
        aria-label="حذف من السلة"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
