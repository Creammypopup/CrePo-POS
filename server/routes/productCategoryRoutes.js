// server/routes/productCategoryRoutes.js
const express = require('express');
const router = express.Router();
const { getProductCategories, createProductCategory } = require('../controllers/productCategoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getProductCategories).post(createProductCategory);

module.exports = router;