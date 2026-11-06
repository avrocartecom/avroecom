export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "avro_customer_secret_key_default";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const customer = await prisma.storeCustomer.findUnique({
      where: { email: cleanEmail },
      include: {
        _count: { select: { orders: true, wishlist: true } },
      },
    });

    if (!customer || !customer.passwordHash) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, customer.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    // Update last login
    await prisma.storeCustomer.update({
      where: { id: customer.id },
      data: { lastLoginAt: new Date() },
    });

    // Sign JWT
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        isGuest: false,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${customer.name}!`,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isGuest: false,
        ordersCount: customer._count.orders,
        wishlistCount: customer._count.wishlist,
      },
    });

    response.cookies.set({
      name: "customer_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/customer/auth/login error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Login failed." }, { status: 500 });
  }
}
