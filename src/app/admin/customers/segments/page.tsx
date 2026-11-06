"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Filter,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  Mail,
  X,
  CheckCircle2,
} from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  customerCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  tag: string;
}

const INITIAL_SEGMENTS: Segment[] = [
  {
    id: "seg_01",
    name: "VIP Top Spenders",
    description: "High-net-worth customers with lifetime spend exceeding ₹10,000.",
    criteria: "Total Spend ≥ ₹10,000",
    customerCount: 48,
    totalRevenue: 642000,
    avgOrderValue: 7800,
    tag: "VIP",
  },
  {
    id: "seg_02",
    name: "Loyal Repeat Buyers",
    description: "Customers who have placed 3 or more completed orders.",
    criteria: "Orders Count ≥ 3",
    customerCount: 112,
    totalRevenue: 890000,
    avgOrderValue: 4100,
    tag: "REPEAT",
  },
  {
    id: "seg_03",
    name: "At-Risk / Lapsed (60+ Days)",
    description: "Previously active shoppers who haven't placed an order in over 60 days.",
    criteria: "Last Order > 60 days ago",
    customerCount: 84,
    totalRevenue: 280000,
    avgOrderValue: 2900,
    tag: "WIN_BACK",
  },
  {
    id: "seg_04",
    name: "First-Time Customers (30 Days)",
    description: "Recently acquired shoppers who completed their first order this month.",
    criteria: "Orders Count = 1 AND Joined ≤ 30 days",
    customerCount: 176,
    totalRevenue: 492000,
    avgOrderValue: 2795,
    tag: "NEW",
  },
];

export default function CustomerSegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New segment form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [conditionField, setConditionField] = useState("total_spend");
  const [conditionVal, setConditionVal] = useState("5000");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newSeg: Segment = {
      id: `seg_${Date.now()}`,
      name,
      description,
      criteria: `${conditionField.replace("_", " ")} ≥ ₹${conditionVal}`,
      customerCount: Math.floor(Math.random() * 30) + 5,
      totalRevenue: Math.floor(Math.random() * 100000) + 20000,
      avgOrderValue: Math.floor(Math.random() * 2000) + 1500,
      tag: "CUSTOM",
    };

    setSegments([newSeg, ...segments]);
    setIsModalOpen(false);
    setName("");
    setDescription("");
  };

  const filtered = segments.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/customers" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Customers
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Segments</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Customer Segments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Group customers based on spending habits, purchase frequency, and location to run targeted promotions and personalized retention.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 inline-block mb-1.5">
                    {s.tag}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{s.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 block">{s.customerCount}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Customers</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{s.description}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Segment Revenue</span>
                  <strong className="text-slate-900 font-extrabold">₹{s.totalRevenue.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Order</span>
                  <strong className="text-slate-900 font-extrabold">₹{s.avgOrderValue.toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Condition</span>
                  <span className="text-[11px] font-mono font-bold text-indigo-600">{s.criteria}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href={`/admin/customers?segment=${s.id}`}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                View Customers in Segment <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={`/admin/coupons?segment=${s.id}`}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                Target Discount
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Build Customer Segment
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Segment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival High-Value Shoppers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the audience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-[11px]">Filter Rule Condition</span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={conditionField}
                    onChange={(e) => setConditionField(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="total_spend">Lifetime Spend (₹)</option>
                    <option value="orders_count">Completed Orders</option>
                    <option value="days_since_order">Days Since Last Order</option>
                  </select>
                  <input
                    type="number"
                    value={conditionVal}
                    onChange={(e) => setConditionVal(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
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
                  Save Segment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
