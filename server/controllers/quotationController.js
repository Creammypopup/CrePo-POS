// server/controllers/quotationController.js
const asyncHandler = require('express-async-handler');
const Quotation = require('../models/Quotation');

const getQuotations = asyncHandler(async (req, res) => {
    const quotations = await Quotation.find({ user: req.user.id }).populate('customer', 'name').sort({ createdAt: -1 });
    res.json(quotations);
});

const { nanoid } = require('nanoid'); // Import nanoid for unique ID generation

const createQuotation = asyncHandler(async (req, res) => {
    const { customer, products, subTotal, discountAmount, totalAmount, notes, validUntil } = req.body;

    // Generate a unique quotationId (e.g., Q-YYYYMMDD-XXXX)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomId = nanoid(6).toUpperCase(); // 6-character random string
    const quotationId = `Q-${year}${month}${day}-${randomId}`;

    // Generate a unique approvalToken
    const approvalToken = nanoid(32); // 32-character token

    const quotation = new Quotation({
        user: req.user.id,
        customer,
        quotationId,
        products,
        subTotal,
        discountAmount,
        totalAmount,
        notes,
        validUntil,
        approvalToken, // Save the generated token
    });

    const createdQuotation = await quotation.save();
    res.status(201).json(createdQuotation);
});

const getQuotationById = asyncHandler(async (req, res) => {
    const quotation = await Quotation.findById(req.params.id)
        .populate('customer', 'name email phone')
        .populate('products.product', 'name sku barcode image'); // Populate product details

    if (quotation) {
        // Ensure the user owns the quotation or is an admin
        if (quotation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('ไม่ได้รับอนุญาตให้เข้าถึงใบเสนอราคานี้');
        }
        res.json(quotation);
    } else {
        res.status(404);
        throw new Error('ไม่พบใบเสนอราคา');
    }
});

module.exports = { getQuotations, createQuotation, getQuotationById };