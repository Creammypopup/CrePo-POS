// server/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.CONTACTS_VIEW), getCustomers)
    .post(authorize(PERMISSIONS.CONTACTS_MANAGE), createCustomer);

router.route('/:id')
    .put(authorize(PERMISSIONS.CONTACTS_MANAGE), updateCustomer)
    .delete(authorize(PERMISSIONS.CONTACTS_MANAGE), deleteCustomer);

module.exports = router;