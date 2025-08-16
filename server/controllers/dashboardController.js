const asyncHandler = require('../middleware/asyncHandler.js');
const Product = require('../models/Product.js');
// สมมติว่าเราจะมี Model เหล่านี้ในอนาคต
// const Sale = require('../models/Sale');
// const Customer = require('../models/Customer');
const moment = require('moment');

const getDashboardStats = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'Dummy dashboard stats response' });
});

module.exports = { getDashboardStats };