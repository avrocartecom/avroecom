"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import {
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Heart,
  Play,
  Film,
  Star,
  MessageSquare,
} from "lucide-react";
import { ProductReviews } from "@/components/product-reviews";

export function ProductViewClient({
  product,
  allowReviews = true,
}: {
  product: any;
  allowReviews?: boolean;
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product.id);

  const initialImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";

  const [selectedImg, setSelectedImg] = useState<string>(initialImage);
  const [activeMediaType, setActiveMediaType] = useState<"image" | "video">("image");

  const [selectedVariant, setSelectedVariant] = useState<any | null>(
    product.variants?.length > 0 ? product.variants[0] : null
  );

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.salePrice || product.regularPrice;

  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  const handleAddToCart = () => {
    addToCart(
      {
        id: selectedVariant ? selectedVariant.id : product.id,
        productId: product.id,
        variantId: selectedVariant ? selectedVariant.id : null,
        title: product.title,
        variantTitle: selectedVariant ? selectedVariant.title : null,
        price: currentPrice,
        sku: currentSku,
        image: selectedImg,
      },
      qty
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // Helper for YouTube/Vimeo embed URL
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return null;
  };

  const embedUrl = product.videoUrl ? getEmbedVideoUrl(product.videoUrl) : null;

  // Review statistics
  const reviewsList = product.reviews || [];
  const reviewCount = reviewsList.length;
  const avgRating =
    reviewCount > 0
      ? (reviewsList.reduce((s: number, r: any) => s + r.rating, 0) / reviewCount).toFixed(1)
      : "5.0";

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Media Gallery with Right Scroll View */}
      <div className="lg:col-span-7">
        <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
          {/* Main Active Media Viewport */}
          <div className="flex-1 w-full aspect-square bg-slate-900/5 rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative flex items-center justify-center">
            {activeMediaType === "video" && product.videoUrl ? (
              embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={product.videoTitle || product.title}
                  className="w-full h-full border-0 rounded-3xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-black rounded-3xl"
                />
              )
            ) : (
              <img
                src={selectedImg}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}

            {/* Video overlay badge if video is active */}
            {activeMediaType === "video" && product.videoTitle && (
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 shadow">
                <Film className="w-3.5 h-3.5 text-blue-400" />
                <span>{product.videoTitle}</span>
              </div>
            )}
          </div>

          {/* Right Scroll View (Vertical thumbnail gallery on md/lg, horizontal on mobile) */}
          <div className="w-full md:w-28 flex-shrink-0 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[580px] pr-1 pb-2 md:pb-0 scrollbar-thin">
            {/* 1. All Product Images */}
            {product.images?.map((img: any, idx: number) => {
              const isActive = activeMediaType === "image" && selectedImg === img.url;
              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => {
                    setSelectedImg(img.url);
                    setActiveMediaType("image");
                  }}
                  className={`w-20 md:w-full aspect-square rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all relative group bg-white shadow-2xs ${
                    isActive
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md"
                      : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                  }`}
                  title={img.altText || `View photo ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || ""}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {img.isPrimary && (
                    <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1 rounded uppercase">
                      Primary
                    </span>
                  )}
                </button>
              );
            })}

            {/* 2. Product Demonstration Video Thumbnail (if present) */}
            {product.videoUrl && (
              <button
                type="button"
                onClick={() => setActiveMediaType("video")}
                className={`w-20 md:w-full aspect-square rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all relative group bg-slate-900 flex flex-col items-center justify-center text-white shadow-2xs ${
                  activeMediaType === "video"
                    ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md"
                    : "border-slate-800 hover:border-blue-500 opacity-90 hover:opacity-100"
                }`}
                title={product.videoTitle || "Play product video demonstration"}
              >
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="relative z-10 w-9 h-9 rounded-full bg-blue-600/90 group-hover:bg-blue-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <span className="relative z-10 text-[9px] font-extrabold uppercase tracking-wider text-blue-200 mt-1">
                  Video
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Details Column */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          {product.category && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] block mb-1">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight">
            {product.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs text-slate-400 font-mono">SKU: {currentSku}</span>
            {allowReviews && (
              <>
                <span className="text-slate-300">•</span>
                {/* Clickable Review Rating Anchor */}
                <a
                  href="#product-reviews"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(Number(avgRating))
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 group-hover:text-blue-600">
                    {avgRating}
                  </span>
                  <span className="text-slate-500 underline decoration-slate-300 group-hover:decoration-blue-600">
                    ({reviewCount} customer {reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 pb-4 border-b border-slate-200">
          <span className="text-3xl font-extrabold text-slate-900">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          {product.salePrice && (
            <span className="text-sm text-slate-400 line-through">
              ₹{product.regularPrice.toLocaleString("en-IN")}
            </span>
          )}
          <span className="text-xs text-emerald-600 font-bold ml-2">Inclusive of all taxes</span>
        </div>

        {/* Short description */}
        {product.shortDescription && (
          <p className="text-xs text-slate-600 leading-relaxed">{product.shortDescription}</p>
        )}

        {/* Variants Selector */}
        {product.variants?.length > 0 && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Choose Option / Variant:</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: any) => {
                const isSelected = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-[#0A192F] text-white border-[#0A192F] shadow-sm"
                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {v.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock status */}
        <div className="text-xs">
          {currentStock > 0 ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              In Stock ({currentStock} available for instant dispatch)
            </span>
          ) : (
            <span className="text-rose-600 font-bold">Currently Out of Stock</span>
          )}
        </div>

        {/* Quantity and Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <span className="px-3 py-2 font-bold text-xs text-slate-900 min-w-[2rem] text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0A192F] hover:bg-[#1E293B] text-white"
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border transition-all ${
                isSaved
                  ? "bg-rose-50 border-rose-300 text-rose-600"
                  : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              }`}
              title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider transition-all shadow"
          >
            Buy Now with 1-Click
          </button>
        </div>

        {/* Service assurances */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-[11px] text-slate-600">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2563EB]" />
            <span>Fast Express Courier</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>7-Day Return Policy</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Server Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Dispatch</span>
          </div>
        </div>

        {/* Detailed description */}
        <div className="pt-6 border-t border-slate-200 space-y-2 text-xs text-slate-600 leading-relaxed">
          <h4 className="font-bold text-slate-900 text-sm">Product Specifications</h4>
          <p className="whitespace-pre-line">{product.description}</p>
        </div>
      </div>
    </div>

    {/* Verified Customer Reviews Section */}
    {allowReviews && (
      <div className="border-t border-slate-200/90 pt-4">
        <ProductReviews
          productId={product.id}
          productTitle={product.title}
          initialReviews={reviewsList}
        />
      </div>
    )}
  </div>
  );
}
