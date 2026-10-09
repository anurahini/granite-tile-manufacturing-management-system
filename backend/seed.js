import bcrypt from 'bcryptjs';
import sequelize, { connectDB } from './config/db.js';
import {
  User, Employee, Customer, Supplier, Vendor,
  ProductCategory, Product, Warehouse, Machine, PurchaseOrder,
  ProductionOrder, InventoryItem, SalesOrder, Delivery,
  Invoice, Payment, DamagedProduct, Expense
} from './models/models.js';

export const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: false });

    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('admin123', salt);

    const defaultUsers = [
      {
        fullName: 'Ramesh Sundaram',
        employeeId: 'EMP-2001',
        email: 'ramesh.s@granitex.com',
        mobile: '+91 98400 12345',
        username: 'admin',
        password: defaultHashedPassword,
        department: 'Operations',
        role: 'Plant Administrator',
        designation: 'Plant Administrator',
        isOtpVerified: true
      },
      {
        fullName: 'Priya Natarajan',
        employeeId: 'EMP-2002',
        email: 'priya.n@granitex.com',
        mobile: '+91 98400 54321',
        username: 'priya',
        password: defaultHashedPassword,
        department: 'Sales',
        role: 'Sales Executive',
        designation: 'Sales Executive',
        isOtpVerified: true
      },
      {
        fullName: 'Karthik Subramanian',
        employeeId: 'EMP-2003',
        email: 'karthik.s@granitex.com',
        mobile: '+91 98400 99887',
        username: 'karthik',
        password: defaultHashedPassword,
        department: 'Production',
        role: 'Production Supervisor',
        designation: 'Production Supervisor',
        isOtpVerified: true
      },
      {
        fullName: 'Kavitha Rao',
        employeeId: 'EMP-2004',
        email: 'kavitha.r@granitex.com',
        mobile: '+91 98400 33445',
        username: 'kavitha',
        password: defaultHashedPassword,
        department: 'Warehouse',
        role: 'Inventory Clerk',
        designation: 'Inventory Clerk',
        isOtpVerified: true
      },
      {
        fullName: 'Suresh Babu',
        employeeId: 'EMP-2005',
        email: 'suresh.b@granitex.com',
        mobile: '+91 98400 77665',
        username: 'suresh',
        password: defaultHashedPassword,
        department: 'Procurement',
        role: 'Purchase Officer',
        designation: 'Purchase Officer',
        isOtpVerified: true
      },
      {
        fullName: 'Divya Chandran',
        employeeId: 'EMP-2006',
        email: 'divya.c@granitex.com',
        mobile: '+91 98400 11223',
        username: 'divya',
        password: defaultHashedPassword,
        department: 'Finance',
        role: 'Finance Manager',
        designation: 'Finance Manager',
        isOtpVerified: true
      }
    ];

    // Check if data already exists
    const userCount = await User.count();
    if (userCount > 0) {
      console.log(`[Seed] Database contains ${userCount} user records. Ensuring all 6 standard user accounts exist...`);
      for (const u of defaultUsers) {
        const existing = await User.findOne({ where: { username: u.username } });
        if (!existing) {
          await User.create(u);
          console.log(`[Seed] Created missing user account: ${u.username} (${u.role})`);
        } else {
          existing.password = defaultHashedPassword;
          existing.mobile = u.mobile || existing.mobile;
          existing.email = u.email || existing.email;
          existing.role = u.role || existing.role;
          await existing.save();
        }
      }
      return;
    }

    console.log('[Seed] Seeding database with initial Granite & Tile MMS master & transaction data...');

    // 1. Users
    await User.bulkCreate(defaultUsers);

    // 2. Employees
    await Employee.bulkCreate([
      { employeeCode: 'EMP-2001', name: 'Ramesh Sundaram', email: 'ramesh.s@granitex.com', phone: '+91 98400 12345', designation: 'Plant Administrator', department: 'Operations', joiningDate: '2021-03-15', salary: 85000, status: 'Active' },
      { employeeCode: 'EMP-2002', name: 'Priya Natarajan', email: 'priya.n@granitex.com', phone: '+91 98400 54321', designation: 'Sales Executive', department: 'Sales', joiningDate: '2022-06-01', salary: 65000, status: 'Active' },
      { employeeCode: 'EMP-2003', name: 'Karthik Subramanian', email: 'karthik.s@granitex.com', phone: '+91 98400 99887', designation: 'Production Supervisor', department: 'Production', joiningDate: '2020-01-10', salary: 72000, status: 'Active' },
      { employeeCode: 'EMP-2004', name: 'Kavitha Rao', email: 'Kavitha.r@granitex.com', phone: '+91 98400 33445', designation: 'Inventory Clerk', department: 'Warehouse', joiningDate: '2022-02-15', salary: 55000, status: 'Active' },
      { employeeCode: 'EMP-2005', name: 'Suresh Babu', email: 'suresh.b@granitex.com', phone: '+91 98400 77665', designation: 'Quality Inspector', department: 'Quality', joiningDate: '2021-08-20', salary: 60000, status: 'Active' },
      { employeeCode: 'EMP-2006', name: 'Divya Chandran', email: 'divya.c@granitex.com', phone: '+91 98400 11223', designation: 'Accounts Officer', department: 'Finance', joiningDate: '2021-11-05', salary: 68000, status: 'Active' }
    ]);

    // 3. Customers
    await Customer.bulkCreate([
      { customerCode: 'CUS-3001', name: 'Sri Lakshmi Builders', companyName: 'Sri Lakshmi Constructions Ltd', type: 'Corporate', city: 'Chennai', contact: '+91 98400 12345', email: 'purchase@srilakshmi.com', gstNumber: '33AAACS1234A1Z5', status: 'Active' },
      { customerCode: 'CUS-3002', name: 'Marble Palace Interiors', companyName: 'Marble Palace Design Studio', type: 'Retail', city: 'Bengaluru', contact: '+91 98450 22233', email: 'orders@marblepalace.in', gstNumber: '29BBBMP5678B1Z2', status: 'Active' },
      { customerCode: 'CUS-3003', name: 'Al Fahad Stone Trading', companyName: 'Al Fahad General Trading LLC', type: 'Export', city: 'Dubai, UAE', contact: '+971 50 112 3344', email: 'import@alfahadstone.ae', gstNumber: 'FOREIGN_TAX_99', status: 'Active' },
      { customerCode: 'CUS-3004', name: 'Chola Constructions', companyName: 'Chola Infrastructure Pvt Ltd', type: 'Corporate', city: 'Madurai', contact: '+91 90030 98765', email: 'procurement@cholabuilders.com', gstNumber: '33CCCC1111C1Z8', status: 'Active' }
    ]);

    // 4. Suppliers
    await Supplier.bulkCreate([
      { supplierCode: 'SUP-1001', name: 'Granite Craft Mining Co.', contactPerson: 'S. Rajendran', materialType: 'Granite Rough Blocks', city: 'Hosur', contact: '+91 94432 10987', email: 'sales@granitecraft.com', rating: 4.8, status: 'Active' },
      { supplierCode: 'SUP-1002', name: 'Deccan Abrasives & Tools', contactPerson: 'V. Anand', materialType: 'Diamond Blades & Polishing Bricks', city: 'Hyderabad', contact: '+91 98480 33445', email: 'orders@deccanabrasives.in', rating: 4.6, status: 'Active' },
      { supplierCode: 'SUP-1003', name: 'Rajasthan Marble Quarries', contactPerson: 'Mahipal Singh', materialType: 'Makrana & White Marble Slabs', city: 'Udaipur', contact: '+91 94141 77889', email: 'quarry@rajmarble.com', rating: 4.9, status: 'Active' }
    ]);

    // 5. Vendors
    await Vendor.bulkCreate([
      { vendorCode: 'VEN-5001', name: 'Express Freight Logistics', serviceType: 'Logistics & Heavy Transport', contactPerson: 'M. Selvam', phone: '+91 98840 77112', email: 'dispatch@expressfreight.com', status: 'Active' },
      { vendorCode: 'VEN-5002', name: 'Apex Machine Maintenance', serviceType: 'Gangsaw & Machinery Repairs', contactPerson: 'D. Kumar', phone: '+91 94440 33221', email: 'service@apexmachinery.in', status: 'Active' }
    ]);

    // 6. Categories
    await ProductCategory.bulkCreate([
      { code: 'CAT-GRN', name: 'Granite Slabs', description: 'Premium polished & flamed granite slabs for countertops, cladding & flooring.', status: 'Active' },
      { code: 'CAT-MRB', name: 'Marble Slabs & Tiles', description: 'Imported and Indian natural marble slabs for interior luxury flooring.', status: 'Active' },
      { code: 'CAT-VTR', name: 'Vitrified & Ceramic Tiles', description: 'Double charged, glazed vitrified tiles for residential & commercial spaces.', status: 'Active' },
      { code: 'CAT-OUT', name: 'Outdoor & Paver Tiles', description: 'Heavy duty anti-skid tactile pavers for driveways & landscaping.', status: 'Active' }
    ]);

    // 7. Products
    await Product.bulkCreate([
      {
        code: 'PRD-GRN-01',
        name: 'Tan Brown Granite',
        categoryName: 'Granite Slabs',
        type: 'Granite',
        size: '3000x1800 mm',
        squareFeet: 58.0,
        colour: 'Brown with Black Felspar',
        finish: 'Polished',
        price: 185,
        stock: 450,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      },
      {
        code: 'PRD-GRN-02',
        name: 'Black Galaxy Granite',
        categoryName: 'Granite Slabs',
        type: 'Granite',
        size: '3200x1900 mm',
        squareFeet: 65.0,
        colour: 'Deep Black with Golden Flecks',
        finish: 'Mirror Polished',
        price: 240,
        stock: 320,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      },
      {
        code: 'PRD-MRB-01',
        name: 'Statuario White Marble',
        categoryName: 'Marble Slabs & Tiles',
        type: 'Marble',
        size: '2800x1600 mm',
        squareFeet: 48.0,
        colour: 'Pure White with Grey Vein',
        finish: 'Polished',
        price: 450,
        stock: 150,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      },
      {
        code: 'PRD-TIL-01',
        name: 'Royal Calacatta Floor Tile',
        categoryName: 'Vitrified & Ceramic Tiles',
        type: 'Floor Tile',
        size: '600x1200 mm',
        squareFeet: 7.75,
        colour: 'Carrara White',
        finish: 'High Gloss Polished',
        price: 68,
        stock: 2400,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      },
      {
        code: 'PRD-TIL-02',
        name: 'Moroccan Azure Bathroom Tile',
        categoryName: 'Vitrified & Ceramic Tiles',
        type: 'Bathroom Tile',
        size: '300x600 mm',
        squareFeet: 1.93,
        colour: 'Azure Blue & Gold Pattern',
        finish: 'Matt Glazed',
        price: 82,
        stock: 1800,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      },
      {
        code: 'PRD-TIL-03',
        name: 'Heavy Duty Anti-Skid Paver',
        categoryName: 'Outdoor & Paver Tiles',
        type: 'Outdoor Tile',
        size: '400x400 mm',
        squareFeet: 1.72,
        colour: 'Terracotta Red',
        finish: 'Flamed / Textured',
        price: 45,
        stock: 3500,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1595846519845-68e298c2ebe6?auto=format&fit=crop&w=600&q=80',
        status: 'In Stock'
      }
    ]);

    // 8. Warehouses
    await Warehouse.bulkCreate([
      { code: 'WH-CHE-01', name: 'Chennai Central Stock Hub', location: 'Guindy Industrial Estate, Chennai', capacity: '50,000 sq.m', manager: 'S. Loganathan', status: 'Active' },
      { code: 'WH-HOS-02', name: 'Hosur Quarry Stockyard', location: 'SIPCOT Phase-II, Hosur', capacity: '1,20,000 sq.m', manager: 'M. Prakash', status: 'Active' }
    ]);

    // 9. Machines
    await Machine.bulkCreate([
      { code: 'MAC-GS-01', name: 'Multi-Blade Gangsaw A1', type: 'Gangsaw', location: 'Bay-1', status: 'Operational' },
      { code: 'MAC-PL-02', name: '16-Head Automatic Polishing Line', type: 'Polishing Line', location: 'Bay-2', status: 'Operational' },
      { code: 'MAC-BR-03', name: 'Bridge Block Cutter B2', type: 'Block Cutter', location: 'Bay-3', status: 'Under Maintenance' }
    ]);

    // 10. Purchase Orders
    await PurchaseOrder.bulkCreate([
      { poNumber: 'PO-2026-0412', supplierName: 'Granite Craft Mining Co.', productName: 'Tan Brown Granite Blocks', quantity: 200, unitPrice: 120, totalAmount: 24000, orderDate: '2026-09-01', status: 'Received' },
      { poNumber: 'PO-2026-0413', supplierName: 'Rajasthan Marble Quarries', productName: 'Makrana Marble Rough Blocks', quantity: 150, unitPrice: 280, totalAmount: 42000, orderDate: '2026-09-03', status: 'Approved' }
    ]);

    // 11. Production Orders
    await ProductionOrder.bulkCreate([
      { batchNumber: 'PB-2026-0881', productName: 'Tan Brown Granite Slabs', plannedQty: 180, actualQty: 165, startDate: '2026-09-02', endDate: '2026-09-06', status: 'Completed' },
      { batchNumber: 'PB-2026-0882', productName: 'Royal Calacatta Tiles Batch-C', plannedQty: 2400, actualQty: 2210, startDate: '2026-09-05', endDate: '2026-09-08', status: 'In Progress' }
    ]);

    // 12. Inventory Items
    await InventoryItem.bulkCreate([
      { productId: 1, productName: 'Tan Brown Granite', warehouseName: 'Chennai Central Stock Hub', category: 'Granite Slabs', quantity: 450, unitPrice: 185, totalValue: 83250, reorderLevel: 100, status: 'Adequate' },
      { productId: 2, productName: 'Black Galaxy Granite', warehouseName: 'Hosur Quarry Stockyard', category: 'Granite Slabs', quantity: 320, unitPrice: 240, totalValue: 76800, reorderLevel: 80, status: 'Adequate' },
      { productId: 3, productName: 'Statuario White Marble', warehouseName: 'Chennai Central Stock Hub', category: 'Marble Slabs', quantity: 150, unitPrice: 450, totalValue: 67500, reorderLevel: 50, status: 'Adequate' },
      { productId: 4, productName: 'Royal Calacatta Floor Tile', warehouseName: 'Chennai Central Stock Hub', category: 'Vitrified Tiles', quantity: 2400, unitPrice: 68, totalValue: 163200, reorderLevel: 500, status: 'Adequate' }
    ]);

    // 13. Sales Orders
    await SalesOrder.bulkCreate([
      { orderNumber: 'SO-2026-0986', customerName: 'Sri Lakshmi Builders', productName: 'Tan Brown Granite', quantity: 4000, price: 185, gst: 18, discount: 5, totalAmount: 738150, paymentMethod: 'Bank Transfer', orderDate: '2026-09-04', status: 'Processing' },
      { orderNumber: 'SO-2026-0985', customerName: 'Marble Palace Interiors', productName: 'Royal Calacatta Floor Tile', quantity: 3500, price: 68, gst: 18, discount: 0, totalAmount: 280840, paymentMethod: 'UPI', orderDate: '2026-09-05', status: 'Completed' },
      { orderNumber: 'SO-2026-0984', customerName: 'Al Fahad Stone Trading', productName: 'Black Galaxy Granite', quantity: 3000, price: 240, gst: 0, discount: 2, totalAmount: 705600, paymentMethod: 'Letter of Credit', orderDate: '2026-09-06', status: 'Approved' }
    ]);

    // 14. Deliveries
    await Delivery.bulkCreate([
      { deliveryNumber: 'DEL-2026-0401', salesOrderNumber: 'SO-2026-0986', customerName: 'Sri Lakshmi Builders', destination: 'OMR Tech Park Site, Chennai', vehicleNo: 'TN-09-CB-4821', driverName: 'R. Velu', deliveryDate: '2026-09-05', status: 'In Transit' },
      { deliveryNumber: 'DEL-2026-0402', salesOrderNumber: 'SO-2026-0985', customerName: 'Marble Palace Interiors', destination: 'Indiranagar Site, Bengaluru', vehicleNo: 'KA-01-MH-9912', driverName: 'S. Gowda', deliveryDate: '2026-09-06', status: 'Delivered' }
    ]);

    // 15. Invoices
    await Invoice.bulkCreate([
      { invoiceNumber: 'INV-2026-0812', salesOrderNumber: 'SO-2026-0986', customerName: 'Sri Lakshmi Builders', invoiceDate: '2026-09-04', dueDate: '2026-09-19', subtotal: 740000, gstAmount: 133200, discountAmount: 37000, totalAmount: 836200, paymentStatus: 'Unpaid' },
      { invoiceNumber: 'INV-2026-0811', salesOrderNumber: 'SO-2026-0985', customerName: 'Marble Palace Interiors', invoiceDate: '2026-09-05', dueDate: '2026-09-20', subtotal: 238000, gstAmount: 42840, discountAmount: 0, totalAmount: 280840, paymentStatus: 'Paid' }
    ]);

    // 16. Payments
    await Payment.bulkCreate([
      { paymentNumber: 'PAY-2026-0311', invoiceNumber: 'INV-2026-0811', customerName: 'Marble Palace Interiors', amount: 280840, paymentMethod: 'UPI', transactionRef: 'UPI/20260905/998124', paymentDate: '2026-09-05', status: 'Completed' }
    ]);

    // 17. Damaged Products
    await DamagedProduct.bulkCreate([
      { productId: 1, productName: 'Tan Brown Granite Slab (Corner Chip)', damagedQuantity: 12, damagePercentage: 25, originalPrice: 185, clearancePrice: 138.75, reason: 'Transit Edge Chip', status: 'Listed for Clearance' },
      { productId: 3, productName: 'Statuario White Marble (Surface Hairline)', damagedQuantity: 8, damagePercentage: 35, originalPrice: 450, clearancePrice: 292.50, reason: 'Natural Vein Hairline', status: 'Listed for Clearance' }
    ]);

    // 18. Expenses
    await Expense.bulkCreate([
      { title: 'Quarry Rough Block Purchase', category: 'Raw Material', amount: 24000, expenseDate: '2026-09-01' },
      { title: 'Factory Electricity Bill', category: 'Electricity', amount: 185000, expenseDate: '2026-09-02' },
      { title: 'Monthly Staff Payroll', category: 'Salaries', amount: 450000, expenseDate: '2026-09-05' },
      { title: 'Machinery Maintenance & Diamond Blades', category: 'Maintenance', amount: 95000, expenseDate: '2026-09-04' }
    ]);

    console.log('[Seed] Database successfully populated with initial Granite & Tile MMS records!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
