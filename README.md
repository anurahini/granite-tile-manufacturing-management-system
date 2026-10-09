# 🏭 Granite & Tile Manufacturing Management System (Full-Stack)

A complete full-stack Manufacturing Management System (MMS) for Granite & Tile businesses, built with **Node.js + Express REST API**, **Sequelize ORM (MySQL / SQLite)**, and **React + Vite**.

---

## Technical Stack & Architecture

- **Frontend**: React 18, React Router v6, Recharts, Lucide Icons, Vite
- **Backend**: Node.js, Express.js REST APIs, CORS, JWT Authentication, bcryptjs
- **Database**: MySQL / SQLite (via Sequelize ORM with automatic table creation & initial seeding)

---

## Complete API Route Documentation

All backend endpoints are hosted at `http://localhost:5000/api`:

### 1. Authentication & OTP
- `POST /api/auth/register` - User registration with password hashing (`bcryptjs`)
- `POST /api/auth/login` - Secure JWT login (supports Username, Email, Phone)
- `POST /api/auth/send-otp` - Phone OTP dispatch simulation
- `POST /api/auth/verify-otp` - Phone OTP verification

### 2. Master Management
- `GET / POST / PUT / DELETE /api/users` - User Master CRUD
- `GET / POST / PUT / DELETE /api/employees` - Employee Master & Payroll CRUD
- `GET / POST / PUT / DELETE /api/customers` - Customer Master CRUD
- `GET / POST / PUT / DELETE /api/suppliers` - Supplier Master & Performance CRUD
- `GET / POST / PUT / DELETE /api/vendors` - Vendor & Service Partner CRUD
- `GET / POST / PUT / DELETE /api/categories` - Product Category Master
- `GET / POST / PUT / DELETE /api/products` - Product Master (Wall/Bathroom/Floor/Outdoor Tiles, Granite, Marble, specs, pricing, stock, images)
- `GET / POST / PUT / DELETE /api/warehouses` - Warehouse & Storage Hub CRUD
- `GET / POST / PUT / DELETE /api/machines` - Machine & Equipment Maintenance

### 3. Transaction & Automated Inventory
- `GET / POST /api/purchases` - Purchase Order management (automatically increases product stock in DB)
- `GET / POST /api/production` - Production Order & Batch tracking
- `GET /api/inventory` - Real-time stock levels & warehouse inventory valuation
- `GET / POST /api/sales` - Sales Order placement (automatically decreases product stock & generates Invoice + Delivery records)
- `GET /api/deliveries` - Dispatch & Delivery challan tracking
- `GET /api/invoices` - Automated invoice generation & due date tracking
- `GET / POST /api/payments` - Payment receipts & invoice reconciliation
- `GET / POST /api/damaged-products` - Damaged product logging & Clearance Sale pricing

### 4. Business Intelligence & Analytics
- `GET /api/profit` - Dynamic Monthly Profit Analysis (calculates Total Sales, Total Purchases, Expenses, Returns, Gross & Net Profit)
- `GET /api/dashboard` - Operations Dashboard aggregate KPIs, Weekly Revenue chart, Production mix, Recent Orders
- `GET /api/reports` - Summary report analytics

---

## Quick Start & Installation

### 1. Backend Setup & Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start Backend Server (runs on http://localhost:5000)
npm start
```

*Note: On first startup, the server automatically syncs database tables and seeds baseline records.*

### 2. Frontend Setup & Start

```bash
# Open a new terminal window and navigate to frontend directory
cd granite-tile-mms

# Install frontend dependencies (if not already installed)
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

---

## Verification Flow

1. **Register**: Navigate to `http://localhost:5173/register` -> Enter mobile -> Click **Send OTP** -> Use code -> Register.
2. **Login**: Go to `/login` -> Sign in using your registered credentials or demo account (`admin` / `admin123`).
3. **Dashboard**: Observe live KPIs, Revenue chart, Production mix, and Recent Sales loaded from the REST API.
4. **Master Pages**: View or add records in Customer Master, Employee Master, Product Master, Supplier Master, Vendor Master, etc.
5. **Purchase Order**: Create a Purchase Order -> Check `Inventory Management` page to verify stock automatically increased.
6. **Sales Order**: Place a Sales Order -> Check `Inventory Management` (stock decreased) and `Invoice Management` (invoice generated).
7. **Clearance Sale**: Log a damaged product -> View discounted price on `/clearance-sale`.
8. **Monthly Profit Analysis**: View dynamic gross profit, net profit, and profit margin calculated from real database transactions.
