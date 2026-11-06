"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Key,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Save,
  RotateCw,
  Server,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Truck,
  ShoppingCart,
  Check,
  AlertTriangle,
} from "lucide-react";

interface EmailConfigState {
  enabled: boolean;
  provider: "GMAIL" | "OUTLOOK" | "CUSTOM_SMTP";
  senderEmail: string;
  appPassword: string;
  hasAppPassword?: boolean;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  encryption: "TLS" | "SSL";
  merchantNotificationEmail: string;
  events: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    orderDelivered: boolean;
    adminNewOrderAlert: boolean;
  };
}

export default function NotificationsSettingsPage() {
  const [config, setConfig] = useState<EmailConfigState>({
    enabled: true,
    provider: "GMAIL",
    senderEmail: "",
    appPassword: "",
    hasAppPassword: false,
    senderName: "AVRO Store",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    encryption: "TLS",
    merchantNotificationEmail: "",
    events: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      adminNewOrderAlert: true,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null);

  // Test Email State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Template Preview Modal
  const [previewModal, setPreviewModal] = useState<"CONFIRMATION" | "SHIPPED" | "ALERT" | null>(null);

  // Load configuration on mount
  useEffect(() => {
    fetch("/api/admin/settings/email")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setConfig({
            ...data.settings,
            appPassword: data.settings.hasAppPassword ? "••••••••••••••••" : "",
          });
          if (data.settings.senderEmail) {
            setTestEmailRecipient(data.settings.senderEmail);
          }
        }
      })
      .catch((err) => console.error("Error fetching email settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleProviderSelect = (provider: "GMAIL" | "OUTLOOK" | "CUSTOM_SMTP") => {
    if (provider === "GMAIL") {
      setConfig((prev) => ({
        ...prev,
        provider: "GMAIL",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        encryption: "TLS",
      }));
    } else if (provider === "OUTLOOK") {
      setConfig((prev) => ({
        ...prev,
        provider: "OUTLOOK",
        smtpHost: "smtp.office365.com",
        smtpPort: 587,
        encryption: "TLS",
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        provider: "CUSTOM_SMTP",
      }));
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/admin/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveStatus({
          type: data.warning ? "warning" : "success",
          message: data.message || "Email automation settings saved successfully!",
        });
        setConfig((prev) => ({
          ...prev,
          hasAppPassword: Boolean(prev.appPassword || prev.hasAppPassword),
        }));
      } else {
        setSaveStatus({
          type: "error",
          message: data.error || "Failed to save settings.",
        });
      }
    } catch (err: any) {
      setSaveStatus({
        type: "error",
        message: err?.message || "Network error while saving settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) return;

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/settings/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmailRecipient.trim(),
          senderEmail: config.senderEmail,
          appPassword: config.appPassword,
          provider: config.provider,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          encryption: config.encryption,
          senderName: config.senderName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({ success: true, message: data.message });
      } else {
        setTestResult({ success: false, message: data.error || "Failed to send test email." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || "Network error sending test email." });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <Link href="/admin/settings" className="hover:text-slate-800 transition-colors">
            Settings
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Email Automation & Notifications</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight flex items-center gap-2.5">
              <Mail className="w-6 h-6 text-blue-600" />
              Email Automation Setup
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure your sender email address and App Password to automatically dispatch transactional order receipts, AWB courier tracking, and sale alerts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setTestResult(null);
                setTestModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Send Test Email</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? "Saving..." : "Save Configuration"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 animate-in fade-in ${
            saveStatus.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : saveStatus.type === "warning"
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-rose-50 border-rose-300 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : saveStatus.type === "warning" ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{saveStatus.message}</span>
          </div>
          <button
            onClick={() => setSaveStatus(null)}
            className="text-slate-400 hover:text-slate-700 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN CONFIGURATION CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Card Header with Master Switch */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                SMTP Credentials & Sender Authorization
              </h2>
              <p className="text-xs text-slate-500">
                Messages are dispatched directly through your authorized mailbox.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">
              {config.enabled ? "Automation Active" : "Automation Paused"}
            </span>
            <button
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                config.enabled ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Email Service Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleProviderSelect("GMAIL")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  config.provider === "GMAIL"
                    ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-extrabold text-xs">
                  M
                </div>
                <div>
                  <div className="text-xs font-extrabold">Google / Gmail</div>
                  <div className="text-[10px] text-slate-500">App Password (Recommended)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect("OUTLOOK")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  config.provider === "OUTLOOK"
                    ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 font-extrabold text-xs">
                  O
                </div>
                <div>
                  <div className="text-xs font-extrabold">Microsoft Outlook</div>
                  <div className="text-[10px] text-slate-500">Office 365 / Exchange</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect("CUSTOM_SMTP")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  config.provider === "CUSTOM_SMTP"
                    ? "bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 text-blue-900"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-extrabold text-xs">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">Custom SMTP</div>
                  <div className="text-[10px] text-slate-500">SendGrid, AWS SES, Zepto</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Guide for Gmail App Passwords */}
          {config.provider === "GMAIL" && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>How to generate a Google App Password for your store:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                <li>Log in to your Google Account at <strong className="text-slate-900">myaccount.google.com</strong>.</li>
                <li>Go to <strong className="text-slate-900">Security</strong> and ensure <strong className="text-slate-900">2-Step Verification</strong> is ON.</li>
                <li>In the top search bar, type <strong className="text-slate-900">App Passwords</strong> and select it.</li>
                <li>Enter an app name (e.g. <em className="text-blue-700">AVRO Store</em>) and click <strong className="text-slate-900">Create</strong>.</li>
                <li>Copy the generated <strong className="text-slate-900 font-mono">16-character code</strong> and paste it into the App Password field below.</li>
              </ol>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            {/* Sender Email */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Sender Email Address *</span>
                <span className="text-[11px] font-normal text-slate-400">Outgoing mailbox</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={config.senderEmail}
                  onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
                  placeholder="merchant@gmail.com or orders@yourdomain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-mono transition-all text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                All order confirmations and tracking alerts will be delivered from this address.
              </p>
            </div>

            {/* App Password */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>App Password / SMTP Password *</span>
                {config.hasAppPassword && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ✓ Password Saved
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required={!config.hasAppPassword}
                  value={config.appPassword}
                  onChange={(e) => setConfig({ ...config, appPassword: e.target.value })}
                  placeholder={config.hasAppPassword ? "•••••••••••••••• (Leave blank to keep current)" : "xxxx xxxx xxxx xxxx"}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-mono transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Your 16-character Google App Password or SMTP key. Kept strictly private on your store node.
              </p>
            </div>

            {/* Sender Display Name */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Sender Display Name
              </label>
              <input
                type="text"
                value={config.senderName}
                onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                placeholder="e.g. AVRO Signature Store"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                The friendly sender name shown in customers' inboxes (e.g. "MyBrand Orders").
              </p>
            </div>

            {/* Merchant Alert Recipient */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Merchant Order Alert Email</span>
                <span className="text-[10px] text-slate-400">Optional</span>
              </label>
              <input
                type="email"
                value={config.merchantNotificationEmail}
                onChange={(e) => setConfig({ ...config, merchantNotificationEmail: e.target.value })}
                placeholder="owner@yourstore.com (defaults to sender email)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Where internal alerts are sent whenever a customer purchases on your store.
              </p>
            </div>
          </div>

          {/* Advanced SMTP Details (Host, Port, TLS) */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <span>Server Connection Details</span>
              <span className="text-[10px] font-normal text-slate-400">(Auto-configured for {config.provider})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={config.smtpHost}
                  onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={config.smtpPort}
                  onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) || 587 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Encryption Mode</label>
                <select
                  value={config.encryption}
                  onChange={(e) => setConfig({ ...config, encryption: e.target.value as "TLS" | "SSL" })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs bg-white"
                >
                  <option value="TLS">STARTTLS / TLS (Port 587)</option>
                  <option value="SSL">SSL Direct (Port 465)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>TLS 256-bit encrypted delivery to customer inboxes</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTestResult(null);
                  setTestModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Test Connection
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{saving ? "Saving..." : "Save Settings"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* AUTOMATED EMAIL TRIGGER CHANNELS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">
            Active Email Automation Events
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn specific customer and merchant event triggers on or off.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Order Confirmation */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Order Confirmation & Receipt</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                  Customer Email
                </span>
              </div>
              <p className="text-slate-500">
                Dispatches an itemized receipt with order total, delivery address, and SKU breakdown immediately after checkout.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewModal("CONFIRMATION")}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    events: { ...prev.events, orderConfirmation: !prev.events.orderConfirmation },
                  }))
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  config.events.orderConfirmation
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {config.events.orderConfirmation ? "Active" : "Disabled"}
              </button>
            </div>
          </div>

          {/* Order Shipped */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Order Dispatched & Tracking Link</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-100 text-purple-800">
                  Customer Email
                </span>
              </div>
              <p className="text-slate-500">
                Triggered automatically when courier partner (Shiprocket, Delhivery, DTDC) generates the AWB number or status changes to Shipped.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewModal("SHIPPED")}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    events: { ...prev.events, orderShipped: !prev.events.orderShipped },
                  }))
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  config.events.orderShipped
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {config.events.orderShipped ? "Active" : "Disabled"}
              </button>
            </div>
          </div>

          {/* New Order Merchant Alert */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Internal Merchant Sale Alert</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Staff Email
                </span>
              </div>
              <p className="text-slate-500">
                Sends an instant alert to your administrative mailbox whenever a customer completes a new order.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewModal("ALERT")}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    events: { ...prev.events, adminNewOrderAlert: !prev.events.adminNewOrderAlert },
                  }))
                }
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  config.events.adminNewOrderAlert
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {config.events.adminNewOrderAlert ? "Active" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TEST EMAIL MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Send Test Email</h3>
                  <p className="text-[11px] text-slate-500">Verify your SMTP & App Password credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="your-personal@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We'll send a live test message from <strong className="text-slate-700">{config.senderEmail || "your sender email"}</strong>.
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs border ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <span className="font-bold">{testResult.success ? "Success!" : "Connection Error"}</span>
                      <p className="text-[11px] leading-relaxed">{testResult.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testing || !config.senderEmail}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {testing ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{testing ? "Sending Test..." : "Send Test Email"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATE PREVIEW MODAL */}
      {previewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  {previewModal === "CONFIRMATION" && "Order Confirmation Email Preview"}
                  {previewModal === "SHIPPED" && "Order Shipped / Tracking Email Preview"}
                  {previewModal === "ALERT" && "Merchant Sale Notification Preview"}
                </h3>
                <p className="text-[11px] text-slate-500">Live responsive layout sent to recipient inboxes</p>
              </div>
              <button
                onClick={() => setPreviewModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-100 flex-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-lg mx-auto space-y-4 text-xs">
                {previewModal === "CONFIRMATION" && (
                  <>
                    <div className="bg-[#0A192F] text-white p-5 rounded-xl text-center">
                      <h2 className="text-lg font-black">{config.senderName || "AVRO Store"}</h2>
                      <p className="text-xs text-slate-300 mt-1">Order Confirmation</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center text-emerald-900">
                      <strong>Thank You for Your Order!</strong>
                      <p className="text-[11px] text-emerald-700 mt-0.5">Order #ORD-1001 has been confirmed.</p>
                    </div>
                    <div className="border-t border-b border-slate-100 py-3 space-y-2">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Signature Mechanical Keyboard</span>
                        <span>₹3,499.00</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Standard Express Shipping</span>
                        <span className="text-emerald-600 font-bold">FREE</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900">
                      <span>Grand Total:</span>
                      <span className="text-blue-600">₹3,499.00</span>
                    </div>
                  </>
                )}

                {previewModal === "SHIPPED" && (
                  <>
                    <div className="bg-[#0A192F] text-white p-5 rounded-xl text-center">
                      <h2 className="text-lg font-black">{config.senderName || "AVRO Store"}</h2>
                      <p className="text-xs text-slate-300 mt-1">Your Order Has Shipped! 🚀</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Courier: Shiprocket / Delhivery</span>
                      <div className="font-mono text-base font-bold text-slate-900">AWB-DEL-984729104</div>
                      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs inline-block">
                        Track Your Shipment
                      </button>
                    </div>
                  </>
                )}

                {previewModal === "ALERT" && (
                  <div className="bg-[#070F1E] text-slate-200 p-5 rounded-xl space-y-3">
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">New Sale</span>
                    <h3 className="text-base font-bold text-white">Order #ORD-1001 Received</h3>
                    <div className="text-xs space-y-1 text-slate-300">
                      <div><strong>Customer:</strong> Rajesh Kumar (rajesh@example.com)</div>
                      <div><strong>Total Amount:</strong> ₹3,499.00 · Prepaid Online</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
