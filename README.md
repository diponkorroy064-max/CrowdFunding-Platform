# 🌟 CrowdSpark — Modern Crowdfunding & Backer Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4+-black?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-v1.7+-6366F1?style=flat)](https://www.better-auth.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5+-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

> **CrowdSpark** is an enterprise-grade full-stack crowdfunding platform built with **Next.js 16 (App Router)**, **Better Auth**, and **Express.js**. Innovators, entrepreneurs, and artists launch causes, supporters pledge platform credits, and creators receive payouts through a dual-margin credit economy with full administrative oversight.

---

## 🚀 Live Links & Monorepo

* 🌐 **Production Client (Next.js 16 Web App):** [https://client-eight-hazel-68.vercel.app](https://client-eight-hazel-68.vercel.app)
* ⚡ **Production Server (Express REST API):** [https://server-rho-six-74.vercel.app](https://server-rho-six-74.vercel.app)
* 📦 **GitHub Monorepo:** [https://github.com/diponkorroy064-max/CrowdFunding-Platform](https://github.com/diponkorroy064-max/CrowdFunding-Platform)

---

## 🔑 Demo & Test Credentials

You can sign in using the following pre-configured demo accounts:

| Role | Email | Password | Default Welcome Balance | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@crowdspark.com` | `Admin@12345` | 1,000 Credits | Approve campaigns, manage user roles, resolve fraud reports |
| **Creator** | `creator@crowdspark.com` | `Creator@12345` | 20 Credits | Launch campaigns, review & approve pledges, request withdrawals |
| **Supporter** | `supporter@crowdspark.com` | `Supporter@12345` | 50 Credits | Explore campaigns, pledge credits, purchase credits via Stripe |

---

## 💡 Key Architectural Highlights & Features

1. **Next.js 16 App Router & Full Server-Side Rendering (SSR):**
   - Built entirely on the modern Next.js 16 App Router architecture using clean `page.jsx` and `layout.jsx` conventions.
   - All public pages (`/`, `/campaigns`, `/campaigns/[id]`) and core UI sections are rendered on the server side (SSR) for optimal SEO, rapid first contentful paint (FCP), and dynamic metadata generation.

2. **Better Auth Authentication & MongoDB Adapter:**
   - Powered by modern **Better Auth** with direct MongoDB database adapter, eliminating external Firebase dependencies.
   - Comprehensive email/password credential validation, session tokens, secure cookies, and seamless client state synchronization.

3. **Universal Multer Image Upload Engine:**
   - Custom Express Multer handler (`/upload`) supporting all image formats (`jpg`, `jpeg`, `png`, `webp`, `gif`, `svg`, `avif`).
   - Uploaded assets are instantly converted to accessible hosted URLs for user profile avatars and campaign covers.

4. **Dual-Margin Sustainable Credit Economy:**
   - **Supporters** buy platform credits at **10 Credits = $1.00 USD**.
   - **Creators** withdraw earned campaign funds at **20 Credits = $1.00 USD**.
   - Transparent margins ensure platform longevity while keeping barrier to entry low for backers.

5. **Automated Welcome Bonuses & Instant Refund Safety:**
   - First-time Supporters automatically receive **50 complimentary welcome credits**.
   - First-time Creators receive **20 welcome credits**.
   - If a Creator rejects a contribution or deletes an active campaign, all pledged credits are immediately and automatically refunded to the backer's wallet.

6. **Interactive Hero Slider & Category Filters:**
   - Swiper.js responsive carousel featuring animated promotional banners.
   - Filter campaigns by category (Technology, Community, Healthcare, Creative, Education), search query, and funding progress.

7. **Creator Studio & Backer Contribution Management:**
   - Creators track goal progress in real time, review pending backer pledges, and approve or reject contributions with full audit logs.
   - Withdrawal requests with multiple payout channel options (Stripe, bKash, Rocket, Nagad) once reaching the 200 credits ($10 USD) threshold.

8. **Secure Stripe Checkout Integration:**
   - Backers can top up their wallet using Stripe PaymentIntents across tiered bundles (100, 300, 800, 1500 credits) with automated credit incrementation.

9. **Dedicated Real-Time Floating Notification System:**
   - Interactive notification drawer tracking campaign status changes, backer approvals, credit refunds, and payout confirmations.

10. **Administrative Governance & Fraud Prevention:**
    - Live admin overview with metrics (total users, active campaigns, total platform credits, payment volume).
    - Review pending campaigns, toggle creator/supporter roles, and suspend campaigns reported for policy violations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16.4.2 (App Router)](https://nextjs.org/) with React 19 and Turbopack |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), PostCSS, [Lucide React](https://lucide.dev/) |
| **Carousels & UI** | [Swiper.js v14](https://swiperjs.com/), [SweetAlert2](https://sweetalert2.github.io/) |
| **Authentication** | [Better Auth v1.7](https://www.better-auth.com/) + MongoDB Adapter |
| **Backend API** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [Multer](https://github.com/expressjs/multer) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) with Native Node Driver (`mongodb` v7) |
| **Payments** | [Stripe SDK](https://stripe.com/) (`@stripe/stripe-js`) |
| **Deployment** | [Vercel](https://vercel.com/) (Serverless Next.js Frontend + Serverless Express API) |

---

## 📁 Repository Monorepo Structure

```text
CrowdFunding-Platform/
├── client/                      # Next.js 16 App Router Frontend
│   ├── src/
│   │   ├── app/                 # App Router Pages (page.jsx & layout.jsx)
│   │   │   ├── layout.jsx       # Root layout (Navbar, Footer, AuthProvider)
│   │   │   ├── page.jsx         # Homepage (Hero Slider, Top Funded, Categories)
│   │   │   ├── about/           # About Us story, values, team & stats
│   │   │   ├── contact/         # Contact support & interactive inquiry form
│   │   │   ├── campaigns/       # Explore campaigns & dynamic details [id]
│   │   │   ├── dashboard/       # Role-based dashboards (Admin, Creator, Supporter)
│   │   │   ├── login/           # Authentication portal
│   │   │   └── register/        # Registration with Multer image upload
│   │   ├── components/          # Reusable UI components & server sections
│   │   │   ├── common/          # Navbar, Footer, Notifications, ThemeToggle
│   │   │   ├── home/            # HeroSlider, TopFunded, WhyChooseUs, Stats
│   │   │   └── dashboard/       # Role dashboards, tables, forms, charts
│   │   └── lib/                 # Better Auth client & server instances
│   ├── package.json
│   ├── next.config.mjs
│   └── .env.local
│
├── server/                      # Express.js REST API Backend
│   ├── index.js                 # Express server & API routes
│   ├── vercel.json              # Vercel serverless deployment config
│   ├── package.json
│   └── .env
│
└── README.md                    # Project documentation
```

---

## 💻 Local Setup & Development

### 1. Clone the Monorepo
```bash
git clone https://github.com/diponkorroy064-max/CrowdFunding-Platform.git
cd CrowdFunding-Platform
```

### 2. Configure & Run Backend (`server`)
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5005
MONGODB_URI=mongodb+srv://Crowdfunding-database:tO60EAWl9y1DDz2k@cluster0.g7croxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=crowdspark_db
JWT_SECRET=crowdspark_super_secret_jwt_key_2026_secure
STRIPE_SECRET_KEY=sk_test_placeholder
```

Start the backend:
```bash
node index.js
# Backend runs on http://localhost:5005
```

### 3. Configure & Run Frontend (`client`)
In a new terminal:
```bash
cd client
npm install
```

Create a `.env.local` file in the `client` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_REPO_URL=https://github.com/diponkorroy064-max/CrowdFunding-Platform
BETTER_AUTH_SECRET=crowdspark_super_secret_better_auth_key_2026
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://Crowdfunding-database:tO60EAWl9y1DDz2k@cluster0.g7croxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=crowdspark_db
```

Start the Next.js development server:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🌐 Production Deployment on Vercel

Both parts of the monorepo are deployed to Vercel:

1. **Server Deployment (`server/`)**:
   - Monorepo Root Directory: `server`
   - Configured with `@vercel/node` builder in `server/vercel.json`.
   - Environment variables: `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `STRIPE_SECRET_KEY`.
   - Live URL: `https://server-rho-six-74.vercel.app`

2. **Client Deployment (`client/`)**:
   - Monorepo Root Directory: `client`
   - Framework Preset: **Next.js**
   - Environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLIENT_REPO_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `DB_NAME`.
   - Live URL: `https://client-eight-hazel-68.vercel.app`

---

## 📜 Evaluation Criteria Checklist
- [x] **Next.js 16 App Router:** All routes structured with `page.jsx` & `layout.jsx`.
- [x] **Server-Side Rendering (SSR):** Public pages and sections rendered on the server.
- [x] **Better Auth Integration:** Modern authentication with MongoDB adapter.
- [x] **Multer File Upload:** Converts any image format into accessible URLs.
- [x] **Custom SVG Brand Logo & Nav:** Dynamic brand icon with responsive navigation.
- [x] **Responsive Layout:** Pixel-perfect on Mobile, Tablet, and Desktop.
- [x] **Zero "Lorem Ipsum":** Meaningful, curated real-world crowdfunding data.
- [x] **Role-Based Dashboards:** Distinct workspaces for Admin, Creator, and Supporter.
- [x] **Automated Refund Guarantee:** Pledges safely refunded upon campaign deletion or rejection.
- [x] **Vercel Production Deployment:** Both client and server live and operational.

---

## 👨‍💻 Author & Maintainer
- **Developer:** Diponkor Roy
- **GitHub:** [@diponkorroy064-max](https://github.com/diponkorroy064-max)
- **Project:** CrowdSpark Crowdfunding Platform (Assignment 11)
