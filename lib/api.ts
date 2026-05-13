/** وضع تجريبي: طلبات داخل Next.js بدون FastAPI */
export function useMockOrdersApi(): boolean {
  const v = process.env.NEXT_PUBLIC_MOCK_ORDERS;
  return v === "true" || v === "1";
}

/**
 * الطلبات من المتصفح نحو /api/backend تتفادى CORS.
 * معاينات Easypanel (*.easypanel.host): البروكسي يُفعَّل تلقائياً حتى مع build فيه USE_API_PROXY=false.
 * عندها لازم BACKEND_INTERNAL_URL عند تشغيل خادم Next (انظر deploy/easypanel-frontend.env).
 */
export function useBackendProxy(): boolean {
  if (typeof window !== "undefined") {
    const h = window.location.hostname.toLowerCase();
    if (h.endsWith(".easypanel.host")) {
      return true;
    }
  }

  const v = process.env.NEXT_PUBLIC_USE_API_PROXY?.trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;

  return process.env.NODE_ENV === "development";
}

/** يطابق ترتيب الاشتقاق في next.config.ts (عنوان المتصفّح للوضع غير البروكسي). */
const REMOTE_API = (
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  process.env.API_BASE_URL?.trim() ||
  process.env.API_URL?.trim() ||
  "http://localhost:8000"
).replace(/\/$/, "");

function browserOrdersBase(): string {
  if (useBackendProxy()) return "/api/backend";
  return REMOTE_API;
}

function ordersPostUrl(): string {
  if (useMockOrdersApi()) return "/api/orders";
  return `${browserOrdersBase()}/orders`;
}

function orderResourceUrl(orderId: string, suffix: "" | "/upsell"): string {
  const enc = encodeURIComponent(orderId);
  if (useMockOrdersApi()) {
    return `/api/orders/${enc}${suffix}`;
  }
  return `${browserOrdersBase()}/orders/${enc}${suffix}`;
}

function formatApiDetail(detail: unknown): string {
  if (typeof detail === "string") return detail.trim();
  if (Array.isArray(detail)) {
    const parts = detail
      .map((x) => {
        if (typeof x === "string") return x;
        if (typeof x !== "object" || x === null) return "";
        const o = x as {
          msg?: unknown;
          loc?: unknown;
          type?: unknown;
        };
        const msg =
          typeof o.msg === "string"
            ? o.msg
            : o.msg != null
              ? String(o.msg)
              : "";
        if (!msg) return "";
        const loc = Array.isArray(o.loc)
          ? o.loc.map((part) => String(part)).join(".")
          : "";
        const shortLoc = loc.replace(/^body\.?/, "");
        return shortLoc ? `${shortLoc}: ${msg}` : msg;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(" — ");
  }
  if (detail !== null && typeof detail === "object") return "";
  return "";
}

/** يستخرج رسالة خطأ FastAPI وأي وكيل أمامها (nginx، Cloudflare، …). */
export function parseApiErrorBody(body: unknown): string {
  if (typeof body !== "object" || body === null) return "";
  const obj = body as Record<string, unknown>;
  const fromDetail = formatApiDetail(obj.detail);
  if (fromDetail) return fromDetail;
  if (typeof obj.message === "string" && obj.message.trim())
    return obj.message.trim();
  return "";
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function parseOrderErrorResponse(res: Response): Promise<string> {
  const suffix = `[HTTP ${res.status}]`;
  const raw = await res.text();
  if (!raw.trim()) {
    return `تعذر إنشاء الطلب؛ الخادم أرسل رداً فارغاً ${suffix}. تحقّق من أن عنوان الـAPI شغّال وقاعدة البيانات متصلة.`;
  }
  try {
    const body = JSON.parse(raw) as unknown;
    const fromDetail = parseApiErrorBody(body);
    if (fromDetail) return `${fromDetail} ${suffix}`;
  } catch {
    /* ليس JSON */
  }
  const snippet = stripHtml(raw.slice(0, 240));
  if (snippet.length > 0 && snippet.length < 220) {
    return `تعذر إنشاء الطلب ${suffix}. ${snippet}`;
  }
  if (snippet.length > 0) {
    return `تعذر إنشاء الطلب ${suffix}. رد الخادم ليس بتنسيق JSON (غالباً صفحة خطأ أمام الباكند).`;
  }
  return `تعذر إنشاء الطلب ${suffix}`;
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
    const msg = await parseOrderErrorResponse(res);
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
