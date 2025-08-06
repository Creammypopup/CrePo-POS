// server/controllers/purchaseOrderController.js
const asyncHandler = require('express-async-handler');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');

// @desc    Create a new purchase order (receive stock)
// @route   POST /api/purchase-orders
// @access  Private
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplier, items, totalCost, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ');
  }

  const purchaseOrder = new PurchaseOrder({
    user: req.user.id,
    supplier,
    items,
    totalCost,
    notes,
  });

  const createdPurchaseOrder = await purchaseOrder.save();

  // --- Update product stock ---
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
      $set: { cost: item.cost, expiryDate: item.expiryDate } // Also update the main product's cost/expiry for simplicity for now
    });
  }

  res.status(201).json(createdPurchaseOrder);
});

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
const getPurchaseOrders = asyncHandler(async (req, res) => {
    const purchaseOrders = await PurchaseOrder.find({ user: req.user.id })
        .populate('supplier', 'name')
        .populate('items.product', 'name')
        .sort({ orderDate: -1 });
    res.json(purchaseOrders);
});

module.exports = { createPurchaseOrder, getPurchaseOrders };