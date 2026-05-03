import { NextResponse } from "next/server";
import type { CreateOrderPayload } from "@/lib/api";
import { mockCreateOrder } from "@/lib/mock-orders-server";

export async function POST(req: Request) {
  let body: CreateOrderPayload;
  try {
    body = (await req.json()) as CreateOrderPayload;
  } catch {
    return NextResponse.json({ detail: "طلب غير صالح" }, { status: 400 });
  }

  try {
    const res = mockCreateOrder(body);
    return NextResponse.json(res);
  } catch (e: unknown) {
    const err = e as { code?: number; detail?: string; message?: string };
    if (err.code === 422 && err.detail) {
      return NextResponse.json({ detail: err.detail }, { status: 422 });
    }
    return NextResponse.json({ detail: "فشل في إنشاء الطلب" }, { status: 500 });
  }
}
