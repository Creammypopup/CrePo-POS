// server/routes/pawnRoutes.js
const express = require('express');
const router = express.Router();
const { getPawns, createPawn, updatePawn, deletePawn } = require('../controllers/pawnController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getPawns).post(createPawn);
router.route('/:id').put(updatePawn).delete(deletePawn);

module.exports = router;