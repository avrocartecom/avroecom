export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enforceApiFeatureAccess } from "@/lib/permissions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "all"; // today, 7d, 30d, ytd, all
    const format = searchParams.get("format"); // "csv" or "json"

    // Calculate Date Range
    let startDate: Date | undefined;
    const now = new Date();

    if (range === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "ytd") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const where: any = {};
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, customer: true },
      orderBy: { createdAt: "desc" },
    });

    // Check if CSV format is requested
    if (format === "csv") {
      const guard = await enforceApiFeatureAccess("downloadableReports");
      if (!guard.allowed) return guard.response;

      const headers = [
        "Order Number",
        "Order Date",
        "Customer Name",
        "Customer Email",
        "Customer Phone",
        "Shipping City",
        "Shipping State",
        "Shipping Pincode",
        "Payment Method",
        "Payment Status",
        "Order Status",
        "Items Count",
        "Subtotal (INR)",
        "Discount (INR)",
        "Shipping Fee (INR)",
        "Total (INR)",
        "Courier Provider",
        "Tracking AWB",
      ];

      const csvRows = [headers.join(",")];

      for (const ord of orders) {
        let city = "";
        let state = "";
        let pincode = "";

        if (ord.shippingAddressJson) {
          try {
            const addr = JSON.parse(ord.shippingAddressJson);
            city = addr.city || "";
            state = addr.state || "";
            pincode = addr.postalCode || "";
          } catch {}
        }

        const safeStr = (v?: string | null) => `"${(v || "").replace(/"/g, '""')}"`;

        const row = [
          safeStr(ord.orderNumber),
          safeStr(new Date(ord.createdAt).toISOString().split("T")[0]),
          safeStr(ord.customerName),
          safeStr(ord.customerEmail),
          safeStr(ord.customerPhone),
          safeStr(city),
          safeStr(state),
          safeStr(pincode),
          safeStr(ord.paymentMethod),
          safeStr(ord.paymentStatus),
          safeStr(ord.orderStatus),
          ord.items.length,
          ord.subtotal.toFixed(2),
          ord.discount.toFixed(2),
          ord.shippingFee.toFixed(2),
          ord.total.toFixed(2),
          safeStr(ord.shippingProvider),
          safeStr(ord.trackingNumber),
        ];

        csvRows.push(row.join(","));
      }

      const csvContent = csvRows.join("\n");
      const filename = `avro-sales-report-${range}-${new Date().toISOString().split("T")[0]}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Default JSON aggregate metrics
    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalShippingFee = 0;
    const paymentMethods: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const productSales: Record<string, { title: string; count: number; revenue: number; sku: string }> = {};

    for (const ord of orders) {
      totalRevenue += ord.total;
      totalDiscount += ord.discount;
      totalShippingFee += ord.shippingFee;
      paymentMethods[ord.paymentMethod] = (paymentMethods[ord.paymentMethod] || 0) + ord.total;
      statusCounts[ord.orderStatus] = (statusCounts[ord.orderStatus] || 0) + 1;

      for (const item of ord.items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { title: item.title, count: 0, revenue: 0, sku: item.sku };
        }
        productSales[item.productId].count += item.quantity;
        productSales[item.productId].revenue += item.total;
      }
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      range,
      totalRevenue,
      totalDiscount,
      totalShippingFee,
      orderCount: orders.length,
      averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      paymentMethods,
      statusCounts,
      topProducts,
      orders: orders.slice(0, 50), // Sample for recent inspection
    });
  } catch (err: any) {
    console.error("GET /api/admin/reports error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
