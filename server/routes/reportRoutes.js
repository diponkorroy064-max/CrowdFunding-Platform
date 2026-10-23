const express = require('express');
const router = express.Router();
const {
  createReport,
  getAdminReports
} = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifyAdmin } = require('../middlewares/roleMiddleware');

router.post('/reports', verifyToken, createReport);
router.get('/admin/reports', verifyToken, verifyAdmin, getAdminReports);

module.exports = router;
