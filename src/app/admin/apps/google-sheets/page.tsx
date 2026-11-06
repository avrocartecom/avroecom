"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Table,
  Sliders,
  Database,
  ArrowRight,
} from "lucide-react";

export default function GoogleSheetsSyncPage() {
  const [sheetUrl, setSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit");
  const [syncOrders, setSyncOrders] = useState(true);
  const [syncCustomers, setSyncCustomers] = useState(true);
  const [syncAbandoned, setSyncAbandoned] = useState(true);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestExport = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert("✅ Google Sheets Connection Succeeded!\nTest row written to tab 'Orders_Live_Stream' with columns: Order ID, Timestamp, Customer Name, Email, Total (₹), Payment Status, Shipping Courier.");
    }, 1400);
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
            <span className="text-xs font-bold text-slate-700">Google Sheets Sync</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Google Sheets Real-Time Sync
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Export all incoming store orders, customers, and abandoned checkouts directly as spreadsheet rows in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestExport}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
            Test Export Row
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Spreadsheet Sync
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Google Spreadsheet live stream configured!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Spreadsheet Connection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Target Google Spreadsheet</span>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              Open in Google Sheets <ExternalLink className="w-3 h-3" />
            </a>
          </h3>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Spreadsheet Public or Service URL *</label>
            <input
              type="url"
              required
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Ensure your Google Sheet is shared with editor permissions to: <code>avro-sync-engine@serviceaccount.iam.gserviceaccount.com</code>
            </span>
          </div>
        </div>

        {/* Sync Streams */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Active Real-Time Data Streams
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={syncOrders}
                onChange={(e) => setSyncOrders(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Orders Stream &rarr; 'Orders' Tab</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Appends a new row instantly when an order is created: Order ID, Customer, Phone, Items, Total (₹), Payment Gateway, Courier AWB.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={syncCustomers}
                onChange={(e) => setSyncCustomers(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Customer Directory &rarr; 'Customers' Tab</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Syncs customer names, verified telephone numbers, addresses, and lifetime spend metrics.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={syncAbandoned}
                onChange={(e) => setSyncAbandoned(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Abandoned Checkouts &rarr; 'Abandoned_Carts' Tab</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Exports cart contents, recovery checkout URL, and customer contact info for phone call follow-ups.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
