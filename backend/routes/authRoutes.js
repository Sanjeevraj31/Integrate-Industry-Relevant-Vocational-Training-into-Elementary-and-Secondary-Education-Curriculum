const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, updateUserStatus, getAllUsers, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin-only operations
router.get('/users', protect, authorize('Super Admin'), getAllUsers);
router.put('/users/:id/status', protect, authorize('Super Admin'), updateUserStatus);
router.delete('/users/:id', protect, authorize('Super Admin'), deleteUser);

module.exports = router;
