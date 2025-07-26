const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
});

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
    const { date, description, category, amount, vendor } = req.body;

    if (!description || !category || !amount) {
        res.status(400);
        throw new Error('กรุณากรอกข้อมูลที่จำเป็น: รายละเอียด, หมวดหมู่, และจำนวนเงิน');
    }

    const expense = await Expense.create({
        user: req.user.id,
        date,
        description,
        category,
        amount,
        vendor,
    });

    res.status(201).json(expense);
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('ไม่พบรายการค่าใช้จ่าย');
    }

    // ตรวจสอบว่าเป็นเจ้าของรายการหรือไม่
    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('ไม่ได้รับอนุญาต');
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedExpense);
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('ไม่พบรายการค่าใช้จ่าย');
    }

    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('ไม่ได้รับอนุญาต');
    }

    await expense.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
};