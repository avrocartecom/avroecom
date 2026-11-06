export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateStoreThemeCache } from "@/lib/theme-cache";

// GET: Fetch General & Branding Settings
export async function GET() {
  try {
    let themeSetting = await prisma.storeThemeSetting.findFirst();
    if (!themeSetting) {
      themeSetting = await prisma.storeThemeSetting.create({
        data: {
          activeTheme: "AVRO_SIGNATURE",
          brandName: "AVRO Store",
          logoUrl: null,
          faviconUrl: null,
          primaryColor: "#0A192F",
          accentColor: "#2563EB",
          fontFamily: "Inter, sans-serif",
          bannerHeadline: "Find your next",
          bannerSubheadline: "Shop top-rated essentials with fast delivery.",
          bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
          heroBadge: "EXCLUSIVE COLLECTION 2026",
          heroCtaText: "Shop Catalog",
          heroCtaLink: "/shop",
          companyAddress: "Plot 42, Commercial Avenue, Sector 62",
          companyCity: "Noida",
          companyState: "Uttar Pradesh",
          companyPostalCode: "201309",
          companyCountry: "India",
          supportEmail: "support@avrostore.com",
          supportPhone: "+91 98765 43210",
          taxId: "07AAACT9021M1Z4",
          announcementBarText: "⚡ Free Priority Delivery on all orders above ₹999 with 7-day easy returns",
          showAnnouncementBar: true,
          footerText: "© 2026 AVRO Store. Powered by AVRO.",
        },
      });
    }

    let heroSlides: any[] = [];
    if (themeSetting.socialLinksJson) {
      try {
        const parsed = JSON.parse(themeSetting.socialLinksJson);
        if (Array.isArray(parsed?.heroSlides)) {
          heroSlides = parsed.heroSlides;
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...themeSetting,
        heroSlides,
      },
    });
  } catch (err: any) {
    console.error("GET /api/admin/settings/general error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Update General & Branding Settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brandName,
      logoUrl,
      faviconUrl,
      companyAddress,
      companyCity,
      companyState,
      companyPostalCode,
      companyCountry,
      supportEmail,
      supportPhone,
      taxId,
      bannerHeadline,
      bannerSubheadline,
      bannerImageUrl,
      heroBadge,
      heroCtaText,
      heroCtaLink,
      footerText,
      announcementBarText,
      showAnnouncementBar,
      primaryColor,
      accentColor,
      heroSlides,
    } = body;

    const themeSetting = await prisma.storeThemeSetting.findFirst();

    // Preserve and update heroSlides in socialLinksJson
    let socialObj: any = {};
    if (themeSetting?.socialLinksJson) {
      try {
        socialObj = JSON.parse(themeSetting.socialLinksJson);
      } catch (e) {}
    }
    if (Array.isArray(heroSlides)) {
      socialObj.heroSlides = heroSlides;
    }
    const finalSocialLinksJson = JSON.stringify(socialObj);

    const updated = await prisma.storeThemeSetting.upsert({
      where: { id: themeSetting ? themeSetting.id : "cuid_placeholder" },
      update: {
        brandName: brandName !== undefined ? brandName : undefined,
        logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        faviconUrl: faviconUrl !== undefined ? faviconUrl : undefined,
        companyAddress: companyAddress !== undefined ? companyAddress : undefined,
        companyCity: companyCity !== undefined ? companyCity : undefined,
        companyState: companyState !== undefined ? companyState : undefined,
        companyPostalCode: companyPostalCode !== undefined ? companyPostalCode : undefined,
        companyCountry: companyCountry !== undefined ? companyCountry : undefined,
        supportEmail: supportEmail !== undefined ? supportEmail : undefined,
        supportPhone: supportPhone !== undefined ? supportPhone : undefined,
        taxId: taxId !== undefined ? taxId : undefined,
        bannerHeadline: bannerHeadline !== undefined ? bannerHeadline : undefined,
        bannerSubheadline: bannerSubheadline !== undefined ? bannerSubheadline : undefined,
        bannerImageUrl: bannerImageUrl !== undefined ? bannerImageUrl : undefined,
        heroBadge: heroBadge !== undefined ? heroBadge : undefined,
        heroCtaText: heroCtaText !== undefined ? heroCtaText : undefined,
        heroCtaLink: heroCtaLink !== undefined ? heroCtaLink : undefined,
        footerText: footerText !== undefined ? footerText : undefined,
        announcementBarText: announcementBarText !== undefined ? announcementBarText : undefined,
        showAnnouncementBar: showAnnouncementBar !== undefined ? Boolean(showAnnouncementBar) : undefined,
        primaryColor: primaryColor !== undefined ? primaryColor : undefined,
        accentColor: accentColor !== undefined ? accentColor : undefined,
        socialLinksJson: finalSocialLinksJson,
      },
      create: {
        brandName: brandName || "AVRO Store",
        logoUrl,
        faviconUrl,
        companyAddress,
        companyCity,
        companyState,
        companyPostalCode,
        companyCountry: companyCountry || "India",
        supportEmail,
        supportPhone,
        taxId,
        bannerHeadline: bannerHeadline || "Find your next",
        bannerSubheadline: bannerSubheadline || "Shop top-rated essentials with fast delivery.",
        bannerImageUrl: bannerImageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
        heroBadge: heroBadge || "EXCLUSIVE COLLECTION",
        heroCtaText: heroCtaText || "Shop Catalog",
        heroCtaLink: heroCtaLink || "/shop",
        footerText: footerText || "© 2026 AVRO Store. Powered by AVRO.",
        announcementBarText: announcementBarText || "⚡ Free Shipping on orders over ₹999",
        showAnnouncementBar: Boolean(showAnnouncementBar),
        primaryColor: primaryColor || "#0A192F",
        accentColor: accentColor || "#2563EB",
        socialLinksJson: finalSocialLinksJson,
      },
    });

    invalidateStoreThemeCache();

    return NextResponse.json({
      success: true,
      message: "Branding and general settings updated successfully!",
      settings: {
        ...updated,
        heroSlides: socialObj.heroSlides || [],
      },
    });
  } catch (err: any) {
    console.error("PUT /api/admin/settings/general error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
