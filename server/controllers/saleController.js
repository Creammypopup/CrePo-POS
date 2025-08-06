// server/controllers/saleController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Shift = require('../models/Shift');

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
const createSale = asyncHandler(async (req, res) => {
  const { 
    customerId, products, paymentMethod, totalAmount,
    isDelivery, deliveryFee, deliveryAddress, recipientName, recipientPhone 
  } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'ต้องมีสินค้าอย่างน้อย 1 รายการ' });
  }
  if (!paymentMethod) {
    return res.status(400).json({ message: 'กรุณาระบุวิธีการชำระเงิน' });
  }

  const currentShift = await Shift.findOne({ user: req.user.id, status: 'open' });
  if (!currentShift) {
    return res.status(400).json({ message: 'ไม่พบกะการขายที่เปิดอยู่ กรุณาเปิดกะก่อน' });
  }

  const productUpdates = [];
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`ไม่พบสินค้า ID: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`สินค้า '${product.name}' มีไม่พอ (คงเหลือ: ${product.stock})`);
    }
    product.stock -= item.quantity;
    productUpdates.push(product.save());
  }
  
  await Promise.all(productUpdates);

  const sale = new Sale({
    user: req.user.id,
    shift: currentShift._id,
    customer: customerId || null,
    products: products.map(p => ({
        product: p.productId,
        quantity: p.quantity,
        priceAtSale: p.priceAtSale
    })),
    totalAmount,
    paymentMethod,
    isDelivery,
    deliveryFee,
    deliveryAddress,
    recipientName,
    recipientPhone,
  });

  const createdSale = await sale.save();
  res.status(201).json(createdSale);
});

// @desc    Get all sales for the user
// @route   GET /api/sales
// @access  Private
const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({ user: req.user.id })
      .populate('customer', 'name')
      .populate('products.product', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
});

// @desc    Get single sale by ID
// @route   GET /api/sales/:id
// @access  Private
const getSaleById = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id)
        .populate('customer', 'name')
        .populate('products.product', 'name');
    
    if (sale && sale.user.toString() === req.user.id) {
        res.json(sale);
    } else {
        res.status(404);
        throw new Error('ไม่พบการขาย');
    }
});

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
// @access  Private
const deleteSale = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id);

    if (!sale || sale.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบการขาย');
    }
    // Optional: Add logic here to return stock if a sale is deleted
    await sale.deleteOne();
    res.json({ id: req.params.id });
});

module.exports = {
  createSale,
  getSales,
  getSaleById,
  deleteSale,
};