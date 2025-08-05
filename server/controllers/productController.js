// server/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products for a user
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product && product.user.toString() === req.user.id) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
    // --- START OF EDIT ---
    const { name, category, price, cost, hasMultipleSizes, sizes } = req.body;

    // Enhanced validation
    if (!name || !category) {
        res.status(400);
        throw new Error('กรุณาระบุชื่อสินค้าและหมวดหมู่');
    }

    if (hasMultipleSizes) {
        if (!sizes || sizes.length === 0) {
            res.status(400);
            throw new Error('กรุณาระบุขนาดสำหรับสินค้าหลายขนาด');
        }
    } else {
        if (price === undefined || cost === undefined) {
            res.status(400);
            throw new Error('กรุณาระบุราคาขายและราคาทุนสำหรับสินค้าปกติ');
        }
    }
    // --- END OF EDIT ---

    const product = await Product.create({
        ...req.body,
        user: req.user.id,
    });

    res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await product.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};