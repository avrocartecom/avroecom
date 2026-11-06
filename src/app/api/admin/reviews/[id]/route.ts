export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH /api/admin/reviews/[id] - Toggle approval status or update review
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;
    const body = await req.json();

    const existingReview = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found." },
        { status: 404 }
      );
    }

    const updatedData: any = {};
    if (typeof body.isApproved === "boolean") {
      updatedData.isApproved = body.isApproved;
    }
    if (body.comment && typeof body.comment === "string") {
      updatedData.comment = body.comment.trim();
    }
    if (body.rating && Number(body.rating) >= 1 && Number(body.rating) <= 5) {
      updatedData.rating = Math.round(Number(body.rating));
    }

    const review = await prisma.productReview.update({
      where: { id: reviewId },
      data: updatedData,
    });

    return NextResponse.json({
      success: true,
      review,
      message: `Review ${review.isApproved ? "approved" : "hidden"} successfully.`,
    });
  } catch (error: any) {
    console.error("[API_ADMIN_REVIEW_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review status." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/reviews/[id] - Delete a review permanently
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviewId = params.id;

    const existingReview = await prisma.productReview.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found." },
        { status: 404 }
      );
    }

    await prisma.productReview.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error: any) {
    console.error("[API_ADMIN_REVIEW_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review." },
      { status: 500 }
    );
  }
}
