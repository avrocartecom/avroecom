"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Send,
  Smartphone,
  Check,
} from "lucide-react";

export default function WhatsAppEmailIntegrationPage() {
  const [provider, setProvider] = useState("AISENSY");
  const [apiKey, setApiKey] = useState("wa_live_sec_token_9921_prod");
  const [businessPhone, setBusinessPhone] = useState("+91 98765 43210");
  const [enableCodConfirmation, setEnableCodConfirmation] = useState(true);
  const [enableTrackingAlerts, setEnableTrackingAlerts] = useState(true);
  const [enableAbandonedRecovery, setEnableAbandonedRecovery] = useState(true);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSendTestMessage = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      alert(`✅ WhatsApp Test Message Dispatched to ${businessPhone}!\n"Hi Ananya! Your order #1042 has been confirmed. Click below to verify COD delivery."`);
    }, 1300);
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
            <span className="text-xs font-bold text-slate-700">WhatsApp & Messaging</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            WhatsApp Business & Email Integration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Send real-time WhatsApp order updates, interactive COD verification buttons to reduce returns, and live tracking links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSendTestMessage}
            disabled={testing}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2"
          >
            <Send className={`w-3.5 h-3.5 ${testing ? "animate-pulse" : ""}`} />
            Send Test WhatsApp
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
          WhatsApp Business settings and interactive message templates updated!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* WhatsApp Provider Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>WhatsApp Business API Provider</span>
            <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official API Connected
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Provider Service</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="AISENSY">AISensy (Fast Setup)</option>
                <option value="WATI">Wati.io</option>
                <option value="INTERAKT">Interakt (Jio Haptik)</option>
                <option value="GUPSHUP">Gupshup Enterprise</option>
                <option value="META">Meta Official Cloud API</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Registered Business Phone Number</label>
              <input
                type="tel"
                required
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">API Key / Access Token</label>
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

        {/* Automated WhatsApp Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Interactive Customer Notification Flows
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCodConfirmation}
                onChange={(e) => setEnableCodConfirmation(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Interactive COD Order Confirmation Buttons</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sends interactive WhatsApp buttons: <code>[Confirm My Order]</code> and <code>[Cancel Order]</code>. Proven to reduce RTO courier losses by up to 35%.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableTrackingAlerts}
                onChange={(e) => setEnableTrackingAlerts(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Live Courier Dispatch & Delivery Tracking Alerts</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sends courier AWB number, delivery executive live map tracking link, and estimated delivery date directly to customer's WhatsApp.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAbandonedRecovery}
                onChange={(e) => setEnableAbandonedRecovery(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Abandoned Cart Recovery Reminders (1 Hour Post-Checkout)</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sends product image preview with 1-click checkout recovery link and optional discount code.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
