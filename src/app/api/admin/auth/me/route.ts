export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.STORE_JWT_SECRET || "avro_store_admin_jwt_secret_token_prod_992176";

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get("avro_store_token")?.value;
    const authHeader = req.headers.get("authorization");
    const token = tokenCookie || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!token) {
      return NextResponse.json({ authenticated: false, error: "No active admin session." }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.scope !== "STORE_ADMIN") {
        return NextResponse.json({ authenticated: false, error: "Invalid token scope." }, { status: 403 });
      }

      // Fetch fresh user details from database
      const user = await prisma.storeAdmin.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          status: true,
          phone: true,
          avatar: true,
          lastLoginAt: true,
          createdAt: true,
        },
      });

      if (!user) {
        const response = NextResponse.json({ authenticated: false, error: "Administrator account no longer exists." }, { status: 401 });
        response.cookies.delete("avro_store_token");
        return response;
      }

      if (user.status === "SUSPENDED" || user.status === "INACTIVE") {
        const response = NextResponse.json({ authenticated: false, error: "Administrator account has been suspended." }, { status: 403 });
        response.cookies.delete("avro_store_token");
        return response;
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          name: user.name,
          username: user.username || user.email.split("@")[0],
          email: user.email,
          role: user.role,
          status: user.status || "ACTIVE",
          phone: user.phone || null,
          avatar: user.avatar || null,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      });
    } catch (jwtErr) {
      return NextResponse.json({ authenticated: false, error: "Admin session expired or invalid." }, { status: 401 });
    }
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: "Authentication check failed." }, { status: 500 });
  }
}
