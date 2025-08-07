// server/routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.CONTACTS_VIEW), getSuppliers)
    .post(authorize(PERMISSIONS.CONTACTS_MANAGE), createSupplier);

router.route('/:id')
    .put(authorize(PERMISSIONS.CONTACTS_MANAGE), updateSupplier)
    .delete(authorize(PERMISSIONS.CONTACTS_MANAGE), deleteSupplier);

module.exports = router;