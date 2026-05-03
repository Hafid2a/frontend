/** وضع تجريبي: طلبات داخل Next.js بدون FastAPI (مناسب إن ما كانش الباكند شغال) */
export function useMockOrdersApi(): boolean {
  const v = process.env.NEXT_PUBLIC_MOCK_ORDERS;
  return v === "true" || v === "1";
}

/** طلبات حقيقية: عبر بروكسي Next (نفس الدومين) لتفادي CORS و Failed to fetch */
function ordersPostUrl(): string {
  return useMockOrdersApi() ? "/api/orders" : "/api/backend/orders";
}

function orderResourceUrl(orderId: string, suffix: "" | "/upsell"): string {
  const enc = encodeURIComponent(orderId);
  if (useMockOrdersApi()) {
    return `/api/orders/${enc}${suffix}`;
  }
  return `/api/backend/orders/${enc}${suffix}`;
}

function formatApiDetail(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((x) =>
        typeof x === "object" && x !== null && "msg" in x
          ? String((x as { msg: unknown }).msg)
          : typeof x === "string"
            ? x
            : ""
      )
      .filter(Boolean);
    if (parts.length) return parts.join(" — ");
  }
  return "";
}

export function parseApiErrorBody(body: unknown): string {
  if (typeof body !== "object" || body === null) return "";
  const d = (body as { detail?: unknown }).detail;
  return formatApiDetail(d);
}

export interface OrderItem {
  product_id: string;
  offer_qty: number;
  price_sar: number;
}

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  items: OrderItem[];
  utm?: Record<string, string | undefined>;
  click_ids?: { fbclid?: string; ttclid?: string; sc_click_id?: string };
  browser?: {
    user_agent?: string;
    ip?: string;
    fbp?: string;
    fbc?: string;
    ttp?: string;
    scid?: string;
  };
  event_ids?: { initiate_checkout?: string; purchase?: string };
  landing_page?: string;
  referrer?: string;
}

export interface UpsellSuggestion {
  product_id: string;
  product_name_ar: string;
  price_sar: number;
  expires_in_seconds: number;
}

export interface CreateOrderResponse {
  order_id: string;
  total_sar: number;
  status: string;
  upsell: UpsellSuggestion | null;
  /** طلب تجريبي (رقم في قائمة تجاوز الموقع) — لا يُرسل للشيت ولا CAPI */
  is_test_order?: boolean;
}

export interface OrderDetail {
  order_id: string;
  order_number: string;
  customer_name: string;
  phone_last4: string | null;
  status: string;
  total_sar: number;
  currency: string;
  items: Array<{
    product_slug: string;
    product_name_ar: string;
    quantity: number;
    unit_price_sar: number;
    line_total_sar: number;
    offer_type: string;
    is_upsell: boolean;
  }>;
  created_at: string;
  is_test_order?: boolean;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch(ordersPostUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = parseApiErrorBody(err) || "فشل في إنشاء الطلب";
    throw new Error(msg);
  }
  return res.json();
}

export async function acceptUpsell(
  orderId: string,
  eventId?: string
): Promise<{ order_id: string; upsell_added: boolean; total_sar: number }> {
  const res = await fetch(orderResourceUrl(orderId, "/upsell"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId }),
  });
  if (!res.ok) throw new Error("فشل في إضافة المنتج");
  return res.json();
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  const res = await fetch(orderResourceUrl(orderId, ""));
  if (!res.ok) throw new Error("الطلب غير موجود");
  return res.json();
}
