"use client";

import { useEffect, useState } from "react";
import {
  Palette,
  Eye,
  CheckCircle2,
  Save,
  Check,
  Zap,
  Sliders,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Layers,
  Type,
  Image as ImageIcon,
  Shield,
  Truck,
  Award,
  Heart,
  ShoppingBag,
  ArrowRight,
  Info,
  Upload,
  Loader2,
  Lock,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Pencil,
  X,
  Video,
  Film,
  Tag,
  Play,
} from "lucide-react";
import { AVRO_THEMES, AvroThemeDefinition, resolveStoreTheme, getAllThemes } from "@/lib/themes-registry";
import { LockedFeatureBanner } from "@/components/admin/LockedFeatureBanner";
import { UpgradePlanModal } from "@/components/admin/UpgradePlanModal";
import { PlanTier } from "@/lib/license-core";

const BASIC_ALLOWED_THEMES = ["AVRO_SIGNATURE", "FASHION_NOIR", "TALIM_DEFAULT"];

export default function ThemesAdminPage() {
  const [permissions, setPermissions] = useState<{
    plan: PlanTier;
    featureMatrix: Record<string, { allowed: boolean }>;
  } | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [themeConfig, setThemeConfig] = useState<any>(null);
  const [customOverrides, setCustomOverrides] = useState<any>({
    backgroundColor: "#F8FAFC",
    cardBg: "#FFFFFF",
    textColor: "#0F172A",
    textMuted: "#64748B",
    buttonRadius: "rounded-xl",
    badgeRadius: "rounded-full",
    heroBadge: "AVRO STANDARD COMMERCE ENGINE 2026",
    headlineHighlight: "favourite.",
    ctaPrimary: "Shop By Category",
    ctaSecondary: "Explore Products",
    announcementBg: "#0A192F",
    announcementTextColor: "#FFFFFF",
    trustBadges: [
      { title: "Express Dispatch", subtitle: "Shipped within 24 hours", icon: "truck" },
      { title: "Safe & Encrypted Checkout", subtitle: "256-bit SSL encrypted payments", icon: "shield" },
      { title: "Verified Authentic", subtitle: "100% Genuine manufacturer guarantee", icon: "award" },
      { title: "7-Day Easy Replacement", subtitle: "Zero hassle doorstep resolution", icon: "refresh" },
    ],
  });

  const [activeTab, setActiveTab] = useState<"EDITOR" | "CUSTOM" | "LIBRARY">("EDITOR");
  const [editorSection, setEditorSection] = useState<"COLORS" | "TYPOGRAPHY" | "HERO" | "ANNOUNCEMENT" | "TRUST" | "FOOTER">("COLORS");
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [activatingCode, setActivatingCode] = useState<string | null>(null);
  const [uploadingThemeSlideIndex, setUploadingThemeSlideIndex] = useState<number | null>(null);

  // Custom Theme Management & Builder States
  const [customThemes, setCustomThemes] = useState<AvroThemeDefinition[]>([]);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);

  const [ctName, setCtName] = useState("");
  const [ctIndustry, setCtIndustry] = useState("Fashion & Apparel");
  const [ctTagline, setCtTagline] = useState("");
  const [ctBasePreset, setCtBasePreset] = useState("AVRO_SIGNATURE");
  const [ctPrimary, setCtPrimary] = useState("#0A192F");
  const [ctAccent, setCtAccent] = useState("#2563EB");
  const [ctBackground, setCtBackground] = useState("#FAFAFA");
  const [ctCardBg, setCtCardBg] = useState("#FFFFFF");
  const [ctText, setCtText] = useState("#0F172A");
  const [ctTextMuted, setCtTextMuted] = useState("#64748B");
  const [ctBorder, setCtBorder] = useState("#E2E8F0");
  const [ctHeaderBg, setCtHeaderBg] = useState("#FFFFFF");
  const [ctFooterBg, setCtFooterBg] = useState("#0A192F");
  const [ctFontFamily, setCtFontFamily] = useState("Inter, -apple-system, sans-serif");
  const [ctHeadingClass, setCtHeadingClass] = useState("font-sans tracking-tight font-extrabold");
  const [ctButtonRadius, setCtButtonRadius] = useState("rounded-xl");
  const [ctBadgeRadius, setCtBadgeRadius] = useState("rounded-full");
  const [ctHeroHeadline, setCtHeroHeadline] = useState("");
  const [ctHeroHighlight, setCtHeroHighlight] = useState("");
  const [ctHeroSubheadline, setCtHeroSubheadline] = useState("");
  const [ctHeroBadge, setCtHeroBadge] = useState("");
  const [ctHeroCtaPrimary, setCtHeroCtaPrimary] = useState("Shop Collection");
  const [ctHeroImageUrl, setCtHeroImageUrl] = useState("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85");
  const [ctAnnouncementText, setCtAnnouncementText] = useState("Free express delivery on all orders over ₹999 with 7-day easy returns");
  const [ctAnnouncementBg, setCtAnnouncementBg] = useState("#0A192F");
  const [ctAnnouncementTextColor, setCtAnnouncementTextColor] = useState("#FFFFFF");
  const [ctShowAnnouncement, setCtShowAnnouncement] = useState(true);

  const categories = [
    { key: "ALL", label: "All 13 Presets" },
    { key: "Fashion & Apparel", label: "Fashion" },
    { key: "Consumer Electronics & Gadgets", label: "Electronics" },
    { key: "Grocery & Daily Fresh", label: "Grocery" },
    { key: "Cosmetics & Skincare", label: "Cosmetics" },
    { key: "Fine Jewelry & Heirlooms", label: "Jewelry" },
    { key: "Fitness & Athletic Performance", label: "Fitness" },
    { key: "Home Decor & Furnishings", label: "Home" },
    { key: "Baby, Kids & Nursery", label: "Kids" },
    { key: "Artisan Crafts & Handmade Ceramics", label: "Crafts" },
    { key: "Outdoor, Hiking & Travel Gear", label: "Travel & Outdoor" },
    { key: "Pet Supplies, Food & Accessories", label: "Pets" },
    { key: "Mobiles, Cases & Tech Accessories", label: "Mobiles" },
  ];

  const fontOptions = [
    { label: "Inter (Modern Minimal)", value: "Inter, -apple-system, sans-serif" },
    { label: "Plus Jakarta Sans (Crisp Tech)", value: "'Plus Jakarta Sans', sans-serif" },
    { label: "Outfit (Geometric Clean)", value: "Outfit, sans-serif" },
    { label: "Playfair Display (Luxury Serif)", value: "'Playfair Display', serif" },
    { label: "Syne (Editorial Streetwear)", value: "Syne, sans-serif" },
    { label: "Space Grotesk (Tech High-End)", value: "'Space Grotesk', monospace" },
  ];

  const heroImagePresets = [
    { label: "General Retail", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85" },
    { label: "Fashion Lookbook", url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" },
    { label: "Electronics & Audio", url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=85" },
    { label: "Organic Botanicals", url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85" },
    { label: "Fine Jewelry", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85" },
    { label: "Modern Living", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85" },
  ];

  const loadTheme = () => {
    setLoading(true);
    fetch("/api/admin/permissions")
      .then((res) => res.json())
      .then((perm) => {
        if (perm && perm.plan) setPermissions(perm);
      })
      .catch(() => {});

    fetch("/api/admin/themes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.theme) {
          setThemeConfig(data.theme);
          let loadedCustom: AvroThemeDefinition[] = [];
          if (Array.isArray(data.customThemes)) {
            loadedCustom = data.customThemes;
          }
          if (data.theme.socialLinksJson) {
            try {
              const parsed = JSON.parse(data.theme.socialLinksJson);
              if (Array.isArray(parsed?.customThemes) && parsed.customThemes.length > 0) {
                loadedCustom = parsed.customThemes;
              }
              setCustomOverrides((prev: any) => ({ ...prev, ...parsed }));
            } catch (e) {
              // ignore
            }
          }
          setCustomThemes(loadedCustom);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const handleApplyPreset = async (preset: AvroThemeDefinition) => {
    if (permissions?.plan === "BASIC" && !BASIC_ALLOWED_THEMES.includes(preset.code)) {
      setUpgradeModalOpen(true);
      return;
    }

    setActivatingCode(preset.code);
    const newOverrides = {
      backgroundColor: preset.palette.background,
      cardBg: preset.palette.cardBg,
      textColor: preset.palette.text,
      textMuted: preset.palette.textMuted,
      buttonRadius: preset.typography.buttonRadius,
      badgeRadius: preset.typography.badgeRadius,
      heroBadge: preset.hero.badge,
      headlineHighlight: preset.hero.headlineHighlight || "",
      ctaPrimary: preset.hero.ctaPrimary,
      ctaSecondary: preset.hero.ctaSecondary,
      announcementBg: preset.announcementBar.bg,
      announcementTextColor: preset.announcementBar.textColor,
      trustBadges: preset.trustBadges,
    };

    const newConfig = {
      ...themeConfig,
      activeTheme: preset.code,
      brandName: `${preset.name} Store`,
      primaryColor: preset.palette.primary,
      accentColor: preset.palette.accent,
      fontFamily: preset.typography.fontFamily,
      bannerHeadline: preset.hero.headline,
      bannerSubheadline: preset.hero.subheadline,
      bannerImageUrl: preset.hero.imageUrl,
      announcementBarText: preset.announcementBar.text,
      showAnnouncementBar: true,
      socialLinksJson: JSON.stringify(newOverrides),
    };

    setThemeConfig(newConfig);
    setCustomOverrides(newOverrides);

    try {
      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } finally {
      setActivatingCode(null);
    }
  };

  const handleSaveTheme = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (permissions?.featureMatrix?.themeCustomization?.allowed === false) {
      setUpgradeModalOpen(true);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const payload = {
      ...themeConfig,
      customThemes,
      socialLinksJson: JSON.stringify({
        ...customOverrides,
        customThemes,
      }),
    };

    try {
      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else if (res.status === 403) {
        setUpgradeModalOpen(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddThemeSlide = () => {
    const existing = Array.isArray(customOverrides.heroSlides) ? customOverrides.heroSlides : [];
    const newSlide = {
      id: `slide-${Date.now()}`,
      mediaType: "image",
      mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
      badge: "FEATURED AD",
      title: "Special Summer Promotion",
      subtitle: "Discover exclusive discounts on top items.",
      ctaText: "Shop Offer",
      ctaLink: "/shop",
    };
    setCustomOverrides({ ...customOverrides, heroSlides: [...existing, newSlide] });
  };

  const handleUpdateThemeSlide = (index: number, field: string, value: any) => {
    const existing = Array.isArray(customOverrides.heroSlides) ? [...customOverrides.heroSlides] : [];
    existing[index] = { ...existing[index], [field]: value };
    setCustomOverrides({ ...customOverrides, heroSlides: existing });
  };

  const handleDeleteThemeSlide = (index: number) => {
    const existing = Array.isArray(customOverrides.heroSlides) ? customOverrides.heroSlides : [];
    setCustomOverrides({ ...customOverrides, heroSlides: existing.filter((_: any, i: number) => i !== index) });
  };

  const handleThemeSlideFileUpload = async (file: File, index: number) => {
    if (!file) return;
    setUploadingThemeSlideIndex(index);
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
        const existing = Array.isArray(customOverrides.heroSlides) ? [...customOverrides.heroSlides] : [];
        existing[index] = {
          ...existing[index],
          mediaUrl: result.url,
          mediaType: isVideo ? "video" : "image",
        };
        setCustomOverrides({ ...customOverrides, heroSlides: existing });
      } else {
        alert(result.error || "File upload failed.");
      }
    } catch (e: any) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploadingThemeSlideIndex(null);
    }
  };

  // ----------------------------------------------------
  // CUSTOM THEMES ENGINE (GROW & PLUS UNLOCKED)
  // ----------------------------------------------------

  const handleOpenCreateNewTheme = (basePresetCode?: string) => {
    if (permissions?.plan === "BASIC") {
      setUpgradeModalOpen(true);
      return;
    }

    const base =
      AVRO_THEMES.find((t) => t.code === basePresetCode || t.id === basePresetCode) ||
      AVRO_THEMES[12]; // Default AVRO Signature

    setEditingThemeId(null);
    setCtName("");
    setCtIndustry(base.industry || "Fashion & Apparel");
    setCtTagline("");
    setCtBasePreset(base.code);
    setCtPrimary(base.palette.primary);
    setCtAccent(base.palette.accent);
    setCtBackground(base.palette.background);
    setCtCardBg(base.palette.cardBg);
    setCtText(base.palette.text);
    setCtTextMuted(base.palette.textMuted);
    setCtBorder(base.palette.border);
    setCtHeaderBg(base.palette.headerBg || "#FFFFFF");
    setCtFooterBg(base.palette.footerBg || "#0A192F");
    setCtFontFamily(base.typography.fontFamily);
    setCtHeadingClass(base.typography.headingClass);
    setCtButtonRadius(base.typography.buttonRadius);
    setCtBadgeRadius(base.typography.badgeRadius);
    setCtHeroHeadline(base.hero.headline);
    setCtHeroHighlight(base.hero.headlineHighlight || "");
    setCtHeroSubheadline(base.hero.subheadline);
    setCtHeroBadge(base.hero.badge);
    setCtHeroCtaPrimary(base.hero.ctaPrimary);
    setCtHeroImageUrl(base.hero.imageUrl);
    setCtAnnouncementText(base.announcementBar.text);
    setCtAnnouncementBg(base.announcementBar.bg);
    setCtAnnouncementTextColor(base.announcementBar.textColor);
    setCtShowAnnouncement(true);
    setCustomModalOpen(true);
  };

  const handleEditCustomTheme = (theme: AvroThemeDefinition) => {
    setEditingThemeId(theme.id);
    setCtName(theme.name);
    setCtIndustry(theme.industry);
    setCtTagline(theme.tagline);
    setCtBasePreset(theme.code);
    setCtPrimary(theme.palette.primary);
    setCtAccent(theme.palette.accent);
    setCtBackground(theme.palette.background);
    setCtCardBg(theme.palette.cardBg);
    setCtText(theme.palette.text);
    setCtTextMuted(theme.palette.textMuted);
    setCtBorder(theme.palette.border);
    setCtHeaderBg(theme.palette.headerBg || "#FFFFFF");
    setCtFooterBg(theme.palette.footerBg || "#0A192F");
    setCtFontFamily(theme.typography.fontFamily);
    setCtHeadingClass(theme.typography.headingClass);
    setCtButtonRadius(theme.typography.buttonRadius);
    setCtBadgeRadius(theme.typography.badgeRadius);
    setCtHeroHeadline(theme.hero.headline);
    setCtHeroHighlight(theme.hero.headlineHighlight || "");
    setCtHeroSubheadline(theme.hero.subheadline);
    setCtHeroBadge(theme.hero.badge);
    setCtHeroCtaPrimary(theme.hero.ctaPrimary);
    setCtHeroImageUrl(theme.hero.imageUrl);
    setCtAnnouncementText(theme.announcementBar.text);
    setCtAnnouncementBg(theme.announcementBar.bg);
    setCtAnnouncementTextColor(theme.announcementBar.textColor);
    setCtShowAnnouncement(true);
    setCustomModalOpen(true);
  };

  const handleSaveCustomTheme = async (activateNow: boolean = false) => {
    if (permissions?.plan === "BASIC") {
      setCustomModalOpen(false);
      setUpgradeModalOpen(true);
      return;
    }

    if (!ctName.trim()) {
      alert("Please enter a name for your custom theme.");
      return;
    }

    setIsSaving(true);

    const baseTheme = AVRO_THEMES.find((t) => t.code === ctBasePreset) || AVRO_THEMES[12];
    const timestamp = Date.now();
    const themeId = editingThemeId || `custom-${timestamp}`;
    const themeCode = editingThemeId
      ? (customThemes.find((t) => t.id === editingThemeId)?.code || `CUSTOM_${timestamp}`)
      : `CUSTOM_${timestamp}`;

    const newThemeDef: AvroThemeDefinition = {
      id: themeId,
      code: themeCode,
      name: ctName.trim(),
      industry: ctIndustry,
      referenceUrl: "#",
      referenceDisplay: "Custom Merchant Theme",
      tagline: ctTagline.trim() || `Exclusive custom theme for ${ctName}`,
      description: `Custom branded theme with bespoke ${ctIndustry.toLowerCase()} visual styling, typography, and layout rules.`,
      isIncludedInFree: false,
      palette: {
        primary: ctPrimary,
        accent: ctAccent,
        background: ctBackground,
        cardBg: ctCardBg,
        text: ctText,
        textMuted: ctTextMuted,
        border: ctBorder,
        badgeBg: ctPrimary,
        badgeText: "#FFFFFF",
        headerBg: ctHeaderBg,
        footerBg: ctFooterBg,
        accentGlow: "rgba(37,99,235,0.08)",
      },
      typography: {
        fontFamily: ctFontFamily,
        headingClass: ctHeadingClass,
        bodyClass: "font-sans",
        buttonRadius: ctButtonRadius,
        badgeRadius: ctBadgeRadius,
      },
      hero: {
        badge: ctHeroBadge || "EXCLUSIVE COLLECTION",
        headline: ctHeroHeadline || ctName,
        headlineHighlight: ctHeroHighlight || "",
        subheadline: ctHeroSubheadline || "Discover handcrafted products and curated essentials.",
        ctaPrimary: ctHeroCtaPrimary || "Shop Collection",
        ctaSecondary: "Explore Catalog",
        imageUrl: ctHeroImageUrl,
        style: "editorial-split",
      },
      announcementBar: {
        text: ctAnnouncementText,
        bg: ctAnnouncementBg,
        textColor: ctAnnouncementTextColor,
      },
      trustBadges: baseTheme.trustBadges || [
        { title: "Express Dispatch", subtitle: "Shipped within 24 hours", icon: "truck" },
        { title: "Safe & Encrypted Checkout", subtitle: "256-bit SSL encrypted payments", icon: "shield" },
        { title: "Verified Authentic", subtitle: "100% Genuine manufacturer guarantee", icon: "award" },
        { title: "7-Day Easy Replacement", subtitle: "Zero hassle doorstep resolution", icon: "refresh" },
      ],
      sampleCategories: baseTheme.sampleCategories || [],
      sampleProducts: baseTheme.sampleProducts || [],
    };

    let updatedList: AvroThemeDefinition[];
    if (editingThemeId) {
      updatedList = customThemes.map((t) => (t.id === editingThemeId ? newThemeDef : t));
    } else {
      updatedList = [newThemeDef, ...customThemes];
    }

    setCustomThemes(updatedList);

    // Prepare payload
    let payloadConfig = { ...themeConfig };
    let newOverrides = { ...customOverrides, customThemes: updatedList };

    if (activateNow) {
      newOverrides = {
        ...newOverrides,
        backgroundColor: newThemeDef.palette.background,
        cardBg: newThemeDef.palette.cardBg,
        textColor: newThemeDef.palette.text,
        textMuted: newThemeDef.palette.textMuted,
        buttonRadius: newThemeDef.typography.buttonRadius,
        badgeRadius: newThemeDef.typography.badgeRadius,
        heroBadge: newThemeDef.hero.badge,
        headlineHighlight: newThemeDef.hero.headlineHighlight || "",
        ctaPrimary: newThemeDef.hero.ctaPrimary,
        ctaSecondary: newThemeDef.hero.ctaSecondary,
        announcementBg: newThemeDef.announcementBar.bg,
        announcementTextColor: newThemeDef.announcementBar.textColor,
        trustBadges: newThemeDef.trustBadges,
      };

      payloadConfig = {
        ...payloadConfig,
        activeTheme: newThemeDef.code,
        brandName: `${newThemeDef.name} Store`,
        primaryColor: newThemeDef.palette.primary,
        accentColor: newThemeDef.palette.accent,
        fontFamily: newThemeDef.typography.fontFamily,
        bannerHeadline: newThemeDef.hero.headline,
        bannerSubheadline: newThemeDef.hero.subheadline,
        bannerImageUrl: newThemeDef.hero.imageUrl,
        announcementBarText: newThemeDef.announcementBar.text,
        showAnnouncementBar: ctShowAnnouncement,
      };

      setThemeConfig(payloadConfig);
      setCustomOverrides(newOverrides);
    }

    payloadConfig.socialLinksJson = JSON.stringify(newOverrides);
    payloadConfig.customThemes = updatedList;

    try {
      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadConfig),
      });

      if (res.ok) {
        setCustomModalOpen(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else if (res.status === 403) {
        setCustomModalOpen(false);
        setUpgradeModalOpen(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivateCustomTheme = async (theme: AvroThemeDefinition) => {
    if (permissions?.plan === "BASIC") {
      setUpgradeModalOpen(true);
      return;
    }

    setActivatingCode(theme.code);
    const newOverrides = {
      ...customOverrides,
      backgroundColor: theme.palette.background,
      cardBg: theme.palette.cardBg,
      textColor: theme.palette.text,
      textMuted: theme.palette.textMuted,
      buttonRadius: theme.typography.buttonRadius,
      badgeRadius: theme.typography.badgeRadius,
      heroBadge: theme.hero.badge,
      headlineHighlight: theme.hero.headlineHighlight || "",
      ctaPrimary: theme.hero.ctaPrimary,
      ctaSecondary: theme.hero.ctaSecondary,
      announcementBg: theme.announcementBar.bg,
      announcementTextColor: theme.announcementBar.textColor,
      trustBadges: theme.trustBadges,
      customThemes,
    };

    const newConfig = {
      ...themeConfig,
      activeTheme: theme.code,
      brandName: `${theme.name} Store`,
      primaryColor: theme.palette.primary,
      accentColor: theme.palette.accent,
      fontFamily: theme.typography.fontFamily,
      bannerHeadline: theme.hero.headline,
      bannerSubheadline: theme.hero.subheadline,
      bannerImageUrl: theme.hero.imageUrl,
      announcementBarText: theme.announcementBar.text,
      showAnnouncementBar: true,
      socialLinksJson: JSON.stringify(newOverrides),
      customThemes,
    };

    setThemeConfig(newConfig);
    setCustomOverrides(newOverrides);

    try {
      const res = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } finally {
      setActivatingCode(null);
    }
  };

  const handleDuplicateCustomTheme = async (theme: AvroThemeDefinition) => {
    if (permissions?.plan === "BASIC") {
      setUpgradeModalOpen(true);
      return;
    }

    const timestamp = Date.now();
    const clonedTheme: AvroThemeDefinition = {
      ...theme,
      id: `custom-${timestamp}`,
      code: `CUSTOM_${timestamp}`,
      name: `${theme.name} (Copy)`,
    };

    const updated = [clonedTheme, ...customThemes];
    setCustomThemes(updated);

    const newOverrides = { ...customOverrides, customThemes: updated };
    await fetch("/api/admin/themes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...themeConfig,
        customThemes: updated,
        socialLinksJson: JSON.stringify(newOverrides),
      }),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteCustomTheme = async (themeId: string) => {
    const target = customThemes.find((t) => t.id === themeId);
    if (!target) return;
    if (!confirm(`Are you sure you want to delete the custom theme "${target.name}"?`)) return;

    const updated = customThemes.filter((t) => t.id !== themeId);
    setCustomThemes(updated);

    const isCurrentActive =
      themeConfig?.activeTheme === target.code || themeConfig?.activeTheme === target.id;

    const newOverrides = { ...customOverrides, customThemes: updated };
    const payload: any = {
      ...themeConfig,
      customThemes: updated,
      socialLinksJson: JSON.stringify(newOverrides),
    };

    if (isCurrentActive) {
      payload.activeTheme = "AVRO_SIGNATURE";
      setThemeConfig((prev: any) => ({ ...prev, activeTheme: "AVRO_SIGNATURE" }));
    }

    await fetch("/api/admin/themes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredThemes =
    selectedFilter === "ALL"
      ? AVRO_THEMES
      : AVRO_THEMES.filter((t) => t.industry === selectedFilter);

  if (loading) {
    return <div className="text-xs text-slate-500 py-16 text-center">Loading AVRO Visual Theme Engine...</div>;
  }

  const allThemesList = [...customThemes, ...AVRO_THEMES];
  const activeThemeObj =
    allThemesList.find(
      (t) =>
        t.code === themeConfig?.activeTheme ||
        t.id === themeConfig?.activeTheme ||
        (themeConfig?.activeTheme === "TALIM_DEFAULT" && t.code === "AVRO_SIGNATURE")
    ) || AVRO_THEMES[12];

  const previewWidthClass =
    viewportMode === "mobile"
      ? "max-w-[390px]"
      : viewportMode === "tablet"
      ? "max-w-[768px]"
      : "w-full";

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              AVRO THEME STUDIO 2026
            </span>
            <span className="text-xs text-slate-400">· Active Preset: {activeThemeObj.name}</span>
          </div>
          <h1 className="text-2xl font-black text-[#0A192F] mt-1">Store Theme & Visual Editor</h1>
          <p className="text-xs text-slate-500">
            Customize typography, branding palette, announcements, hero banner, and trust badges with live preview.
          </p>
        </div>

        {/* Action Buttons & Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Navigation Tabs */}
          <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("EDITOR")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "EDITOR"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
              Visual Theme Editor
            </button>
            <button
              onClick={() => {
                if (permissions?.plan === "BASIC") {
                  setUpgradeModalOpen(true);
                } else {
                  setActiveTab("CUSTOM");
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "CUSTOM"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Custom Themes</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                {customThemes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("LIBRARY")}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "LIBRARY"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              13 Preset Archetypes
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCreateNewTheme()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Create Custom Theme</span>
          </button>

          <a
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={() => handleSaveTheme()}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Theme customizations published! Your live storefront reflects all changes instantly.</span>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs text-emerald-800 underline hover:text-emerald-950 flex items-center gap-1"
          >
            Inspect Storefront <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Locked Feature Notice if on Basic Plan */}
      {permissions && permissions.featureMatrix.themeCustomization?.allowed === false && (
        <LockedFeatureBanner
          feature="themeCustomization"
          currentPlan={permissions.plan}
          onUpgradeSuccess={loadTheme}
        />
      )}

      {/* TAB 1: VISUAL THEME EDITOR (SPLIT PANE) */}
      {activeTab === "EDITOR" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE: CUSTOMIZER CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
            {/* Editor Sub-Tabs Navigation */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/70 p-1.5 overflow-x-auto text-[11px] font-bold gap-1 scrollbar-none">
              <button
                onClick={() => setEditorSection("COLORS")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "COLORS"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Colors & Palette
              </button>
              <button
                onClick={() => setEditorSection("TYPOGRAPHY")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "TYPOGRAPHY"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Typography & Shapes
              </button>
              <button
                onClick={() => setEditorSection("HERO")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "HERO"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Hero Banner
              </button>
              <button
                onClick={() => setEditorSection("ANNOUNCEMENT")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "ANNOUNCEMENT"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Announcement
              </button>
              <button
                onClick={() => setEditorSection("TRUST")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "TRUST"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Trust Badges
              </button>
              <button
                onClick={() => setEditorSection("FOOTER")}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  editorSection === "FOOTER"
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Branding
              </button>
            </div>

            {/* Sub-Section 1: Colors & Palette */}
            {editorSection === "COLORS" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Color System & Surfaces</h3>
                  <p className="text-[11px] text-slate-500">Fine-tune the brand accents, store backdrop, and card styling.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeConfig.primaryColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, primaryColor: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Accent / Action Color</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, accentColor: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={themeConfig.accentColor}
                        onChange={(e) => setThemeConfig({ ...themeConfig, accentColor: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Store Background</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.backgroundColor}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.backgroundColor}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, backgroundColor: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Card / Surface Bg</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.cardBg}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, cardBg: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.cardBg}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, cardBg: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Headline Text Color</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.textColor}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, textColor: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.textColor}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, textColor: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Muted Text Color</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.textMuted}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, textMuted: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.textMuted}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, textMuted: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Swatch Presets */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 mb-2">Popular Color Harmonies</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Navy & Blue", p: "#0A192F", a: "#2563EB", bg: "#F8FAFC", card: "#FFFFFF", text: "#0F172A" },
                      { name: "Monochrome Dark", p: "#09090B", a: "#18181B", bg: "#FAFAFA", card: "#FFFFFF", text: "#09090B" },
                      { name: "Organic Forest", p: "#064E3B", a: "#059669", bg: "#F0FDF4", card: "#FFFFFF", text: "#064E3B" },
                      { name: "Royal Gold", p: "#451A03", a: "#D97706", bg: "#FFFBEB", card: "#FFFFFF", text: "#451A03" },
                      { name: "Berry Rose", p: "#4C0519", a: "#BE123C", bg: "#FFF1F2", card: "#FFFFFF", text: "#4C0519" },
                      { name: "Cyber Volt", p: "#0B0F19", a: "#3B82F6", bg: "#090D16", card: "#111827", text: "#F8FAFC" },
                    ].map((sw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setThemeConfig({ ...themeConfig, primaryColor: sw.p, accentColor: sw.a });
                          setCustomOverrides({
                            ...customOverrides,
                            backgroundColor: sw.bg,
                            cardBg: sw.card,
                            textColor: sw.text,
                          });
                        }}
                        className="p-2 border border-slate-200 rounded-lg hover:border-blue-400 text-left transition-all bg-white"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: sw.p }} />
                          <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: sw.a }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate block">{sw.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 2: Typography & Shapes */}
            {editorSection === "TYPOGRAPHY" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Typography & Border Radii</h3>
                  <p className="text-[11px] text-slate-500">Define the global font style and corner roundness.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Primary Font Family</label>
                  <select
                    value={themeConfig.fontFamily}
                    onChange={(e) => setThemeConfig({ ...themeConfig, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {fontOptions.map((f, i) => (
                      <option key={i} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Button Corner Curvature</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Sharp", value: "rounded-none" },
                      { label: "Rounded", value: "rounded-md" },
                      { label: "Soft Curve", value: "rounded-xl" },
                      { label: "Full Pill", value: "rounded-full" },
                    ].map((b, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomOverrides({ ...customOverrides, buttonRadius: b.value })}
                        className={`py-2 px-1 text-center font-bold text-[11px] border rounded-lg transition-all ${
                          customOverrides.buttonRadius === b.value
                            ? "bg-[#0A192F] text-white border-[#0A192F]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Badge Curvature</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Sharp Square", value: "rounded-none" },
                      { label: "Soft Badge", value: "rounded-md" },
                      { label: "Full Pill", value: "rounded-full" },
                    ].map((b, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomOverrides({ ...customOverrides, badgeRadius: b.value })}
                        className={`py-2 px-1 text-center font-bold text-[11px] border rounded-lg transition-all ${
                          customOverrides.badgeRadius === b.value
                            ? "bg-[#0A192F] text-white border-[#0A192F]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 3: Hero Banner */}
            {editorSection === "HERO" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Homepage Hero Banner</h3>
                  <p className="text-[11px] text-slate-500">Edit the primary headline, highlight word, and imagery.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hero Micro-Badge</label>
                  <input
                    type="text"
                    value={customOverrides.heroBadge}
                    onChange={(e) => setCustomOverrides({ ...customOverrides, heroBadge: e.target.value })}
                    placeholder="Micro-badge text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Headline Text</label>
                    <input
                      type="text"
                      value={themeConfig.bannerHeadline}
                      onChange={(e) => setThemeConfig({ ...themeConfig, bannerHeadline: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Accent Word (Italic)</label>
                    <input
                      type="text"
                      value={customOverrides.headlineHighlight}
                      onChange={(e) => setCustomOverrides({ ...customOverrides, headlineHighlight: e.target.value })}
                      placeholder="Accent word / phrase"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subheadline Description</label>
                  <textarea
                    rows={2}
                    value={themeConfig.bannerSubheadline}
                    onChange={(e) => setThemeConfig({ ...themeConfig, bannerSubheadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={customOverrides.ctaPrimary}
                      onChange={(e) => setCustomOverrides({ ...customOverrides, ctaPrimary: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Secondary CTA Button</label>
                    <input
                      type="text"
                      value={customOverrides.ctaSecondary}
                      onChange={(e) => setCustomOverrides({ ...customOverrides, ctaSecondary: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">Hero Banner Image</label>
                    <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      {isUploadingHero ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>{isUploadingHero ? "Uploading..." : "Upload from PC"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingHero(true);
                          try {
                            const data = new FormData();
                            data.append("file", file);
                            const res = await fetch("/api/admin/media", {
                              method: "POST",
                              body: data,
                            });
                            const result = await res.json();
                            if (result.success && result.url) {
                              setThemeConfig({ ...themeConfig, bannerImageUrl: result.url });
                            }
                          } catch (err) {
                            console.error(err);
                          } finally {
                            setIsUploadingHero(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={themeConfig.bannerImageUrl || ""}
                    onChange={(e) => setThemeConfig({ ...themeConfig, bannerImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {heroImagePresets.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setThemeConfig({ ...themeConfig, bannerImageUrl: preset.url })}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-semibold"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HERO BANNER ADS & SLIDER (IMAGES & VIDEO) */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Hero Banner Ads & Video Scroller</h4>
                      <p className="text-[10px] text-slate-500">
                        {Array.isArray(customOverrides.heroSlides) ? customOverrides.heroSlides.length : 0} active slide(s) on right carousel.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddThemeSlide}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] border border-purple-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Ad Slide</span>
                    </button>
                  </div>

                  {Array.isArray(customOverrides.heroSlides) && customOverrides.heroSlides.length > 0 && (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {customOverrides.heroSlides.map((slide: any, idx: number) => {
                        const isUploading = uploadingThemeSlideIndex === idx;

                        return (
                          <div
                            key={slide.id || idx}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[11px] text-slate-800">
                                Slide #{idx + 1} ({slide.mediaType === "video" ? "Video" : "Image"})
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateThemeSlide(
                                      idx,
                                      "mediaType",
                                      slide.mediaType === "video" ? "image" : "video"
                                    )
                                  }
                                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700"
                                >
                                  {slide.mediaType === "video" ? "Switch to Image" : "Switch to Video"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteThemeSlide(idx)}
                                  className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <label className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                                {isUploading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3" />
                                )}
                                <span>Upload File from PC</span>
                                <input
                                  type="file"
                                  accept={slide.mediaType === "video" ? "video/*" : "image/*"}
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleThemeSlideFileUpload(e.target.files[0], idx);
                                    }
                                  }}
                                />
                              </label>
                              <input
                                type="text"
                                value={slide.mediaUrl || ""}
                                onChange={(e) => handleUpdateThemeSlide(idx, "mediaUrl", e.target.value)}
                                placeholder="Media URL link"
                                className="flex-1 px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-mono bg-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={slide.badge || ""}
                                onChange={(e) => handleUpdateThemeSlide(idx, "badge", e.target.value)}
                                placeholder="Badge label"
                                className="px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={slide.title || ""}
                                onChange={(e) => handleUpdateThemeSlide(idx, "title", e.target.value)}
                                placeholder="Slide title"
                                className="px-2 py-1 border border-slate-200 rounded bg-white text-[11px] font-bold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={slide.ctaText || ""}
                                onChange={(e) => handleUpdateThemeSlide(idx, "ctaText", e.target.value)}
                                placeholder="Button text"
                                className="px-2 py-1 border border-slate-200 rounded bg-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={slide.ctaLink || ""}
                                onChange={(e) => handleUpdateThemeSlide(idx, "ctaLink", e.target.value)}
                                placeholder="Destination link"
                                className="px-2 py-1 border border-slate-200 rounded bg-white text-[11px] font-mono"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-Section 4: Top Announcement Bar */}
            {editorSection === "ANNOUNCEMENT" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Top Announcement Banner</h3>
                  <p className="text-[11px] text-slate-500">Configure promotional alerts, free shipping reminders, and sales.</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-800">Show Announcement Bar</span>
                  <input
                    type="checkbox"
                    checked={themeConfig.showAnnouncementBar}
                    onChange={(e) => setThemeConfig({ ...themeConfig, showAnnouncementBar: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Announcement Message</label>
                  <input
                    type="text"
                    value={themeConfig.announcementBarText || ""}
                    onChange={(e) => setThemeConfig({ ...themeConfig, announcementBarText: e.target.value })}
                    placeholder="Announcement bar message"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Banner Background</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.announcementBg || "#0A192F"}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, announcementBg: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.announcementBg || "#0A192F"}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, announcementBg: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Banner Text Color</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <input
                        type="color"
                        value={customOverrides.announcementTextColor || "#FFFFFF"}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, announcementTextColor: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customOverrides.announcementTextColor || "#FFFFFF"}
                        onChange={(e) => setCustomOverrides({ ...customOverrides, announcementTextColor: e.target.value })}
                        className="w-full text-xs font-mono bg-transparent outline-none uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Section 5: Trust Badges */}
            {editorSection === "TRUST" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Value & Trust Badges</h3>
                  <p className="text-[11px] text-slate-500">Edit the 4 storefront guarantee badges and their icons.</p>
                </div>

                <div className="space-y-3">
                  {(customOverrides.trustBadges || []).map((badge: any, i: number) => (
                    <div key={i} className="p-3 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-slate-700">Badge #{i + 1}</span>
                        <select
                          value={badge.icon}
                          onChange={(e) => {
                            const newBadges = [...customOverrides.trustBadges];
                            newBadges[i].icon = e.target.value;
                            setCustomOverrides({ ...customOverrides, trustBadges: newBadges });
                          }}
                          className="px-2 py-1 text-[11px] rounded border border-slate-200 bg-white"
                        >
                          <option value="truck">Truck (Delivery)</option>
                          <option value="shield">Shield (Security)</option>
                          <option value="award">Award (Authentic)</option>
                          <option value="refresh">Refresh (Returns)</option>
                          <option value="heart">Heart (Customer Love)</option>
                          <option value="check">Check (Verified)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={badge.title}
                          onChange={(e) => {
                            const newBadges = [...customOverrides.trustBadges];
                            newBadges[i].title = e.target.value;
                            setCustomOverrides({ ...customOverrides, trustBadges: newBadges });
                          }}
                          placeholder="Title"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white font-bold"
                        />
                        <input
                          type="text"
                          value={badge.subtitle}
                          onChange={(e) => {
                            const newBadges = [...customOverrides.trustBadges];
                            newBadges[i].subtitle = e.target.value;
                            setCustomOverrides({ ...customOverrides, trustBadges: newBadges });
                          }}
                          placeholder="Subtitle"
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Section 6: Branding & Footer */}
            {editorSection === "FOOTER" && (
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900">Brand Name & Footer</h3>
                  <p className="text-[11px] text-slate-500">Configure global merchant branding and footer disclaimers.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store / Brand Name</label>
                  <input
                    type="text"
                    value={themeConfig.brandName}
                    onChange={(e) => setThemeConfig({ ...themeConfig, brandName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Footer Copyright Notice</label>
                  <textarea
                    rows={2}
                    value={themeConfig.footerText || ""}
                    onChange={(e) => setThemeConfig({ ...themeConfig, footerText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANE: LIVE INTERACTIVE PREVIEW CANVAS (7 COLS) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Viewport Toolbar */}
            <div className="bg-white border border-slate-200 rounded-xl p-2.5 px-4 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Simulated Canvas:</span>
                <span className="text-[11px] font-mono font-semibold text-[#2563EB]">
                  {viewportMode === "desktop" ? "Desktop (Full Width)" : viewportMode === "tablet" ? "Tablet (768px)" : "Mobile (390px)"}
                </span>
              </div>

              {/* Device Mode Switchers */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewportMode("desktop")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewportMode === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode("tablet")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewportMode === "tablet" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode("mobile")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewportMode === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="bg-slate-200/70 p-4 rounded-2xl flex justify-center overflow-x-auto min-h-[640px]">
              <div
                className={`bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300 transition-all duration-300 flex flex-col ${previewWidthClass}`}
                style={{
                  fontFamily: themeConfig.fontFamily,
                  backgroundColor: customOverrides.backgroundColor,
                  color: customOverrides.textColor,
                }}
              >
                {/* Simulated Browser Bar */}
                <div className="bg-slate-900 px-3 py-2 flex items-center justify-between text-slate-400 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-mono text-slate-300 bg-slate-800 px-3 py-0.5 rounded-md">
                    https://yourstore.com
                  </span>
                  <div className="w-8" />
                </div>

                {/* 1. Preview Announcement Bar */}
                {themeConfig.showAnnouncementBar && (
                  <div
                    className="py-1 px-4 text-center text-[10px] font-semibold"
                    style={{
                      backgroundColor: customOverrides.announcementBg || "#0A192F",
                      color: customOverrides.announcementTextColor || "#FFFFFF",
                    }}
                  >
                    {themeConfig.announcementBarText || "⚡ Free Shipping on orders over ₹999"}
                  </div>
                )}

                {/* 2. Preview Header / Nav */}
                <div
                  className="px-4 py-3 border-b flex items-center justify-between"
                  style={{
                    backgroundColor: customOverrides.cardBg,
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-0.5 rounded border border-slate-200">
                      <img src="/avro-logo.png" alt="AVROCART" className="h-5 w-auto object-contain" />
                    </div>
                    <span className="font-black text-xs" style={{ color: customOverrides.textColor }}>
                      {themeConfig.brandName}
                    </span>
                  </div>

                  <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-slate-500">
                    <span className="text-blue-600 font-bold">Home</span>
                    <span>Catalog</span>
                    <span>Track Order</span>
                    <span>About</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold text-white"
                      style={{ backgroundColor: themeConfig.primaryColor }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="text-[10px]">2</span>
                    </div>
                  </div>
                </div>

                {/* 3. Preview Hero Section */}
                <div
                  className="p-6 border-b flex flex-col md:flex-row items-center gap-6"
                  style={{
                    backgroundColor: customOverrides.cardBg,
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex-1 space-y-3">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: "rgba(37,99,235,0.1)",
                        color: themeConfig.accentColor,
                        borderRadius: customOverrides.badgeRadius === "rounded-full" ? "9999px" : "4px",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {customOverrides.heroBadge}
                    </div>

                    <h2
                      className="text-2xl sm:text-3xl font-black leading-tight tracking-tight"
                      style={{ color: customOverrides.textColor }}
                    >
                      {themeConfig.bannerHeadline}{" "}
                      {customOverrides.headlineHighlight && (
                        <span className="italic font-serif" style={{ color: themeConfig.accentColor }}>
                          {customOverrides.headlineHighlight}
                        </span>
                      )}
                    </h2>

                    <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: customOverrides.textMuted }}>
                      {themeConfig.bannerSubheadline}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        className="px-4 py-2 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                        style={{
                          backgroundColor: themeConfig.primaryColor,
                          borderRadius:
                            customOverrides.buttonRadius === "rounded-full"
                              ? "9999px"
                              : customOverrides.buttonRadius === "rounded-none"
                              ? "0px"
                              : "8px",
                        }}
                      >
                        <span>{customOverrides.ctaPrimary}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border font-bold text-[11px] uppercase tracking-wider"
                        style={{
                          borderColor: "rgba(0,0,0,0.15)",
                          color: customOverrides.textColor,
                          borderRadius:
                            customOverrides.buttonRadius === "rounded-full"
                              ? "9999px"
                              : customOverrides.buttonRadius === "rounded-none"
                              ? "0px"
                              : "8px",
                        }}
                      >
                        {customOverrides.ctaSecondary}
                      </button>
                    </div>
                  </div>

                  <div className="w-full md:w-48 aspect-square rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-black/5 relative">
                    {Array.isArray(customOverrides.heroSlides) && customOverrides.heroSlides.length > 0 ? (
                      customOverrides.heroSlides[0].mediaType === "video" ? (
                        <video
                          src={customOverrides.heroSlides[0].mediaUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={customOverrides.heroSlides[0].mediaUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <img
                        src={themeConfig.bannerImageUrl || activeThemeObj.hero.imageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {Array.isArray(customOverrides.heroSlides) && customOverrides.heroSlides.length > 0 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black/70 text-white">
                        {customOverrides.heroSlides.length} Slide(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* 4. Preview Trust Badges */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 border-b border-black/5">
                  {(customOverrides.trustBadges || []).slice(0, 4).map((tb: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(37,99,235,0.1)", color: themeConfig.accentColor }}
                      >
                        {tb.icon === "truck" ? (
                          <Truck className="w-3.5 h-3.5" />
                        ) : tb.icon === "shield" ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : tb.icon === "award" ? (
                          <Award className="w-3.5 h-3.5" />
                        ) : tb.icon === "heart" ? (
                          <Heart className="w-3.5 h-3.5" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="text-[10px] min-w-0">
                        <strong className="block font-bold truncate">{tb.title}</strong>
                        <span className="text-slate-400 block truncate text-[9px]">{tb.subtitle}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5. Preview Product Cards */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Sample Product Grid
                    </h4>
                    <span className="text-[10px] text-blue-600 font-bold">View All 4 items</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { title: "ANC Studio Headphones", price: "₹4,999", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
                      { title: "Minimalist Graphic Tee", price: "₹1,499", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80" },
                      { title: "Matte Desk Mat & Cable", price: "₹999", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80" },
                      { title: "Thermal Insulated Cup", price: "₹899", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
                    ].map((p, i) => (
                      <div
                        key={i}
                        className="rounded-lg border p-2 flex flex-col justify-between shadow-2xs"
                        style={{ backgroundColor: customOverrides.cardBg, borderColor: "rgba(0,0,0,0.08)" }}
                      >
                        <div className="aspect-square rounded-md overflow-hidden bg-slate-100 mb-2">
                          <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[10px] font-bold truncate leading-tight">{p.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] font-extrabold text-blue-600">{p.price}</span>
                          <button
                            type="button"
                            className="px-2 py-0.5 rounded text-[9px] font-bold text-white"
                            style={{ backgroundColor: themeConfig.primaryColor }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Preview Footer */}
                <div className="p-4 bg-slate-900 text-slate-400 text-[10px] text-center border-t border-slate-800 space-y-1 mt-auto">
                  <p>{themeConfig.footerText || "© 2026 AVRO Store. Powered by AVRO."}</p>
                  <p className="text-[9px] text-slate-500">Powered by AVRO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM THEMES GALLERY (GROW & PLUS) */}
      {activeTab === "CUSTOM" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#0A192F] via-[#112240] to-[#1E293B] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Bespoke Theme Studio
                </span>
                <span className="text-xs text-slate-400">· Grow & Plus Unlocked</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Custom Branded Themes</h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Design, save, and activate custom storefront themes with your own tailored colors, fonts, shapes, and hero banners. Add as many themes as you want for seasonal drops, flash sales, or bespoke branding.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateNewTheme()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Theme</span>
            </button>
          </div>

          {/* Grid of Saved Custom Themes */}
          {customThemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customThemes.map((th) => {
                const isActive =
                  themeConfig?.activeTheme === th.code ||
                  themeConfig?.activeTheme === th.id;
                const isActivating = activatingCode === th.code;

                return (
                  <div
                    key={th.id}
                    className={`rounded-2xl bg-white border overflow-hidden shadow-xs transition-all relative flex flex-col justify-between ${
                      isActive
                        ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Thumbnail Header */}
                      <div className="h-44 bg-slate-100 overflow-hidden relative group">
                        <img
                          src={th.hero.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85"}
                          alt={th.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white backdrop-blur-sm shadow-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            Custom Theme
                          </span>
                          {isActive ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                              <Check className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-slate-300">
                              {th.industry}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <h4 className="font-extrabold text-base tracking-tight">{th.name}</h4>
                          <p className="text-[11px] text-slate-200 truncate">{th.tagline || th.hero.headline}</p>
                        </div>
                      </div>

                      {/* Details & Palette */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {th.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-semibold">Custom Palette:</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: th.palette.primary }}
                              title={`Primary: ${th.palette.primary}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: th.palette.accent }}
                              title={`Accent: ${th.palette.accent}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: th.palette.background }}
                              title={`Backdrop: ${th.palette.background}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                              style={{ backgroundColor: th.palette.cardBg }}
                              title={`Surface: ${th.palette.cardBg}`}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Typography:</span>
                          <span className="font-mono text-slate-700 font-bold truncate max-w-[140px]">
                            {th.typography.fontFamily.split(",")[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <div className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Active on Storefront
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isActivating}
                            onClick={() => handleActivateCustomTheme(th)}
                            className="flex-1 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            {isActivating ? (
                              <span>Activating...</span>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                Activate Theme
                              </>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleEditCustomTheme(th)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                          title="Edit Theme Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateCustomTheme(th)}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                          title="Duplicate Theme"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCustomTheme(th.id)}
                          className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="Delete Theme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add Another Theme Card */}
              <div
                onClick={() => handleOpenCreateNewTheme()}
                className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Add Another Custom Theme
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Build and save another custom theme with unique branding, colors, and layout rules.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center shadow-xs">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">No Custom Themes Created Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  With your <strong>Grow Plan</strong>, you have access to the AVRO Bespoke Theme Studio. Create custom themes from scratch or clone any of the 13 presets to customize and save your own theme collection.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenCreateNewTheme()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Custom Theme</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("LIBRARY")}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Browse 13 Presets to Fork</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRESET THEME ARCHETYPES LIBRARY */}
      {activeTab === "LIBRARY" && (
        <div className="space-y-6">
          {/* Basic Plan Theme Limitation Alert */}
          {permissions && permissions.plan === "BASIC" && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Basic Plan Theme Limitation:</strong> Your plan includes 2 preset themes (AVRO Signature & Fashion Noir). Upgrade to <strong>Grow</strong> or <strong>Plus</strong> to unlock all 13 specialized archetypes and custom visual styling.
                </span>
              </div>
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Upgrade Plan
              </button>
            </div>
          )}

          {/* Active Preset Notification */}
          <div className="bg-gradient-to-r from-[#0A192F] to-[#1E293B] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                <img
                  src={activeThemeObj.hero.imageUrl}
                  alt={activeThemeObj.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 border border-blue-400/30">
                    CURRENT THEME
                  </span>
                  <span className="text-xs text-slate-400">{activeThemeObj.industry}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-0.5">{activeThemeObj.name} Theme</h2>
                <p className="text-xs text-slate-300">{activeThemeObj.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {permissions?.plan !== "BASIC" && (
                <button
                  type="button"
                  onClick={() => handleOpenCreateNewTheme(activeThemeObj.code)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Fork Active Theme</span>
                </button>
              )}
              <button
                onClick={() => setActiveTab("EDITOR")}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                Customize in Visual Editor
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {categories.map((c) => {
              const active = selectedFilter === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedFilter(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? "bg-[#0A192F] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* 13 Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((th) => {
              const isActive =
                themeConfig?.activeTheme === th.code ||
                themeConfig?.activeTheme === th.id ||
                (themeConfig?.activeTheme === "TALIM_DEFAULT" && th.code === "AVRO_SIGNATURE");
              const isActivating = activatingCode === th.code;
              const isThemeLocked = Boolean(
                permissions?.plan === "BASIC" && !BASIC_ALLOWED_THEMES.includes(th.code)
              );

              return (
                <div
                  key={th.id}
                  className={`rounded-2xl bg-white border overflow-hidden shadow-xs transition-all relative flex flex-col justify-between ${
                    isActive
                      ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-md"
                      : isThemeLocked
                      ? "border-amber-200/80 bg-slate-50/40"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="h-44 bg-slate-100 overflow-hidden relative group">
                      <img
                        src={th.hero.imageUrl}
                        alt={th.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm">
                          {th.industry}
                        </span>
                        {isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#2563EB] text-white flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> ACTIVE
                          </span>
                        ) : isThemeLocked ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/90 text-white flex items-center gap-1 shadow-sm">
                            <Lock className="w-3 h-3" /> GROW / PLUS
                          </span>
                        ) : null}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h4 className="font-extrabold text-base tracking-tight">{th.name}</h4>
                        <p className="text-[11px] text-slate-200 truncate">{th.tagline}</p>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {th.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold">Palette:</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: th.palette.primary }}
                            title="Primary"
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: th.palette.accent }}
                            title="Accent"
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: th.palette.cardBg }}
                            title="Surface"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex gap-2">
                    {isActive ? (
                      <div className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Active Preset
                      </div>
                    ) : isThemeLocked ? (
                      <button
                        type="button"
                        onClick={() => setUpgradeModalOpen(true)}
                        className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        Unlock with Grow / Plus
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          disabled={isActivating}
                          onClick={() => handleApplyPreset(th)}
                          className="flex-1 py-2 rounded-xl bg-[#0A192F] hover:bg-[#1E293B] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          {isActivating ? (
                            <span>Activating...</span>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              Apply Preset
                            </>
                          )}
                        </button>
                        {permissions?.plan !== "BASIC" && (
                          <button
                            type="button"
                            onClick={() => handleOpenCreateNewTheme(th.code)}
                            className="py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer shrink-0"
                            title="Fork into a new custom theme"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Fork</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM THEME BUILDER & DESIGNER */}
      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {editingThemeId ? "Edit Custom Theme" : "Create Custom Branded Theme"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure tailored palettes, typography, button radii, and hero branding for your store.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body (Split Form & Live Preview) */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-xs">
                {/* 1. Identity & Base Clone */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <span className="font-extrabold text-slate-800 text-xs block">1. Theme Identity & Quick-Start</span>
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Theme Name *</label>
                    <input
                      type="text"
                      required
                      value={ctName}
                      onChange={(e) => setCtName(e.target.value)}
                      placeholder="Theme brand name"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Industry Archetype</label>
                      <select
                        value={ctIndustry}
                        onChange={(e) => setCtIndustry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {categories.filter((c) => c.key !== "ALL").map((c) => (
                          <option key={c.key} value={c.key}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Clone Base Preset (Optional)</label>
                      <select
                        value={ctBasePreset}
                        onChange={(e) => {
                          const chosenCode = e.target.value;
                          setCtBasePreset(chosenCode);
                          const base = AVRO_THEMES.find((t) => t.code === chosenCode);
                          if (base) {
                            setCtPrimary(base.palette.primary);
                            setCtAccent(base.palette.accent);
                            setCtBackground(base.palette.background);
                            setCtCardBg(base.palette.cardBg);
                            setCtText(base.palette.text);
                            setCtTextMuted(base.palette.textMuted);
                            setCtBorder(base.palette.border);
                            setCtHeaderBg(base.palette.headerBg || "#FFFFFF");
                            setCtFooterBg(base.palette.footerBg || "#0A192F");
                            setCtFontFamily(base.typography.fontFamily);
                            setCtHeadingClass(base.typography.headingClass);
                            setCtButtonRadius(base.typography.buttonRadius);
                            setCtBadgeRadius(base.typography.badgeRadius);
                            setCtHeroHeadline(base.hero.headline);
                            setCtHeroHighlight(base.hero.headlineHighlight || "");
                            setCtHeroSubheadline(base.hero.subheadline);
                            setCtHeroBadge(base.hero.badge);
                            setCtHeroCtaPrimary(base.hero.ctaPrimary);
                            setCtHeroImageUrl(base.hero.imageUrl);
                            setCtAnnouncementText(base.announcementBar.text);
                            setCtAnnouncementBg(base.announcementBar.bg);
                            setCtAnnouncementTextColor(base.announcementBar.textColor);
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {AVRO_THEMES.map((th) => (
                          <option key={th.code} value={th.code}>{th.name} ({th.industry})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Theme Tagline</label>
                    <input
                      type="text"
                      value={ctTagline}
                      onChange={(e) => setCtTagline(e.target.value)}
                      placeholder="Theme tagline / brief description"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2. Color Palette */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <span className="font-extrabold text-slate-800 text-xs block">2. Custom Brand Palette</span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Primary Brand</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctPrimary}
                          onChange={(e) => setCtPrimary(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctPrimary}
                          onChange={(e) => setCtPrimary(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Accent / Action</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctAccent}
                          onChange={(e) => setCtAccent(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctAccent}
                          onChange={(e) => setCtAccent(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Store Backdrop</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctBackground}
                          onChange={(e) => setCtBackground(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctBackground}
                          onChange={(e) => setCtBackground(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Card / Surface</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctCardBg}
                          onChange={(e) => setCtCardBg(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctCardBg}
                          onChange={(e) => setCtCardBg(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Text Color</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctText}
                          onChange={(e) => setCtText(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctText}
                          onChange={(e) => setCtText(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-[11px]">Header Bar</label>
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                        <input
                          type="color"
                          value={ctHeaderBg}
                          onChange={(e) => setCtHeaderBg(e.target.value)}
                          className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={ctHeaderBg}
                          onChange={(e) => setCtHeaderBg(e.target.value)}
                          className="w-full text-[11px] font-mono outline-none uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Typography & UI Geometry */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <span className="font-extrabold text-slate-800 text-xs block">3. Typography & Corner Radii</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary Font Family</label>
                      <select
                        value={ctFontFamily}
                        onChange={(e) => setCtFontFamily(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
                      >
                        {fontOptions.map((f) => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Button Corner Radius</label>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setCtButtonRadius("rounded-none")}
                          className={`py-1.5 px-2 text-center text-[10px] font-bold border transition ${
                            ctButtonRadius === "rounded-none"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          Sharp (0px)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCtButtonRadius("rounded-xl")}
                          className={`py-1.5 px-2 rounded-xl text-center text-[10px] font-bold border transition ${
                            ctButtonRadius === "rounded-xl"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          Smooth
                        </button>
                        <button
                          type="button"
                          onClick={() => setCtButtonRadius("rounded-full")}
                          className={`py-1.5 px-2 rounded-full text-center text-[10px] font-bold border transition ${
                            ctButtonRadius === "rounded-full"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-slate-700 border-slate-300"
                          }`}
                        >
                          Pill
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Hero Banner Defaults */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <span className="font-extrabold text-slate-800 text-xs block">4. Homepage Hero Banner & Copy</span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hero Micro-Badge</label>
                      <input
                        type="text"
                        value={ctHeroBadge}
                        onChange={(e) => setCtHeroBadge(e.target.value)}
                        placeholder="Micro-badge text"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Primary CTA Button</label>
                      <input
                        type="text"
                        value={ctHeroCtaPrimary}
                        onChange={(e) => setCtHeroCtaPrimary(e.target.value)}
                        placeholder="Button label"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Main Headline</label>
                      <input
                        type="text"
                        value={ctHeroHeadline}
                        onChange={(e) => setCtHeroHeadline(e.target.value)}
                        placeholder="Hero main headline"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Accent Word (Italic)</label>
                      <input
                        type="text"
                        value={ctHeroHighlight}
                        onChange={(e) => setCtHeroHighlight(e.target.value)}
                        placeholder="Accent word / phrase"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hero Image URL</label>
                    <input
                      type="text"
                      value={ctHeroImageUrl}
                      onChange={(e) => setCtHeroImageUrl(e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-[11px]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {heroImagePresets.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setCtHeroImageUrl(img.url)}
                          className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-[10px] text-slate-600"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Announcement Bar */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs">5. Top Announcement Bar</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={ctShowAnnouncement}
                        onChange={(e) => setCtShowAnnouncement(e.target.checked)}
                        className="rounded"
                      />
                      <span>Enable Bar</span>
                    </label>
                  </div>

                  {ctShowAnnouncement && (
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={ctAnnouncementText}
                          onChange={(e) => setCtAnnouncementText(e.target.value)}
                          placeholder="Announcement bar message"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1 text-[11px]">Bar Background</label>
                          <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                            <input
                              type="color"
                              value={ctAnnouncementBg}
                              onChange={(e) => setCtAnnouncementBg(e.target.value)}
                              className="w-5 h-5 rounded border-none cursor-pointer"
                            />
                            <input
                              type="text"
                              value={ctAnnouncementBg}
                              onChange={(e) => setCtAnnouncementBg(e.target.value)}
                              className="w-full text-[11px] font-mono outline-none uppercase"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-600 mb-1 text-[11px]">Bar Text Color</label>
                          <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg p-1 bg-white">
                            <input
                              type="color"
                              value={ctAnnouncementTextColor}
                              onChange={(e) => setCtAnnouncementTextColor(e.target.value)}
                              className="w-5 h-5 rounded border-none cursor-pointer"
                            />
                            <input
                              type="text"
                              value={ctAnnouncementTextColor}
                              onChange={(e) => setCtAnnouncementTextColor(e.target.value)}
                              className="w-full text-[11px] font-mono outline-none uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Mockup Preview (5 cols) */}
              <div className="lg:col-span-5 sticky top-0 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    Real-Time Storefront Mockup
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Live Preview
                  </span>
                </div>

                {/* Simulated Storefront Card */}
                <div
                  className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg transition-all"
                  style={{
                    backgroundColor: ctBackground,
                    fontFamily: ctFontFamily,
                  }}
                >
                  {/* Mockup Announcement */}
                  {ctShowAnnouncement && (
                    <div
                      className="px-3 py-1.5 text-[9px] text-center font-bold truncate transition-colors"
                      style={{
                        backgroundColor: ctAnnouncementBg,
                        color: ctAnnouncementTextColor,
                      }}
                    >
                      {ctAnnouncementText}
                    </div>
                  )}

                  {/* Mockup Header */}
                  <div
                    className="px-3.5 py-2.5 border-b flex items-center justify-between transition-colors"
                    style={{
                      backgroundColor: ctHeaderBg,
                      borderColor: ctBorder,
                    }}
                  >
                    <span className="font-extrabold text-xs" style={{ color: ctText }}>
                      {ctName.trim() || "Brand Store"}
                    </span>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: ctTextMuted }}>
                      <span>Shop</span>
                      <span>Deals</span>
                      <ShoppingBag className="w-3.5 h-3.5" style={{ color: ctText }} />
                    </div>
                  </div>

                  {/* Mockup Hero */}
                  <div className="p-4 space-y-2.5 relative overflow-hidden">
                    <span
                      className="inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-full shadow-2xs"
                      style={{
                        backgroundColor: ctPrimary,
                        color: "#FFFFFF",
                      }}
                    >
                      {ctHeroBadge || "EXCLUSIVE COLLECTION"}
                    </span>

                    <h4
                      className="text-base font-black leading-tight tracking-tight line-clamp-2"
                      style={{ color: ctText }}
                    >
                      {ctHeroHeadline.trim() || ctName.trim() || "Your Store Headline"}{" "}
                      {ctHeroHighlight && (
                        <span className="italic" style={{ color: ctAccent }}>
                          {ctHeroHighlight}
                        </span>
                      )}
                    </h4>

                    <p className="text-[10px] line-clamp-2 leading-relaxed" style={{ color: ctTextMuted }}>
                      {ctHeroSubheadline || "Discover handcrafted products and curated essentials."}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-[10px] font-bold text-white shadow-xs ${ctButtonRadius}`}
                        style={{ backgroundColor: ctPrimary }}
                      >
                        {ctHeroCtaPrimary || "Shop Collection"}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1.5 text-[10px] font-bold border ${ctButtonRadius}`}
                        style={{
                          borderColor: ctBorder,
                          color: ctText,
                          backgroundColor: ctCardBg,
                        }}
                      >
                        Explore
                      </button>
                    </div>

                    {/* Hero Thumbnail */}
                    <div className="h-28 rounded-xl overflow-hidden mt-2 relative border" style={{ borderColor: ctBorder }}>
                      <img
                        src={ctHeroImageUrl}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Mockup Product Card Surface */}
                  <div className="p-3 border-t" style={{ borderColor: ctBorder }}>
                    <div
                      className="p-3 rounded-xl border space-y-2 shadow-2xs"
                      style={{
                        backgroundColor: ctCardBg,
                        borderColor: ctBorder,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold" style={{ color: ctText }}>
                          Featured Product
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: ctAccent }}>
                          ₹1,499
                        </span>
                      </div>
                      <div className="h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-[10px] text-slate-400">
                        Product Visual
                      </div>
                      <button
                        type="button"
                        className={`w-full py-1 text-[9px] font-bold text-white shadow-2xs ${ctButtonRadius}`}
                        style={{ backgroundColor: ctPrimary }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Mockup Footer */}
                  <div
                    className="p-3 text-[9px] text-center border-t text-white/80"
                    style={{ backgroundColor: ctFooterBg }}
                  >
                    <span>© {new Date().getFullYear()} {ctName.trim() || "Brand Store"}. Powered by AVRO.</span>
                  </div>
                </div>

                {/* Swatches strip */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 block">Active Theme Palette:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-center">
                      <div className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: ctPrimary }} />
                      <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">Primary</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: ctAccent }} />
                      <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">Accent</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: ctBackground }} />
                      <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">Backdrop</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: ctCardBg }} />
                      <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">Surface</span>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="h-6 rounded-lg border border-black/10" style={{ backgroundColor: ctText }} />
                      <span className="text-[9px] text-slate-400 mt-0.5 block font-mono">Text</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveCustomTheme(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-slate-600" />
                  <span>Save to Custom Library</span>
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveCustomTheme(true)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isSaving ? "Saving..." : "Save & Activate on Storefront"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Upgrade Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={permissions?.plan || "BASIC"}
        recommendedTarget="GROW"
        onSuccess={() => {
          loadTheme();
        }}
      />
    </div>
  );
}
