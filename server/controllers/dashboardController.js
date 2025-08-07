// server/controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Pawn = require('../models/Pawn');
const moment = require('moment');

const getDashboardStats = asyncHandler(async (req, res) => {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();
    const thirtyDaysFromNow = moment().add(30, 'days').toDate();

    const salesToday = await Sale.find({ user: req.user.id, createdAt: { $gte: todayStart, $lte: todayEnd } });
    const totalSalesValue = salesToday.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalItemsSold = salesToday.reduce((acc, sale) => acc + sale.products.length, 0);

    const topProductsToday = await Sale.aggregate([
        { $match: { user: req.user._id, createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $unwind: '$products' },
        { $group: { _id: '$products.product', totalQuantity: { $sum: '$products.quantity' } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'productDetails' } },
        { $unwind: '$productDetails' },
        { $project: { name: '$productDetails.name', totalQuantity: 1 } }
    ]);

    const allProducts = await Product.find({ user: req.user.id });
    const lowStockProducts = [];
    allProducts.forEach(p => {
        if (p.hasMultipleSizes) {
            p.sizes.forEach(size => {
                if (p.stockAlert > 0 && size.stock <= p.stockAlert) {
                    lowStockProducts.push({ _id: `${p._id}-${size._id}`, name: `${p.name} - ${size.name}`, stock: size.stock, mainUnit: p.mainUnit });
                }
            });
        } else {
            if (p.stockAlert > 0 && p.stock <= p.stockAlert) {
                lowStockProducts.push(p);
            }
        }
    });

    const expiringProducts = [];
    allProducts.forEach(p => {
        if (p.expiryDate && moment(p.expiryDate).isBefore(thirtyDaysFromNow)) {
            expiringProducts.push(p);
        }
    });

    const overduePawns = await Pawn.find({ user: req.user.id, status: 'active', endDate: { $lt: new Date() } }).populate('customer', 'name').limit(5);
    
    const pendingDeliveries = await Sale.find({ user: req.user.id, isDelivery: true, deliveryStatus: { $in: ['pending', 'preparing', 'shipping'] } }).populate('customer', 'name').sort({ createdAt: 1 }).limit(5);

    res.json({
        totalSalesValue,
        totalItemsSold,
        topProductsToday,
        lowStockProducts: lowStockProducts.slice(0, 5), // Limit to 5 for the widget
        expiringProducts: expiringProducts.slice(0, 5),
        overduePawns,
        pendingDeliveries,
    });
});

module.exports = { getDashboardStats };