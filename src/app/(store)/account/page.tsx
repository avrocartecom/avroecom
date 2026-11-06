"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  Clock,
  Truck,
  CheckCircle2,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/auth/me");
      const data = await res.json();

      if (!data.authenticated || !data.customer) {
        router.push("/login?redirect=/account");
        return;
      }
      setCustomer(data.customer);

      // Load customer orders
      const ordersRes = await fetch(`/api/customer/orders?customerId=${data.customer.id}`);
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
    } catch {
      router.push("/login?redirect=/account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/customer/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading your account...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Profile Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20">
            {customer?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{customer?.name}</h1>
              {customer?.isGuest ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                  Guest
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Verified Member
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">{customer?.email}</p>
            {customer?.phone && <p className="text-xs text-slate-400 font-mono">{customer?.phone}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Link
            href="/wishlist"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-2xs"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Wishlist ({customer?.wishlistCount || 0})</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Recent Orders & Tracking</h2>
              <p className="text-xs text-slate-500">Live fulfillment status, itemized receipts, and courier tracking.</p>
            </div>
          </div>
          <Link
            href="/track"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Track by AWB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">You haven't placed any orders yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When you purchase items from our store catalog, your real-time tracking and delivery updates will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {order.items?.length || 1} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{order.total?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          order.orderStatus === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : order.orderStatus === "SHIPPED"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/track?id=${order.orderNumber}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Track <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
