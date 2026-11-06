"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ShoppingBag,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  FileText,
  Tag,
  Package,
  Layers,
  ArrowRight,
  TrendingUp,
  CreditCard,
  User,
  CheckSquare,
  Square,
  Send,
  SlidersHorizontal,
  Plus,
  Download,
  Trash2,
  Edit,
  MapPin,
  AlertCircle,
} from "lucide-react";
import ShippingLabelModal, { ShippingLabelOrder } from "@/components/admin/shipping-label-modal";
import TaxInvoiceModal from "@/components/admin/tax-invoice-modal";

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Available catalog products for picking in order creation/editing
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<any | null>(null);
  const [shippingLabelsToPrint, setShippingLabelsToPrint] = useState<ShippingLabelOrder[] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Multi-select for batch actions
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Order Creation State
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newAddressLine, setNewAddressLine] = useState("");
  const [newCity, setNewCity] = useState("New Delhi");
  const [newState, setNewState] = useState("Delhi");
  const [newPincode, setNewPincode] = useState("110001");
  const [newPaymentMethod, setNewPaymentMethod] = useState("COD");
  const [newPaymentStatus, setNewPaymentStatus] = useState("PENDING");
  const [newOrderStatus, setNewOrderStatus] = useState("CONFIRMED");
  const [newCourier, setNewCourier] = useState("DELHIVERY");
  const [newTracking, setNewTracking] = useState("");
  const [newCustomerNotes, setNewCustomerNotes] = useState("");
  const [newAdminNotes, setNewAdminNotes] = useState("");
  const [newDiscount, setNewDiscount] = useState<number>(0);
  const [newShippingFee, setNewShippingFee] = useState<number>(0);
  const [newItems, setNewItems] = useState<
    Array<{
      productId: string;
      variantId?: string;
      title: string;
      variantTitle?: string;
      sku: string;
      price: number;
      quantity: number;
    }>
  >([]);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Order Editing State (for full edit modal)
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editCustomerEmail, setEditCustomerEmail] = useState("");
  const [editCustomerPhone, setEditCustomerPhone] = useState("");
  const [editAddressLine, setEditAddressLine] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editPaymentMethod, setEditPaymentMethod] = useState("");
  const [editCourier, setEditCourier] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editShippingFee, setEditShippingFee] = useState<number>(0);
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editCustomerNotes, setEditCustomerNotes] = useState("");
  const [editItems, setEditItems] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${statusFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
          if (selectedOrder) {
            const updated = data.orders.find((o: any) => o.id === selectedOrder.id);
            if (updated) setSelectedOrder(updated);
          }
        }
      })
      .catch((err) => console.error("Error loading orders:", err))
      .finally(() => setLoading(false));
  };

  const loadProducts = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setAvailableProducts(data.products);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, [statusFilter]);

  // Filtered orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }, [orders, searchQuery]);

  // Order summary calculations
  const totalGross = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const pendingCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "PENDING" || o.orderStatus === "CONFIRMED").length,
    [orders]
  );
  const shippedCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "SHIPPED" || o.orderStatus === "PROCESSING" || o.orderStatus === "PACKED").length,
    [orders]
  );
  const deliveredCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "DELIVERED").length,
    [orders]
  );

  // Quick detail drawer opener
  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    populateEditState(order);
  };

  // Populate edit fields from an order
  const populateEditState = (order: any) => {
    setEditCustomerName(order.customerName || "");
    setEditCustomerEmail(order.customerEmail || "");
    setEditCustomerPhone(order.customerPhone || "");
    setEditStatus(order.orderStatus);
    setEditPaymentStatus(order.paymentStatus);
    setEditPaymentMethod(order.paymentMethod || "COD");
    setEditCourier(order.shippingProvider || "DELHIVERY");
    setEditTracking(order.trackingNumber || "");
    setEditDiscount(order.discount || 0);
    setEditShippingFee(order.shippingFee || 0);
    setEditAdminNotes(order.adminNotes || "");
    setEditCustomerNotes(order.customerNotes || "");
    setEditItems(order.items ? JSON.parse(JSON.stringify(order.items)) : []);

    let addr = { addressLine1: "", city: "", state: "", postalCode: "" };
    if (order.shippingAddressJson) {
      try {
        addr = JSON.parse(order.shippingAddressJson);
      } catch {}
    }
    setEditAddressLine(addr.addressLine1 || "");
    setEditCity(addr.city || "");
    setEditState(addr.state || "");
    setEditPincode(addr.postalCode || "");
  };

  const handleOpenEditModal = (order: any) => {
    populateEditState(order);
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Open Create Order Modal
  const handleOpenCreateModal = () => {
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewAddressLine("");
    setNewCity("New Delhi");
    setNewState("Delhi");
    setNewPincode("110001");
    setNewPaymentMethod("COD");
    setNewPaymentStatus("PENDING");
    setNewOrderStatus("CONFIRMED");
    setNewCourier("DELHIVERY");
    setNewTracking("");
    setNewCustomerNotes("");
    setNewAdminNotes("");
    setNewDiscount(0);
    setNewShippingFee(0);

    // Initial placeholder item
    if (availableProducts.length > 0) {
      const p = availableProducts[0];
      setNewItems([
        {
          productId: p.id,
          title: p.title,
          sku: p.sku || `SKU-${p.id.slice(-4)}`,
          price: p.price,
          quantity: 1,
        },
      ]);
    } else {
      setNewItems([
        {
          productId: "custom",
          title: "Custom Item",
          sku: "CUSTOM-01",
          price: 999,
          quantity: 1,
        },
      ]);
    }

    setShowCreateModal(true);
  };

  // Add Item to Create Order
  const handleAddItemToCreate = () => {
    if (availableProducts.length > 0) {
      const p = availableProducts[0];
      setNewItems((prev) => [
        ...prev,
        {
          productId: p.id,
          title: p.title,
          sku: p.sku || `SKU-${Date.now().toString().slice(-4)}`,
          price: p.price,
          quantity: 1,
        },
      ]);
    } else {
      setNewItems((prev) => [
        ...prev,
        {
          productId: "custom",
          title: "Additional Item",
          sku: `SKU-${Date.now().toString().slice(-4)}`,
          price: 499,
          quantity: 1,
        },
      ]);
    }
  };

  // Save New Order
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
      showToast("Customer Name and Phone Number are required.", "error");
      return;
    }
    if (newItems.length === 0) {
      showToast("At least one line item is required.", "error");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const calculatedSubtotal = newItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const calculatedTotal = Math.max(0, calculatedSubtotal - Number(newDiscount) + Number(newShippingFee));

      const payload = {
        customerName: newCustomerName,
        customerEmail: newCustomerEmail || `${newCustomerPhone.replace(/[^0-9]/g, "")}@order.avrostore.com`,
        customerPhone: newCustomerPhone,
        shippingAddress: {
          fullName: newCustomerName,
          addressLine1: newAddressLine || "Express Delivery Address",
          city: newCity || "New Delhi",
          state: newState || "Delhi",
          postalCode: newPincode || "110001",
          country: "India",
          phone: newCustomerPhone,
        },
        items: newItems,
        subtotal: calculatedSubtotal,
        discount: Number(newDiscount) || 0,
        shippingFee: Number(newShippingFee) || 0,
        total: calculatedTotal,
        paymentMethod: newPaymentMethod,
        paymentStatus: newPaymentStatus,
        orderStatus: newOrderStatus,
        shippingProvider: newCourier,
        trackingNumber: newTracking || null,
        customerNotes: newCustomerNotes || null,
        adminNotes: newAdminNotes || null,
      };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Order #${data.order.orderNumber} created successfully!`);
        setShowCreateModal(false);
        loadOrders();
      } else {
        showToast(data.error || "Failed to create order.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Network error", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Save Edited Order
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const calculatedSubtotal = editItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const calculatedTotal = Math.max(0, calculatedSubtotal - Number(editDiscount) + Number(editShippingFee));

      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          customerName: editCustomerName,
          customerEmail: editCustomerEmail,
          customerPhone: editCustomerPhone,
          shippingAddress: {
            fullName: editCustomerName,
            addressLine1: editAddressLine,
            city: editCity,
            state: editState,
            postalCode: editPincode,
            country: "India",
            phone: editCustomerPhone,
          },
          orderStatus: editStatus,
          paymentStatus: editPaymentStatus,
          paymentMethod: editPaymentMethod,
          shippingProvider: editCourier,
          trackingNumber: editTracking,
          subtotal: calculatedSubtotal,
          discount: Number(editDiscount),
          shippingFee: Number(editShippingFee),
          total: calculatedTotal,
          adminNotes: editAdminNotes,
          customerNotes: editCustomerNotes,
          items: editItems,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Order updated successfully!");
        setShowEditModal(false);
        loadOrders();
      } else {
        showToast(data.error || "Failed to update order", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Network error", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Download CSV export
  const handleExportCsv = () => {
    const url = `/api/admin/reports?format=csv&range=all`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `avro-orders-export-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloading full orders CSV report...");
  };

  // Checkbox helpers
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Launch batch shipping label printer
  const handlePrintBatchLabels = () => {
    const selected = filteredOrders.filter((o) => selectedOrderIds.includes(o.id));
    if (selected.length > 0) {
      setShippingLabelsToPrint(selected);
    }
  };

  const statuses = [
    { key: "ALL", label: "All Orders" },
    { key: "PENDING", label: "Pending" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "PACKED", label: "Packed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0A192F] tracking-tight">
              Order Fulfillment & Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
              {filteredOrders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create manual orders, edit customer addresses, dispatch shipments, print thermal 4"×6" labels, and download CSV reports.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedOrderIds.length > 0 && (
            <button
              onClick={handlePrintBatchLabels}
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              Print Labels ({selectedOrderIds.length})
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create New Order
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gross Sales</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0A192F]">₹{totalGross.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-slate-400">Total customer orders placed</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Awaiting Dispatch</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-[#0A192F]">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Orders ready for packing</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">In Transit & Shipped</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0A192F]">{shippedCount}</p>
          <span className="text-[10px] text-blue-600 font-semibold">Dispatched with active AWB</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#0A192F]">{deliveredCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">Successfully completed</span>
        </div>
      </div>

      {/* Search Bar & Status Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, Customer Name, Email, or AWB..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>

          {/* Batch Selector Bar when rows are selected */}
          {selectedOrderIds.length > 0 && (
            <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <span className="font-bold text-[#2563EB]">{selectedOrderIds.length} Selected</span>
              <button
                onClick={handlePrintBatchLabels}
                className="px-2.5 py-1 rounded-lg bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                Print Labels
              </button>
              <button
                onClick={() => setSelectedOrderIds([])}
                className="px-2 py-1 rounded-lg text-slate-500 hover:text-slate-800 font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {statuses.map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st.key
                  ? "bg-[#0A192F] text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <button
                    onClick={handleToggleSelectAll}
                    className="p-1 rounded-sm text-slate-400 hover:text-slate-700"
                  >
                    {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 animate-spin text-[#2563EB]" />
                      <span>Loading store order manifest...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600">No orders match this filter.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try clearing your search query or creating a new manual order.
                    </p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="mt-3 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Create Manual Order
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isChecked = selectedOrderIds.includes(ord.id);
                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleSelectOne(ord.id)}
                          className="p-1 rounded-sm text-slate-400 hover:text-slate-700"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-[#0A192F] block">
                          {ord.orderNumber}
                        </span>
                        {ord.trackingNumber && (
                          <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[120px]">
                            AWB: {ord.trackingNumber}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {ord.customerName?.slice(0, 2).toUpperCase() || "CU"}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-[140px]">
                              {ord.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {ord.customerEmail}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-semibold">{ord.items?.length || 0}</span> product(s)
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0A192F] whitespace-nowrap">
                        ₹{ord.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold block text-slate-800 text-[11px]">
                          {ord.paymentMethod}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-sm uppercase inline-block mt-0.5 ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                            ord.orderStatus === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.orderStatus === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : ord.orderStatus === "PACKED"
                              ? "bg-purple-100 text-purple-800"
                              : ord.orderStatus === "PROCESSING"
                              ? "bg-sky-100 text-sky-800"
                              : ord.orderStatus === "CANCELLED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.orderStatus === "DELIVERED"
                                ? "bg-emerald-600"
                                : ord.orderStatus === "SHIPPED"
                                ? "bg-blue-600 animate-pulse"
                                : "bg-slate-500"
                            }`}
                          />
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Edit Order Action */}
                        <button
                          onClick={() => handleOpenEditModal(ord)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0A192F] hover:text-white text-slate-700 font-bold transition-all inline-flex items-center gap-1 shadow-2xs"
                          title="Edit Order Details & Items"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* 4x6 Shipping Label Printing Action */}
                        <button
                          onClick={() => setShippingLabelsToPrint([ord])}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors inline-flex items-center gap-1 border border-emerald-200/80 shadow-2xs"
                          title="Print 4x6 Thermal Shipping Label"
                        >
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span>Label</span>
                        </button>

                        {/* Tax Invoice */}
                        <button
                          onClick={() => setShowInvoiceModal(ord)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold transition-colors inline-flex items-center gap-1 border border-blue-200/80 shadow-2xs"
                          title="Generate Tax Invoice"
                        >
                          <Printer className="w-3 h-3 text-[#2563EB]" />
                          <span>Invoice</span>
                        </button>

                        {/* Order Management Details Drawer */}
                        <button
                          onClick={() => handleOpenDetail(ord)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A192F]">Create New Order</h3>
                  <p className="text-xs text-slate-500">
                    Manually create customer orders, select catalog products, and set fulfillment routing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-6 text-xs">
              {/* Customer Information */}
              <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#2563EB]" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Customer Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newCustomerEmail}
                      onChange={(e) => setNewCustomerEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]/20"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  Shipping Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Address Line</label>
                    <input
                      type="text"
                      value={newAddressLine}
                      onChange={(e) => setNewAddressLine(e.target.value)}
                      placeholder="Flat / Street / Area"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Purchased Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#2563EB]" />
                    Line Items ({newItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemToCreate}
                    className="px-3 py-1 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Product Item
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {newItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Product</label>
                        {availableProducts.length > 0 ? (
                          <select
                            value={item.productId}
                            onChange={(e) => {
                              const selProd = availableProducts.find((p) => p.id === e.target.value);
                              const updated = [...newItems];
                              if (selProd) {
                                updated[idx].productId = selProd.id;
                                updated[idx].title = selProd.title;
                                updated[idx].price = selProd.price;
                                updated[idx].sku = selProd.sku || `SKU-${selProd.id.slice(-4)}`;
                              }
                              setNewItems(updated);
                            }}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg font-medium text-xs bg-slate-50 focus:bg-white"
                          >
                            {availableProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} (₹{p.price})
                              </option>
                            ))}
                            <option value="custom">Custom Line Item</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...newItems];
                              updated[idx].title = e.target.value;
                              setNewItems(updated);
                            }}
                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                          />
                        )}
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Price (₹)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const updated = [...newItems];
                            updated[idx].price = Number(e.target.value) || 0;
                            setNewItems(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => {
                            const updated = [...newItems];
                            updated[idx].quantity = Math.max(1, Number(e.target.value) || 1);
                            setNewItems(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="col-span-2 text-right">
                        <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Line Total</label>
                        <span className="font-extrabold text-[#0A192F]">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="col-span-1 text-right pt-4">
                        {newItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setNewItems(newItems.filter((_, i) => i !== idx))}
                            className="p-1 text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status, Payment & Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Routing & Payment
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                      <select
                        value={newPaymentMethod}
                        onChange={(e) => setNewPaymentMethod(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="COD">Cash on Delivery (COD)</option>
                        <option value="RAZORPAY">Razorpay</option>
                        <option value="PHONEPE">PhonePe</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="UPI">Manual UPI</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                      <select
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Order Status</label>
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="PACKED">Packed</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Courier Carrier</label>
                      <select
                        value={newCourier}
                        onChange={(e) => setNewCourier(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="DELHIVERY">Delhivery Express</option>
                        <option value="SHIPROCKET">Shiprocket Priority</option>
                        <option value="BLUEDART">Blue Dart Apex</option>
                        <option value="DTDC">DTDC Plus</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Financial Summary
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-bold">
                        ₹{newItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Discount (₹):</span>
                      <input
                        type="number"
                        min={0}
                        value={newDiscount}
                        onChange={(e) => setNewDiscount(Number(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-right bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Shipping Fee (₹):</span>
                      <input
                        type="number"
                        min={0}
                        value={newShippingFee}
                        onChange={(e) => setNewShippingFee(Number(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-right bg-white"
                      />
                    </div>

                    <div className="pt-2 border-t flex justify-between font-extrabold text-[#0A192F] text-sm">
                      <span>Final Order Total:</span>
                      <span>
                        ₹{Math.max(
                          0,
                          newItems.reduce((acc, it) => acc + it.price * it.quantity, 0) -
                            Number(newDiscount) +
                            Number(newShippingFee)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOrder}
                  className="px-6 py-2 bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isSubmittingOrder ? "Creating Order..." : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A192F]">
                    Edit Order {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update customer details, shipping address, fulfillment routing, or adjust items.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-6 text-xs">
              {/* Customer Information */}
              <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#2563EB]" />
                  Customer Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editCustomerPhone}
                      onChange={(e) => setEditCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editCustomerEmail}
                      onChange={(e) => setEditCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                  Shipping Destination
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Address Line</label>
                    <input
                      type="text"
                      value={editAddressLine}
                      onChange={(e) => setEditAddressLine(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editPincode}
                      onChange={(e) => setEditPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Courier Routing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Order Status & Payment
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Order Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white font-semibold"
                      >
                        {statuses.filter((s) => s.key !== "ALL").map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                      <select
                        value={editPaymentStatus}
                        onChange={(e) => setEditPaymentStatus(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white font-semibold"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Courier Carrier</label>
                      <select
                        value={editCourier}
                        onChange={(e) => setEditCourier(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white"
                      >
                        <option value="DELHIVERY">Delhivery Express</option>
                        <option value="SHIPROCKET">Shiprocket Priority</option>
                        <option value="BLUEDART">Blue Dart Apex</option>
                        <option value="DTDC">DTDC Plus</option>
                        <option value="FLAT_RATE">Store Fleet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tracking AWB</label>
                      <input
                        type="text"
                        value={editTracking}
                        onChange={(e) => setEditTracking(e.target.value)}
                        placeholder="AWB Number"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/75 rounded-2xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Financial Adjustment
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Line Items Subtotal:</span>
                      <span className="font-bold">
                        ₹{editItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Discount (₹):</span>
                      <input
                        type="number"
                        min={0}
                        value={editDiscount}
                        onChange={(e) => setEditDiscount(Number(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-right bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span>Shipping Fee (₹):</span>
                      <input
                        type="number"
                        min={0}
                        value={editShippingFee}
                        onChange={(e) => setEditShippingFee(Number(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-right bg-white"
                      />
                    </div>

                    <div className="pt-2 border-t flex justify-between font-extrabold text-[#0A192F] text-sm">
                      <span>Total Adjusted:</span>
                      <span>
                        ₹{Math.max(
                          0,
                          editItems.reduce((acc, it) => acc + it.price * it.quantity, 0) -
                            Number(editDiscount) +
                            Number(editShippingFee)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isUpdating ? "Saving Changes..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ORDER DETAILS DRAWER */}
      {selectedOrder && !showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-[#0A192F]">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                      selectedOrder.orderStatus === "DELIVERED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">
                  Received on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(selectedOrder)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0A192F] hover:text-white text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Order
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Quick Action Buttons inside Drawer */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShippingLabelsToPrint([selectedOrder])}
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <Tag className="w-4 h-4 text-emerald-600" />
                Print 4"×6" Shipping Label
              </button>
              <button
                onClick={() => setShowInvoiceModal(selectedOrder)}
                className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs border border-blue-200 transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#2563EB]" />
                View & Print Tax Invoice
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Customer Information
                </span>
                <strong className="text-slate-900 block mt-1 text-sm">{selectedOrder.customerName}</strong>
                <p className="text-slate-600">{selectedOrder.customerEmail}</p>
                <p className="text-slate-600">{selectedOrder.customerPhone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Payment Summary
                </span>
                <p className="mt-1 font-semibold text-slate-800">
                  Method: {selectedOrder.paymentMethod}
                </p>
                <p
                  className={`font-bold ${
                    selectedOrder.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  Status: {selectedOrder.paymentStatus}
                </p>
                <p className="text-slate-600 font-extrabold text-sm mt-1">
                  Total: ₹{selectedOrder.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Line Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="border border-slate-200 rounded-2xl divide-y text-xs overflow-hidden">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <strong className="text-slate-800 block text-xs">{item.title}</strong>
                      {item.variantTitle && (
                        <span className="text-[11px] text-slate-500">{item.variantTitle}</span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono block">SKU: {item.sku}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-700">
                        {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <span className="block font-extrabold text-[#2563EB]">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Update Form */}
            <form onSubmit={handleUpdateOrder} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Fulfillment & Courier Routing</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Order Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    {statuses.filter((s) => s.key !== "ALL").map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Courier Partner</label>
                  <select
                    value={editCourier}
                    onChange={(e) => setEditCourier(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#2563EB]/20"
                  >
                    <option value="DELHIVERY">Delhivery Surface / Air</option>
                    <option value="SHIPROCKET">Shiprocket Priority</option>
                    <option value="BLUEDART">Blue Dart Apex</option>
                    <option value="DTDC">DTDC Plus Express</option>
                    <option value="FLAT_RATE">Standard Store Fleet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tracking / AWB Number</label>
                  <input
                    type="text"
                    value={editTracking}
                    onChange={(e) => setEditTracking(e.target.value)}
                    placeholder="e.g. DL982183921IN"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono bg-white focus:ring-2 focus:ring-[#2563EB]/20"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-[#0A192F] hover:bg-[#1E293B] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isUpdating ? "Updating Status..." : "Save Status & Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4x6 Thermal Shipping Label Printing Modal */}
      {shippingLabelsToPrint && (
        <ShippingLabelModal
          orders={shippingLabelsToPrint}
          onClose={() => setShippingLabelsToPrint(null)}
        />
      )}

      {/* Minimal & Professional Tax Invoice Modal */}
      {showInvoiceModal && (
        <TaxInvoiceModal
          order={showInvoiceModal}
          onClose={() => setShowInvoiceModal(null)}
        />
      )}
    </div>
  );
}
