export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "avro_customer_secret_key_default";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    const customer = await prisma.storeCustomer.findUnique({
      where: { id: decoded.id },
      include: {
        _count: { select: { orders: true, wishlist: true } },
      },
    });

    if (!customer) {
      return NextResponse.json({ authenticated: false, customer: null });
    }

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isGuest: customer.isGuest,
        ordersCount: customer._count.orders,
        wishlistCount: customer._count.wishlist,
      },
    });
  } catch (err: any) {
    console.error("GET /api/customer/auth/me error:", err);
    return NextResponse.json({ authenticated: false, customer: null }, { status: 500 });
  }
}
