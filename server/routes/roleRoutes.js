const express = require('express');
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

const { protect, authorize } = require('../middleware/authMiddleware');

// ทุกเส้นทางในนี้ต้องเป็น Admin เท่านั้น
router.use(protect, authorize('admin'));

router.route('/').get(getRoles).post(createRole);
router.route('/:id').put(updateRole).delete(deleteRole);

module.exports = router;
