"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Tag,
  BarChart3,
  Palette,
  Sliders,
  CreditCard,
  Truck,
  Key,
  ShieldCheck,
  Building2,
  FileText,
  UploadCloud,
  MessageSquare,
  Globe,
  DollarSign,
  PackagePlus,
  Zap,
  CheckCircle2,
  ArrowRight,
  Info,
  SlidersHorizontal,
} from "lucide-react";

interface GuideTopic {
  id: string;
  section: string;
  title: string;
  summary: string;
  actionLink?: string;
  actionText?: string;
  badge?: string;
  content: {
    overview: string;
    steps?: string[];
    tips?: string[];
    details?: string;
  };
}

export default function AdminGuidePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [activeTopicId, setActiveTopicId] = useState<string>("quickstart");

  const guideTopics: GuideTopic[] = [
    // 1. OVERVIEW
    {
      id: "quickstart",
      section: "Overview",
      title: "Quickstart — Launch Your Store in 5 Steps",
      summary: "Sign up, pick a plan, add products, take payments, and launch your storefront.",
      actionLink: "/admin/settings/general",
      actionText: "Configure General Settings",
      badge: "Essential",
      content: {
        overview:
          "Launching an AVRO storefront is engineered for speed. Follow these 5 consecutive milestones to begin accepting real customer transactions.",
        steps: [
          "1. License & System: Ensure your commercial license key is active in Settings → License & System.",
          "2. Brand Identity: Upload your site logo, browser favicon, and registered company address in Settings → General & Branding.",
          "3. Payment Gateways: Activate Razorpay, PhonePe, Stripe, or Cash on Delivery (COD) in Settings → Payment Gateways.",
          "4. Shipping & Logistics: Set your warehouse origin pincode and configure courier rates in Settings → Shipping & Couriers.",
          "5. Publish Catalog: Add your first products with photos, descriptions, SKUs, and prices in Products → Add New Product.",
        ],
        tips: [
          "Upload transparent PNG or SVG logos (~200×60px) for crisp rendering on dark and light navigation headers.",
          "Enable test mode on Razorpay or PhonePe to simulate orders before switching to live payments.",
        ],
      },
    },
    {
      id: "admin-basics",
      section: "Overview",
      title: "Admin Basics — Layout, Search, Shortcuts & Mobile",
      summary: "Master the admin navigation, universal search, notifications, shortcuts, and mobile view.",
      content: {
        overview:
          "The AVRO administrative backoffice is organized into intuitive operational groups: Commerce Operations, Growth & Design, and Store Settings.",
        steps: [
          "Universal Search: Press Ctrl + K (or ⌘ + K) anywhere to search orders, products, and jump across settings.",
          "Sidebar Organization: Orders, Products, Combos, Categories, Inventory, and Customers are accessible from the left rail.",
          "Responsive Layout: The entire admin panel adapts smoothly to mobile smartphones for warehouse dispatching and on-the-go order management.",
        ],
        tips: [
          "Bookmark your /admin dashboard on your mobile home screen for 1-tap administrative access.",
        ],
      },
    },
    {
      id: "home-dashboard",
      section: "Overview",
      title: "Home — Store at a Glance & Quick Actions",
      summary: "Your store at a glance, financial KPIs, setup cards, and universal command palette.",
      actionLink: "/admin",
      actionText: "Go to Dashboard",
      content: {
        overview:
          "The main dashboard provides real-time business health indicators: gross revenue today, total orders, low inventory alerts, and recent customer activity.",
        details:
          "Review financial velocity metrics, unfulfilled dispatch queues, and customer acquisition metrics updated in real-time from your store database.",
      },
    },

    // 2. ORDERS
    {
      id: "orders-fulfillment",
      section: "Orders",
      title: "Orders — Fulfill, Mark Paid, Tracking, Invoices & Labels",
      summary: "Fulfill orders, assign courier tracking, generate thermal shipping labels, print tax invoices, and handle returns.",
      actionLink: "/admin/orders",
      actionText: "Manage Orders",
      badge: "Core Workflow",
      content: {
        overview:
          "Complete order processing workflow from placement to doorstep delivery.",
        steps: [
          "1. Inspect Order: Review customer contact details, itemized cart manifest, and chosen payment method.",
          "2. Update Status: Move status from Pending → Confirmed → Processing → Packed → Shipped.",
          "3. Assign Courier: Input shipping carrier (Delhivery, Shiprocket, DTDC, Blue Dart) and AWB tracking number.",
          "4. Print Thermal Shipping Labels: Select orders and click 'Print 4x6 Thermal Labels' for minimal, high-contrast labels with barcodes and QR codes.",
          "5. Generate Tax Invoice: Click 'Tax Invoice' on any order to print GST-compliant A4 commercial invoices with itemized tax breakdowns.",
        ],
        tips: [
          "Use thermal labels formatted for standard 4\"×6\" (100mm×150mm) label rolls to save paper and eliminate ink costs.",
          "COD orders display a prominent black CASH ON DELIVERY banner with exact amount to be collected by the courier.",
        ],
      },
    },
    {
      id: "draft-orders",
      section: "Orders",
      title: "Draft Orders — Custom Orders & Phone Invoices",
      summary: "Create custom orders for clients, apply manual discounts, and issue payment links.",
      actionLink: "/admin/orders",
      actionText: "Open Orders Hub",
      content: {
        overview:
          "Draft orders let support and sales reps manually assemble orders for institutional buyers, wholesale quotes, or phone customers.",
        steps: [
          "1. Specify consignee contact details and shipping address.",
          "2. Add catalog items or customized one-off products with tailored unit prices.",
          "3. Apply bespoke percentage or fixed amount discounts.",
          "4. Generate and send invoice with direct payment links.",
        ],
      },
    },
    {
      id: "abandoned-checkouts",
      section: "Orders",
      title: "Abandoned Checkouts — Recovery & Conversion",
      summary: "Identify incomplete checkouts and send automatic recovery incentives.",
      content: {
        overview:
          "Shoppers who entered contact details but abandoned payment are captured automatically.",
        tips: [
          "Review common payment failure reasons across gateways to optimize checkout conversions.",
          "Send personalized recovery coupons (e.g. 10% OFF within 2 hours) to recover up to 25% of abandoned carts.",
        ],
      },
    },

    // 3. PRODUCTS
    {
      id: "products-variants",
      section: "Products",
      title: "Products — Add & Edit, Media, Videos, Variants & SEO",
      summary: "Manage product details, photos, video demonstrations, variant SKUs, pricing, and SEO.",
      actionLink: "/admin/products",
      actionText: "Manage Products",
      badge: "Catalog",
      content: {
        overview:
          "AVRO offers rich product presentation including multiple high-res photos, demonstration videos, and multi-attribute variants.",
        steps: [
          "1. Title & Descriptions: Enter product name, concise punchy short description, and full product specifications.",
          "2. Media Upload: Upload high-res images from your computer or provide URLs. Designate primary thumbnail.",
          "3. Video Integration: Attach an MP4/WebM video or YouTube/Vimeo embed URL to showcase product demonstration reels in the storefront gallery.",
          "4. Pricing & Stock: Specify Regular Price (M.R.P.), Sale Price, unique SKU, and current available stock.",
          "5. Variants: Create color, size, or material options with independent pricing and inventory counts.",
        ],
        tips: [
          "Products with video demonstration reels achieve up to 34% higher add-to-cart conversion rates.",
          "Ensure unique SKUs across all variants for error-free barcode scanning and courier manifest generation.",
        ],
      },
    },
    {
      id: "inventory-control",
      section: "Products",
      title: "Inventory — Real-Time Stock Tracking & Audit Logs",
      summary: "Stock counts, low stock alerts, adjustments, and automated inventory movement logs.",
      actionLink: "/admin/inventory",
      actionText: "Inspect Inventory",
      content: {
        overview:
          "Track real-time inventory counts across your entire catalog. Automatic stock deductions occur upon order placement.",
        steps: [
          "In-line Quick Adjust: Modify stock numbers directly in the inventory grid.",
          "Audit Trail: Review timestamped records of all additions, sales deductions, and returns.",
          "Low Stock Warning: Receive immediate alert badges when stock falls below 5 units.",
        ],
      },
    },
    {
      id: "collections-combos",
      section: "Products",
      title: "Collections & Combos — Bundles & Tiered Offers",
      summary: "Group products into categories and create bundled combo deals with automatic discounts.",
      actionLink: "/admin/combos",
      actionText: "Manage Combo Deals",
      content: {
        overview:
          "Organize catalog discovery and boost Average Order Value (AOV) with automated bundle kits.",
        steps: [
          "Categories: Create structured category trees (e.g. Electronics → Audio → Wireless Headphones).",
          "Combo Deals: Bundle 2 or more products (e.g., Keyboard + Mouse + Desk Mat) with an automatic package discount percentage (e.g. 20% OFF).",
        ],
      },
    },
    {
      id: "gift-cards",
      section: "Products",
      title: "Gift Cards — Digital Vouchers & Store Credits",
      summary: "Issue and sell electronic gift cards with cryptographic redemption codes.",
      content: {
        overview:
          "Digital gift cards allow shoppers to purchase store vouchers for friends and family or receive customer service store credits.",
      },
    },

    // 4. MARKETING & CUSTOMERS
    {
      id: "discounts-coupons",
      section: "Marketing & Customers",
      title: "Discounts — Coupon Codes & Automatic Promotions",
      summary: "Create percentage or fixed amount coupon codes with minimum order limits and usage caps.",
      actionLink: "/admin/coupons",
      actionText: "Manage Coupons",
      content: {
        overview:
          "Drive seasonal campaigns and promotional sales with flexible promotional coupon logic.",
        steps: [
          "Coupon Code: Define code (e.g., FESTIVE15, FIRSTORDER).",
          "Discount Type: Choose Percentage (e.g. 15%) or Fixed Amount (e.g. ₹250).",
          "Thresholds: Set minimum order amount required to activate discount.",
          "Expiry & Limits: Define usage limits and sunset dates.",
        ],
      },
    },
    {
      id: "customers-profiles",
      section: "Marketing & Customers",
      title: "Customers — Unified Shopper Profiles & Order History",
      summary: "Customer profiles, order frequency, total lifetime spend, and guest vs registered accounts.",
      actionLink: "/admin/customers",
      actionText: "View Customers",
      content: {
        overview:
          "Review consolidated shopper intelligence, saved delivery addresses, wishlist items, and historical orders.",
      },
    },
    {
      id: "segments-b2b",
      section: "Marketing & Customers",
      title: "Segments & Companies — B2B Wholesale & Loyalty Tiers",
      summary: "Group customers by behavior and support B2B corporate buyers with registered GSTINs.",
      content: {
        overview:
          "Segment your audience into VIP high-spenders, repeat buyers, or commercial wholesale entities requiring formal GST invoices.",
      },
    },
    {
      id: "analytics-reports",
      section: "Marketing & Customers",
      title: "Analytics & Reports — Sales Trends & Financial KPIs",
      summary: "Gross revenue, net margins, top selling SKUs, and payment gateway conversion ratios.",
      actionLink: "/admin/reports",
      actionText: "View Sales Reports",
      content: {
        overview:
          "Comprehensive reporting suite filterable by custom date ranges to monitor store performance.",
        steps: [
          "Revenue Trends: Compare month-over-month sales velocity.",
          "Product Performance: Identify top 10 bestselling items and slow-moving stock.",
          "Payment Breakdown: Track percentage of prepaid online transactions vs. Cash on Delivery.",
        ],
      },
    },

    // 5. CONTENT & DESIGN
    {
      id: "media-library",
      section: "Content & Design",
      title: "Media Library — Central Image & Video Asset Storage",
      summary: "Upload, organize, and retrieve product images, banners, and video clips.",
      actionLink: "/admin/media",
      actionText: "Open Media Library",
      content: {
        overview:
          "Upload files directly from your computer with automated compression and instant CDN URL copying.",
      },
    },
    {
      id: "themes-editor",
      section: "Content & Design",
      title: "Themes & Visual Customizer — 13 Industry Presets",
      summary: "Live split-pane theme customizer, color palettes, typography, announcement bars, and trust badges.",
      actionLink: "/admin/themes",
      actionText: "Open Theme Customizer",
      badge: "Design",
      content: {
        overview:
          "Transform your store's appearance instantly across 13 tailored industry presets (Fashion, Electronics, Grocery, Cosmetics, Jewelry, Fitness, Home, Crafts, Travel, Pets, Mobiles, and Signature Minimal).",
        steps: [
          "Palette & Surfaces: Customize brand primary color, accent highlight, and card surfaces.",
          "Typography & Shapes: Select crisp font families (Plus Jakarta Sans, JetBrains Mono, Inter, Outfit, Playfair Display) and button corner roundness.",
          "Hero Visuals: Edit hero headline, description, badge, CTA buttons, and upload hero banner images from your computer.",
          "Announcement Bar: Enable or disable top promotional message bar with custom colors.",
          "Trust Badges: Configure the 4 storefront guarantee badges.",
        ],
      },
    },
    {
      id: "pages-preferences",
      section: "Content & Design",
      title: "Pages & SEO — About Us, Policies & Meta Tags",
      summary: "Build brand trust with dedicated policy pages and search engine optimization.",
      actionLink: "/about",
      actionText: "View About Page",
      content: {
        overview:
          "Standard brand trust pages (About Us, Shipping Policy, Return & Exchange Policy, Terms of Service, Privacy Policy) and Google meta tags.",
      },
    },

    // 6. SETTINGS
    {
      id: "settings-overview",
      section: "Settings",
      title: "Settings Overview — Central Configuration Hub",
      summary: "A unified index of all store configurations, branding, payments, couriers, and licenses.",
      actionLink: "/admin/settings/general",
      actionText: "Open Settings",
      content: {
        overview:
          "Manage store identity, operational parameters, payment secrets, shipping origin, and staff access permissions from a single hub.",
      },
    },
    {
      id: "general-brand",
      section: "Settings",
      title: "General & Brand — Logos, Favicon, Address & GSTIN",
      summary: "Upload site logo, favicon, set store brand name, registered office address, support helpline, and GSTIN.",
      actionLink: "/admin/settings/general",
      actionText: "Edit General & Brand",
      badge: "Must Configure",
      content: {
        overview:
          "The core identity configuration for your business. Data entered here powers the storefront navbar, footer, thermal shipping labels, and official Tax Invoices.",
        steps: [
          "Site Logo: Upload PNG/SVG from your computer or enter an image URL.",
          "Favicon: Upload 32x32 PNG/ICO icon displayed in browser tabs.",
          "Registered Street Address: Physical office/warehouse address for seller return labels and tax invoices.",
          "GSTIN / Tax ID: Your formal registration number printed on customer receipts.",
          "Helpline & Email: Displayed prominently on invoice headers and footer customer support sections.",
          "Homepage Hero Banner: Customize banner title, subtitle, micro-badge, and hero image.",
        ],
        tips: [
          "All company details updated here dynamically update the storefront footer and invoice generator without manual code edits.",
        ],
      },
    },
    {
      id: "plans-licensing",
      section: "Settings",
      title: "Plans, Billing & Licensing — Software Key & Entitlements",
      summary: "Manage your AVRO commercial license key, plan tier, and periodic heartbeat verification.",
      actionLink: "/admin/settings/license",
      actionText: "Inspect License",
      content: {
        overview:
          "Review your commercial subscription tier (Basic, Grow, Plus), domain binding, and offline cryptographic entitlement cache.",
      },
    },
    {
      id: "users-permissions",
      section: "Settings",
      title: "Users & Permissions — Multi-User Roles & Team Access",
      summary: "Create staff logins with Role-Based Access Control (Owner, Manager, Staff, Support).",
      actionLink: "/admin/users",
      actionText: "Manage Team Access",
      content: {
        overview:
          "Delegate warehouse packing, customer support, and catalog management securely with fine-grained staff roles.",
        steps: [
          "OWNER: Full unrestricted control over finances, payments, and system settings.",
          "MANAGER: Catalog management, order processing, and discount creation.",
          "STAFF: Restricted to picking, packing, generating labels, and updating tracking.",
          "SUPPORT: Read-only access to customer profiles and order histories.",
        ],
      },
    },
    {
      id: "payment-gateways",
      section: "Settings",
      title: "Payments — Razorpay, PhonePe, Stripe & Cash on Delivery",
      summary: "Configure local merchant credentials for online payments and Cash on Delivery rules.",
      actionLink: "/admin/settings/payments",
      actionText: "Configure Payments",
      badge: "Financial",
      content: {
        overview:
          "Connect industry-standard payment processors. Secrets and API keys are stored strictly in your local database.",
        steps: [
          "Razorpay: Enter Key ID, Key Secret, Webhook Secret, and toggle Test Mode.",
          "PhonePe: Input Merchant ID, Salt Key, and Salt Index.",
          "Stripe: Enter Publishable Key, Secret Key, and Webhook Signing Secret.",
          "Cash on Delivery (COD): Toggle COD acceptance with optional minimum and maximum order value limits.",
          "Bank Transfer: Provide bank account name, account number, IFSC code, and branch details for direct NEFT/RTGS.",
        ],
      },
    },
    {
      id: "shipping-couriers",
      section: "Settings",
      title: "Shipping & Couriers — Shiprocket, Delhivery & Flat Rates",
      summary: "Configure warehouse dispatch PIN code, shipping fee tiers, and courier API integrations.",
      actionLink: "/admin/settings/shipping",
      actionText: "Configure Shipping",
      content: {
        overview:
          "Set up logistics rules to automate order fulfillment and parcel dispatch.",
        steps: [
          "Warehouse Origin: Enter your warehouse dispatch PIN code.",
          "Courier Integrations: Connect Shiprocket or Delhivery API keys for automated AWB generation.",
          "Free Shipping Threshold: Define cart subtotal (e.g. ₹999) that unlocks complimentary express delivery.",
        ],
      },
    },
    {
      id: "taxes-gst",
      section: "Settings",
      title: "Taxes & GST — GSTIN & Tax Invoice Calculations",
      summary: "Inclusive vs exclusive tax rules and automatic itemized CGST/SGST/IGST tax splits.",
      content: {
        overview:
          "AVRO features built-in GST compliance for Indian e-commerce: automatic 18% tax calculation with proper split between CGST (9%) and SGST (9%) for intra-state delivery or IGST (18%) for inter-state delivery.",
      },
    },

    // 7. APPS & CHANNELS
    {
      id: "apps-marketplace",
      section: "Apps & Sales Channels",
      title: "Apps & Integrations — Webhooks & Third-Party Services",
      summary: "Extend your store with logistics, accounting, analytics, and marketing integrations.",
      content: {
        overview:
          "AVRO connects seamlessly with operational tools via secure webhooks and direct REST APIs.",
      },
    },
    {
      id: "shiprocket-logistics",
      section: "Apps & Sales Channels",
      title: "Shiprocket — 17+ Couriers, AWBs, Pickups & Tracking",
      summary: "Synchronize orders with Shiprocket for automated courier allocation, doorstep pickups, and live tracking.",
      actionLink: "/admin/settings/shipping",
      actionText: "Logistics Settings",
      content: {
        overview:
          "Connect Shiprocket to automatically route orders to Delhivery, Blue Dart, DTDC, Shadowfax, or Xpressbees based on cheapest rates or fastest delivery.",
      },
    },
    {
      id: "zoho-accounting",
      section: "Apps & Sales Channels",
      title: "Zoho Books & Zoho Inventory — Automated ERP Sync",
      summary: "Synchronize catalog items, stock movements, and completed orders into Zoho Books.",
      content: {
        overview:
          "Automate your company accounting: customer invoices, GST ledgers, and inventory counts sync directly into Zoho Books without manual data entry.",
      },
    },
    {
      id: "google-sheets-sync",
      section: "Apps & Sales Channels",
      title: "Google Sheets — Real-Time Live Order Stream",
      summary: "Stream incoming orders, customer leads, and inventory logs into Google Sheets rows.",
      content: {
        overview:
          "Connect a Google Sheets webhook to log every completed order as a new spreadsheet row in real time for fulfillment coordination and custom analytics.",
      },
    },
    {
      id: "whatsapp-alerts",
      section: "Apps & Sales Channels",
      title: "WhatsApp Order Alerts & COD Confirmation",
      summary: "Automated WhatsApp notifications for order confirmation, dispatch tracking, and COD verification.",
      content: {
        overview:
          "Reduce Cash on Delivery Return-to-Origin (RTO) rates by sending 1-click WhatsApp order confirmation buttons to shoppers prior to warehouse packing.",
      },
    },
    {
      id: "print-on-demand",
      section: "Apps & Sales Channels",
      title: "Print-on-Demand — Qikink & Printrove Suppliers",
      summary: "Fulfill apparel and merchandise through white-label print-on-demand fulfillment partners.",
      content: {
        overview:
          "Sell custom apparel, oversized tees, hoodies, and posters without holding inventory. Orders route automatically to Qikink or Printrove for on-demand printing and direct delivery.",
      },
    },
    {
      id: "sales-channels",
      section: "Apps & Sales Channels",
      title: "Sales Channels — Online Store, Google Shopping & Meta",
      summary: "Publish and sync your catalog across Google Merchant Center, Meta (Instagram/Facebook Shop), and WhatsApp.",
      content: {
        overview:
          "Sync product XML feeds with Google Shopping, Meta Commerce Manager, and direct social commerce channels.",
      },
    },
  ];

  const sections = useMemo(() => {
    return Array.from(new Set(guideTopics.map((t) => t.section)));
  }, [guideTopics]);

  const filteredTopics = useMemo(() => {
    return guideTopics.filter((t) => {
      const matchesSection = selectedSection === "ALL" || t.section === selectedSection;
      const matchesQuery =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.overview.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSection && matchesQuery;
    });
  }, [guideTopics, selectedSection, searchQuery]);

  const activeTopic = useMemo(() => {
    return guideTopics.find((t) => t.id === activeTopicId) || guideTopics[0];
  }, [guideTopics, activeTopicId]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
              AVRO Operations
            </span>
            <span className="text-xs text-slate-400">· Comprehensive Admin Manual</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight mt-1 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Merchant Administration Guide
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Every administrative page, operational procedure, and business workflow organized by the admin menu hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/settings/general"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            General Settings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Universal Search & Section Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any guide topic (e.g., shipping labels, tax invoice, hero banner, couriers, variants, COD)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold scrollbar-none">
          <button
            onClick={() => setSelectedSection("ALL")}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              selectedSection === "ALL"
                ? "bg-[#0A192F] text-white shadow-2xs font-extrabold"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Sections ({guideTopics.length})
          </button>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedSection === sec
                  ? "bg-[#0A192F] text-white shadow-2xs font-extrabold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Split-Pane Manual Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Topics List (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col max-h-[760px]">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">
              Guide Chapters ({filteredTopics.length})
            </span>
            <span className="text-slate-400 text-[10px]">Click any chapter to read</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto p-1.5 space-y-1">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 ${
                    isSelected
                      ? "bg-blue-50/80 border border-blue-200 shadow-2xs"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                      {topic.section}
                    </span>
                    {topic.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-800">
                        {topic.badge}
                      </span>
                    )}
                  </div>
                  <strong
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? "text-blue-900 font-extrabold" : "text-slate-800"
                    }`}
                  >
                    {topic.title}
                  </strong>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                </button>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No guide topics match your search query. Try another keyword.
              </div>
            )}
          </div>
        </div>

        {/* Right Active Chapter Reader (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          {/* Chapter Header */}
          <div className="space-y-2 pb-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                {activeTopic.section}
              </span>
              {activeTopic.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                  {activeTopic.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              {activeTopic.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {activeTopic.summary}
            </p>

            {activeTopic.actionLink && (
              <div className="pt-2">
                <Link
                  href={activeTopic.actionLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs"
                >
                  {activeTopic.actionText || "Go to Page"} <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Chapter Body */}
          <div className="space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 mb-2">Overview</h3>
              <p className="text-slate-600 leading-relaxed">{activeTopic.content.overview}</p>
            </div>

            {activeTopic.content.steps && (
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">
                  Execution Checklist & Procedures:
                </h3>
                <ul className="space-y-2">
                  {activeTopic.content.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTopic.content.details && (
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-2">Details</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {activeTopic.content.details}
                </p>
              </div>
            )}

            {activeTopic.content.tips && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Merchant Pro-Tip</span>
                </div>
                <ul className="space-y-1 text-[11px] text-amber-800 list-disc list-inside">
                  {activeTopic.content.tips.map((tp, i) => (
                    <li key={i}>{tp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Quick Jump Navigation */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>AVRO Merchant Manual · Version 2026</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-blue-600 hover:underline font-bold"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
