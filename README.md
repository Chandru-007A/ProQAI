# 🛒 ProQ.AI

> An intelligent full-stack procurement platform that automates the RFQ lifecycle — from AI-driven inventory monitoring and demand prediction to vendor bidding, quote analysis, and best-vendor recommendation.

![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20TypeScript%20%7C%20MongoDB-green)
![Status](https://img.shields.io/badge/status-Active-brightgreen)
![AI](https://img.shields.io/badge/AI-Groq%20%7C%20Gemini-purple)

---

## 📌 Problem Statement

Procurement teams waste significant time manually tracking inventory levels, drafting RFQs, and comparing vendor quotes. ProQ.AI automates the entire procurement pipeline — using AI to predict demand, auto-generate RFQs, assist vendors in pricing, and rank bids — so buyers can focus on decisions, not data entry.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 📦 Inventory Monitoring | Real-time stock tracking with AI-powered low-stock alerts |
| 🔮 Demand Prediction | AI forecasts future demand to trigger proactive procurement |
| 📋 RFQ Auto-Generation | System auto-drafts RFQs based on inventory shortfalls |
| ✅ Human Approval Flow | Buyers review and confirm RFQs before they go live |
| 📨 Vendor Distribution | Approved RFQs are automatically dispatched to registered vendors |
| 💡 Vendor AI Suggestions | Vendors receive AI-assisted price suggestions when submitting quotes |
| 📊 AI Bid Analysis | Submitted quotes are ranked and compared using AI benchmarking |
| 🏆 Best Vendor Recommendation | System recommends the optimal vendor based on price, history, and fit |
| 🔐 Auth System | JWT-based login with role separation (Buyer / Vendor) |

---

## 🏗️ Tech Stack

### Frontend
- ⚛️ **Next.js (App Router)** — Server and client components
- 🟦 **TypeScript** — Type-safe codebase
- 🎨 **Tailwind CSS** — Utility-first styling
- 📊 **Recharts / Chart.js** — Data visualization

### Backend
- 🐍 **Next.js API Routes** — REST endpoints co-located with the app
- 🤖 **Groq AI** — Core AI engine for predictions, suggestions, and analysis
- 🗄️ **MongoDB + Prisma** — Database layer with schema validation
- 🔑 **JWT + Cookies** — Secure authentication

---

## 📂 Project Structure

```
ProQ.AI/
├── .gitignore
└── procureai-buyer/
    ├── app/
    │   ├── api/
    │   │   ├── ai/                    # Groq AI price suggestions
    │   │   ├── analysis/              # AI vendor ranking & benchmarking
    │   │   ├── auth/                  # Login/logout (JWT, universal access)
    │   │   ├── bids/                  # Vendor quote submissions
    │   │   ├── inventory/             # Stock management & AI prediction
    │   │   └── rfq/                   # RFQ creation & approval flow
    │   ├── analysis/                  # Buyer page: best vendor insights
    │   ├── dashboard/                 # Buyer page: main overview
    │   ├── inventory/                 # Buyer page: stock monitoring
    │   ├── login/                     # Authentication UI
    │   ├── rfq/                       # Buyer page: RFQ management
    │   └── vendor-dashboard/          # Vendor page: incoming RFQs & bidding
    ├── components/
    │   ├── DashboardLayout/           # Sidebar & navigation wrapper
    │   ├── PageHeader/                # Typography & breadcrumbs
    │   └── StatCard/                  # Animated numeric insights
    ├── lib/
    │   ├── auth.ts                    # JWT & cookie logic
    │   ├── gemini.ts                  # Groq AI integration (core AI engine)
    │   └── prisma.ts                  # MongoDB database connection
    ├── prisma/
    │   ├── schema.prisma              # MongoDB model definitions
    │   └── seed.ts                    # Default data (buyer account, items)
    ├── public/                        # Static images & icons
    ├── package.json
    └── tsconfig.json
```

---

## 🔄 Procurement Flow

```
Login
  → Add Inventory
  → AI Monitoring
  → Demand Prediction
  → RFQ Auto-Generation
  → Human Approval (Buyer confirms RFQ)
  → RFQ Sent to Vendors
  → Vendors Receive RFQ
  → Vendor AI Suggestions
  → Quote Submission
  → AI Analysis
  → Best Vendor Recommendation
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/xxxx/ProQ.AI.git
cd ProQ.AI/procureai-buyer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in `procureai-buyer/`:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/proqai"
JWT_SECRET="your_jwt_secret"
GROQ_API_KEY="your_groq_api_key"
```

### 4. Seed the Database

```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

### 5. Start the Dev Server

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## 🧠 How It Works

### Inventory & Prediction
The buyer adds inventory items with reorder thresholds. The AI engine continuously monitors stock levels and uses historical demand data to predict shortfalls before they happen, automatically triggering the RFQ pipeline.

### RFQ Generation & Approval
When a shortfall is predicted, the system auto-drafts an RFQ with item details, quantities, and deadlines. The buyer reviews the draft on the RFQ page and approves it with one click. Only approved RFQs are dispatched to vendors.

### Vendor Bidding
Registered vendors see incoming RFQs on their dashboard. When submitting a quote, the AI suggests competitive pricing based on market benchmarks and the vendor's own history, reducing guesswork and improving bid quality.

### AI Analysis & Recommendation
Once the bidding window closes, the analysis engine scores all submitted quotes across dimensions like price, vendor reliability, and delivery terms. The buyer sees a ranked leaderboard with a clear best-vendor recommendation.

---

## 📈 Scalability

- **API routes** can be migrated to standalone microservices as load grows
- **Background tasks** (demand prediction, bid analysis) can be offloaded to a job queue (e.g. BullMQ + Redis) for non-blocking execution
- **MongoDB** scales horizontally and supports schema evolution as procurement logic expands
- **Frontend** is a static-exportable Next.js build, deployable behind a CDN for global low-latency access
- **AI engine** is provider-agnostic — swapping Groq for another LLM requires only a config change in `lib/gemini.ts`

---

## 💡 Feasibility

ProQ.AI is built on production-grade, actively maintained open-source tools — Next.js, Prisma, MongoDB, and Groq — with no proprietary dependencies. The architecture is a standard fullstack web app with AI calls over a REST API, requiring no specialized infrastructure. It can be deployed to Vercel + MongoDB Atlas in under 30 minutes.

---

## 🌟 Novelty

Most procurement tools either focus on static RFQ templates or require expensive ERP integrations. ProQ.AI is a lightweight, AI-native platform that closes the loop across the entire procurement cycle — from inventory intelligence to vendor recommendation — in a single interface accessible to both buyers and vendors. The combination of demand forecasting, AI-assisted vendor pricing, and automated bid ranking in one unified product targeted at SMBs is the core novel contribution.

---

## 🔧 Feature Depth

- **Dual-role system** — Separate buyer and vendor dashboards with role-based access control
- **AI suggestions are contextual** — Vendor price hints factor in item category, historical bids, and market benchmarks
- **Full audit trail** — Every RFQ, bid, and approval action is timestamped and stored
- **API-first design** — All procurement actions are accessible via REST endpoints, enabling CI/CD or ERP integration
- **Real-time dashboard** — Charts update as new bids arrive and inventory changes

---

## ⚠️ Ethical Use & Disclaimer

ProQ.AI is intended for **legitimate business procurement workflows only**. AI-generated price suggestions and vendor recommendations are decision-support tools — final procurement decisions remain with the human buyer. Do not use this platform to manipulate bidding processes or engage in anti-competitive procurement practices.

---

## 📜 License

Licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature-name"`
4. Push and open a Pull Request

---

## 🧩 Author

**Sri Sayee K**
📧 [ksrisayee@gmail.com](mailto:ksrisayee@gmail.com)
🔗 [GitHub](https://github.com/xxxx)

---
