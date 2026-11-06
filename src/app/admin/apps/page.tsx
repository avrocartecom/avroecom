"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Boxes,
  Truck,
  FileSpreadsheet,
  MessageSquare,
  Printer,
  Share2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";
import { LockedFeatureBanner } from "@/components/admin/LockedFeatureBanner";
import { UpgradePlanModal } from "@/components/admin/UpgradePlanModal";
import { PlanTier } from "@/lib/license-core";

interface AppIntegration {
  id: string;
  name: string;
  slug: string;
  category: "LOGISTICS" | "ACCOUNTING" | "AUTOMATION" | "MARKETING" | "POD";
  description: string;
  iconBg: string;
  iconText: string;
  installed: boolean;
  partnerBadge?: string;
  link: string;
}

const APPS: AppIntegration[] = [
  {
    id: "app_shiprocket",
    name: "Shiprocket Express Logistics",
    slug: "shiprocket",
    category: "LOGISTICS",
    description: "Automate AWB generation, courier partner assignment (Delhivery, BlueDart, DTDC), pickup scheduling, and live tracking.",
    iconBg: "bg-indigo-600",
    iconText: "SR",
    installed: true,
    partnerBadge: "Official Partner",
    link: "/admin/apps/shiprocket",
  },
  {
    id: "app_zoho",
    name: "Zoho Books & Zoho Inventory",
    slug: "zoho",
    category: "ACCOUNTING",
    description: "Sync products, two-way stock levels, and automatically push sales invoices to Zoho Books for GST filing.",
    iconBg: "bg-red-600",
    iconText: "ZB",
    installed: true,
    partnerBadge: "Verified Sync",
    link: "/admin/apps/zoho",
  },
  {
    id: "app_sheets",
    name: "Google Sheets Live Sync",
    slug: "google-sheets",
    category: "AUTOMATION",
    description: "Export all incoming orders, customers, and abandoned checkouts directly into Google Spreadsheet rows in real time.",
    iconBg: "bg-emerald-600",
    iconText: "GS",
    installed: true,
    partnerBadge: "Instant Export",
    link: "/admin/apps/google-sheets",
  },
  {
    id: "app_whatsapp",
    name: "WhatsApp Business & Order Alerts",
    slug: "whatsapp",
    category: "MARKETING",
    description: "Send automated WhatsApp order confirmations, interactive COD verification buttons, and live delivery updates.",
    iconBg: "bg-emerald-500",
    iconText: "WA",
    installed: true,
    partnerBadge: "High Conversion",
    link: "/admin/apps/whatsapp",
  },
  {
    id: "app_pod",
    name: "Qikink & Printrove (Print-on-Demand)",
    slug: "pod",
    category: "POD",
    description: "Automate white-label custom merchandise, t-shirts, hoodies, and posters fulfillment directly to your customers.",
    iconBg: "bg-purple-600",
    iconText: "POD",
    installed: true,
    partnerBadge: "Drop Shipping",
    link: "/admin/apps/pod",
  },
];

export default function AppsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

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

  const filtered = APPS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === "ALL") return matchesSearch;
    return matchesSearch && a.category === activeCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Apps & Channels</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">App Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-blue-600" />
            Apps & Integrations Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect third-party logistics couriers, ERP accounting engines, WhatsApp messaging APIs, and print-on-demand fulfillment partners.
          </p>
        </div>

        <Link
          href="/admin/sales-channels"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all"
        >
          <Share2 className="w-4 h-4 text-blue-600" />
          Manage Sales Channels
        </Link>
      </div>

      {/* Locked Feature Notice for Basic Customers */}
      {permissions && permissions.featureMatrix.appIntegrations?.allowed === false && (
        <LockedFeatureBanner
          feature="appIntegrations"
          currentPlan={permissions.plan}
          onUpgradeSuccess={() => {
            fetch("/api/admin/permissions")
              .then((res) => res.json())
              .then((perm) => {
                if (perm && perm.plan) setPermissions(perm);
              });
          }}
        />
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap gap-1 text-xs">
          {["ALL", "LOGISTICS", "ACCOUNTING", "AUTOMATION", "MARKETING", "POD"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#0A192F] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat === "ALL" ? "All Apps" : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Apps Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((app) => {
          const isAppLocked = Boolean(
            permissions && permissions.featureMatrix.appIntegrations?.allowed === false
          );

          return (
            <div
              key={app.id}
              className={`p-6 rounded-2xl border shadow-2xs transition-shadow flex flex-col justify-between space-y-4 group ${
                isAppLocked
                  ? "bg-slate-50/60 border-amber-200"
                  : "bg-white border-slate-200 hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${app.iconBg} text-white font-black text-sm flex items-center justify-center shadow-md flex-shrink-0`}
                    >
                      {app.iconText}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {isAppLocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> GROW / PLUS
                    </span>
                  ) : app.partnerBadge ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                      {app.partnerBadge}
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{app.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Installed & Active
                </span>

                {isAppLocked ? (
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3 h-3" /> Upgrade
                  </button>
                ) : (
                  <Link
                    href={app.link}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    Configure <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Upgrade Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || "BASIC"}
        recommendedTarget="GROW"
        onSuccess={() => {
          fetch("/api/admin/permissions")
            .then((res) => res.json())
            .then((perm) => {
              if (perm && perm.plan) setPermissions(perm);
            });
        }}
      />
    </div>
  );
}
