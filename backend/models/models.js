import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// 1. User Model
export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  employeeId: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  mobile: { type: DataTypes.STRING, allowNull: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
  department: { type: DataTypes.STRING, defaultValue: 'Operations' },
  role: { type: DataTypes.STRING, defaultValue: 'Plant Administrator' },
  designation: { type: DataTypes.STRING, defaultValue: 'Plant Administrator' },
  theme: { type: DataTypes.STRING, defaultValue: 'light' },
  sidebarDensity: { type: DataTypes.STRING, defaultValue: 'Comfortable' },
  fontScale: { type: DataTypes.STRING, defaultValue: 'Medium' },
  notificationPreferences: { type: DataTypes.TEXT },
  twoFactorEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  isOtpVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  googleId: { type: DataTypes.STRING, allowNull: true }
});

// 2. Employee Model
export const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employeeCode: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  designation: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  joiningDate: { type: DataTypes.STRING, allowNull: false },
  salary: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 3. Customer Model
export const Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerCode: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  companyName: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, defaultValue: 'Corporate' },
  city: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  gstNumber: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 4. Supplier Model
export const Supplier = sequelize.define('Supplier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  supplierCode: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  contactPerson: { type: DataTypes.STRING },
  materialType: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 5. Vendor Model
export const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vendorCode: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  serviceType: { type: DataTypes.STRING, allowNull: false },
  contactPerson: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 6. Product Category Model
export const ProductCategory = sequelize.define('ProductCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 7. Product Model
export const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER },
  categoryName: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, allowNull: false }, // Wall Tile, Bathroom Tile, Floor Tile, Outdoor Tile, Granite, Marble
  size: { type: DataTypes.STRING }, // e.g. 600x1200 mm
  squareFeet: { type: DataTypes.FLOAT, defaultValue: 0 },
  colour: { type: DataTypes.STRING },
  finish: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  image: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'In Stock' }
});

// 8. Warehouse Model
export const Warehouse = sequelize.define('Warehouse', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.STRING },
  manager: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }
});

// 9. Machine Model
export const Machine = sequelize.define('Machine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Operational' }
});

// 10. Purchase Order Model
export const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  poNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  supplierName: { type: DataTypes.STRING, allowNull: false },
  productName: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unitPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  orderDate: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Approved' }
});

// 11. Production Order Model
export const ProductionOrder = sequelize.define('ProductionOrder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  batchNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  productName: { type: DataTypes.STRING, allowNull: false },
  plannedQty: { type: DataTypes.INTEGER, defaultValue: 0 },
  actualQty: { type: DataTypes.INTEGER, defaultValue: 0 },
  startDate: { type: DataTypes.STRING },
  endDate: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'In Progress' }
});

// 12. Inventory Model
export const InventoryItem = sequelize.define('InventoryItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER },
  productName: { type: DataTypes.STRING, allowNull: false },
  warehouseName: { type: DataTypes.STRING, defaultValue: 'Central Hub' },
  category: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  unitPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalValue: { type: DataTypes.FLOAT, defaultValue: 0 },
  reorderLevel: { type: DataTypes.INTEGER, defaultValue: 100 },
  status: { type: DataTypes.STRING, defaultValue: 'Adequate' }
});

// 13. Sales Order Model
export const SalesOrder = sequelize.define('SalesOrder', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  productName: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  gst: { type: DataTypes.FLOAT, defaultValue: 18 },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'Bank Transfer' },
  orderDate: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Processing' }
});

// 14. Delivery Model
export const Delivery = sequelize.define('Delivery', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  deliveryNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  salesOrderNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  vehicleNo: { type: DataTypes.STRING },
  driverName: { type: DataTypes.STRING },
  deliveryDate: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'In Transit' }
});

// 15. Invoice Model
export const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  salesOrderNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  invoiceDate: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.STRING },
  subtotal: { type: DataTypes.FLOAT, defaultValue: 0 },
  gstAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  discountAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentStatus: { type: DataTypes.STRING, defaultValue: 'Unpaid' }
});

// 16. Payment Model
export const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  paymentNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  invoiceNumber: { type: DataTypes.STRING },
  customerName: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'Bank Transfer' },
  transactionRef: { type: DataTypes.STRING },
  paymentDate: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Completed' }
});

// 17. Damaged Product Model
export const DamagedProduct = sequelize.define('DamagedProduct', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER },
  productName: { type: DataTypes.STRING, allowNull: false },
  damagedQuantity: { type: DataTypes.INTEGER, allowNull: false },
  damagePercentage: { type: DataTypes.FLOAT, defaultValue: 10 },
  originalPrice: { type: DataTypes.FLOAT, allowNull: false },
  clearancePrice: { type: DataTypes.FLOAT, allowNull: false },
  reason: { type: DataTypes.STRING, defaultValue: 'Surface Scratch' },
  status: { type: DataTypes.STRING, defaultValue: 'Listed for Clearance' }
});

// 18. Expense Model
export const Expense = sequelize.define('Expense', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  expenseDate: { type: DataTypes.STRING }
});

// 19. Enquiry Model
export const Enquiry = sequelize.define('Enquiry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productLot: { type: DataTypes.STRING, allowNull: false },
  customerName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  message: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }
});

// 20. Otp Model
export const Otp = sequelize.define('Otp', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mobile: { type: DataTypes.STRING, allowNull: false },
  otp: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  isUsed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// 21. WhatsApp Message Model
export const WhatsAppMessage = sequelize.define('WhatsAppMessage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  contactName: { type: DataTypes.STRING, allowNull: false },
  contactPhone: { type: DataTypes.STRING, allowNull: false },
  messageText: { type: DataTypes.TEXT, allowNull: false },
  sender: { type: DataTypes.STRING, defaultValue: 'customer' },
  timestamp: { type: DataTypes.STRING },
  attachmentUrl: { type: DataTypes.STRING },
  attachmentName: { type: DataTypes.STRING },
  attachmentSize: { type: DataTypes.STRING },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: true },
  status: { type: DataTypes.STRING, defaultValue: 'delivered' }
});

// 22. Voice Mail Model
export const VoiceMail = sequelize.define('VoiceMail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerPhone: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING, defaultValue: '00:28' },
  audioUrl: { type: DataTypes.STRING },
  transcription: { type: DataTypes.TEXT },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'New' }
});

// 23. Communication Notification Model
export const CommunicationNotification = sequelize.define('CommunicationNotification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'WhatsApp' },
  timestamp: { type: DataTypes.STRING },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

