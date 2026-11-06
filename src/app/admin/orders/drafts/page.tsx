"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileEdit,
  Plus,
  Search,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Mail,
  User,
  ShoppingBag,
  CreditCard,
  X,
} from "lucide-react";

interface DraftOrder {
  id: string;
  draftNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { title: string; quantity: number; price: number }[];
  total: number;
  status: "OPEN" | "INVOICE_SENT" | "COMPLETED";
  createdAt: string;
  notes?: string;
}

const INITIAL_DRAFTS: DraftOrder[] = [
  {
    id: "draft_01",
    draftNumber: "DRAFT-1042",
    customerName: "Vikram Malhotra",
    customerEmail: "vikram.m@example.com",
    customerPhone: "+91 98201 44512",
    items: [
      { title: "Aerodynamic Performance Jacket", quantity: 1, price: 4499 },
      { title: "Merino Wool Thermal Socks", quantity: 2, price: 599 },
    ],
    total: 5697,
    status: "INVOICE_SENT",
    createdAt: "2026-11-06T10:15:00Z",
    notes: "Custom phone order. Requested fast express delivery.",
  },
  {
    id: "draft_02",
    draftNumber: "DRAFT-1043",
    customerName: "Ayesha Sen",
    customerEmail: "ayesha.sen@example.com",
    customerPhone: "+91 99302 78100",
    items: [
      { title: "Ergonomic Aluminium Laptop Stand", quantity: 3, price: 2499 },
    ],
    total: 7497,
    status: "OPEN",
    createdAt: "2026-11-06T11:45:00Z",
    notes: "Bulk studio order with 10% B2B courtesy discount.",
  },
];

export default function DraftOrdersPage() {
  const [drafts, setDrafts] = useState<DraftOrder[]>(INITIAL_DRAFTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftOrder | null>(null);

  // New draft form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(1999);
  const [notes, setNotes] = useState("");

  const handleCreateDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !itemTitle) return;

    const newDraft: DraftOrder = {
      id: `draft_${Date.now()}`,
      draftNumber: `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail: customerEmail || "customer@example.com",
      customerPhone: customerPhone || "+91 98765 43210",
      items: [{ title: itemTitle, quantity: Number(itemQty), price: Number(itemPrice) }],
      total: Number(itemQty) * Number(itemPrice),
      status: "OPEN",
      createdAt: new Date().toISOString(),
      notes,
    };

    setDrafts([newDraft, ...drafts]);
    setIsCreateModalOpen(false);
    // Reset form
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setItemTitle("");
    setItemQty(1);
    setItemPrice(1999);
    setNotes("");
  };

  const handleSendInvoice = (id: string) => {
    setDrafts(
      drafts.map((d) => (d.id === id ? { ...d, status: "INVOICE_SENT" } : d))
    );
    alert("Invoice checkout link sent directly to customer email & SMS!");
  };

  const handleCompleteOrder = (id: string) => {
    setDrafts(
      drafts.map((d) => (d.id === id ? { ...d, status: "COMPLETED" } : d))
    );
    alert("Draft converted into an official confirmed order!");
  };

  const filtered = drafts.filter(
    (d) =>
      d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.draftNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/orders" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Orders
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Draft Orders</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <FileEdit className="w-6 h-6 text-blue-600" />
            Draft Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create custom orders for clients, apply manual discounts, and send invoice checkout links.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Draft Order
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search drafts by customer, draft number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Drafts List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Draft #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {d.draftNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(d.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{d.customerName}</span>
                    <span className="text-[11px] text-slate-400">{d.customerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    {d.items.map((it, idx) => (
                      <span key={idx} className="block text-[11px] text-slate-700 line-clamp-1">
                        {it.quantity}x {it.title}
                      </span>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        d.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : d.status === "INVOICE_SENT"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {d.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                      {d.status === "INVOICE_SENT" && <Mail className="w-3 h-3" />}
                      {d.status === "OPEN" && <Clock className="w-3 h-3" />}
                      {d.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ₹{d.total.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {d.status !== "COMPLETED" && (
                        <>
                          <button
                            onClick={() => handleSendInvoice(d.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] border border-blue-200 transition-colors"
                            title="Send invoice checkout link to customer"
                          >
                            Send Invoice
                          </button>
                          <button
                            onClick={() => handleCompleteOrder(d.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 transition-colors"
                          >
                            Mark Paid
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DRAFT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-blue-600" />
                Create New Draft Order
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Customer full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="Customer email address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Phone Number</label>
                <input
                  type="tel"
                  placeholder="Customer phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Order Line Items
                </span>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <input
                      type="text"
                      required
                      placeholder="Item name / title"
                      value={itemTitle}
                      onChange={(e) => setItemTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="Qty"
                      value={itemQty}
                      onChange={(e) => setItemQty(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      required
                      placeholder="Price (₹)"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div className="text-right text-xs font-bold text-slate-800 pt-1">
                  Draft Total: ₹{(Number(itemQty) * Number(itemPrice)).toLocaleString("en-IN")}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Staff / Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special client terms, custom embroidery instructions, or delivery notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm"
                >
                  Save Draft Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
