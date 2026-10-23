const express = require('express');
const router = express.Router();
const {
  getSupporterStats,
  getCreatorStats,
  getAdminStats
} = require('../controllers/statsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifySupporter, verifyCreator, verifyAdmin } = require('../middlewares/roleMiddleware');

// Dashboard stats routes
router.get('/supporter/stats/:email', verifyToken, verifySupporter, getSupporterStats);
router.get('/creator/stats/:email', verifyToken, verifyCreator, getCreatorStats);
router.get('/admin/stats', verifyToken, verifyAdmin, getAdminStats);

module.exports = router;
