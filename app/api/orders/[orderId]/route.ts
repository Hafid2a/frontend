import { NextResponse } from "next/server";
import { mockGetOrder } from "@/lib/mock-orders-server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await ctx.params;
  const order = mockGetOrder(orderId);
  if (!order) {
    return NextResponse.json({ detail: "الطلب غير موجود" }, { status: 404 });
  }
  return NextResponse.json(order);
}
