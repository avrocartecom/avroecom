"use client";

import { useState } from "react";
import { Search, PackageCheck, Truck, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("ORD-2026-1001");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;

    setLoading(true);
    setErrorMsg("");
    setOrder(null);

    try {
      const res = await fetch(`/api/store/track?orderNumber=${encodeURIComponent(orderNumber)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Order not found. Please verify order number.");
      }
      setOrder(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to locate order.");
    } finally {
      setLoading(false);
    }
  };

  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0A192F]">Track Your Shipment</h1>
        <p className="text-xs text-slate-500">
          Enter your AVRO order number (e.g. ORD-2026-1001) to view real-time delivery status.
        </p>
      </div>

      <form onSubmit={handleLookup} className="max-w-lg mx-auto flex gap-2">
        <input
          type="text"
          required
          placeholder="e.g. ORD-2026-1001"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 px-4 py-3 text-xs border border-slate-300 rounded-xl focus:outline-none uppercase font-mono"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
        >
          <Search className="w-4 h-4" />
          Track
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-lg mx-auto p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="font-mono text-xs text-slate-400">Order Number</span>
              <h2 className="text-xl font-extrabold text-[#0A192F]">{order.orderNumber}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Delivery Timeline Progress */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              {steps.map((st, i) => {
                const currentIndex = steps.indexOf(order.orderStatus);
                const isPassed = currentIndex >= i;
                const isCurrent = order.orderStatus === st;

                return (
                  <div
                    key={st}
                    className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                      isCurrent
                        ? "bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-sm"
                        : isPassed
                        ? "bg-blue-50 text-blue-900 border-blue-200"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                    }`}
                  >
                    <span className="text-[10px] block font-mono">0{i + 1}</span>
                    <span className="text-[11px] block">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {order.trackingNumber && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <strong className="block text-slate-900">Carrier: {order.shippingProvider}</strong>
                  <span className="font-mono text-slate-500">AWB Tracking: {order.trackingNumber}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                In Transit
              </span>
            </div>
          )}

          {/* Items Summary */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ordered Merchandise</h4>
            <div className="divide-y text-xs">
              {order.items?.map((it: any) => (
                <div key={it.id} className="py-2.5 flex justify-between">
                  <div>
                    <strong className="text-slate-800">{it.title}</strong>
                    {it.variantTitle && <span className="text-slate-500 block">{it.variantTitle}</span>}
                    <span className="text-slate-400 block font-mono text-[10px]">Qty: {it.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{it.total.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
