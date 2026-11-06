"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Printer,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export default function PrintOnDemandIntegrationPage() {
  const [activePartner, setActivePartner] = useState<"QIKINK" | "PRINTROVE">("QIKINK");
  const [apiKey, setApiKey] = useState("qk_live_sec_token_9921_prod");
  const [clientSecret, setClientSecret] = useState("pr_secret_token_8820");
  const [autoForwardOrders, setAutoForwardOrders] = useState(true);
  const [whiteLabelPackaging, setWhiteLabelPackaging] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/apps" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Apps
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Print-on-Demand Suppliers</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Printer className="w-6 h-6 text-purple-600" />
            Qikink & Printrove (Print-on-Demand)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate production and dropshipping of custom apparel (oversized tees, hoodies), posters, and accessories with zero upfront inventory.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Print-on-Demand fulfillment partner rules saved!
        </div>
      )}

      {/* Partner Switcher */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setActivePartner("QIKINK")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activePartner === "QIKINK"
              ? "border-purple-600 bg-purple-50/60 shadow-xs"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <strong className="text-base font-extrabold text-slate-900">Qikink Dropshipping</strong>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
              Direct API
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Leading Indian POD manufacturer. Oversized tees, hoodies, direct-to-garment (DTG) printing, and same-day dispatch.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActivePartner("PRINTROVE")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activePartner === "PRINTROVE"
              ? "border-purple-600 bg-purple-50/60 shadow-xs"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <strong className="text-base font-extrabold text-slate-900">Printrove Merchant Hub</strong>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
              Integrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Specialists in all-over sublimation prints, mugs, tote bags, phone cases, and laser-engraved merchandise.
          </p>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>{activePartner === "QIKINK" ? "Qikink" : "Printrove"} API Credentials</span>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Automation
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">API Key / Token</label>
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Client Secret</label>
              <input
                type="password"
                required
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Fulfillment Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Fulfillment & Branding Protocols
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoForwardOrders}
                onChange={(e) => setAutoForwardOrders(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-purple-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Automatically Forward Paid Orders to Factory</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sends mockups and high-resolution print files to production the moment customer payment is confirmed.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={whiteLabelPackaging}
                onChange={(e) => setWhiteLabelPackaging(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-purple-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">100% White-Label Packaging & Custom Brand Slip</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Your store name, logo, and return address are printed on courier bags and packing slips. The customer never sees the supplier's name.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
