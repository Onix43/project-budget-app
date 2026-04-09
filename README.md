#  💰 Expense Tracker
**Expense Tracker** is a modern financial management web application that allows users to seamlessly monitor their income and expenses. The application provides tools for detailed transaction tracking, categorical analysis, and financial data visualization through interactive charts.

---

## 🚀 Key Features

**Key Features:**
* **Authentication & Security:** Full registration and login lifecycle using Cookies and secure Middleware.
* **Transaction Management:** Create, edit, and delete income and expense records.
* **Analytics & Insights:** Financial data visualization using interactive diagrams (Recharts).
* **User Personalization:** Profile settings including name updates, avatar uploads, and currency selection.
* **Filtering & Search:** Efficient transaction history tracking with integrated debouncing and date filters.

---

## 🛠 Tech Stack

**The project is built using a modern frontend development stack:**

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **State Management:** Zustand
* **Data Fetching:** TanStack React Query v5 & Axios
* **Forms & Validation:** Formik + Yup
* **Charts:** Recharts
* **Notifications:** iziToast
* **Styling:** CSS Modules & Modern Normalize
* **Backend:** Ready-to-use API by GoIT

---

## 🔒 Authorization & Middleware
The project implements robust proxy logic and Middleware to ensure maximum security:

* **Middleware:** Controls access to private routes (/transactions/:path*). Unauthorized users are automatically redirected to the landing page.
* **Token Rotation:** Automatic session validation and accessToken updates via refreshToken stored in HTTP-only cookies.
* **Route Protection:** Public routes (e.g., /login, /register) are restricted for authorized users, with an automatic redirect to the dashboard.

---

## ⚙️ Installation & Setup
To run the project locally, follow these steps:

1. **Clone the repository:**
 ```bash
 git clone https://github.com/Onix43/project-budget-app
 cd expense-tracker
```

2. **Install dependencies:**
``` Bash
npm install
```

  3. **Configure environment variables:**
Create a .env.local file in the root directory and add the following:
```bash
NEXT_PUBLIC_API_URL=https://your-api-base-url.com
NEXT_PUBLIC_URL=http://localhost:3000
```

4. **Run the application in development mode:**
```Bash
npm run dev
```

5. **Build for production:**
```Bash
npm run build
```

---

## 🔗 Additional Information

* **Live Demo:** https://onix43.github.io/project-artist-hub/
* **Design:** Follows modern UI/UX trends with a Mobile-First approach.
* **Developed as part of the GoIT Educational Program.**


