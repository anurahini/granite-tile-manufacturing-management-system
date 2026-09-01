import {
  Home, Users, UserSquare2, Contact, Truck, Boxes, Tags,
  Warehouse, Cog, ShoppingCart, Factory, PackageSearch, ReceiptText,
  Send, FileStack, Wallet, BarChart3, PieChart, Settings, LayoutGrid,
  Scale, Heart, Tag
} from 'lucide-react'

export const navConfig = [
  { type: 'link', label: 'Home', labelKey: 'home', path: '/dashboard', icon: Home },
  {
    type: 'group', label: 'Catalog', labelKey: 'catalog', icon: LayoutGrid,
    children: [
      { label: 'Product Catalog', labelKey: 'productCatalog', path: '/product-catalog', icon: LayoutGrid },
      { label: 'Compare Products', labelKey: 'compareProducts', path: '/compare', icon: Scale },
      { label: 'Wishlist', labelKey: 'wishlist', path: '/wishlist', icon: Heart },
      { label: 'Clearance Sale', labelKey: 'clearanceSale', path: '/clearance-sale', icon: Tag },
    ]
  },
  {
    type: 'group', label: 'Masters', labelKey: 'masters', icon: Boxes,
    children: [
      { label: 'User Master', labelKey: 'userMaster', path: '/user-master', icon: Users },
      { label: 'Employee Master', labelKey: 'employeeMaster', path: '/employee-master', icon: UserSquare2 },
      { label: 'Customer Master', labelKey: 'customerMaster', path: '/customer-master', icon: Contact },
      { label: 'Supplier Master', labelKey: 'supplierMaster', path: '/supplier-master', icon: Truck },
      { label: 'Vendor Master', labelKey: 'vendorMaster', path: '/vendor-master', icon: Truck },
      { label: 'Product Category', labelKey: 'productCategory', path: '/product-category-master', icon: Tags },
      { label: 'Product Master', labelKey: 'productMaster', path: '/product-master', icon: Boxes },
      { label: 'Warehouse Master', labelKey: 'warehouseMaster', path: '/warehouse-master', icon: Warehouse },
      { label: 'Machine Master', labelKey: 'machineMaster', path: '/machine-master', icon: Cog },
    ]
  },
  {
    type: 'group', label: 'Transactions', labelKey: 'transactions', icon: FileStack,
    children: [
      { label: 'Purchase Order', labelKey: 'purchaseOrder', path: '/purchase-order', icon: ShoppingCart },
      { label: 'Production Order', labelKey: 'productionOrder', path: '/production-order', icon: Factory },
      { label: 'Inventory Management', labelKey: 'inventoryManagement', path: '/inventory-management', icon: PackageSearch },
      { label: 'Sales Order', labelKey: 'salesOrder', path: '/sales-order', icon: ReceiptText },
      { label: 'Delivery Management', labelKey: 'deliveryManagement', path: '/delivery-management', icon: Send },
      { label: 'Invoice Management', labelKey: 'invoiceManagement', path: '/invoice-management', icon: FileStack },
      { label: 'Payment Management', labelKey: 'paymentManagement', path: '/payment-management', icon: Wallet },
    ]
  },
  {
    type: 'group', label: 'Reports', labelKey: 'reports', icon: BarChart3,
    children: [
      { label: 'Report Center', labelKey: 'reportCenter', path: '/report-center', icon: BarChart3 },
      { label: 'Monthly Profit Analysis', labelKey: 'profitAnalysis', path: '/monthly-profit-analysis', icon: PieChart },
    ]
  },
  { type: 'link', label: 'Settings', labelKey: 'settings', path: '/settings', icon: Settings },
]
