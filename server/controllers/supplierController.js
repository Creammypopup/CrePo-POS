const Supplier = require('../models/Supplier.js');
const asyncHandler = require('../middleware/asyncHandler.js');

// @desc    Get all suppliers
// @route   GET /api/suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({});
  res.json(suppliers);
});

// @desc    Get supplier by ID
// @route   GET /api/suppliers/:id
const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) return res.json(supplier);
  res.status(404);
  throw new Error('ไม่พบผู้จัดจำหน่าย');
});

// @desc    Create a supplier
// @route   POST /api/suppliers
const createSupplier = asyncHandler(async (req, res) => {
  if (!req.body.name || req.body.name.trim() === '') {
    res.status(400);
    throw new Error('กรุณากรอกชื่อซัพพลายเออร์');
  }
  const supplier = new Supplier({ ...req.body, user: req.user._id });
  const createdSupplier = await supplier.save();
  res.status(201).json(createdSupplier);
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) {
    if (req.body.name !== undefined && req.body.name.trim() === '') {
      res.status(400);
      throw new Error('ชื่อซัพพลายเออร์ห้ามว่าง');
    }
    Object.assign(supplier, req.body);
    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้จัดจำหน่าย');
  }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) {
    await Supplier.deleteOne({ _id: supplier._id });
    res.status(200).json({ message: 'ลบผู้จัดจำหน่ายเรียบร้อยแล้ว' });
  } else {
    res.status(404);
    throw new Error('ไม่พบผู้จัดจำหน่าย');
  }
});

module.exports = { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };