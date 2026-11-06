"use client";

import Link from "next/link";
import { ShoppingBag, Check, Heart, PackagePlus, Star, Eye } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useState } from "react";

export function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isSaved = isInWishlist(product.id);

  const primaryImg =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

  const effectivePrice = product.salePrice || product.regularPrice;
  const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;
  const discountPct = hasDiscount
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      productId: product.id,
      title: product.title,
      price: effectivePrice,
      sku: product.sku,
      image: primaryImg,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="avro-card group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm flex flex-col justify-between relative">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={primaryImg}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isComboDeal && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-sm flex items-center gap-1">
              <PackagePlus className="w-3 h-3" />
              COMBO
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-sm">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Action buttons — appear on hover */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200
                       opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                       hover:bg-white active:scale-95"
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-4 h-4 transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-500"}`} />
          </button>

          {/* Quick view */}
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm text-slate-400 hover:text-slate-800
                       opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 delay-75"
            title="View product"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Low stock badge */}
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white shadow-sm">
            ONLY {product.stockQuantity} LEFT
          </span>
        )}

        {/* Quick add overlay — slides up from bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 p-3">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-98 ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-slate-900/95 text-white hover:bg-slate-800 backdrop-blur-sm"
            }`}
          >
            {added ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Added to Cart
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </span>
            )}
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {product.category.name}
            </span>
          )}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Stars & Rating Summary */}
          {(() => {
            const reviewsCount = product.reviews?.length || 0;
            const computedRating =
              reviewsCount > 0
                ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviewsCount
                : product.rating || 5.0;
            return (
              <div className="flex items-center gap-1 mt-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 ${
                      i < Math.floor(computedRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
                <span className="text-[10px] text-slate-500 font-semibold ml-1">
                  {Number(computedRating).toFixed(1)}
                  {reviewsCount > 0 && (
                    <span className="text-slate-400 font-normal"> ({reviewsCount})</span>
                  )}
                </span>
              </div>
            );
          })()}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-slate-900">
              ₹{effectivePrice.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through ml-2">
                ₹{product.regularPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Desktop add button (hidden on mobile since overlay is used) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`hidden sm:flex p-2 rounded-xl transition-all shadow-sm active:scale-95 items-center justify-center ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white"
            }`}
            title="Quick add to cart"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
