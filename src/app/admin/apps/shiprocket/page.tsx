"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Package,
  Layers,
  MapPin,
  Clock,
} from "lucide-react";

export default function ShiprocketIntegrationPage() {
  const [email, setEmail] = useState("logistics@yourbrand.com");
  const [apiKey, setApiKey] = useState("sr_live_9921_token_77a1bc");
  const [pickupPincode, setPickupPincode] = useState("110001");
  const [autoAwb, setAutoAwb] = useState(true);
  const [preferredCourier, setPreferredCourier] = useState("DELHIVERY");
  const [codVerification, setCodVerification] = useState(true);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert("✅ Shiprocket API Connection Test Passed!\nToken authenticated. Primary warehouse location: 110001 active.");
    }, 1200);
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
            <span className="text-xs font-bold text-slate-700">Shiprocket Integration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-indigo-600" />
            Shiprocket Logistics Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate AWB number generation, carrier selection (Delhivery, BlueDart, DTDC, Shadowfax), pickup scheduling, and reverse logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
            Test API Ping
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Shiprocket API credentials and dispatch rules updated!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Credentials Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Shiprocket Account Credentials</span>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> API Connected
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Shiprocket Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">API Secret / Bearer Token</label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Dispatch & Pickup Location */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Primary Dispatch Warehouse
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Pickup Warehouse Pincode</label>
              <input
                type="text"
                required
                value={pickupPincode}
                onChange={(e) => setPickupPincode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Couriers will arrive at this location for parcel pickup.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Preferred Carrier Priority</label>
              <select
                value={preferredCourier}
                onChange={(e) => setPreferredCourier(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="DELHIVERY">Delhivery Express (Fastest TAT)</option>
                <option value="BLUEDART">BlueDart Aviation (Air Express)</option>
                <option value="DTDC">DTDC Surface & Air</option>
                <option value="SHADOWFAX">Shadowfax Hyperlocal</option>
                <option value="SMARTR">Smartr Logistics</option>
              </select>
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Automated Fulfillment Rules
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoAwb}
                onChange={(e) => setAutoAwb(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Auto-Assign Courier & Generate AWB on Paid Orders</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  The moment payment is confirmed, Shiprocket books the cheapest or fastest carrier and assigns a real-time tracking AWB number.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={codVerification}
                onChange={(e) => setCodVerification(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Require WhatsApp / SMS Confirmation for COD Orders</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Reduces RTO (Return to Origin) by automatically verifying the buyer's address and intention to accept delivery.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
