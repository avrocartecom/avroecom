export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getStorePermissions } from "@/lib/permissions";

const JWT_SECRET = process.env.STORE_JWT_SECRET || "avro_store_admin_jwt_secret_token_prod_992176";

// Auth helper
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

// GET: List all store admins
export async function GET(req: NextRequest) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    const users = await prisma.storeAdmin.findMany({
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
        lastLoginIp: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { role: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      users: users.map((u) => ({
        ...u,
        username: u.username || u.email.split("@")[0],
        status: u.status || "ACTIVE",
      })),
      caller: {
        id: caller.id,
        role: caller.role,
      },
    });
  } catch (err: any) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to list users." }, { status: 500 });
  }
}

// POST: Create a new store admin
export async function POST(req: NextRequest) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    // Only OWNER and MANAGER can create other users
    if (caller.role !== "OWNER" && caller.role !== "MANAGER") {
      return NextResponse.json(
        { success: false, error: "Only Store Owners and Managers can add administrators." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, username, email, password, role = "STAFF", status = "ACTIVE", phone, avatar } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Full Name, Email, and Password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
    }

    let cleanUsername = (username || cleanEmail.split("@")[0]).trim().toLowerCase();
    if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(cleanUsername)) {
      cleanUsername = cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9_.-]/g, "_");
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Role restrictions: Only OWNER can create other OWNER accounts
    if (role === "OWNER" && caller.role !== "OWNER") {
      return NextResponse.json(
        { success: false, error: "Only an existing Store Owner can grant the OWNER role." },
        { status: 403 }
      );
    }

    // Check subscription plan admin seats limit
    const permissions = await getStorePermissions();
    const maxAllowed = permissions.entitlements.maxAdminUsers || 1;
    const currentCount = await prisma.storeAdmin.count();

    if (currentCount >= maxAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Your current ${permissions.plan} plan allows up to ${maxAllowed} administrator account(s). Upgrade your subscription to add additional team members.`,
          requiresUpgrade: true,
          currentPlan: permissions.plan,
          maxAllowed,
          currentCount,
        },
        { status: 403 }
      );
    }

    // Check email uniqueness
    const existingEmail = await prisma.storeAdmin.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: `Email "${cleanEmail}" is already registered to an administrator.` },
        { status: 409 }
      );
    }

    // Check username uniqueness
    const existingUser = await prisma.storeAdmin.findFirst({
      where: { username: cleanUsername },
    });
    if (existingUser) {
      // Append random digits if default collided
      cleanUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.storeAdmin.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        role: ["OWNER", "MANAGER", "STAFF", "SUPPORT"].includes(role) ? role : "STAFF",
        status: ["ACTIVE", "INACTIVE", "SUSPENDED"].includes(status) ? status : "ACTIVE",
        phone: phone ? String(phone).trim() : null,
        avatar: avatar ? String(avatar).trim() : null,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Administrator "${newUser.name}" created successfully.`,
      user: newUser,
    });
  } catch (err: any) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to create administrator." }, { status: 500 });
  }
}
