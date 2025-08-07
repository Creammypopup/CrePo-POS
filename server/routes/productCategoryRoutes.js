// server/routes/productCategoryRoutes.js
const express = require('express');
const router = express.Router();
const { getProductCategories, createProductCategory, deleteProductCategory } = require('../controllers/productCategoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.PRODUCTS_VIEW), getProductCategories)
    .post(authorize(PERMISSIONS.PRODUCTS_MANAGE), createProductCategory);

router.route('/:id').delete(authorize(PERMISSIONS.PRODUCTS_MANAGE), deleteProductCategory);

module.exports = router;