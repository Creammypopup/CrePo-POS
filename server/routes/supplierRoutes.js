// server/routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getSuppliers)
    .post(createSupplier);

router.route('/:id')
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;