export const dynamic = "force-dynamic";

import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ArrowRight,
  ShoppingBag,
  Star,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Heart,
  ExternalLink,
  Flame,
} from "lucide-react";
import { AVRO_THEMES, AvroThemeDefinition } from "@/lib/themes-registry";
import { ProductCard } from "@/components/product-card";

function renderTrustIcon(icon: string) {
  switch (icon) {
    case "truck":
      return <Truck className="w-5 h-5" />;
    case "shield":
      return <Shield className="w-5 h-5" />;
    case "award":
      return <Award className="w-5 h-5" />;
    case "refresh":
      return <RotateCcw className="w-5 h-5" />;
    case "heart":
      return <Heart className="w-5 h-5" />;
    case "check":
    default:
      return <Check className="w-5 h-5" />;
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StoreHomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const themeParam = (
    typeof resolvedParams.theme === "string"
      ? resolvedParams.theme
      : typeof resolvedParams.previewTheme === "string"
      ? resolvedParams.previewTheme
      : undefined
  );

  const dbTheme = await prisma.storeThemeSetting.findFirst();

  // Find theme definition matching query param OR db setting
  const activeCode = themeParam || dbTheme?.activeTheme || "AVRO_SIGNATURE";
  const themeDef: AvroThemeDefinition =
    AVRO_THEMES.find(
      (t) =>
        t.code === activeCode ||
        t.id === activeCode ||
        t.id.toLowerCase() === activeCode.toLowerCase() ||
        t.code.toLowerCase() === activeCode.toLowerCase() ||
        (activeCode.toUpperCase() === "TALIM_DEFAULT" && t.code === "AVRO_SIGNATURE")
    ) || AVRO_THEMES[12]; // Fallback to AVRO Signature

  // Check if DB customizer has overrides
  let customOverrides: any = {};
  try {
    if (dbTheme?.socialLinksJson) {
      customOverrides = JSON.parse(dbTheme.socialLinksJson);
    }
  } catch (e) {}

  const primaryColor = !themeParam && dbTheme?.primaryColor ? dbTheme.primaryColor : themeDef.palette.primary;
  const accentColor = !themeParam && dbTheme?.accentColor ? dbTheme.accentColor : themeDef.palette.accent;
  const backgroundColor = !themeParam && customOverrides.backgroundColor ? customOverrides.backgroundColor : themeDef.palette.background;
  const cardBgColor = !themeParam && customOverrides.cardBg ? customOverrides.cardBg : themeDef.palette.cardBg;
  const textColor = !themeParam && customOverrides.textColor ? customOverrides.textColor : themeDef.palette.text;
  const textMutedColor = !themeParam && customOverrides.textMuted ? customOverrides.textMuted : themeDef.palette.textMuted;
  const buttonRadius = !themeParam && customOverrides.buttonRadius ? customOverrides.buttonRadius : themeDef.typography.buttonRadius;
  const badgeRadius = !themeParam && customOverrides.badgeRadius ? customOverrides.badgeRadius : themeDef.typography.badgeRadius;
  const heroBadge = !themeParam && (dbTheme?.heroBadge || customOverrides.heroBadge) ? (dbTheme?.heroBadge || customOverrides.heroBadge) : themeDef.hero.badge;
  const headlineHighlight = !themeParam && customOverrides.headlineHighlight !== undefined ? customOverrides.headlineHighlight : themeDef.hero.headlineHighlight;
  const ctaPrimary = !themeParam && (dbTheme?.heroCtaText || customOverrides.ctaPrimary) ? (dbTheme?.heroCtaText || customOverrides.ctaPrimary) : themeDef.hero.ctaPrimary;
  const ctaPrimaryLink = !themeParam && dbTheme?.heroCtaLink ? dbTheme.heroCtaLink : "/shop";
  const ctaSecondary = !themeParam && customOverrides.ctaSecondary ? customOverrides.ctaSecondary : themeDef.hero.ctaSecondary;
  const trustBadges = !themeParam && Array.isArray(customOverrides.trustBadges) && customOverrides.trustBadges.length > 0 ? customOverrides.trustBadges : themeDef.trustBadges;

  const headline = dbTheme?.bannerHeadline && !themeParam ? dbTheme.bannerHeadline : themeDef.hero.headline;
  const subheadline = dbTheme?.bannerSubheadline && !themeParam ? dbTheme.bannerSubheadline : themeDef.hero.subheadline;
  const heroImage = dbTheme?.bannerImageUrl && !themeParam ? dbTheme.bannerImageUrl : themeDef.hero.imageUrl;

  const dbProducts = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const isDarkHero =
    themeDef.hero.style === "tech-contrast" ||
    themeDef.hero.style === "luxury-dark" ||
    themeDef.hero.style === "industrial-bold";

  return (
    <div
      className="space-y-16 pb-24 transition-colors duration-300"
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {/* 1. HERO SECTION */}
      <section
        className={`relative overflow-hidden border-b transition-colors duration-300 ${
          isDarkHero
            ? "py-20 sm:py-28 text-white border-white/10"
            : "py-16 sm:py-24 text-slate-900 border-black/5"
        }`}
        style={{
          backgroundColor: isDarkHero ? cardBgColor : backgroundColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-xs"
                style={{
                  backgroundColor: themeDef.palette.badgeBg,
                  color: themeDef.palette.badgeText,
                  borderRadius:
                    badgeRadius === "rounded-full"
                      ? "9999px"
                      : badgeRadius === "rounded-none"
                      ? "0px"
                      : "8px",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                {heroBadge}
              </div>

              {/* Headline */}
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${themeDef.typography.headingClass}`}
                style={{
                  color: isDarkHero ? "#FFFFFF" : textColor,
                }}
              >
                {headline}{" "}
                {headlineHighlight && (
                  <span
                    className="italic font-serif"
                    style={{ color: accentColor }}
                  >
                    {headlineHighlight}
                  </span>
                )}
              </h1>

              {/* Subheadline */}
              <p
                className="text-base sm:text-lg max-w-xl leading-relaxed"
                style={{
                  color: isDarkHero ? "#CBD5E1" : textMutedColor,
                }}
              >
                {subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={ctaPrimaryLink}
                  className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md text-white hover:opacity-95"
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius:
                      buttonRadius === "rounded-full"
                        ? "9999px"
                        : buttonRadius === "rounded-none"
                        ? "0px"
                        : "12px",
                  }}
                >
                  {ctaPrimary}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#categories"
                  className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider border transition-all"
                  style={{
                    borderColor: isDarkHero ? "rgba(255,255,255,0.2)" : themeDef.palette.border,
                    backgroundColor: isDarkHero ? "rgba(255,255,255,0.05)" : "#FFFFFF",
                    color: isDarkHero ? "#FFFFFF" : textColor,
                    borderRadius:
                      buttonRadius === "rounded-full"
                        ? "9999px"
                        : buttonRadius === "rounded-none"
                        ? "0px"
                        : "12px",
                  }}
                >
                  {ctaSecondary}
                </Link>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div
                className="relative overflow-hidden aspect-[4/5] shadow-2xl border transition-all group"
                style={{
                  borderColor: isDarkHero ? "rgba(255,255,255,0.1)" : themeDef.palette.border,
                  borderRadius:
                    themeDef.typography.buttonRadius === "rounded-none"
                      ? "0px"
                      : "24px",
                }}
              >
                <img
                  src={heroImage}
                  alt={headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlaid Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                      Featured Vertical
                    </span>
                    <strong className="text-sm font-extrabold block">{themeDef.name}</strong>
                    <span className="text-[11px] text-slate-200 line-clamp-1">{themeDef.tagline}</span>
                  </div>
                  <Link
                    href="/shop"
                    className="p-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BADGES STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border transition-colors shadow-xs"
          style={{
            backgroundColor: cardBgColor,
            borderColor: themeDef.palette.border,
          }}
        >
          {trustBadges.map((badge: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-inner"
                style={{
                  backgroundColor: themeDef.palette.badgeBg,
                  color: themeDef.palette.badgeText,
                }}
              >
                {renderTrustIcon(badge.icon)}
              </div>
              <div>
                <strong
                  className="block text-xs font-extrabold"
                  style={{ color: textColor }}
                >
                  {badge.title}
                </strong>
                <span className="text-[11px]" style={{ color: textMutedColor }}>
                  {badge.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider block mb-1"
              style={{ color: themeDef.palette.accent }}
            >
              Curated Collections
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeDef.typography.headingClass}`}
              style={{ color: themeDef.palette.text }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold hover:underline flex items-center gap-1"
            style={{ color: themeDef.palette.accent }}
          >
            Browse All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {themeDef.sampleCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-end aspect-square"
              style={{
                borderColor: themeDef.palette.border,
                borderRadius:
                  themeDef.typography.buttonRadius === "rounded-none"
                    ? "0px"
                    : "16px",
              }}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="relative z-10 p-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                  {category.itemCount}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (THEME CURATED OR DATABASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider block mb-1"
              style={{ color: themeDef.palette.accent }}
            >
              Industry Selection
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeDef.typography.headingClass}`}
              style={{ color: themeDef.palette.text }}
            >
              Trending in {themeDef.name}
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold hover:underline flex items-center gap-1"
            style={{ color: themeDef.palette.accent }}
          >
            View Complete Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeDef.sampleProducts.map((p) => {
            const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
            return (
              <div
                key={p.slug}
                className="group rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                style={{
                  backgroundColor: themeDef.palette.cardBg,
                  borderColor: themeDef.palette.border,
                  borderRadius:
                    themeDef.typography.buttonRadius === "rounded-none"
                      ? "0px"
                      : "16px",
                }}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
                      style={{
                        backgroundColor: themeDef.palette.primary,
                        borderRadius:
                          themeDef.typography.badgeRadius === "rounded-none"
                            ? "0px"
                            : "6px",
                      }}
                    >
                      {p.badge}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded shadow-sm">
                      SAVE {Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)}%
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                      style={{ color: themeDef.palette.textMuted }}
                    >
                      {p.category}
                    </span>
                    <h3
                      className="font-bold text-xs line-clamp-2"
                      style={{ color: themeDef.palette.text }}
                    >
                      {p.title}
                    </h3>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span
                        className="text-sm font-extrabold"
                        style={{ color: themeDef.palette.text }}
                      >
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] text-slate-400 line-through ml-2">
                          ₹{p.compareAtPrice?.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <Link
                      href="/shop"
                      className="p-2 rounded-xl transition-all flex items-center justify-center text-white"
                      style={{
                        backgroundColor: themeDef.palette.primary,
                        borderRadius:
                          themeDef.typography.buttonRadius === "rounded-none"
                            ? "0px"
                            : "10px",
                      }}
                      title="View product"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DATABASE PRODUCTS IF SEEDED */}
      {dbProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6 border-t border-black/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Store Inventory
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Catalog Products
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-blue-600 hover:underline">
              View All ({dbProducts.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
          style={{ backgroundColor: themeDef.palette.footerBg }}
        >
          <div className="max-w-xl space-y-3">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10"
              style={{ color: themeDef.palette.accent }}
            >
              Curated Collections & Fast Dispatch
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeDef.typography.headingClass}`}>
              Engineered for Quality & Reliability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Discover our carefully curated catalog with verified customer reviews, transparent pricing, and rapid doorstep delivery across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm text-center"
            >
              Browse All Products
            </Link>
            <Link
              href="/track"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors text-center"
            >
              Track Active Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
