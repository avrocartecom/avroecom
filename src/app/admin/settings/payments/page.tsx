"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Save,
  AlertCircle,
  HelpCircle,
  Key,
} from "lucide-react";

export default function PaymentSettingsPage() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [canUseOnlineGateways, setCanUseOnlineGateways] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("COD");

  const loadGateways = () => {
    setLoading(true);
    fetch("/api/admin/settings/payments")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGateways(data.gateways);
          setCanUseOnlineGateways(data.canUseOnlineGateways);
          setCurrentPlan(data.plan);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGateways();
  }, []);

  const handleUpdateGateway = async (provider: string, updates: any) => {
    setErrorMsg("");
    setSaveMsg("");

    const target = gateways.find((g) => g.provider === provider);
    const payload = {
      ...target,
      ...updates,
      provider,
    };

    const res = await fetch("/api/admin/settings/payments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      setErrorMsg(data.error || "Failed to update payment method.");
    } else {
      setSaveMsg(data.message);
      setTimeout(() => setSaveMsg(""), 3000);
      loadGateways();
    }
  };

  if (loading) {
    return <div className="text-xs text-slate-500 py-12">Loading payment settings...</div>;
  }

  const currentGateway = gateways.find((g) => g.provider === activeTab) || gateways[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Payment Gateway Integrations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure modular merchant accounts. All secrets and API keys are stored strictly inside your local server database and are never sent to TECHNEXT Central.
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

      {!canUseOnlineGateways && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Online gateways (Razorpay, PhonePe, Stripe) are locked under <strong>AVRO {currentPlan}</strong>. Cash on Delivery and Direct Bank Transfer are active. Upgrade to <strong>AVRO Grow</strong> to enable automated online gateways.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Providers Tab List */}
        <div className="md:col-span-4 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
          {gateways.map((g) => {
            const isSelected = activeTab === g.provider;
            const isLocked = ["RAZORPAY", "PHONEPE", "STRIPE"].includes(g.provider) && !canUseOnlineGateways;

            return (
              <button
                key={g.provider}
                type="button"
                onClick={() => setActiveTab(g.provider)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-[#0A192F] text-white shadow-sm"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">{g.title}</span>
                  <span className={`text-[10px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                    {g.provider}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isLocked && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      g.isEnabled
                        ? isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"
                        : isSelected ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {g.isEnabled ? "ENABLED" : "OFF"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Provider Form */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">{currentGateway.title}</h3>
              <p className="text-xs text-slate-400">Provider identifier: <code>{currentGateway.provider}</code></p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentGateway.isEnabled}
                onChange={(e) =>
                  handleUpdateGateway(currentGateway.provider, { isEnabled: e.target.checked })
                }
                className="w-4 h-4 text-[#2563EB] rounded"
              />
              <span className="text-xs font-bold text-slate-800">Enable Method</span>
            </label>
          </div>

          {/* RAZORPAY CONFIG */}
          {currentGateway.provider === "RAZORPAY" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                <span>Environment Mode</span>
                <button
                  type="button"
                  onClick={() =>
                    handleUpdateGateway("RAZORPAY", { isTestMode: !currentGateway.isTestMode })
                  }
                  className={`px-3 py-1 rounded font-bold text-[10px] ${
                    currentGateway.isTestMode
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {currentGateway.isTestMode ? "TEST MODE" : "LIVE PRODUCTION"}
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Razorpay Key ID</label>
                <input
                  type="text"
                  value={currentGateway.config?.keyId || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "RAZORPAY"
                          ? { ...g, config: { ...g.config, keyId: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="rzp_test_..."
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Razorpay Key Secret</label>
                <input
                  type="password"
                  value={currentGateway.config?.keySecret || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "RAZORPAY"
                          ? { ...g, config: { ...g.config, keySecret: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Webhook Secret</label>
                <input
                  type="password"
                  value={currentGateway.config?.webhookSecret || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "RAZORPAY"
                          ? { ...g, config: { ...g.config, webhookSecret: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="whsec_..."
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 border rounded-lg text-slate-500 text-[11px] space-y-1">
                <span className="font-bold text-slate-700 block">Your Server Webhook Endpoint</span>
                <code>http://your-domain.com/api/webhooks/payment/razorpay</code>
              </div>
            </div>
          )}

          {/* PHONEPE CONFIG */}
          {currentGateway.provider === "PHONEPE" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">PhonePe Merchant ID</label>
                <input
                  type="text"
                  value={currentGateway.config?.merchantId || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "PHONEPE"
                          ? { ...g, config: { ...g.config, merchantId: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="MERCHANTUAT"
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salt Key</label>
                <input
                  type="password"
                  value={currentGateway.config?.saltKey || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "PHONEPE"
                          ? { ...g, config: { ...g.config, saltKey: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Salt Index</label>
                <input
                  type="text"
                  value={currentGateway.config?.saltIndex || "1"}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "PHONEPE"
                          ? { ...g, config: { ...g.config, saltIndex: e.target.value } }
                          : g
                      )
                    )
                  }
                  className="w-20 px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STRIPE CONFIG */}
          {currentGateway.provider === "STRIPE" && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Stripe Publishable Key</label>
                <input
                  type="text"
                  value={currentGateway.config?.publishableKey || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "STRIPE"
                          ? { ...g, config: { ...g.config, publishableKey: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="pk_test_..."
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Stripe Secret Key</label>
                <input
                  type="password"
                  value={currentGateway.config?.secretKey || ""}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "STRIPE"
                          ? { ...g, config: { ...g.config, secretKey: e.target.value } }
                          : g
                      )
                    )
                  }
                  placeholder="sk_test_..."
                  className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* COD CONFIG */}
          {currentGateway.provider === "COD" && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Allow customers to pay physically with cash or mobile UPI upon delivery.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">COD Convenience Fee (₹)</label>
                <input
                  type="number"
                  value={currentGateway.config?.extraCharge || 0}
                  onChange={(e) =>
                    setGateways((prev) =>
                      prev.map((g) =>
                        g.provider === "COD"
                          ? { ...g, config: { ...g.config, extraCharge: parseFloat(e.target.value || "0") } }
                          : g
                      )
                    )
                  }
                  className="w-32 px-3 py-2 border rounded-lg focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* BANK TRANSFER CONFIG */}
          {currentGateway.provider === "BANK_TRANSFER" && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Display your bank account details for direct NEFT / RTGS / IMPS wire transfers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={currentGateway.config?.bankName || ""}
                    onChange={(e) =>
                      setGateways((prev) =>
                        prev.map((g) =>
                          g.provider === "BANK_TRANSFER"
                            ? { ...g, config: { ...g.config, bankName: e.target.value } }
                            : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Beneficiary Account Name</label>
                  <input
                    type="text"
                    value={currentGateway.config?.accountName || ""}
                    onChange={(e) =>
                      setGateways((prev) =>
                        prev.map((g) =>
                          g.provider === "BANK_TRANSFER"
                            ? { ...g, config: { ...g.config, accountName: e.target.value } }
                            : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={currentGateway.config?.accountNumber || ""}
                    onChange={(e) =>
                      setGateways((prev) =>
                        prev.map((g) =>
                          g.provider === "BANK_TRANSFER"
                            ? { ...g, config: { ...g.config, accountNumber: e.target.value } }
                            : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IFSC / Routing Code</label>
                  <input
                    type="text"
                    value={currentGateway.config?.ifscCode || ""}
                    onChange={(e) =>
                      setGateways((prev) =>
                        prev.map((g) =>
                          g.provider === "BANK_TRANSFER"
                            ? { ...g, config: { ...g.config, ifscCode: e.target.value } }
                            : g
                        )
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <button
              type="button"
              onClick={() =>
                handleUpdateGateway(currentGateway.provider, { config: currentGateway.config })
              }
              className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save {currentGateway.title} Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
