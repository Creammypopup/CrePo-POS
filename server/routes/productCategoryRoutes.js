// server/routes/productCategoryRoutes.js
const express = require('express');
const router = express.Router();
// --- START OF EDIT ---
const { getProductCategories, createProductCategory, deleteProductCategory } = require('../controllers/productCategoryController');
// --- END OF EDIT ---
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getProductCategories).post(createProductCategory);

// --- START OF EDIT ---
router.route('/:id').delete(deleteProductCategory);
// --- END OF EDIT ---


module.exports = router;