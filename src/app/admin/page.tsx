"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  PackageCheck,
  Layers,
  AlertTriangle,
  Users,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Truck,
  Tag,
  Package,
  Plus,
  Sliders,
  CreditCard,
  Printer,
  Search,
  RefreshCw,
  FolderOpen,
  Palette,
  ShieldCheck,
  Store,
  DollarSign,
  PackagePlus,
  UploadCloud,
  CheckCircle2,
  Check,
  Globe,
} from "lucide-react";

export default function StoreDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Setup Checklist State
  const [setupTasks, setSetupTasks] = useState([
    {
      id: "products",
      title: "Add your first catalog products & variants",
      desc: "Upload photos, set pricing, and configure inventory counts.",
      done: true,
      href: "/admin/products",
      btnText: "Manage Products",
    },
    {
      id: "payments",
      title: "Configure payment gateways & Cash on Delivery",
      desc: "Enable Razorpay, Cashfree, UPI AutoPay, or instant COD.",
      done: true,
      href: "/admin/settings/payments",
      btnText: "Review Gateways",
    },
    {
      id: "shipping",
      title: "Set up shipping zones & courier rates",
      desc: "Configure manual shipping, flat rate, or free shipping threshold.",
      done: true,
      href: "/admin/settings/shipping",
      btnText: "Configure Rates",
    },
    {
      id: "support",
      title: "Technext Central Merchant Support",
      desc: "Direct SLA ticket hotline and developer assistance from central command.",
      done: true,
      href: "/admin/support",
      btnText: "Open Support",
    },
  ]);
  const [showChecklist, setShowChecklist] = useState(true);

  const completedCount = setupTasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / setupTasks.length) * 100);

  const loadDashboard = () => {
    setLoading(true);
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
          <Clock className="w-5 h-5 text-blue-600 animate-spin" />
          <span>Synchronizing store telemetry & inventory...</span>
        </div>
      </div>
    );
  }

  const { stats, recentOrders } = data || {};

  // Filter recent orders
  const filteredOrders = (recentOrders || []).filter((ord: any) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "PENDING"
        ? ord.orderStatus === "PENDING"
        : statusFilter === "PROCESSING"
        ? ["CONFIRMED", "PROCESSING", "PACKED"].includes(ord.orderStatus)
        : ord.orderStatus === "DELIVERED";

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-1 sm:p-2">
      {/* Welcome header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Store Operations Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Storefront
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time sales velocity, fulfillment dispatch queue, and catalog inventory governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Live Store</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/admin/orders"
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Dispatch Orders</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Setup Checklist Cards */}
      {showChecklist && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  ONBOARDING CHECKLIST
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {completedCount} of {setupTasks.length} tasks completed ({progressPercent}%)
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Complete your store launch setup
              </h3>
            </div>
            <button
              onClick={() => setShowChecklist(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold self-start sm:self-auto"
            >
              Dismiss checklist
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {setupTasks.map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                  t.done
                    ? "bg-slate-50/70 border-slate-200/80"
                    : "bg-blue-50/30 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      t.done
                        ? "bg-emerald-500 text-white"
                        : "border-2 border-slate-300 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        t.done ? "text-slate-700 line-through" : "text-slate-900"
                      }`}
                    >
                      {t.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                  </div>
                </div>

                <Link
                  href={t.href}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex-shrink-0 whitespace-nowrap ${
                    t.done
                      ? "text-slate-600 bg-white border border-slate-200 hover:bg-slate-100"
                      : "text-white bg-[#0A192F] hover:bg-[#1E293B]"
                  }`}
                >
                  {t.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Sales Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{stats?.totalSales?.toLocaleString("en-IN") || 0}
          </p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold">
              Today: ₹{stats?.todaySales?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-slate-400 font-medium">100% Direct Revenue</span>
          </div>
        </div>

        {/* Orders Processed */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Orders Processed
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalOrders || 0}</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-blue-600 font-bold">AOV: ₹{stats?.averageOrderValue || 0}</span>
            <span className="text-slate-400 font-medium">{stats?.processingOrders || 0} In Packaging</span>
          </div>
        </div>

        {/* Catalog SKUs & Combos */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Catalog Offerings
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalProducts || 0} Products</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-purple-600 font-bold">{stats?.comboDealsCount || 0} Combo Bundles</span>
            <Link href="/admin/combos" className="text-blue-600 hover:underline font-bold">
              Manage &rarr;
            </Link>
          </div>
        </div>

        {/* Customers & Shoppers */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Store Shoppers
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{stats?.totalCustomers || 0} Customers</p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-bold">{stats?.guestCustomers || 0} Guest Shoppers</span>
            <Link href="/admin/customers" className="text-blue-600 hover:underline font-bold">
              View All &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Store at a glance conversion strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs text-xs">
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">Store Conversion Rate</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">3.42%</span>
          <span className="text-emerald-600 font-bold text-[10px]">+0.8% vs last week</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">Storefront Visitors</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">1,480</span>
          <span className="text-blue-600 font-bold text-[10px]">Real-time active</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">Returning Customers</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">28.5%</span>
          <span className="text-purple-600 font-bold text-[10px]">High loyalty index</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl">
          <span className="text-slate-400 font-bold block text-[10px] uppercase">Abandoned Cart Rate</span>
          <span className="text-lg font-black text-slate-900 block mt-0.5">18.2%</span>
          <Link href="/admin/orders/abandoned" className="text-blue-600 font-bold text-[10px] hover:underline">
            Recover Carts &rarr;
          </Link>
        </div>
      </div>

      {/* Fulfillment Pipeline Strip */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Order Dispatch & Fulfillment Pipeline
            </h3>
            <p className="text-xs text-slate-400">
              Current live order distribution across courier fulfillment milestones.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            Dispatch Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
                Awaiting Fulfillment
              </span>
              <p className="text-2xl font-black text-amber-950">{stats?.pendingOrders || 0}</p>
              <span className="text-[10px] text-amber-700">Orders ready to print shipping labels</span>
            </div>
            <Clock className="w-8 h-8 text-amber-600 opacity-40" />
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-blue-800 font-bold uppercase tracking-wider">
                Packed & Dispatched
              </span>
              <p className="text-2xl font-black text-blue-950">{stats?.processingOrders || 0}</p>
              <span className="text-[10px] text-blue-700">Shipped with carrier tracking</span>
            </div>
            <Truck className="w-8 h-8 text-blue-600 opacity-40" />
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
                Delivered Customers
              </span>
              <p className="text-2xl font-black text-emerald-950">{stats?.completedOrders || 0}</p>
              <span className="text-[10px] text-emerald-700">Doorstep delivery confirmed</span>
            </div>
            <PackageCheck className="w-8 h-8 text-emerald-600 opacity-40" />
          </div>
        </div>
      </div>

      {/* Recent Orders Interactive Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Recent Customer Transactions</h3>
            <p className="text-xs text-slate-500">Live order activity from your customer storefront.</p>
          </div>

          {/* Table Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, buyers..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(["ALL", "PENDING", "PROCESSING", "DELIVERED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st === "ALL" ? "All" : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">No matching orders found</p>
            <p className="text-[11px] text-slate-400">
              Transactions placed on your storefront will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Order #</th>
                  <th className="pb-3 px-2">Customer</th>
                  <th className="pb-3 px-2">Amount</th>
                  <th className="pb-3 px-2">Payment</th>
                  <th className="pb-3 px-2">Fulfillment</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {ord.customerName?.slice(0, 2).toUpperCase() || "CU"}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                          <span className="text-[10px] text-slate-400">{ord.customerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 font-black text-slate-900">
                      ₹{ord.total.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="font-semibold text-slate-700 block text-[11px]">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded uppercase inline-block mt-0.5 ${
                          ord.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                          ord.orderStatus === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.orderStatus === "SHIPPED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ord.orderStatus === "DELIVERED"
                              ? "bg-emerald-600"
                              : ord.orderStatus === "SHIPPED"
                              ? "bg-blue-600 animate-pulse"
                              : "bg-amber-600"
                          }`}
                        />
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right whitespace-nowrap space-x-1.5">
                      <Link
                        href="/admin/orders"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200/80 shadow-2xs inline-flex items-center gap-1 text-[11px]"
                      >
                        <Tag className="w-3 h-3 text-emerald-600" />
                        <span>Print Label</span>
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                      >
                        Inspect
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
