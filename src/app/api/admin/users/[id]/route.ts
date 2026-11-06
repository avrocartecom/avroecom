export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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

// GET: Single user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    const user = await prisma.storeAdmin.findUnique({
      where: { id: params.id },
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
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Administrator not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to load user." }, { status: 500 });
  }
}

// PUT: Update user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    if (caller.role !== "OWNER" && caller.role !== "MANAGER") {
      return NextResponse.json({ success: false, error: "Only Owners and Managers can edit users." }, { status: 403 });
    }

    const targetUser = await prisma.storeAdmin.findUnique({
      where: { id: params.id },
    });
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Administrator not found." }, { status: 404 });
    }

    // Role hierarchy: Managers cannot edit Owners
    if (targetUser.role === "OWNER" && caller.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Only a Store Owner can edit another Owner." }, { status: 403 });
    }

    const body = await req.json();
    const { name, username, email, role, status, phone, avatar } = body;

    const updateData: any = {};

    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone ? String(phone).trim() : null;
    if (avatar !== undefined) updateData.avatar = avatar ? String(avatar).trim() : null;

    // Username check
    if (username) {
      const cleanUsername = username.trim().toLowerCase();
      if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(cleanUsername)) {
        return NextResponse.json(
          { success: false, error: "Username must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores." },
          { status: 400 }
        );
      }
      if (cleanUsername !== (targetUser.username || "").toLowerCase()) {
        const collision = await prisma.storeAdmin.findFirst({
          where: { username: cleanUsername, NOT: { id: targetUser.id } },
        });
        if (collision) {
          return NextResponse.json({ success: false, error: `Username "${cleanUsername}" is already taken.` }, { status: 409 });
        }
        updateData.username = cleanUsername;
      }
    }

    // Email check
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return NextResponse.json({ success: false, error: "Please enter a valid email address." }, { status: 400 });
      }
      if (cleanEmail !== targetUser.email.toLowerCase()) {
        const collision = await prisma.storeAdmin.findFirst({
          where: { email: cleanEmail, NOT: { id: targetUser.id } },
        });
        if (collision) {
          return NextResponse.json({ success: false, error: `Email "${cleanEmail}" is already in use.` }, { status: 409 });
        }
        updateData.email = cleanEmail;
      }
    }

    // Status check & self-suspension guard
    if (status) {
      if (caller.id === targetUser.id && status !== "ACTIVE") {
        return NextResponse.json({ success: false, error: "You cannot suspend or deactivate your own account." }, { status: 400 });
      }

      // Guard: Cannot suspend the last OWNER
      if (targetUser.role === "OWNER" && status !== "ACTIVE") {
        const activeOwners = await prisma.storeAdmin.count({
          where: { role: "OWNER", status: "ACTIVE" },
        });
        if (activeOwners <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot suspend the only active Store Owner. Promote another administrator first." },
            { status: 400 }
          );
        }
      }

      updateData.status = status;
    }

    // Role check & demotion guard
    if (role && role !== targetUser.role) {
      if (caller.role !== "OWNER") {
        return NextResponse.json({ success: false, error: "Only Store Owners can change administrative roles." }, { status: 403 });
      }

      if (targetUser.role === "OWNER" && role !== "OWNER") {
        const ownersCount = await prisma.storeAdmin.count({
          where: { role: "OWNER" },
        });
        if (ownersCount <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot demote the only Store Owner. Promote another administrator to Owner first." },
            { status: 400 }
          );
        }
      }

      updateData.role = role;
    }

    const updated = await prisma.storeAdmin.update({
      where: { id: targetUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Administrator "${updated.name}" updated successfully.`,
      user: updated,
    });
  } catch (err: any) {
    console.error("PUT /api/admin/users/[id] error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to update user." }, { status: 500 });
  }
}

// DELETE: Remove administrator
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caller = await getAuthAdmin(req);
    if (!caller) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    if (caller.role !== "OWNER") {
      return NextResponse.json({ success: false, error: "Only Store Owners have permission to delete administrators." }, { status: 403 });
    }

    if (caller.id === params.id) {
      return NextResponse.json({ success: false, error: "You cannot delete your own administrator account." }, { status: 400 });
    }

    const targetUser = await prisma.storeAdmin.findUnique({
      where: { id: params.id },
    });
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Administrator not found." }, { status: 404 });
    }

    // Guard: Cannot delete the only OWNER
    if (targetUser.role === "OWNER") {
      const ownersCount = await prisma.storeAdmin.count({
        where: { role: "OWNER" },
      });
      if (ownersCount <= 1) {
        return NextResponse.json(
          { success: false, error: "Cannot delete the sole Store Owner." },
          { status: 400 }
        );
      }
    }

    await prisma.storeAdmin.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Administrator "${targetUser.name}" has been removed from the backoffice.`,
    });
  } catch (err: any) {
    console.error("DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete user." }, { status: 500 });
  }
}
