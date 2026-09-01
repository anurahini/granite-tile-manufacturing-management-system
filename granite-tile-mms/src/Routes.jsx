import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'

import UserMaster from './pages/masters/UserMaster.jsx'
import EmployeeMaster from './pages/masters/EmployeeMaster.jsx'
import CustomerMaster from './pages/masters/CustomerMaster.jsx'
import SupplierMaster from './pages/masters/SupplierMaster.jsx'
import ProductMaster from './pages/masters/ProductMaster.jsx'
import ProductCategory from './pages/masters/ProductCategory.jsx'
import WarehouseMaster from './pages/masters/WarehouseMaster.jsx'
import MachineMaster from './pages/masters/MachineMaster.jsx'
import VendorMaster from './pages/masters/VendorMaster.jsx'
import SupplierProfile from './pages/masters/SupplierProfile.jsx'

import PurchaseOrder from './pages/transactions/PurchaseOrder.jsx'
import ProductionOrder from './pages/transactions/ProductionOrder.jsx'
import Inventory from './pages/transactions/Inventory.jsx'
import SalesOrder from './pages/transactions/SalesOrder.jsx'
import Delivery from './pages/transactions/Delivery.jsx'
import Invoice from './pages/transactions/Invoice.jsx'
import Payment from './pages/transactions/Payment.jsx'

import ReportCenter from './pages/reports/ReportCenter.jsx'
import ProfitAnalysis from './pages/reports/ProfitAnalysis.jsx'
import Catalog from './pages/products/Catalog.jsx'
import ProductDetails from './pages/products/ProductDetails.jsx'
import Compare from './pages/products/Compare.jsx'
import Wishlist from './pages/products/Wishlist.jsx'
import ClearanceSale from './pages/products/ClearanceSale.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing landing page — no auth required */}
      <Route path="/" element={<Home />} />

      {/* Public auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Everything below requires a logged-in session.
          ProtectedRoute redirects to /login if not authenticated. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product-catalog" element={<Catalog />} />
          <Route path="/product-catalog/:id" element={<ProductDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/clearance-sale" element={<ClearanceSale />} />

          <Route path="/user-master" element={<UserMaster />} />
          <Route path="/employee-master" element={<EmployeeMaster />} />
          <Route path="/customer-master" element={<CustomerMaster />} />
          <Route path="/supplier-master" element={<SupplierMaster />} />
          <Route path="/supplier-master/:id" element={<SupplierProfile />} />
          <Route path="/vendor-master" element={<VendorMaster />} />
          <Route path="/product-category-master" element={<ProductCategory />} />
          <Route path="/product-master" element={<ProductMaster />} />
          <Route path="/warehouse-master" element={<WarehouseMaster />} />
          <Route path="/machine-master" element={<MachineMaster />} />

          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route path="/production-order" element={<ProductionOrder />} />
          <Route path="/inventory-management" element={<Inventory />} />
          <Route path="/sales-order" element={<SalesOrder />} />
          <Route path="/delivery-management" element={<Delivery />} />
          <Route path="/invoice-management" element={<Invoice />} />
          <Route path="/payment-management" element={<Payment />} />

          <Route path="/report-center" element={<ReportCenter />} />
          <Route path="/monthly-profit-analysis" element={<ProfitAnalysis />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback: any unmatched path redirects home instead of 404-ing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
