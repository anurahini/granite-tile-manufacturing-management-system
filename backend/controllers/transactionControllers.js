import {
  PurchaseOrder, ProductionOrder, InventoryItem, SalesOrder,
  Delivery, Invoice, Payment, DamagedProduct, Product
} from '../models/models.js';
import { handlePurchaseInventoryIncrease, handleSalesInventoryDecrease } from '../services/inventoryService.js';

// 1. Purchase Order Controller
export const purchaseController = {
  getAll: async (req, res) => {
    try {
      const orders = await PurchaseOrder.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { supplierName, productName, quantity, unitPrice, status = 'Approved' } = req.body;
      const totalAmount = Number(quantity) * Number(unitPrice || 0);
      const poNumber = req.body.poNumber || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderDate = req.body.orderDate || new Date().toISOString().split('T')[0];

      const po = await PurchaseOrder.create({
        poNumber,
        supplierName,
        productName,
        quantity,
        unitPrice,
        totalAmount,
        orderDate,
        status
      });

      // Stock increases when purchase order is created/approved
      await handlePurchaseInventoryIncrease(productName, quantity, unitPrice);

      res.status(201).json({ success: true, message: 'Purchase Order created and inventory updated', data: po });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const item = await PurchaseOrder.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Purchase Order not found' });
      await item.destroy();
      res.json({ success: true, message: 'Purchase Order deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 2. Production Order Controller
export const productionController = {
  getAll: async (req, res) => {
    try {
      const batches = await ProductionOrder.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: batches.length, data: batches });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const batchNumber = req.body.batchNumber || `PB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const batch = await ProductionOrder.create({ ...req.body, batchNumber });
      res.status(201).json({ success: true, message: 'Production Batch created', data: batch });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 3. Inventory Controller
export const inventoryController = {
  getAll: async (req, res) => {
    try {
      const items = await InventoryItem.findAll({ order: [['id', 'DESC']] });
      const totalStockValue = items.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);
      res.json({ success: true, count: items.length, totalStockValue, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 4. Sales Order Controller
export const salesController = {
  getAll: async (req, res) => {
    try {
      const orders = await SalesOrder.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { customerName, productName, quantity, price, gst = 18, discount = 0, paymentMethod = 'Bank Transfer' } = req.body;
      const qty = Number(quantity);
      const prc = Number(price);
      const subtotal = qty * prc;
      const gstAmt = (subtotal * Number(gst)) / 100;
      const discAmt = (subtotal * Number(discount)) / 100;
      const totalAmount = subtotal + gstAmt - discAmt;

      const orderNumber = req.body.orderNumber || `SO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderDate = req.body.orderDate || new Date().toISOString().split('T')[0];

      const salesOrder = await SalesOrder.create({
        orderNumber,
        customerName,
        productName,
        quantity: qty,
        price: prc,
        gst: Number(gst),
        discount: Number(discount),
        totalAmount,
        paymentMethod,
        orderDate,
        status: req.body.status || 'Processing'
      });

      // Stock decreases on Sales Order
      await handleSalesInventoryDecrease(productName, qty);

      // Generate Invoice automatically
      const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await Invoice.create({
        invoiceNumber,
        salesOrderNumber: orderNumber,
        customerName,
        invoiceDate: orderDate,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        subtotal,
        gstAmount: gstAmt,
        discountAmount: discAmt,
        totalAmount,
        paymentStatus: 'Unpaid'
      });

      // Generate Delivery Record
      const deliveryNumber = `DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      await Delivery.create({
        deliveryNumber,
        salesOrderNumber: orderNumber,
        customerName,
        destination: req.body.destination || 'Customer Address',
        vehicleNo: 'TN-09-CB-4821',
        driverName: 'R. Velu',
        deliveryDate: orderDate,
        status: 'In Transit'
      });

      res.status(201).json({
        success: true,
        message: 'Sales Order placed successfully. Stock updated and Invoice generated.',
        data: salesOrder
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 5. Delivery Controller
export const deliveryController = {
  getAll: async (req, res) => {
    try {
      const list = await Delivery.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: list.length, data: list });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 6. Invoice Controller
export const invoiceController = {
  getAll: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 7. Payment Controller
export const paymentController = {
  getAll: async (req, res) => {
    try {
      const payments = await Payment.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const paymentNumber = req.body.paymentNumber || `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const paymentDate = req.body.paymentDate || new Date().toISOString().split('T')[0];

      const pmt = await Payment.create({ ...req.body, paymentNumber, paymentDate });

      // Update related invoice status if provided
      if (req.body.invoiceNumber) {
        const inv = await Invoice.findOne({ where: { invoiceNumber: req.body.invoiceNumber } });
        if (inv) {
          inv.paymentStatus = 'Paid';
          await inv.save();
        }
      }

      res.status(201).json({ success: true, message: 'Payment recorded successfully', data: pmt });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// 8. Damaged / Clearance Controller
export const damagedController = {
  getAll: async (req, res) => {
    try {
      const items = await DamagedProduct.findAll({ order: [['id', 'DESC']] });
      res.json({ success: true, count: items.length, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const { productName, damagedQuantity, damagePercentage = 15, originalPrice, reason = 'Surface Scratch' } = req.body;
      const origPrc = Number(originalPrice);
      const dmgPct = Number(damagePercentage);
      const clearancePrice = origPrc * (1 - dmgPct / 100);

      const damaged = await DamagedProduct.create({
        productName,
        damagedQuantity,
        damagePercentage: dmgPct,
        originalPrice: origPrc,
        clearancePrice,
        reason,
        status: 'Listed for Clearance'
      });

      res.status(201).json({ success: true, message: 'Damaged item logged for clearance sale', data: damaged });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
