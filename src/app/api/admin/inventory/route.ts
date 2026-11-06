export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        inventoryLogs: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { stockQuantity: "asc" },
    });

    const recentLogs = await prisma.inventoryLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { product: true, variant: true },
    });

    return NextResponse.json({ success: true, products, recentLogs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, variantId, changeAmount, reason = "MANUAL_ADJUSTMENT", notes } = body;

    const amount = parseInt(changeAmount);

    let resultingStock = 0;
    if (variantId) {
      const v = await prisma.productVariant.findUnique({ where: { id: variantId } });
      if (!v) throw new Error("Variant not found");
      resultingStock = Math.max(0, v.stockQuantity + amount);
      await prisma.productVariant.update({
        where: { id: variantId },
        data: { stockQuantity: resultingStock },
      });
    } else {
      const p = await prisma.product.findUnique({ where: { id: productId } });
      if (!p) throw new Error("Product not found");
      resultingStock = Math.max(0, p.stockQuantity + amount);
      await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: resultingStock },
      });
    }

    const log = await prisma.inventoryLog.create({
      data: {
        productId,
        variantId: variantId || null,
        changeAmount: amount,
        resultingStock,
        reason,
        notes,
      },
    });

    return NextResponse.json({ success: true, log, resultingStock });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
