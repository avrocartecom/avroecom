export const dynamic = "force-dynamic";

import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  ArrowRight,
  ShoppingBag,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Heart,
  Star,
  Flame,
  TrendingUp,
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

  let dbTheme: any = null;
  try {
    dbTheme = await prisma.storeThemeSetting.findFirst();
  } catch (e) {
    // Database unseeded or unreachable
  }

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

  let dbProducts: any[] = [];
  try {
    dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // Database unseeded or unreachable
  }

  const isDarkHero =
    themeDef.hero.style === "tech-contrast" ||
    themeDef.hero.style === "luxury-dark" ||
    themeDef.hero.style === "industrial-bold";

  const btnBorderRadius =
    buttonRadius === "rounded-full" ? "9999px"
    : buttonRadius === "rounded-none" ? "0px"
    : buttonRadius === "rounded-2xl" ? "16px"
    : "12px";

  const badgeBorderRadius =
    badgeRadius === "rounded-full" ? "9999px"
    : badgeRadius === "rounded-none" ? "0px"
    : "8px";

  const cardBorderRadius =
    themeDef.typography.buttonRadius === "rounded-none" ? "0px"
    : "16px";

  return (
    <div
      className="pb-24 transition-colors duration-300"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {/* =====================================================
          1. HERO SECTION — Professional split layout with animations
          ===================================================== */}
      <section
        className={`relative overflow-hidden border-b transition-colors duration-300 ${
          isDarkHero
            ? "py-20 sm:py-28 text-white border-white/10"
            : "py-16 sm:py-24 text-slate-900 border-black/5"
        }`}
        style={{ backgroundColor: isDarkHero ? cardBgColor : backgroundColor }}
      >
        {/* Decorative background orbs */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 avro-float-slow"
            style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-24 right-0 w-72 h-72 rounded-full blur-3xl opacity-15 avro-float"
            style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`, animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left — Hero content */}
            <div className="lg:col-span-7 space-y-6">

              {/* Badge */}
              <div
                className="avro-slide-up inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm"
                style={{
                  backgroundColor: themeDef.palette.badgeBg,
                  color: themeDef.palette.badgeText,
                  borderRadius: badgeBorderRadius,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
                {heroBadge}
              </div>

              {/* Headline */}
              <h1
                className={`avro-slide-up-delay-1 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${themeDef.typography.headingClass}`}
                style={{ color: isDarkHero ? "#FFFFFF" : textColor }}
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
                className="avro-slide-up-delay-2 text-base sm:text-lg max-w-xl leading-relaxed"
                style={{ color: isDarkHero ? "#CBD5E1" : textMutedColor }}
              >
                {subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="avro-slide-up-delay-3 flex flex-wrap gap-4 pt-2">
                <Link
                  href={ctaPrimaryLink}
                  className="avro-btn px-6 py-3.5 font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-white"
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: btnBorderRadius,
                  }}
                >
                  {ctaPrimary}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#categories"
                  className="avro-btn px-6 py-3.5 font-bold text-xs uppercase tracking-wider border transition-all"
                  style={{
                    borderColor: isDarkHero ? "rgba(255,255,255,0.2)" : themeDef.palette.border,
                    backgroundColor: isDarkHero ? "rgba(255,255,255,0.05)" : "#FFFFFF",
                    color: isDarkHero ? "#FFFFFF" : textColor,
                    borderRadius: btnBorderRadius,
                  }}
                >
                  {ctaSecondary}
                </Link>
              </div>

              {/* Trust micro-strip */}
              <div className="avro-slide-up-delay-4 flex flex-wrap gap-4 pt-1">
                {[
                  { icon: <Shield className="w-3.5 h-3.5" />, text: "Secure Checkout" },
                  { icon: <Truck className="w-3.5 h-3.5" />, text: "Fast Delivery" },
                  { icon: <RotateCcw className="w-3.5 h-3.5" />, text: "Easy Returns" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1.5 text-[11px] font-semibold opacity-70"
                    style={{ color: isDarkHero ? "#94A3B8" : textMutedColor }}
                  >
                    <span style={{ color: accentColor }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Hero image */}
            <div className="avro-slide-right lg:col-span-5">
              <div
                className="relative overflow-hidden aspect-[4/5] shadow-2xl border transition-all group"
                style={{
                  borderColor: isDarkHero ? "rgba(255,255,255,0.1)" : themeDef.palette.border,
                  borderRadius: themeDef.typography.buttonRadius === "rounded-none" ? "0px" : "24px",
                }}
              >
                <img
                  src={heroImage}
                  alt={headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Floating card at bottom */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between avro-fade-in-delay-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                      Featured Collection
                    </span>
                    <strong className="text-sm font-extrabold block">{themeDef.name}</strong>
                    <span className="text-[11px] text-slate-200 line-clamp-1">{themeDef.tagline}</span>
                  </div>
                  <Link
                    href="/shop"
                    className="avro-btn p-2 rounded-lg bg-white text-slate-900 font-bold hover:bg-slate-100 flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Decorative corner accent */}
                <div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 flex items-center justify-center backdrop-blur-sm"
                  style={{ borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}
                >
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. TRUST BADGES STRIP — animated entry
          ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border shadow-sm"
          style={{ backgroundColor: cardBgColor, borderColor: themeDef.palette.border }}
        >
          {trustBadges.map((badge: any, idx: number) => (
            <div
              key={idx}
              className="avro-slide-up flex items-center gap-3 group"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 duration-200"
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

      {/* =====================================================
          3. CATEGORY SHOWCASE — hover lift + zoom
          ===================================================== */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-16">
        <div className="avro-slide-up flex flex-col sm:flex-row sm:items-end justify-between gap-3">
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
            className="avro-link-underline text-xs font-bold flex items-center gap-1"
            style={{ color: themeDef.palette.accent }}
          >
            Browse All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 avro-stagger-grid">
          {themeDef.sampleCategories.map((category, idx) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="avro-card avro-slide-up group overflow-hidden border shadow-sm relative flex flex-col justify-end aspect-square"
              style={{
                borderColor: themeDef.palette.border,
                borderRadius: cardBorderRadius,
              }}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
              />
              {/* Gradient overlay — deeper on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-300" />

              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, transparent 60%)` }}
              />

              <div className="relative z-10 p-5 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                  {category.itemCount}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                {/* Arrow that slides in on hover */}
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-[11px] font-semibold text-slate-200">Shop now</span>
                  <ArrowRight className="w-3 h-3 text-slate-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          4. FEATURED PRODUCTS — theme curated or database
          ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-16">
        <div className="avro-slide-up flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1.5"
              style={{ color: themeDef.palette.accent }}
            >
              <Flame className="w-3.5 h-3.5" /> Trending Now
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeDef.typography.headingClass}`}
              style={{ color: themeDef.palette.text }}
            >
              Bestsellers in {themeDef.name}
            </h2>
          </div>
          <Link
            href="/shop"
            className="avro-link-underline text-xs font-bold flex items-center gap-1"
            style={{ color: themeDef.palette.accent }}
          >
            View Complete Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 avro-stagger-grid">
          {themeDef.sampleProducts.map((p) => {
            const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
            const discountPct = hasDiscount
              ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100)
              : 0;
            return (
              <div
                key={p.slug}
                className="avro-card avro-slide-up group overflow-hidden shadow-sm flex flex-col border"
                style={{
                  backgroundColor: themeDef.palette.cardBg,
                  borderColor: themeDef.palette.border,
                  borderRadius: cardBorderRadius,
                }}
              >
                {/* Product image */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {p.badge && (
                      <span
                        className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm"
                        style={{
                          backgroundColor: themeDef.palette.primary,
                          borderRadius: themeDef.typography.badgeRadius === "rounded-none" ? "0px" : "6px",
                        }}
                      >
                        {p.badge}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white shadow-sm"
                        style={{ borderRadius: "6px" }}>
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist placeholder */}
                  <button
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-200"
                    title="Save to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
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

                    {/* Star rating */}
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-2.5 h-2.5 ${i < Math.floor(p.rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                        />
                      ))}
                      <span className="text-[10px] ml-0.5" style={{ color: textMutedColor }}>{p.rating}</span>
                    </div>
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
                      className="avro-btn p-2 rounded-xl transition-all flex items-center justify-center text-white"
                      style={{
                        backgroundColor: themeDef.palette.primary,
                        borderRadius: themeDef.typography.buttonRadius === "rounded-none" ? "0px" : "10px",
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

      {/* =====================================================
          5. DATABASE PRODUCTS (if seeded)
          ===================================================== */}
      {dbProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 mt-16 pt-10 border-t border-black/5">
          <div className="avro-slide-up flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Live Catalog
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Your Products
              </h2>
            </div>
            <Link href="/shop" className="avro-link-underline text-xs font-bold text-blue-600 flex items-center gap-1">
              View All ({dbProducts.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 avro-stagger-grid">
            {dbProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          6. CALLOUT BANNER — full-width CTA strip
          ===================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div
          className="rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl"
          style={{ backgroundColor: themeDef.palette.footerBg }}
        >
          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10" aria-hidden>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl avro-float-slow"
              style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)` }} />
          </div>

          <div className="max-w-xl space-y-3 relative z-10">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 inline-block"
              style={{ color: accentColor }}
            >
              Curated Collections · Fast Dispatch
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${themeDef.typography.headingClass}`}>
              Engineered for Quality & Reliability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Discover our carefully curated catalog with verified customer reviews, transparent pricing, and rapid doorstep delivery across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 flex-shrink-0">
            <Link
              href="/shop"
              className="avro-btn px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm text-center"
            >
              Browse All Products
            </Link>
            <Link
              href="/track"
              className="avro-btn px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors text-center"
            >
              Track My Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
