"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Layers,
  CreditCard,
  ShoppingBag,
  Download,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Tag,
  ArrowUpRight,
  Filter,
  Lock,
} from "lucide-react";
import { LockedFeatureBanner } from "@/components/admin/LockedFeatureBanner";
import { UpgradePlanModal } from "@/components/admin/UpgradePlanModal";
import { PlanTier } from "@/lib/license-core";

export default function ReportsAdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d"); // today, 7d, 30d, ytd, all
  const [downloading, setDownloading] = useState(false);

  // Plan Permissions State
  const [permissions, setPermissions] = useState<{
    plan: PlanTier;
    featureMatrix: Record<string, { allowed: boolean }>;
  } | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/permissions")
      .then((res) => res.json())
      .then((perm) => {
        if (perm && perm.plan) setPermissions(perm);
      })
      .catch(() => {});
  }, []);

  const fetchReports = (selectedRange: string) => {
    setLoading(true);
    fetch(`/api/admin/reports?range=${selectedRange}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error("Failed to load reports:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports(range);
  }, [range]);

  const handleDownloadCsv = () => {
    if (permissions && permissions.featureMatrix.downloadableReports?.allowed === false) {
      setUpgradeModalOpen(true);
      return;
    }

    setDownloading(true);
    try {
      const url = `/api/admin/reports?format=csv&range=${range}`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `avro-sales-report-${range}-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV download error:", err);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  const {
    totalRevenue = 0,
    totalDiscount = 0,
    totalShippingFee = 0,
    orderCount = 0,
    averageOrderValue = 0,
    paymentMethods = {},
    statusCounts = {},
    topProducts = [],
    orders = [],
  } = data || {};

  const rangeButtons = [
    { key: "today", label: "Today" },
    { key: "7d", label: "Last 7 Days" },
    { key: "30d", label: "Last 30 Days" },
    { key: "ytd", label: "Year to Date" },
    { key: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight">
              Sales & Performance Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
              Live Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track revenue growth, payment gateways, product sales velocities, and export accounting CSV reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Range Filter Buttons */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
            {rangeButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setRange(btn.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  range === btn.key
                    ? "bg-[#0A192F] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Download CSV Button */}
          <button
            onClick={handleDownloadCsv}
            disabled={downloading}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              permissions && permissions.featureMatrix.downloadableReports?.allowed === false
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {permissions && permissions.featureMatrix.downloadableReports?.allowed === false ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock CSV Export (Plus)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? "Exporting..." : "Download CSV Report"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Locked Feature Notice for Basic Customers */}
      {permissions && permissions.featureMatrix.advancedSalesReports?.allowed === false && (
        <LockedFeatureBanner
          feature="advancedSalesReports"
          currentPlan={permissions.plan}
          onUpgradeSuccess={() => fetchReports(range)}
        />
      )}

      {loading ? (
        <div className="text-xs text-slate-400 py-16 text-center">
          Aggregating store transaction data...
        </div>
      ) : (
        <>
          {/* Key Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Gross Realized Sales
                </span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-[#0A192F]">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{orderCount} total orders placed</span>
                <span className="text-emerald-600 font-semibold">Net realized</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Average Order Value (AOV)
                </span>
                <ShoppingBag className="w-4 h-4 text-[#2563EB]" />
              </div>
              <p className="text-3xl font-extrabold text-[#2563EB]">
                ₹{averageOrderValue.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Basket size per customer</span>
                <span className="text-blue-600 font-semibold">Healthy</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Discounts Redeemed
                </span>
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-800">
                ₹{totalDiscount.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Promotional coupons applied</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Shipping Revenue
                </span>
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-800">
                ₹{totalShippingFee.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Delivery fees collected</span>
              </div>
            </div>
          </div>

          {/* Breakdown Section: Payment Methods & Order Statuses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#0A192F] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#2563EB]" />
                  Revenue by Payment Method
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">Selected Range</span>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                {Object.keys(paymentMethods).length === 0 ? (
                  <p className="text-slate-400 text-center py-6">No payments recorded in this period.</p>
                ) : (
                  Object.entries(paymentMethods).map(([pm, amt]: any) => {
                    const percent = totalRevenue > 0 ? Math.round((amt / totalRevenue) * 100) : 0;
                    return (
                      <div key={pm} className="space-y-1.5 p-3 bg-slate-50/75 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{pm}</span>
                          <span className="font-extrabold text-[#0A192F]">
                            ₹{amt.toLocaleString("en-IN")}{" "}
                            <span className="text-[10px] font-semibold text-slate-400 ml-1">
                              ({percent}%)
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#2563EB] h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#0A192F] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Order Fulfillment Statuses
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{orderCount} Total</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                {Object.keys(statusCounts).length === 0 ? (
                  <p className="text-slate-400 text-center py-6">No order statuses in this period.</p>
                ) : (
                  Object.entries(statusCounts).map(([status, count]: any) => (
                    <div
                      key={status}
                      className="p-3 bg-slate-50/75 rounded-xl border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                          {status}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white border border-slate-200 text-[#0A192F]">
                        {count} orders
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Top Selling Products Velocity */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#0A192F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Top Performing Products by Gross Volume
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Ranked by revenue</span>
            </div>

            {topProducts.length === 0 ? (
              <p className="text-slate-400 text-center py-8 text-xs">No product sales in this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Product Name</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3 text-right">Units Sold</th>
                      <th className="py-2.5 px-3 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topProducts.map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900 max-w-xs truncate">
                          {p.title}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                          {p.sku || "—"}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-slate-700">
                          {p.count} units
                        </td>
                        <td className="py-3 px-3 text-right font-extrabold text-[#0A192F]">
                          ₹{p.revenue.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Plan Upgrade Modal (targeting Plus for downloadable reports) */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || "BASIC"}
        recommendedTarget="PLUS"
        onSuccess={() => {
          fetchReports(range);
        }}
      />
    </div>
  );
}
