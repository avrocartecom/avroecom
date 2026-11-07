# AVRO Storefront & Merchant Admin Panel Engine

> **Self-hosted, autonomous commerce platform engineered for independent merchants, fast-growing brands, and digital creators.**

Developed by **TECHNEXT TECHNOLOGIES**, **AVRO** gives you complete ownership over your store data, customer orders, payment settlements, and design themes—with zero vendor lock-in and zero transaction cut fees.

---

## What is Included in This Repository

### High-Converting Customer Storefront
- **Responsive Multi-Theme Architecture**: Modern pre-built themes with instant theme switcher (*Signature, Forge, Atlas, Solace, Onyx*).
- **Product Details & Media Showcase**: High-res product images and videos with smooth right-side scroll and sticky purchase drawer.
- **Dynamic Combo Bundles & Deals**: Bundle builder with automatic discount calculations.
- **Saved Wishlist**: Instant client-side & server-synced customer wishlist.
- **Customer Accounts & Guest Checkout**: Dedicated customer account portal, passwordless guest login, and past order tracking.
- **Dynamic Policy & Content Pages**: Custom About Us narrative, Shipping Policy, Return Policy, Terms of Service, and custom landing pages (`/pages/[slug]`).
- **Encrypted Checkout & Payment Integrations**:
  - Cash on Delivery (COD) with verification
  - Razorpay (UPI, Credit/Debit cards, Netbanking)
  - PhonePe (Direct UPI, QR code)
  - Direct Bank Transfer / Manual UPI

### Merchant Administration Panel (`/admin`)
- **Order Fulfillment & Management**:
  - Create manual & draft orders directly from the admin panel with catalog product picker.
  - Edit existing orders (customer contact details, shipping addresses, fulfillment statuses, line items).
  - Print industry-standard thermal **4"x6" courier shipping labels**.
  - Generate GST-compliant **tax invoices**.
  - Export filtered sales spreadsheets with one-click **CSV downloads**.
- **Pages & Content CMS**:
  - Full Content Management System to edit standard policy pages and publish new custom pages (`/pages/faq`, `/pages/size-guide`, `/pages/warranty`).
  - Real-time Markdown editor with live preview and SEO metadata controls.
- **Product & Inventory Management**:
  - Add and edit products, variants, SKUs, inventory tracking, prices, and photo/video galleries.
  - Combo Deals & Bundle builder.
  - Category taxonomy.
- **Marketing & Growth**:
  - Promotional discount coupon codes (fixed amount or percentage).
  - Customer directory and lifetime spending reports.
- **Theme & Brand Customizer**:
  - Upload custom site logo and favicon.
  - Edit store hero section banners, headline titles, and descriptions.
  - Set registered company headquarters address and GSTIN / Tax ID.
- **Logistics & Gateway Settings**:
  - Courier routing (Delhivery, Shiprocket, Blue Dart, DTDC).
  - Gateway API keys (Razorpay, PhonePe).

---

## Quick Start (Local or Server)

### Prerequisites
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **Database**: PostgreSQL 14+ (or hosted via Supabase, Neon, Railway, AWS RDS)

### 1. Clone & Install
```bash
git clone https://github.com/technexttechnologies/avrostore.git
cd avrostore
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Open `.env` and configure your PostgreSQL database connection:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/avro_store?schema=public"
JWT_SECRET="your_random_jwt_secret"
```

### 3. Initialize Database & Seed Demo Data
```bash
# Synchronize Prisma database schema
npm run db:push

# (Optional) Seed default themes, categories, and initial products
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
- Storefront: `http://localhost:3001`
- Admin Panel: `http://localhost:3001/admin`
- Default Admin Login:
  - **Email**: `storeadmin@example.com`
  - **Password**: `storeadmin123`

---

## Production Deployment with Docker Compose

For a turnkey deployment with **PostgreSQL 16** and **Caddy** (automatic SSL):

```bash
# 1. Configure environment
cp .env.example .env
nano .env # Set your STORE_DOMAIN (e.g. store.yourbrand.com)

# 2. Launch Docker Stack
docker compose up -d --build
```

Your store will automatically be live on `https://store.yourbrand.com` with automated Let's Encrypt SSL!

---

## Deploying to Vercel

1. Push your repository to your GitHub account.
2. Import project into [Vercel](https://vercel.com).
3. Set the following Environment Variables in Vercel Project Settings:
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. from Supabase or Neon).
   - `JWT_SECRET`: Random 32-character string.
   - `ADMIN_COOKIE_SECRET`: Random 32-character string.
   - `STORE_URL`: Your production domain URL.
4. Set Build Command: `npm run build`
5. Deploy!

---

## Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server on port 3001 |
| `npm run build` | Compiles the production build for deployment |
| `npm run start` | Runs the compiled production server |
| `npm run db:generate` | Generates the local Prisma client |
| `npm run db:push` | Pushes the Prisma schema to the database |
| `npm run db:seed` | Seeds sample products, categories, themes, and admin |

---

## Security & Independent Licensing
This store operates autonomously with offline cryptographic license validation powered by **TECHNEXT TECHNOLOGIES**. Your store continues to run independently on your servers, guaranteeing 100% data privacy and zero platform lock-in.

---

## Support & Documentation
For enterprise onboarding, custom integrations, or questions:
- **Developer**: TECHNEXT TECHNOLOGIES
- **Website**: [technext.co](https://technext.co)
- **Support**: info.technexttech@gmail.com
- **Helpline**: +91 94965 90984
