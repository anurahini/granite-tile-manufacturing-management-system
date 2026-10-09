import express from 'express';
import {
  registerUser, loginUser, googleLogin, sendOtp, verifyOtp, updatePassword
} from '../controllers/authController.js';
import {
  userController, employeeController, customerController, supplierController,
  vendorController, categoryController, productController, warehouseController, machineController, enquiryController
} from '../controllers/masterControllers.js';
import {
  purchaseController, productionController, inventoryController, salesController,
  deliveryController, invoiceController, paymentController, damagedController
} from '../controllers/transactionControllers.js';
import {
  getMonthlyProfitAnalysis, getDashboardData, getReportSummary, getAdminDashboardSummary, getBusinessAnalytics
} from '../controllers/analyticsControllers.js';
import { whatsappController, voicemailController, notificationController } from '../controllers/communicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Base /api Root Endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Granite & Tile Manufacturing Management System REST API',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      customers: '/api/customers',
      employees: '/api/employees',
      suppliers: '/api/suppliers',
      vendors: '/api/vendors',
      warehouses: '/api/warehouses',
      machines: '/api/machines',
      purchases: '/api/purchases',
      production: '/api/production',
      inventory: '/api/inventory',
      sales: '/api/sales',
      deliveries: '/api/deliveries',
      invoices: '/api/invoices',
      payments: '/api/payments',
      damagedProducts: '/api/damaged-products',
      profit: '/api/profit',
      dashboard: '/api/dashboard',
      reports: '/api/reports',
      whatsapp: '/api/communication/whatsapp',
      voicemail: '/api/communication/voicemail',
      notifications: '/api/communication/notifications'
    },
    timestamp: new Date().toISOString()
  });
});

// 1. Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/google', googleLogin);
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/update-password', updatePassword);

// Helper macro to generate CRUD routes
const registerCrud = (basePath, controller) => {
  router.get(basePath, controller.getAll);
  if (controller.getById) router.get(`${basePath}/:id`, controller.getById);
  if (controller.create) router.post(basePath, controller.create);
  if (controller.update) router.put(`${basePath}/:id`, controller.update);
  if (controller.delete) router.delete(`${basePath}/:id`, controller.delete);
};

// 2. Master Routes
router.put('/users/:id/profile', userController.updateProfile);
router.put('/users/:id/theme', userController.updateTheme);
router.put('/users/:id/notifications', userController.updateNotifications);
registerCrud('/users', userController);
registerCrud('/employees', employeeController);
registerCrud('/customers', customerController);
registerCrud('/suppliers', supplierController);
registerCrud('/vendors', vendorController);
registerCrud('/categories', categoryController);

// Products specialized
router.get('/products', productController.getByCategoryOrType);
router.get('/products/:id', productController.getById);
router.post('/products', productController.create);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);

registerCrud('/warehouses', warehouseController);
registerCrud('/machines', machineController);

// 3. Transaction Routes
registerCrud('/purchases', purchaseController);
registerCrud('/production', productionController);
registerCrud('/inventory', inventoryController);
registerCrud('/sales', salesController);
registerCrud('/deliveries', deliveryController);
registerCrud('/invoices', invoiceController);
registerCrud('/payments', paymentController);
registerCrud('/damaged-products', damagedController);
registerCrud('/enquiries', enquiryController);

// 4. Communication Routes
router.post('/communication/whatsapp/send-real', whatsappController.sendReal);
registerCrud('/communication/whatsapp', whatsappController);
registerCrud('/communication/voicemail', voicemailController);
router.put('/communication/voicemail/:id/note', voicemailController.updateNote);
registerCrud('/communication/notifications', notificationController);
router.put('/communication/notifications/:id/read', notificationController.markRead);

// 5. Analytics & Reports
router.get('/profit', getMonthlyProfitAnalysis);
router.get('/dashboard', getDashboardData);
router.get('/reports', getReportSummary);
router.get('/admin/summary', getAdminDashboardSummary);
router.get('/business-analytics', getBusinessAnalytics);
router.get('/analytics', getBusinessAnalytics);

export default router;
