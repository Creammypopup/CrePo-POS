const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController.js');
const { protect, authorize } = require('../middleware/authMiddleware.js');
const { PERMISSIONS } = require('../utils/permissions.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- Admin Routes ---
router
  .route('/')
  .get(protect, authorize(PERMISSIONS.ADMIN), getUsers);

router
  .route('/:id')
  .get(protect, authorize(PERMISSIONS.ADMIN), getUserById)
  .put(protect, authorize(PERMISSIONS.ADMIN), updateUser)
  .delete(protect, authorize(PERMISSIONS.ADMIN), deleteUser);
module.exports = router;