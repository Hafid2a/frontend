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
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-charcoal/90 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-charcoal/80">
      <div className="mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-4">
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full p-2 transition-colors hover:bg-stone/10"
            aria-label={`السلة (${itemCount})`}
          >
            <ShoppingCart className="h-6 w-6 text-stone" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-warm-sand text-xs font-bold text-stone">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full p-2 transition-colors hover:bg-stone/10 md:hidden"
            aria-label="القائمة"
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-stone" />
            ) : (
              <Menu className="h-5 w-5 text-stone" />
            )}
          </button>
        </div>

        <nav className="mx-2 hidden min-w-0 flex-1 items-center justify-center gap-4 lg:gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 whitespace-nowrap text-sm text-stone/80 transition-colors hover:text-stone"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="min-w-0 max-w-[13.25rem] shrink sm:max-w-[15rem] md:max-w-none md:shrink-0">
          <Logo size="md" />
        </div>
      </div>

      {mobileOpen ? (
        <div className="space-y-3 border-t border-stone/10 bg-charcoal px-4 py-4 md:hidden">
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
