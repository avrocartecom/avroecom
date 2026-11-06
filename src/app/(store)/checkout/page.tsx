"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  CreditCard,
  ArrowRight,
  Printer,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export default function StoreCheckoutPage() {
  const { items, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();

  const [availableGateways, setAvailableGateways] = useState<any[]>([]);
  const [selectedGateway, setSelectedGateway] = useState("COD");
  const [loadingGateways, setLoadingGateways] = useState(true);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const enabled = data.gateways.filter((g: any) => g.isEnabled);
          setAvailableGateways(enabled);
          if (enabled.length > 0) {
            setSelectedGateway(enabled[0].provider);
          }
        }
      })
      .finally(() => setLoadingGateways(false));
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: {
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
          },
          billingAddress: {
            addressLine1,
            city,
            state,
            postalCode,
          },
          items,
          paymentMethod: selectedGateway,
          couponCode: appliedCoupon?.code,
          subtotal,
          discount,
          shippingFee,
          total,
          notes: customerNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order placement failed.");
      }

      setConfirmedOrder(data.order);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to process checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#0A192F]">Order Confirmed!</h1>
            <p className="text-xs text-slate-500">
              Thank you for shopping with us. We have received your order and started fulfillment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 max-w-lg mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Reference</span>
              <strong className="font-mono text-slate-900">{confirmedOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Channel</span>
              <strong className="text-slate-900">{confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Billed</span>
              <strong className="text-slate-900 font-extrabold">₹{confirmedOrder.total.toLocaleString("en-IN")}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Address</span>
              <span className="text-slate-700 text-right">{addressLine1}, {city}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <Link
              href="/track"
              className="px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow"
            >
              Track Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">Please select products before checking out.</p>
        <Link href="/shop" className="px-4 py-2 bg-[#0A192F] text-white text-xs font-bold rounded-lg inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A192F]">Checkout</h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide your delivery address and choose your preferred payment method.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Contact info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Customer Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone (for delivery SMS) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Shipping Address
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Street Address / Flat / Floor *</label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Landmark / Area</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Selection */}
            <div className="space-y-3 pt-3 border-t">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Payment Method
              </h3>
              <div className="space-y-2 text-xs">
                {availableGateways.map((gw) => (
                  <label
                    key={gw.provider}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedGateway === gw.provider
                        ? "border-[#2563EB] bg-blue-50/50 ring-1 ring-[#2563EB]"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={gw.provider}
                        checked={selectedGateway === gw.provider}
                        onChange={(e) => setSelectedGateway(e.target.value)}
                        className="text-[#2563EB]"
                      />
                      <div>
                        <strong className="text-slate-900 block">{gw.title}</strong>
                        {gw.description && <span className="text-[11px] text-slate-500">{gw.description}</span>}
                      </div>
                    </div>
                    {gw.isTestMode && gw.provider !== "COD" && gw.provider !== "BANK_TRANSFER" && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        TEST SANDBOX
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Order on Server...
                </>
              ) : (
                <>
                  Confirm Order & Place (₹{total.toLocaleString("en-IN")})
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0A192F]">Order Summary</h3>

            <div className="divide-y max-h-60 overflow-y-auto text-xs">
              {items.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-800 block line-clamp-1">{it.title}</strong>
                    {it.variantTitle && <span className="text-slate-400 block">{it.variantTitle}</span>}
                    <span className="text-[10px] text-slate-400">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <strong>-₹{discount.toLocaleString("en-IN")}</strong>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Delivery</span>
                <strong>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t text-sm font-extrabold text-[#0A192F]">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Independent database transaction processing.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
