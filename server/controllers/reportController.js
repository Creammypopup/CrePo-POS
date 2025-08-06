// server/controllers/reportController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
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
    .populate('products.product', 'name cost') // Populate cost for profit calculation
    .sort({ createdAt: -1 });
    
    // Calculate summary
    let totalAmount = 0;
    let totalCost = 0;

    sales.forEach(sale => {
        totalAmount += sale.totalAmount;
        sale.products.forEach(item => {
            // Ensure product and cost data exist
            if (item.product && typeof item.product.cost === 'number' && typeof item.quantity === 'number') {
                totalCost += item.product.cost * item.quantity;
            }
        });
    });

    const totalProfit = totalAmount - totalCost;

    res.json({
        sales,
        summary: {
            totalAmount,
            totalCost,
            totalProfit,
            totalTransactions: sales.length,
        }
    });
});

module.exports = { getSalesReport };