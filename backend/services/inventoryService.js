import { Product, InventoryItem } from '../models/models.js';

export const handlePurchaseInventoryIncrease = async (productName, quantity, unitPrice) => {
  try {
    const qty = Number(quantity);
    let product = await Product.findOne({ where: { name: productName } });
    if (product) {
      product.stock = (product.stock || 0) + qty;
      if (product.stock > 0 && product.status === 'Out of Stock') {
        product.status = 'In Stock';
      }
      await product.save();
    }

    let invItem = await InventoryItem.findOne({ where: { productName } });
    if (invItem) {
      invItem.quantity = (invItem.quantity || 0) + qty;
      invItem.totalValue = invItem.quantity * (invItem.unitPrice || unitPrice || 0);
      invItem.status = invItem.quantity < invItem.reorderLevel ? 'Low Stock' : 'Adequate';
      await invItem.save();
    } else if (product) {
      await InventoryItem.create({
        productId: product.id,
        productName: product.name,
        warehouseName: 'Central Hub',
        category: product.categoryName || product.type,
        quantity: qty,
        unitPrice: unitPrice || product.price,
        totalValue: qty * (unitPrice || product.price),
        reorderLevel: 50,
        status: 'Adequate'
      });
    }
  } catch (error) {
    console.error('Error updating inventory on purchase:', error);
  }
};

export const handleSalesInventoryDecrease = async (productName, quantity) => {
  try {
    const qty = Number(quantity);
    let product = await Product.findOne({ where: { name: productName } });
    if (product) {
      product.stock = Math.max(0, (product.stock || 0) - qty);
      if (product.stock === 0) {
        product.status = 'Out of Stock';
      } else if (product.stock < 20) {
        product.status = 'Low Stock';
      }
      await product.save();
    }

    let invItem = await InventoryItem.findOne({ where: { productName } });
    if (invItem) {
      invItem.quantity = Math.max(0, (invItem.quantity || 0) - qty);
      invItem.totalValue = invItem.quantity * (invItem.unitPrice || 0);
      invItem.status = invItem.quantity < invItem.reorderLevel ? 'Low Stock' : 'Adequate';
      await invItem.save();
    }
  } catch (error) {
    console.error('Error updating inventory on sale:', error);
  }
};
