"use client";

import { generateEventId } from "./event-id";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (
        event: string,
        params?: object,
        opts?: { event_id?: string }
      ) => void;
    };
    snaptr?: (action: string, event: string, params?: object) => void;
    _pixelQueue: Array<() => void>;
    _pixelsLoaded: boolean;
  }
}

function enqueue(fn: () => void) {
  if (typeof window === "undefined") return;
  if (window._pixelsLoaded) {
    fn();
  } else {
    window._pixelQueue = window._pixelQueue || [];
    window._pixelQueue.push(fn);
  }
}

export function trackPageView() {
  enqueue(() => {
    window.fbq?.("track", "PageView");
    window.ttq?.track("PageView");
    window.snaptr?.("track", "PAGE_VIEW");
  });
}

export function trackViewContent(
  product: { slug: string; nameAr: string; price: number },
  eventId: string
) {
  enqueue(() => {
    window.fbq?.(
      "track",
      "ViewContent",
      {
        content_ids: [product.slug],
        content_name: product.nameAr,
        value: product.price,
        currency: "SAR",
      },
      { eventID: eventId }
    );
    window.ttq?.track(
      "ViewContent",
      {
        content_id: product.slug,
        content_name: product.nameAr,
        value: product.price,
        currency: "SAR",
      },
      { event_id: eventId }
    );
    window.snaptr?.("track", "VIEW_CONTENT", {
      item_ids: [product.slug],
      price: product.price,
      currency: "SAR",
      client_dedup_id: eventId,
    });
  });
}

export function trackAddToCart(
  item: { slug: string; nameAr: string; price: number; qty: number },
  eventId: string
) {
  enqueue(() => {
    window.fbq?.(
      "track",
      "AddToCart",
      {
        content_ids: [item.slug],
        content_name: item.nameAr,
        value: item.price,
        currency: "SAR",
      },
      { eventID: eventId }
    );
    window.ttq?.track(
      "AddToCart",
      {
        content_id: item.slug,
        quantity: item.qty,
        value: item.price,
        currency: "SAR",
      },
      { event_id: eventId }
    );
    window.snaptr?.("track", "ADD_CART", {
      item_ids: [item.slug],
      price: item.price,
      currency: "SAR",
      client_dedup_id: eventId,
    });
  });
}

export function trackInitiateCheckout(
  cart: { total: number; items: Array<{ slug: string }> },
  eventId: string
) {
  enqueue(() => {
    window.fbq?.(
      "track",
      "InitiateCheckout",
      { value: cart.total, currency: "SAR" },
      { eventID: eventId }
    );
    window.ttq?.track(
      "InitiateCheckout",
      { value: cart.total, currency: "SAR" },
      { event_id: eventId }
    );
    window.snaptr?.("track", "START_CHECKOUT", {
      price: cart.total,
      currency: "SAR",
      client_dedup_id: eventId,
    });
  });
}

export function trackPurchase(
  order: {
    id: string;
    total: number;
    items: Array<{ slug: string; qty: number; price: number }>;
  },
  eventId: string
) {
  enqueue(() => {
    window.fbq?.(
      "track",
      "Purchase",
      {
        value: order.total,
        currency: "SAR",
        content_ids: order.items.map((i) => i.slug),
      },
      { eventID: eventId }
    );
    window.ttq?.track(
      "CompletePayment",
      { value: order.total, currency: "SAR" },
      { event_id: eventId }
    );
    window.snaptr?.("track", "PURCHASE", {
      price: order.total,
      currency: "SAR",
      client_dedup_id: eventId,
    });
  });
}

export { generateEventId };
