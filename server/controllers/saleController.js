// server/controllers/saleController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Shift = require('../models/Shift');
const StockMovement = require('../models/StockMovement');
const Customer = require('../models/Customer');

const createSale = asyncHandler(async (req, res) => {
  const { 
    customerId, products, paymentMethod, subTotal,
    discountType, discountValue, discountAmount, totalAmount
  } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: 'ต้องมีสินค้าอย่างน้อย 1 รายการ' });
  }

  const currentShift = await Shift.findOne({ user: req.user.id, status: 'open' });
  if (!currentShift) {
    return res.status(400).json({ message: 'ไม่พบกะการขายที่เปิดอยู่ กรุณาเปิดกะก่อน' });
  }

  const stockUpdates = [];
  const stockMovements = [];

  for (const item of products) {
    if (item.productType === 'service') continue;

    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`ไม่พบสินค้า ID: ${item.productId}`);
    
    let quantityToDeduct = item.quantity;
    
    if (item.unitAtSale && item.unitAtSale !== product.mainUnit) {
        const sellingUnit = product.sellingUnits.find(u => u.name === item.unitAtSale);
        if (sellingUnit?.conversionRate) {
            quantityToDeduct = item.quantity * sellingUnit.conversionRate;
        }
    }

    if (item.sizeId) {
        const size = product.sizes.id(item.sizeId);
        if (size.stock < quantityToDeduct && !product.allowNegativeStock) {
            throw new Error(`สินค้า '${product.name} - ${size.name}' มีไม่พอ`);
        }
        size.stock -= quantityToDeduct;
    } else {
        if (product.stock < quantityToDeduct && !product.allowNegativeStock) {
            throw new Error(`สินค้า '${product.name}' มีไม่พอ`);
        }
        product.stock -= quantityToDeduct;
    }

    stockUpdates.push(product.save());
    stockMovements.push({
        user: req.user.id,
        product: product._id,
        sizeId: item.sizeId || null,
        type: 'sale',
        quantity: -quantityToDeduct,
        cost: item.costAtSale,
        reference: null
    });
  }
  
  await Promise.all(stockUpdates);

  const sale = new Sale({
    user: req.user.id,
    shift: currentShift._id,
    customer: customerId === 'walk-in' ? null : customerId,
    products,
    subTotal,
    discountType,
    discountValue,
    discountAmount,
    totalAmount,
    paymentMethod,
    isDelivery: req.body.isDelivery,
    deliveryStatus: req.body.isDelivery ? 'pending' : undefined,
  });

  const createdSale = await sale.save();
  
  if (customerId && customerId !== 'walk-in') {
    const customer = await Customer.findById(customerId);
    if (customer) {
        products.forEach(item => {
            const historyIndex = customer.priceHistory.findIndex(h => 
                h.product.toString() === item.productId && h.sizeId === item.sizeId
            );
            if (historyIndex > -1) {
                customer.priceHistory[historyIndex].lastPrice = item.priceAtSale;
            } else {
                customer.priceHistory.push({
                    product: item.productId,
                    sizeId: item.sizeId,
                    lastPrice: item.priceAtSale
                });
            }
        });
        await customer.save();
    }
  }

  for (const movement of stockMovements) {
      movement.reference = createdSale._id;
  }
  await StockMovement.insertMany(stockMovements);

  res.status(201).json(createdSale);
});

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({ user: req.user.id })
      .populate('customer', 'name')
      .populate('products.product', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(sales);
});

const getSaleById = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id)
        .populate('customer', 'name')
        .populate({ path: 'products.product', model: 'Product'});
    
    if (sale && sale.user.toString() === req.user.id) {
        res.json(sale);
    } else {
        res.status(404);
        throw new Error('ไม่พบการขาย');
    }
});

const deleteSale = asyncHandler(async (req, res) => {
    const sale = await Sale.findById(req.params.id);
    if (!sale || sale.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบการขาย');
    }
    await sale.deleteOne();
    await StockMovement.deleteMany({ reference: sale._id, type: 'sale' });
    res.json({ id: req.params.id });
});

module.exports = { createSale, getSales, getSaleById, deleteSale }; // <-- FIX: Added deleteSale