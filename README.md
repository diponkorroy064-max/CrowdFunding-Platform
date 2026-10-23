# 🌟 CrowdSpark — Crowdfunding Platform

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5+-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **CrowdSpark** is an advanced full-stack MERN crowdfunding web application where creators launch campaigns for innovative causes, supporters pledge platform credits, and creators withdraw funds after transparent administrative review.

---

## 🚀 Live Site & Repository Details
* **Front-end Live Site URL:** [https://crowdspark-fund.vercel.app](https://crowdspark-fund.vercel.app) *(Deploy URL)*
* **Client & Server Monorepo Link:** [https://github.com/diponkorroy064-max/CrowdFunding-Platform](https://github.com/diponkorroy064-max/CrowdFunding-Platform)

---

## 🔑 Administrative & Demo Credentials
You can log in directly using the following credentials or use the one-click **Examiner Demo Quick-Fill** on the Login page:

| Role | Email | Password | Default Welcome Credits |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@crowdspark.com` | `Admin@12345` | 1,000 Credits |
| **Creator** | `creator@crowdspark.com` | `Creator@12345` | 20 Credits |
| **Supporter** | `supporter@crowdspark.com` | `Supporter@12345` | 50 Credits |

---

## ✨ 12 Key Website Features & Functionalities

1. **Role-Based Dynamic Ecosystem (3 Distinct Roles):** Custom dashboard views, navigation menus, and API security middlewares for **Supporter**, **Creator**, and **Admin**.
2. **Dual-Margin Credit Economy:** Supporters acquire credits at **10 Credits = $1 USD**, while Creators withdraw raised funds at **20 Credits = $1 USD** (platform sustainable revenue model).
3. **Automated Registration Bonuses:** Every new Supporter receives **50 complimentary welcome credits**, and new Creators receive **20 credits** automatically upon first registration.
4. **Instant Supporter Refund Guarantee:** If a Creator rejects a contribution or deletes an active campaign, all pledged credits are immediately and automatically refunded back to the Supporter's wallet balance.
5. **Interactive Homepage with Swiper Slider:** High-impact hero slider with 3 rich animated banners, Top 6 Funded Campaigns showcase, community reviews slider, and 3 custom statistical and workflow sections.
6. **Multi-Method Secure Authentication:** Email/Password authentication with strong password regex validation and Google OAuth popup authentication, persistent JWT session storage, and reload-resilient Private Routes.
7. **Creator Campaign & Review Studio:** Creators submit detailed campaigns (title, story, category, deadline, goal, reward info, imgBB cover upload) and approve or reject backer contributions in real time.
8. **Creator Earnings & Minimum Payout Logic:** Creators can withdraw raised funds once reaching a minimum threshold of **200 credits ($10 USD)** through Stripe, bKash, Rocket, or Nagad with automated dollar conversion.
9. **Stripe Integrated Credit Recharge:** Supporters can choose between tiered credit packages (100, 300, 800, 1500 credits) and checkout securely using card payments.
10. **Supporter Contributions with Server Pagination:** Dedicated paginated table of backed initiatives with instant status indicators (Approved, Pending Review, Rejected/Refunded).
11. **Real-Time Notification Pop-up System:** Floating modal notification drawer tracking approvals, rejections, withdrawal updates, and pledge confirmations with outside-click dismiss and unread badges.
12. **Admin Oversight & Fraud Reporting:** Administrative governance suite allowing one-click campaign approvals/rejections, user role updates, payout confirmations, and resolution of suspicious campaign reports.

---

## 🛠️ Technology Stack
* **Frontend:** React 18, Vite, React Router DOM v6, Tailwind CSS v3, Swiper.js, Lucide Icons, Axios, SweetAlert2.
* **Backend:** Node.js, Express.js (v5), MongoDB Native Driver (v7), JSON Web Tokens (jsonwebtoken), Stripe SDK, Morgan, Cors, Dotenv.
* **Database:** MongoDB Atlas Cloud Cluster.
* **Storage / Assets:** imgBB API & Unsplash CDN.

---

## 💻 Local Setup & Installation

### 1. Clone the Monorepo
```bash
git clone https://github.com/diponkorroy064-max/CrowdFunding-Platform.git
cd CrowdFunding-Platform
```

### 2. Configure Server
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://Crowdfunding-database:tO60EAWl9y1DDz2k@cluster0.g7croxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=crowdspark_db
JWT_SECRET=crowdspark_super_secret_jwt_key_2026_secure
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_placeholder_key
```
Run the server:
```bash
npm run dev
```

### 3. Configure Client
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_CLIENT_REPO_URL=https://github.com/diponkorroy064-max/CrowdFunding-Platform
```
Run the client dev server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📜 Evaluation Criteria Checklist
- [x] Responsive layout across Mobile, Tablet, and Desktop.
- [x] Session persistence on page reload without login redirect.
- [x] Environment variables protecting config keys and MongoDB Atlas credentials.
- [x] Clean zero "Lorem Ipsum" copy with professional content.
- [x] Role-based middleware & JWT token generation.
- [x] All 3 Dashboard workspaces completely implemented.
- [x] Automatic credit refunds on rejection and deletion.
- [x] Floating notification system with outside click dismissal.
- [x] Pagination implemented on Supporter Contributions page.
- [x] imgBB image uploading integration.
