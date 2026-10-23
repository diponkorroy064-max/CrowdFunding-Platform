const express = require('express');
const router = express.Router();
const {
  createContribution,
  getCreatorContributions,
  approveContribution,
  rejectContribution,
  getSupporterApprovedContributions,
  getSupporterContributions
} = require('../controllers/contributionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifySupporter, verifyCreator } = require('../middlewares/roleMiddleware');

// Supporter contribution routes
router.post('/contributions', verifyToken, verifySupporter, createContribution);
router.get('/supporter/contributions/approved/:email', verifyToken, verifySupporter, getSupporterApprovedContributions);
router.get('/supporter/contributions/:email', verifyToken, verifySupporter, getSupporterContributions);

// Creator contribution review routes
router.get('/creator/contributions/:email', verifyToken, verifyCreator, getCreatorContributions);
router.patch('/creator/contributions/:id/approve', verifyToken, verifyCreator, approveContribution);
router.patch('/creator/contributions/:id/reject', verifyToken, verifyCreator, rejectContribution);

module.exports = router;
