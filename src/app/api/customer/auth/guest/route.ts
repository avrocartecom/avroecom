export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "avro_customer_secret_key_default";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is allowed for anonymous guest login
    }

    const { guestEmail, guestName } = body;
    const guestUuid = crypto.randomBytes(6).toString("hex");

    const email = guestEmail
      ? guestEmail.toLowerCase().trim()
      : `guest_${guestUuid}@guest.store`;
    const name = guestName?.trim() || "Guest Shopper";

    // Check if guest record already exists for this email
    let customer = await prisma.storeCustomer.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.storeCustomer.create({
        data: {
          name,
          email,
          isGuest: true,
          lastLoginAt: new Date(),
        },
      });
    }

    // Sign JWT as guest
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        isGuest: true,
        guestId: guestUuid,
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Continuing as Guest Shopper.",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        isGuest: true,
      },
    });

    response.cookies.set({
      name: "customer_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60, // 14 days
    });

    // Also set guest tracking cookie for wishlist persistence
    response.cookies.set({
      name: "guest_id",
      value: guestUuid,
      httpOnly: false, // Accessible to client-side localStorage/wishlist
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/customer/auth/guest error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Guest login failed." }, { status: 500 });
  }
}
