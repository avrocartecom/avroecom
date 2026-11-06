export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const id = searchParams.get("id");

    // Single product fetch
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: true,
          reviews: { orderBy: { createdAt: "desc" } },
        },
      });

      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
      }

      // Populate Related Products
      let relatedProducts: any[] = [];
      if (product.relatedProductIds) {
        try {
          const ids: string[] = JSON.parse(product.relatedProductIds);
          if (Array.isArray(ids) && ids.length > 0) {
            relatedProducts = await prisma.product.findMany({
              where: { id: { in: ids } },
              include: { images: { where: { isPrimary: true }, take: 1 } },
            });
          }
        } catch {
          // Fallback if comma-separated
          const ids = product.relatedProductIds.split(",").map((s) => s.trim()).filter(Boolean);
          if (ids.length > 0) {
            relatedProducts = await prisma.product.findMany({
              where: { id: { in: ids } },
              include: { images: { where: { isPrimary: true }, take: 1 } },
            });
          }
        }
      }

      // Populate Combo Bundled Products
      let comboProducts: any[] = [];
      if (product.comboProductIds) {
        try {
          const ids: string[] = JSON.parse(product.comboProductIds);
          if (Array.isArray(ids) && ids.length > 0) {
            comboProducts = await prisma.product.findMany({
              where: { id: { in: ids } },
              include: { images: { where: { isPrimary: true }, take: 1 } },
            });
          }
        } catch {
          const ids = product.comboProductIds.split(",").map((s) => s.trim()).filter(Boolean);
          if (ids.length > 0) {
            comboProducts = await prisma.product.findMany({
              where: { id: { in: ids } },
              include: { images: { where: { isPrimary: true }, take: 1 } },
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        product: {
          ...product,
          relatedProducts,
          comboProducts,
        },
      });
    }

    // List all products
    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, products, categories });
  } catch (err: any) {
    console.error("GET /api/admin/products error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      description,
      regularPrice,
      salePrice,
      sku,
      stockQuantity = 0,
      categoryId,
      imageUrl,
      images = [],
      videoUrl,
      videoTitle,
      relatedProductIds,
      isComboDeal = false,
      comboProductIds,
      comboDiscountPercent = 0,
      comboTitle,
      featured = false,
      variants = [],
    } = body;

    if (!title || !regularPrice) {
      return NextResponse.json({ success: false, error: "Product Title and Regular Price are required." }, { status: 400 });
    }

    const cleanSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
        `-${Date.now().toString().slice(-4)}`;

    const generatedSku = sku ? sku.trim().toUpperCase() : `SKU-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare image records (support both single imageUrl and images array)
    const imageCreateList: any[] = [];
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img: any, idx: number) => {
        const url = typeof img === "string" ? img : img.url;
        if (url) {
          imageCreateList.push({
            url,
            altText: img.altText || `${title} photo ${idx + 1}`,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
            sortOrder: img.sortOrder || idx + 1,
          });
        }
      });
    } else if (imageUrl) {
      imageCreateList.push({
        url: imageUrl,
        altText: title,
        isPrimary: true,
        sortOrder: 1,
      });
    }

    // Format relatedProductIds and comboProductIds as JSON string
    const formattedRelated = Array.isArray(relatedProductIds)
      ? JSON.stringify(relatedProductIds)
      : relatedProductIds || null;

    const formattedCombo = Array.isArray(comboProductIds)
      ? JSON.stringify(comboProductIds)
      : comboProductIds || null;

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        shortDescription: shortDescription || null,
        description: description || title,
        regularPrice: parseFloat(regularPrice),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: generatedSku,
        stockQuantity: parseInt(stockQuantity) || 0,
        categoryId: categoryId || null,
        status: "PUBLISHED",
        featured: Boolean(featured),
        videoUrl: videoUrl ? videoUrl.trim() : null,
        videoTitle: videoTitle ? videoTitle.trim() : null,
        relatedProductIds: formattedRelated,
        isComboDeal: Boolean(isComboDeal),
        comboProductIds: formattedCombo,
        comboDiscountPercent: comboDiscountPercent ? parseFloat(comboDiscountPercent) : 0,
        comboTitle: comboTitle ? comboTitle.trim() : null,
        images: imageCreateList.length > 0 ? { create: imageCreateList } : undefined,
        variants:
          variants.length > 0
            ? {
                create: variants.map((v: any, idx: number) => ({
                  title: v.title,
                  sku: v.sku || `${generatedSku}-VAR${idx + 1}`,
                  price: parseFloat(v.price || regularPrice),
                  stockQuantity: parseInt(v.stockQuantity || stockQuantity || 0),
                  attributesJson: JSON.stringify(v.attributes || {}),
                })),
              }
            : undefined,
      },
      include: { images: true, variants: true, category: true },
    });

    // Record initial inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        changeAmount: product.stockQuantity,
        resultingStock: product.stockQuantity,
        reason: "RESTOCK",
        notes: "Initial inventory provisioning during product creation.",
      },
    });

    return NextResponse.json({ success: true, product, message: `Product "${product.title}" created successfully.` });
  } catch (err: any) {
    console.error("POST /api/admin/products error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      slug,
      shortDescription,
      description,
      regularPrice,
      salePrice,
      stockQuantity,
      status,
      categoryId,
      featured,
      images,
      videoUrl,
      videoTitle,
      relatedProductIds,
      isComboDeal,
      comboProductIds,
      comboDiscountPercent,
      comboTitle,
    } = body;

    if (!id) return NextResponse.json({ success: false, error: "Product ID required." }, { status: 400 });

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (description !== undefined) updateData.description = description;
    if (regularPrice !== undefined) updateData.regularPrice = parseFloat(regularPrice);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (status !== undefined) updateData.status = status;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl ? videoUrl.trim() : null;
    if (videoTitle !== undefined) updateData.videoTitle = videoTitle ? videoTitle.trim() : null;

    if (relatedProductIds !== undefined) {
      updateData.relatedProductIds = Array.isArray(relatedProductIds)
        ? JSON.stringify(relatedProductIds)
        : relatedProductIds;
    }

    if (isComboDeal !== undefined) updateData.isComboDeal = Boolean(isComboDeal);
    if (comboProductIds !== undefined) {
      updateData.comboProductIds = Array.isArray(comboProductIds)
        ? JSON.stringify(comboProductIds)
        : comboProductIds;
    }
    if (comboDiscountPercent !== undefined) {
      updateData.comboDiscountPercent = comboDiscountPercent ? parseFloat(comboDiscountPercent) : 0;
    }
    if (comboTitle !== undefined) updateData.comboTitle = comboTitle ? comboTitle.trim() : null;

    // Handle full image replacement if provided
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      const imageCreateList = images.map((img: any, idx: number) => ({
        productId: id,
        url: typeof img === "string" ? img : img.url,
        altText: img.altText || `${title || "Product"} photo ${idx + 1}`,
        isPrimary: img.isPrimary !== undefined ? img.isPrimary : idx === 0,
        sortOrder: img.sortOrder || idx + 1,
      }));
      if (imageCreateList.length > 0) {
        await prisma.productImage.createMany({ data: imageCreateList });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { images: true, category: true },
    });

    return NextResponse.json({ success: true, product, message: `Product "${product.title}" updated successfully.` });
  } catch (err: any) {
    console.error("PUT /api/admin/products error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product and associated assets deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
