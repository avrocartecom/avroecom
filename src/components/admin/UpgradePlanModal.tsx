"use client";

import { useState } from "react";
import {
  X,
  Check,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PlanTier, PLAN_PRICING, PLAN_NAMES } from "@/lib/license-core";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PlanTier;
  recommendedTarget?: PlanTier;
  onSuccess?: () => void;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  currentPlan = "BASIC",
  recommendedTarget = "GROW",
  onSuccess,
}: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(
    currentPlan === "GROW" ? "PLUS" : recommendedTarget
  );
  const [upgrading, setUpgrading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const plansList: {
    tier: PlanTier;
    name: string;
    price: number;
    description: string;
    features: string[];
    isPopular?: boolean;
  }[] = [
    {
      tier: "GROW",
      name: "AVRO Business Grow",
      price: PLAN_PRICING.GROW.monthly, // 499
      description: "Automate courier shipping, full theme design options, custom pages & product reviews.",
      isPopular: true,
      features: [
        "Full Theme Customization & Colors",
        "All 13 Specialized Theme Archetypes",
        "Shiprocket, Delhivery & DTDC Courier APIs",
        "Product Reviews & Customer Rating Moderation",
        "Advanced SEO & OpenGraph Controls",
        "Create & Edit Custom CMS Pages",
        "Third-party App Directory & Sales Channels",
        "Google Sheets & Zoho Books Live Sync",
        "Print-on-Demand (Qikink & Printrove)",
        "Advanced Sales Reports & Growth Analytics",
        "Up to 3 Administrator Staff Accounts",
      ],
    },
    {
      tier: "PLUS",
      name: "AVRO Enterprise Plus",
      price: PLAN_PRICING.PLUS.monthly, // 799
      description: "Scale high-volume retail with B2B wholesale portals, multi-store switchers & 24/7 priority support.",
      features: [
        "Everything in Business Grow Included",
        "B2B Wholesale & Company Portals (Net-30)",
        "Multi-Store Dedicated Branch Nodes",
        "Downloadable Excel/CSV Sales Spreadsheets",
        "Advanced Attribution & Customer Lifetime Value",
        "Unlimited Administrator Staff Accounts",
        "Priority 24/7 Direct Call Support Channel",
        "Custom Feature Add-ons & Service Grants",
      ],
    },
  ];

  // Only show higher tiers than current plan
  const upgradeOptions = plansList.filter((p) => {
    if (currentPlan === "BASIC") return true;
    if (currentPlan === "GROW") return p.tier === "PLUS";
    return false;
  });

  const handleConfirmUpgrade = async () => {
    setUpgrading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/license/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetPlan: selectedPlan,
          paymentReference: `UPG_PORTAL_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to process plan upgrade.");
        setUpgrading(false);
        return;
      }

      setSuccessMsg(
        `Subscription successfully upgraded to ${selectedPlan}! All package features have been unlocked.`
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
        else window.location.reload();
      }, 1500);
    } catch (err: any) {
      setErrorMsg("Network error connecting to licensing service.");
      setUpgrading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0B1A30] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUBSCRIPTION PLAN UPGRADE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Upgrade Your AVRO Store Subscription
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Plan:{" "}
              <strong className="text-white font-bold">{currentPlan}</strong>. Select an upgraded tier to unlock premium capabilities instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upgradeOptions.map((opt) => {
            const isSelected = selectedPlan === opt.tier;
            return (
              <div
                key={opt.tier}
                onClick={() => setSelectedPlan(opt.tier)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "bg-[#0E2344] border-blue-500 shadow-xl shadow-blue-950/50"
                    : "bg-[#061120] border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100"
                }`}
              >
                {opt.isPopular && (
                  <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Recommended
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{opt.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-blue-500 bg-blue-500" : "border-slate-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹{opt.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ month</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    {opt.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Key Inclusions:
                    </span>
                    {opt.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                    {opt.features.length > 6 && (
                      <span className="text-[10px] text-blue-400 font-semibold block pt-1">
                        + {opt.features.length - 6} additional enterprise features
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Prorated billing · Offline cryptographic HMAC verified · Instant unlock</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={upgrading}
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={upgrading}
              onClick={handleConfirmUpgrade}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 disabled:opacity-50 transition cursor-pointer"
            >
              {upgrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Upgrade...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm & Upgrade to {selectedPlan}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
