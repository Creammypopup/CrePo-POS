const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe,
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route
router.post('/login', loginUser);

// Admin-only routes
router.use(protect, authorize('admin'));

router.route('/')
    .get(getUsers);

// This route is now only for admins to create new users
router.route('/register')
    .post(registerUser);

router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

// Private route for logged-in user
router.get('/me', protect, getMe);

module.exports = router;
