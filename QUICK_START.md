# AVRO Storefront — 3-Minute Quick Start Cheatsheet

### 1. Requirements
Ensure you have Node.js 20+ and a PostgreSQL database (e.g. free from [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech)).

### 2. Install & Launch
```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL
npm run db:push
npm run db:seed
npm run dev
```

### 3. Log In to Admin Panel
- Open: `http://localhost:3001/admin`
- Email: `storeadmin@example.com`
- Password: `storeadmin123`

### 4. Production Launch
```bash
npm run build
npm start
```
