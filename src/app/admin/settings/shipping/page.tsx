"use client";

import { useEffect, useState } from "react";
import { Truck, CheckCircle2, AlertCircle, Save, Lock } from "lucide-react";

export default function ShippingSettingsPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [canUseCourierAPIs, setCanUseCourierAPIs] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("FLAT_RATE");

  const loadProviders = () => {
    setLoading(true);
    fetch("/api/admin/settings/shipping")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProviders(data.providers);
          setCanUseCourierAPIs(data.canUseCourierAPIs);
          setCurrentPlan(data.plan);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const handleUpdate = async (provider: string, updates: any) => {
    setErrorMsg("");
    setSaveMsg("");

    const target = providers.find((p) => p.provider === provider);
    const payload = { ...target, ...updates, provider };

    const res = await fetch("/api/admin/settings/shipping", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      setErrorMsg(data.error || "Failed to update shipping provider.");
    } else {
      setSaveMsg(data.message);
      setTimeout(() => setSaveMsg(""), 3000);
      loadProviders();
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 py-12">Loading shipping configuration...</div>;
  }

  const currentProvider = providers.find((p) => p.provider === activeTab) || providers[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Courier & Shipping Integrations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure local shipping rates or connect automated courier accounts (Shiprocket, Delhivery, DTDC).
        </p>
      </div>

      {saveMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {saveMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMsg}
        </div>
      )}

      {!canUseCourierAPIs && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Automated courier APIs (Shiprocket, Delhivery, DTDC) require an <strong>AVRO Grow</strong> or <strong>Plus</strong> license. Flat rate delivery is active.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
          {providers.map((p) => {
            const isSelected = activeTab === p.provider;
            const isLocked = ["SHIPROCKET", "DELHIVERY", "DTDC"].includes(p.provider) && !canUseCourierAPIs;

            return (
              <button
                key={p.provider}
                type="button"
                onClick={() => setActiveTab(p.provider)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                  isSelected ? "bg-[#0A192F] text-white shadow-sm" : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">{p.title}</span>
                  <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                    {p.provider}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      p.isEnabled
                        ? isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                        : isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.isEnabled ? "ACTIVE" : "OFF"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">{currentProvider.title}</h3>
              <p className="text-xs text-slate-400">Carrier identifier: <code>{currentProvider.provider}</code></p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentProvider.isEnabled}
                onChange={(e) =>
                  handleUpdate(currentProvider.provider, { isEnabled: e.target.checked })
                }
                className="w-4 h-4 text-[#2563EB] rounded"
              />
              <span className="text-xs font-bold text-slate-800">Enable Carrier</span>
            </label>
          </div>

          {currentProvider.provider === "FLAT_RATE" && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Shipping Fee (₹)</label>
                  <input
                    type="number"
                    value={currentProvider.config?.rate || 99}
                    onChange={(e) =>
                      setProviders((prev) =>
                        prev.map((pr) =>
                          pr.provider === "FLAT_RATE"
                            ? { ...pr, config: { ...pr.config, rate: parseFloat(e.target.value) } }
                            : pr
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Free Delivery Threshold (₹)</label>
                  <input
                    type="number"
                    value={currentProvider.config?.freeShippingThreshold || 999}
                    onChange={(e) =>
                      setProviders((prev) =>
                        prev.map((pr) =>
                          pr.provider === "FLAT_RATE"
                            ? { ...pr, config: { ...pr.config, freeShippingThreshold: parseFloat(e.target.value) } }
                            : pr
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentProvider.provider === "SHIPROCKET" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shiprocket API Email</label>
                <input
                  type="email"
                  value={currentProvider.config?.apiEmail || ""}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((pr) =>
                        pr.provider === "SHIPROCKET"
                          ? { ...pr, config: { ...pr.config, apiEmail: e.target.value } }
                          : pr
                      )
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shiprocket API Password</label>
                <input
                  type="password"
                  value={currentProvider.config?.apiPassword || ""}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((pr) =>
                        pr.provider === "SHIPROCKET"
                          ? { ...pr, config: { ...pr.config, apiPassword: e.target.value } }
                          : pr
                      )
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Warehouse Pickup Pincode</label>
                <input
                  type="text"
                  value={currentProvider.config?.pickupPincode || "110001"}
                  onChange={(e) =>
                    setProviders((prev) =>
                      prev.map((pr) =>
                        pr.provider === "SHIPROCKET"
                          ? { ...pr, config: { ...pr.config, pickupPincode: e.target.value } }
                          : pr
                      )
                    )
                  }
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <button
              type="button"
              onClick={() => handleUpdate(currentProvider.provider, { config: currentProvider.config })}
              className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save {currentProvider.title} Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
