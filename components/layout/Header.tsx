"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useCartStore } from "@/stores/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { TrustAnnouncementBar } from "./TrustAnnouncementBar";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المجموعة" },
  { href: "/about", label: "عن نجد" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export function Header() {
  const { items, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = items.length;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-deep-night/55 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-deep-night/45">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 transition-colors hover:bg-white/10"
            aria-label={`السلة (${itemCount})`}
          >
            <ShoppingCart className="h-6 w-6 text-stone" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-warm-sand text-xs font-bold text-deep-night">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 transition-colors hover:bg-white/10 md:hidden"
            aria-label="القائمة"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-stone" />
            ) : (
              <Menu className="h-5 w-5 text-stone" />
            )}
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-stone/80 transition-colors hover:text-stone"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Logo size="md" />
      </div>

      {mobileOpen ? (
        <div className="space-y-3 border-t border-white/5 bg-deep-night px-4 py-4 md:hidden">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-stone/80 hover:text-stone"
            >
              {label}
            </Link>
          ))}
        </div>
      ) : null}

      <TrustAnnouncementBar />
      <CartDrawer />
    </header>
  );
}
