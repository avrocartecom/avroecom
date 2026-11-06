"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  BarChart3,
  DollarSign,
  Share2,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Mail,
  MessageSquare,
  Search,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  utmSource: string;
  spend: number;
  orders: number;
  revenue: number;
  roas: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_01",
    name: "Winter Festive Performance Apparel",
    channel: "Meta (Instagram & FB)",
    utmSource: "instagram_ad_feed",
    spend: 25000,
    orders: 84,
    revenue: 342000,
    roas: 13.68,
    status: "ACTIVE",
  },
  {
    id: "camp_02",
    name: "Google High-Intent Search (Ergonomic Gear)",
    channel: "Google Ads",
    utmSource: "google_search_desk",
    spend: 18000,
    orders: 46,
    revenue: 198000,
    roas: 11.0,
    status: "ACTIVE",
  },
  {
    id: "camp_03",
    name: "WhatsApp VIP Secret Drop",
    channel: "WhatsApp Broadcast",
    utmSource: "wa_vip_exclusive",
    spend: 1200,
    orders: 38,
    revenue: 165000,
    roas: 137.5,
    status: "COMPLETED",
  },
];

export default function GrowthMarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const overallRoas = (totalRevenue / totalSpend).toFixed(1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Marketing</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Growth & Attribution</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            Growth, Attribution & Autopilot
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track first-click & last-click UTM attribution across ad channels, measure true blended ROAS, and configure autopilot customer retention flows.
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Attributed Ad Revenue
          </span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Across active tracked campaigns
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Marketing Spend
          </span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{totalSpend.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Meta, Google & WhatsApp API
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Blended ROAS
          </span>
          <strong className="text-2xl font-black text-blue-600 mt-1 block">
            {overallRoas}x
          </strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            ₹{overallRoas} earned per ₹1 spent
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Attributed Orders
          </span>
          <strong className="text-2xl font-black text-purple-600 mt-1 block">
            {campaigns.reduce((acc, c) => acc + c.orders, 0)}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Verified checkout conversions
          </span>
        </div>
      </div>

      {/* Autopilot Retention Sequences */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/20 inline-block">
              Autonomous Growth Engine
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">Autopilot Retention Sequences</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Automatic time-triggered emails and WhatsApp messages that run 24/7 without manual intervention to drive repeat orders.
            </p>
          </div>

          <label className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 cursor-pointer">
            <input
              type="checkbox"
              checked={autopilotEnabled}
              onChange={(e) => setAutopilotEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0"
            />
            <span className="text-xs font-bold">{autopilotEnabled ? "Autopilot ACTIVE" : "PAUSED"}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-900">
          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs">1. Abandoned Cart Recovery</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">1hr & 24hr</span>
            </div>
            <p className="text-[11px] text-slate-500">Sends WhatsApp & email with direct 1-click checkout recovery link and optional 5% incentive.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs">2. Post-Delivery Review Flow</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Day 3 Post-Delivery</span>
            </div>
            <p className="text-[11px] text-slate-500">Requests verified 5-star customer photos and product feedback with thank-you gift code.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs">3. Win-Back Lapsed Shoppers</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Day 60 Inactive</span>
            </div>
            <p className="text-[11px] text-slate-500">Sends personalized recommendations based on previous purchase history to re-engage dormant buyers.</p>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Attributed Marketing Campaigns</h3>
          <span className="text-xs text-slate-400">Tracked via UTM parameters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">UTM Source</th>
                <th className="py-3 px-4 text-right">Ad Spend</th>
                <th className="py-3 px-4 text-right">Orders</th>
                <th className="py-3 px-4 text-right">Attributed Sales</th>
                <th className="py-3 px-4 text-right">ROAS</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{c.channel}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    ?utm_source={c.utmSource}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                    ₹{c.spend.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">{c.orders}</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                    ₹{c.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-blue-600">
                    {c.roas}x
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
