export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enforceApiFeatureAccess } from "@/lib/permissions";

// GET /api/products/[id]/reviews - Fetch approved reviews and rating stats
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 }
      );
    }

    const reviews = await prisma.productReview.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalCount = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalCount > 0 ? Number((ratingSum / totalCount).toFixed(1)) : 5.0;

    // Calculate rating distribution (5, 4, 3, 2, 1)
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(Math.max(Math.round(r.rating), 1), 5);
      distribution[star] = (distribution[star] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalCount,
        averageRating,
        distribution,
      },
    });
  } catch (error: any) {
    console.error("[API_PRODUCT_REVIEWS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load product reviews." },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Submit a new review
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guard = await enforceApiFeatureAccess("productReviews");
    if (!guard.allowed) return guard.response;

    const productId = params.id;
    const body = await req.json();

    const { authorName, rating, comment } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required." },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, title: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    // Validation
    const cleanAuthor = typeof authorName === "string" ? authorName.trim() : "";
    const cleanComment = typeof comment === "string" ? comment.trim() : "";
    const numRating = Number(rating);

    if (!cleanAuthor || cleanAuthor.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a whole number between 1 and 5." },
        { status: 400 }
      );
    }

    if (!cleanComment || cleanComment.length < 5) {
      return NextResponse.json(
        { success: false, error: "Please write a review comment of at least 5 characters." },
        { status: 400 }
      );
    }

    // Create review - Auto-approved for fast customer feedback
    const review = await prisma.productReview.create({
      data: {
        productId,
        authorName: cleanAuthor,
        rating: Math.round(numRating),
        comment: cleanComment,
        isApproved: true,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Thank you! Your review has been submitted and published.",
    });
  } catch (error: any) {
    console.error("[API_PRODUCT_REVIEWS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review. Please try again." },
      { status: 500 }
    );
  }
}
