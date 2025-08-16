// server/controllers/shiftController.js
const asyncHandler = require('express-async-handler');
const Shift = require('../models/Shift');
const Sale = require('../models/Sale');

// @desc    Get current open shift for the logged-in user
// @route   GET /api/shifts/current
// @access  Private
const getCurrentShift = asyncHandler(async (req, res) => {
    // Return null to indicate no active shift, which should trigger the open shift modal
    res.status(200).json(null);
});

// @desc    Open a new shift
// @route   POST /api/shifts/open
// @access  Private
const openShift = asyncHandler(async (req, res) => {
    const { startAmount } = req.body;
    // Temporarily return a dummy response for a newly opened shift
    res.status(201).json({
        _id: 'dummyShiftId',
        user: 'dummyUserId',
        startAmount: parseFloat(startAmount),
        shiftNumber: 1,
        status: 'open',
        createdAt: new Date(),
    });
});

// @desc    Close a shift
// @route   POST /api/shifts/close
// @access  Private
const closeShift = asyncHandler(async (req, res) => {
    const { endAmount } = req.body;
    const shift = await Shift.findOne({ user: req.user.id, status: 'open' });

    if (!shift) {
        res.status(404);
        throw new Error('ไม่พบกะที่กำลังเปิดใช้งานอยู่');
    }

    // Calculate sales during this specific shift
    const sales = await Sale.find({ shift: shift._id });

    let cashSales = 0;
    let transferSales = 0;
    let creditSales = 0;

    sales.forEach(sale => {
        if (sale.paymentMethod === 'cash') {
            cashSales += sale.totalAmount;
        } else if (sale.paymentMethod === 'transfer') {
            transferSales += sale.totalAmount;
        } else if (sale.paymentMethod === 'credit') {
            creditSales += sale.totalAmount;
        }
    });

    const totalSales = cashSales + transferSales + creditSales;

    shift.endTime = Date.now();
    shift.status = 'closed';
    shift.endAmount = parseFloat(endAmount);
    shift.totalSales = totalSales;
    shift.cashSales = cashSales;
    shift.transferSales = transferSales;
    shift.creditSales = creditSales;
    shift.cashInDrawer = shift.startAmount + cashSales;
    shift.cashDifference = shift.endAmount - shift.cashInDrawer;
    
    const closedShift = await shift.save();
    res.json(closedShift);
});


module.exports = { getCurrentShift, openShift, closeShift };