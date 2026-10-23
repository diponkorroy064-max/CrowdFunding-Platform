const express = require('express');
const router = express.Router();
const {
  saveUser,
  getUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/roleMiddleware');

// Public / Register
router.post('/users', saveUser);

// User Profile
router.get('/users/:email', verifyToken, getUserProfile);

// Admin User Management
router.get('/admin/users', verifyToken, verifyAdmin, getAllUsers);
router.patch('/admin/users/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.delete('/admin/users/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;
