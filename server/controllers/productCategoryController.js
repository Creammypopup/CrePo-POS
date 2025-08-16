const asyncHandler = require('express-async-handler');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');

// @desc    Get all product categories
// @route   GET /api/product-categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  // Temporarily return dummy product categories
  res.status(200).json([
    { _id: 'cat1', name: 'Electronics' },
    { _id: 'cat2', name: 'Home Goods' },
    { _id: 'cat3', name: 'Books' },
  ]);
});

// @desc    Create a category
// @route   POST /api/product-categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('กรุณาระบุชื่อหมวดหมู่');
  }

  const category = await ProductCategory.create({
    name,
    user: req.user.id,
  });

  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/product-categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await ProductCategory.findById(req.params.id);

  if (!category || category.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error('ไม่พบหมวดหมู่');
  }

  // ป้องกันการลบหมวดหมู่ที่ถูกใช้งานแล้ว
  const productInUse = await Product.findOne({ category: req.params.id });
  if (productInUse) {
    res.status(400);
    throw new Error('ไม่สามารถลบได้ เนื่องจากมีสินค้าใช้หมวดหมู่นี้อยู่');
  }

  await category.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = { getCategories, createCategory, deleteCategory };