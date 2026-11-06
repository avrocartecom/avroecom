"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sliders,
  X,
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";

interface Market {
  id: string;
  name: string;
  code: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
  priceAdjustmentPercent: number;
  isPrimary: boolean;
  status: "ACTIVE" | "INACTIVE";
  countries: string[];
}

const SAMPLE_MARKETS: Market[] = [
  {
    id: "mkt_in",
    name: "India (Domestic)",
    code: "IN",
    currency: "INR",
    currencySymbol: "₹",
    exchangeRate: 1.0,
    priceAdjustmentPercent: 0,
    isPrimary: true,
    status: "ACTIVE",
    countries: ["India"],
  },
  {
    id: "mkt_us",
    name: "United States & Global",
    code: "US",
    currency: "USD",
    currencySymbol: "$",
    exchangeRate: 0.012,
    priceAdjustmentPercent: 15, // +15% to buffer international courier
    isPrimary: false,
    status: "ACTIVE",
    countries: ["United States", "Canada", "Australia", "United Kingdom"],
  },
  {
    id: "mkt_ae",
    name: "Middle East & GCC",
    code: "AE",
    currency: "AED",
    currencySymbol: "د.إ",
    exchangeRate: 0.044,
    priceAdjustmentPercent: 10,
    isPrimary: false,
    status: "ACTIVE",
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman"],
  },
  {
    id: "mkt_eu",
    name: "European Union",
    code: "EU",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRate: 0.011,
    priceAdjustmentPercent: 20, // covers EU VAT
    isPrimary: false,
    status: "INACTIVE",
    countries: ["Germany", "France", "Netherlands", "Italy", "Spain"],
  },
];

export default function InternationalMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>(SAMPLE_MARKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [marketName, setMarketName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [adjustment, setAdjustment] = useState(10);
  const [countryList, setCountryList] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketName) return;

    const newMkt: Market = {
      id: `mkt_${Date.now()}`,
      name: marketName,
      code: currency.substring(0, 2),
      currency,
      currencySymbol: symbol,
      exchangeRate: 0.012,
      priceAdjustmentPercent: Number(adjustment),
      isPrimary: false,
      status: "ACTIVE",
      countries: countryList.split(",").map((c) => c.trim()).filter(Boolean),
    };

    setMarkets([...markets, newMkt]);
    setIsModalOpen(false);
    setMarketName("");
    setCountryList("");
  };

  const handleToggleStatus = (id: string) => {
    setMarkets(
      markets.map((m) =>
        m.id === id ? { ...m, status: m.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : m
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Settings</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">International Markets</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-blue-600" />
            Markets & Multi-Currency
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sell worldwide with localized currencies, country-specific pricing buffers, and automatic geolocation routing.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Target Market
        </button>
      </div>

      {/* Markets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {markets.map((m) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{m.name}</h3>
                  {m.isPrimary && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                      Primary Domestic Market
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Currency: <strong className="text-slate-700">{m.currency} ({m.currencySymbol})</strong>
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  m.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}
              >
                {m.status}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Price Adjustment:</span>
                <span className="font-bold text-slate-800">
                  {m.priceAdjustmentPercent > 0 ? `+${m.priceAdjustmentPercent}% buffer` : "Base Catalog Price"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Countries:</span>
                <span className="font-medium text-slate-700 truncate max-w-xs text-right">
                  {m.countries.join(", ")}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              {!m.isPrimary && (
                <button
                  onClick={() => handleToggleStatus(m.id)}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {m.status === "ACTIVE" ? "Deactivate Market" : "Activate Market"}
                </button>
              )}
              {m.isPrimary && (
                <span className="text-[11px] text-slate-400">Base store currency cannot be deactivated</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD MARKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Add New International Market
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Market Region Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. United Kingdom & Ireland"
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Currency Code</label>
                  <input
                    type="text"
                    required
                    placeholder="GBP"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="£"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Price Buffer / Adjustment (%)</label>
                <input
                  type="number"
                  placeholder="15"
                  value={adjustment}
                  onChange={(e) => setAdjustment(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Add a % margin to cover customs, foreign transaction fees, and cross-border shipping.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Included Countries (comma-separated)</label>
                <input
                  type="text"
                  placeholder="United Kingdom, Ireland, Scotland"
                  value={countryList}
                  onChange={(e) => setCountryList(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Market
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
