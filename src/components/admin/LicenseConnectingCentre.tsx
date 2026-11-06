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
  Terminal,
  Radio,
  Lock,
  Unlock,
  Trash2,
  RefreshCw,
  Cpu,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Plus,
} from "lucide-react";
import { UpgradePlanModal } from "./UpgradePlanModal";
import {
  PlanTier,
  PLAN_PRICING,
  PLAN_NAMES,
  FEATURE_REGISTRY,
  FeatureKey,
} from "@/lib/license-core";

export default function LicenseConnectingCentre() {
  const [license, setLicense] = useState<any>(null);
  const [permissions, setPermissions] = useState<any>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<PlanTier>("GROW");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncError, setSyncError] = useState("");

  // Separately Chargeable Custom Addons State
  const [newAddonInput, setNewAddonInput] = useState("");
  const [grantingAddon, setGrantingAddon] = useState(false);
  const [addonFeedback, setAddonFeedback] = useState<string | null>(null);

  // Writing / Input State
  const [keyInput, setKeyInput] = useState("");
  const [storeDomain, setStoreDomain] = useState("");
  const [centralUrl, setCentralUrl] = useState("http://localhost:3000/api/v1");
  const [isWriting, setIsWriting] = useState(false);
  const [writeSuccess, setWriteSuccess] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  // Ping & Connection Testing State
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  // Local Inbound Webhook Test
  const [isTestingInbound, setIsTestingInbound] = useState(false);
  const [inboundResult, setInboundResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Disconnect State
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const loadLicenseData = () => {
    setLoading(true);

    fetch("/api/admin/permissions")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.plan) setPermissions(data);
      })
      .catch(() => {});

    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.license) {
          setLicense(data.license);
          setStoreDomain(data.license.domain || "localhost:3001");
        }
      })
      .catch(() => {
        // Fallback
      })
      .finally(() => setLoading(false));
  };

  const handleGrantCustomAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonInput.trim()) return;

    setGrantingAddon(true);
    setAddonFeedback(null);
    try {
      const res = await fetch("/api/admin/license/custom-addon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addonKey: newAddonInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAddonFeedback(`Custom Add-on "${newAddonInput.trim()}" granted successfully!`);
        setNewAddonInput("");
        loadLicenseData();
      } else {
        setAddonFeedback(`Failed: ${data.error || "Could not grant add-on"}`);
      }
    } catch (err: any) {
      setAddonFeedback(`Error: ${err.message}`);
    } finally {
      setGrantingAddon(false);
    }
  };

  useEffect(() => {
    loadLicenseData();
    if (typeof window !== "undefined") {
      setStoreDomain(window.location.host);
    }
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
      setSyncError("Network error contacting TECHNEXT Central Licensing Authority.");
    } finally {
      setSyncing(false);
    }
  };

  const handleTestPing = async () => {
    setIsTestingPing(true);
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
      setIsTestingPing(false);
    }
  };

  const handleTestInbound = async () => {
    setIsTestingInbound(true);
    setInboundResult(null);
    try {
      const res = await fetch("/api/admin/license/connect", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success) {
        setInboundResult({
          success: true,
          message: `Inbound Endpoint Ready (Host: ${data.storeDomain}, Status: ${data.license?.status || "OK"})`,
        });
      } else {
        setInboundResult({
          success: false,
          message: data.error || "Store inbound endpoint rejected probe.",
        });
      }
    } catch (err: any) {
      setInboundResult({
        success: false,
        message: `Inbound probe error: ${err.message}`,
      });
    } finally {
      setIsTestingInbound(false);
    }
  };

  const handleWriteLicenseKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;

    setIsWriting(true);
    setWriteError(null);
    setWriteSuccess(null);

    try {
      const res = await fetch("/api/admin/license/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: keyInput.trim(),
          domain: storeDomain.trim(),
          centralApiUrl: centralUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setWriteError(data.error || data.message || "Failed to activate license key.");
      } else {
        setWriteSuccess(data.message || "License successfully written, cryptographically signed, and activated!");
        if (data.license) setLicense(data.license);
        setKeyInput("");
        setTimeout(() => {
          loadLicenseData();
        }, 1500);
      }
    } catch (err: any) {
      setWriteError(`Connection error: ${err.message}`);
    } finally {
      setIsWriting(false);
    }
  };

  const handleDisconnectLicense = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect this license key? The store will fall back to standalone trial mode until a new key is written."
      )
    ) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/admin/license/disconnect", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncMsg("License disconnected successfully.");
        loadLicenseData();
      } else {
        alert(data.error || "Failed to disconnect license.");
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const copyConnectEndpoint = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    const endpoint = `${origin}/api/admin/license/connect`;
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2500);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setKeyInput(text.trim().toUpperCase());
    } catch (e) {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
        <RotateCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Initializing License & Central Connection Centre...
        </span>
      </div>
    );
  }

  const isExpired = license && !license.valid;
  const ents = license?.entitlements || {};
  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Hero Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-blue-50 text-[#2563EB] border border-blue-200/60 shadow-2xs">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            AVRO Licensing & Connection Centre
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">
            License Key Writing & Central Connecting Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Authorize your independent store admin panel, configure live Central Authority bridge, write commercial keys, or receive remote deployments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncWithCentral}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-blue-600" : ""}`} />
            {syncing ? "Syncing with Central..." : "Sync / Check Heartbeat"}
          </button>
        </div>
      </div>

      {/* Sync / Action Alerts */}
      {syncMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncMsg}</span>
        </div>
      )}

      {syncError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{syncError}</span>
        </div>
      )}

      {/* SECTION 1: ACTIVE LICENSE SECURITY BADGE & METRICS */}
      <div
        className={`p-6 sm:p-8 rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden transition-all ${
          isExpired
            ? "bg-gradient-to-br from-rose-950 via-slate-950 to-black border border-rose-800"
            : "bg-[#0A192F] border border-slate-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
              <Key className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Cryptographic Authentication State
              </span>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                AVRO {license?.plan || "ENTERPRISE"} TIER
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-black border ${
                    isExpired
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {license?.status || (isExpired ? "EXPIRED" : "ACTIVE")}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-black/40 border border-white/10 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              HMAC-SHA256 Token Verified
            </span>
          </div>
        </div>

        {/* 4 Primary Subsystem Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-4 bg-black/30 backdrop-blur-xs rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Authorized Domain</span>
            <strong className="text-sm font-mono text-emerald-400 truncate block">
              {license?.domain || "localhost:3001"}
            </strong>
          </div>

          <div className="p-4 bg-black/30 backdrop-blur-xs rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Validity Expiration</span>
            <strong
              className={`text-sm block ${
                isExpired ? "text-rose-400 font-extrabold" : "text-white"
              }`}
            >
              {license?.expiresAt
                ? new Date(license.expiresAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Continuous"}
            </strong>
          </div>

          <div className="p-4 bg-black/30 backdrop-blur-xs rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Offline Grace Buffer</span>
            <strong className="text-sm text-emerald-400 font-semibold block flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              72 Hours Operating Reserve
            </strong>
          </div>

          <div className="p-4 bg-black/30 backdrop-blur-xs rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 block text-[11px]">Store Operations</span>
            <strong className="text-sm text-white font-bold block">
              {isExpired ? "Locked (Renewal Required)" : "100% Unlocked & Active"}
            </strong>
          </div>
        </div>
      </div>

      {/* SECTION 2: LICENSE KEY WRITING STATION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0A192F]">
                License Key Writing Station
              </h3>
              <p className="text-xs text-slate-500">
                Write or paste an AVRO commercial license key issued by TECHNEXT Central to immediately register this node.
              </p>
            </div>
          </div>
        </div>

        {writeSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{writeSuccess}</span>
          </div>
        )}

        {writeError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{writeError}</span>
          </div>
        )}

        <form onSubmit={handleWriteLicenseKey} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">
                Write License Key <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={pasteFromClipboard}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Paste from Clipboard
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter AVRO license key"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-slate-50/50 focus:bg-white transition"
              />
              {keyInput && (
                <button
                  type="button"
                  onClick={() => setKeyInput("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Format: <code>AVRO-&lt;TIER&gt;-&lt;HASH&gt;-&lt;CHECKSUM&gt;</code>. Issued in your order confirmation email or via Central Control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">Target Store Host Domain</label>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") setStoreDomain(window.location.host);
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-bold"
                >
                  Auto-Detect
                </button>
              </div>
              <input
                type="text"
                value={storeDomain}
                onChange={(e) => setStoreDomain(e.target.value)}
                placeholder="Authorized store domain"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800">
                  Central Licensing Authority Endpoint
                </label>
                <div className="flex gap-1.5 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCentralUrl("http://localhost:3000/api/v1")}
                    className="text-slate-600 hover:text-blue-600 hover:underline"
                  >
                    Local 3000
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setCentralUrl("https://licensing.technext.co/api/v1")}
                    className="text-slate-600 hover:text-blue-600 hover:underline"
                  >
                    Cloud
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={centralUrl}
                onChange={(e) => setCentralUrl(e.target.value)}
                placeholder="http://localhost:3000/api/v1"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDisconnectLicense}
              disabled={isDisconnecting}
              className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1.5 hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDisconnecting ? "Disconnecting..." : "Disconnect / Clear License Cache"}
            </button>

            <button
              type="submit"
              disabled={isWriting || !keyInput.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0A192F] hover:bg-[#1E293B] disabled:opacity-50 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              {isWriting ? "Connecting & Verifying..." : "Write & Activate License Key"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: CENTRAL CONNECTING CENTRE & INBOUND BRIDGE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0A192F]">
                Central Connecting Centre & Inbound API Bridge
              </h3>
              <p className="text-xs text-slate-500">
                Bi-directional live bridge allowing TECHNEXT Central to automatically push and bind licenses remotely.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestInbound}
              disabled={isTestingInbound}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              {isTestingInbound ? "Probing..." : "Test Inbound Webhook"}
            </button>
            <button
              onClick={handleTestPing}
              disabled={isTestingPing}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition flex items-center gap-1.5"
            >
              <Activity className={`w-3.5 h-3.5 ${isTestingPing ? "animate-spin" : ""}`} />
              {isTestingPing ? "Testing..." : "Ping Central Server"}
            </button>
          </div>
        </div>

        {/* Ping / Inbound Feedback Banners */}
        {pingResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
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

        {inboundResult && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
              inboundResult.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {inboundResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{inboundResult.message}</span>
          </div>
        )}

        {/* Inbound & Outbound Endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Store Inbound API Webhook URL
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                Ready for Push
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-slate-200">
              <code className="text-xs font-mono font-bold text-slate-900 break-all select-all">
                {currentOrigin}/api/admin/license/connect
              </code>
              <button
                type="button"
                onClick={copyConnectEndpoint}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
                title="Copy Webhook Endpoint"
              >
                {copiedEndpoint ? (
                  <CheckCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Central Admin uses this endpoint in <strong>Central Control &gt; Connect Store</strong> to remotely bind and deliver active keys.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Target Licensing Authority
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-800 uppercase">
                Heartbeat Bridge
              </span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200">
              <code className="text-xs font-mono font-bold text-slate-900 truncate block">
                {centralUrl}
              </code>
            </div>
            <p className="text-[11px] text-slate-500">
              Periodically validates HMAC tokens, refreshes entitlement upgrades, and queries system broadcast notifications.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: SUBSCRIPTION PACKAGES & UPGRADE MANAGEMENT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-[#0A192F]">
                Subscription Plans & Feature Access Control
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              AVRO CART subscription tier determines which ecommerce capabilities, logistics APIs, and theme customizations are unlocked on this store.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
              Active: {permissions?.planName || license?.plan || "BASIC"} (₹{permissions?.priceINR || 349}/mo)
            </span>
          </div>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* BASIC */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              (permissions?.plan || license?.plan) === "BASIC"
                ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-slate-50/40"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900">BASIC PLAN</h4>
                {(permissions?.plan || license?.plan) === "BASIC" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                    CURRENT
                  </span>
                )}
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">₹349</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Complete core ecommerce, payments, inventory, manual shipping, and 2 preset themes.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Online Gateways (Razorpay/UPI/COD)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Manual Shipping Management</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>2 Preset Themes (Signature & Noir)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Courier APIs & Theme Customizer Locked</span>
                </div>
              </div>
            </div>

            {(permissions?.plan || license?.plan) === "BASIC" ? (
              <div className="py-2 text-center text-xs font-bold text-blue-700 bg-blue-100/60 rounded-xl">
                Active Plan
              </div>
            ) : null}
          </div>

          {/* GROW */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              (permissions?.plan || license?.plan) === "GROW"
                ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white shadow-xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-slate-900">GROW PLAN</h4>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 uppercase">
                    POPULAR
                  </span>
                </div>
                {(permissions?.plan || license?.plan) === "GROW" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                    CURRENT
                  </span>
                )}
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">₹499</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Automated courier APIs (Shiprocket/Delhivery), theme customizer, reviews & custom pages.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Full Theme Customizer & 13 Presets</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Courier APIs (Shiprocket/Delhivery/DTDC)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Product Reviews & Moderation</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Custom CMS Pages & Google Sheets/Zoho</span>
                </div>
              </div>
            </div>

            {(permissions?.plan || license?.plan) === "GROW" ? (
              <div className="py-2 text-center text-xs font-bold text-blue-700 bg-blue-100/60 rounded-xl">
                Active Plan
              </div>
            ) : (permissions?.plan || license?.plan) === "BASIC" ? (
              <button
                type="button"
                onClick={() => {
                  setUpgradeTarget("GROW");
                  setUpgradeModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Upgrade to Grow
              </button>
            ) : null}
          </div>

          {/* PLUS */}
          <div
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              (permissions?.plan || license?.plan) === "PLUS"
                ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/20"
                : "border-slate-200 bg-white shadow-xs"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-slate-900">PLUS PLAN</h4>
                {(permissions?.plan || license?.plan) === "PLUS" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                    CURRENT
                  </span>
                )}
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">₹799</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
              <p className="text-[11px] text-slate-500">
                B2B wholesale portal, multi-store switcher, downloadable Excel/CSV reports & 24/7 support.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Everything in Grow Included</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>B2B Corporate Wholesale & Net-30</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Downloadable CSV/Excel Sales Reports</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Multi-Store Switcher & 24/7 Call Support</span>
                </div>
              </div>
            </div>

            {(permissions?.plan || license?.plan) === "PLUS" ? (
              <div className="py-2 text-center text-xs font-bold text-blue-700 bg-blue-100/60 rounded-xl">
                Active Plan (All Unlocked)
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setUpgradeTarget("PLUS");
                  setUpgradeModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Upgrade to Plus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 5: SEPARATELY CHARGEABLE CUSTOMIZATIONS & ADD-ONS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                <Cpu className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-black text-[#0A192F]">
                Separately Chargeable Customizations & Services
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Custom features, special integrations, and personalized design modifications configurable independently of regular monthly subscription.
            </p>
          </div>
        </div>

        {addonFeedback && (
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{addonFeedback}</span>
          </div>
        )}

        {/* Currently Active Custom Grants */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Active Separately Purchased Custom Grants
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(license?.entitlements?.customAddons && license.entitlements.customAddons.length > 0) ? (
              license.entitlements.customAddons.map((addon: string) => (
                <div
                  key={addon}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800">{addon}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-xs col-span-full">
                No separately charged custom add-on services currently bound. Use the administration tool below to activate authorized add-ons.
              </div>
            )}
          </div>
        </div>

        {/* Administration Tool to Grant Purchased Custom Add-on */}
        <form onSubmit={handleGrantCustomAddon} className="pt-2 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">
            Authorized Administration: Grant Custom Purchased Add-on Key
          </span>

          <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="text"
              value={newAddonInput}
              onChange={(e) => setNewAddonInput(e.target.value)}
              placeholder="Custom permission handle"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={grantingAddon || !newAddonInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold text-xs transition disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{grantingAddon ? "Granting..." : "Grant Add-on"}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Grants configured via this interface remain active independently without altering the baseline subscription price.
          </p>
        </form>
      </div>

      {/* Plan Upgrade Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || license?.plan || "BASIC"}
        recommendedTarget={upgradeTarget}
        onSuccess={() => {
          loadLicenseData();
        }}
      />
    </div>
  );
}
