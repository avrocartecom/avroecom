"use client";

import { useState } from "react";
import { Lock, Sparkles, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { FeatureKey, FEATURE_REGISTRY, PLAN_NAMES, PlanTier } from "@/lib/license-core";
import { UpgradePlanModal } from "./UpgradePlanModal";

interface LockedFeatureBannerProps {
  feature: FeatureKey;
  currentPlan?: PlanTier;
  customMessage?: string;
  onUpgradeSuccess?: () => void;
}

export function LockedFeatureBanner({
  feature,
  currentPlan = "BASIC",
  customMessage,
  onUpgradeSuccess,
}: LockedFeatureBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const meta = FEATURE_REGISTRY[feature];

  const requiredPlan = meta?.requiredPlan || "GROW";
  const displayMsg =
    customMessage ||
    meta?.upgradeMessage ||
    `${meta?.name || "This feature"} is available in the ${requiredPlan} plan. Upgrade your subscription to unlock this feature.`;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1A30] via-[#0E2244] to-[#0B1A30] border-2 border-amber-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-6">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Lock info */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-inner flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                FEATURE LOCKED ON {currentPlan} PLAN
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {meta?.name || "Premium Capability"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {displayMsg}
              </p>
            </div>

            {/* Quick feature checklist */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Instant Activation
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Loss
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Prorated Upgrade
              </span>
            </div>
          </div>

          {/* Right: Upgrade CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Upgrade to {requiredPlan}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="/admin/license"
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs font-bold text-center transition"
            >
              View All Plan Inclusions
            </a>
          </div>
        </div>
      </div>

      <UpgradePlanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentPlan={currentPlan}
        recommendedTarget={requiredPlan}
        onSuccess={() => {
          setModalOpen(false);
          if (onUpgradeSuccess) onUpgradeSuccess();
          else window.location.reload();
        }}
      />
    </>
  );
}
