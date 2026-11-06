"use client";

import { useEffect, useState } from "react";
import {
  Key,
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Server,
  Check,
  X,
  Edit3,
  ExternalLink,
  ShieldAlert,
  Zap,
  Activity,
  Copy,
  Link2,
  CheckCheck,
} from "lucide-react";

export default function LicenseSettingsPage() {
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncError, setSyncError] = useState("");

  // Edit / Replace License Key States
  const [newKey, setNewKey] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [centralUrl, setCentralUrl] = useState("http://localhost:3000/api/v1");
  const [updatingKey, setUpdatingKey] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Ping Central Server
  const [testingConnection, setTestingConnection] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const loadLicense = () => {
    setLoading(true);
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.license) {
          setLicense(data.license);
          setCustomDomain(data.license.domain || "localhost:3001");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLicense();
  }, []);

  const handleSyncWithCentral = async () => {
    setSyncing(true);
    setSyncMsg("");
    setSyncError("");
    try {
      const res = await fetch("/api/admin/license/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(data.message);
        if (data.license) setLicense(data.license);
      } else {
        setSyncError(data.message || data.error || "Failed to synchronize with Central.");
      }
    } catch (err: any) {
      setSyncError("Network error contacting TECHNEXT Central.");
    } finally {
      setSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setPingResult(null);
    try {
      const res = await fetch("/api/admin/license/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centralUrl }),
      });
      const data = await res.json();
      setPingResult(data);
    } catch (err: any) {
      setPingResult({
        success: false,
        message: `Connection test failed: ${err.message}`,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleUpdateLicenseKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);
    setUpdatingKey(true);

    try {
      const res = await fetch("/api/admin/license/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: newKey.trim(),
          domain: customDomain.trim(),
          centralApiUrl: centralUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setUpdateError(data.error || data.message || "Failed to update license key.");
      } else {
        setUpdateSuccess(data.message || "License successfully updated and verified!");
        if (data.license) setLicense(data.license);
        setNewKey("");
        setTimeout(() => {
          loadLicense();
        }, 1500);
      }
    } catch (err: any) {
      setUpdateError(`Connection error: ${err.message}`);
    } finally {
      setUpdatingKey(false);
    }
  };

  const copyConnectEndpoint = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    const endpoint = `${origin}/api/admin/license/connect`;
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2500);
  };

  if (loading) {
    return <div className="text-xs text-slate-500 py-12">Loading license security cache...</div>;
  }

  const isExpired = license && !license.valid;
  const ents = license?.entitlements || {};
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-1 bg-blue-50 text-[#2563EB]">
            <Key className="w-3 h-3" />
            Cryptographic License Subsystem
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F]">License & Central Connection</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your AVRO commercial license key, cryptographic verification, and API bridge with TECHNEXT Central.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncWithCentral}
            disabled={syncing}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Checking Heartbeat..." : "Sync / Check License"}
          </button>
        </div>
      </div>

      {/* Sync Alerts */}
      {syncMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          {syncMsg}
        </div>
      )}

      {syncError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          {syncError}
        </div>
      )}

      {/* Central API Bridge Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">TECHNEXT Central API Bridge</h2>
              <p className="text-xs text-slate-500">Live communication bridge for remote license deployment and validation.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Activity className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin text-blue-600" : ""}`} />
              {testingConnection ? "Testing Ping..." : "Test Connection to Central"}
            </button>
          </div>
        </div>

        {pingResult && (
          <div
            className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              pingResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {pingResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{pingResult.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Store Inbound API Connect Endpoint
            </span>
            <div className="flex items-center justify-between gap-2">
              <code className="text-[11px] font-mono text-slate-800 break-all select-all font-semibold">
                {currentOrigin}/api/admin/license/connect
              </code>
              <button
                type="button"
                onClick={copyConnectEndpoint}
                className="p-1.5 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition shrink-0"
                title="Copy API Endpoint"
              >
                {copiedEndpoint ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Central Admin can push and connect license keys directly to this endpoint.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Central Authority URL
            </span>
            <div className="flex items-center gap-2">
              <code className="text-[11px] font-mono text-slate-800 truncate font-semibold">
                {centralUrl}
              </code>
            </div>
            <p className="text-[11px] text-slate-500">
              Validates heartbeat tokens, offline grace periods, and feature updates.
            </p>
          </div>
        </div>
      </div>

      {/* Current License Status Card */}
      <div
        className={`p-6 rounded-2xl text-white space-y-6 shadow-md transition-colors ${
          isExpired
            ? "bg-gradient-to-br from-rose-950 to-slate-950 border border-rose-800"
            : "bg-[#0A192F]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Key className="w-4 h-4 text-amber-400" />
            Active License Status
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
              isExpired
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {license?.status || (isExpired ? "EXPIRED" : "ACTIVE")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="p-3 bg-black/30 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">Plan Tier</span>
            <strong className="text-lg text-white font-extrabold">AVRO {license?.plan}</strong>
          </div>
          <div className="p-3 bg-black/30 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">Authorized Domain</span>
            <strong className="text-sm font-mono text-emerald-400 truncate block">
              {license?.domain}
            </strong>
          </div>
          <div className="p-3 bg-black/30 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">Expiration Date</span>
            <strong
              className={`text-sm block ${
                isExpired ? "text-rose-400 font-extrabold" : "text-white"
              }`}
            >
              {new Date(license?.expiresAt).toLocaleDateString()}
            </strong>
          </div>
          <div className="p-3 bg-black/30 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-1">Offline Resilience</span>
            <strong className="text-sm text-emerald-400 font-medium block">
              72h Grace Buffer
            </strong>
          </div>
        </div>
      </div>

      {/* EDIT / REPLACE LICENSE KEY FORM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#0A192F] flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#2563EB]" />
              Connect or Update License Key
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your license key issued by TECHNEXT Central. The system will activate the key with the Central Licensing Authority and immediately unlock store operations.
            </p>
          </div>
        </div>

        {updateSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{updateSuccess}</span>
          </div>
        )}

        {updateError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{updateError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateLicenseKey} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              License Key <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AVRO-GROW-XXXX-XXXX-XXXX or AVRO-PLUS-XXXX-XXXX-XXXX"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 uppercase"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Paste the license key issued by TECHNEXT Central upon subscription checkout or renewal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Store Domain
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g. mystore.com or localhost:3001"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Central Licensing Authority Endpoint
              </label>
              <input
                type="text"
                value={centralUrl}
                onChange={(e) => setCentralUrl(e.target.value)}
                placeholder="http://localhost:3000/api/v1"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={updatingKey || !newKey.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              {updatingKey ? "Connecting & Activating..." : "Verify & Activate New License"}
            </button>
          </div>
        </form>
      </div>

      {/* Feature Entitlements Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-[#0A192F]">Unlocked Feature Entitlements</h3>
        <p className="text-xs text-slate-500">
          Features cryptographically authorized on this independent self-hosted store.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span>Online Payment Gateways (Razorpay, PhonePe, Stripe)</span>
            {ents.paymentGateways ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Enabled
              </span>
            ) : (
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <X className="w-4 h-4" /> Locked (Grow/Plus)
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span>Courier Logistics APIs (Shiprocket, Delhivery, DTDC)</span>
            {ents.courierIntegrations ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Enabled
              </span>
            ) : (
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <X className="w-4 h-4" /> Locked (Grow/Plus)
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span>Storefront Theme Customizer & 13 Industry Themes</span>
            {ents.customThemes ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Enabled
              </span>
            ) : (
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <X className="w-4 h-4" /> Basic Only
              </span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <span>Admin User Seats Allowed</span>
            <strong className="text-slate-900 font-bold">{ents.maxAdminUsers || 1} User Seats</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
