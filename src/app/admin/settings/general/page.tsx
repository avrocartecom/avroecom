"use client";

import { useEffect, useState, useRef } from "react";
import {
  Building2,
  Image as ImageIcon,
  Upload,
  Globe,
  Mail,
  Phone,
  FileText,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  RefreshCw,
  Sliders,
  Video,
  Film,
  Plus,
  Trash2,
  Tag,
  Play,
} from "lucide-react";

export default function GeneralSettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    brandName: "AVRO Store",
    logoUrl: "",
    faviconUrl: "",
    companyAddress: "Plot 42, Commercial Avenue, Sector 62",
    companyCity: "Noida",
    companyState: "Uttar Pradesh",
    companyPostalCode: "201309",
    companyCountry: "India",
    supportEmail: "support@avrostore.com",
    supportPhone: "+91 98765 43210",
    taxId: "07AAACT9021M1Z4",
    bannerHeadline: "Find your next",
    bannerSubheadline: "Shop top-rated essentials, minimalist apparel, and daily curated finds with fast delivery.",
    bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
    heroBadge: "EXCLUSIVE COLLECTION 2026",
    heroCtaText: "Shop Catalog",
    heroCtaLink: "/shop",
    footerText: "© 2026 AVRO Store. Powered by AVRO.",
  });

  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);

  const heroPresets = [
    { label: "Modern Retail", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85" },
    { label: "High-End Fashion", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" },
    { label: "Audio & Gadgets", url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85" },
    { label: "Home & Ceramics", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85" },
    { label: "Jewelry & Luxury", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85" },
  ];

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/general");
      const data = await res.json();
      if (data.success && data.settings) {
        setFormData({
          brandName: data.settings.brandName || "AVRO Store",
          logoUrl: data.settings.logoUrl || "",
          faviconUrl: data.settings.faviconUrl || "",
          companyAddress: data.settings.companyAddress || "",
          companyCity: data.settings.companyCity || "",
          companyState: data.settings.companyState || "",
          companyPostalCode: data.settings.companyPostalCode || "",
          companyCountry: data.settings.companyCountry || "India",
          supportEmail: data.settings.supportEmail || "",
          supportPhone: data.settings.supportPhone || "",
          taxId: data.settings.taxId || "",
          bannerHeadline: data.settings.bannerHeadline || "Find your next",
          bannerSubheadline: data.settings.bannerSubheadline || "",
          bannerImageUrl: data.settings.bannerImageUrl || "",
          heroBadge: data.settings.heroBadge || "EXCLUSIVE COLLECTION 2026",
          heroCtaText: data.settings.heroCtaText || "Shop Catalog",
          heroCtaLink: data.settings.heroCtaLink || "/shop",
          footerText: data.settings.footerText || "© 2026 AVRO Store. Powered by AVRO.",
        });

        if (Array.isArray(data.settings.heroSlides)) {
          setHeroSlides(data.settings.heroSlides);
        }
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleFileUpload = async (
    file: File,
    targetKey: "logoUrl" | "faviconUrl" | "bannerImageUrl",
    setLoadingState: (loading: boolean) => void
  ) => {
    if (!file) return;
    setLoadingState(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, [targetKey]: result.url }));
      } else {
        alert(result.error || "File upload failed.");
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setLoadingState(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
      badge: "FEATURED AD",
      title: "Featured Brand Promotion",
      subtitle: "Discover exclusive seasonal deals and new arrivals.",
      ctaText: "Shop Offer",
      ctaLink: "/shop",
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const handleUpdateSlide = (index: number, field: string, value: any) => {
    setHeroSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteSlide = (index: number) => {
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= heroSlides.length) return;
    setHeroSlides((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIdx];
      updated[newIdx] = temp;
      return updated;
    });
  };

  const handleSlideFileUpload = async (file: File, index: number) => {
    if (!file) return;
    setUploadingSlideIndex(index);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        const isVideo =
          file.type.startsWith("video/") ||
          [".mp4", ".webm", ".mov", ".ogg", ".m4v"].some((ext) =>
            file.name.toLowerCase().endsWith(ext)
          );
        setHeroSlides((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            mediaUrl: result.url,
            mediaType: isVideo ? "video" : "image",
          };
          return updated;
        });
      } else {
        alert(result.error || "File upload failed.");
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          heroSlides,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert(result.error || "Failed to save settings.");
      }
    } catch (err: any) {
      alert("Error saving settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs font-semibold text-slate-500">Loading store configuration...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
              Merchant Settings
            </span>
            <span className="text-xs text-slate-400">· Global Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight mt-1">
            General & Branding Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your site logo, favicon, official company contact details, tax ID, and homepage hero banner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            View Storefront <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving Changes..." : saveSuccess ? "Saved Successfully!" : "Save All Settings"}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Branding and company settings have been deployed live to the storefront, invoice engine, and shipping labels!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: SITE BRANDING (LOGO & FAVICON) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Store Identity & Media Branding
              </h2>
              <p className="text-xs text-slate-500">
                Your primary site logo, browser tab favicon, and public brand title.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Upload & URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Site Logo <span className="text-slate-400 font-normal">(Navbar, Invoice & Header)</span>
              </label>

              <div className="flex items-center gap-4">
                <div className="w-32 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex items-center justify-center p-2 overflow-hidden flex-shrink-0 shadow-2xs">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Store Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <img
                      src="/avro-logo.png"
                      alt="Default AVRO"
                      className="max-h-full max-w-full object-contain opacity-70"
                    />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "logoUrl", setUploadingLogo);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {uploadingLogo ? "Uploading..." : "Upload Logo from PC"}
                  </button>
                  <span className="text-[10px] text-slate-400 block">
                    Recommended: Transparent PNG, SVG, or WEBP (approx. 200×60px)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Or Logo Image URL</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://yourdomain.com/logo.png"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Favicon Upload & URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Favicon <span className="text-slate-400 font-normal">(Browser Tab Icon)</span>
              </label>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center p-2 overflow-hidden flex-shrink-0 shadow-2xs">
                  {formData.faviconUrl ? (
                    <img
                      src={formData.faviconUrl}
                      alt="Favicon Preview"
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-xs">
                      A
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="file"
                    ref={faviconFileInputRef}
                    accept="image/*,.ico"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "faviconUrl", setUploadingFavicon);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => faviconFileInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {uploadingFavicon ? "Uploading..." : "Upload Favicon from PC"}
                  </button>
                  <span className="text-[10px] text-slate-400 block">
                    Recommended: 32×32 or 64×64 PNG / ICO format
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Or Favicon URL</label>
                <input
                  type="text"
                  value={formData.faviconUrl}
                  onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                  placeholder="https://yourdomain.com/favicon.png"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Public Store / Brand Name
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              placeholder="Store brand name"
              className="w-full max-w-md px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Appears in browser title, navbar, invoice header, and customer notifications.
            </span>
          </div>
        </div>

        {/* SECTION 2: COMPANY & LEGAL DETAILS (FOR INVOICES & LABELS) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Company Details & Registered Office
              </h2>
              <p className="text-xs text-slate-500">
                Used dynamically on Tax Invoices, Courier Shipping Labels, and Storefront Footers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Registered Street Address (Seller / Warehouse)
              </label>
              <input
                type="text"
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                placeholder="Company street address"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">City</label>
              <input
                type="text"
                value={formData.companyCity}
                onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
                placeholder="City"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">State / Province</label>
              <input
                type="text"
                value={formData.companyState}
                onChange={(e) => setFormData({ ...formData, companyState: e.target.value })}
                placeholder="State / Province"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Postal / PIN Code</label>
              <input
                type="text"
                value={formData.companyPostalCode}
                onChange={(e) => setFormData({ ...formData, companyPostalCode: e.target.value })}
                placeholder="PIN / Postal code"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Country</label>
              <input
                type="text"
                value={formData.companyCountry}
                onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
                placeholder="Country"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Customer Support Email</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                placeholder="support@yourdomain.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Customer Helpline / Phone</label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <label className="block text-xs font-bold text-amber-900 mb-1.5">
                GSTIN / Tax Identification Number
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="Tax registration / GSTIN"
                className="w-full max-w-sm px-3.5 py-2 border border-amber-300 rounded-xl text-xs font-mono font-black text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/30 bg-white"
              />
              <span className="text-[11px] text-amber-800 block mt-1">
                Printed prominently on official B2B/B2C Tax Invoices and courier consignment manifests.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: HOMEPAGE HERO SECTION EDITOR */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Homepage Hero Section & Visuals
              </h2>
              <p className="text-xs text-slate-500">
                Directly customize the banner titles, badge, call-to-action buttons, and hero image.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Hero Micro-Badge / Tagline
              </label>
              <input
                type="text"
                value={formData.heroBadge}
                onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                placeholder="Exclusive collection"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Hero Main Headline / Title
              </label>
              <input
                type="text"
                value={formData.bannerHeadline}
                onChange={(e) => setFormData({ ...formData, bannerHeadline: e.target.value })}
                placeholder="Headline text"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={formData.bannerSubheadline}
                onChange={(e) => setFormData({ ...formData, bannerSubheadline: e.target.value })}
                placeholder="Brief enticing description for store visitors..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.heroCtaText}
                onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                placeholder="Shop Catalog"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                CTA Button Target URL
              </label>
              <input
                type="text"
                value={formData.heroCtaLink}
                onChange={(e) => setFormData({ ...formData, heroCtaLink: e.target.value })}
                placeholder="/shop"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
              />
            </div>

            {/* Hero Banner Image */}
            <div className="md:col-span-2 space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                Hero Banner Image
              </label>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-5 h-36 rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 relative shadow-sm">
                  {formData.bannerImageUrl ? (
                    <img
                      src={formData.bannerImageUrl}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Image Set
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Live Hero Preview
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-2">
                  <input
                    type="file"
                    ref={heroFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], "bannerImageUrl", setUploadingHero);
                      }
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      disabled={uploadingHero}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {uploadingHero ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {uploadingHero ? "Uploading Image..." : "Upload Hero Image from PC"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Or Image Direct URL:
                    </label>
                    <input
                      type="text"
                      value={formData.bannerImageUrl}
                      onChange={(e) => setFormData({ ...formData, bannerImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 self-center">Presets:</span>
                    {heroPresets.map((hp, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, bannerImageUrl: hp.url })}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all"
                      >
                        {hp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SUB-SECTION: HERO BANNER ADS & SLIDES (IMAGES & VIDEOS WITH RIGHT SCROLL) */}
            <div className="md:col-span-2 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Dynamic Media Scroller
                    </span>
                    <span className="text-xs text-slate-400">· {heroSlides.length} Slide{heroSlides.length !== 1 ? "s" : ""} Active</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Hero Banner Ads & Multi-Media Slider
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Add multiple banner ads, promotional image slides, or video clips with auto-sliding and right-scroll navigation on your live storefront.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Banner Ad / Slide</span>
                </button>
              </div>

              {heroSlides.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {heroSlides.map((slide, idx) => {
                    const isUploadingThis = uploadingSlideIndex === idx;

                    return (
                      <div
                        key={slide.id || idx}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all space-y-4 shadow-xs"
                      >
                        {/* Slide Top Bar */}
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {slide.title || `Banner Ad Slide #${idx + 1}`}
                            </span>

                            {/* Media Type Switcher */}
                            <div className="flex p-0.5 bg-slate-200 rounded-lg text-[10px] font-bold ml-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(idx, "mediaType", "image")}
                                className={`px-2 py-0.5 rounded-md transition ${
                                  slide.mediaType !== "video"
                                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                Image Slide
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateSlide(idx, "mediaType", "video")}
                                className={`px-2 py-0.5 rounded-md transition flex items-center gap-1 ${
                                  slide.mediaType === "video"
                                    ? "bg-purple-600 text-white shadow-2xs font-extrabold"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                <Video className="w-3 h-3" />
                                <span>Video Clip</span>
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveSlide(idx, "up")}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === heroSlides.length - 1}
                              onClick={() => handleMoveSlide(idx, "down")}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSlide(idx)}
                              className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer ml-1"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Slide Media & Input Section */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Media Preview Box (4 cols) */}
                          <div className="md:col-span-4 h-36 rounded-xl border border-slate-300 overflow-hidden bg-slate-900 relative shadow-2xs flex items-center justify-center">
                            {slide.mediaUrl ? (
                              slide.mediaType === "video" ? (
                                <video
                                  src={slide.mediaUrl}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={slide.mediaUrl}
                                  alt={slide.title || "Slide preview"}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <span className="text-[11px] text-slate-400">No media uploaded</span>
                            )}

                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white backdrop-blur-sm">
                              {slide.mediaType === "video" ? "VIDEO AD" : "IMAGE AD"}
                            </span>
                          </div>

                          {/* Media Controls (8 cols) */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                                {isUploadingThis ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : slide.mediaType === "video" ? (
                                  <Film className="w-3.5 h-3.5" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isUploadingThis
                                    ? "Uploading Media..."
                                    : slide.mediaType === "video"
                                    ? "Upload Video File (MP4/WebM) from PC"
                                    : "Upload Image File from PC"}
                                </span>
                                <input
                                  type="file"
                                  accept={slide.mediaType === "video" ? "video/*" : "image/*"}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleSlideFileUpload(e.target.files[0], idx);
                                    }
                                  }}
                                />
                              </label>

                              {slide.mediaType === "video" && (
                                <span className="text-[10px] text-slate-400">
                                  Supports MP4, WebM, MOV clips.
                                </span>
                              )}
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Or Direct Media URL (Image or Video CDN Link):
                              </label>
                              <input
                                type="text"
                                value={slide.mediaUrl}
                                onChange={(e) => handleUpdateSlide(idx, "mediaUrl", e.target.value)}
                                placeholder="Direct image or video URL"
                                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 bg-white focus:outline-none"
                              />
                            </div>

                            {/* Ad Content Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Badge / Tag
                                </label>
                                <input
                                  type="text"
                                  value={slide.badge || ""}
                                  onChange={(e) => handleUpdateSlide(idx, "badge", e.target.value)}
                                  placeholder="Badge label"
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Ad Headline / Title
                                </label>
                                <input
                                  type="text"
                                  value={slide.title || ""}
                                  onChange={(e) => handleUpdateSlide(idx, "title", e.target.value)}
                                  placeholder="Slide title"
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white"
                                />
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Promo Subtitle / Description
                                </label>
                                <input
                                  type="text"
                                  value={slide.subtitle || ""}
                                  onChange={(e) => handleUpdateSlide(idx, "subtitle", e.target.value)}
                                  placeholder="Promotional copy or description..."
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  CTA Button Label
                                </label>
                                <input
                                  type="text"
                                  value={slide.ctaText || ""}
                                  onChange={(e) => handleUpdateSlide(idx, "ctaText", e.target.value)}
                                  placeholder="Button text"
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Target Destination Link
                                </label>
                                <input
                                  type="text"
                                  value={slide.ctaLink || ""}
                                  onChange={(e) => handleUpdateSlide(idx, "ctaLink", e.target.value)}
                                  placeholder="/shop or destination URL"
                                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-2">
                  <Film className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700">No multi-slide banner ads configured</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Click "+ Add Banner Ad / Slide" to create multi-image or video banner ads that automatically slide to the right on your storefront.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Banner Ad</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: FOOTER & LEGAL NOTICE */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Footer Copyright & Legal Disclaimer
              </h2>
              <p className="text-xs text-slate-500">
                Shown at the bottom of every page on the public storefront.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Copyright Notice Text
            </label>
            <textarea
              rows={2}
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Ensure you click <strong className="text-slate-800">Save All Settings</strong> to publish changes live.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Deploying Configuration..." : saveSuccess ? "Saved Successfully!" : "Save All Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
