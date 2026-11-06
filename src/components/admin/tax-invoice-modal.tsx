"use client";

import React, { useEffect, useState } from "react";
import { Printer, X, Download, ShieldCheck, Check, Building2, Mail, Phone } from "lucide-react";

export interface InvoiceOrder {
  id: string;
  orderNumber: string;
  createdAt: string | Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressJson?: string;
  billingAddressJson?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string | null;
  shippingProvider?: string | null;
  trackingNumber?: string | null;
  items: Array<{
    id: string;
    title: string;
    variantTitle?: string | null;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

interface TaxInvoiceModalProps {
  order: InvoiceOrder | null;
  onClose: () => void;
}

export default function TaxInvoiceModal({ order, onClose }: TaxInvoiceModalProps) {
  const [storeSettings, setStoreSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
        }
      })
      .catch((e) => console.error("Could not load store settings for invoice:", e));
  }, []);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const parseAddress = (jsonStr?: string) => {
    if (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        return {
          fullName: parsed.fullName || order.customerName,
          addressLine1: parsed.addressLine1 || "Customer Address Line",
          addressLine2: parsed.addressLine2 || "",
          city: parsed.city || "New Delhi",
          state: parsed.state || "Delhi",
          postalCode: parsed.postalCode || "110001",
          country: parsed.country || "India",
          phone: parsed.phone || order.customerPhone,
        };
      } catch (e) {}
    }
    return {
      fullName: order.customerName,
      addressLine1: "Customer Street Address",
      addressLine2: "",
      city: "New Delhi",
      state: "Delhi",
      postalCode: "110001",
      country: "India",
      phone: order.customerPhone,
    };
  };

  const shippingAddress = parseAddress(order.shippingAddressJson);
  const billingAddress = parseAddress(order.billingAddressJson || order.shippingAddressJson);

  const brandName = storeSettings?.brandName || "AVRO Official Store";
  const logoUrl = storeSettings?.logoUrl || null;
  const companyAddress = storeSettings?.companyAddress || "Technext Cyber Park, Sector 62";
  const companyCity = storeSettings?.companyCity || "Noida";
  const companyState = storeSettings?.companyState || "Uttar Pradesh";
  const companyPostalCode = storeSettings?.companyPostalCode || "201309";
  const companyCountry = storeSettings?.companyCountry || "India";
  const supportEmail = storeSettings?.supportEmail || "support@avrostore.com";
  const supportPhone = storeSettings?.supportPhone || "+91 98765 43210";
  const taxId = storeSettings?.taxId || "07AAACT9021M1Z4";

  // Financial calculations
  const taxableAmount = Math.max(0, order.subtotal - (order.discount || 0));
  // 18% inclusive GST estimation for itemized tax reporting
  const taxRate = 0.18;
  const netBase = taxableAmount / (1 + taxRate);
  const totalTax = taxableAmount - netBase;
  const cgst = totalTax / 2;
  const sgst = totalTax / 2;

  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {/* On-screen Modal View */}
      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto no-print">
        <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
          {/* Header Action Bar */}
          <div className="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  Tax Invoice #{order.orderNumber}
                </h3>
                <p className="text-xs text-slate-300">
                  GST-Compliant Tax Document · Ready for A4 Print & PDF Download
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print A4 Invoice
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content Preview */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex justify-center">
            <div className="bg-white w-full max-w-[800px] border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10 font-sans text-slate-800 text-xs space-y-6">
              {/* Invoice Top Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <img src={logoUrl} alt={brandName} className="h-9 w-auto object-contain" />
                    ) : (
                      <img src="/avro-logo.png" alt="AVRO" className="h-8 w-auto object-contain" />
                    )}
                    <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                      {brandName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tax Invoice / Commercial Bill of Supply
                  </span>
                </div>

                <div className="text-left sm:text-right space-y-0.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-800 uppercase tracking-wider">
                    ORIGINAL FOR RECIPIENT
                  </span>
                  <div className="text-sm font-black text-slate-900 font-mono mt-1">
                    INV-{order.orderNumber}
                  </div>
                  <div className="text-slate-500 text-[11px]">Date: {invoiceDate}</div>
                </div>
              </div>

              {/* Seller & Buyer Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                {/* Sold By */}
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Sold By (Seller):
                  </span>
                  <strong className="text-slate-900 font-extrabold text-xs block">
                    {brandName}
                  </strong>
                  <p className="text-slate-600 leading-tight">
                    {companyAddress}, {companyCity}
                  </p>
                  <p className="text-slate-600 leading-tight">
                    {companyState} - {companyPostalCode}, {companyCountry}
                  </p>
                  <p className="text-slate-600 font-mono text-[11px] pt-1">
                    <strong>GSTIN:</strong> {taxId}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Helpline: {supportPhone} | {supportEmail}
                  </p>
                </div>

                {/* Billed & Shipped To */}
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Billed & Shipped To (Buyer):
                  </span>
                  <strong className="text-slate-900 font-extrabold text-xs block">
                    {shippingAddress.fullName}
                  </strong>
                  <p className="text-slate-600 leading-tight">
                    {shippingAddress.addressLine1}
                    {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}
                  </p>
                  <p className="text-slate-600 leading-tight">
                    {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}
                  </p>
                  <p className="text-slate-600 font-mono text-[11px] pt-1">
                    <strong>Phone:</strong> {shippingAddress.phone}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Email: {order.customerEmail}
                  </p>
                </div>
              </div>

              {/* Order Meta Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Order Reference</span>
                  <strong className="font-mono text-slate-800">{order.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Payment Method</span>
                  <strong className="text-slate-800 uppercase">{order.paymentMethod}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Payment Status</span>
                  <span className={`font-extrabold uppercase ${order.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Place of Supply</span>
                  <strong className="text-slate-800">{shippingAddress.state}</strong>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-700 font-extrabold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-8 text-center">#</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 font-mono text-center">SKU</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Tax Rate</th>
                      <th className="p-3 text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {order.items?.map((it, idx) => {
                      const itemTaxable = it.price / 1.18;
                      return (
                        <tr key={it.id || idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center font-mono text-slate-400">{idx + 1}</td>
                          <td className="p-3">
                            <strong className="text-slate-900 block">{it.title}</strong>
                            {it.variantTitle && (
                              <span className="text-[10px] text-slate-500 block">
                                Variant: {it.variantTitle}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-center text-[10px] text-slate-500">
                            {it.sku || "GEN-SKU"}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">{it.quantity}</td>
                          <td className="p-3 text-right font-mono">
                            ₹{it.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3 text-right text-slate-500 font-mono text-[11px]">
                            18% GST
                          </td>
                          <td className="p-3 text-right font-extrabold text-slate-900 font-mono">
                            ₹{it.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals & Tax Calculation Breakdown */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                {/* Notes and Terms */}
                <div className="max-w-xs space-y-2 text-[10px] text-slate-500">
                  <span className="font-extrabold uppercase text-slate-700 block">Terms & Conditions:</span>
                  <p>1. Goods once sold are covered under our 7-day verified return/replacement policy.</p>
                  <p>2. Applicable taxes have been calculated and accounted for as per GST laws.</p>
                  <p>3. This is a computer generated invoice and requires no physical signature.</p>
                </div>

                {/* Amount Summary */}
                <div className="w-full sm:w-72 space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50/60 font-sans">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Items Subtotal:</span>
                    <strong className="font-mono text-slate-800">
                      ₹{order.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-bold">
                      <span>Discount / Coupon {order.couponCode ? `(${order.couponCode})` : ""}:</span>
                      <span className="font-mono">
                        -₹{order.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Shipping & Handling:</span>
                    <span className="font-mono text-slate-800">
                      {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>

                  {/* GST Split */}
                  <div className="border-t border-slate-200 pt-2 space-y-1 text-[11px] text-slate-500">
                    <div className="flex justify-between">
                      <span>CGST (9.0%):</span>
                      <span className="font-mono">₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SGST (9.0%):</span>
                      <span className="font-mono">₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-[#0A192F]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-blue-600">
                      ₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature / Authorization Stamp */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Merchant Document · AVRO Commerce Core</span>
                </div>

                <div className="text-center sm:text-right">
                  <div className="w-40 border-b border-slate-400 pb-1 mb-1 mx-auto sm:ml-auto">
                    <span className="font-serif italic font-bold text-slate-800 text-xs">
                      {brandName}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Authorized Signatory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print-Only Container (Pure A4 Paper Rendering) */}
      <div id="printable-tax-invoice" className="print-only">
        <div
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm",
            margin: "0 auto",
            backgroundColor: "white",
            color: "#0f172a",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            lineHeight: "1.4",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1.5px solid #0f172a",
              paddingBottom: "5mm",
              marginBottom: "5mm",
            }}
          >
            <div>
              <h1 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 2px 0", textTransform: "uppercase" }}>
                {brandName}
              </h1>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
                Tax Invoice / Retail Bill of Supply
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "9px", fontWeight: "800", background: "#f1f5f9", padding: "2px 6px", textTransform: "uppercase" }}>
                ORIGINAL FOR RECIPIENT
              </span>
              <div style={{ fontSize: "13px", fontWeight: "900", marginTop: "3px", fontFamily: "monospace" }}>
                INV-{order.orderNumber}
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Date: {invoiceDate}</div>
            </div>
          </div>

          {/* Seller / Buyer Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10mm",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "5mm",
              marginBottom: "5mm",
            }}
          >
            <div>
              <span style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", color: "#64748b", display: "block" }}>
                Sold By (Seller):
              </span>
              <strong style={{ display: "block", fontSize: "12px", margin: "2px 0" }}>{brandName}</strong>
              <div>{companyAddress}, {companyCity}</div>
              <div>{companyState} - {companyPostalCode}, {companyCountry}</div>
              <div style={{ marginTop: "2px", fontWeight: "700", fontFamily: "monospace" }}>GSTIN: {taxId}</div>
              <div style={{ color: "#64748b", fontSize: "10px" }}>Phone: {supportPhone} | {supportEmail}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "9px", fontWeight: "800", textTransform: "uppercase", color: "#64748b", display: "block" }}>
                Billed & Shipped To (Buyer):
              </span>
              <strong style={{ display: "block", fontSize: "12px", margin: "2px 0" }}>{shippingAddress.fullName}</strong>
              <div>{shippingAddress.addressLine1} {shippingAddress.addressLine2}</div>
              <div>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</div>
              <div style={{ marginTop: "2px", fontWeight: "700" }}>Phone: {shippingAddress.phone}</div>
              <div style={{ color: "#64748b", fontSize: "10px" }}>Email: {order.customerEmail}</div>
            </div>
          </div>

          {/* Order Info Strip */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "3mm 4mm",
              marginBottom: "5mm",
              fontSize: "10px",
            }}
          >
            <div>Order: <strong>{order.orderNumber}</strong></div>
            <div>Payment: <strong>{order.paymentMethod} ({order.paymentStatus})</strong></div>
            <div>Place of Supply: <strong>{shippingAddress.state}</strong></div>
          </div>

          {/* Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
              marginBottom: "6mm",
            }}
          >
            <thead>
              <tr style={{ background: "#f1f5f9", borderBottom: "1px solid #cbd5e1", textTransform: "uppercase", fontSize: "9px" }}>
                <th style={{ padding: "2.5mm", textAlign: "left", width: "8mm" }}>#</th>
                <th style={{ padding: "2.5mm", textAlign: "left" }}>Item Description</th>
                <th style={{ padding: "2.5mm", textAlign: "center" }}>SKU</th>
                <th style={{ padding: "2.5mm", textAlign: "center" }}>Qty</th>
                <th style={{ padding: "2.5mm", textAlign: "right" }}>Unit Price</th>
                <th style={{ padding: "2.5mm", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it, idx) => (
                <tr key={it.id || idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "2.5mm", textAlign: "center", color: "#64748b" }}>{idx + 1}</td>
                  <td style={{ padding: "2.5mm" }}>
                    <strong>{it.title}</strong>
                    {it.variantTitle && <div style={{ fontSize: "9px", color: "#64748b" }}>{it.variantTitle}</div>}
                  </td>
                  <td style={{ padding: "2.5mm", textAlign: "center", fontFamily: "monospace", fontSize: "9px" }}>{it.sku}</td>
                  <td style={{ padding: "2.5mm", textAlign: "center", fontWeight: "700" }}>{it.quantity}</td>
                  <td style={{ padding: "2.5mm", textAlign: "right", fontFamily: "monospace" }}>
                    ₹{it.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "2.5mm", textAlign: "right", fontWeight: "800", fontFamily: "monospace" }}>
                    ₹{it.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "4mm" }}>
            <div style={{ maxWidth: "80mm", fontSize: "9px", color: "#64748b" }}>
              <strong>Terms:</strong>
              <div>1. All disputes subject to {companyCity} jurisdiction.</div>
              <div>2. Covered by our 7-day easy return and replacement policy.</div>
              <div>3. Computer generated invoice; no physical stamp required.</div>
            </div>

            <div style={{ width: "65mm", border: "1px solid #cbd5e1", padding: "3mm", background: "#f8fafc", fontSize: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5mm" }}>
                <span>Subtotal:</span>
                <strong>₹{order.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
              </div>
              {order.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a", marginBottom: "1.5mm" }}>
                  <span>Discount:</span>
                  <strong>-₹{order.discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5mm" }}>
                <span>Shipping:</span>
                <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}</span>
              </div>
              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "1.5mm", marginTop: "1.5mm", color: "#64748b", fontSize: "9px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>CGST (9%):</span>
                  <span>₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>SGST (9%):</span>
                  <span>₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div style={{ borderTop: "1.5px solid #0f172a", paddingTop: "2mm", marginTop: "2mm", display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "900" }}>
                <span>Grand Total:</span>
                <span>₹{order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Signatory */}
          <div style={{ marginTop: "15mm", display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "9px", color: "#64748b" }}>
            <div>Thank you for shopping with {brandName}!</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ borderBottom: "1px solid #94a3b8", width: "40mm", marginBottom: "1mm", paddingBottom: "2mm", fontStyle: "italic", fontWeight: "bold" }}>
                {brandName}
              </div>
              <span style={{ textTransform: "uppercase", fontSize: "8px" }}>Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for A4 Invoice Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-tax-invoice,
          #printable-tax-invoice * {
            visibility: visible !important;
          }
          #printable-tax-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
        @media screen {
          .print-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
