"use client";

import Link from "next/link";
import { ShoppingBag, Check, Heart, PackagePlus } from "lucide-react";
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
    <div className="group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative">
      {/* Product Image Cover */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={primaryImg}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isComboDeal && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-xs flex items-center gap-1">
              <PackagePlus className="w-3 h-3" />
              COMBO
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs transition z-10 active:scale-95"
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 transition ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white shadow-xs">
            ONLY {product.stockQuantity} LEFT
          </span>
        )}
      </Link>

      {/* Details */}
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

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`p-2 rounded-xl transition-all shadow-2xs ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white"
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
