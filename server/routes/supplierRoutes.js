const express = require('express');
const router = express.Router();
const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const { PERMISSIONS } = require('../utils/permissions.js');

router.use(protect);

router.route('/')
  .get(authorize(PERMISSIONS.SUPPLIERS_VIEW), getSuppliers)
  .post(authorize(PERMISSIONS.SUPPLIERS_MANAGE), createSupplier);

router.route('/:id')
  .get(authorize(PERMISSIONS.SUPPLIERS_VIEW), getSupplierById)
  .put(authorize(PERMISSIONS.SUPPLIERS_MANAGE), updateSupplier)
  .delete(authorize(PERMISSIONS.SUPPLIERS_MANAGE), deleteSupplier);

module.exports = router;