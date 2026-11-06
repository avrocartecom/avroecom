export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_STANDARD_PAGES = [
  {
    title: "About Our Brand",
    slug: "about",
    content: `Welcome to our store. Our brand was created on the philosophy that everyday items should be crafted with uncompromised attention to material purity, structural durability, and clean aesthetic minimalism.

Unlike mass-market fast consumer products, our catalog is curated in focused production runs. Every piece is thoroughly inspected, backed by warranty, and dispatched directly from our dedicated warehouse to your doorstep.

Our store operates on independent high-security infrastructure, ensuring your personal order data, payment information, and transaction histories remain 100% private and protected.`,
    metaTitle: "About Us — Our Heritage & Craftsmanship",
    metaDescription: "Learn more about our brand philosophy, craftsmanship, and commitment to quality.",
    status: "PUBLISHED",
    isSystem: true,
  },
  {
    title: "Shipping & Delivery Policy",
    slug: "shipping-policy",
    content: `### Order Processing & Dispatch
All confirmed orders are processed and handed over to our verified express courier partners within 24 to 48 hours of placement.

### Shipping Rates & Transit Times
- Express Delivery: 2 to 4 business days for major metropolitan areas.
- Standard Delivery: 4 to 7 business days for regional and rural locations.
- Complimentary Free Delivery: Automatically applied on all orders meeting the minimum order value threshold.

### Tracking Your Shipment
Upon courier pickup, a tracking AWB number is assigned and sent directly via email and SMS for real-time parcel visibility.`,
    metaTitle: "Shipping & Delivery Policy",
    metaDescription: "Learn about our fast express dispatch, delivery timeframes, and free shipping thresholds.",
    status: "PUBLISHED",
    isSystem: true,
  },
  {
    title: "Return & Replacement Policy",
    slug: "return-policy",
    content: `### 7-Day Hassle-Free Returns & Exchange
We stand behind the quality of every product. If you receive an item with manufacturing defects, shipping damages, or sizing issues, you can request a return or replacement within 7 calendar days of delivery.

### Return Guidelines
- Items must be unused, unwashed, and in their original packaging with all tags attached.
- Doorstep reverse pickups will be scheduled by our courier partner within 48 hours of return approval.
- Once inspected at our logistics hub, refunds are credited to the original payment source within 3-5 business days.`,
    metaTitle: "Returns & Exchange Policy",
    metaDescription: "Our 7-day hassle-free return, replacement, and refund policies.",
    status: "PUBLISHED",
    isSystem: true,
  },
  {
    title: "Terms of Service",
    slug: "terms",
    content: `### 1. Agreement to Terms
By accessing or placing an order through our storefront, you agree to be bound by these Terms of Service and all applicable local consumer and commercial laws.

### 2. Pricing & Orders
All prices displayed on the store are inclusive of applicable GST unless explicitly stated otherwise. We reserve the right to cancel or adjust orders in the event of technical pricing errors or unexpected inventory depletion.

### 3. Payment Processing
Payment transactions are processed through 256-bit encrypted banking integrations. We do not store full credit card numbers or sensitive CVVs on our servers.`,
    metaTitle: "Terms of Service & Usage",
    metaDescription: "Read our comprehensive terms of service, commercial agreements, and policies.",
    status: "PUBLISHED",
    isSystem: true,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    content: `### 1. Information We Collect
We collect personal customer data strictly necessary to fulfill your orders: name, delivery address, email, telephone number, and payment status.

### 2. How Your Data Is Protected
Your order data is stored securely in an independent database. We never sell, lease, or monetize your contact information with third-party advertising brokers.

### 3. Third-Party Fulfillment
Delivery addresses and phone numbers are shared solely with authorized courier logistics partners (e.g., Delhivery, Shiprocket, DTDC) to complete physical doorstep delivery.`,
    metaTitle: "Privacy & Data Protection Policy",
    metaDescription: "How we collect, protect, and respect your private order and customer data.",
    status: "PUBLISHED",
    isSystem: true,
  },
];

// GET: List all pages (combining DB CustomPages and standard system pages)
export async function GET() {
  try {
    const dbPages = await prisma.customPage.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Merge standard pages with any existing DB records
    const pages = DEFAULT_STANDARD_PAGES.map((std) => {
      const existing = dbPages.find((p) => p.slug === std.slug);
      if (existing) {
        return { ...existing, isSystem: true };
      }
      return {
        id: `sys_${std.slug}`,
        ...std,
        showInFooter: true,
        showInNav: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Add pure custom pages created by user
    for (const dbPage of dbPages) {
      if (!DEFAULT_STANDARD_PAGES.some((std) => std.slug === dbPage.slug)) {
        pages.push({ ...dbPage, isSystem: false });
      }
    }

    return NextResponse.json({ success: true, pages });
  } catch (err: any) {
    console.error("GET /api/admin/pages error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create a new custom page
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, metaTitle, metaDescription, status = "PUBLISHED", showInFooter = true, showInNav = false } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: "Title, slug, and content are required." }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");

    // Check if slug already exists
    const existing = await prisma.customPage.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: `A page with URL slug "/${cleanSlug}" already exists.` }, { status: 400 });
    }

    const newPage = await prisma.customPage.create({
      data: {
        title,
        slug: cleanSlug,
        content,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || null,
        status: status.toUpperCase(),
        showInFooter: Boolean(showInFooter),
        showInNav: Boolean(showInNav),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Page "${newPage.title}" created successfully!`,
      page: newPage,
    });
  } catch (err: any) {
    console.error("POST /api/admin/pages error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT: Update an existing page or upsert a standard page
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, slug, content, metaTitle, metaDescription, status, showInFooter, showInNav } = body;

    if (!slug || !content) {
      return NextResponse.json({ success: false, error: "Slug and content are required." }, { status: 400 });
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-");

    // Upsert so standard system pages (about, terms, etc.) are saved to DB when edited
    const updatedPage = await prisma.customPage.upsert({
      where: { slug: cleanSlug },
      update: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        metaTitle: metaTitle !== undefined ? metaTitle : undefined,
        metaDescription: metaDescription !== undefined ? metaDescription : undefined,
        status: status !== undefined ? status.toUpperCase() : undefined,
        showInFooter: showInFooter !== undefined ? Boolean(showInFooter) : undefined,
        showInNav: showInNav !== undefined ? Boolean(showInNav) : undefined,
      },
      create: {
        title: title || cleanSlug,
        slug: cleanSlug,
        content,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || null,
        status: (status || "PUBLISHED").toUpperCase(),
        showInFooter: showInFooter !== undefined ? Boolean(showInFooter) : true,
        showInNav: showInNav !== undefined ? Boolean(showInNav) : false,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Page "${updatedPage.title}" updated successfully!`,
      page: updatedPage,
    });
  } catch (err: any) {
    console.error("PUT /api/admin/pages error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a custom page
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: "Page ID or slug required." }, { status: 400 });
    }

    // Do not allow deleting system pages
    if (slug && DEFAULT_STANDARD_PAGES.some((std) => std.slug === slug)) {
      return NextResponse.json({ success: false, error: "System pages cannot be deleted, but you can edit their content." }, { status: 400 });
    }

    if (id && !id.startsWith("sys_")) {
      await prisma.customPage.delete({
        where: { id },
      });
    } else if (slug) {
      await prisma.customPage.delete({
        where: { slug },
      });
    }

    return NextResponse.json({ success: true, message: "Page removed successfully." });
  } catch (err: any) {
    console.error("DELETE /api/admin/pages error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
