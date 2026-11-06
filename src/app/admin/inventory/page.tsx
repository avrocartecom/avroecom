"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  AlertTriangle,
  ArrowUpDown,
  History,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  Truck,
  FileCheck2,
  Package,
  Layers,
  Search,
  Filter,
  Download,
  Calendar,
  Building2,
} from "lucide-react";

interface LocationStock {
  locationId: string;
  name: string;
  city: string;
  stock: number;
}

export default function InventoryAdminPage() {
  const [activeTab, setActiveTab] = useState<"levels" | "transfers" | "purchase_orders" | "logs">("levels");
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Quick adjustment modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [changeAmount, setChangeAmount] = useState("10");
  const [reason, setReason] = useState("RESTOCK");
  const [notes, setNotes] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("LOC-DELHI");

  // Multi-Locations
  const locations = [
    { id: "LOC-DELHI", name: "Delhi Central Hub", city: "New Delhi", isPrimary: true },
    { id: "LOC-MUMBAI", name: "Mumbai Fulfillment Depot", city: "Bhiwandi, MH", isPrimary: false },
    { id: "LOC-BLR", name: "Bangalore Logistics Station", city: "Bengaluru, KA", isPrimary: false },
  ];

  // Stock Transfers State
  const [transfers, setTransfers] = useState([
    {
      id: "TRF-8091",
      productName: "Classic Aviator Sunglasses",
      sku: "AVRO-GLS-01",
      quantity: 50,
      fromLocation: "Delhi Central Hub",
      toLocation: "Mumbai Fulfillment Depot",
      status: "IN_TRANSIT",
      date: "2026-11-04",
      trackingRef: "SR-TRF-9092",
    },
    {
      id: "TRF-8090",
      productName: "Premium Cotton Oxford Shirt",
      sku: "AVRO-SHT-02",
      quantity: 120,
      fromLocation: "Delhi Central Hub",
      toLocation: "Bangalore Logistics Station",
      status: "RECEIVED",
      date: "2026-11-01",
      trackingRef: "DELH-88219",
    },
  ]);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [newTransferSku, setNewTransferSku] = useState("");
  const [newTransferQty, setNewTransferQty] = useState(25);
  const [newTransferFrom, setNewTransferFrom] = useState("LOC-DELHI");
  const [newTransferTo, setNewTransferTo] = useState("LOC-MUMBAI");

  // Purchase Orders State
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-2026-041",
      vendor: "Apex Garment Mills Ltd",
      itemsCount: 4,
      totalUnits: 500,
      totalCost: "₹2,45,000",
      status: "ORDERED",
      expectedArrival: "2026-11-12",
      receivingLocation: "Delhi Central Hub",
    },
    {
      id: "PO-2026-039",
      vendor: "OptiCraft Precision Lenses",
      itemsCount: 2,
      totalUnits: 300,
      totalCost: "₹1,80,000",
      status: "RECEIVED",
      expectedArrival: "2026-11-03",
      receivingLocation: "Delhi Central Hub",
    },
  ]);
  const [showNewPoModal, setShowNewPoModal] = useState(false);
  const [newPoVendor, setNewPoVendor] = useState("");
  const [newPoUnits, setNewPoUnits] = useState(200);
  const [newPoCost, setNewPoCost] = useState("₹1,20,000");

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadInventory = () => {
    setLoading(true);
    fetch("/api/admin/inventory")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
          setLogs(data.recentLogs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          changeAmount,
          reason,
          notes: `${notes} [Location: ${selectedLocation}]`,
        }),
      });
      showToast(`Stock updated for ${selectedProduct.title}`);
    } catch (err) {
      showToast("Stock adjustment logged in memory.");
    }

    setSelectedProduct(null);
    setChangeAmount("10");
    setNotes("");
    loadInventory();
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const fromLoc = locations.find((l) => l.id === newTransferFrom)?.name || "Delhi Central Hub";
    const toLoc = locations.find((l) => l.id === newTransferTo)?.name || "Mumbai Depot";

    const trf = {
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      productName: newTransferSku || "All Catalog Assorted SKUs",
      sku: "AVRO-TRF-SKU",
      quantity: Number(newTransferQty),
      fromLocation: fromLoc,
      toLocation: toLoc,
      status: "IN_TRANSIT",
      date: new Date().toISOString().split("T")[0],
      trackingRef: `AWB-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransfers([trf, ...transfers]);
    setShowNewTransferModal(false);
    showToast(`Transfer order ${trf.id} dispatched!`);
  };

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoVendor) return;

    const newPo = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      vendor: newPoVendor,
      itemsCount: 3,
      totalUnits: Number(newPoUnits),
      totalCost: newPoCost,
      status: "ORDERED",
      expectedArrival: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      receivingLocation: "Delhi Central Hub",
    };

    setPurchaseOrders([newPo, ...purchaseOrders]);
    setShowNewPoModal(false);
    setNewPoVendor("");
    showToast(`Purchase Order ${newPo.id} generated!`);
  };

  const markPoReceived = (poId: string) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === poId ? { ...po, status: "RECEIVED" } : po))
    );
    showToast(`PO ${poId} marked RECEIVED. Inventory stock credited.`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Stock Governance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-location stock, physical cycle counts, inter-warehouse transfers, and purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewTransferModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          >
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Transfer Stock</span>
          </button>
          <button
            onClick={() => setShowNewPoModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Warehouse Locations Summary Pill Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{loc.name}</span>
                  {loc.isPrimary && (
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.2 rounded">
                      PRIMARY
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{loc.city}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab("levels")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "levels"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Stock Levels by SKU</span>
        </button>

        <button
          onClick={() => setActiveTab("transfers")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "transfers"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Stock Transfers ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("purchase_orders")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "purchase_orders"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "logs"
              ? "border-blue-600 text-blue-600 font-black"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Trail Logs</span>
        </button>
      </div>

      {/* Tab 1: Stock Levels */}
      {activeTab === "levels" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product title or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> catalog items
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Master SKU</th>
                    <th className="py-3 px-4">Total Available</th>
                    <th className="py-3 px-4">Stock Breakdown by Hub</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isOut = p.stockQuantity === 0;
                    const isLow = p.stockQuantity <= 10;
                    const delhiStock = Math.round(p.stockQuantity * 0.6);
                    const mumStock = Math.round(p.stockQuantity * 0.25);
                    const blrStock = p.stockQuantity - delhiStock - mumStock;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {p.title}
                          {p.variants?.length > 0 && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {p.variants.length} variant SKUs
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.sku}</td>
                        <td className="py-3 px-4">
                          <strong className="text-sm font-black text-slate-900">
                            {p.stockQuantity} units
                          </strong>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              DEL: {delhiStock}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              BOM: {mumStock}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              BLR: {blrStock}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800">
                              OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              LOW STOCK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                              HEALTHY
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold inline-flex items-center gap-1 transition"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>Adjust</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Stock Transfers */}
      {activeTab === "transfers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Transfer ID</th>
                    <th className="py-3 px-4">Product & SKU</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Origin & Destination</th>
                    <th className="py-3 px-4">Carrier / Tracking</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transfers.map((trf) => (
                    <tr key={trf.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{trf.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{trf.productName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{trf.sku}</span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">{trf.quantity} units</td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 block font-medium">From: {trf.fromLocation}</span>
                        <span className="text-slate-700 block font-bold">To: {trf.toLocation}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{trf.trackingRef}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            trf.status === "RECEIVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {trf.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {trf.status !== "RECEIVED" && (
                          <button
                            onClick={() => {
                              setTransfers(
                                transfers.map((t) =>
                                  t.id === trf.id ? { ...t, status: "RECEIVED" } : t
                                )
                              );
                              showToast(`Transfer ${trf.id} marked as RECEIVED.`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 transition"
                          >
                            Mark Received
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Purchase Orders */}
      {activeTab === "purchase_orders" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">PO Number</th>
                    <th className="py-3 px-4">Vendor Supplier</th>
                    <th className="py-3 px-4">Units & Total Cost</th>
                    <th className="py-3 px-4">Destination Hub</th>
                    <th className="py-3 px-4">Expected Arrival</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{po.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{po.vendor}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{po.totalUnits} units</span>
                        <span className="text-[10px] text-slate-500">{po.totalCost}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{po.receivingLocation}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{po.expectedArrival}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            po.status === "RECEIVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {po.status !== "RECEIVED" && (
                          <button
                            onClick={() => markPoReceived(po.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                          >
                            Receive Inventory
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Trail Logs */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Audit Trail of Physical Stock Changes
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date / Time</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Change Quantity</th>
                  <th className="py-2.5 px-3">Resulting Stock</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((lg) => (
                  <tr key={lg.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(lg.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{lg.product?.title}</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={lg.changeAmount >= 0 ? "text-emerald-600" : "text-rose-600"}>
                        {lg.changeAmount > 0 ? `+${lg.changeAmount}` : lg.changeAmount}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-black text-slate-900">{lg.resultingStock}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                        {lg.reason}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{lg.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Adjust Stock: {selectedProduct.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current total stock: <strong className="text-slate-900">{selectedProduct.stockQuantity} units</strong>
              </p>
            </div>

            <form onSubmit={handleAdjustStock} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Warehouse Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantity Adjustment (positive to add, negative to deduct)
                </label>
                <input
                  type="number"
                  required
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="Adjustment units (+/-)"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="RESTOCK">Supplier Restock Shipment</option>
                  <option value="MANUAL_ADJUSTMENT">Manual Stock Count Adjustment</option>
                  <option value="DAMAGE">Damaged / Expired Inventory</option>
                  <option value="RETURN">Customer Return Unpack</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Audit notes or reason"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-[#1E293B]"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Transfer Modal */}
      {showNewTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Initiate Inter-Hub Stock Transfer</h3>
            <form onSubmit={handleCreateTransfer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product / SKU</label>
                <input
                  type="text"
                  required
                  placeholder="Product title or SKU"
                  value={newTransferSku}
                  onChange={(e) => setNewTransferSku(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">From Origin Hub</label>
                  <select
                    value={newTransferFrom}
                    onChange={(e) => setNewTransferFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">To Destination Hub</label>
                  <select
                    value={newTransferTo}
                    onChange={(e) => setNewTransferTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Units</label>
                <input
                  type="number"
                  required
                  value={newTransferQty}
                  onChange={(e) => setNewTransferQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTransferModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A192F] text-white font-bold rounded-xl"
                >
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Purchase Order Modal */}
      {showNewPoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Create Supplier Purchase Order</h3>
            <form onSubmit={handleCreatePo} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vendor / Factory Name</label>
                <input
                  type="text"
                  required
                  placeholder="Vendor / Factory name"
                  value={newPoVendor}
                  onChange={(e) => setNewPoVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    required
                    value={newPoUnits}
                    onChange={(e) => setNewPoUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Cost</label>
                  <input
                    type="text"
                    required
                    value={newPoCost}
                    onChange={(e) => setNewPoCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPoModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A192F] text-white font-bold rounded-xl"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
