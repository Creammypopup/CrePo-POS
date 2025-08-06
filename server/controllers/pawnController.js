// server/controllers/pawnController.js
const asyncHandler = require('express-async-handler');
const Pawn = require('../models/Pawn');

// @desc    Get all pawn tickets
// @route   GET /api/pawns
// @access  Private
const getPawns = asyncHandler(async (req, res) => {
    const pawns = await Pawn.find({ user: req.user.id }).populate('customer', 'name').sort({ createdAt: -1 });
    res.json(pawns);
});

// @desc    Create a pawn ticket
// @route   POST /api/pawns
// @access  Private
const createPawn = asyncHandler(async (req, res) => {
    const { customer, productName, pawnAmount, endDate } = req.body;
    if (!customer || !productName || !pawnAmount || !endDate) {
        res.status(400);
        throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
    }
    const pawn = new Pawn({ ...req.body, user: req.user.id });
    const createdPawn = await pawn.save();
    res.status(201).json(createdPawn);
});

// @desc    Update a pawn ticket (e.g., redeem, extend)
// @route   PUT /api/pawns/:id
// @access  Private
const updatePawn = asyncHandler(async (req, res) => {
    const pawn = await Pawn.findById(req.params.id);

    if (!pawn || pawn.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบรายการรับฝาก');
    }

    const updatedPawn = await Pawn.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customer', 'name');
    res.status(200).json(updatedPawn);
});

// @desc    Delete a pawn ticket
// @route   DELETE /api/pawns/:id
// @access  Private
const deletePawn = asyncHandler(async (req, res) => {
    const pawn = await Pawn.findById(req.params.id);

    if (!pawn || pawn.user.toString() !== req.user.id) {
        res.status(404);
        throw new Error('ไม่พบรายการรับฝาก');
    }

    await pawn.deleteOne();
    res.status(200).json({ id: req.params.id });
});


module.exports = { getPawns, createPawn, updatePawn, deletePawn };