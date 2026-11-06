export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enforceApiFeatureAccess } from "@/lib/permissions";
import { invalidateStoreThemeCache } from "@/lib/theme-cache";

export async function GET() {
  try {
    let themeSetting = await prisma.storeThemeSetting.findFirst();
    if (!themeSetting) {
      themeSetting = await prisma.storeThemeSetting.create({
        data: {
          activeTheme: "AVRO_SIGNATURE",
          brandName: "AVRO Store",
          primaryColor: "#0A192F",
          accentColor: "#2563EB",
          fontFamily: "Inter, sans-serif",
          bannerHeadline: "Find your next",
          bannerSubheadline: "Shop top-rated electronics, minimalist apparel, home furnishings, and daily curated finds — all with verified authenticity and fast delivery.",
          bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
          announcementBarText: "⚡ Free Priority Delivery on all orders above ₹999 with 7-day easy returns",
          showAnnouncementBar: true,
          socialLinksJson: JSON.stringify({
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
            customThemes: [],
          }),
        },
      });
    }

    let customThemes: any[] = [];
    if (themeSetting?.socialLinksJson) {
      try {
        const parsed = JSON.parse(themeSetting.socialLinksJson);
        if (Array.isArray(parsed?.customThemes)) {
          customThemes = parsed.customThemes;
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, theme: themeSetting, customThemes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const access = await enforceApiFeatureAccess("themeCustomization");
    if (!access.allowed) {
      return access.response;
    }

    const body = await req.json();
    const {
      activeTheme,
      brandName,
      logoUrl,
      faviconUrl,
      primaryColor,
      accentColor,
      fontFamily,
      bannerHeadline,
      bannerSubheadline,
      bannerImageUrl,
      heroBadge,
      heroCtaText,
      heroCtaLink,
      companyAddress,
      companyCity,
      companyState,
      companyPostalCode,
      companyCountry,
      supportEmail,
      supportPhone,
      taxId,
      announcementBarText,
      showAnnouncementBar,
      socialLinksJson,
      customThemes,
      footerText,
    } = body;

    const themeSetting = await prisma.storeThemeSetting.findFirst();

    // Prepare robust socialLinksJson preserving customThemes
    let socialObj: any = {};
    if (typeof socialLinksJson === "string") {
      try {
        socialObj = JSON.parse(socialLinksJson);
      } catch (e) {
        socialObj = {};
      }
    } else if (typeof socialLinksJson === "object" && socialLinksJson !== null) {
      socialObj = { ...socialLinksJson };
    }

    if (Array.isArray(customThemes)) {
      socialObj.customThemes = customThemes;
    } else if (Array.isArray(body?.customThemes)) {
      socialObj.customThemes = body.customThemes;
    } else if (themeSetting?.socialLinksJson && !socialObj.customThemes) {
      try {
        const existing = JSON.parse(themeSetting.socialLinksJson);
        if (Array.isArray(existing?.customThemes)) {
          socialObj.customThemes = existing.customThemes;
        }
      } catch (e) {}
    }

    const finalSocialLinksJson = JSON.stringify(socialObj);

    const updated = await prisma.storeThemeSetting.upsert({
      where: { id: themeSetting ? themeSetting.id : "cuid_placeholder" },
      update: {
        activeTheme,
        brandName,
        logoUrl,
        faviconUrl,
        primaryColor,
        accentColor,
        fontFamily,
        bannerHeadline,
        bannerSubheadline,
        bannerImageUrl,
        heroBadge,
        heroCtaText,
        heroCtaLink,
        companyAddress,
        companyCity,
        companyState,
        companyPostalCode,
        companyCountry,
        supportEmail,
        supportPhone,
        taxId,
        announcementBarText,
        showAnnouncementBar: Boolean(showAnnouncementBar),
        socialLinksJson: finalSocialLinksJson,
        footerText,
      },
      create: {
        activeTheme: activeTheme || "AVRO_SIGNATURE",
        brandName: brandName || "AVRO Store",
        logoUrl,
        faviconUrl,
        primaryColor: primaryColor || "#0A192F",
        accentColor: accentColor || "#2563EB",
        fontFamily: fontFamily || "Inter, sans-serif",
        bannerHeadline: bannerHeadline || "Find your next",
        bannerSubheadline: bannerSubheadline || "Shop top-rated essentials with fast delivery.",
        bannerImageUrl: bannerImageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
        heroBadge: heroBadge || "EXCLUSIVE COLLECTION",
        heroCtaText: heroCtaText || "Shop Catalog",
        heroCtaLink: heroCtaLink || "/shop",
        companyAddress,
        companyCity,
        companyState,
        companyPostalCode,
        companyCountry: companyCountry || "India",
        supportEmail,
        supportPhone,
        taxId,
        announcementBarText: announcementBarText || "⚡ Free Shipping on orders over ₹999",
        showAnnouncementBar: Boolean(showAnnouncementBar),
        socialLinksJson: finalSocialLinksJson,
        footerText: footerText || "© 2026 AVRO Store. Powered by AVRO.",
      },
    });

    invalidateStoreThemeCache();
    return NextResponse.json({
      success: true,
      message: "Theme customization saved & deployed!",
      theme: updated,
      customThemes: socialObj.customThemes || [],
    });
  } catch (err: any) {
    console.error("Theme PUT error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
