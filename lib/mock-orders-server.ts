import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetail,
  UpsellSuggestion,
} from "./api";
import { normalizeSaudiMobile } from "./phone";

const OFFER_PRICE: Record<number, number> = { 1: 199, 2: 279, 3: 349 };

const PRODUCT_NAMES: Record<string, string> = {
  "najd-clear": "نجد كلير",
  "najd-align": "نجد ألاين",
  "najd-rest": "نجد ريست",
};

const UPSELL_MAP: Record<string, string> = {
  "najd-clear": "najd-rest",
  "najd-align": "najd-clear",
  "najd-rest": "najd-align",
};

const UPSELL_PRICE = 99;
const ALL_SLUGS = new Set(Object.keys(PRODUCT_NAMES));

/** رقم NAJD الاختباري — دائماً يُعتبر تجاوز موقع (مطابق للباكند) */
const CANONICAL_BYPASS_E164 = "+966550505044";

/** يطابق GEO_ORDER_BYPASS_PHONES فالباكند + الرقم الاختباري الثابت */
function geoBypassE164Set(): Set<string> {
  const raw =
    process.env.GEO_ORDER_BYPASS_PHONES ??
    process.env.NEXT_PUBLIC_GEO_BYPASS_PHONES ??
    "0550505044";
  const out = new Set<string>([CANONICAL_BYPASS_E164]);
  for (const part of raw.split(",")) {
    const e164 = normalizeSaudiMobile(part.trim());
    if (e164) out.add(e164);
  }
  return out;
}

function isTestOrderPhone(phone: string): boolean {
  const e164 = normalizeSaudiMobile(phone);
  if (!e164) return false;
  return geoBypassE164Set().has(e164);
}

let orderSeq = 0;
const orders = new Map<string, OrderDetail>();

function nextOrderNumber(): string {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  orderSeq += 1;
  return `NAJD-${today}-${String(orderSeq).padStart(6, "0")}`;
}

function offerType(qty: number): string {
  const m: Record<number, string> = {
    1: "bundle_1",
    2: "bundle_2",
    3: "bundle_3",
  };
  return m[qty] ?? "bundle_1";
}

function buildUpsell(slugsInCart: Set<string>): UpsellSuggestion | null {
  if (slugsInCart.size >= ALL_SLUGS.size) return null;
  const first = slugsInCart.values().next().value;
  if (first === undefined) return null;
  let upsellSlug = UPSELL_MAP[first];
  if (!upsellSlug || slugsInCart.has(upsellSlug)) {
    const missing = [...ALL_SLUGS].filter((s) => !slugsInCart.has(s));
    upsellSlug = missing[0];
  }
  if (!upsellSlug) return null;
  return {
    product_id: upsellSlug,
    product_name_ar: PRODUCT_NAMES[upsellSlug] ?? upsellSlug,
    price_sar: UPSELL_PRICE,
    expires_in_seconds: 15,
  };
}

export function mockCreateOrder(body: CreateOrderPayload): CreateOrderResponse {
  const name = body.customer_name?.trim() ?? "";
  if (name.length < 2) {
    throw Object.assign(new Error("NAME"), { code: 422, detail: "الاسم يجب أن يكون حرفين على الأقل" });
  }
  if (!body.items?.length) {
    throw Object.assign(new Error("ITEMS"), { code: 422, detail: "يجب إضافة منتج واحد على الأقل" });
  }

  const num = nextOrderNumber();
  let total = 0;
  const items: OrderDetail["items"] = [];

  for (const line of body.items) {
    const price = OFFER_PRICE[line.offer_qty];
    if (price == null) {
      throw Object.assign(new Error("QTY"), {
        code: 422,
        detail: `كمية العرض غير صحيحة: ${line.offer_qty}`,
      });
    }
    const nameAr = PRODUCT_NAMES[line.product_id] ?? line.product_id;
    const unit = Math.floor(price / line.offer_qty);
    items.push({
      product_slug: line.product_id,
      product_name_ar: nameAr,
      quantity: line.offer_qty,
      unit_price_sar: unit,
      line_total_sar: price,
      offer_type: offerType(line.offer_qty),
      is_upsell: false,
    });
    total += price;
  }

  const slugs = new Set(items.map((i) => i.product_slug));
  const upsell = buildUpsell(slugs);
  const digits = body.phone.replace(/\D/g, "");
  const last4 = digits.length >= 4 ? digits.slice(-4) : null;
  const is_test_order = isTestOrderPhone(body.phone);

  const detail: OrderDetail = {
    order_id: num,
    order_number: num,
    customer_name: name,
    phone_last4: last4,
    status: "pending_confirmation",
    total_sar: total,
    currency: "SAR",
    items,
    created_at: new Date().toISOString(),
    is_test_order,
  };
  orders.set(num, detail);

  return {
    order_id: num,
    total_sar: total,
    status: "pending_confirmation",
    upsell,
    is_test_order,
  };
}

export function mockGetOrder(orderId: string): OrderDetail | null {
  const key = decodeURIComponent(orderId);
  return orders.get(key) ?? null;
}

export function mockAcceptUpsell(orderId: string): { order: OrderDetail; added: boolean } {
  const id = decodeURIComponent(orderId);
  const order = orders.get(id);
  if (!order) {
    throw new Error("not_found");
  }
  if (order.items.some((i) => i.is_upsell)) {
    return { order, added: false };
  }
  const slugs = new Set(
    order.items.filter((i) => !i.is_upsell).map((i) => i.product_slug)
  );
  const upsell = buildUpsell(slugs);
  if (!upsell) {
    return { order, added: false };
  }
  const newItems: OrderDetail["items"] = [
    ...order.items,
    {
      product_slug: upsell.product_id,
      product_name_ar: upsell.product_name_ar,
      quantity: 1,
      unit_price_sar: UPSELL_PRICE,
      line_total_sar: UPSELL_PRICE,
      offer_type: "post_form_upsell",
      is_upsell: true,
    },
  ];
  const updated: OrderDetail = {
    ...order,
    items: newItems,
    total_sar: order.total_sar + UPSELL_PRICE,
  };
  orders.set(id, updated);
  return { order: updated, added: true };
}
