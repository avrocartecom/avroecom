"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // productId or variantId
  productId: string;
  variantId?: string | null;
  title: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
  sku: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; discountType: string; discountValue: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
  } | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avro_store_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("avro_store_cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "WELCOME10") {
      setAppliedCoupon({ code: "WELCOME10", discountType: "PERCENTAGE", discountValue: 10 });
      return { success: true, message: "Coupon WELCOME10 applied (10% off)!" };
    } else if (clean === "AVRO500") {
      setAppliedCoupon({ code: "AVRO500", discountType: "FIXED", discountValue: 500 });
      return { success: true, message: "Coupon AVRO500 applied (₹500 flat off)!" };
    }
    return { success: false, message: "Invalid or expired coupon code." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }
  discount = Math.min(discount, subtotal);

  // Free shipping over ₹999, else ₹99
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shippingFee);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
