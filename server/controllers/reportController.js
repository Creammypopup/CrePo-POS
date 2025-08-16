// server/controllers/reportController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Pawn = require('../models/Pawn');
const moment = require('moment');

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private
const getSalesReport = asyncHandler(async (req, res) => {
    // Temporarily return a dummy sales report
    res.json({
        sales: [
            { _id: 'sale1', createdAt: new Date(), customer: { name: 'Dummy Customer A' }, paymentMethod: 'cash', isDelivery: true, deliveryStatus: 'delivered', totalAmount: 1500, products: [{ product: { name: 'Product X', cost: 500 }, quantity: 1 }] },
            { _id: 'sale2', createdAt: new Date(), customer: { name: 'Dummy Customer B' }, paymentMethod: 'transfer', isDelivery: false, totalAmount: 2500, products: [{ product: { name: 'Product Y', cost: 1000 }, quantity: 1 }] },
        ],
        summary: {
            totalAmount: 4000,
            totalCost: 1500,
            totalProfit: 2500,
            totalTransactions: 2,
        }
    });
});

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort({ name: 1 });

    let totalStockValue = 0;
    let totalStockCost = 0;
    let totalItems = 0;

    products.forEach(p => {
        totalItems += p.stock;
        totalStockValue += (p.price || 0) * p.stock;
        totalStockCost += (p.cost || 0) * p.stock;
    });

    res.json({
        products,
        summary: { totalItems, totalStockValue, totalStockCost }
    });
});

// @desc    Get pawn report
// @route   GET /api/reports/pawn
// @access  Private
const getPawnReport = asyncHandler(async (req, res) => {
    const pawns = await Pawn.find({ user: req.user.id }).populate('customer', 'name').sort({ status: 1, endDate: 1 });
    
    const summary = {
        active: { count: 0, amount: 0 },
        redeemed: { count: 0, amount: 0 },
        expired: { count: 0, amount: 0 },
        forfeited: { count: 0, amount: 0 },
    };

    pawns.forEach(p => {
        if (summary[p.status]) {
            summary[p.status].count++;
            summary[p.status].amount += p.pawnAmount;
        }
    });

    res.json({ pawns, summary });
});

module.exports = { getSalesReport, getInventoryReport, getPawnReport };