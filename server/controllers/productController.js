// server/controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user.id })
        .populate('linkedFreebies.product', 'name')
        .sort({ createdAt: -1 });
    res.status(200).json(products);
});

const findProductByBarcode = asyncHandler(async (req, res) => {
    const { barcode } = req.params;
    const product = await Product.findOne({ user: req.user.id, barcode: barcode });
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'ไม่พบสินค้าจากบาร์โค้ดนี้' });
    }
});

// Other functions (create, update, delete) remain but need to handle new fields
const createProduct = asyncHandler(async (req, res) => {
    // ... logic to handle new fields like allowNegativeStock, pricePerKg, linkedFreebies
    const product = await Product.create({
        ...req.body,
        user: req.user.id,
    });
    res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product || product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    await product.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = {
    getProducts,
    findProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct,
};