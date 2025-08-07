const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../utils/permissions');

// Public route for login
router.post('/login', loginUser);

// All subsequent routes are protected and require login
router.use(protect);

// Route for a user to get their own details
router.get('/me', getMe);

// Routes for managing users, requires specific permission
router.route('/')
  .get(authorize(PERMISSIONS.SETTINGS_MANAGE_USERS), getUsers)
  .post(authorize(PERMISSIONS.SETTINGS_MANAGE_USERS), registerUser); // Renamed from /register

router.route('/:id')
  .put(authorize(PERMISSIONS.SETTINGS_MANAGE_USERS), updateUser)
  .delete(authorize(PERMISSIONS.SETTINGS_MANAGE_USERS), deleteUser);

module.exports = router;
