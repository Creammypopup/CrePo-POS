// server/routes/quotationRoutes.js
const express = require('express');
const router = express.Router();
const { getQuotations, createQuotation } = require('../controllers/quotationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getQuotations).post(createQuotation);

module.exports = router;