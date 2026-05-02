const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string })?.detail || "فشل في إنشاء الطلب");
  }
  return res.json();
}

export async function acceptUpsell(
  orderId: string,
  eventId?: string
): Promise<{ order_id: string; upsell_added: boolean; total_sar: number }> {
  const res = await fetch(`${API_URL}/orders/${orderId}/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_id: eventId }),
  });
  if (!res.ok) throw new Error("فشل في إضافة المنتج");
  return res.json();
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  const res = await fetch(`${API_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error("الطلب غير موجود");
  return res.json();
}
