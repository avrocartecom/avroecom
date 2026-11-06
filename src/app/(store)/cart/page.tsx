"use client";

import { useCart } from "@/context/cart-context";
import Link from "next/link";
import { useState } from "react";
import { Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, AlertCircle } from "lucide-react";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg(res.message);
    setCouponSuccess(res.success);
    if (res.success) setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Your Cart is Empty</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You have not added any merchandise to your shopping bag yet. Explore our latest arrivals!
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0A192F]">Shopping Bag</h1>
        <p className="text-xs text-slate-500 mt-1">Review your selected items before proceeding to checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm divide-y overflow-hidden">
          {items.map((it) => (
            <div key={it.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border flex-shrink-0">
                  {it.image && <img src={it.image} alt={it.title} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{it.title}</h3>
                  {it.variantTitle && (
                    <span className="text-[11px] text-slate-500 block">{it.variantTitle}</span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono block">SKU: {it.sku}</span>
                  <span className="text-xs font-bold text-slate-800 sm:hidden block mt-1">
                    ₹{it.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(it.id, it.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900">{it.quantity}</span>
                  <button
                    onClick={() => updateQuantity(it.id, it.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-extrabold text-[#0A192F] min-w-[5rem] text-right">
                  ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                </span>

                <button
                  onClick={() => removeFromCart(it.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-base font-bold text-[#0A192F]">Order Summary</h3>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <strong className="text-slate-900">₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <strong>-₹{discount.toLocaleString("en-IN")}</strong>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <strong className="text-slate-900">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                </strong>
              </div>
            </div>

            {/* Coupon Box */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Promo Voucher</span>
              {appliedCoupon ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold">{appliedCoupon.code} Applied</span>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border rounded-lg uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && (
                <span
                  className={`text-[11px] block ${
                    couponSuccess ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"
                  }`}
                >
                  {couponMsg}
                </span>
              )}
            </div>

            {/* Final Total */}
            <div className="pt-2 flex items-baseline justify-between border-t border-slate-100">
              <span className="text-sm font-bold text-slate-800">Final Total</span>
              <span className="text-2xl font-extrabold text-[#0A192F]">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
