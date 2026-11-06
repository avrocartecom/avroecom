export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const email = searchParams.get("email");

    if (!customerId && !email) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (email) where.customerEmail = email.toLowerCase().trim();

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error("GET /api/customer/orders error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load orders." }, { status: 500 });
  }
}
