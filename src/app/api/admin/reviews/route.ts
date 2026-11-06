export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/reviews - Fetch all reviews across products with moderation filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const ratingFilter = searchParams.get("rating");
    const statusFilter = searchParams.get("status"); // all, approved, pending

    const where: any = {};

    if (search) {
      where.OR = [
        { authorName: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
        { product: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (ratingFilter && ratingFilter !== "ALL") {
      const numRating = parseInt(ratingFilter, 10);
      if (!isNaN(numRating)) {
        where.rating = numRating;
      }
    }

    if (statusFilter === "APPROVED") {
      where.isApproved = true;
    } else if (statusFilter === "PENDING" || statusFilter === "HIDDEN") {
      where.isApproved = false;
    }

    const reviews = await prisma.productReview.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Summary statistics
    const allReviews = await prisma.productReview.findMany({
      select: { rating: true, isApproved: true },
    });

    const totalReviews = allReviews.length;
    const approvedReviews = allReviews.filter((r) => r.isApproved).length;
    const pendingReviews = totalReviews - approvedReviews;
    const ratingSum = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalReviews > 0 ? Number((ratingSum / totalReviews).toFixed(1)) : 5.0;
    const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;

    return NextResponse.json({
      success: true,
      reviews,
      metrics: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        averageRating,
        fiveStarCount,
      },
    });
  } catch (error: any) {
    console.error("[API_ADMIN_REVIEWS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin reviews." },
      { status: 500 }
    );
  }
}
