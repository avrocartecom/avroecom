export interface AvroThemeDefinition {
  id: string;
  code: string;
  name: string;
  industry: string;
  referenceUrl: string;
  referenceDisplay: string;
  tagline: string;
  description: string;
  isIncludedInFree: boolean;
  palette: {
    primary: string;
    accent: string;
    background: string;
    cardBg: string;
    text: string;
    textMuted: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    headerBg: string;
    footerBg: string;
    accentGlow?: string;
  };
  typography: {
    fontFamily: string;
    headingClass: string;
    bodyClass: string;
    buttonRadius: string;
    badgeRadius: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineHighlight?: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageUrl: string;
    style: "editorial-split" | "tech-contrast" | "fresh-organic" | "luxury-dark" | "warm-terracotta" | "playful-pastel" | "rugged-outdoor" | "industrial-bold";
  };
  announcementBar: {
    text: string;
    bg: string;
    textColor: string;
  };
  trustBadges: {
    title: string;
    subtitle: string;
    icon: "truck" | "shield" | "refresh" | "award" | "heart" | "check";
  }[];
  sampleCategories: {
    name: string;
    slug: string;
    imageUrl: string;
    itemCount: string;
  }[];
  sampleProducts: {
    title: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    badge?: string;
    category: string;
    rating: number;
    imageUrl: string;
  }[];
}

