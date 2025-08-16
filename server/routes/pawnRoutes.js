// server/routes/pawnRoutes.js
const express = require('express');
const router = express.Router();
const { getPawns, createPawn, updatePawn, deletePawn } = require('../controllers/pawnController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// router.use(protect);

router.route('/')
    .get(getPawns)
    .post(createPawn);

router.route('/:id')
    .put(updatePawn)
    .delete(deletePawn);

module.exports = router;