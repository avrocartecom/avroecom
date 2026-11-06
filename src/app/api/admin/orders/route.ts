export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOrderShippedEmail } from "@/lib/email-service";

// GET: List all orders with optional search and status filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (status && status !== "ALL") {
      where.orderStatus = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
        { trackingNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error("GET /api/admin/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create a new order manually from admin panel
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal: rawSubtotal,
      discount: rawDiscount = 0,
      shippingFee: rawShippingFee = 0,
      total: rawTotal,
      paymentMethod = "COD",
      paymentStatus = "PENDING",
      orderStatus = "CONFIRMED",
      shippingProvider,
      trackingNumber,
      customerNotes,
      adminNotes,
    } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer name, phone, and at least one line item are required." },
        { status: 400 }
      );
    }

    // Calculate subtotal and line items
    let calculatedSubtotal = 0;
    const formattedItems = items.map((it: any) => {
      const price = Number(it.price) || 0;
      const quantity = Math.max(1, Number(it.quantity) || 1);
      const itemTotal = price * quantity;
      calculatedSubtotal += itemTotal;

      return {
        productId: it.productId || "custom_product",
        variantId: it.variantId || null,
        title: it.title || "Custom Order Item",
        variantTitle: it.variantTitle || null,
        sku: it.sku || `SKU-${Date.now().toString().slice(-5)}`,
        price,
        quantity,
        total: itemTotal,
      };
    });

    const subtotal = rawSubtotal !== undefined ? Number(rawSubtotal) : calculatedSubtotal;
    const discount = Number(rawDiscount) || 0;
    const shippingFee = Number(rawShippingFee) || 0;
    const total = rawTotal !== undefined ? Number(rawTotal) : Math.max(0, subtotal - discount + shippingFee);

    // Shipping address json
    const shippingAddressObj =
      typeof shippingAddress === "object"
        ? shippingAddress
        : {
            fullName: customerName,
            addressLine1: "Store Front Pickup / Direct Order",
            city: "New Delhi",
            state: "Delhi",
            postalCode: "110001",
            country: "India",
            phone: customerPhone,
          };

    const shippingAddressJson = JSON.stringify(shippingAddressObj);
    const billingAddressJson = shippingAddressJson;

    // Generate unique order number (e.g. ORD-682194)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail: customerEmail || `${customerPhone.replace(/[^0-9]/g, "")}@order.avrostore.com`,
        customerPhone,
        shippingAddressJson,
        billingAddressJson,
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: paymentStatus.toUpperCase(),
        orderStatus: orderStatus.toUpperCase(),
        shippingProvider: shippingProvider || null,
        trackingNumber: trackingNumber || null,
        customerNotes: customerNotes || null,
        adminNotes: adminNotes || null,
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${newOrder.orderNumber} created successfully!`,
      order: newOrder,
    });
  } catch (err: any) {
    console.error("POST /api/admin/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Update / Edit an existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingAddressJson,
      orderStatus,
      paymentStatus,
      paymentMethod,
      shippingProvider,
      trackingNumber,
      subtotal,
      discount,
      shippingFee,
      total,
      adminNotes,
      customerNotes,
      items,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    const updateData: any = {};
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (shippingProvider !== undefined) updateData.shippingProvider = shippingProvider;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (customerNotes !== undefined) updateData.customerNotes = customerNotes;
    if (subtotal !== undefined) updateData.subtotal = Number(subtotal);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (shippingFee !== undefined) updateData.shippingFee = Number(shippingFee);
    if (total !== undefined) updateData.total = Number(total);

    if (shippingAddressJson !== undefined) {
      updateData.shippingAddressJson = shippingAddressJson;
    } else if (shippingAddress && typeof shippingAddress === "object") {
      updateData.shippingAddressJson = JSON.stringify(shippingAddress);
    }

    // If items are modified, replace them
    if (items && Array.isArray(items) && items.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      let calcSubtotal = 0;
      const formattedItems = items.map((it: any) => {
        const price = Number(it.price) || 0;
        const quantity = Math.max(1, Number(it.quantity) || 1);
        const itemTotal = price * quantity;
        calcSubtotal += itemTotal;

        return {
          orderId: id,
          productId: it.productId || "custom_product",
          variantId: it.variantId || null,
          title: it.title || "Order Item",
          variantTitle: it.variantTitle || null,
          sku: it.sku || `SKU-${Date.now().toString().slice(-4)}`,
          price,
          quantity,
          total: itemTotal,
        };
      });

      await prisma.orderItem.createMany({
        data: formattedItems,
      });

      if (subtotal === undefined) {
        updateData.subtotal = calcSubtotal;
        const currentDiscount = discount !== undefined ? Number(discount) : 0;
        const currentShipping = shippingFee !== undefined ? Number(shippingFee) : 0;
        updateData.total = Math.max(0, calcSubtotal - currentDiscount + currentShipping);
      }
    }

    const updated = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: true,
      },
    });

    // If order was marked as SHIPPED or tracking number assigned, dispatch automated shipment email
    if (orderStatus === "SHIPPED" || (trackingNumber && trackingNumber.trim().length > 0)) {
      sendOrderShippedEmail(updated).catch((err) =>
        console.error("[Email Automation] Shipment dispatch email failed:", err)
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${updated.orderNumber} updated successfully!`,
      order: updated,
    });
  } catch (err: any) {
    console.error("PUT /api/admin/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Cancel / Remove an order
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Order ID required." }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Order removed successfully." });
  } catch (err: any) {
    console.error("DELETE /api/admin/orders error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
