const express = require('express');
const router = express.Router();
const {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.ACCOUNTING_VIEW), getExpenses)
    .post(authorize(PERMISSIONS.ACCOUNTING_MANAGE), createExpense);

router.route('/:id')
    .put(authorize(PERMISSIONS.ACCOUNTING_MANAGE), updateExpense)
    .delete(authorize(PERMISSIONS.ACCOUNTING_MANAGE), deleteExpense);

module.exports = router;