export const AVRO_THEMES: AvroThemeDefinition[] = [
  // 1. FASHION - NOIR
  {
    id: "fashion-noir",
    code: "FASHION_NOIR",
    name: "Noir",
    industry: "Fashion & Apparel",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Where Trends Meet Comfort — Curated Modern Silhouette",
    description: "Monochrome luxury streetwear and contemporary high fashion. Features editorial lookbooks, oversized typography, minimalist monochrome grids, and effortless product switching.",
    isIncludedInFree: true,
    palette: {
      primary: "#0A0A0A",
      accent: "#18181B",
      background: "#FAFAFA",
      cardBg: "#FFFFFF",
      text: "#09090B",
      textMuted: "#71717A",
      border: "#E4E4E7",
      badgeBg: "#18181B",
      badgeText: "#FAFAFA",
      headerBg: "#FFFFFF",
      footerBg: "#09090B",
      accentGlow: "rgba(0,0,0,0.05)",
    },
    typography: {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      headingClass: "font-serif tracking-tight font-medium",
      bodyClass: "font-sans",
      buttonRadius: "rounded-none",
      badgeRadius: "rounded-none",
    },
    hero: {
      badge: "FALL / WINTER 2026 DROPS",
      headline: "Where Trends Meet",
      headlineHighlight: "Comfort",
      subheadline: "Refined silhouettes tailored from sustainable organic cotton and heavy French terry. Designed for effortless urban living.",
      ctaPrimary: "Shop New Drops",
      ctaSecondary: "Explore Lookbook",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
      style: "editorial-split",
    },
    announcementBar: {
      text: "Complimentary express delivery on orders over ₹2,499 · Worldwide duties prepaid",
      bg: "#0A0A0A",
      textColor: "#FAFAFA",
    },
    trustBadges: [
      { title: "Complimentary Delivery", subtitle: "On domestic orders over ₹2,499", icon: "truck" },
      { title: "30-Day Easy Returns", subtitle: "Hassle-free doorstep pickup", icon: "refresh" },
      { title: "Sustainably Sourced", subtitle: "100% certified organic cotton", icon: "award" },
      { title: "Artisan Tailored", subtitle: "Crafted in small ethical batches", icon: "award" },
    ],
    sampleCategories: [
      { name: "Heavyweight Tops", slug: "tops", itemCount: "28 items", imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80" },
      { name: "Tailored Trousers", slug: "trousers", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=400&q=80" },
      { name: "Outerwear & Coats", slug: "outerwear", itemCount: "14 items", imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80" },
      { name: "Monochrome Accessories", slug: "accessories", itemCount: "32 items", imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Oversized Heavy Fleece Hoodie", slug: "oversized-fleece-hoodie", price: 3499, compareAtPrice: 4299, badge: "BESTSELLER", category: "Outerwear", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" },
      { title: "Wide Leg Pleated Trousers", slug: "wide-leg-pleated-trousers", price: 2899, badge: "NEW", category: "Trousers", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" },
      { title: "Boxy French Terry Tee", slug: "boxy-french-terry-tee", price: 1499, compareAtPrice: 1899, badge: "POPULAR", category: "Tops", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80" },
      { title: "Structured Minimalist Tote", slug: "structured-minimalist-tote", price: 4200, category: "Accessories", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 2. ELECTRONICS - VOLT
  {
    id: "electronics-volt",
    code: "ELECTRONICS_VOLT",
    name: "Volt",
    industry: "Consumer Electronics & Gadgets",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Grab Upto 50% Off On Selected Gadgets — High Performance Tech",
    description: "High-contrast technical dark theme built for high-tech audio, computing peripherals, smart wearables, and gaming hardware. Features spec tables, deal timers, and instant tech pills.",
    isIncludedInFree: true,
    palette: {
      primary: "#0284C7",
      accent: "#38BDF8",
      background: "#090D16",
      cardBg: "#0F172A",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "#1E293B",
      badgeBg: "#0284C7",
      badgeText: "#FFFFFF",
      headerBg: "#090D16",
      footerBg: "#030712",
      accentGlow: "rgba(56, 189, 248, 0.15)",
    },
    typography: {
      fontFamily: "'JetBrains Mono', -apple-system, BlinkMacSystemFont, monospace, sans-serif",
      headingClass: "font-mono font-bold tracking-tight",
      bodyClass: "font-sans",
      buttonRadius: "rounded-lg",
      badgeRadius: "rounded-md",
    },
    hero: {
      badge: "FLASH SALE · LIMITED UNITS",
      headline: "Grab Upto 50% Off",
      headlineHighlight: "On Selected Gadgets",
      subheadline: "Next-generation spatial audio, hyper-fast GaN charging docks, and ultra-low latency mechanical wireless peripherals.",
      ctaPrimary: "Claim Tech Deals",
      ctaSecondary: "Browse Spec Sheets",
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85",
      style: "tech-contrast",
    },
    announcementBar: {
      text: "⚡ SUPERCHARGED SALE: Use code VOLT50 for instant ₹500 off on audio gear · 2-Year Official Warranty",
      bg: "#0284C7",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "2-Year Direct Warranty", subtitle: "Instant replacement guarantee", icon: "shield" },
      { title: "Same-Day Dispatch", subtitle: "Orders verified by 2 PM", icon: "truck" },
      { title: "Official Distributor", subtitle: "100% Authentic brand serials", icon: "award" },
      { title: "Zero EMI Available", subtitle: "Credit & Debit card EMI", icon: "check" },
    ],
    sampleCategories: [
      { name: "Spatial Audio", slug: "audio", itemCount: "42 items", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" },
      { name: "Smart Wearables", slug: "wearables", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80" },
      { name: "GaN Fast Power", slug: "power", itemCount: "27 items", imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80" },
      { name: "Mechanical Keys", slug: "keyboards", itemCount: "15 items", imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Volt ANC Studio Pro Wireless", slug: "volt-anc-studio-pro", price: 8999, compareAtPrice: 14999, badge: "50% OFF", category: "Spatial Audio", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
      { title: "140W GaN Matrix Desktop Charger", slug: "140w-gan-matrix-charger", price: 3499, compareAtPrice: 4999, badge: "BESTSELLER", category: "Power", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80" },
      { title: "Volt Apex 65% Wireless Mechanical Keyboard", slug: "volt-apex-65-keyboard", price: 6499, badge: "NEW", category: "Keyboards", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80" },
      { title: "Precision Optical Ergonomic Mouse", slug: "precision-ergonomic-mouse", price: 2999, compareAtPrice: 3999, badge: "HOT", category: "Keyboards", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 3. GROCERY - GROCERY FRESH
  {
    id: "grocery-fresh",
    code: "GROCERY_FRESH",
    name: "Grocery",
    industry: "Grocery & Daily Fresh",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "All Your Daily Essentials, Farm-Fresh Delivered",
    description: "Vibrant emerald green theme designed for supermarkets, organic food delivery, fruits, vegetables, and pantry essentials. Features quick weight selectors, farm-to-table origin badges, and recurring basket building.",
    isIncludedInFree: true,
    palette: {
      primary: "#15803D",
      accent: "#22C55E",
      background: "#F8FAF8",
      cardBg: "#FFFFFF",
      text: "#14532D",
      textMuted: "#4B5563",
      border: "#DCFCE7",
      badgeBg: "#DCFCE7",
      badgeText: "#15803D",
      headerBg: "#FFFFFF",
      footerBg: "#14532D",
      accentGlow: "rgba(34, 197, 94, 0.12)",
    },
    typography: {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      headingClass: "font-sans font-bold tracking-tight text-emerald-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-xl",
      badgeRadius: "rounded-full",
    },
    hero: {
      badge: "ORGANIC HARVEST TODAY",
      headline: "All Your Daily Essentials,",
      headlineHighlight: "Delivered Fresh",
      subheadline: "Directly harvested from certified local farms within 12 hours. Pure organic greens, seasonal fruits, and pesticide-free dairy.",
      ctaPrimary: "Order Farm Fresh",
      ctaSecondary: "View Weekly Bundles",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85",
      style: "fresh-organic",
    },
    announcementBar: {
      text: "🥬 60-Minute Delivery Available in Your Area · Freshness Guarantee or 100% Refund",
      bg: "#15803D",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "Farm-to-Door in 12h", subtitle: "Guaranteed crisp & ripe", icon: "truck" },
      { title: "Pesticide-Free Certified", subtitle: "Rigorous organic testing", icon: "award" },
      { title: "No-Questions Return", subtitle: "Instant refund on any item", icon: "refresh" },
      { title: "Eco-Friendly Bags", subtitle: "100% biodegradable packaging", icon: "heart" },
    ],
    sampleCategories: [
      { name: "Organic Vegetables", slug: "vegetables", itemCount: "54 items", imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80" },
      { name: "Seasonal Fruits", slug: "fruits", itemCount: "38 items", imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80" },
      { name: "Farm Dairy & Eggs", slug: "dairy", itemCount: "22 items", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80" },
      { name: "Cold-Pressed Oils & Ghee", slug: "pantry", itemCount: "31 items", imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Hydroponic Crisp Lettuce & Baby Spinach Box", slug: "crisp-lettuce-spinach-box", price: 180, compareAtPrice: 240, badge: "FRESH TODAY", category: "Organic Vegetables", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" },
      { title: "Alphonso Mango Box (6 Pcs Ripe)", slug: "alphonso-mango-box", price: 650, compareAtPrice: 850, badge: "SEASONAL", category: "Seasonal Fruits", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" },
      { title: "A2 Desi Cow Bilona Cultured Ghee (500ml)", slug: "a2-desi-cow-ghee", price: 1250, badge: "ORGANIC", category: "Pantry", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80" },
      { title: "Organic Hass Avocados (Pack of 3)", slug: "organic-hass-avocados", price: 320, compareAtPrice: 390, badge: "IMPORT", category: "Seasonal Fruits", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 4. COSMETICS - VELORA
  {
    id: "cosmetics-velora",
    code: "COSMETICS_VELORA",
    name: "Velora",
    industry: "Cosmetics & Skincare",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Radiance Becomes You — Pure Botanical Luxury",
    description: "Soft rose blush and warm cream tones designed for skincare, organic cosmetics, and dermatologist formulations. Features routine builder steps, clinical trial stats, and vegan cruelty-free seals.",
    isIncludedInFree: true,
    palette: {
      primary: "#9F1239",
      accent: "#E11D48",
      background: "#FFF5F5",
      cardBg: "#FFFFFF",
      text: "#4C0519",
      textMuted: "#881337",
      border: "#FFE4E6",
      badgeBg: "#FFE4E6",
      badgeText: "#9F1239",
      headerBg: "#FFFFFF",
      footerBg: "#4C0519",
      accentGlow: "rgba(225, 29, 72, 0.12)",
    },
    typography: {
      fontFamily: "'Playfair Display', Georgia, serif",
      headingClass: "font-serif tracking-normal font-normal italic",
      bodyClass: "font-sans",
      buttonRadius: "rounded-full",
      badgeRadius: "rounded-full",
    },
    hero: {
      badge: "DERMATOLOGIST APPROVED · 100% VEGAN",
      headline: "Radiance Becomes",
      headlineHighlight: "You",
      subheadline: "Each touch unveils a secret of pure botanical beauty. Clinically formulated with bioactive squalane, bakuchiol, and multi-peptide complexes.",
      ctaPrimary: "Explore Skincare Rituals",
      ctaSecondary: "Take Skin Diagnosis",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85",
      style: "editorial-split",
    },
    announcementBar: {
      text: "🌸 Complimentary Rose Squalane Travel Elixir with every order above ₹1,999 · 100% Clean & Vegan",
      bg: "#9F1239",
      textColor: "#FFF1F2",
    },
    trustBadges: [
      { title: "Clinically Verified", subtitle: "97% visible radiance in 14 days", icon: "award" },
      { title: "Clean & Vegan Certified", subtitle: "Free of parabens and sulfates", icon: "award" },
      { title: "Dermatologist Tested", subtitle: "Hypoallergenic for sensitive skin", icon: "shield" },
      { title: "Cruelty-Free Leaping Bunny", subtitle: "Never tested on animals", icon: "heart" },
    ],
    sampleCategories: [
      { name: "Hydrating Serums", slug: "serums", itemCount: "24 items", imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" },
      { name: "Gentle Cleansers", slug: "cleansers", itemCount: "16 items", imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80" },
      { name: "Barrier Moisturizers", slug: "moisturizers", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1608248597359-54316d97c5e3?auto=format&fit=crop&w=400&q=80" },
      { name: "Sun & Shield SPF 50+", slug: "spf", itemCount: "11 items", imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Velora Bio-Cellular Barrier Repair Serum (30ml)", slug: "velora-cellular-repair-serum", price: 2199, compareAtPrice: 2800, badge: "MOST LOVED", category: "Hydrating Serums", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
      { title: "Rose Petal Dew Peptide Mist", slug: "rose-petal-dew-mist", price: 1250, badge: "NEW", category: "Hydrating Serums", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" },
      { title: "Velvet Cloud Cream Barrier Balm", slug: "velvet-cloud-cream", price: 1850, compareAtPrice: 2200, badge: "AWARD WINNER", category: "Barrier Moisturizers", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1608248597359-54316d97c5e3?auto=format&fit=crop&w=600&q=80" },
      { title: "Invisible Sheer Glow Mineral SPF 50", slug: "sheer-glow-mineral-spf50", price: 1450, category: "Sun & Shield", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 5. JEWELRY - AURELLE
  {
    id: "jewelry-aurelle",
    code: "JEWELRY_AURELLE",
    name: "Aurelle",
    industry: "Fine Jewelry & Heirlooms",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Jewelry That Tells Your Timeless Story",
    description: "Opulent champagne gold and deep obsidian theme designed for fine gold, solitaires, lab-grown diamonds, and luxury heirloom ornaments. Features BIS Hallmark certs, karat selectors, and gift wrapping options.",
    isIncludedInFree: true,
    palette: {
      primary: "#B45309",
      accent: "#D97706",
      background: "#09090B",
      cardBg: "#18181B",
      text: "#FEF3C7",
      textMuted: "#A1A1AA",
      border: "#27272A",
      badgeBg: "#451A03",
      badgeText: "#FDE68A",
      headerBg: "#09090B",
      footerBg: "#030303",
      accentGlow: "rgba(217, 119, 6, 0.2)",
    },
    typography: {
      fontFamily: "'Cinzel', 'Playfair Display', serif",
      headingClass: "font-serif tracking-widest font-normal uppercase text-amber-200",
      bodyClass: "font-sans",
      buttonRadius: "rounded-none",
      badgeRadius: "rounded-none",
    },
    hero: {
      badge: "BIS HALLMARKED · CONFLICT-FREE DIAMONDS",
      headline: "Jewelry That Tells",
      headlineHighlight: "Your Timeless Story",
      subheadline: "Handcrafted in certified 18 Karat solid gold and precision-cut brilliant diamonds. Designed to be cherished across generations.",
      ctaPrimary: "View New Arrivals",
      ctaSecondary: "Book Virtual Consultation",
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85",
      style: "luxury-dark",
    },
    announcementBar: {
      text: "✨ Lifetime Exchange & 100% Certified BIS Hallmarked Gold · Insured Doorstep Delivery",
      bg: "#451A03",
      textColor: "#FDE68A",
    },
    trustBadges: [
      { title: "100% BIS Hallmarked", subtitle: "Official government purity stamp", icon: "award" },
      { title: "Insured Transit", subtitle: "100% covered till delivery", icon: "shield" },
      { title: "Lifetime Exchange", subtitle: "Full value exchange policy", icon: "refresh" },
      { title: "Certified Diamonds", subtitle: "IGI / GIA authenticated certificates", icon: "award" },
    ],
    sampleCategories: [
      { name: "Solitaire Rings", slug: "rings", itemCount: "38 items", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" },
      { name: "Pendants & Necklaces", slug: "necklaces", itemCount: "45 items", imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
      { name: "Diamond Studs & Drops", slug: "earrings", itemCount: "29 items", imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=400&q=80" },
      { name: "Solid Gold Bangles", slug: "bracelets", itemCount: "18 items", imageUrl: "https://images.unsplash.com/photo-1611591475817-5788e0b2323e?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Aurelle Lumina 18K Solitaire Ring (1.2ct VVS)", slug: "aurelle-lumina-solitaire-ring", price: 78500, compareAtPrice: 89000, badge: "HEIRLOOM", category: "Solitaire Rings", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80" },
      { title: "Celestial Constellation Gold Pendant", slug: "celestial-gold-pendant", price: 34500, badge: "NEW DROP", category: "Pendants & Necklaces", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80" },
      { title: "Petal Pavé Diamond Studs in Rose Gold", slug: "petal-pave-diamond-studs", price: 42000, category: "Diamond Studs", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80" },
      { title: "Infinite Curve 18K Solid Gold Bangle", slug: "infinite-curve-gold-bangle", price: 62000, category: "Solid Gold Bangles", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1611591475817-5788e0b2323e?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 6. FITNESS - FORGE
  {
    id: "fitness-forge",
    code: "FITNESS_FORGE",
    name: "Forge",
    industry: "Fitness & Athletic Performance",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "BECOME A MEMBER AND TRAIN — Iron Sharpens Iron",
    description: "High-voltage athletic theme designed for gym apparel, lifting belts, strength equipment, and sports nutrition. High-impact dark mode with crimson accents and condensed athletic typography.",
    isIncludedInFree: true,
    palette: {
      primary: "#DC2626",
      accent: "#EF4444",
      background: "#0A0A0A",
      cardBg: "#141414",
      text: "#F5F5F5",
      textMuted: "#A3A3A3",
      border: "#262626",
      badgeBg: "#DC2626",
      badgeText: "#FFFFFF",
      headerBg: "#0A0A0A",
      footerBg: "#000000",
      accentGlow: "rgba(220, 38, 38, 0.2)",
    },
    typography: {
      fontFamily: "'Oswald', -apple-system, BlinkMacSystemFont, Impact, sans-serif",
      headingClass: "font-mono uppercase font-black tracking-wider text-white",
      bodyClass: "font-sans",
      buttonRadius: "rounded-md",
      badgeRadius: "rounded-sm",
    },
    hero: {
      badge: "PRO ATHLETE DIVISION · NO EXCUSES",
      headline: "BECOME A MEMBER",
      headlineHighlight: "AND TRAIN",
      subheadline: "Engineered for intense heavy training sessions. Uncompromising compression garments, reinforced powerlifting belts, and clean performance fuel.",
      ctaPrimary: "Join The Team",
      ctaSecondary: "Explore Gear",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
      style: "industrial-bold",
    },
    announcementBar: {
      text: "🔥 NEW DROP LIVE: Forge Heavyweight Oversized Pump Covers Now in Stock · Free Shipping on Gym Bundles",
      bg: "#DC2626",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "Military Grade Stitching", subtitle: "Reinforced 4-way stress points", icon: "shield" },
      { title: "Lab Tested Clean", subtitle: "Zero banned substances in nutrition", icon: "award" },
      { title: "Free Exchanges", subtitle: "Quick size exchange guarantee", icon: "refresh" },
      { title: "Elite Athlete Approved", subtitle: "Tested by champion powerlifters", icon: "award" },
    ],
    sampleCategories: [
      { name: "Heavyweight Tees", slug: "pump-covers", itemCount: "22 items", imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80" },
      { name: "Seamless Compression", slug: "compression", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80" },
      { name: "Power Belts & Wraps", slug: "lifting-gear", itemCount: "14 items", imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=400&q=80" },
      { name: "Whey Isolate & Creatine", slug: "supplements", itemCount: "17 items", imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Forge 10mm Leather Lever Powerlifting Belt", slug: "forge-lever-belt", price: 4999, compareAtPrice: 6500, badge: "IPF GRADE", category: "Power Belts", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80" },
      { title: "Heavy Oversized Pump Cover Acid Wash Tee", slug: "heavy-pump-cover-tee", price: 1699, badge: "HOT DROP", category: "Heavyweight Tees", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80" },
      { title: "Forge 100% Pure Whey Isolate Protein (2kg)", slug: "forge-whey-isolate", price: 4299, compareAtPrice: 5200, badge: "LAB TESTED", category: "Whey Isolate", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80" },
      { title: "High-Tension Heavy Duty Wrist Wraps (Pair)", slug: "heavy-duty-wrist-wraps", price: 899, category: "Power Belts", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 7. HOME & LIVING - HEARTH
  {
    id: "home-hearth",
    code: "HOME_HEARTH",
    name: "Hearth",
    industry: "Home Decor & Furnishings",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Make Room for the Everyday — Small Details. A Softer Day.",
    description: "Warm sand, terracotta, oat, and calm sage tones designed for home decor, artisanal furniture, handcrafted rugs, and kitchenware. Room-by-room collections and serene lifestyle imagery.",
    isIncludedInFree: true,
    palette: {
      primary: "#9A3412",
      accent: "#C2410C",
      background: "#FAF7F2",
      cardBg: "#FFFFFF",
      text: "#431407",
      textMuted: "#78350F",
      border: "#F3ECE0",
      badgeBg: "#FFEDD5",
      badgeText: "#9A3412",
      headerBg: "#FAF7F2",
      footerBg: "#431407",
      accentGlow: "rgba(194, 65, 12, 0.1)",
    },
    typography: {
      fontFamily: "'Newsreader', Garamond, Georgia, serif",
      headingClass: "font-serif tracking-tight font-normal text-amber-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-lg",
      badgeRadius: "rounded-md",
    },
    hero: {
      badge: "NEW LIVING SPACES EDIT 2026",
      headline: "Make room for",
      headlineHighlight: "the everyday.",
      subheadline: "Gather around something good. Hand-thrown ceramic tableware, natural washed French flax linens, and solid oak furniture.",
      ctaPrimary: "Find Your Corner",
      ctaSecondary: "Browse Recent Picks",
      imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      style: "warm-terracotta",
    },
    announcementBar: {
      text: "🌾 Autumn Home Edit: Complimentary Swatch Sample Kit with any furniture consultation · Pan-India delivery",
      bg: "#9A3412",
      textColor: "#FFEDD5",
    },
    trustBadges: [
      { title: "Solid Hardwood", subtitle: "Sustainably harvested oak & teak", icon: "award" },
      { title: "Free Swatch Samples", subtitle: "Test fabrics in your lighting", icon: "award" },
      { title: "White-Glove Delivery", subtitle: "Unpacking & assembly in room", icon: "truck" },
      { title: "Built to Last Decades", subtitle: "5-Year structural warranty", icon: "shield" },
    ],
    sampleCategories: [
      { name: "Living Room Accents", slug: "living-room", itemCount: "42 items", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80" },
      { name: "Artisan Dining & Tableware", slug: "dining", itemCount: "36 items", imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80" },
      { name: "Organic Washed Linens", slug: "bedroom", itemCount: "28 items", imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80" },
      { name: "Sculptural Lighting", slug: "lighting", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Hearth Hand-Thrown Stoneware Dinner Set (16 Pcs)", slug: "hearth-stoneware-dinner-set", price: 6800, compareAtPrice: 8500, badge: "BESTSELLER", category: "Artisan Dining", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80" },
      { title: "Belgian Pure Flax Washed Duvet Set (King)", slug: "flax-washed-duvet-set", price: 7900, badge: "HANDCRAFTED", category: "Organic Linens", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80" },
      { title: "Noguchi-Inspired Ribbed Paper Floor Lamp", slug: "ribbed-paper-lamp", price: 4200, compareAtPrice: 5200, category: "Sculptural Lighting", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" },
      { title: "Solid White Oak Floating Bench", slug: "solid-white-oak-bench", price: 14500, category: "Living Room", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 8. KIDS & BABIES - LITTLE STEPS
  {
    id: "kids-little-steps",
    code: "BABY_LITTLE_STEPS",
    name: "Little Steps",
    industry: "Baby, Kids & Nursery",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Little Moments Big Tomorrows — Non-Toxic, Pure & Gentle",
    description: "Cheerful pastel sunshine yellow, soft sky blue, and baby mint designed for infant clothing, montessori wooden toys, nursery decor, and stroller gear. Features age filter pills and baby-safe badges.",
    isIncludedInFree: true,
    palette: {
      primary: "#0284C7",
      accent: "#F59E0B",
      background: "#F0F9FF",
      cardBg: "#FFFFFF",
      text: "#0C4A6E",
      textMuted: "#64748B",
      border: "#BAE6FD",
      badgeBg: "#FEF3C7",
      badgeText: "#92400E",
      headerBg: "#FFFFFF",
      footerBg: "#0C4A6E",
      accentGlow: "rgba(2, 132, 199, 0.1)",
    },
    typography: {
      fontFamily: "'Quicksand', -apple-system, BlinkMacSystemFont, sans-serif",
      headingClass: "font-sans font-bold tracking-normal text-sky-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-2xl",
      badgeRadius: "rounded-full",
    },
    hero: {
      badge: "GOTS CERTIFIED ORGANIC COTTON · BPA FREE",
      headline: "Little Moments",
      headlineHighlight: "Big Tomorrows",
      subheadline: "Everything you need for your baby's gentle first years. Non-toxic natural materials, Montessori sensory toys, and cloud-soft organic onesies.",
      ctaPrimary: "Shop Most Loved",
      ctaSecondary: "Browse by Age Group",
      imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=85",
      style: "playful-pastel",
    },
    announcementBar: {
      text: "🧸 Join Our Little Community: Get 15% off your first baby registry order with code TINY15 · 100% Non-Toxic",
      bg: "#0284C7",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "GOTS 100% Organic", subtitle: "Zero synthetic dyes or harsh chemicals", icon: "award" },
      { title: "Pediatrician Safe", subtitle: "Non-toxic & hypo-allergenic tested", icon: "shield" },
      { title: "Soft Doorstep Delivery", subtitle: "Sanitized hygienic packaging", icon: "truck" },
      { title: "Loved by 50,000+ Parents", subtitle: "Rated 4.9/5 by happy families", icon: "heart" },
    ],
    sampleCategories: [
      { name: "Organic Onesies & Rompers", slug: "clothing", itemCount: "48 items", imageUrl: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80" },
      { name: "Montessori Wooden Toys", slug: "toys", itemCount: "35 items", imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80" },
      { name: "Nursery Cots & Bedding", slug: "nursery", itemCount: "22 items", imageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80" },
      { name: "Feeding & Teething Gear", slug: "feeding", itemCount: "19 items", imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "CloudSoft Organic Zipper Sleepsuit (3-Pack)", slug: "organic-zipper-sleepsuit-pack", price: 1899, compareAtPrice: 2499, badge: "BESTSELLER", category: "Organic Onesies", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80" },
      { title: "Natural Beechwood Sensory Stacking Rings", slug: "beechwood-stacking-rings", price: 999, badge: "MONTESSORI", category: "Montessori Toys", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80" },
      { title: "Food-Grade Silicone Feeding Set with Suction Plate", slug: "silicone-feeding-set", price: 1299, compareAtPrice: 1699, badge: "BPA FREE", category: "Feeding Gear", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80" },
      { title: "Breathable Organic Cotton Baby Wrap Carrier", slug: "organic-cotton-baby-wrap", price: 2499, category: "Nursery", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 9. CRAFTS - MADE & FOUND
  {
    id: "crafts-made-found",
    code: "CRAFTS_MADE_FOUND",
    name: "Made & Found",
    industry: "Artisan Crafts & Handmade Ceramics",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Handmade Porcelain and Stoneware Goods — Meet The Maker",
    description: "Earthy raw ceramic clay, warm oatmeal, and olive green theme tailored for studio potters, wood turners, hand weavers, and craft artisans. Features maker studio provenance, batch numbers, and studio workshop classes.",
    isIncludedInFree: true,
    palette: {
      primary: "#78350F",
      accent: "#B45309",
      background: "#F5F0EB",
      cardBg: "#FFFFFF",
      text: "#451A03",
      textMuted: "#78350F",
      border: "#E7DFD5",
      badgeBg: "#FEF3C7",
      badgeText: "#78350F",
      headerBg: "#F5F0EB",
      footerBg: "#291305",
      accentGlow: "rgba(180, 83, 9, 0.15)",
    },
    typography: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      headingClass: "font-serif tracking-wide font-normal italic text-amber-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-sm",
      badgeRadius: "rounded-none",
    },
    hero: {
      badge: "SMALL-BATCH STUDIO FIRINGS · NUMBERED EDITIONS",
      headline: "Handmade Porcelain",
      headlineHighlight: "and Stoneware Goods",
      subheadline: "Thrown on the potter's wheel and fired in gas reduction kilns. Functional, soulful objects intended to bring mindful presence to your everyday rituals.",
      ctaPrimary: "Shop The Collection",
      ctaSecondary: "Meet The Maker",
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85",
      style: "warm-terracotta",
    },
    announcementBar: {
      text: "🏺 Batch No. 14 Just Fired: Limited 50 cups available per glaze · Studio visits welcome in Bengaluru",
      bg: "#78350F",
      textColor: "#FEF3C7",
    },
    trustBadges: [
      { title: "Wheel-Thrown by Hand", subtitle: "Unique fingerprint in every piece", icon: "award" },
      { title: "Food & Microwave Safe", subtitle: "Lead-free non-toxic glazes", icon: "shield" },
      { title: "Zero-Plastic Packaging", subtitle: "Packed in molded paper pulp", icon: "heart" },
      { title: "Direct Maker Support", subtitle: "100% of proceeds support our studio", icon: "award" },
    ],
    sampleCategories: [
      { name: "Coffee & Matcha Cups", slug: "cups", itemCount: "26 items", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80" },
      { name: "Stoneware Vases", slug: "vases", itemCount: "18 items", imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80" },
      { name: "Serving Bowls & Platters", slug: "platters", itemCount: "15 items", imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80" },
      { name: "Intro to Ceramics Workshop", slug: "workshops", itemCount: "4 sessions", imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Speckled Sand Stoneware Matcha Bowl (Chawan)", slug: "speckled-sand-matcha-bowl", price: 1850, compareAtPrice: 2200, badge: "STUDIO SIGNED", category: "Coffee & Matcha Cups", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
      { title: "Wabi-Sabi Asymmetric Ceramic Bud Vase", slug: "asymmetric-bud-vase", price: 2400, badge: "ONE OF A KIND", category: "Stoneware Vases", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80" },
      { title: "Iron-Dappled Shallow Pasta & Salad Bowl", slug: "iron-dappled-pasta-bowl", price: 1650, category: "Serving Bowls", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80" },
      { title: "Hand-Carved Olive Wood Butter Knife", slug: "olive-wood-butter-knife", price: 650, category: "Serving Bowls", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 10. TRAVEL & OUTDOOR - TRAIL
  {
    id: "travel-trail",
    code: "TRAVEL_TRAIL",
    name: "Trail",
    industry: "Outdoor, Hiking & Travel Gear",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Get Out There — Built for the Long Trail.",
    description: "Rugged alpine forest green and granite slate theme built for trekking packs, ultralight tents, technical shells, camping cookware, and expedition travel gear. Includes weather ratings and trail spec tags.",
    isIncludedInFree: true,
    palette: {
      primary: "#14532D",
      accent: "#15803D",
      background: "#F4F6F4",
      cardBg: "#FFFFFF",
      text: "#052E16",
      textMuted: "#4B5563",
      border: "#D1E7DD",
      badgeBg: "#DCFCE7",
      badgeText: "#14532D",
      headerBg: "#FFFFFF",
      footerBg: "#052E16",
      accentGlow: "rgba(20, 83, 45, 0.15)",
    },
    typography: {
      fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
      headingClass: "font-sans font-bold tracking-tight text-emerald-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-lg",
      badgeRadius: "rounded-md",
    },
    hero: {
      badge: "EXPEDITION READY · IPX8 WEATHERPROOF",
      headline: "Get out",
      headlineHighlight: "there.",
      subheadline: "Built for the long trail. Ultralight Cordura packs, storm-tested 4-season alpine shelters, and technical apparel engineered for unforgiving weather.",
      ctaPrimary: "Shop By Activity",
      ctaSecondary: "Trail Bestsellers",
      imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=85",
      style: "rugged-outdoor",
    },
    announcementBar: {
      text: "🌲 Himalayan Expedition Drop: Free Stormproof Dry Sack with every trekking backpack over ₹4,999",
      bg: "#14532D",
      textColor: "#DCFCE7",
    },
    trustBadges: [
      { title: "Lifetime Field Repair", subtitle: "We fix trail wear and tear for life", icon: "shield" },
      { title: "IPX8 Submersible Spec", subtitle: "Tested in extreme monsoons", icon: "award" },
      { title: "Ultralight Carbon Fiber", subtitle: "Gram-conscious backpacking", icon: "award" },
      { title: "Leave No Trace Partner", subtitle: "1% of all revenue given to trails", icon: "heart" },
    ],
    sampleCategories: [
      { name: "Expedition Backpacks (45L-75L)", slug: "backpacks", itemCount: "24 items", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80" },
      { name: "Ultralight Alpine Tents", slug: "tents", itemCount: "16 items", imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80" },
      { name: "Stormproof Shells & Down", slug: "apparel", itemCount: "32 items", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80" },
      { name: "Camp Cookware & Filtration", slug: "cookware", itemCount: "29 items", imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Trail Ridgeline 55L Technical Hiking Pack", slug: "trail-ridgeline-55l-pack", price: 8999, compareAtPrice: 11499, badge: "TRAIL TESTED", category: "Expedition Backpacks", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
      { title: "Sub-Zero Ultralight Goose Down Sleeping Bag (-10°C)", slug: "goose-down-sleeping-bag", price: 12500, compareAtPrice: 15000, badge: "HOT PICK", category: "Tents", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80" },
      { title: "Titanium Ultralight Camp Stove & Pot Set", slug: "titanium-camp-stove-set", price: 2999, category: "Camp Cookware", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80" },
      { title: "Carbon Fiber Anti-Shock Trekking Poles (Pair)", slug: "carbon-fiber-trekking-poles", price: 3499, category: "Expedition Backpacks", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 11. PET SUPPLIES - PAWS
  {
    id: "pet-paws",
    code: "PET_PAWS",
    name: "Paws",
    industry: "Pet Supplies, Food & Accessories",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Everyday Life With Your Pet — Made for the Daily Walk.",
    description: "Warm companion amber, soft teal, and friendly cream theme built for raw nutrition, indestructible chew toys, ergonomic harness sets, and cat scratching towers. Includes Dog/Cat filter toggles and vet seals.",
    isIncludedInFree: true,
    palette: {
      primary: "#D97706",
      accent: "#0D9488",
      background: "#FFFDF9",
      cardBg: "#FFFFFF",
      text: "#451A03",
      textMuted: "#6B7280",
      border: "#FDE68A",
      badgeBg: "#FEF3C7",
      badgeText: "#92400E",
      headerBg: "#FFFFFF",
      footerBg: "#451A03",
      accentGlow: "rgba(217, 119, 6, 0.12)",
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      headingClass: "font-sans font-extrabold tracking-tight text-amber-950",
      bodyClass: "font-sans",
      buttonRadius: "rounded-xl",
      badgeRadius: "rounded-full",
    },
    hero: {
      badge: "VETERINARIAN RECOMMENDED · 100% WHOLESOME",
      headline: "Everyday life with",
      headlineHighlight: "your pet.",
      subheadline: "Made for the daily walk and the evening cuddle. Nutrient-dense organic kibble, indestructible natural rubber chew toys, and ergonomic walking sets.",
      ctaPrimary: "Shop Pet Bestsellers",
      ctaSecondary: "Explore Walk Kits",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=85",
      style: "fresh-organic",
    },
    announcementBar: {
      text: "🐾 Treat Your Best Friend: Free pack of Freeze-Dried Salmon Treats on orders over ₹1,499 with code WOOF",
      bg: "#D97706",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "Vet Formulated Food", subtitle: "Grain-free whole animal protein", icon: "award" },
      { title: "Chew-Proof Replacement", subtitle: "Guaranteed tough or free swap", icon: "shield" },
      { title: "Quick Doorstep Delivery", subtitle: "Never run out of kibble", icon: "truck" },
      { title: "Shelter Donation", subtitle: "1 meal donated for every order", icon: "heart" },
    ],
    sampleCategories: [
      { name: "Dog Walking Sets & Harness", slug: "dog-walk", itemCount: "34 items", imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80" },
      { name: "Raw & Grain-Free Nutrition", slug: "nutrition", itemCount: "45 items", imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=400&q=80" },
      { name: "Indestructible Chew Toys", slug: "toys", itemCount: "28 items", imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80" },
      { name: "Orthopedic Memory Beds", slug: "beds", itemCount: "16 items", imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Paws All-Weather Ergonomic No-Pull Harness", slug: "ergonomic-no-pull-harness", price: 1899, compareAtPrice: 2499, badge: "BESTSELLER", category: "Dog Walking Sets", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80" },
      { title: "Freeze-Dried Wild Salmon & Chicken Bites (200g)", slug: "freeze-dried-salmon-bites", price: 799, badge: "100% NATURAL", category: "Nutrition", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80" },
      { title: "Ultra-Tough Natural Tree Rubber Bone (Large)", slug: "tough-tree-rubber-bone", price: 650, compareAtPrice: 850, badge: "DURABLE", category: "Chew Toys", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80" },
      { title: "Orthopedic Dual-Layer Memory Foam Dog Sofa Bed", slug: "memory-foam-dog-bed", price: 3499, category: "Orthopedic Beds", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 12. MOBILES & ACCESSORIES - ARMOR
  {
    id: "mobiles-armor",
    code: "MOBILES_ARMOR",
    name: "Armor",
    industry: "Mobiles, Cases & Tech Accessories",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Protection for the Phone You Live On — Serious Protection, Considered Design.",
    description: "Carbon fiber graphite and titanium slate theme engineered for shockproof phone cases, MagSafe power stations, sapphire screen guards, and braided Kevlar cables. Features device model pickers (iPhone 16, S25 Ultra) and 15ft drop tests.",
    isIncludedInFree: true,
    palette: {
      primary: "#0F172A",
      accent: "#E11D48",
      background: "#090D16",
      cardBg: "#111827",
      text: "#F8FAFC",
      textMuted: "#94A3B8",
      border: "#1E293B",
      badgeBg: "#1E293B",
      badgeText: "#F8FAFC",
      headerBg: "#090D16",
      footerBg: "#020617",
      accentGlow: "rgba(225, 29, 72, 0.15)",
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      headingClass: "font-sans font-black tracking-tight text-white uppercase",
      bodyClass: "font-sans",
      buttonRadius: "rounded-lg",
      badgeRadius: "rounded-md",
    },
    hero: {
      badge: "MIL-STD 810G · 15FT DROP TEST CERTIFIED",
      headline: "Protection for the phone",
      headlineHighlight: "you live on.",
      subheadline: "Serious protection, considered design. Aramid fiber composites, aerospace titanium kickstands, and ultra-strong neodymium MagSafe arrays.",
      ctaPrimary: "Select Your Device",
      ctaSecondary: "Explore Bestsellers",
      imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=85",
      style: "tech-contrast",
    },
    announcementBar: {
      text: "🛡️ iPhone 16 Pro & Galaxy S25 Ultra Cases Now Shipping · Free Tempered Glass Screen Guard with Any Armor Case",
      bg: "#1E293B",
      textColor: "#F8FAFC",
    },
    trustBadges: [
      { title: "15FT Drop Protection", subtitle: "Exceeds US military drop tests", icon: "shield" },
      { title: "MagSafe Neodymium Array", subtitle: "2X stronger magnetic hold", icon: "award" },
      { title: "Lifetime Case Warranty", subtitle: "No yellowing or peeling promise", icon: "award" },
      { title: "Precision CNC Cutouts", subtitle: "Tactile click titanium buttons", icon: "check" },
    ],
    sampleCategories: [
      { name: "MagSafe Drop Cases", slug: "cases", itemCount: "64 models", imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=400&q=80" },
      { name: "3-in-1 Foldable Charging Stations", slug: "chargers", itemCount: "18 items", imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=400&q=80" },
      { name: "9H Sapphire Screen Protectors", slug: "screen-protectors", itemCount: "42 items", imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=400&q=80" },
      { name: "Braided 240W Kevlar Cables", slug: "cables", itemCount: "15 items", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Armor MagGuard Titanium Kickstand Case (iPhone 16 Pro Max)", slug: "magguard-titanium-case-iphone-16", price: 2499, compareAtPrice: 3499, badge: "15FT DROP TEST", category: "MagSafe Drop Cases", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80" },
      { title: "3-in-1 Aluminum MagSafe Qi2 Travel Charger", slug: "3-in-1-aluminum-magsafe-charger", price: 4999, compareAtPrice: 6500, badge: "HOT SELLER", category: "Charging Stations", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=600&q=80" },
      { title: "Armor PureGlass 9H Sapphire Screen Protector (2-Pack)", slug: "pureglass-sapphire-protector-pack", price: 999, badge: "EASY INSTALL", category: "Screen Protectors", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80" },
      { title: "UltraKevlar 240W USB-C to USB-C Fast Cable (2M)", slug: "ultrakevlar-240w-cable", price: 1199, category: "Cables", rating: 5.0, imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80" },
    ],
  },

  // 13. GENERAL RETAIL - AVRO SIGNATURE
  {
    id: "avro-signature",
    code: "AVRO_SIGNATURE",
    name: "AVRO Signature",
    industry: "General Retail & Modern All-Purpose",
    referenceUrl: "#",
    referenceDisplay: "AVRO Native Archetype",
    tagline: "Find Your Next Favourite — The Versatile Multi-Category Standard",
    description: "Clean modern navy and crisp white commerce base suitable for any catalog. Balanced whitespace, multi-category carousels, responsive facet filters, and maximum conversion rates.",
    isIncludedInFree: true,
    palette: {
      primary: "#0A192F",
      accent: "#2563EB",
      background: "#F8FAFC",
      cardBg: "#FFFFFF",
      text: "#0F172A",
      textMuted: "#64748B",
      border: "#E2E8F0",
      badgeBg: "#EFF6FF",
      badgeText: "#2563EB",
      headerBg: "#FFFFFF",
      footerBg: "#0A192F",
      accentGlow: "rgba(37, 99, 235, 0.1)",
    },
    typography: {
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      headingClass: "font-sans font-extrabold tracking-tight text-[#0A192F]",
      bodyClass: "font-sans",
      buttonRadius: "rounded-xl",
      badgeRadius: "rounded-full",
    },
    hero: {
      badge: "AVRO CURATED COLLECTIONS 2026",
      headline: "Find your next",
      headlineHighlight: "favourite.",
      subheadline: "Shop top-rated electronics, minimalist apparel, home furnishings, and daily curated finds — all with verified authenticity and fast delivery.",
      ctaPrimary: "Shop By Category",
      ctaSecondary: "Explore Products",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
      style: "editorial-split",
    },
    announcementBar: {
      text: "⚡ Welcome to AVRO Store · Complimentary domestic delivery on orders over ₹999 with 7-day easy returns",
      bg: "#0A192F",
      textColor: "#FFFFFF",
    },
    trustBadges: [
      { title: "Express Dispatch", subtitle: "Shipped within 24 hours", icon: "truck" },
      { title: "Safe & Encrypted Checkout", subtitle: "256-bit SSL encrypted payments", icon: "shield" },
      { title: "Verified Authentic", subtitle: "100% Genuine manufacturer guarantee", icon: "award" },
      { title: "7-Day Easy Replacement", subtitle: "Zero hassle doorstep resolution", icon: "refresh" },
    ],
    sampleCategories: [
      { name: "Consumer Electronics", slug: "electronics", itemCount: "48 items", imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" },
      { name: "Urban Apparel", slug: "apparel", itemCount: "64 items", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80" },
      { name: "Workspace & Audio", slug: "workspace", itemCount: "32 items", imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80" },
      { name: "Home Essentials", slug: "home", itemCount: "29 items", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" },
    ],
    sampleProducts: [
      { title: "Avro Apex Noise-Cancelling Over-Ear Headphones", slug: "apex-anc-headphones", price: 4999, compareAtPrice: 6999, badge: "FEATURED", category: "Electronics", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
      { title: "Heavyweight Minimalist Graphic Hoodie", slug: "minimalist-graphic-hoodie", price: 2199, badge: "NEW", category: "Apparel", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80" },
      { title: "Matte Black Precision Desk Mat & Cable Guide", slug: "matte-desk-mat", price: 1299, compareAtPrice: 1799, category: "Workspace", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80" },
      { title: "Double-Walled Insulated Thermal Tumbler (750ml)", slug: "thermal-tumbler", price: 999, category: "Home Essentials", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80" },
    ],
  },
];

export function getThemeById(idOrCode: string, themeSetting?: any): AvroThemeDefinition {
  return resolveStoreTheme(idOrCode, themeSetting);
}

export function extractCustomThemes(themeSetting?: any): AvroThemeDefinition[] {
  if (!themeSetting) return [];
  let list: any[] = [];
  try {
    if (Array.isArray(themeSetting.customThemes)) {
      list = themeSetting.customThemes;
    } else if (themeSetting.customThemesJson) {
      list = JSON.parse(themeSetting.customThemesJson);
    } else if (themeSetting.socialLinksJson) {
      const parsed =
        typeof themeSetting.socialLinksJson === "string"
          ? JSON.parse(themeSetting.socialLinksJson)
          : themeSetting.socialLinksJson;
      if (Array.isArray(parsed?.customThemes)) {
        list = parsed.customThemes;
      }
    }
  } catch (e) {
    list = [];
  }
  return Array.isArray(list) ? list : [];
}

export function getAllThemes(themeSetting?: any): AvroThemeDefinition[] {
  const custom = extractCustomThemes(themeSetting);
  return [...custom, ...AVRO_THEMES];
}

export function resolveStoreTheme(
  idOrCode?: string | null,
  themeSetting?: any
): AvroThemeDefinition {
  const all = getAllThemes(themeSetting);
  const target = String(idOrCode || themeSetting?.activeTheme || "AVRO_SIGNATURE").trim();

  const found = all.find(
    (t) =>
      t.code === target ||
      t.id === target ||
      t.code.toLowerCase() === target.toLowerCase() ||
      t.id.toLowerCase() === target.toLowerCase() ||
      (target.toUpperCase() === "TALIM_DEFAULT" && t.code === "AVRO_SIGNATURE")
  );

  return found || AVRO_THEMES[12]; // Fallback to AVRO Signature
}

export function createDefaultCustomTheme(
  name?: string,
  basePresetCode?: string
): AvroThemeDefinition {
  const base =
    AVRO_THEMES.find((t) => t.code === basePresetCode || t.id === basePresetCode) ||
    AVRO_THEMES[12]; // AVRO Signature

  const timestamp = Date.now();
  const id = `custom-${timestamp}`;
  const code = `CUSTOM_${timestamp}`;
  const themeName = name?.trim() || "My Branded Theme";

  return {
    id,
    code,
    name: themeName,
    industry: base.industry || "Custom Bespoke Store",
    referenceUrl: "#",
    referenceDisplay: "Custom Merchant Theme",
    tagline: `Exclusive branded design for ${themeName}`,
    description: `A custom-crafted merchant theme with bespoke typography, curated brand palettes, customized hero banners, and tailor-made layout styling.`,
    isIncludedInFree: false,
    palette: { ...base.palette },
    typography: { ...base.typography },
    hero: {
      ...base.hero,
      headline: `Welcome to ${themeName}`,
      subheadline: `Discover handcrafted essentials, curated new drops, and signature collections.`,
    },
    announcementBar: { ...base.announcementBar },
    trustBadges: [...base.trustBadges],
    sampleCategories: [...base.sampleCategories],
    sampleProducts: [...base.sampleProducts],
  };
}
