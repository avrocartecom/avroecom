export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getStoreLicenseStatus, getStoreBroadcasts } from "@/lib/license-client";

export async function GET() {
  try {
    const licenseStatus = await getStoreLicenseStatus();
    const broadcasts = await getStoreBroadcasts(licenseStatus.plan);

    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { orderStatus: "PENDING" } });
    const processingOrders = await prisma.order.count({
      where: { orderStatus: { in: ["CONFIRMED", "PROCESSING", "PACKED"] } },
    });
    const completedOrders = await prisma.order.count({ where: { orderStatus: "DELIVERED" } });

    const totalProducts = await prisma.product.count();
    const lowStockProducts = await prisma.product.count({
      where: { stockQuantity: { lte: 10 } },
    });
    const totalCustomers = await prisma.storeCustomer.count();
    const guestCustomers = await prisma.storeCustomer.count({ where: { isGuest: true } });
    const comboDealsCount = await prisma.product.count({ where: { isComboDeal: true } });

    // Sum sales
    const orders = await prisma.order.findMany({
      where: { paymentStatus: { in: ["PAID", "PENDING"] } },
    });

    let totalSales = 0;
    let todaySales = 0;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (const ord of orders) {
      totalSales += ord.total;
      if (new Date(ord.createdAt) >= startOfToday) {
        todaySales += ord.total;
      }
    }

    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    const aov = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

    return NextResponse.json({
      success: true,
      license: licenseStatus,
      broadcasts,
      stats: {
        totalOrders,
        totalSales,
        todaySales,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalProducts,
        lowStockProducts,
        totalCustomers,
        guestCustomers,
        comboDealsCount,
        averageOrderValue: aov,
      },
      recentOrders,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
