const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationRead
} = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/notifications/:email', verifyToken, getNotifications);
router.patch('/notifications/:id/read', verifyToken, markNotificationRead);

module.exports = router;
