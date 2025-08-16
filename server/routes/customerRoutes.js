// server/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

router.route('/')
    .get(getCustomers)
    .post(createCustomer);

router.route('/:id')
    .put(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;