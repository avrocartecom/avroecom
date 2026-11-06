export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

export default async function ShopCatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string };
}) {
  const { category, search, sort } = searchParams;

  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  // Build query
  const where: any = { status: "PUBLISHED" };
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { sku: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { regularPrice: "asc" };
  else if (sort === "price-desc") orderBy = { regularPrice: "desc" };

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
      },
      orderBy,
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Filter bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0A192F]">All Products</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {products.length} item{products.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/shop"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              !category ? "bg-[#0A192F] text-white" : "bg-white border text-slate-700 hover:bg-slate-50"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                category === c.slug
                  ? "bg-[#0A192F] text-white"
                  : "bg-white border text-slate-700 hover:bg-slate-50"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-slate-400 space-y-2">
          <p className="text-base font-bold text-slate-600">No products found in this category.</p>
          <p className="text-xs">Try selecting a different filter or search term.</p>
          <Link href="/shop" className="text-xs text-[#2563EB] font-bold inline-block pt-2">
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
