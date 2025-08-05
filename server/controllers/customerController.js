// server/controllers/customerController.js
const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');

// @desc    Get all customers for a user
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(customers);
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('กรุณาใส่ชื่อลูกค้า');
    }

    const customer = await Customer.create({
        ...req.body,
        user: req.user.id,
    });
    res.status(201).json(customer);
});

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบข้อมูลลูกค้า');
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
     if (!customer || customer.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบข้อมูลลูกค้า');
    }
    await customer.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };