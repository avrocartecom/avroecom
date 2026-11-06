"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Heart,
  Check,
  MapPin,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AVRO_THEMES } from "@/lib/themes-registry";

function renderTrustIcon(icon: string) {
  switch (icon) {
    case "truck":
      return <Truck className="w-5 h-5" />;
    case "shield":
      return <ShieldCheck className="w-5 h-5" />;
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

export default function StoreFooter({ theme }: { theme?: any }) {
  const searchParams = useSearchParams();
  const previewParam = searchParams?.get("theme") || searchParams?.get("previewTheme");
  const matchingThemeDef = AVRO_THEMES.find(
    (t) =>
      t.id === previewParam ||
      t.code === previewParam ||
      t.code === theme?.activeTheme ||
      t.id === theme?.activeTheme ||
      (theme?.activeTheme === "TALIM_DEFAULT" && t.code === "AVRO_SIGNATURE")
  ) || AVRO_THEMES[12];

  const brandName = theme?.brandName || `${matchingThemeDef.name} Store`;
  const currentYear = new Date().getFullYear();

  const isDarkFooter =
    matchingThemeDef.palette.footerBg === "#000000" ||
    matchingThemeDef.palette.footerBg === "#030712" ||
    matchingThemeDef.palette.footerBg === "#030303" ||
    matchingThemeDef.palette.footerBg === "#09090B" ||
    matchingThemeDef.palette.footerBg === "#020617" ||
    matchingThemeDef.palette.footerBg === "#0A192F" ||
    matchingThemeDef.palette.footerBg === "#052E16" ||
    matchingThemeDef.palette.footerBg === "#4C0519" ||
    matchingThemeDef.palette.footerBg === "#431407" ||
    matchingThemeDef.palette.footerBg === "#0C4A6E" ||
    matchingThemeDef.palette.footerBg === "#291305" ||
    matchingThemeDef.palette.footerBg === "#451A03" ||
    matchingThemeDef.palette.footerBg === "#14532D";

  const companyAddress = theme?.companyAddress || "Commercial Avenue, Sector 62";
  const companyCity = theme?.companyCity || "Noida";
  const companyState = theme?.companyState || "Uttar Pradesh";
  const companyPostalCode = theme?.companyPostalCode || "201309";
  const companyCountry = theme?.companyCountry || "India";
  const supportEmail = theme?.supportEmail || "support@avrostore.com";
  const supportPhone = theme?.supportPhone || "+91 98765 43210";
  const taxId = theme?.taxId;

  return (
    <footer
      className="border-t pt-14 pb-10 transition-colors duration-300 font-sans"
      style={{
        backgroundColor: matchingThemeDef.palette.footerBg,
        borderColor: matchingThemeDef.palette.border,
        color: isDarkFooter ? "#CBD5E1" : "#475569",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 1. Industry Trust Badges Strip */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b text-xs"
          style={{ borderColor: isDarkFooter ? "rgba(255,255,255,0.1)" : "#E2E8F0" }}
        >
          {matchingThemeDef.trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold flex-shrink-0 shadow-2xs"
                style={{
                  backgroundColor: matchingThemeDef.palette.badgeBg,
                  color: matchingThemeDef.palette.badgeText,
                }}
              >
                {renderTrustIcon(badge.icon)}
              </div>
              <div>
                <strong
                  className="block font-bold text-xs"
                  style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
                >
                  {badge.title}
                </strong>
                <span className={isDarkFooter ? "text-slate-400" : "text-slate-500"}>
                  {badge.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Main 4-Column Professional Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-xs">
          {/* Column 1: Company Profile & Registered Office (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-2xs flex-shrink-0 flex items-center justify-center">
                <img
                  src={theme?.logoUrl || "/avro-logo.png"}
                  alt={brandName}
                  className="h-8 max-w-[140px] w-auto object-contain"
                />
              </div>
              <span
                className="text-base font-extrabold tracking-tight block"
                style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
              >
                {brandName}
              </span>
            </Link>

            <p
              className="text-xs leading-relaxed max-w-sm"
              style={{ color: isDarkFooter ? "#94A3B8" : "#64748B" }}
            >
              Independent premium commerce destination offering curated, verified-authentic essentials with priority doorstep delivery and easy returns.
            </p>

            {/* Registered Company Address Card */}
            <div
              className="p-4 rounded-2xl border space-y-2 text-xs max-w-sm"
              style={{
                backgroundColor: isDarkFooter ? "rgba(255,255,255,0.04)" : "#F8FAFC",
                borderColor: isDarkFooter ? "rgba(255,255,255,0.08)" : "#E2E8F0",
              }}
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong
                    className="block font-bold"
                    style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
                  >
                    Registered Office & Dispatch Hub
                  </strong>
                  <p style={{ color: isDarkFooter ? "#CBD5E1" : "#475569" }} className="leading-tight mt-0.5">
                    {companyAddress}, {companyCity}, {companyState} - {companyPostalCode}, {companyCountry}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t space-y-1.5 text-[11px]" style={{ borderColor: isDarkFooter ? "rgba(255,255,255,0.06)" : "#E2E8F0" }}>
                {supportEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <a
                      href={`mailto:${supportEmail}`}
                      className="hover:underline font-medium"
                      style={{ color: isDarkFooter ? "#E2E8F0" : "#1E293B" }}
                    >
                      {supportEmail}
                    </a>
                  </div>
                )}
                {supportPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <a
                      href={`tel:${supportPhone}`}
                      className="hover:underline font-medium"
                      style={{ color: isDarkFooter ? "#E2E8F0" : "#1E293B" }}
                    >
                      {supportPhone}
                    </a>
                    <span className="text-[10px] text-slate-400">· Helpline</span>
                  </div>
                )}
              </div>

              {taxId && (
                <div className="pt-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Tax Identification:</span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-black/5 dark:bg-white/10">
                    GSTIN: {taxId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Collections & Shop (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <strong
              className="uppercase font-bold tracking-wider text-[11px] block"
              style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
            >
              Collections
            </strong>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shop"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Products
                </Link>
              </li>
              {matchingThemeDef.sampleCategories.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className={`hover:underline transition-colors ${
                      isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop?sort=newest"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Order Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <strong
              className="uppercase font-bold tracking-wider text-[11px] block"
              style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
            >
              Customer Care
            </strong>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/account"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  My Account & Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Help & Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance, Legal & Security (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <strong
              className="uppercase font-bold tracking-wider text-[11px] block"
              style={{ color: isDarkFooter ? "#FFFFFF" : "#0F172A" }}
            >
              Legal & Compliance
            </strong>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`hover:underline transition-colors ${
                    isDarkFooter ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  About Our Brand
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Powered by AVRO Only */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
          style={{
            borderColor: isDarkFooter ? "rgba(255,255,255,0.1)" : "#F1F5F9",
            color: isDarkFooter ? "#94A3B8" : "#94A3B8",
          }}
        >
          <p>© {currentYear} {brandName}. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">
              Powered by <strong className="font-extrabold text-blue-600 tracking-wider">AVRO</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
