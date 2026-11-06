export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductViewClient } from "@/components/product-view-client";
import { getStorePermissions } from "@/lib/permissions";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const permissions = await getStorePermissions();
  const allowReviews = permissions.check("productReviews").allowed;

  let product = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
        reviews: allowReviews
          ? {
              where: { isApproved: true },
              orderBy: { createdAt: "desc" },
            }
          : false,
      },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ProductViewClient product={product} allowReviews={allowReviews} />
    </div>
  );
}
