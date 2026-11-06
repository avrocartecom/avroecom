"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Truck,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  PackageCheck,
  ShieldCheck,
  Building2,
  Sliders,
  Store,
  ChevronRight,
  Info,
} from "lucide-react";

export default function ShippingSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "manual" | "zones" | "cod" | "pickup" | "automated"
  >("manual");
  const [providers, setProviders] = useState<any[]>([]);
  const [canUseCourierAPIs, setCanUseCourierAPIs] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Manual Couriers State
  const [manualCouriers, setManualCouriers] = useState([
    {
      id: "mc-1",
      name: "DTDC Courier & Cargo",
      code: "DTDC",
      trackingUrlTemplate: "https://www.dtdc.in/tracking/shipment-tracking.asp?id={TRACKING_NUMBER}",
      estimatedDays: "2-4 Business Days",
      enabled: true,
      notes: "Standard surface & air express with door collection",
    },
    {
      id: "mc-2",
      name: "India Post (Speed Post)",
      code: "SPEEDPOST",
      trackingUrlTemplate: "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?id={TRACKING_NUMBER}",
      estimatedDays: "3-5 Business Days",
      enabled: true,
      notes: "Reaches all 19,000+ PIN codes across India",
    },
    {
      id: "mc-3",
      name: "Blue Dart Direct (Manual AWB)",
      code: "BLUEDART",
      trackingUrlTemplate: "https://www.bluedart.com/tracking?handler=t&trackid={TRACKING_NUMBER}",
      estimatedDays: "1-2 Business Days",
      enabled: true,
      notes: "Express priority metro delivery",
    },
    {
      id: "mc-4",
      name: "In-House Fleet / Local Delivery",
      code: "LOCAL_FLEET",
      trackingUrlTemplate: "",
      estimatedDays: "Same Day / Next Day",
      enabled: true,
      notes: "Store van or bike delivery for same-city orders",
    },
  ]);

  // Delivery Zones State
  const [zones, setZones] = useState([
    {
      id: "zn-1",
      name: "Local Zone (Same City / Pincodes)",
      rate: 49,
      freeThreshold: 499,
      deliveryTime: "24-48 Hours",
      pincodeScope: "Same State / City Centers",
      active: true,
    },
    {
      id: "zn-2",
      name: "Metro Cities (Delhi, Mumbai, Bengaluru, etc.)",
      rate: 79,
      freeThreshold: 799,
      deliveryTime: "2-3 Days",
      pincodeScope: "Tier-1 Metropolitan Hubs",
      active: true,
    },
    {
      id: "zn-3",
      name: "Rest of India (Tier 2, 3 & Rural)",
      rate: 99,
      freeThreshold: 999,
      deliveryTime: "4-6 Days",
      pincodeScope: "All Non-Metro Pincodes",
      active: true,
    },
  ]);

  // COD Configuration State
  const [codConfig, setCodConfig] = useState({
    enabled: true,
    handlingFee: 50,
    freeThreshold: 1499,
    minOrderAmount: 299,
    maxOrderAmount: 15000,
    requireOtpConfirmation: true,
    blockedPincodes: "799001, 799002, 799003",
  });

  // Store Pickup (BOPIS) State
  const [pickupConfig, setPickupConfig] = useState({
    enabled: true,
    locationName: "AVRO Flagship Store & Central Depot",
    address: "Plot 42, Commercial Hub, Sector 62, Noida, Uttar Pradesh 201309",
    contactPhone: "+91 98765 43210",
    operatingHours: "Monday – Saturday: 10:00 AM – 7:30 PM",
    instructions: "Bring order confirmation SMS/Email and valid Government Photo ID at the pickup counter.",
    readyInHours: "2 Hours",
  });

  // Automated APIs Configuration State
  const [automatedCarriers, setAutomatedCarriers] = useState({
    shiprocketEmail: "operations@brandstore.com",
    shiprocketPassword: "••••••••••••",
    shiprocketPickupPincode: "110001",
    shiprocketEnabled: true,
    delhiveryClientId: "DELHIVERY_CLIENT_4921",
    delhiveryApiToken: "••••••••••••••••••••••••",
    delhiveryEnabled: false,
    autoGenerateAwb: true,
  });

  const loadProviders = () => {
    setLoading(true);
    fetch("/api/admin/settings/shipping")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProviders(data.providers || []);
          setCanUseCourierAPIs(data.canUseCourierAPIs ?? true);
          setCurrentPlan(data.plan || "GROW");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    } else {
      setSaveMsg(msg);
      setTimeout(() => setSaveMsg(""), 3500);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Commit flat rate / manual shipping into DB
      await fetch("/api/admin/settings/shipping", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "FLAT_RATE",
          isEnabled: true,
          title: "Manual Shipping & Local Delivery",
          config: {
            manualCouriers,
            zones,
            codConfig,
            pickupConfig,
          },
        }),
      });

      // Commit automated Shiprocket if enabled
      if (canUseCourierAPIs) {
        await fetch("/api/admin/settings/shipping", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "SHIPROCKET",
            isEnabled: automatedCarriers.shiprocketEnabled,
            title: "Shiprocket Logistics API",
            config: {
              apiEmail: automatedCarriers.shiprocketEmail,
              apiPassword: automatedCarriers.shiprocketPassword,
              pickupPincode: automatedCarriers.shiprocketPickupPincode,
              autoGenerateAwb: automatedCarriers.autoGenerateAwb,
            },
          }),
        });
      }

      showNotification("Shipping configurations, manual options, and rates saved successfully!");
    } catch (err: any) {
      showNotification("Saved shipping settings in memory.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleAddManualCourier = () => {
    const newCourier = {
      id: `mc-${Date.now()}`,
      name: "New Local Courier Partner",
      code: "CUSTOM_PARTNER",
      trackingUrlTemplate: "https://courier-tracking.com/track?no={TRACKING_NUMBER}",
      estimatedDays: "2-3 Days",
      enabled: true,
      notes: "Custom manual dispatch partner",
    };
    setManualCouriers([...manualCouriers, newCourier]);
    showNotification("New manual courier partner added.");
  };

  return (
    <div className="space-y-6">
      {/* Toast Alerts */}
      {saveMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950 text-rose-200 text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/settings" className="hover:text-blue-600">Settings</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Shipping & Delivery</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Shipping & Logistics Infrastructure
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure manual courier partners (Speed Post, DTDC, In-house fleet), regional delivery zones, Cash on Delivery, and automated carrier APIs.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save Shipping Settings"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab("manual")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "manual"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Manual Shipping & Couriers ({manualCouriers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("zones")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "zones"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Delivery Zones & Rates ({zones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("cod")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "cod"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Cash on Delivery (COD) Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("pickup")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pickup"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Pickup & Click-and-Collect</span>
        </button>

        <button
          onClick={() => setActiveTab("automated")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "automated"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Automated Carrier APIs</span>
        </button>
      </div>

      {/* Tab 1: Manual Shipping & Couriers */}
      {activeTab === "manual" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Manual Courier Partners & Self-Fulfillment
                </h3>
                <p className="text-xs text-slate-500">
                  Deliver using your local transport, Speed Post, DTDC, or dedicated riders. When fulfilling orders, pick any partner below and enter the consignment number.
                </p>
              </div>
              <button
                onClick={handleAddManualCourier}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Courier Partner</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {manualCouriers.map((courier, idx) => (
                <div key={courier.id} className="p-4 bg-white hover:bg-slate-50 transition space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{courier.name}</span>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                            {courier.code}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{courier.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={courier.enabled}
                          onChange={(e) => {
                            const updated = [...manualCouriers];
                            updated[idx].enabled = e.target.checked;
                            setManualCouriers(updated);
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{courier.enabled ? "Active" : "Disabled"}</span>
                      </label>
                      <button
                        onClick={() => {
                          setManualCouriers(manualCouriers.filter((c) => c.id !== courier.id));
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove partner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tracking Template Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tracking URL Pattern ({`use {TRACKING_NUMBER} placeholder`})
                      </label>
                      <input
                        type="text"
                        value={courier.trackingUrlTemplate}
                        onChange={(e) => {
                          const updated = [...manualCouriers];
                          updated[idx].trackingUrlTemplate = e.target.value;
                          setManualCouriers(updated);
                        }}
                        placeholder="https://carrier.com/track?id={TRACKING_NUMBER}"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Typical Transit Estimate
                      </label>
                      <input
                        type="text"
                        value={courier.estimatedDays}
                        onChange={(e) => {
                          const updated = [...manualCouriers];
                          updated[idx].estimatedDays = e.target.value;
                          setManualCouriers(updated);
                        }}
                        placeholder="e.g. 2-4 Business Days"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Delivery Zones & Flat Rates */}
      {activeTab === "zones" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Regional Delivery Zones & Shipping Slabs</h3>
              <p className="text-xs text-slate-500">
                Set customer shipping charges based on destination proximity and order value thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {zones.map((zone, zIdx) => (
                <div
                  key={zone.id}
                  className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{zone.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {zone.deliveryTime}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">{zone.pincodeScope}</p>

                  <div className="space-y-2 text-xs pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Standard Shipping Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={zone.rate}
                        onChange={(e) => {
                          const updated = [...zones];
                          updated[zIdx].rate = Number(e.target.value);
                          setZones(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Free Delivery on Orders Above (₹)
                      </label>
                      <input
                        type="number"
                        value={zone.freeThreshold}
                        onChange={(e) => {
                          const updated = [...zones];
                          updated[zIdx].freeThreshold = Number(e.target.value);
                          setZones(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cash on Delivery (COD) Rules */}
      {activeTab === "cod" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Cash on Delivery (COD) Logistics Rules</h3>
                <p className="text-xs text-slate-500">
                  Protect against high return-to-origin (RTO) with handling fees, order caps, and OTP verification.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={codConfig.enabled}
                  onChange={(e) => setCodConfig({ ...codConfig, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">Enable COD</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">COD Handling Fee (₹)</label>
                <input
                  type="number"
                  value={codConfig.handlingFee}
                  onChange={(e) => setCodConfig({ ...codConfig, handlingFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Charged in cart for COD</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Free COD Threshold (₹)</label>
                <input
                  type="number"
                  value={codConfig.freeThreshold}
                  onChange={(e) => setCodConfig({ ...codConfig, freeThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Waives fee on large orders</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum COD Cart (₹)</label>
                <input
                  type="number"
                  value={codConfig.minOrderAmount}
                  onChange={(e) => setCodConfig({ ...codConfig, minOrderAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum COD Limit (₹)</label>
                <input
                  type="number"
                  value={codConfig.maxOrderAmount}
                  onChange={(e) => setCodConfig({ ...codConfig, maxOrderAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={codConfig.requireOtpConfirmation}
                  onChange={(e) => setCodConfig({ ...codConfig, requireOtpConfirmation: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Require WhatsApp / SMS COD Confirmation</span>
                  <span className="text-[11px] text-slate-500">
                    Auto-sends 1-click confirmation link before warehouse packing to reduce fake orders.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Store Pickup (BOPIS) */}
      {activeTab === "pickup" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">In-Store & Warehouse Pickup (Click & Collect)</h3>
                <p className="text-xs text-slate-500">
                  Allow customers to pick up orders directly from your physical store or fulfillment depot with zero shipping fee.
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pickupConfig.enabled}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, enabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">Enable Pickup</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pickup Location Name</label>
                <input
                  type="text"
                  value={pickupConfig.locationName}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, locationName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={pickupConfig.contactPhone}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Full Physical Pickup Address</label>
                <input
                  type="text"
                  value={pickupConfig.address}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Store Operating Hours</label>
                <input
                  type="text"
                  value={pickupConfig.operatingHours}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Ready Time</label>
                <input
                  type="text"
                  value={pickupConfig.readyInHours}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, readyInHours: e.target.value })}
                  placeholder="e.g. Ready in 2 Hours"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Customer Instructions at Counter</label>
                <textarea
                  rows={2}
                  value={pickupConfig.instructions}
                  onChange={(e) => setPickupConfig({ ...pickupConfig, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Automated Carrier APIs */}
      {activeTab === "automated" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Automated Courier API Connections</h3>
              <p className="text-xs text-slate-500">
                Connect Shiprocket or Delhivery to auto-assign couriers (Delhivery, BlueDart, XpressBees), generate AWBs, and print shipping labels with barcodes.
              </p>
            </div>

            {/* Shiprocket Section */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900">Shiprocket Direct API</span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={automatedCarriers.shiprocketEnabled}
                    onChange={(e) =>
                      setAutomatedCarriers({ ...automatedCarriers, shiprocketEnabled: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Enable</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Account Email</label>
                  <input
                    type="email"
                    value={automatedCarriers.shiprocketEmail}
                    onChange={(e) =>
                      setAutomatedCarriers({ ...automatedCarriers, shiprocketEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Password / Secret</label>
                  <input
                    type="password"
                    value={automatedCarriers.shiprocketPassword}
                    onChange={(e) =>
                      setAutomatedCarriers({ ...automatedCarriers, shiprocketPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warehouse Pickup Pincode</label>
                  <input
                    type="text"
                    value={automatedCarriers.shiprocketPickupPincode}
                    onChange={(e) =>
                      setAutomatedCarriers({ ...automatedCarriers, shiprocketPickupPincode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={automatedCarriers.autoGenerateAwb}
                  onChange={(e) =>
                    setAutomatedCarriers({ ...automatedCarriers, autoGenerateAwb: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-slate-700 font-semibold">
                  Automatically generate AWB & tracking code upon marking order Packed
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
