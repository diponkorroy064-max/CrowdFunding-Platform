const express = require('express');
const router = express.Router();
const {
  createWithdrawal,
  getCreatorWithdrawalHistory,
  getPendingWithdrawals,
  approveWithdrawalSuccess
} = require('../controllers/withdrawalController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyCreator, verifyAdmin } = require('../middlewares/roleMiddleware');

// Creator routes
router.post('/withdrawals', verifyToken, verifyCreator, createWithdrawal);
router.get('/creator/withdrawals/:email', verifyToken, verifyCreator, getCreatorWithdrawalHistory);

// Admin routes
router.get('/admin/withdrawals/pending', verifyToken, verifyAdmin, getPendingWithdrawals);
router.patch('/admin/withdrawals/:id/success', verifyToken, verifyAdmin, approveWithdrawalSuccess);

module.exports = router;
