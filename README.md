# ASAN BILL — Stock Management & Billing SaaS

> **Simple Stock Management & Billing for Modern Businesses**

ASAN BILL is a complete, responsive, full-featured web application designed with Google Material Design principles. It provides seamless inventory tracking, automated stock adjustments on purchases and sales, strict overselling prevention, GST-compliant invoicing (Intra-state CGST+SGST & Inter-state IGST), real-time profit tracking at the line-item level, and instant PDF invoice generation.

---

## 🚀 Live Application Access

The application is running and accessible at:
👉 **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)**

*Project Location:* `C:\Users\NEXT IAS\.gemini\antigravity\scratch\asan-bill`  
*(Recommendation: Set this subdirectory as your active workspace for development).*

---

## 🔑 Demo Login Accounts & Credentials

For testing and demonstration, you can log in using the one-click credential chips on the login screen or enter the following credentials:

| Role / Profile | Username / Email | Password | Status & Plan | Description |
| :--- | :--- | :--- | :--- | :--- |
| **👑 System Admin** | `admin` or `admin@asanbill.com` | `admin123` | Active Root Admin | Full control over users, plan renewals, revenue reports, and tenant onboarding. |
| **🟢 Active User** | `rajesh` or `rajesh@shreeenterprises.com` | `user123` | Active (12 Months) | *Shree Balaji Enterprises* — Full access to billing, inventory, purchases, and PDF generation. |
| **🟡 Expiring Soon** | `vikram` or `vikram@metrotraders.in` | `user123` | Expiring in ~5 Days (6M) | *Metro Hardware & Electricals* — Shows renewal countdown banner and quick extend actions in admin. |
| **🔴 Expired User** | `sunil` or `sunil@apextech.com` | `user123` | **Expired** | *Apex Technologies* — Shows exact message: *"Your ASAN BILL account has expired. Please contact the administrator to renew your subscription."* Billing features are blocked. |

---

## 🌟 Key Features & Implementation Details

### 1. Website Structure & Navigation
- **Public Landing Page:** Hero section, SaaS feature highlights, interactive dashboard preview, customer testimonials, and transparent pricing cards.
- **Admin Dashboard:** Total/Active/Expired/Expiring Soon users, total SaaS revenue (+18% GST), total platform invoices, recent users table, and direct management shortcuts.
- **User Dashboard:** Today's Sales, Today's Profit, Total Products, Low Stock alerts, Total Customers, and Recent Invoices.
- **Role-Based Access Control (RBAC):** Standard users cannot access admin pages (triggers access-denied guard and redirects).

### 2. Subscription Plans
- **6 Month Plan:** ₹4,999 + GST
- **Year Long Plan:** ₹7,999 + GST *(Best Value — Save ₹2,000)*
- Clearly highlights that GST (+18%) is additional.
- Admin can auto-calculate or manually set subscription start and expiry dates.

### 3. Inventory & Strict Stock Control
- Automatic stock tracking:
  - **Purchase recorded:** Product `currentStock` automatically increases.
  - **Invoice generated:** Product `currentStock` automatically decreases.
- **Overselling Prevention:** If a customer attempts to purchase more than available inventory (e.g. attempting to order 15 when only 10 are available), the system displays:
  > *"Insufficient stock. Only 10 units are available."*  
  Invoice generation is blocked until the quantity is corrected.
- **Low Stock Alerts:** Items at or below minimum stock level display warning badges.
- **Automated Valuation Metrics:**
  - `Potential Sales Value = Current Stock × Selling Price`
  - `Potential Purchase Cost = Current Stock × Purchase Price`
  - `Potential Profit = Current Stock × (Selling Price - Purchase Price)`
  *(Matches prompt example: Purchase ₹500, Selling ₹700, Qty 10 → Cost ₹5,000, Sales ₹7,000, Profit ₹2,000).*

### 4. Professional Invoice Creation & Preview
- **Auto-generated Invoice Numbers:** e.g., `ASB-2026-0001`, `ASB-2026-0002`...
- **Customer Selection & Inline Addition:** Search existing customers or click `+ Add New Customer` inline without losing current invoice progress.
- **Dynamic GST Handling:**
  - Per-item GST rates: 0%, 5%, 12%, 18%, 28%.
  - Automatic detection: Intra-state (`CGST + SGST`) vs Inter-state (`IGST`).
- **Discount System:**
  - Item-level and overall invoice discounts (percentage `%` or fixed `₹`).
  - Follows exact calculation order: `Subtotal` → `Discount` → `Taxable Amount` → `GST` → `Grand Total`.
- **Profit Calculation:**
  - `Profit = (Selling Price - Purchase Price) × Quantity - applicable discount allocation`.
  - Stored permanently with the invoice record at sale time.
  - Aggregated into **Daily Profit**, **Monthly Profit**, and **Total Profit**.
- **Printable & PDF Ready:**
  - Material Design invoice layout with business header, GSTIN, bank/UPI settlement details, QR code, and terms.
  - One-click **Download PDF** (powered by `html2canvas` and `jsPDF`) and **Print**.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4
- **Icons:** Lucide React
- **PDF & Canvas:** jsPDF, html2canvas
- **Data Architecture:** Modular Context API with LocalStorage synchronization and factory initial seed data.

---

## 💻 Developer Commands

To run or build the project from `C:\Users\NEXT IAS\.gemini\antigravity\scratch\asan-bill`:

```powershell
# Start Vite development server
npm.cmd run dev

# Run production build
npm.cmd run build

# Preview production build
npm.cmd run preview
```
