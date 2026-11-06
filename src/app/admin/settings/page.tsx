"use client";

import Link from "next/link";
import {
  Store,
  CreditCard,
  Truck,
  Users,
  Key,
  ShieldCheck,
  Globe,
  Bell,
  Sliders,
  DollarSign,
  Receipt,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

export default function SettingsOverviewPage() {
  const settingsSections = [
    {
      title: "General & Brand",
      desc: "Store name, brand logos, support contact, time zone, and primary currency.",
      href: "/admin/settings/general",
      icon: Store,
      badge: "Essential",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "License Key & Connecting Centre",
      desc: "Write commercial license keys, configure live Central Authority bridge, and verify entitlements.",
      href: "/admin/license",
      icon: Key,
      badge: "Cryptographic Hub",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Users & Permissions",
      desc: "Invite store staff, assign roles (Owner, Manager, Fulfillment), and enforce 2FA.",
      href: "/admin/users",
      icon: Users,
      badge: "Team",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Payments & Gateways",
      desc: "Razorpay, Cashfree, PhonePe, UPI AutoPay, Cash on Delivery (COD), and Manual EFT.",
      href: "/admin/settings/payments",
      icon: CreditCard,
      badge: "Gateways",
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      title: "Checkout & Accounts",
      desc: "Guest checkout, phone number enforcement, address forms, and post-purchase tips.",
      href: "/admin/settings/checkout",
      icon: UserCheck,
      badge: "Conversion",
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      title: "Shipping & Delivery",
      desc: "Pincode delivery zones, free shipping rules, warehouse origins, and local pickup.",
      href: "/admin/settings/shipping",
      icon: Truck,
      badge: "Logistics",
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
    {
      title: "Taxes & GST",
      desc: "GSTIN registration, slab rates (0% to 28%), tax-inclusive pricing, and HSN codes.",
      href: "/admin/settings/taxes",
      icon: Receipt,
      badge: "Compliance",
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      title: "Central Support & SLA",
      desc: "Open live engineering tickets, WhatsApp support, and technical assistance from Technext Central.",
      href: "/admin/support",
      icon: LifeBuoy,
      badge: "SLA Active",
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
      title: "Notifications",
      desc: "Customer order confirmations, tracking SMS/WhatsApp, and staff order dispatch alerts.",
      href: "/admin/settings/notifications",
      icon: Bell,
      badge: "Alerts",
      color: "bg-violet-50 text-violet-600 border-violet-200",
    },
    {
      title: "Other Settings",
      desc: "Metafields, tracking pixels, multi-language, legal policies, and store configurations.",
      href: "/admin/settings/other",
      icon: Sliders,
      badge: "Advanced",
      color: "bg-slate-100 text-slate-700 border-slate-300",
    },
    {
      title: "Admin Profile & Security",
      desc: "Personal administrator account credentials, master email, and password changes.",
      href: "/admin/profile",
      icon: ShieldCheck,
      badge: "Security",
      color: "bg-sky-50 text-sky-600 border-sky-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Store Configuration & Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Master control panel for store operations, payments, checkout rules, domains, taxes, and system licenses.
        </p>
      </div>

      {/* Grid of All Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1.5">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                <span>Configure &rarr;</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
