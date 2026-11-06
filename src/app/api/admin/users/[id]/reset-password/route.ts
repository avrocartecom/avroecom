export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.STORE_JWT_SECRET || "avro_store_admin_jwt_secret_token_prod_992176";

async function getAuthAdmin(req: NextRequest) {
  const tokenCookie = req.cookies.get("avro_store_token")?.value;
  const authHeader = req.headers.get("authorization");
  const token = tokenCookie || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.scope !== "STORE_ADMIN") return null;

    const admin = await prisma.storeAdmin.findUnique({
      where: { id: decoded.userId },
    });
    if (!admin || admin.status === "SUSPENDED") return null;

    return admin;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    if (caller.role !== "OWNER" && caller.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Only Store Owners and Managers can reset user passwords." }, { status: 403 });
    }

    const targetUser = await prisma.storeAdmin.findUnique({
      where: { id: params.id },
    });
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Administrator not found." }, { status: 404 });
    }

    // Role check: Manager cannot reset Owner's password
    if (targetUser.role === "OWNER" && caller.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Only a Store Owner can reset another Owner's password." }, { status: 403 });
    }

    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "New password must be at least 8 characters long." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.storeAdmin.update({
      where: { id: params.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: `Password for "${targetUser.name}" has been reset successfully.`,
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to reset password." }, { status: 500 });
  }
}
