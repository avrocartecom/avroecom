"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  Webhook,
  Database,
  Globe2,
  ShieldCheck,
  Bot,
  Save,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Lock,
  Eye,
  Settings,
} from "lucide-react";

export default function OtherSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "events" | "metafields" | "languages" | "privacy" | "ai"
  >("events");
  const [notification, setNotification] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Customer Events State
  const [ga4Id, setGa4Id] = useState("G-AVRO9872X1");
  const [metaPixelId, setMetaPixelId] = useState("983210492817364");
  const [tiktokPixelId, setTiktokPixelId] = useState("");
  const [customWebhooks, setCustomWebhooks] = useState([
    {
      id: "wh-1",
      event: "order.created",
      targetUrl: "https://api.merchant-crm.com/v1/avro-hooks",
      status: "ACTIVE",
    },
    {
      id: "wh-2",
      event: "inventory.low_stock",
      targetUrl: "https://warehouse.supplychain.in/alerts",
      status: "ACTIVE",
    },
  ]);
  const [newWebhookEvent, setNewWebhookEvent] = useState("order.fulfilled");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  // Metafields State
  const [metafields, setMetafields] = useState([
    {
      id: "mf-1",
      target: "Product",
      namespace: "custom",
      key: "fabric_composition",
      type: "Single Line Text",
      description: "Apparel blend details e.g. 100% Ring-spun Cotton",
    },
    {
      id: "mf-2",
      target: "Product",
      namespace: "specs",
      key: "warranty_period",
      type: "Integer (Months)",
      description: "Default manufacturer warranty duration",
    },
    {
      id: "mf-3",
      target: "Customer",
      namespace: "profile",
      key: "birthday",
      type: "Date",
      description: "Used for automated birthday promotional coupons",
    },
  ]);

  // Languages State
  const [primaryLanguage, setPrimaryLanguage] = useState("en-IN");
  const [supportedLanguages, setSupportedLanguages] = useState([
    { code: "en-IN", name: "English (India)", default: true },
    { code: "hi", name: "Hindi (हिन्दी)", default: false, active: true },
    { code: "ta", name: "Tamil (தமிழ்)", default: false, active: false },
    { code: "bn", name: "Bengali (বাংলা)", default: false, active: false },
  ]);

  // Policies State
  const [refundPolicy, setRefundPolicy] = useState(
    "Returns accepted within 7 days of delivery for unworn items with original tags intact. Reverse pickup arranged across all India pin codes."
  );
  const [privacyPolicy, setPrivacyPolicy] = useState(
    "We respect your privacy. Customer email, phone numbers, and addresses are encrypted and never sold to 3rd-party aggregators."
  );
  const [termsOfService, setTermsOfService] = useState(
    "By accessing this website and placing an order, you agree to comply with our commercial terms and local laws."
  );

  // Sulu AI Settings
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiTone, setAiTone] = useState("FRIENDLY");
  const [autoGenDescriptions, setAutoGenDescriptions] = useState(true);
  const [aiOrderChatbot, setAiOrderChatbot] = useState(true);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Store preferences & other settings saved successfully!");
    }, 600);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl) return;
    setCustomWebhooks([
      ...customWebhooks,
      {
        id: `wh-${Date.now()}`,
        event: newWebhookEvent,
        targetUrl: newWebhookUrl,
        status: "ACTIVE",
      },
    ]);
    setNewWebhookUrl("");
    showToast("Webhook endpoint registered.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/settings" className="hover:text-blue-600">Settings</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Other Settings</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Extended Store Settings & Policies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customer events, custom metafield definitions, languages, legal policies, and store AI configurations.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "events"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Webhook className="w-4 h-4" />
          <span>Customer Events & Pixels</span>
        </button>

        <button
          onClick={() => setActiveTab("metafields")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "metafields"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Custom Metafields</span>
        </button>

        <button
          onClick={() => setActiveTab("languages")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "languages"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Languages & Locales</span>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "privacy"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ai"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Store AI & Sulu Settings</span>
        </button>
      </div>

      {/* Tab 1: Customer Events & Pixels */}
      {activeTab === "events" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Analytics Pixels & Tracking Tags</h3>
            <p className="text-xs text-slate-500">
              AVRO fires server-side and browser events on PageView, ViewContent, AddToCart, and Purchase.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <input
                  type="text"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meta (Facebook & Instagram) Pixel ID
                </label>
                <input
                  type="text"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="e.g. 983210492817364"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  TikTok Pixel ID (Optional)
                </label>
                <input
                  type="text"
                  value={tiktokPixelId}
                  onChange={(e) => setTiktokPixelId(e.target.value)}
                  placeholder="e.g. C52781HG28..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Webhooks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Webhook Endpoints</h3>
                <p className="text-xs text-slate-500">
                  Transmit event payloads in real-time JSON format to your ERP, CRM, or external microservices.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Event Trigger</th>
                    <th className="py-2.5 px-3">Endpoint URL</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customWebhooks.map((wh) => (
                    <tr key={wh.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{wh.event}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 truncate max-w-xs">{wh.targetUrl}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {wh.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setCustomWebhooks(customWebhooks.filter((w) => w.id !== wh.id));
                            showToast("Webhook removed.");
                          }}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Webhook Form */}
            <form onSubmit={handleAddWebhook} className="flex flex-col sm:flex-row gap-2 pt-2 text-xs">
              <select
                value={newWebhookEvent}
                onChange={(e) => setNewWebhookEvent(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="order.created">order.created</option>
                <option value="order.paid">order.paid</option>
                <option value="order.fulfilled">order.fulfilled</option>
                <option value="customer.created">customer.created</option>
                <option value="inventory.low_stock">inventory.low_stock</option>
              </select>
              <input
                type="url"
                required
                placeholder="https://your-api.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 transition whitespace-nowrap"
              >
                Add Endpoint
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Metafields */}
      {activeTab === "metafields" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Metafield Definitions</h3>
              <p className="text-xs text-slate-500">
                Attach specialized data attributes to products, variants, collections, or customer profiles.
              </p>
            </div>
            <button
              onClick={() => showToast("Opening metafield definition wizard...")}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 font-bold text-xs hover:bg-blue-100 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Definition</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Namespace & Key</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metafields.map((mf) => (
                  <tr key={mf.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{mf.target}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-800">
                      {mf.namespace}.{mf.key}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{mf.type}</td>
                    <td className="py-3 px-3 text-slate-500">{mf.description}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setMetafields(metafields.filter((m) => m.id !== mf.id));
                          showToast("Metafield deleted.");
                        }}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Languages & Locales */}
      {activeTab === "languages" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Store Languages & Translations</h3>
            <p className="text-xs text-slate-500">
              Serve buyers in their native language with automated dictionary fallback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Storefront Language</label>
              <select
                value={primaryLanguage}
                onChange={(e) => setPrimaryLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="en-IN">English (India)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Installed Regional Languages
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {supportedLanguages.map((lang, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Globe2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-900">{lang.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">[{lang.code}]</span>
                    </div>
                  </div>
                  <div>
                    {lang.default ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Default
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        Auto-Translate Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Privacy & Policies */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Legal Policies & Customer Terms</h3>
            <p className="text-xs text-slate-500">
              These policies will be automatically linked in checkout and the store footer.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Refund & Return Policy
              </label>
              <textarea
                rows={3}
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Privacy Policy & DPDP Act Compliance
              </label>
              <textarea
                rows={3}
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Terms of Service
              </label>
              <textarea
                rows={3}
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Sulu AI Settings */}
      {activeTab === "ai" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AVRO Sulu AI Commerce Engine</h3>
              <p className="text-xs text-slate-500">
                Automated catalog generation, copy optimization, and intelligent order routing.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Enable Sulu AI Merchant Assistant</span>
                <span className="text-[11px] text-slate-500">
                  Provides smart analytics summaries and one-click copy recommendations.
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Auto-Generate Product SEO Copy</span>
                <span className="text-[11px] text-slate-500">
                  Generates optimized meta titles and descriptions when new products are saved.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoGenDescriptions}
                onChange={(e) => setAutoGenDescriptions(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Storefront AI WhatsApp & Chatbot</span>
                <span className="text-[11px] text-slate-500">
                  Allow customers to ask order status questions directly to Sulu AI via chat.
                </span>
              </div>
              <input
                type="checkbox"
                checked={aiOrderChatbot}
                onChange={(e) => setAiOrderChatbot(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
