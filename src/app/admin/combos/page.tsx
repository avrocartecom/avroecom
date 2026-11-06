"use client";

import { useEffect, useState } from "react";
import {
  PackagePlus,
  Boxes,
  Plus,
  Search,
  RefreshCw,
  Layers,
  Percent,
  CheckCircle2,
  Trash2,
  Edit3,
  DollarSign,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Upload,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface ProductItem {
  id: string;
  title: string;
  sku: string;
  price: number;
  images?: { url: string; isPrimary: boolean }[];
}

interface ComboDeal {
  id: string;
  title: string;
  comboTitle?: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  status: string;
  stock: number;
  isComboDeal: boolean;
  comboDiscountPercent?: number;
  comboProductIds?: string;
  bundledItems?: ProductItem[];
  bundledCount?: number;
  originalTotal?: number;
  savingsAmount?: number;
  effectiveDiscount?: number;
  images?: { url: string; isPrimary: boolean }[];
  updatedAt: string;
}

export default function CombosManagementPage() {
  const [combos, setCombos] = useState<ComboDeal[]>([]);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [stats, setStats] = useState({ totalCombos: 0, activeCombos: 0, avgDiscount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DRAFT">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ComboDeal | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formComboTitle, setFormComboTitle] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formComparePrice, setFormComparePrice] = useState<number | "">("");
  const [formDiscountPercent, setFormDiscountPercent] = useState<number>(15);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [formStatus, setFormStatus] = useState<string>("ACTIVE");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch Combos and Products
  const loadData = async () => {
    setLoading(true);
    try {
      const [combosRes, productsRes] = await Promise.all([
        fetch(`/api/admin/combos${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`),
        fetch("/api/admin/products"),
      ]);

      const combosData = await combosRes.json();
      const productsData = await productsRes.json();

      if (combosData.success) {
        setCombos(combosData.combos || []);
        if (combosData.stats) setStats(combosData.stats);
      }
      if (productsData.success) {
        setAllProducts(productsData.products || []);
      }
    } catch (err: any) {
      console.error("Error loading combo data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCombo(null);
    setFormTitle("");
    setFormComboTitle("Special Value Bundle - Save 15%");
    setFormSku(`CMB-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(0);
    setFormComparePrice("");
    setFormDiscountPercent(15);
    setSelectedProductIds([]);
    setFormStatus("ACTIVE");
    setFormImages([]);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (combo: ComboDeal) => {
    setEditingCombo(combo);
    setFormTitle(combo.title);
    setFormComboTitle(combo.comboTitle || combo.title);
    setFormSku(combo.sku);
    setFormPrice(combo.price);
    setFormComparePrice(combo.comparePrice || "");
    setFormDiscountPercent(combo.comboDiscountPercent || 15);
    setFormStatus(combo.status);
    setFormImages(combo.images?.map((img) => img.url) || []);

    let ids: string[] = [];
    if (combo.comboProductIds) {
      try {
        ids = typeof combo.comboProductIds === "string" ? JSON.parse(combo.comboProductIds) : combo.comboProductIds;
      } catch {
        ids = String(combo.comboProductIds).split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    setSelectedProductIds(Array.isArray(ids) ? ids : []);
    setErrorMsg("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  // Toggle a product selection inside modal
  const toggleSelectProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];

      // Auto compute bundle price based on selected items sum and discount %
      const selectedItems = allProducts.filter((p) => next.includes(p.id));
      const totalSum = selectedItems.reduce((sum, p) => sum + (p.price || 0), 0);
      if (totalSum > 0) {
        const discounted = Math.round(totalSum * (1 - formDiscountPercent / 100));
        setFormPrice(discounted);
        setFormComparePrice(totalSum);
      }
      return next;
    });
  };

  // When discount percentage slider/input changes, recompute bundle price
  const handleDiscountChange = (newDiscount: number) => {
    setFormDiscountPercent(newDiscount);
    const selectedItems = allProducts.filter((p) => selectedProductIds.includes(p.id));
    const totalSum = selectedItems.reduce((sum, p) => sum + (p.price || 0), 0);
    if (totalSum > 0) {
      const discounted = Math.round(totalSum * (1 - newDiscount / 100));
      setFormPrice(discounted);
      setFormComparePrice(totalSum);
    }
  };

  // Image upload directly from system
  const handleSystemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.assets) {
        const newUrls = data.assets.map((a: any) => a.fileUrl);
        setFormImages((prev) => [...prev, ...newUrls]);
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (err) {
      alert("Error uploading image from local device.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Combo Form (POST or PUT)
  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) {
      setErrorMsg("Please enter a title for the bundle.");
      return;
    }
    if (selectedProductIds.length === 0) {
      setErrorMsg("Please select at least one bundled product item.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      if (editingCombo) {
        // PUT update existing
        const res = await fetch("/api/admin/combos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCombo.id,
            isComboDeal: true,
            comboTitle: formComboTitle || formTitle,
            comboDiscountPercent: formDiscountPercent,
            comboProductIds: selectedProductIds,
            status: formStatus,
            price: formPrice,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg("Bundle deal updated successfully!");
          setTimeout(() => {
            setIsModalOpen(false);
            loadData();
          }, 600);
        } else {
          setErrorMsg(data.error || "Failed to update bundle.");
        }
      } else {
        // POST create new
        const res = await fetch("/api/admin/combos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            comboTitle: formComboTitle || formTitle,
            sku: formSku,
            price: formPrice,
            comparePrice: formComparePrice || null,
            comboDiscountPercent: formDiscountPercent,
            comboProductIds: selectedProductIds,
            status: formStatus,
            images: formImages,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg("New Combo Bundle created successfully!");
          setTimeout(() => {
            setIsModalOpen(false);
            loadData();
          }, 600);
        } else {
          setErrorMsg(data.error || "Failed to create combo bundle.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error while saving combo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Combo Status
  const handleToggleStatus = async (combo: ComboDeal) => {
    const nextStatus = combo.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      await fetch("/api/admin/combos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: combo.id,
          status: nextStatus,
        }),
      });
      setCombos((prev) => prev.map((c) => (c.id === combo.id ? { ...c, status: nextStatus } : c)));
    } catch (err) {
      alert("Failed to toggle combo status.");
    }
  };

  // Delete / Remove Combo Deal
  const handleDeleteCombo = async (combo: ComboDeal) => {
    if (!confirm(`Remove combo offer for "${combo.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/combos?id=${combo.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCombos((prev) => prev.filter((c) => c.id !== combo.id));
      } else {
        alert(data.error || "Failed to delete combo deal.");
      }
    } catch (err) {
      alert("Network error deleting combo.");
    }
  };

  // Filtered Combos
  const filteredCombos = combos.filter((combo) => {
    const matchesFilter =
      statusFilter === "ALL" ? true : combo.status === statusFilter;
    const matchesSearch =
      combo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (combo.comboTitle && combo.comboTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      combo.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate live sum for modal preview
  const selectedBundleItems = allProducts.filter((p) => selectedProductIds.includes(p.id));
  const modalOriginalTotal = selectedBundleItems.reduce((acc, p) => acc + (p.price || 0), 0);
  const modalSavings = Math.max(0, modalOriginalTotal - formPrice);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-sm shadow-blue-500/20">
              <PackagePlus className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Combo Deals & Product Bundles
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Build high-margin combo packs, bundle recommendations, and tiered packages to increase Average Order Value (AOV).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 rounded-xl shadow-sm transition"
            title="Refresh Catalog"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/25 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Bundle Deal</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Combos</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalCombos}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Bundle deals created</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deals</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{stats.activeCombos}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Live on storefront</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Bundle Discount</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{stats.avgDiscount}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Customer savings incentive</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated AOV Lift</p>
            <p className="text-2xl font-black text-purple-600 mt-1">+28.4%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Cart checkout expansion</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search combo title, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto w-full sm:w-auto">
          {(["ALL", "ACTIVE", "DRAFT"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {tab === "ALL" ? "All Deals" : tab === "ACTIVE" ? "Live Active" : "Draft / Off"}
            </button>
          ))}
        </div>
      </div>

      {/* Combo Cards Grid */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading combo offers...</p>
        </div>
      ) : filteredCombos.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <Boxes className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No combo deals found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Bundle complementary products together to unlock special price incentives and increase checkout value.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Create Your First Bundle Deal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCombos.map((combo) => {
            const primaryImg = combo.images?.[0]?.url || "/placeholder-product.png";
            const bundledList = combo.bundledItems || [];

            return (
              <div
                key={combo.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Card Header & Cover */}
                  <div className="relative h-44 w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                    <img
                      src={primaryImg}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md shadow-xs text-blue-600 border border-blue-100 flex items-center gap-1">
                        <PackagePlus className="w-3 h-3 text-blue-600" />
                        Bundle Deal
                      </span>
                      {combo.comboDiscountPercent ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-xs">
                          {combo.comboDiscountPercent}% OFF
                        </span>
                      ) : null}
                    </div>

                    <button
                      onClick={() => handleToggleStatus(combo)}
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition shadow-xs ${
                        combo.status === "ACTIVE"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {combo.status}
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                        {combo.comboTitle || combo.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">SKU: {combo.sku}</p>
                    </div>

                    {/* Price Breakdown */}
                    <div className="flex items-baseline justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Bundle Price
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-lg font-black text-slate-900">₹{combo.price.toLocaleString()}</span>
                          {combo.originalTotal && combo.originalTotal > combo.price ? (
                            <span className="text-xs font-semibold text-slate-400 line-through">
                              ₹{combo.originalTotal.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {combo.savingsAmount && combo.savingsAmount > 0 ? (
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black rounded-lg">
                            Save ₹{combo.savingsAmount.toLocaleString()}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Bundled Items Stack */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                        <span>Includes {bundledList.length} Products:</span>
                        <span className="text-blue-600 font-extrabold">{combo.bundledCount || bundledList.length} items</span>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {bundledList.slice(0, 4).map((item, idx) => {
                          const itemImg = item.images?.[0]?.url || "/placeholder-product.png";
                          return (
                            <div
                              key={idx}
                              title={`${item.title} (₹${item.price})`}
                              className="relative flex-shrink-0 w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shadow-2xs group/item"
                            >
                              <img src={itemImg} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          );
                        })}
                        {bundledList.length > 4 ? (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                            +{bundledList.length - 4}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(combo)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Configure Bundle</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCombo(combo)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Bundle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingCombo ? "Edit Combo Bundle" : "Create New Combo Deal"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select bundled products and configure package pricing with automatic savings calculation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCombo} className="flex-1 overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Title & Bundle Headline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Bundle / Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Combo package title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Headline / Badge Title
                  </label>
                  <input
                    type="text"
                    placeholder="Customer headline / badge title"
                    value={formComboTitle}
                    onChange={(e) => setFormComboTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* SKU & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bundle SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="ACTIVE">ACTIVE (Visible on Storefront)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Bundled Items Selector */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Select Products to Include in this Bundle ({selectedProductIds.length} Selected)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    Sum: ₹{modalOriginalTotal.toLocaleString()}
                  </span>
                </div>

                {/* Catalog Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter products to add into bundle..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Product checklist */}
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {allProducts
                    .filter((p) => p.title.toLowerCase().includes(catalogSearch.toLowerCase()) || p.sku.toLowerCase().includes(catalogSearch.toLowerCase()))
                    .map((product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      const pImg = product.images?.[0]?.url || "/placeholder-product.png";

                      return (
                        <div
                          key={product.id}
                          onClick={() => toggleSelectProduct(product.id)}
                          className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? "bg-blue-50/80 border-blue-300 text-blue-900"
                              : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <img src={pImg} alt={product.title} className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                            <div>
                              <p className="text-xs font-bold line-clamp-1">{product.title}</p>
                              <p className="text-[10px] text-slate-400 font-mono">SKU: {product.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Discount Calculator & Pricing */}
              <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">Bundle Discount Incentive</span>
                  </div>
                  <span className="text-xs font-black text-blue-600 px-2 py-0.5 bg-blue-100 rounded-md">
                    {formDiscountPercent}% OFF
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={formDiscountPercent}
                    onChange={(e) => handleDiscountChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="w-20">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={formDiscountPercent}
                      onChange={(e) => handleDiscountChange(Number(e.target.value))}
                      className="w-full text-center px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Price Breakdown Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-blue-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Individual Total
                    </label>
                    <div className="text-sm font-bold text-slate-400 line-through">
                      ₹{modalOriginalTotal.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Bundle Deal Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Customer Savings
                    </label>
                    <div className="text-sm font-black text-emerald-600">
                      Save ₹{modalSavings.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bundle Cover Photo (Upload from Computer or System)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? "Uploading..." : "Upload from Computer"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleSystemImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10MB</span>
                </div>

                {formImages.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {formImages.map((imgUrl, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                        <img src={imgUrl} alt="Bundle" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{editingCombo ? "Save Bundle Changes" : "Publish Bundle Deal"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
