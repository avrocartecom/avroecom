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

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
              placeholder="e.g. AVRO Elite Store"
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
                placeholder="e.g. Technext Cyber Park, Sector 62, Industrial Area"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">City</label>
              <input
                type="text"
                value={formData.companyCity}
                onChange={(e) => setFormData({ ...formData, companyCity: e.target.value })}
                placeholder="e.g. Noida / New Delhi"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">State / Province</label>
              <input
                type="text"
                value={formData.companyState}
                onChange={(e) => setFormData({ ...formData, companyState: e.target.value })}
                placeholder="e.g. Uttar Pradesh / Delhi"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Postal / PIN Code</label>
              <input
                type="text"
                value={formData.companyPostalCode}
                onChange={(e) => setFormData({ ...formData, companyPostalCode: e.target.value })}
                placeholder="e.g. 201309"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Country</label>
              <input
                type="text"
                value={formData.companyCountry}
                onChange={(e) => setFormData({ ...formData, companyCountry: e.target.value })}
                placeholder="e.g. India"
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
                placeholder="e.g. 07AAACT9021M1Z4"
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
                placeholder="e.g. EXCLUSIVE COLLECTION 2026"
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
                placeholder="e.g. Find your next favorite"
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
                placeholder="e.g. Shop Catalog"
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
                placeholder="e.g. /shop"
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
