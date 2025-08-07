// server/routes/pawnRoutes.js
const express = require('express');
const router = express.Router();
const { getPawns, createPawn, updatePawn, deletePawn } = require('../controllers/pawnController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

router.use(protect);

router.route('/')
    .get(authorize(PERMISSIONS.PAWN_VIEW), getPawns)
    .post(authorize(PERMISSIONS.PAWN_MANAGE), createPawn);

router.route('/:id')
    .put(authorize(PERMISSIONS.PAWN_MANAGE), updatePawn)
    .delete(authorize(PERMISSIONS.PAWN_MANAGE), deletePawn);

module.exports = router;