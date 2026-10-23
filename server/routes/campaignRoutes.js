const express = require('express');
const router = express.Router();
const {
  getTopFundedCampaigns,
  getExploreCampaigns,
  getCampaignById,
  createCampaign,
  getCreatorCampaigns,
  updateCampaign,
  deleteCampaign,
  getPendingCampaigns,
  updateCampaignStatus,
  getAdminCampaigns,
  deleteAdminCampaign,
  suspendCampaign
} = require('../controllers/campaignController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyAdmin, verifyCreator } = require('../middlewares/roleMiddleware');

// Public campaign routes
router.get('/campaigns/top-funded', getTopFundedCampaigns);
router.get('/campaigns/explore', getExploreCampaigns);
router.get('/campaigns/:id', getCampaignById);

// Creator campaign routes
router.post('/campaigns', verifyToken, verifyCreator, createCampaign);
router.get('/creator/campaigns/:email', verifyToken, verifyCreator, getCreatorCampaigns);
router.patch('/campaigns/:id', verifyToken, verifyCreator, updateCampaign);
router.delete('/campaigns/:id', verifyToken, verifyCreator, deleteCampaign);

// Admin campaign management routes
router.get('/admin/campaigns/pending', verifyToken, verifyAdmin, getPendingCampaigns);
router.patch('/admin/campaigns/:id/status', verifyToken, verifyAdmin, updateCampaignStatus);
router.get('/admin/campaigns', verifyToken, verifyAdmin, getAdminCampaigns);
router.delete('/admin/campaigns/:id', verifyToken, verifyAdmin, deleteAdminCampaign);
router.patch('/admin/campaigns/:id/suspend', verifyToken, verifyAdmin, suspendCampaign);

module.exports = router;
