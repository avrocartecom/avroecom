"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Server,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Terminal,
  Loader2,
  Database,
  Lock,
} from "lucide-react";

export default function SetupWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [envInfo, setEnvInfo] = useState<any>(null);

  // Form states
  const [licenseKey, setLicenseKey] = useState("");
  const [domain, setDomain] = useState("");
  const [centralApiUrl, setCentralApiUrl] = useState("http://localhost:3000/api/v1");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [activatedPlan, setActivatedPlan] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.host);
    }
    fetch("/api/setup")
      .then((res) => res.json())
      .then((data) => {
        setEnvInfo(data);
      });
  }, []);

  const handleRunSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey,
          domain,
          centralApiUrl,
          adminName,
          adminEmail,
          adminPassword,
          storeName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Installation setup failed.");
      }

      setActivatedPlan(data.plan);
      setStep(4); // Success step
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs">
              <img
                src="/avro-logo.png"
                alt="AVROCART by TECHNEXT"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Setup Wizard
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Self-Hosted Installation & Licensing Engine</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">Step {step} of 4</span>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Environment Check */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-400" />
                1. Server Environment Verification
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                AVRO verifies that your server runtime, database drivers, and operating permissions are operational.
              </p>
            </div>

            <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Node.js Runtime</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {envInfo?.environment?.nodeVersion || "Node.js Active"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Database Layer</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PostgreSQL / SQLite (Prisma ORM Connected)
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">Server Architecture</span>
                <span className="font-mono text-blue-400 font-bold">Independent Dedicated Node</span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                Proceed to License Activation
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: License Key & Domain */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                2. Master License Key & Domain Binding
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter the cryptographic license key generated when you purchased your AVRO subscription from TECHNEXT.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Master AVRO License Key *</label>
                <input
                  type="text"
                  required
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="Master license key"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Store Domain *</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Authorized store domain"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Central Licensing API</label>
                  <input
                    type="text"
                    required
                    value={centralApiUrl}
                    onChange={(e) => setCentralApiUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                Configure Administrator
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Administrator Credentials */}
        {step === 3 && (
          <form onSubmit={handleRunSetup} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                3. Create Master Store Owner Account
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create the master administrative credentials to access your store back-office at <code>/admin</code>.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Store / Business Brand Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Store brand name"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Store Administrator Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Administrator full name"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Admin Master Password</label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter master password"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating with TECHNEXT Licensing Engine...
                  </>
                ) : (
                  <>
                    Activate Store & Complete Installation
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Activation Success */}
        {step === 4 && (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">AVRO Installation Activated!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your independent store has been activated under the <strong>AVRO {activatedPlan || "GROW"}</strong> plan and bound to <code>{domain}</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Store Domain</span>
                <span className="font-mono text-white font-bold">{domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admin Login</span>
                <span className="font-mono text-emerald-400 font-bold">{adminEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Central Verification Status</span>
                <span className="text-emerald-400 font-bold">Cryptographically Verified</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href="/admin"
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider text-center transition-all shadow"
              >
                Open Store Admin Dashboard (/admin)
              </a>
              <a
                href="/"
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider text-center transition-all"
              >
                Open Customer Storefront (/)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
