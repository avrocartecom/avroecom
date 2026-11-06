export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.STORE_JWT_SECRET || "avro_store_admin_jwt_secret_token_prod_992176";

// Helper to authenticate request
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

// GET: Current Admin Profile
export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: admin.id,
        name: admin.name,
        username: admin.username || admin.email.split("@")[0],
        email: admin.email,
        role: admin.role,
        status: admin.status || "ACTIVE",
        phone: admin.phone || "",
        avatar: admin.avatar || "",
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
      },
    });
  } catch (err: any) {
    console.error("GET profile error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load profile." }, { status: 500 });
  }
}

// PUT: Update Username, Details, or Password
export async function PUT(req: NextRequest) {
  try {
    const admin = await getAuthAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized session." }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      username,
      email,
      phone,
      avatar,
      currentPassword,
      newPassword,
      action = "UPDATE_PROFILE", // UPDATE_PROFILE | CHANGE_PASSWORD | UPDATE_ALL
    } = body;

    const updateData: any = {};
    let passwordChanged = false;

    // 1. Password Change Validation
    if (action === "CHANGE_PASSWORD" || action === "UPDATE_ALL" || newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required to authorize a password change." },
          { status: 400 }
        );
      }

      const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect. Verification failed." },
          { status: 403 }
        );
      }

      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 8 characters long." },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
      passwordChanged = true;
    }

    // 2. Profile Details Updates (Username, Email, Name, Phone, Avatar)
    if (action === "UPDATE_PROFILE" || action === "UPDATE_ALL" || name || username || email) {
      if (name && typeof name === "string") {
        updateData.name = name.trim();
      }

      if (phone !== undefined) {
        updateData.phone = typeof phone === "string" ? phone.trim() : null;
      }

      if (avatar !== undefined) {
        updateData.avatar = typeof avatar === "string" ? avatar.trim() : null;
      }

      // Username uniqueness check
      if (username) {
        const cleanUsername = username.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_.-]{3,30}$/.test(cleanUsername)) {
          return NextResponse.json(
            {
              success: false,
              error: "Username must be 3-30 characters long and contain only letters, numbers, hyphens, and underscores.",
            },
            { status: 400 }
          );
        }

        if (cleanUsername !== (admin.username || "").toLowerCase()) {
          const existingUser = await prisma.storeAdmin.findFirst({
            where: {
              username: cleanUsername,
              NOT: { id: admin.id },
            },
          });
          if (existingUser) {
            return NextResponse.json(
              { success: false, error: `Username "${cleanUsername}" is already taken by another administrator.` },
              { status: 409 }
            );
          }
          updateData.username = cleanUsername;
        }
      }

      // Email uniqueness check
      if (email) {
        const cleanEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          return NextResponse.json(
            { success: false, error: "Please provide a valid email address." },
            { status: 400 }
          );
        }

        if (cleanEmail !== admin.email.toLowerCase()) {
          const existingEmail = await prisma.storeAdmin.findFirst({
            where: {
              email: cleanEmail,
              NOT: { id: admin.id },
            },
          });
          if (existingEmail) {
            return NextResponse.json(
              { success: false, error: `Email address "${cleanEmail}" is already registered to another administrator.` },
              { status: 409 }
            );
          }
          updateData.email = cleanEmail;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, message: "No changes requested.", profile: admin });
    }

    // 3. Save updates to database
    const updated = await prisma.storeAdmin.update({
      where: { id: admin.id },
      data: updateData,
    });

    // 4. Issue fresh JWT session cookie
    const token = jwt.sign(
      {
        userId: updated.id,
        username: updated.username || updated.email.split("@")[0],
        email: updated.email,
        name: updated.name,
        role: updated.role,
        status: updated.status || "ACTIVE",
        scope: "STORE_ADMIN",
      },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    const response = NextResponse.json({
      success: true,
      message: passwordChanged
        ? "Password and administrator credentials updated successfully."
        : "Administrator profile updated successfully.",
      profile: {
        id: updated.id,
        name: updated.name,
        username: updated.username || updated.email.split("@")[0],
        email: updated.email,
        role: updated.role,
        status: updated.status,
        phone: updated.phone || "",
        avatar: updated.avatar || "",
        lastLoginAt: updated.lastLoginAt,
      },
      token,
    });

    response.cookies.set("avro_store_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("PUT profile error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update administrator profile." },
      { status: 500 }
    );
  }
}
