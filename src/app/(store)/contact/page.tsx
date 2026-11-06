"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function StoreContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#0A192F]">Contact Customer Support</h1>
        <p className="text-xs text-slate-500">
          Have a question about an order, shipment, or return? We're here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 text-xs text-slate-600">
          <div>
            <strong className="block text-slate-900 text-sm mb-1">Customer Helpline</strong>
            <p className="text-slate-500">Available Monday to Saturday, 10:00 AM - 6:00 PM IST</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <span>+91 98765 00000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#2563EB]" />
              <span>support@yourstore.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              <span>Warehouse & Logistics Hub, New Delhi, India</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900">Message Received</h3>
              <p className="text-xs text-slate-500">We will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                <input type="text" required className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input type="email" required className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Order # (Optional)</label>
                <input type="text" placeholder="Order number" className="w-full px-3 py-2 border rounded-lg focus:outline-none uppercase font-mono" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Message</label>
                <textarea required rows={4} className="w-full px-3 py-2 border rounded-lg focus:outline-none" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#0A192F] text-white font-bold flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
