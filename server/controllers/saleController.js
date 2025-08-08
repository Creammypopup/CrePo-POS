const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Shift = require('../models/Shift');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const {
    customerId,
    products: saleProducts,
    subTotal,
    discountType,
    discountValue,
    discountAmount,
    totalAmount,
    paymentMethod,
    shiftId,
  } = req.body;

  if (!saleProducts || saleProducts.length === 0) {
    res.status(400);
    throw new Error('ไม่มีสินค้าในรายการขาย');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update product stock for each item in the cart
    for (const item of saleProducts) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`ไม่พบสินค้า ID: ${item.productId}`);

      if (item.sizeId) {
        const size = product.sizes.id(item.sizeId);
        if (!size) throw new Error(`ไม่พบขนาดสินค้า ID: ${item.sizeId}`);
        size.stock -= item.quantity;
      } else {
        product.stock -= item.quantity;
      }
      await product.save({ session });
    }

    // 2. Create the sale document
    const sale = new Sale({
      user: req.user.id,
      shift: shiftId,
      customer: customerId,
      products: saleProducts.map(p => ({ ...p, name: p.name || 'N/A' })), // Ensure name is present
      subTotal,
      discountType,
      discountValue,
      discountAmount,
      totalAmount,
      paymentMethod,
    });
    const createdSale = await sale.save({ session });

    // 3. Update shift totals
    if (shiftId) {
      await Shift.findByIdAndUpdate(shiftId, { $inc: { totalSales: totalAmount } }, { session });
    }

    await session.commitTransaction();
    res.status(201).json(createdSale);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: `การสร้างรายการขายล้มเหลว: ${error.message}` });
  } finally {
    session.endSession();
  }
});

// Placeholder functions
const getSales = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get all sales' });
});
const getSaleById = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Get sale by ID' });
});
const deleteSale = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Delete sale' });
});

module.exports = { createSale, getSales, getSaleById, deleteSale };