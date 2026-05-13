import { NextResponse } from "next/server";
import type { CreateOrderPayload } from "@/lib/api";
import { mockCreateOrder } from "@/lib/mock-orders-server";

export async function POST(req: Request) {
  let body: CreateOrderPayload;
  try {
    body = (await req.json()) as CreateOrderPayload;
  } catch (e) {
    console.error("[mock orders] invalid JSON body:", e);
    return NextResponse.json({ detail: "طلب غير صالح (JSON)" }, { status: 400 });
  }

  console.log("[mock orders] incoming payload:", {
    customer_name: body?.customer_name,
    phone: body?.phone,
    items: body?.items,
  });

  try {
    const res = mockCreateOrder(body);
    console.log("[mock orders] success:", res.order_id);
    return NextResponse.json(res);
  } catch (e: unknown) {
    const err = e as {
      code?: number;
      detail?: string;
      message?: string;
      stack?: string;
    };
    if (err.code === 422 && err.detail) {
      return NextResponse.json({ detail: err.detail }, { status: 422 });
    }
    if (err.code === 403 && err.detail) {
      return NextResponse.json({ detail: err.detail }, { status: 403 });
    }
    /* خطأ غير متوقع: كنطبعو فالـ server logs و كنرجعو رسالة مفيدة للمتصفح باش تبان فالـ DevTools */
    console.error("[mock orders] uncaught error:", err?.message, err?.stack);
    const detail =
      typeof err?.detail === "string" && err.detail.trim()
        ? err.detail
        : typeof err?.message === "string" && err.message.trim()
          ? `فشل في إنشاء الطلب — ${err.message}`
          : "فشل في إنشاء الطلب (خطأ غير معروف)";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
