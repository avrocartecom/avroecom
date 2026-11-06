"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Mail,
  Copy,
  DollarSign,
  AlertCircle,
  X,
  CreditCard,
} from "lucide-react";

interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  recipientName: string;
  recipientEmail: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "ACTIVE" | "REDEEMED" | "DISABLED";
}

const SAMPLE_GIFT_CARDS: GiftCard[] = [
  {
    id: "gc_01",
    code: "AVRO-GIFT-7F2A-9142",
    initialValue: 5000,
    balance: 2450,
    recipientName: "Kavita Reddy",
    recipientEmail: "kavita.reddy@example.com",
    issuedAt: "2026-11-01T10:00:00Z",
    expiresAt: "2027-11-01T10:00:00Z",
    status: "ACTIVE",
  },
  {
    id: "gc_02",
    code: "AVRO-GIFT-1B8C-4409",
    initialValue: 2000,
    balance: 0,
    recipientName: "Amit Joshi",
    recipientEmail: "amit.j@example.com",
    issuedAt: "2026-10-15T14:30:00Z",
    expiresAt: "2027-10-15T14:30:00Z",
    status: "REDEEMED",
  },
  {
    id: "gc_03",
    code: "AVRO-GIFT-3E5D-7819",
    initialValue: 1000,
    balance: 1000,
    recipientName: "Priya Sharma",
    recipientEmail: "priya.sharma@example.com",
    issuedAt: "2026-11-05T09:15:00Z",
    expiresAt: null,
    status: "ACTIVE",
  },
];

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>(SAMPLE_GIFT_CARDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [initialValue, setInitialValue] = useState(1000);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [note, setNote] = useState("");

  const totalOutstanding = giftCards.reduce((acc, g) => acc + g.balance, 0);
  const totalIssued = giftCards.reduce((acc, g) => acc + g.initialValue, 0);

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName) return;

    const randomCode = `AVRO-GIFT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newCard: GiftCard = {
      id: `gc_${Date.now()}`,
      code: randomCode,
      initialValue: Number(initialValue),
      balance: Number(initialValue),
      recipientName,
      recipientEmail: recipientEmail || "recipient@example.com",
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: "ACTIVE",
    };

    setGiftCards([newCard, ...giftCards]);
    setIsModalOpen(false);
    setRecipientName("");
    setRecipientEmail("");
    setInitialValue(1000);
    setNote("");
    alert(`Digital Gift Card issued successfully!\nCode: ${randomCode}\nValue: ₹${initialValue}`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied gift card code: ${code}`);
  };

  const handleToggleStatus = (id: string) => {
    setGiftCards(
      giftCards.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "ACTIVE" ? "DISABLED" : "ACTIVE" }
          : g
      )
    );
  };

  const filtered = giftCards.filter(
    (g) =>
      g.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/products" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Products
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Gift Cards</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Gift className="w-6 h-6 text-emerald-600" />
            Digital Gift Cards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sell digital gift cards directly on your store or issue custom credit codes to clients for promotions and store returns.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Issue Gift Card
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Outstanding Gift Card Balance
          </span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            Available customer store credit
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Value Issued
          </span>
          <strong className="text-2xl font-black text-slate-900 mt-1 block">
            ₹{totalIssued.toLocaleString("en-IN")}
          </strong>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Across {giftCards.length} generated cards
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Checkout Redemption
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <strong className="text-xs font-bold text-slate-800">Checkout Enabled</strong>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Customers enter code in payment section
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gift cards by code, recipient name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Gift Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Card Code</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Issued Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Initial Value</th>
                <th className="py-3 px-4 text-right">Remaining Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                    <span>{g.code}</span>
                    <button
                      onClick={() => handleCopyCode(g.code)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600"
                      title="Copy code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{g.recipientName}</span>
                    <span className="text-[11px] text-slate-400">{g.recipientEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(g.issuedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        g.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : g.status === "REDEEMED"
                          ? "bg-slate-100 text-slate-600 border border-slate-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                    ₹{g.initialValue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₹{g.balance.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(g.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-600"
                    >
                      {g.status === "ACTIVE" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUE GIFT CARD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                Issue Digital Gift Card
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Gift Card Value</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[500, 1000, 2500, 5000].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => setInitialValue(val)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        initialValue === val
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={100}
                  required
                  placeholder="Or enter custom amount in ₹"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Recipient Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Recipient name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Recipient Email Address</label>
                <input
                  type="email"
                  placeholder="Recipient email address"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Custom Note / Greeting</label>
                <textarea
                  rows={2}
                  placeholder="Happy Birthday! Enjoy shopping our premium collection..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                  Generate & Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
