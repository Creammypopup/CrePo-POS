// server/controllers/productCategoryController.js
const asyncHandler = require('express-async-handler');
const ProductCategory = require('../models/ProductCategory');

const getProductCategories = asyncHandler(async (req, res) => {
    const categories = await ProductCategory.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(categories);
});

const createProductCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Please provide a category name');
    }
    const categoryExists = await ProductCategory.findOne({ user: req.user.id, name });
    if (categoryExists) {
        res.status(400);
        throw new Error(`Category "${name}" already exists.`);
    }
    const category = await ProductCategory.create({ user: req.user.id, name });
    res.status(201).json(category);
});

// --- START OF EDIT ---
const deleteProductCategory = asyncHandler(async (req, res) => {
    const category = await ProductCategory.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    if (category.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await category.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = { getProductCategories, createProductCategory, deleteProductCategory };
// --- END OF EDIT ---