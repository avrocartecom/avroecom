const { PrismaClient } = require("../src/generated/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Customer Store Database...");

  // 1. Store Admin
  const adminPasswordHash = await bcrypt.hash("storeadmin123", 10);
  const storeAdmin = await prisma.storeAdmin.upsert({
    where: { email: "storeadmin@example.com" },
    update: {},
    create: {
      name: "Store Administrator",
      email: "storeadmin@example.com",
      passwordHash: adminPasswordHash,
      role: "OWNER",
    },
  });
  console.log(`Created store owner: ${storeAdmin.email}`);

  // 2. License Cache
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  const graceExpiry = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours from now

  const entitlements = {
    paymentGateways: true,
    courierIntegrations: true,
    customThemes: true,
    advancedReports: true,
    prioritySupport: false,
    maxAdminUsers: 3,
  };

  const existingCache = await prisma.licenseCache.findFirst();
  if (!existingCache) {
    await prisma.licenseCache.create({
      data: {
        licenseKey: "AVRO-GROW-8F3C7B21A90E-7C32",
        plan: "GROW",
        status: "ACTIVE",
        domain: "localhost:3001",
        installationUuid: "avro-store-inst-loc-001",
        entitlementsJson: JSON.stringify(entitlements),
        expiresAt: oneYearLater,
        lastValidatedAt: new Date(),
        gracePeriodUntil: graceExpiry,
        centralApiUrl: "http://localhost:3000/api/v1",
      },
    });
  }

  // 3. Theme Settings
  const existingTheme = await prisma.storeThemeSetting.findFirst();
  if (!existingTheme) {
    await prisma.storeThemeSetting.create({
      data: {
        activeTheme: "MODERN_MINIMAL",
        brandName: "AVRO Lifestyle & Tech",
        logoUrl: "",
        faviconUrl: "",
        primaryColor: "#0A192F",
        accentColor: "#2563EB",
        fontFamily: "Inter, sans-serif",
        bannerHeadline: "Precision Engineered for Everyday Life",
        bannerSubheadline: "Discover minimalist apparel, high-performance audio, and refined workspace gear.",
        bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
        announcementBarText: "⚡ Free Priority Delivery on all orders across India above ₹999",
        showAnnouncementBar: true,
        footerText: "© 2026 AVRO Lifestyle & Tech. Powered by AVRO by TECHNEXT.",
      },
    });
  }

  // 4. Payment Gateways
  const paymentGateways = [
    {
      provider: "COD",
      isEnabled: true,
      isTestMode: false,
      title: "Cash on Delivery",
      description: "Pay with cash or UPI at the time of delivery.",
      configJson: JSON.stringify({ extraCharge: 0 }),
    },
    {
      provider: "BANK_TRANSFER",
      isEnabled: true,
      isTestMode: false,
      title: "Direct Bank Transfer (NEFT/RTGS/IMPS)",
      description: "Transfer directly to our corporate bank account. Orders ship after clearance.",
      configJson: JSON.stringify({
        bankName: "HDFC Bank",
        accountName: "AVRO RETAIL SOLUTIONS",
        accountNumber: "50200088991122",
        ifscCode: "HDFC0001234",
        branch: "Connaught Place, New Delhi",
      }),
    },
    {
      provider: "RAZORPAY",
      isEnabled: true,
      isTestMode: true,
      title: "Razorpay (Cards, UPI, Netbanking)",
      description: "Instant, 100% secure checkout powered by Razorpay.",
      configJson: JSON.stringify({
        keyId: "rzp_test_SampleKey12345",
        keySecret: "SampleSecretKeyForDemo1234",
        webhookSecret: "whsec_sampleRazorpayWebhook99",
      }),
    },
    {
      provider: "PHONEPE",
      isEnabled: false,
      isTestMode: true,
      title: "PhonePe PG (UPI & Wallets)",
      description: "Direct UPI & QR code checkout via PhonePe Business.",
      configJson: JSON.stringify({
        merchantId: "MERCHANT_SAMPLE_TEST",
        saltKey: "sample-salt-key-phonepe-12345",
        saltIndex: "1",
      }),
    },
    {
      provider: "STRIPE",
      isEnabled: false,
      isTestMode: true,
      title: "Stripe Global Payments",
      description: "Accept international credit and debit cards.",
      configJson: JSON.stringify({
        publishableKey: "pk_test_sampleStripeKey123",
        secretKey: "sk_test_sampleStripeSecret123",
        webhookSecret: "whsec_sampleStripeWebhook",
      }),
    },
  ];

  for (const pg of paymentGateways) {
    await prisma.paymentGatewaySetting.upsert({
      where: { provider: pg.provider },
      update: pg,
      create: pg,
    });
  }

  // 5. Shipping Providers
  const shippingProviders = [
    {
      provider: "FLAT_RATE",
      isEnabled: true,
      isTestMode: false,
      title: "Standard Courier Delivery",
      configJson: JSON.stringify({
        rate: 99,
        freeShippingThreshold: 999,
        estimatedDeliveryDays: "3-5 Business Days",
      }),
    },
    {
      provider: "SHIPROCKET",
      isEnabled: true,
      isTestMode: true,
      title: "Shiprocket Automated Fulfillment",
      configJson: JSON.stringify({
        apiEmail: "logistics@store.example.com",
        apiPassword: "passwordSample123",
        pickupPincode: "110001",
        defaultCourier: "Delhivery Surface",
      }),
    },
    {
      provider: "DELHIVERY",
      isEnabled: false,
      isTestMode: true,
      title: "Delhivery Direct Logistics",
      configJson: JSON.stringify({
        apiToken: "sample-delhivery-api-token-999",
        clientName: "AVRO_RETAIL",
      }),
    },
    {
      provider: "DTDC",
      isEnabled: false,
      isTestMode: true,
      title: "DTDC Express Courier",
      configJson: JSON.stringify({
        customerCode: "DTDC_AVRO_01",
        apiKey: "sample-dtdc-key-999",
      }),
    },
  ];

  for (const sp of shippingProviders) {
    await prisma.shippingProviderSetting.upsert({
      where: { provider: sp.provider },
      update: sp,
      create: sp,
    });
  }

  // 6. Categories
  const catElectronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics & Audio",
      slug: "electronics",
      description: "High fidelity wireless audio, keyboards, and modern computing peripherals.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
  });

  const catApparel = await prisma.category.upsert({
    where: { slug: "apparel" },
    update: {},
    create: {
      name: "Minimal Apparel",
      slug: "apparel",
      description: "Architectural, breathable essentials crafted from premium natural fibres.",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
  });

  const catWorkspace = await prisma.category.upsert({
    where: { slug: "workspace" },
    update: {},
    create: {
      name: "Workspace & Accessories",
      slug: "workspace",
      description: "Ergonomic stands, lamps, and bags engineered for focused productivity.",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
  });

  // 7. Products and Variants
  const p1 = await prisma.product.upsert({
    where: { sku: "AVR-AUD-001" },
    update: {},
    create: {
      title: "Apex Pro Wireless Noise-Cancelling Headphones",
      slug: "apex-pro-wireless-headphones",
      shortDescription: "Custom 40mm beryllium drivers, active hybrid noise cancellation, 45-hour battery.",
      description: "Engineered for pure acoustic precision. The Apex Pro combines dual-feedforward and feedback microphones with custom acoustic chambers to eliminate background distractions while preserving micro-dynamics.",
      regularPrice: 14999,
      salePrice: 12499,
      sku: "AVR-AUD-001",
      stockQuantity: 45,
      categoryId: catElectronics.id,
      status: "PUBLISHED",
      featured: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80", isPrimary: true, sortOrder: 1 },
          { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80", isPrimary: false, sortOrder: 2 },
        ],
      },
      variants: {
        create: [
          { title: "Midnight Navy", sku: "AVR-AUD-001-NVY", price: 12499, stockQuantity: 25, attributesJson: JSON.stringify({ Color: "Midnight Navy" }) },
          { title: "Matte Black", sku: "AVR-AUD-001-BLK", price: 12499, stockQuantity: 20, attributesJson: JSON.stringify({ Color: "Matte Black" }) },
        ],
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { sku: "AVR-KBD-002" },
    update: {},
    create: {
      title: "Tactile Mechanical Studio Keyboard",
      slug: "tactile-mechanical-keyboard",
      shortDescription: "CNC anodized aluminium case, hot-swappable switches, sound-dampened gasket mount.",
      description: "Designed for tactile enthusiasts and software engineers. Built with a solid CNC milled unibody, pre-lubricated stabilizers, and custom acoustic foam dampening.",
      regularPrice: 8999,
      salePrice: 7499,
      sku: "AVR-KBD-002",
      stockQuantity: 32,
      categoryId: catElectronics.id,
      status: "PUBLISHED",
      featured: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80", isPrimary: true, sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { title: "Gateron Brown (Tactile)", sku: "AVR-KBD-002-BRN", price: 7499, stockQuantity: 18, attributesJson: JSON.stringify({ Switch: "Tactile Brown" }) },
          { title: "Gateron Red (Linear)", sku: "AVR-KBD-002-RED", price: 7499, stockQuantity: 14, attributesJson: JSON.stringify({ Switch: "Linear Red" }) },
        ],
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { sku: "AVR-APP-003" },
    update: {},
    create: {
      title: "Architectural Heavyweight Linen Overshirt",
      slug: "heavyweight-linen-overshirt",
      shortDescription: "100% French linen, tailored boxy silhouette, horn buttons.",
      description: "A year-round layering essential. Milled from sustainably cultivated French flax with a structured 280 GSM weight that softens naturally with wear.",
      regularPrice: 4299,
      salePrice: 3499,
      sku: "AVR-APP-003",
      stockQuantity: 60,
      categoryId: catApparel.id,
      status: "PUBLISHED",
      featured: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80", isPrimary: true, sortOrder: 1 },
        ],
      },
      variants: {
        create: [
          { title: "Charcoal - M", sku: "AVR-APP-003-CHR-M", price: 3499, stockQuantity: 15, attributesJson: JSON.stringify({ Color: "Charcoal", Size: "M" }) },
          { title: "Charcoal - L", sku: "AVR-APP-003-CHR-L", price: 3499, stockQuantity: 15, attributesJson: JSON.stringify({ Color: "Charcoal", Size: "L" }) },
          { title: "Sand Dune - M", sku: "AVR-APP-003-SND-M", price: 3499, stockQuantity: 15, attributesJson: JSON.stringify({ Color: "Sand Dune", Size: "M" }) },
          { title: "Sand Dune - L", sku: "AVR-APP-003-SND-L", price: 3499, stockQuantity: 15, attributesJson: JSON.stringify({ Color: "Sand Dune", Size: "L" }) },
        ],
      },
    },
  });

  const p4 = await prisma.product.upsert({
    where: { sku: "AVR-BAG-004" },
    update: {},
    create: {
      title: "Modular Commuter Weatherproof Backpack (24L)",
      slug: "modular-commuter-backpack",
      shortDescription: "Cordura 500D ballistic nylon, Fidlock magnetic buckles, 16-inch suspended laptop pouch.",
      description: "Engineered for all-weather urban transitions. Features an ergonomic airflow back-panel, quick-access passport pocket, and expandable clamshell opening.",
      regularPrice: 6499,
      salePrice: 5499,
      sku: "AVR-BAG-004",
      stockQuantity: 28,
      categoryId: catWorkspace.id,
      status: "PUBLISHED",
      featured: false,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80", isPrimary: true, sortOrder: 1 },
        ],
      },
    },
  });

  // 8. Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 1500,
      usageLimit: 100,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "AVRO500" },
    update: {},
    create: {
      code: "AVRO500",
      discountType: "FIXED",
      discountValue: 500,
      minOrderAmount: 4999,
      usageLimit: 50,
    },
  });

  // 9. Store Customer and Orders
  const customerUser = await prisma.storeCustomer.upsert({
    where: { email: "dev.user@example.com" },
    update: {},
    create: {
      name: "Aditya Roy",
      email: "dev.user@example.com",
      phone: "+91 91234 56789",
      addresses: {
        create: {
          fullName: "Aditya Roy",
          addressLine1: "Tower B, Flat 402, Green Glen Layout",
          addressLine2: "Bellandur Outer Ring Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560103",
          country: "IN",
          phone: "+91 91234 56789",
          isDefault: true,
        },
      },
    },
  });

  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: "ORD-2026-1001" },
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        orderNumber: "ORD-2026-1001",
        customerId: customerUser.id,
        customerName: "Aditya Roy",
        customerEmail: "dev.user@example.com",
        customerPhone: "+91 91234 56789",
        shippingAddressJson: JSON.stringify({
          fullName: "Aditya Roy",
          addressLine1: "Tower B, Flat 402, Green Glen Layout",
          addressLine2: "Bellandur Outer Ring Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560103",
          phone: "+91 91234 56789",
        }),
        billingAddressJson: JSON.stringify({
          fullName: "Aditya Roy",
          addressLine1: "Tower B, Flat 402, Green Glen Layout",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560103",
        }),
        subtotal: 12499,
        discount: 0,
        shippingFee: 0,
        total: 12499,
        orderStatus: "PROCESSING",
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        transactionId: "pay_live_test_77819283",
        shippingProvider: "SHIPROCKET",
        trackingNumber: "SR778192003IN",
        items: {
          create: [
            {
              productId: p1.id,
              title: "Apex Pro Wireless Noise-Cancelling Headphones",
              variantTitle: "Midnight Navy",
              sku: "AVR-AUD-001-NVY",
              price: 12499,
              quantity: 1,
              total: 12499,
            },
          ],
        },
      },
    });

    await prisma.order.create({
      data: {
        orderNumber: "ORD-2026-1002",
        customerId: customerUser.id,
        customerName: "Sneha Nair",
        customerEmail: "sneha.nair@example.com",
        customerPhone: "+91 98888 12345",
        shippingAddressJson: JSON.stringify({
          fullName: "Sneha Nair",
          addressLine1: "42, Palm Avenue, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500033",
          phone: "+91 98888 12345",
        }),
        billingAddressJson: JSON.stringify({
          fullName: "Sneha Nair",
          addressLine1: "42, Palm Avenue, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500033",
        }),
        subtotal: 10998,
        discount: 500,
        shippingFee: 0,
        total: 10498,
        couponCode: "AVRO500",
        orderStatus: "SHIPPED",
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        shippingProvider: "DELHIVERY",
        trackingNumber: "DEL489102847",
        items: {
          create: [
            {
              productId: p2.id,
              title: "Tactile Mechanical Studio Keyboard",
              variantTitle: "Gateron Brown (Tactile)",
              sku: "AVR-KBD-002-BRN",
              price: 7499,
              quantity: 1,
              total: 7499,
            },
            {
              productId: p3.id,
              title: "Architectural Heavyweight Linen Overshirt",
              variantTitle: "Charcoal - L",
              sku: "AVR-APP-003-CHR-L",
              price: 3499,
              quantity: 1,
              total: 3499,
            },
          ],
        },
      },
    });
  }

  console.log("Customer Store Database Seeding Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
