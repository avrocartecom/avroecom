"use client";

import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  PackageCheck,
  Check,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

export default function WishlistPage() {
  const { items, removeFromWishlist, moveToCart, loading } = useWishlist();
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAddToCart = (item: any) => {
    moveToCart(item.product);
    setAddedIds((prev) => [...prev, item.productId]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== item.productId));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading saved wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-bold">My Wishlist</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 border border-rose-100 shadow-2xs">
              <Heart className="w-6 h-6 fill-rose-600 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Saved Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {items.length === 1 ? "1 saved product ready to purchase" : `${items.length} saved products ready to purchase`}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition self-start sm:self-auto"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Your wishlist is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6 leading-relaxed">
            Save your favorite items here by tapping the heart icon while browsing our store so you can easily purchase them later.
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/25 active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore Store Catalog</span>
          </Link>
        </div>
      ) : (
        /* Items Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product;
            const isJustAdded = addedIds.includes(item.productId);
            const savings =
              product.regularPrice && product.regularPrice > product.price
                ? product.regularPrice - product.price
                : 0;

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Image Cover */}
                <div className="relative aspect-square w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
                  <Link href={`/product/${product.slug}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Savings Tag */}
                  {savings > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                      SAVE ₹{savings.toLocaleString()}
                    </span>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {product.category || "General"}
                  </span>

                  <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-black text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.regularPrice && product.regularPrice > product.price ? (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        ₹{product.regularPrice.toLocaleString()}
                      </span>
                    ) : null}
                  </div>

                  {/* Stock status */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.inStock ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    <span className={product.inStock ? "text-emerald-700" : "text-rose-600"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!product.inStock}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : product.inStock
                        ? "bg-slate-900 hover:bg-blue-600 text-white active:scale-[0.98]"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Moved to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Move to Shopping Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
