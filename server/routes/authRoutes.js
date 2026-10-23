const express = require('express');
const router = express.Router();
const { generateJWT } = require('../controllers/authController');

// POST /jwt
router.post('/jwt', generateJWT);

module.exports = router;
