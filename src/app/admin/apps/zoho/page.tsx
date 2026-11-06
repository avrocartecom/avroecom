"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  ShieldCheck,
  CreditCard,
  Building,
} from "lucide-react";

export default function ZohoIntegrationPage() {
  const [orgId, setOrgId] = useState("60021948102");
  const [clientId, setClientId] = useState("1000.ZOHO_CLIENT_9921_PROD");
  const [clientSecret, setClientSecret] = useState("************************");
  const [syncStock, setSyncStock] = useState(true);
  const [autoCreateInvoices, setAutoCreateInvoices] = useState(true);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("✅ Zoho Inventory & Books Two-Way Sync Complete!\n- 48 Catalog SKUs matched.\n- Real-time stock levels aligned.\n- 12 Pending tax invoices synced to Zoho Books.");
    }, 1500);
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
            <span className="text-xs font-bold text-slate-700">Zoho Integration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Building className="w-6 h-6 text-red-600" />
            Zoho Books & Zoho Inventory Sync
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronize stock quantities across warehouse locations and automatically create GST-compliant sales invoices in Zoho Books.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            Sync Now
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
          Zoho Books & Inventory connection settings saved!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Zoho OAuth API Configuration</span>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Zoho Organization ID</label>
              <input
                type="text"
                required
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Client ID</label>
                <input
                  type="text"
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
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
        </div>

        {/* Sync Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Two-Way Synchronization Rules
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={syncStock}
                onChange={(e) => setSyncStock(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Two-Way Real-Time Inventory Stock Sync</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  When stock changes in Zoho Inventory or physical point-of-sale, the available quantity updates on your storefront instantly to prevent overselling.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCreateInvoices}
                onChange={(e) => setAutoCreateInvoices(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Automatically Create Tax Invoices in Zoho Books</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Creates official GST tax invoices with customer GSTIN, HSN codes, and itemized IGST/CGST/SGST breakdowns for streamlined chartered accountant filing.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
