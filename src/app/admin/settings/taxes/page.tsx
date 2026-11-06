"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Percent,
  ShieldCheck,
  Save,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function TaxesSettingsPage() {
  const [gstin, setGstin] = useState("07AABCT1234A1Z5");
  const [pricesIncludeGst, setPricesIncludeGst] = useState(true);
  const [chargeShippingGst, setChargeShippingGst] = useState(true);
  const [defaultHsnCode, setDefaultHsnCode] = useState("61091000");
  const [defaultGstRate, setDefaultGstRate] = useState("18");
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
            <Link href="/admin/settings" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Settings
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Taxes and GST</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Percent className="w-6 h-6 text-emerald-600" />
            Taxes & GST Compliance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Indian Goods and Services Tax (GST) registration, tax-inclusive pricing, and HSN codes for invoices.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Tax Settings
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          GST & Tax settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* GST Registration Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Business GST Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Registered GSTIN Number *</label>
              <input
                type="text"
                required
                placeholder="27AAAAA0000A1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm uppercase"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Printed automatically on all customer invoices and B2B receipts.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Default HSN / SAC Code</label>
              <input
                type="text"
                placeholder="HSN / SAC Code"
                value={defaultHsnCode}
                onChange={(e) => setDefaultHsnCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Default Harmonized System Nomenclature code for your primary catalog.
              </span>
            </div>
          </div>
        </div>

        {/* Tax Calculation Logic */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Tax Calculation Protocols
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={pricesIncludeGst}
                onChange={(e) => setPricesIncludeGst(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">All Product Prices Include GST (Recommended for India B2C)</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Customers pay exactly the amount displayed on the product page. The tax component is reverse-calculated on the final invoice.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={chargeShippingGst}
                onChange={(e) => setChargeShippingGst(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Charge GST on Express Shipping Rates (18%)</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Applies standard 18% logistics GST on courier charges.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* GST Rates Slab */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Default Standard GST Slab
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["0", "5", "12", "18", "28"].map((rate) => (
              <button
                type="button"
                key={rate}
                onClick={() => setDefaultGstRate(rate)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  defaultGstRate === rate
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-xs font-black"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
                }`}
              >
                <span className="text-lg block">{rate}% GST</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {rate === "18" && "Standard Apparel / Tech"}
                  {rate === "12" && "Processed Goods"}
                  {rate === "5" && "Footwear < ₹1000"}
                  {rate === "0" && "Exempt Items"}
                  {rate === "28" && "Luxury Goods"}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px] space-y-1">
            <strong>State vs Interstate Tax Routing:</strong>
            <p className="text-blue-800">
              Orders shipped within your registered state are automatically split into <strong>CGST (9%) + SGST (9%)</strong>. Orders delivered to other states apply <strong>IGST (18%)</strong>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
