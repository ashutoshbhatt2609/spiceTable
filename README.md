# 🍽️ Spice Table — Restaurant Management System

A production-quality Restaurant Management System built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Supabase**, **TanStack Query**, **Recharts**, and **jsPDF**.

## Features

| Module | Description |
|---|---|
| **Auth** | Supabase Auth with role-based access (admin, manager, cashier, waiter, kitchen) |
| **Dashboard** | Live metrics: revenue vs yesterday, orders, tables, inventory alerts, recent orders list, top-selling chart |
| **Tables** | Table status management (available / occupied / reserved) |
| **Menu** | Category and item CRUD with image previews, availability toggles, delete |
| **Orders** | Create orders with cart (+/- controls), realtime status updates via Supabase Realtime |
| **Kitchen** | Realtime kitchen display board with pulsing pending orders |
| **Customers** | Customer directory with loyalty points |
| **Reservations** | Future booking management |
| **Inventory** | Stock tracking with low-stock alerts |
| **Billing** | Auto-generate GST invoices (PDF download via jsPDF), duplicate-bill guard |
| **Reports** | Daily sales, low-stock, top-selling views with summary totals |
| **Settings** | Staff registration (admin only) |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 3. Run schema
Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.

### 4. Seed the database (optional but recommended)
Run [`supabase/seed.sql`](./supabase/seed.sql) in the Supabase SQL Editor **after** schema.sql.

This creates:
- 8 menu categories with 30+ menu items
- 10 dining tables
- 30 inventory items
- 6 suppliers and 9 purchases
- 15 customers
- 6 reservations
- 14 sample orders across the last 14 days (with bills, payments, order items)
- 8 notifications

### 5. Configure environment
Copy `.env.example` to `.env.local` and fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Create your first admin user
1. In Supabase Dashboard → Authentication → Users → Create new user
2. Then in SQL Editor, run:
```sql
INSERT INTO public.profiles (id, name, email, role)
VALUES ('<auth-user-uuid>', 'Admin Name', 'admin@example.com', 'admin');
```

### 7. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL + RLS + Realtime)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + custom dark design system
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **PDF**: jsPDF
- **Icons**: Lucide React
