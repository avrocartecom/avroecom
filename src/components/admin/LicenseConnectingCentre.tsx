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
} from "lucide-react";

export default function LicenseConnectingCentre() {
  const [license, setLicense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncError, setSyncError] = useState("");

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
                placeholder="e.g. AVRO-PLUS-XXXX-XXXX-XXXX or AVRO-GROW-XXXX-XXXX-XXXX"
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
                placeholder="e.g. store.clientbrand.com or localhost:3001"
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

      {/* SECTION 4: UNLOCKED STORE FEATURE ENTITLEMENTS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#0A192F]">
            Cryptographically Unlocked Store Entitlements
          </h3>
          <p className="text-xs text-slate-500">
            Features currently enabled on this independent self-hosted store based on the active license token signature.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Online Payment Gateways</span>
              <span className="text-[11px] text-slate-400 block">Razorpay, PhonePe, Stripe, Cash on Delivery</span>
            </div>
            {ents.paymentGateways ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Unlocked
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Locked (Grow/Plus)
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Automated Courier Logistics</span>
              <span className="text-[11px] text-slate-400 block">Shiprocket, Delhivery, DTDC, Speed Post APIs</span>
            </div>
            {ents.courierIntegrations ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Unlocked
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Locked (Grow/Plus)
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">13 Storefront Industry Themes</span>
              <span className="text-[11px] text-slate-400 block">Live customizer, custom presets & CSS injection</span>
            </div>
            {ents.customThemes ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Unlocked
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-500 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Basic Theme Only
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-800 block">Admin Staff User Seats</span>
              <span className="text-[11px] text-slate-400 block">Team members with 2FA authorization</span>
            </div>
            <strong className="text-sm font-extrabold text-[#0A192F]">
              {ents.maxAdminUsers || 1} User Seats Allowed
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
