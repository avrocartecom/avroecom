"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  UserCheck,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Save,
  ArrowRight,
} from "lucide-react";

export default function CheckoutSettingsPage() {
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [requirePhone, setRequirePhone] = useState(true);
  const [requirePincodeVerification, setRequirePincodeVerification] = useState(true);
  const [enableOrderNotes, setEnableOrderNotes] = useState(true);
  const [autoFulfillDigital, setAutoFulfillDigital] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            <span className="text-xs font-bold text-slate-700">Checkout & Accounts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-600" />
            Checkout & Customer Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure friction-free guest checkout, contact information requirements, address validation, and post-purchase workflows.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Checkout settings successfully saved!
        </div>
      )}

      {/* Rules Form */}
      <div className="space-y-6 text-xs">
        {/* Customer Accounts Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Customer Account Options
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={allowGuestCheckout}
                onChange={(e) => setAllowGuestCheckout(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Allow 1-Click Instant Guest Checkout</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Customers can complete purchase immediately without setting a password. Highly recommended for maximum conversion rate in India.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Contact Method */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Customer Contact Information
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePhone}
                onChange={(e) => setRequirePhone(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Require 10-Digit Mobile Phone Number</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Mandatory for Indian courier logistics (Delhivery, Shiprocket, DTDC) to deliver SMS OTP and doorstep call verification.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePincodeVerification}
                onChange={(e) => setRequirePincodeVerification(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Live 6-Digit Pincode Validation</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Automatically auto-fills City and State from official Indian postal registry and checks serviceability.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Processing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
            Order Processing & Delivery Instructions
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={enableOrderNotes}
                onChange={(e) => setEnableOrderNotes(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Enable Order Notes / Special Instructions Field</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Allows customers to specify apartment gate codes, preferred delivery time, or custom gift messages.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFulfillDigital}
                onChange={(e) => setAutoFulfillDigital(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <strong className="text-slate-900 block font-bold">Automatically Fulfill Digital Orders & Gift Cards</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Sends download links and digital codes immediately upon payment capture.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
