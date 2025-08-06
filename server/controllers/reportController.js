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
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        res.status(400);
        throw new Error('กรุณาระบุช่วงวันที่เริ่มต้นและสิ้นสุด');
    }

    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    const sales = await Sale.find({
        user: req.user.id,
        createdAt: { $gte: start, $lte: end },
    })
    .populate('customer', 'name')
    .populate('products.product', 'name cost')
    .sort({ createdAt: -1 });
    
    let totalAmount = 0;
    let totalCost = 0;
    sales.forEach(sale => {
        totalAmount += sale.totalAmount;
        sale.products.forEach(item => {
            if (item.product && typeof item.product.cost === 'number' && typeof item.quantity === 'number') {
                totalCost += item.product.cost * item.quantity;
            }
        });
    });

    res.json({
        sales,
        summary: {
            totalAmount,
            totalCost,
            totalProfit: totalAmount - totalCost,
            totalTransactions: sales.length,
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