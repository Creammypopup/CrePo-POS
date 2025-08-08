const asyncHandler = require('../middleware/asyncHandler.js');
const Product = require('../models/Product.js');
// สมมติว่าเราจะมี Model เหล่านี้ในอนาคต
// const Sale = require('../models/Sale');
// const Customer = require('../models/Customer');
const moment = require('moment');

const getDashboardStats = asyncHandler(async (req, res) => {
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    // *** ข้อมูลชั่วคราว - เราจะแทนที่ด้วยข้อมูลจริงในเฟสถัดไป ***
    const totalSalesValue = 12500; // ยอดขายวันนี้
    const totalItemsSold = 15; // จำนวนสินค้าที่ขาย
    const totalCustomers = 5; // จำนวนลูกค้า

    const allProducts = await Product.find({});
    const lowStockProducts = allProducts.filter(p => {
        if (p.variants && p.variants.length > 0) {
            return p.variants.some(variant => variant.quantity <= variant.reorderPoint && variant.reorderPoint > 0);
        }
        return p.quantity <= p.reorderPoint && p.reorderPoint > 0;
    }).slice(0, 5); // แสดงแค่ 5 รายการ

    // ข้อมูลสมมติสำหรับกราฟ
    const topProductsToday = [
        { name: 'ท่อ PVC 6 หุน', totalQuantity: 5 },
        { name: 'ปูนซีเมนต์', totalQuantity: 3 },
        { name: 'ทรายหยาบ', totalQuantity: 2 },
    ];

    res.json({
        totalSalesValue,
        totalItemsSold,
        totalCustomers,
        topProductsToday,
        lowStockProducts,
        // เพิ่มข้อมูลเปล่าสำหรับส่วนอื่นๆ ที่ยังไม่สร้าง
        expiringProducts: [],
        overduePawns: [],
        pendingDeliveries: [],
    });
});

module.exports = { getDashboardStats };