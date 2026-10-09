import {
  User, Employee, Customer, Supplier, Vendor,
  ProductCategory, Product, Warehouse, Machine, Enquiry
} from '../models/models.js';

// Generic CRUD helper generator
const createCrudController = (Model, entityName, defaultPreparer = (data) => data) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${entityName} not found` });
      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const preparedData = defaultPreparer(req.body);
      const item = await Model.create(preparedData);
      res.status(201).json({ success: true, message: `${entityName} created successfully`, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${entityName} not found` });
      await item.update(req.body);
      res.json({ success: true, message: `${entityName} updated successfully`, data: item });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${entityName} not found` });
      await item.destroy();
      res.json({ success: true, message: `${entityName} deleted successfully` });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

export const userController = {
  ...createCrudController(User, 'User', (d) => ({
    fullName: d.fullName || d.name || 'New System User',
    employeeId: d.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    email: d.email || `user${Math.floor(1000 + Math.random() * 9000)}@granitex.com`,
    mobile: d.mobile || d.contact || '+91 98400 12345',
    username: d.username || `user_${Math.floor(1000 + Math.random() * 9000)}`,
    password: d.password || 'user123',
    department: d.department || 'Operations',
    role: d.role || 'Plant Staff',
    designation: d.designation || 'Plant Administrator',
    theme: d.theme || 'light',
    sidebarDensity: d.sidebarDensity || 'Comfortable',
    fontScale: d.fontScale || 'Medium',
    isOtpVerified: true
  })),
  updateProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const { fullName, email, mobile, designation, department, employeeId } = req.body;
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (mobile) user.mobile = mobile;
      if (designation) user.designation = designation;
      if (department) user.department = department;
      if (employeeId) user.employeeId = employeeId;
      await user.save();
      res.json({ success: true, message: 'Profile updated in MySQL', data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  updateTheme: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const { theme, sidebarDensity, fontScale } = req.body;
      if (theme) user.theme = theme;
      if (sidebarDensity) user.sidebarDensity = sidebarDensity;
      if (fontScale) user.fontScale = fontScale;
      await user.save();
      res.json({ success: true, message: 'Theme settings updated in MySQL', data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
  updateNotifications: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const { notificationPreferences } = req.body;
      if (notificationPreferences) {
        user.notificationPreferences = typeof notificationPreferences === 'string'
          ? notificationPreferences
          : JSON.stringify(notificationPreferences);
      }
      await user.save();
      res.json({ success: true, message: 'Notification preferences updated in MySQL', data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

export const employeeController = createCrudController(Employee, 'Employee', (d) => ({
  employeeCode: d.employeeCode || d.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
  name: d.name || 'New Employee',
  email: d.email || `emp_${Math.floor(1000 + Math.random() * 9000)}@granitex.com`,
  phone: d.phone || d.contact || '+91 98400 12345',
  designation: d.designation || 'Factory Technician',
  department: d.department || 'Production',
  joiningDate: d.joiningDate || d.joined || new Date().toISOString().split('T')[0],
  salary: Number(d.salary) || 45000,
  status: d.status || 'Active'
}));

export const customerController = createCrudController(Customer, 'Customer', (d) => ({
  customerCode: d.customerCode || d.id || `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
  name: d.name || 'New Customer Account',
  companyName: d.companyName || d.company || d.name,
  type: d.type || 'Corporate',
  city: d.city || 'Chennai',
  contact: d.contact || d.phone || '+91 98400 12345',
  email: d.email || 'customer@granitex.com',
  gstNumber: d.gstNumber || d.gst || '33AAACS9999A1Z5',
  status: d.status || 'Active'
}));

export const supplierController = createCrudController(Supplier, 'Supplier', (d) => ({
  supplierCode: d.supplierCode || d.id || `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
  name: d.name || 'New Raw Material Supplier',
  contactPerson: d.contactPerson || 'Logistics Desk',
  materialType: d.materialType || d.material || 'Granite Rough Blocks',
  city: d.city || 'Hosur',
  contact: d.contact || d.phone || '+91 94432 00000',
  email: d.email || 'supplier@granitecraft.com',
  rating: Number(d.rating) || 4.5,
  status: d.status || 'Active'
}));

export const vendorController = createCrudController(Vendor, 'Vendor', (d) => ({
  vendorCode: d.vendorCode || d.id || `VEN-${Math.floor(100 + Math.random() * 900)}`,
  name: d.name || 'New Service Vendor',
  serviceType: d.serviceType || 'Logistics & Freight',
  contactPerson: d.contactPerson || 'Service Executive',
  phone: d.phone || d.contact || '+91 98840 00000',
  email: d.email || 'vendor@logistics.com',
  status: d.status || 'Active'
}));

export const categoryController = createCrudController(ProductCategory, 'Category', (d) => ({
  code: d.code || d.id || `CAT-${Math.floor(100 + Math.random() * 900)}`,
  name: d.name || 'New Product Category',
  description: d.description || 'Natural stone and ceramic building materials.',
  status: d.status || 'Active'
}));

export const warehouseController = createCrudController(Warehouse, 'Warehouse', (d) => ({
  code: d.code || d.id || `WH-${Math.floor(100 + Math.random() * 900)}`,
  name: d.name || 'New Storage Unit',
  location: d.location || 'Chennai Facility',
  capacity: d.capacity || '10,000 sq.ft',
  manager: d.manager || 'Site Manager',
  status: d.status || 'Active'
}));

export const machineController = createCrudController(Machine, 'Machine', (d) => ({
  code: d.code || d.id || `MCH-${Math.floor(100 + Math.random() * 900)}`,
  name: d.name || 'New Machine Line',
  type: d.type || 'Precision Cutting',
  location: d.location || d.bay || 'Bay 1',
  status: d.status || 'Operational'
}));

export const enquiryController = createCrudController(Enquiry, 'Enquiry', (d) => ({
  productLot: d.productLot || d.product || 'Clearance Stone Lot',
  customerName: d.customerName || d.name || 'Anonymous Customer',
  phone: d.phone || d.contact || '+91 98400 00000',
  email: d.email || 'customer@example.com',
  quantity: Number(d.quantity || d.requiredQuantity || 1),
  message: d.message || 'Enquiry submitted via Clearance Sale page.',
  status: d.status || 'Pending'
}));

export const productController = {
  ...createCrudController(Product, 'Product', (d) => ({
    code: d.code || d.id || `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: d.name || 'New Stone Product',
    categoryName: d.categoryName || d.category || 'Granite Slabs',
    type: d.type || d.category || 'Granite',
    size: d.size || '600x1200 mm',
    squareFeet: Number(d.squareFeet || d.sqft || 7.75),
    colour: d.colour || d.color || 'Natural Brown',
    finish: d.finish || 'Polished',
    price: Number(d.price) || 180,
    stock: Number(d.stock) || 500,
    rating: Number(d.rating) || 4.8,
    image: d.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    status: d.status || 'In Stock'
  })),
  getByCategoryOrType: async (req, res) => {
    try {
      const { type, category } = req.query;
      let whereClause = {};
      if (type) whereClause.type = type;
      if (category) whereClause.categoryName = category;
      const products = await Product.findAll({ where: whereClause, order: [['id', 'DESC']] });
      res.json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
