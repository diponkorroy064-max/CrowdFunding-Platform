const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/uploadMiddleware');
const { handleImageUpload } = require('../controllers/uploadController');

// POST /upload
router.post('/upload', upload.single('image'), handleImageUpload);

module.exports = router;
