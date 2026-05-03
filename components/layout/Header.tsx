"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCartStore } from "@/stores/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { TrustAnnouncementBar } from "./TrustAnnouncementBar";

export function Header() {
  const { items, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = items.length;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-deep-night/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Cart icon on left (RTL: start) */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={`السلة (${itemCount})`}
          >
            <ShoppingCart className="w-6 h-6 text-stone" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-warm-sand text-deep-night text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="القائمة"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-stone" />
            ) : (
              <Menu className="w-5 h-5 text-stone" />
            )}
          </button>
        </div>

        {/* Nav center */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-stone/80 hover:text-stone text-sm transition-colors"
          >
            المنتجات
          </Link>
          <Link
            href="/thank-you"
            className="text-stone/80 hover:text-stone text-sm transition-colors"
          >
            بعد الشراء
          </Link>
          <Link
            href="/about"
            className="text-stone/80 hover:text-stone text-sm transition-colors"
          >
            من نحن
          </Link>
          <Link
            href="/contact"
            className="text-stone/80 hover:text-stone text-sm transition-colors"
          >
            تواصل معنا
          </Link>
        </nav>

        {/* Logo on right (RTL) */}
        <Logo size="md" />
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-deep-night border-t border-white/5 px-4 py-4 space-y-3">
          <Link
            href="/products"
            onClick={() => setMobileOpen(false)}
            className="block text-stone/80 hover:text-stone py-2 text-sm"
          >
            المنتجات
          </Link>
          <Link
            href="/thank-you"
            onClick={() => setMobileOpen(false)}
            className="block text-stone/80 hover:text-stone py-2 text-sm"
          >
            بعد الشراء
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileOpen(false)}
            className="block text-stone/80 hover:text-stone py-2 text-sm"
          >
            من نحن
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block text-stone/80 hover:text-stone py-2 text-sm"
          >
            تواصل معنا
          </Link>
        </div>
      )}

      <TrustAnnouncementBar />
      <CartDrawer />
    </header>
  );
}
