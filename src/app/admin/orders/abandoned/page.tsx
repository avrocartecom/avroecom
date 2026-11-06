"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Send,
  Mail,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  AlertCircle,
  Eye,
  RefreshCw,
} from "lucide-react";

interface AbandonedCheckout {
  id: string;
  checkoutToken: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { title: string; quantity: number; price: number }[];
  totalValue: number;
  abandonedAt: string;
  recoveryStatus: "NOT_SENT" | "EMAIL_SENT" | "RECOVERED";
  recoveryUrl: string;
}

const SAMPLE_ABANDONED: AbandonedCheckout[] = [
  {
    id: "abn_01",
    checkoutToken: "CHK-91823",
    customerName: "Rohan Varma",
    customerEmail: "rohan.varma@example.com",
    customerPhone: "+91 98450 11234",
    items: [
      { title: "Aerodynamic Performance Jacket", quantity: 1, price: 4499 },
      { title: "Pro Running Cap", quantity: 1, price: 899 },
    ],
    totalValue: 5398,
    abandonedAt: "2026-11-06T11:20:00Z",
    recoveryStatus: "NOT_SENT",
    recoveryUrl: "https://avrostore.com/checkout?recover=CHK-91823",
  },
  {
    id: "abn_02",
    checkoutToken: "CHK-91824",
    customerName: "Sneha Nair",
    customerEmail: "sneha.nair@example.com",
    customerPhone: "+91 97412 88990",
    items: [
      { title: "Magnetic Wireless Power Bank 10000mAh", quantity: 2, price: 2199 },
    ],
    totalValue: 4398,
    abandonedAt: "2026-11-06T09:40:00Z",
    recoveryStatus: "EMAIL_SENT",
    recoveryUrl: "https://avrostore.com/checkout?recover=CHK-91824",
  },
  {
    id: "abn_03",
    checkoutToken: "CHK-91825",
    customerName: "Deepak Mehta",
    customerEmail: "deepak.mehta@example.com",
    customerPhone: "+91 99200 33411",
    items: [
      { title: "Minimalist Italian Leather Cardholder", quantity: 1, price: 1499 },
    ],
    totalValue: 1499,
    abandonedAt: "2026-11-05T18:15:00Z",
    recoveryStatus: "RECOVERED",
    recoveryUrl: "https://avrostore.com/checkout?recover=CHK-91825",
  },
];

export default function AbandonedCheckoutsPage() {
  const [checkouts, setCheckouts] = useState<AbandonedCheckout[]>(SAMPLE_ABANDONED);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "NOT_SENT" | "EMAIL_SENT" | "RECOVERED">("ALL");

  const totalAbandonedAmount = checkouts.reduce((acc, c) => acc + c.totalValue, 0);
  const recoveredAmount = checkouts
    .filter((c) => c.recoveryStatus === "RECOVERED")
    .reduce((acc, c) => acc + c.totalValue, 0);

  const handleSendRecovery = (id: string, channel: "EMAIL" | "WHATSAPP") => {
    setCheckouts(
      checkouts.map((c) => (c.id === id ? { ...c, recoveryStatus: "EMAIL_SENT" } : c))
    );
    alert(`Personalized abandoned cart recovery link sent via ${channel}!`);
  };

  const filtered = checkouts.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.checkoutToken.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "ALL") return matchesSearch;
    return matchesSearch && c.recoveryStatus === activeTab;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/orders" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Orders
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Abandoned Checkouts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            Abandoned Checkouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify customers who initiated checkout but didn't finish payment. Send automated recovery emails and WhatsApp reminders.
          </p>
        </div>
      </div>

      {/* Analytics Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Abandoned Value
          </span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{totalAbandonedAmount.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {checkouts.length} potential customer orders
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Successfully Recovered
          </span>
          <strong className="text-2xl font-black text-emerald-600 mt-1 block">
            ₹{recoveredAmount.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            33% cart conversion recapture rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Automated Retention Recovery
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-xs font-bold text-slate-800">Autopilot Flow Active</strong>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Sends 1hr & 24hr reminder with 5% discount
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(["ALL", "NOT_SENT", "EMAIL_SENT", "RECOVERED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab === "ALL" && "All Checkouts"}
                {tab === "NOT_SENT" && "Needs Reminder"}
                {tab === "EMAIL_SENT" && "Recovery Sent"}
                {tab === "RECOVERED" && "Recovered"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Checkouts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Checkout ID</th>
                <th className="py-3 px-4">Abandoned Time</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Cart Contents</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Cart Total</th>
                <th className="py-3 px-4 text-right">Recapture Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {c.checkoutToken}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(c.abandonedAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{c.customerName}</span>
                    <span className="text-[11px] text-slate-400 block">{c.customerEmail}</span>
                    <span className="text-[10px] text-slate-400">{c.customerPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    {c.items.map((it, idx) => (
                      <span key={idx} className="block text-[11px] text-slate-700 line-clamp-1">
                        {it.quantity}x {it.title} (₹{it.price.toLocaleString("en-IN")})
                      </span>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        c.recoveryStatus === "RECOVERED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : c.recoveryStatus === "EMAIL_SENT"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {c.recoveryStatus === "RECOVERED" && <CheckCircle2 className="w-3 h-3" />}
                      {c.recoveryStatus === "EMAIL_SENT" && <Mail className="w-3 h-3" />}
                      {c.recoveryStatus === "NOT_SENT" && <Clock className="w-3 h-3" />}
                      {c.recoveryStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₹{c.totalValue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.recoveryStatus !== "RECOVERED" ? (
                        <>
                          <button
                            onClick={() => handleSendRecovery(c.id, "EMAIL")}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 flex items-center gap-1 transition-colors"
                            title="Send email reminder with checkout link"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </button>
                          <button
                            onClick={() => handleSendRecovery(c.id, "WHATSAPP")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center gap-1 transition-colors"
                            title="Send WhatsApp recovery message"
                          >
                            <MessageSquare className="w-3 h-3" />
                            WhatsApp
                          </button>
                        </>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Order Placed
                        </span>
                      )}
                    </div>
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
