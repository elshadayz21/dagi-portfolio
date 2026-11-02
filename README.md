# 🚜 Dagim Melese Tractor Sales Portfolio & CRM Platform
### Authorized Agricultural Machinery Consultant for Tekhaf Trading (Ethiopia)

A world-class, multilingual, SEO-first tractor sales website and CRM platform engineered specifically for **Dagim Melese**, Senior Agricultural Machinery Sales Specialist at **Tekhaf Trading** in Addis Ababa, Ethiopia.

---

## 🌟 Brand Identity & Color Theme
- **Company**: Tekhaf Trading
- **Sales Consultant**: Dagim Melese
- **Industry**: Agricultural Machinery, Heavy Tractors, Farm Equipment & Duty-Free Advisory
- **Color Palette**:
  - Primary: `#005B96` (Tekhaf Deep Blue)
  - Secondary: `#0074BD` (Medium Trust Blue)
  - Accent: `#2B8CFF` (Vibrant Action Blue)
  - Background: `#F5F9FF` (Soft Ice White/Blue)

---

## 🚀 Key Features

### 1. Multilingual Support (5 Languages)
Fully localized App Router dynamic routing with localized routes and native language switcher in the navbar:
- **English**: `/en`
- **Amharic (አማርኛ)**: `/am`
- **Afaan Oromo**: `/or`
- **Somali (Soomaali)**: `/so`
- **Sidama (Sidaamu Afoo)**: `/sid`

### 2. Public Tractor Sales Experience
- **Home Page**: Hero with verified consultant photo, Tekhaf Trading branding, direct Call & WhatsApp quick-action buttons, trust indicators, featured tractors, regional service coverage, and customer reviews.
- **Tractor Inventory**: Interactive filtering by brand (Massey Ferguson, Lovol, New Holland, John Deere), horsepower (50–120 HP), and showroom stock availability.
- **Product Details**: Complete specifications table, fuel economy details, Perkins/OEM engine info, downloadable spec sheet trigger, and 1-click WhatsApp quote button with pre-filled model name.
- **About Dagim Melese**: 12+ years of Ethiopian agricultural mechanization background, certifications, cooperative and commercial farm guidance, and direct contact details.
- **Service Areas**: Regional coverage hubs with tailored mechanization advice for Addis Ababa, Oromia, Sidama / Hawassa, Somali Region, Dire Dawa, and Amhara Region.
- **Duty-Free Guidance**: Integrated advice on Ethiopian customs duty and tax exemption for commercial growers and cooperative unions.

### 3. SEO & Structured Data (100% Target)
- **Local SEO Landing Pages**:
  - `/tractors-addis-ababa`
  - `/tractors-oromia`
  - `/tractors-sidama`
  - `/tractors-somali-region`
  - `/agricultural-equipment-ethiopia`
- **JSON-LD Schema Markup**:
  - `LocalBusiness` Schema (Tekhaf Tower, Bole Medhanialem, Addis Ababa)
  - `Product` Schema with ETB pricing, 4WD drive type, and InStock status
  - `FAQPage` Schema covering warranty, duty-free exemptions, and spare parts
  - `Organization` & `Review` Schemas for verified testimonials
  - `BreadcrumbList` on all pages
- Dynamic `sitemap.xml` (all 95 localized paths) and `robots.txt`.

### 4. Lead Management CRM & Admin Portal
- **Secure Authentication**: NextAuth.js with Credentials provider and Role-Based Access Control (`SUPER_ADMIN` and `CONTENT_MANAGER`).
- **Dashboard Overview (`/admin/dashboard`)**: Total Leads, New Inquiries, Won Deals, In-Stock Tractors, and Sales Pipeline Funnel.
- **Customer Inquiry Pipeline (`/admin/leads`)**:
  - Status progression: `NEW` ➔ `CONTACTED` ➔ `INTERESTED` ➔ `NEGOTIATING` ➔ `WON` ➔ `LOST`
  - Filter by status and region
  - Instant CSV export for reporting
  - Private sales & follow-up notes timeline per farmer
- **Content Management System (CMS)**:
  - Tractor Inventory manager (`/admin/products`)
  - Dagim Melese Profile editor (`/admin/profile`)
  - Dynamic SEO meta tags editor (`/admin/seo`)
  - 5-Language CMS translation manager (`/admin/translations`)
  - Media Library (`/admin/media`) powered by Cloudinary

### 5. Automated Email Notification Workflow
- Integrated with **Resend**:
  1. Instant notification sent to Dagim Melese (`dagim@tekhaf.com`) with customer name, phone, region, farm size, and tractor model.
  2. Professional branded quotation confirmation email sent to the customer introducing Dagim Melese and providing next steps.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components & Server Actions)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database ORM**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (JWT session)
- **Email Service**: Resend SDK
- **Media CDN**: Cloudinary
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🏁 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tekhaf_tractors?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tekhaf-tractor-platform-super-secret-key-dagim-melese-2026"
RESEND_API_KEY="re_your_api_key_here"
ADMIN_NOTIFICATION_EMAIL="dagim@tekhaf.com"
SENDER_EMAIL="sales@tekhaf.com"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tekhaf-trading"
NEXT_PUBLIC_SITE_URL="https://tekhaftractors.com"
```

### 3. Generate Prisma Client & Database (Optional if using Postgres)
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```
*(Note: The platform includes a resilient in-memory/JSON store fallback so the entire public website, lead submission, and CRM dashboard function immediately even without a local PostgreSQL instance running!)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the website. It will automatically redirect to `/en`.

### 5. Admin CRM Access
- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `dagim@tekhaf.com`
- **Password**: `admin123`

---

## 🚢 Deployment to Vercel

1. Push this independent repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `RESEND_API_KEY`).
4. Build command: `npm run build`
5. Output Directory: `.next` (default)
6. Click **Deploy**.
