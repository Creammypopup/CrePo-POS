// server/controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const moment = require('moment');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');

    // Calculate today's sales
    const salesToday = await Sale.find({
        createdAt: { $gte: todayStart, $lte: todayEnd },
        // user: req.user.id // This can be enabled if sales are tied to the logged-in user
    });

    const totalSalesValue = salesToday.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalItemsSold = salesToday.reduce((acc, sale) => acc + sale.products.reduce((itemAcc, p) => itemAcc + p.quantity, 0), 0);

    // Get top selling products today
    const topProductsToday = await Sale.aggregate([
        { $match: { createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() } } },
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
        $expr: { $lte: [ "$stock", "$stockAlert" ] }, // Use stockAlert for comparison
        stockAlert: { $gt: 0 } // Only include products where stockAlert is set
    }).limit(5).select('name stock mainUnit');

    res.json({
        totalSalesValue,
        totalItemsSold,
        topProductsToday,
        lowStockProducts
    });
});

module.exports = {
    getDashboardStats,
};