// server/controllers/quotationController.js
const asyncHandler = require('express-async-handler');
const Quotation = require('../models/Quotation');
const { nanoid } = require('nanoid');

const getQuotations = asyncHandler(async (req, res) => {
    const quotations = await Quotation.find({ user: req.user.id }).populate('customer', 'name').sort({ createdAt: -1 });
    res.json(quotations);
});

const createQuotation = asyncHandler(async (req, res) => {
    const { customer, products, subTotal, discountAmount, totalAmount, notes, validUntil } = req.body;
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomId = nanoid(6).toUpperCase();
    const quotationId = `Q-${year}${month}${day}-${randomId}`;
    const approvalToken = nanoid(32);

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
        approvalToken,
    });

    const createdQuotation = await quotation.save();
    res.status(201).json(createdQuotation);
});

const getQuotationById = asyncHandler(async (req, res) => {
    const quotation = await Quotation.findById(req.params.id)
        .populate('customer', 'name email phone')
        .populate('products.product', 'name sku barcode image');
    if (!quotation) {
        res.status(404);
        throw new Error('ไม่พบใบเสนอราคา');
    }
    if (quotation.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('ไม่ได้รับอนุญาตให้เข้าถึงใบเสนอราคานี้');
    }
    res.json(quotation);
});

const updateQuotationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['draft', 'sent', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('สถานะไม่ถูกต้อง');
  }
  const quotation = await Quotation.findById(req.params.id);
  if (!quotation) {
    res.status(404);
    throw new Error('ไม่พบใบเสนอราคา');
  }
  if (quotation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('ไม่ได้รับอนุญาตให้อัปเดตใบเสนอราคานี้');
  }
  quotation.status = status;
  const updatedQuotation = await quotation.save();
  res.json(updatedQuotation);
});

const getQuotationByToken = asyncHandler(async (req, res) => {
  const quotation = await Quotation.findOne({ approvalToken: req.params.token })
    .populate('customer', 'name email phone')
    .populate('products.product', 'name description');
  if (!quotation) {
    res.status(404);
    throw new Error('ไม่พบใบเสนอราคา');
  }
  if (quotation.status !== 'sent') {
      res.status(400);
      throw new Error('ใบเสนอราคานี้ไม่สามารถดำเนินการได้ในขณะนี้');
  }
  res.json(quotation);
});

const handleApprovalAction = asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!['accepted', 'rejected'].includes(action)) {
    res.status(400);
    throw new Error('การดำเนินการไม่ถูกต้อง');
  }
  const quotation = await Quotation.findOne({ approvalToken: req.params.token });
  if (!quotation) {
    res.status(404);
    throw new Error('ไม่พบใบเสนอราคา');
  }
  if (quotation.status !== 'sent') {
      res.status(400);
      throw new Error('ไม่สามารถดำเนินการกับใบเสนอราคานี้ได้');
  }
  quotation.status = action;
  quotation.approvalToken = null; 
  await quotation.save();
  res.json({ message: `ขอบคุณสำหรับกาตอบกลับ ใบเสนอราคาได้ถูก ${action === 'accepted' ? 'อนุมัติ' : 'ปฏิเสธ'} เรียบร้อยแล้ว` });
});

module.exports = { 
    getQuotations, 
    createQuotation, 
    getQuotationById, 
    updateQuotationStatus, 
    getQuotationByToken, 
    handleApprovalAction 
};