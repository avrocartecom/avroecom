import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      items = [],
      paymentMethod = "COD",
      couponCode,
      subtotal,
      discount = 0,
      shippingFee = 0,
      total,
      notes,
    } = body;

    if (!customerEmail || !customerName || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer details and items are required." },
        { status: 400 }
      );
    }

    // 1. Validate payment method is enabled
    const gateway = await prisma.paymentGatewaySetting.findUnique({
      where: { provider: paymentMethod },
    });

    if (!gateway || !gateway.isEnabled) {
      return NextResponse.json(
        { success: false, error: `Payment method '${paymentMethod}' is currently disabled by store administration.` },
        { status: 400 }
      );
    }

    // 2. Generate unique order number
    const count = await prisma.order.count();
    const orderNumber = `ORD-2026-${(1001 + count).toString().padStart(4, "0")}`;

    // 3. Upsert customer
    const customer = await prisma.storeCustomer.upsert({
      where: { email: customerEmail.trim().toLowerCase() },
      update: {
        name: customerName,
        phone: customerPhone,
      },
      create: {
        name: customerName,
        email: customerEmail.trim().toLowerCase(),
        phone: customerPhone,
      },
    });

    // 4. Create Order & items in transaction
    const paymentStatus = paymentMethod === "COD" || paymentMethod === "BANK_TRANSFER" ? "PENDING" : "PAID";
    const initialStatus = paymentMethod === "COD" ? "CONFIRMED" : "PENDING";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName,
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone,
        shippingAddressJson: JSON.stringify(shippingAddress || {}),
        billingAddressJson: JSON.stringify(billingAddress || shippingAddress || {}),
        subtotal: parseFloat(subtotal),
        discount: parseFloat(discount),
        shippingFee: parseFloat(shippingFee),
        total: parseFloat(total),
        couponCode: couponCode || null,
        orderStatus: initialStatus,
        paymentMethod,
        paymentStatus,
        customerNotes: notes || null,
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            variantId: it.variantId || null,
            title: it.title,
            variantTitle: it.variantTitle || null,
            sku: it.sku,
            price: parseFloat(it.price),
            quantity: parseInt(it.quantity),
            total: parseFloat(it.price) * parseInt(it.quantity),
          })),
        },
      },
      include: { items: true },
    });

    // 5. Decrement inventory
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: parseInt(item.quantity) } },
        });
      }
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: parseInt(item.quantity) } },
      });

      await prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          variantId: item.variantId || null,
          changeAmount: -parseInt(item.quantity),
          resultingStock: 0, // audit snapshot
          reason: "ORDER_PLACED",
          notes: `Deducted for order ${orderNumber}`,
        },
      });
    }

    // 6. Update coupon used count if used
    if (couponCode) {
      await prisma.coupon.updateMany({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderNumber} placed successfully!`,
      order,
    });
  } catch (err: any) {
    console.error("Checkout submission error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to place order: " + err.message },
      { status: 500 }
    );
  }
}
