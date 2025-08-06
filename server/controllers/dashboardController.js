// server/controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Pawn = require('../models/Pawn'); // <-- ADD THIS LINE
const moment = require('moment');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');
    const thirtyDaysFromNow = moment().add(30, 'days').toDate(); // For expiry check

    // Calculate today's sales
    const salesToday = await Sale.find({
        createdAt: { $gte: todayStart, $lte: todayEnd },
        user: req.user.id
    });

    const totalSalesValue = salesToday.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalItemsSold = salesToday.reduce((acc, sale) => acc + sale.products.reduce((itemAcc, p) => itemAcc + p.quantity, 0), 0);

    // Get top selling products today
    const topProductsToday = await Sale.aggregate([
        { $match: { user: req.user._id, createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() } } },
        { $unwind: '$products' },
        { $group: { 
            _id: '$products.product', 
            totalQuantity: { $sum: '$products.quantity' } 
        }},
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: '$productDetails' },
        { $project: { name: '$productDetails.name', totalQuantity: 1 } }
    ]);

    // Get low stock products using the custom stockAlert field
    const lowStockProducts = await Product.find({
        user: req.user.id,
        $expr: { $lte: [ "$stock", "$stockAlert" ] },
        stockAlert: { $gt: 0 }
    }).limit(5).select('name stock mainUnit');

    // --- START OF NEW CODE ---
    // Get products expiring soon (within 30 days)
    const expiringProducts = await Product.find({
        user: req.user.id,
        expiryDate: { $ne: null, $lte: thirtyDaysFromNow }
    }).limit(5).select('name expiryDate');

    // Get overdue pawns
    const overduePawns = await Pawn.find({
        user: req.user.id,
        status: 'active',
        endDate: { $lt: new Date() }
    }).populate('customer', 'name').limit(5).select('productName customer endDate');
    // --- END OF NEW CODE ---


    res.json({
        totalSalesValue,
        totalItemsSold,
        topProductsToday,
        lowStockProducts,
        expiringProducts, // <-- Add this
        overduePawns,     // <-- Add this
    });
});

module.exports = {
    getDashboardStats,
};