"use client";

import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, ArrowUpDown, History, Plus, Minus, CheckCircle2 } from "lucide-react";

export default function InventoryAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick adjustment modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [changeAmount, setChangeAmount] = useState("10");
  const [reason, setReason] = useState("RESTOCK");
  const [notes, setNotes] = useState("");

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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        changeAmount,
        reason,
        notes,
      }),
    });

    setSelectedProduct(null);
    setChangeAmount("10");
    setNotes("");
    loadInventory();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0A192F]">Inventory & Stock Control</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time stock audits, replenishment adjustments, low-stock thresholds, and inventory change logs.
        </p>
      </div>

      {/* Products Stock Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stock Levels by SKU
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Master SKU</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Inventory Status</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const isOut = p.stockQuantity === 0;
                const isLow = p.stockQuantity <= 10;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{p.title}</span>
                      {p.variants?.length > 0 && (
                        <span className="text-[10px] text-slate-400">
                          Includes {p.variants.length} variant(s)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.sku}</td>
                    <td className="py-3 px-4">
                      <strong className="text-sm font-extrabold text-slate-900">
                        {p.stockQuantity} units
                      </strong>
                    </td>
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                          OUT OF STOCK
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          HEALTHY
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-[#0A192F] flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          Audit Trail of Stock Changes
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-semibold uppercase">
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
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(lg.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">{lg.product?.title}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={lg.changeAmount >= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {lg.changeAmount > 0 ? `+${lg.changeAmount}` : lg.changeAmount}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-extrabold text-slate-900">{lg.resultingStock}</td>
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

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-[#0A192F]">
              Adjust Stock for {selectedProduct.title}
            </h3>
            <p className="text-xs text-slate-500">
              Current stock: <strong>{selectedProduct.stockQuantity} units</strong>
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantity Adjustment (positive to add, negative to deduct)
                </label>
                <input
                  type="number"
                  required
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="e.g. 20 or -5"
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded-lg bg-white focus:outline-none"
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
                  placeholder="e.g. Received PO-8899 from factory"
                  className="w-full px-3 py-1.5 border rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0A192F] text-white font-bold rounded-lg"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
