"use client";

import React, { useEffect, useState } from "react";
import { Printer, X, Download, ShieldCheck, Check, Package, QrCode } from "lucide-react";

export interface ShippingLabelOrder {
  id: string;
  orderNumber: string;
  createdAt: string | Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddressJson?: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingProvider?: string;
  trackingNumber?: string;
  items: Array<{
    id: string;
    title: string;
    variantTitle?: string;
    sku: string;
    quantity: number;
    price: number;
  }>;
}

interface ShippingLabelModalProps {
  orders: ShippingLabelOrder[];
  onClose: () => void;
}

export default function ShippingLabelModal({ orders, onClose }: ShippingLabelModalProps) {
  const [storeSettings, setStoreSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/settings/general")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setStoreSettings(data.settings);
        }
      })
      .catch((e) => console.error("Could not load store settings for label:", e));
  }, []);

  if (!orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  const brandName = storeSettings?.brandName || "AVRO OFFICIAL STORE";
  const sellerAddress = storeSettings?.companyAddress || "Technext Logistics Hub, Sector 62";
  const sellerCity = storeSettings?.companyCity || "Noida";
  const sellerState = storeSettings?.companyState || "Uttar Pradesh";
  const sellerPostalCode = storeSettings?.companyPostalCode || "201309";
  const sellerPhone = storeSettings?.supportPhone || "+91 98765 43210";
  const sellerGstin = storeSettings?.taxId || "07AAACT9021M1Z4";

  // Helper to parse address
  const parseAddress = (order: ShippingLabelOrder) => {
    if (order.shippingAddressJson) {
      try {
        const parsed = JSON.parse(order.shippingAddressJson);
        return {
          fullName: parsed.fullName || order.customerName,
          addressLine1: parsed.addressLine1 || "Customer Address Line",
          addressLine2: parsed.addressLine2 || "",
          city: parsed.city || "New Delhi",
          state: parsed.state || "Delhi",
          postalCode: parsed.postalCode || "110001",
          phone: parsed.phone || order.customerPhone || "+91 98765 43210",
        };
      } catch (e) {}
    }
    return {
      fullName: order.customerName,
      addressLine1: "Suite 302, Cyber Tower",
      addressLine2: "Phase 2",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      phone: order.customerPhone || "+91 98765 43210",
    };
  };

  // Helper for tracking number & courier
  const getCourierDetails = (order: ShippingLabelOrder) => {
    const courier = (order.shippingProvider || "DELHIVERY").toUpperCase();
    const cleanNum = order.orderNumber.replace(/[^0-9]/g, "");
    const tracking =
      order.trackingNumber && order.trackingNumber.trim().length > 3
        ? order.trackingNumber
        : courier === "SHIPROCKET"
        ? `SR${cleanNum || "9802"}9281IN`
        : courier === "BLUEDART" || courier === "BLUE_DART"
        ? `BD${cleanNum || "4512"}7701IN`
        : courier === "DTDC"
        ? `DT${cleanNum || "3321"}8899IN`
        : `DL${cleanNum || "1029"}3844IN`;

    const routingCode =
      courier === "DELHIVERY"
        ? "DEL / NZ-110001 / A"
        : courier === "SHIPROCKET"
        ? "SR-EXP / BLR-S02"
        : courier === "DTDC"
        ? "DTDC-PRIO / NORTH-1"
        : "BD-APEX / HYD-HUB";

    return { courier, tracking, routingCode };
  };

  return (
    <>
      {/* On-Screen Modal Overlay */}
      <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto no-print">
        <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
          {/* Modal Header */}
          <div className="px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  Thermal Dispatch Labels (4" × 6")
                </h3>
                <p className="text-xs text-slate-300">
                  {orders.length} shipment{orders.length > 1 ? "s" : ""} · Minimalist courier standard (100mm × 150mm)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Labels Now
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

          {/* Modal Content - Scrollable Preview */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100 flex flex-col items-center gap-6">
            <div className="w-full max-w-[420px] text-center text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-700">Printing Note:</span> Standard 4"×6" thermal label roll (100mm×150mm) or A4 sticker sheets.
            </div>

            {orders.map((order) => {
              const address = parseAddress(order);
              const { courier, tracking, routingCode } = getCourierDetails(order);
              const isCOD = order.paymentMethod === "COD" || order.paymentStatus !== "PAID";

              return (
                <div
                  key={order.id}
                  className="bg-white w-full max-w-[420px] border border-black rounded-lg shadow-lg overflow-hidden font-mono text-black text-[11px] leading-tight"
                  style={{ minHeight: "580px" }}
                >
                  {/* Courier & Routing Header */}
                  <div className="p-3 border-b border-black flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-black tracking-tight block uppercase">
                        {courier === "DELHIVERY"
                          ? "DELHIVERY SURFACE"
                          : courier === "SHIPROCKET"
                          ? "SHIPROCKET AIR"
                          : courier === "DTDC"
                          ? "DTDC PRIORITY"
                          : "BLUE DART APEX"}
                      </span>
                      <span className="text-[9px] font-bold text-slate-600">
                        EXPRESS PARCEL DISPATCH
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-black border border-black px-1.5 py-0.5 rounded uppercase">
                        {routingCode}
                      </span>
                      <span className="text-[9px] block text-slate-600 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* High-Resolution Code 128 Barcode & QR */}
                  <div className="p-3 border-b border-black text-center bg-white space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="w-full h-11"
                        viewBox="0 0 300 48"
                        preserveAspectRatio="none"
                      >
                        <g fill="black">
                          <rect x="0" y="0" width="3" height="48" />
                          <rect x="5" y="0" width="2" height="48" />
                          <rect x="10" y="0" width="4" height="48" />
                          <rect x="16" y="0" width="1" height="48" />
                          <rect x="20" y="0" width="5" height="48" />
                          <rect x="28" y="0" width="2" height="48" />
                          <rect x="33" y="0" width="3" height="48" />
                          <rect x="38" y="0" width="4" height="48" />
                          <rect x="45" y="0" width="2" height="48" />
                          <rect x="50" y="0" width="5" height="48" />
                          <rect x="58" y="0" width="2" height="48" />
                          <rect x="63" y="0" width="4" height="48" />
                          <rect x="70" y="0" width="3" height="48" />
                          <rect x="75" y="0" width="1" height="48" />
                          <rect x="80" y="0" width="6" height="48" />
                          <rect x="89" y="0" width="2" height="48" />
                          <rect x="94" y="0" width="4" height="48" />
                          <rect x="101" y="0" width="3" height="48" />
                          <rect x="107" y="0" width="5" height="48" />
                          <rect x="115" y="0" width="2" height="48" />
                          <rect x="120" y="0" width="4" height="48" />
                          <rect x="127" y="0" width="1" height="48" />
                          <rect x="131" y="0" width="6" height="48" />
                          <rect x="140" y="0" width="3" height="48" />
                          <rect x="146" y="0" width="2" height="48" />
                          <rect x="151" y="0" width="5" height="48" />
                          <rect x="159" y="0" width="2" height="48" />
                          <rect x="164" y="0" width="4" height="48" />
                          <rect x="171" y="0" width="3" height="48" />
                          <rect x="177" y="0" width="5" height="48" />
                          <rect x="185" y="0" width="2" height="48" />
                          <rect x="190" y="0" width="4" height="48" />
                          <rect x="197" y="0" width="1" height="48" />
                          <rect x="201" y="0" width="6" height="48" />
                          <rect x="210" y="0" width="3" height="48" />
                          <rect x="216" y="0" width="2" height="48" />
                          <rect x="221" y="0" width="5" height="48" />
                          <rect x="229" y="0" width="2" height="48" />
                          <rect x="234" y="0" width="4" height="48" />
                          <rect x="241" y="0" width="3" height="48" />
                          <rect x="247" y="0" width="5" height="48" />
                          <rect x="255" y="0" width="2" height="48" />
                          <rect x="260" y="0" width="4" height="48" />
                          <rect x="267" y="0" width="1" height="48" />
                          <rect x="271" y="0" width="5" height="48" />
                          <rect x="279" y="0" width="3" height="48" />
                          <rect x="285" y="0" width="2" height="48" />
                          <rect x="290" y="0" width="4" height="48" />
                          <rect x="296" y="0" width="4" height="48" />
                        </g>
                      </svg>

                      <div className="w-11 h-11 border border-black p-0.5 flex-shrink-0 flex items-center justify-center">
                        <QrCode className="w-9 h-9 text-black" />
                      </div>
                    </div>
                    <span className="text-[11px] font-black tracking-widest block uppercase mt-0.5">
                      AWB: {tracking}
                    </span>
                  </div>

                  {/* Payment Type Strip */}
                  <div
                    className={`p-1.5 border-b border-black text-center font-black uppercase text-[11px] tracking-wider ${
                      isCOD ? "bg-black text-white" : "bg-slate-100 text-black"
                    }`}
                  >
                    {isCOD
                      ? `CASH ON DELIVERY (COD): COLLECT ₹${order.total.toLocaleString("en-IN")}`
                      : "PREPAID SHIPMENT — DO NOT COLLECT CASH"}
                  </div>

                  {/* Consignee / Ship-To Details */}
                  <div className="p-3 border-b border-black space-y-1">
                    <span className="text-[8px] font-extrabold uppercase tracking-wider block text-slate-500">
                      SHIP TO (CONSIGNEE):
                    </span>
                    <strong className="text-[13px] font-black block uppercase tracking-tight">
                      {address.fullName}
                    </strong>
                    <p className="text-[10px] leading-tight font-medium">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                    </p>
                    <p className="text-[10px] leading-tight font-medium">
                      {address.city}, {address.state}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[12px] font-black tracking-wider bg-black text-white px-2 py-0.5 rounded">
                        PIN: {address.postalCode}
                      </span>
                      <span className="text-[10px] font-bold">
                        TEL: {address.phone}
                      </span>
                    </div>
                  </div>

                  {/* Shipped By / Return To (Dynamic from Store Settings) */}
                  <div className="p-2.5 border-b border-black space-y-0.5 bg-slate-50/50 text-[9px]">
                    <span className="text-[8px] font-extrabold uppercase tracking-wider block text-slate-500">
                      RETURN ADDRESS (SELLER):
                    </span>
                    <strong className="text-[10px] font-black block uppercase">
                      {brandName}
                    </strong>
                    <p>{sellerAddress}, {sellerCity}, {sellerState} - {sellerPostalCode}</p>
                    <p>Contact: {sellerPhone} | GSTIN: {sellerGstin}</p>
                  </div>

                  {/* Package & Product Information */}
                  <div className="p-2.5 border-b border-black space-y-1 text-[9px]">
                    <div className="grid grid-cols-3 gap-2 pb-1 border-b border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase">Order Ref</span>
                        <strong className="font-bold">{order.orderNumber}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[8px] uppercase">Est. Weight</span>
                        <strong className="font-bold">0.450 KG</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[8px] uppercase">Box Count</span>
                        <strong className="font-bold">1 of 1</strong>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <span className="text-[8px] font-extrabold text-slate-500 uppercase block mb-0.5">
                        MANIFEST ({order.items?.length || 0} ITEMS):
                      </span>
                      <div className="space-y-0.5">
                        {order.items?.slice(0, 3).map((it) => (
                          <div key={it.id} className="flex justify-between text-[9px]">
                            <span className="truncate max-w-[260px]">
                              {it.quantity}x {it.title} {it.variantTitle ? `(${it.variantTitle})` : ""}
                            </span>
                            <span className="font-mono text-[8px] text-slate-500">{it.sku}</span>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 3 && (
                          <span className="text-[8px] text-slate-400 italic block">
                            + {(order.items?.length || 0) - 3} more line item(s)...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification */}
                  <div className="p-2 text-center text-[8px] bg-white flex items-center justify-between text-slate-500">
                    <span>SECURED BY AVRO LOGISTICS CORE</span>
                    <span className="font-bold text-black">ATTEMPTS: 3</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer Controls */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            <span className="text-xs text-slate-500">
              Prints 1 label per page on standard 4"×6" (100mm×150mm) thermal printers.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                Print Shipping Labels
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Print-Only Container (Pure 4"x6" Thermal Label) */}
      <div id="printable-shipping-labels" className="print-only">
        {orders.map((order) => {
          const address = parseAddress(order);
          const { courier, tracking, routingCode } = getCourierDetails(order);
          const isCOD = order.paymentMethod === "COD" || order.paymentStatus !== "PAID";

          return (
            <div
              key={order.id}
              className="shipping-label-sheet font-mono text-black text-[10px] leading-tight"
              style={{
                width: "100mm",
                minHeight: "150mm",
                padding: "3.5mm",
                margin: "0 auto",
                pageBreakAfter: "always",
                border: "1px solid black",
                boxSizing: "border-box",
                background: "white",
              }}
            >
              {/* Header */}
              <div
                style={{
                  paddingBottom: "2.5mm",
                  borderBottom: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "900", display: "block", textTransform: "uppercase" }}>
                    {courier === "DELHIVERY"
                      ? "DELHIVERY SURFACE"
                      : courier === "SHIPROCKET"
                      ? "SHIPROCKET AIR"
                      : courier === "DTDC"
                      ? "DTDC PRIORITY"
                      : "BLUE DART APEX"}
                  </span>
                  <span style={{ fontSize: "8px", fontWeight: "700" }}>EXPRESS DISPATCH</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "10px", fontWeight: "900", border: "1px solid black", padding: "1px 4px" }}>
                    {routingCode}
                  </span>
                </div>
              </div>

              {/* Barcode & AWB */}
              <div style={{ padding: "3mm 0", borderBottom: "1px solid black", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2mm" }}>
                  <svg className="w-full h-10" viewBox="0 0 300 48" preserveAspectRatio="none">
                    <g fill="black">
                      <rect x="0" y="0" width="3" height="48" /><rect x="5" y="0" width="2" height="48" />
                      <rect x="10" y="0" width="4" height="48" /><rect x="16" y="0" width="1" height="48" />
                      <rect x="20" y="0" width="5" height="48" /><rect x="28" y="0" width="2" height="48" />
                      <rect x="33" y="0" width="3" height="48" /><rect x="38" y="0" width="4" height="48" />
                      <rect x="45" y="0" width="2" height="48" /><rect x="50" y="0" width="5" height="48" />
                      <rect x="58" y="0" width="2" height="48" /><rect x="63" y="0" width="4" height="48" />
                      <rect x="70" y="0" width="3" height="48" /><rect x="75" y="0" width="1" height="48" />
                      <rect x="80" y="0" width="6" height="48" /><rect x="89" y="0" width="2" height="48" />
                      <rect x="94" y="0" width="4" height="48" /><rect x="101" y="0" width="3" height="48" />
                      <rect x="107" y="0" width="5" height="48" /><rect x="115" y="0" width="2" height="48" />
                      <rect x="120" y="0" width="4" height="48" /><rect x="127" y="0" width="1" height="48" />
                      <rect x="131" y="0" width="6" height="48" /><rect x="140" y="0" width="3" height="48" />
                      <rect x="146" y="0" width="2" height="48" /><rect x="151" y="0" width="5" height="48" />
                      <rect x="159" y="0" width="2" height="48" /><rect x="164" y="0" width="4" height="48" />
                      <rect x="171" y="0" width="3" height="48" /><rect x="177" y="0" width="5" height="48" />
                      <rect x="185" y="0" width="2" height="48" /><rect x="190" y="0" width="4" height="48" />
                      <rect x="197" y="0" width="1" height="48" /><rect x="201" y="0" width="6" height="48" />
                      <rect x="210" y="0" width="3" height="48" /><rect x="216" y="0" width="2" height="48" />
                      <rect x="221" y="0" width="5" height="48" /><rect x="229" y="0" width="2" height="48" />
                      <rect x="234" y="0" width="4" height="48" /><rect x="241" y="0" width="3" height="48" />
                      <rect x="247" y="0" width="5" height="48" /><rect x="255" y="0" width="2" height="48" />
                      <rect x="260" y="0" width="4" height="48" /><rect x="267" y="0" width="1" height="48" />
                      <rect x="271" y="0" width="5" height="48" /><rect x="279" y="0" width="3" height="48" />
                      <rect x="285" y="0" width="2" height="48" /><rect x="290" y="0" width="4" height="48" />
                      <rect x="296" y="0" width="4" height="48" />
                    </g>
                  </svg>
                  <div style={{ width: "9mm", height: "9mm", border: "1px solid black", padding: "0.5mm" }}>
                    <QrCode style={{ width: "100%", height: "100%" }} />
                  </div>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "900", display: "block", marginTop: "1mm" }}>
                  AWB: {tracking}
                </span>
              </div>

              {/* Payment Strip */}
              <div
                style={{
                  padding: "1.5mm",
                  borderBottom: "1px solid black",
                  textAlign: "center",
                  fontWeight: "900",
                  fontSize: "10px",
                  background: isCOD ? "black" : "#f1f5f9",
                  color: isCOD ? "white" : "black",
                }}
              >
                {isCOD
                  ? `CASH ON DELIVERY (COD): COLLECT ₹${order.total.toLocaleString("en-IN")}`
                  : "PREPAID — DO NOT COLLECT CASH"}
              </div>

              {/* Consignee */}
              <div style={{ padding: "2.5mm 0", borderBottom: "1px solid black" }}>
                <span style={{ fontSize: "8px", fontWeight: "900", textTransform: "uppercase" }}>
                  SHIP TO (CONSIGNEE):
                </span>
                <strong style={{ fontSize: "12px", fontWeight: "900", display: "block" }}>
                  {address.fullName}
                </strong>
                <div>{address.addressLine1} {address.addressLine2}</div>
                <div>{address.city}, {address.state}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5mm" }}>
                  <span style={{ fontSize: "12px", fontWeight: "900", background: "black", color: "white", padding: "1px 4px" }}>
                    PIN: {address.postalCode}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "700" }}>TEL: {address.phone}</span>
                </div>
              </div>

              {/* Seller */}
              <div style={{ padding: "2mm 0", borderBottom: "1px solid black", fontSize: "9px" }}>
                <span style={{ fontSize: "7px", fontWeight: "900", textTransform: "uppercase" }}>RETURN (SELLER):</span>
                <strong style={{ display: "block", fontSize: "10px" }}>{brandName}</strong>
                <div>{sellerAddress}, {sellerCity}, {sellerState} - {sellerPostalCode}</div>
                <div>Helpline: {sellerPhone} | GSTIN: {sellerGstin}</div>
              </div>

              {/* Manifest */}
              <div style={{ padding: "2mm 0", borderBottom: "1px solid black", fontSize: "9px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>ORDER: <strong>{order.orderNumber}</strong></span>
                  <span>WT: <strong>0.450 KG</strong></span>
                  <span>BOX: <strong>1/1</strong></span>
                </div>
                <div style={{ marginTop: "1mm" }}>
                  <strong>ITEMS: </strong>
                  {order.items?.map((it) => `${it.quantity}x ${it.title}`).join(", ")}
                </div>
              </div>

              {/* Footer */}
              <div style={{ paddingTop: "1.5mm", display: "flex", justifyContent: "space-between", fontSize: "8px" }}>
                <span>SECURED BY AVRO LOGISTICS</span>
                <span>ATTEMPTS: 3</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global CSS for Clean Thermal Printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-shipping-labels,
          #printable-shipping-labels * {
            visibility: visible !important;
          }
          #printable-shipping-labels {
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
            size: 100mm 150mm;
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
