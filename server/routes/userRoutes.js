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

router.post('/register', registerUser); // Public route for the first user, Admin can also use it
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// --- Admin Routes ---
router
  .route('/')
  .get(protect, authorize(PERMISSIONS.USERS_VIEW, PERMISSIONS.ADMIN), getUsers);

router
  .route('/:id')
  .get(protect, authorize(PERMISSIONS.USERS_VIEW, PERMISSIONS.ADMIN), getUserById)
  .put(protect, authorize(PERMISSIONS.USERS_MANAGE, PERMISSIONS.ADMIN), updateUser)
  .delete(protect, authorize(PERMISSIONS.USERS_MANAGE, PERMISSIONS.ADMIN), deleteUser);

module.exports = router;