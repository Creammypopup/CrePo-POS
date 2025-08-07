const express = require('express');
const router = express.Router();
const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// Protect all routes in this file, ensuring user is logged in
router.use(protect);

// Now, apply specific permission checks for each route
router.route('/')
  .get(authorize(PERMISSIONS.SETTINGS_MANAGE_ROLES), getRoles)
  .post(authorize(PERMISSIONS.SETTINGS_MANAGE_ROLES), createRole);

router.route('/:id')
  .put(authorize(PERMISSIONS.SETTINGS_MANAGE_ROLES), updateRole)
  .delete(authorize(PERMISSIONS.SETTINGS_MANAGE_ROLES), deleteRole);

module.exports = router;