"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  MessageSquare,
  CheckCircle2,
  Save,
  Eye,
  Edit,
  X,
  Truck,
  ShoppingCart,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface NotificationTemplate {
  id: string;
  name: string;
  category: "CUSTOMER" | "STAFF";
  subject: string;
  description: string;
  channels: ("EMAIL" | "WHATSAPP")[];
  enabled: boolean;
}

const TEMPLATES: NotificationTemplate[] = [
  {
    id: "notif_01",
    name: "Order Confirmation",
    category: "CUSTOMER",
    subject: "Order Confirmed: #{{order_number}} · {{brand_name}}",
    description: "Sent immediately after successful checkout and payment capture.",
    channels: ["EMAIL", "WHATSAPP"],
    enabled: true,
  },
  {
    id: "notif_02",
    name: "Order Dispatched & Tracking",
    category: "CUSTOMER",
    subject: "Your order #{{order_number}} is on the way! Tracking: {{awb}}",
    description: "Triggered automatically when courier AWB is generated.",
    channels: ["EMAIL", "WHATSAPP"],
    enabled: true,
  },
  {
    id: "notif_03",
    name: "Out for Delivery",
    category: "CUSTOMER",
    subject: "Out for delivery today: #{{order_number}}",
    description: "Sent in the morning when the delivery executive is assigned.",
    channels: ["WHATSAPP"],
    enabled: true,
  },
  {
    id: "notif_04",
    name: "Abandoned Checkout Recovery",
    category: "CUSTOMER",
    subject: "You left items in your cart! Complete your order for 5% off",
    description: "Sent 1 hour after customer leaves checkout without completing payment.",
    channels: ["EMAIL", "WHATSAPP"],
    enabled: true,
  },
  {
    id: "notif_05",
    name: "New Order Merchant Alert",
    category: "STAFF",
    subject: "[New Sale] Order #{{order_number}} placed for ₹{{total}}",
    description: "Sent to store owner and warehouse team when a new order arrives.",
    channels: ["EMAIL"],
    enabled: true,
  },
  {
    id: "notif_06",
    name: "Low Inventory Warning",
    category: "STAFF",
    subject: "[Alert] Low stock for {{product_title}} (≤ 5 units left)",
    description: "Alerts purchasing team when stock dips below safety threshold.",
    channels: ["EMAIL"],
    enabled: true,
  },
];

export default function NotificationsSettingsPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(TEMPLATES);
  const [previewTemplate, setPreviewTemplate] = useState<NotificationTemplate | null>(null);

  const handleToggle = (id: string) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/settings" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
              Settings
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-700">Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-600" />
            Customer & Staff Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated transaction emails, shipping alerts, SMS updates, and WhatsApp order confirmations.
          </p>
        </div>
      </div>

      {/* Templates List */}
      <div className="space-y-6 text-xs">
        {/* Customer Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Customer Notifications</span>
            <span className="text-[11px] font-normal text-slate-400">Order & delivery lifecycle updates</span>
          </h3>

          <div className="space-y-3">
            {templates
              .filter((t) => t.category === "CUSTOMER")
              .map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold text-sm">{t.name}</strong>
                      <div className="flex items-center gap-1">
                        {t.channels.includes("EMAIL") && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                            EMAIL
                          </span>
                        )}
                        {t.channels.includes("WHATSAPP") && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                            WHATSAPP
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-500 text-[11px]">{t.description}</p>
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      Subject: {t.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(t)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                    <button
                      onClick={() => handleToggle(t.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        t.enabled
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {t.enabled ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Staff Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Staff & Merchant Alerts</span>
            <span className="text-[11px] font-normal text-slate-400">Internal fulfillment notifications</span>
          </h3>

          <div className="space-y-3">
            {templates
              .filter((t) => t.category === "STAFF")
              .map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 font-bold text-sm">{t.name}</strong>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-800">
                        EMAIL
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{t.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(t.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        t.enabled
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {t.enabled ? "Active" : "Disabled"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* PREVIEW TEMPLATE MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Template Preview: {previewTemplate.name}
              </h2>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject Line</span>
                <strong className="text-slate-800 block">{previewTemplate.subject}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sample Body Content</span>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-600 space-y-2 mt-1 font-serif text-xs leading-relaxed">
                  <p>Hi Ananya,</p>
                  <p>
                    Great news! Your order <strong>#1042</strong> has been confirmed and is being hand-packed at our warehouse hub.
                  </p>
                  <p>
                    Once dispatched via express courier, your tracking link will be sent directly to your phone and email.
                  </p>
                  <p className="pt-2 text-[11px] text-slate-400 font-sans">
                    — The Store Team
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
