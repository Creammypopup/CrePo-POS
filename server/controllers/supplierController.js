// server/controllers/supplierController.js
const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

// @desc    Get all suppliers for a user
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(suppliers);
});

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private
const createSupplier = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('กรุณาใส่ชื่อผู้จำหน่าย');
    }

    const supplier = await Supplier.create({
        ...req.body,
        user: req.user.id,
    });
    res.status(201).json(supplier);
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier || supplier.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบผู้จำหน่าย');
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedSupplier);
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);
     if (!supplier || supplier.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบผู้จำหน่าย');
    }
    await supplier.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };