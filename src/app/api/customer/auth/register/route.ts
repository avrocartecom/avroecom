export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "avro_customer_secret_key_default";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing customer
    const existing = await prisma.storeCustomer.findUnique({
      where: { email: cleanEmail },
    });

    if (existing && !existing.isGuest && existing.passwordHash) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let customer;
    if (existing && existing.isGuest) {
      // Upgrade existing guest account to full customer account!
      customer = await prisma.storeCustomer.update({
        where: { id: existing.id },
        data: {
          name: name.trim(),
          passwordHash,
          phone: phone || existing.phone,
          isGuest: false,
          lastLoginAt: new Date(),
        },
      });
    } else {
      customer = await prisma.storeCustomer.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          passwordHash,
          phone: phone?.trim() || null,
          isGuest: false,
          lastLoginAt: new Date(),
        },
      });
    }

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
      message: "Account created successfully!",
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isGuest: false,
      },
    });

    response.cookies.set({
      name: "customer_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error("POST /api/customer/auth/register error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Registration failed." }, { status: 500 });
  }
}
