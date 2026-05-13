import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetail,
  UpsellSuggestion,
} from "./api";
import { normalizeSaudiMobile } from "./phone";

const OFFER_PRICE: Record<number, number> = { 1: 199, 2: 279, 3: 349 };

const PRODUCT_NAMES: Record<string, string> = {
  "najd-thabat-al-khat": "نجد ثبات الخط",
  "najd-darag-al-nahar": "نجد درع النهار",
  "najd-safa-al-jabha": "نجد صفاء الجبهة",
};

const UPSELL_MAP: Record<string, string> = {
  "najd-thabat-al-khat": "najd-safa-al-jabha",
  "najd-darag-al-nahar": "najd-thabat-al-khat",
  "najd-safa-al-jabha": "najd-darag-al-nahar",
};

const UPSELL_PRICE = 99;
const ALL_SLUGS = new Set(Object.keys(PRODUCT_NAMES));

/** رقم الاختبار الوحيد (تجاوز موقع فالمحاكاة — مطابق للباكند) */
const CANONICAL_BYPASS_E164 = "+966550505044";

function isTestOrderPhone(phone: string): boolean {
  const e164 = normalizeSaudiMobile(phone);
  if (!e164) return false;
  return e164 === CANONICAL_BYPASS_E164;
}

/** أي جوال سعودي في MOCK — للمطورين المحليين فقط */
function mockAllowAnySaudiPhone(): boolean {
  const v = process.env.NEXT_PUBLIC_MOCK_ALLOW_ANY_SAUDI?.trim().toLowerCase();
  return v === "true" || v === "1";
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

  if (!mockAllowAnySaudiPhone() && !isTestOrderPhone(body.phone)) {
    throw Object.assign(new Error("GEO"), {
      code: 403,
      detail:
        "تعذر إتمام الطلب من هذا الاتصال. تأكد أنك داخل المملكة وأنك لا تستخدم شبكة افتراضية خاصة (VPN) أو بروكسي. في وضع التجربة بدون باكند يُقبل رقم الاختبار 0550505044 فقط.",
    });
  }

  const num = nextOrderNumber();
  let total = 0;
  const items: OrderDetail["items"] = [];

  for (const line of body.items) {
    /* fallback آمن: إذا كانت `offer_qty` غير معرفة في `OFFER_PRICE`،
       نعتمد على `price_sar` المرسل من السلة بدل ما نطيش الطلب كامل. */
    const qty =
      typeof line.offer_qty === "number" && line.offer_qty > 0
        ? Math.floor(line.offer_qty)
        : 1;
    const fallbackPrice =
      typeof line.price_sar === "number" && line.price_sar > 0
        ? Math.floor(line.price_sar)
        : 0;
    const price = OFFER_PRICE[qty] ?? fallbackPrice;
    if (price <= 0) {
      throw Object.assign(new Error("QTY"), {
        code: 422,
        detail: `كمية العرض غير صحيحة: ${line.offer_qty}`,
      });
    }
    const nameAr = PRODUCT_NAMES[line.product_id] ?? line.product_id;
    const unit = Math.max(1, Math.floor(price / qty));
    items.push({
      product_slug: line.product_id,
      product_name_ar: nameAr,
      quantity: qty,
      unit_price_sar: unit,
      line_total_sar: price,
      offer_type: offerType(qty),
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
