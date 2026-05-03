import { NextResponse } from "next/server";
import { mockAcceptUpsell } from "@/lib/mock-orders-server";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await ctx.params;
  try {
    const { order, added } = mockAcceptUpsell(orderId);
    return NextResponse.json({
      order_id: order.order_number,
      upsell_added: added,
      total_sar: order.total_sar,
      message: added ? "تمت إضافة المنتج للطلب" : "لم يتم إضافة المنتج",
    });
  } catch {
    return NextResponse.json({ detail: "الطلب غير موجود" }, { status: 404 });
  }
}
