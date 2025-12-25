<a name="readme-top"></a>

<br />
<div align="center">
 <a href="https://github.com/priyanshubh/Kashflow">
  <img src="https://cdn-icons-png.flaticon.com/512/10552/10552258.png" alt="Kashflow Logo" width="80" height="80">
</a>

  <h3 align="center">Kashflow</h3>

  <p align="center">
    Smart Personal Finance Management & Budgeting
    <br />
    <br />
    <a href="https://kashflow-pb.vercel.app/">View demo</a>
    ·
    <a href="https://github.com/priyanshubh/Kashflow/issues">Report Bug</a>
    ·
    <a href="https://github.com/priyanshubh/Kashflow/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br />

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#-about-the-project">About The Project</a></li>
    <li><a href="#-key-features">Key Features</a></li>
    <li><a href="#-tech-stack">Tech Stack</a></li>
    <li><a href="#-architecture">Architecture</a></li>
    <li><a href="#-folder-structure">Folder Structure</a></li>
    <li><a href="#-getting-started">Getting Started</a></li>
    <li><a href="#-contributing">Contributing</a></li>
  </ol>
</details>

---

## 🤖 About The Project

**Kashflow** is a powerful, modern personal finance application designed to help users take control of their money. Built on the bleeding edge of web development with **Next.js 16** and **Tailwind CSS 4**, it offers a fluid experience for tracking income, managing expenses, and visualizing financial health.

From a dedicated onboarding wizard to complex currency management and historical data analysis, Kashflow provides the tools needed to build better financial habits.

<div align="center">
  <img src="./public/images/image.png" alt="Dashboard" />
</div>
---

## 🔥 Key Features

- **📊 Interactive Dashboard**
  Real-time financial overview with rich visualizations powered by **Recharts**, tracking income vs. expenses over time.

- **💰 Budget Management**
  Set and monitor monthly budgets to ensure spending stays on track (`app/budgets`).

- **🌍 Multi-Currency Support**
  Manage transactions in various currencies with real-time formatting and selection (`ts-currency`, `ManageCurrency.tsx`).

- **📝 Transaction History**
  A powerful data table allowing filtering, sorting, and editing of past transactions (`@tanstack/react-table`).

- **🏷️ Smart Categorization**
  Create and manage custom categories with emoji support (`emoji-mart`) to keep finances organized.

- **📥 CSV Export**
  Export your financial data effortlessly for external analysis (`export-to-csv`).

- **🔐 Secure Authentication**
  Robust user management powered by **NextAuth v5 (Beta)** with secure session handling.

- **🌗 Dark Mode & Theming**
  Seamless theme switching supported by **Next-Themes** and **Shadcn UI** components.

---

## ⚙️ Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js&logoColor=white"/> | The latest App Router with Server Actions. |
| **Language** | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/> | Strictly typed for maintainability and safety. |
| **Styling** | <img src="https://img.shields.io/badge/Tailwind_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white"/> | Next-gen utility-first CSS engine. |
| **Database** | <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=flat&logo=prisma&logoColor=white"/> | Latest ORM for type-safe database interactions. |
| **State** | <img src="https://img.shields.io/badge/Zustand-brown?style=flat&logo=react&logoColor=white"/> | Lightweight global state management. |
| **Forms** | <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=react-hook-form&logoColor=white"/> | Performant form validation with Zod. |
| **UI Library** | <img src="https://img.shields.io/badge/Radix_UI-161618?style=flat&logo=radix-ui&logoColor=white"/> | Accessible, headless UI primitives (Shadcn/ui). |

---

## 🏗 Architecture

Kashflow leverages **Next.js Server Actions** for data mutations, reducing the need for traditional API routes.

```mermaid
graph TD
    subgraph Client
        Browser[User Browser]
        UI[Dashboard / Forms]
    end

    subgraph Server
        Next[Next.js App Router]
        Actions[Server Actions]
        Auth[NextAuth v5]
    end

    subgraph Data
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
    end

    Browser -->|Interaction| UI
    UI -->|Mutate Data| Actions
    UI -->|Fetch Data| Next
    Actions -->|Validate| Zod
    Actions -->|Query| Prisma
    Next -->|Session Check| Auth
    Prisma -->|SQL| DB

```
---

## 📂 Folder Structure

```text
Kashflow/
├── actions/              # Server Actions (Budget, Category, Currency)
├── app/                  # Next.js App Router
│   ├── auth/             # Login & Register Pages
│   ├── dashboard/        # Main Overview
│   ├── transactions/     # History & Tables
│   ├── budgets/          # Budget Management
│   ├── manage/           # Settings (Currency/Category)
│   └── wizard/           # Onboarding Flow
├── components/           # Reusable UI Components (Radix/Shadcn)
│   ├── ui/               # Primitives (Buttons, Cards, Inputs)
│   └── ...               # Feature components (Charts, Pickers)
├── lib/                  # Utilities, Constants, & Prisma Client
├── prisma/               # Database Schema
└── public/               # Static Assets

```

---

## 🧰 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* **Node.js** (v20+ recommended)
* **Bun** or **npm**
* **PostgreSQL** Database

### Installation

1. **Clone the repository**
```bash
git clone [https://github.com/priyanshubh/Kashflow.git](https://github.com/priyanshubh/Kashflow.git)
cd Kashflow

```


2. **Install dependencies**
```bash
npm install
# or
bun install

```


3. **Environment Variables**
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kashflow"
AUTH_SECRET="your_nextauth_secret"

```


4. **Database Setup**
Push the Prisma schema to your database:
```bash
npx prisma db push

```


5. **Run the application**
```bash
npm run dev

```



---

## 🔧 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🚀 Follow Me

<div align="center">
<a href="https://github.com/priyanshubh">
<img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
<a href="https://linkedin.com/in/priyanshu-bharti">
<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
</a>
<a href="https://priyanshubharti.vercel.app">
<img src="https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Portfolio" />
</a>
</div>

<br />
<p align="center">Built with ❤️ by <a href="https://github.com/priyanshubh">Priyanshu Bharti</a></p>
