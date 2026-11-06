export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();

    // Fetch all products marked as combo deals
    const comboProducts = await prisma.product.findMany({
      where: {
        isComboDeal: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { comboTitle: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    // Populate bundled items for each combo
    const enrichedCombos = await Promise.all(
      comboProducts.map(async (combo) => {
        let bundledItems: any[] = [];
        if (combo.comboProductIds) {
          try {
            const ids: string[] =
              typeof combo.comboProductIds === "string"
                ? JSON.parse(combo.comboProductIds)
                : combo.comboProductIds;

            if (Array.isArray(ids) && ids.length > 0) {
              const items = await prisma.product.findMany({
                where: { id: { in: ids } },
                select: {
                  id: true,
                  title: true,
                  sku: true,
                  regularPrice: true,
                  salePrice: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              });
              bundledItems = items.map((it) => ({
                ...it,
                price: it.salePrice || it.regularPrice,
              }));
            }
          } catch {
            const ids = String(combo.comboProductIds)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (ids.length > 0) {
              const items = await prisma.product.findMany({
                where: { id: { in: ids } },
                select: {
                  id: true,
                  title: true,
                  sku: true,
                  regularPrice: true,
                  salePrice: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              });
              bundledItems = items.map((it) => ({
                ...it,
                price: it.salePrice || it.regularPrice,
              }));
            }
          }
        }

        const originalTotal = bundledItems.reduce((acc, item) => acc + (item.price || 0), 0);
        const bundlePrice = combo.salePrice || combo.regularPrice || 0;
        const savingsAmount = Math.max(0, originalTotal - bundlePrice);
        const effectiveDiscount =
          originalTotal > 0
            ? Math.round(((originalTotal - bundlePrice) / originalTotal) * 100)
            : combo.comboDiscountPercent || 0;

        return {
          ...combo,
          price: bundlePrice,
          comparePrice: combo.regularPrice > bundlePrice ? combo.regularPrice : null,
          stock: combo.stockQuantity,
          status: combo.status === "PUBLISHED" ? "ACTIVE" : combo.status,
          bundledItems,
          bundledCount: bundledItems.length,
          originalTotal,
          savingsAmount,
          effectiveDiscount,
        };
      })
    );

    // Compute stats
    const totalCombos = enrichedCombos.length;
    const activeCombos = enrichedCombos.filter((c) => c.status === "ACTIVE" || c.status === "PUBLISHED").length;
    const avgDiscount =
      totalCombos > 0
        ? Math.round(
            enrichedCombos.reduce((acc, c) => acc + (c.comboDiscountPercent || c.effectiveDiscount || 0), 0) /
              totalCombos
          )
        : 0;

    return NextResponse.json({
      success: true,
      combos: enrichedCombos,
      stats: {
        totalCombos,
        activeCombos,
        avgDiscount,
      },
    });
  } catch (err: any) {
    console.error("GET /api/admin/combos error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to load combos." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      comboTitle,
      description,
      price,
      comparePrice,
      sku,
      stock = 50,
      status = "PUBLISHED",
      comboProductIds = [],
      comboDiscountPercent = 15,
      images = [],
      videoUrl,
      videoTitle,
      categoryId,
    } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Bundle/Product title is required." }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + `-${Date.now().toString().slice(-4)}`;

    const numPrice = Number(price) || 0;
    const numCompare = comparePrice ? Number(comparePrice) : null;
    const regPrice = numCompare && numCompare > numPrice ? numCompare : numPrice;
    const saleP = numCompare && numCompare > numPrice ? numPrice : null;

    const newCombo = await prisma.product.create({
      data: {
        title,
        slug,
        sku: sku || `CMB-${Date.now().toString().slice(-6)}`,
        description: description || `Exclusive bundle deal: ${title}`,
        regularPrice: regPrice,
        salePrice: saleP,
        stockQuantity: Number(stock) || 0,
        status: status === "ACTIVE" ? "PUBLISHED" : status,
        isComboDeal: true,
        comboTitle: comboTitle || title,
        comboDiscountPercent: Number(comboDiscountPercent) || 0,
        comboProductIds: JSON.stringify(comboProductIds),
        videoUrl: videoUrl || null,
        videoTitle: videoTitle || null,
        categoryId: categoryId || null,
        images: {
          create: images.map((img: any, idx: number) => ({
            url: typeof img === "string" ? img : img.url,
            isPrimary: idx === 0,
            sortOrder: idx,
            altText: title,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Combo bundle created successfully.",
      combo: newCombo,
    });
  } catch (err: any) {
    console.error("POST /api/admin/combos error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to create combo bundle." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isComboDeal, comboTitle, comboDiscountPercent, comboProductIds, status, price } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product/Combo ID required." }, { status: 400 });
    }

    const data: any = {};
    if (isComboDeal !== undefined) data.isComboDeal = Boolean(isComboDeal);
    if (comboTitle !== undefined) data.comboTitle = comboTitle;
    if (comboDiscountPercent !== undefined) data.comboDiscountPercent = Number(comboDiscountPercent);
    if (comboProductIds !== undefined) data.comboProductIds = JSON.stringify(comboProductIds);
    if (status !== undefined) data.status = status === "ACTIVE" ? "PUBLISHED" : status;
    if (price !== undefined) {
      data.regularPrice = Number(price);
      data.salePrice = null;
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Combo deal updated successfully.",
      combo: updated,
    });
  } catch (err: any) {
    console.error("PUT /api/admin/combos error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to update combo." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const permanent = searchParams.get("permanent") === "true";

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required." }, { status: 400 });
    }

    if (permanent) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "Bundle product deleted permanently." });
    } else {
      // Just unmark combo deal
      await prisma.product.update({
        where: { id },
        data: { isComboDeal: false },
      });
      return NextResponse.json({ success: true, message: "Removed combo deal status from product." });
    }
  } catch (err: any) {
    console.error("DELETE /api/admin/combos error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Failed to delete combo." }, { status: 500 });
  }
}
