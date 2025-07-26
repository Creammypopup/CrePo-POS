const express = require('express');
const router = express.Router();
const {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ทุก Route ในนี้ต้อง Login ก่อน
router.use(protect);

// อนุญาตให้ 'admin' และ 'manager' (สมมติว่ามี) เข้าถึงได้
// ถ้าต้องการให้ทุกคนเข้าถึงได้ ให้ใช้แค่ protect
router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.route('/:id')
    .put(updateExpense)
    .delete(deleteExpense);

module.exports = router;