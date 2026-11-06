export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "avro_customer_secret_key_default";

function getAuth(req: NextRequest) {
  const token = req.cookies.get("customer_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId") || req.cookies.get("guest_id")?.value;

    if (!auth?.id && !guestId) {
      return NextResponse.json({ success: true, items: [] });
    }

    const where: any = auth?.id
      ? { customerId: auth.id }
      : { guestId };

    const wishlistRecords = await prisma.wishlistItem.findMany({
      where,
      include: {
        product: {
          include: {
            images: { orderBy: { sortOrder: "asc" } },
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlistRecords.map((item) => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.createdAt,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        price: item.product.salePrice || item.product.regularPrice,
        regularPrice: item.product.regularPrice,
        salePrice: item.product.salePrice,
        image: item.product.images?.[0]?.url || "/placeholder-product.png",
        stockQuantity: item.product.stockQuantity,
        inStock: item.product.stockQuantity > 0,
        category: item.product.category?.name || "General",
        isComboDeal: item.product.isComboDeal,
        comboTitle: item.product.comboTitle,
      },
    }));

    return NextResponse.json({ success: true, items, count: items.length });
  } catch (err: any) {
    console.error("GET /api/customer/wishlist error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load wishlist." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const body = await req.json();
    const { productId, guestId: clientGuestId } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID required." }, { status: 400 });
    }

    const guestId = auth?.id ? null : clientGuestId || req.cookies.get("guest_id")?.value;

    if (!auth?.id && !guestId) {
      return NextResponse.json({ success: false, error: "Authentication or guest identifier required." }, { status: 401 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
    }

    // Check existing
    const existing = await prisma.wishlistItem.findFirst({
      where: auth?.id
        ? { customerId: auth.id, productId }
        : { guestId, productId },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Item already in your wishlist.", item: existing });
    }

    const created = await prisma.wishlistItem.create({
      data: {
        productId,
        customerId: auth?.id || null,
        guestId: auth?.id ? null : guestId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `"${product.title}" saved to your wishlist!`,
      item: created,
    });
  } catch (err: any) {
    console.error("POST /api/customer/wishlist error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to save item to wishlist." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuth(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const id = searchParams.get("id");
    const guestId = searchParams.get("guestId") || req.cookies.get("guest_id")?.value;

    if (!productId && !id) {
      return NextResponse.json({ success: false, error: "Product ID or Item ID required." }, { status: 400 });
    }

    if (id) {
      await prisma.wishlistItem.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Item removed from wishlist." });
    }

    if (productId) {
      await prisma.wishlistItem.deleteMany({
        where: auth?.id
          ? { customerId: auth.id, productId }
          : { guestId, productId },
      });
      return NextResponse.json({ success: true, message: "Item removed from wishlist." });
    }

    return NextResponse.json({ success: false, error: "Could not remove item." }, { status: 400 });
  } catch (err: any) {
    console.error("DELETE /api/customer/wishlist error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete item." }, { status: 500 });
  }
}
