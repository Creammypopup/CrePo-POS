// server/controllers/quotationController.js
const asyncHandler = require('express-async-handler');
const Quotation = require('../models/Quotation');

const getQuotations = asyncHandler(async (req, res) => {
    const quotations = await Quotation.find({ user: req.user.id }).populate('customer', 'name').sort({ createdAt: -1 });
    res.json(quotations);
});

const createQuotation = asyncHandler(async (req, res) => {
    // Logic to create a new quotation
    // For now, a placeholder:
    res.status(201).json({ message: 'Quotation created placeholder' });
});

module.exports = { getQuotations, createQuotation };