"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";

export interface WishlistProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    regularPrice?: number;
    salePrice?: number | null;
    image: string;
    inStock: boolean;
    stockQuantity: number;
    category?: string;
    isComboDeal?: boolean;
    comboTitle?: string;
  };
}

interface WishlistContextType {
  items: WishlistProduct[];
  itemCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToCart: (product: any) => void;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Generate or read persistent guest ID
  const getGuestId = () => {
    if (typeof window === "undefined") return "";
    let gid = localStorage.getItem("avro_guest_id");
    if (!gid) {
      gid = "guest_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("avro_guest_id", gid);
      document.cookie = `guest_id=${gid}; path=/; max-age=31536000; SameSite=Lax`;
    }
    return gid;
  };

  const refreshWishlist = async () => {
    try {
      const gid = getGuestId();
      const res = await fetch(`/api/customer/wishlist?guestId=${gid}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (e) {
      console.warn("Could not load wishlist:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId || item.product?.id === productId);
  };

  const toggleWishlist = async (product: any): Promise<boolean> => {
    const prodId = product.id || product.productId;
    const currentlyIn = isInWishlist(prodId);

    if (currentlyIn) {
      // Optimistic remove
      setItems((prev) => prev.filter((i) => i.productId !== prodId && i.product?.id !== prodId));
      try {
        const gid = getGuestId();
        await fetch(`/api/customer/wishlist?productId=${prodId}&guestId=${gid}`, { method: "DELETE" });
      } catch (e) {
        refreshWishlist();
      }
      return false;
    } else {
      // Optimistic add
      const optimisticItem: WishlistProduct = {
        id: "temp_" + Date.now(),
        productId: prodId,
        product: {
          id: prodId,
          title: product.title || "Product",
          slug: product.slug || prodId,
          price: product.price || product.regularPrice || 0,
          regularPrice: product.regularPrice,
          salePrice: product.salePrice,
          image: product.image || product.images?.[0]?.url || "/placeholder-product.png",
          inStock: product.stockQuantity !== 0,
          stockQuantity: product.stockQuantity ?? 10,
          category: product.category?.name || "General",
        },
      };

      setItems((prev) => [optimisticItem, ...prev]);

      try {
        const gid = getGuestId();
        const res = await fetch("/api/customer/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: prodId, guestId: gid }),
        });
        const data = await res.json();
        if (!data.success) {
          refreshWishlist();
        }
      } catch (e) {
        refreshWishlist();
      }
      return true;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId && i.product?.id !== productId));
    try {
      const gid = getGuestId();
      await fetch(`/api/customer/wishlist?productId=${productId}&guestId=${gid}`, { method: "DELETE" });
    } catch (e) {
      refreshWishlist();
    }
  };

  const moveToCart = (product: any) => {
    const prodId = product.id || product.productId;
    addToCart(
      {
        id: prodId,
        productId: prodId,
        title: product.title,
        price: product.price,
        sku: product.sku || `SKU-${prodId.slice(-6)}`,
        image: product.image,
      },
      1
    );
    removeFromWishlist(prodId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        refreshWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
