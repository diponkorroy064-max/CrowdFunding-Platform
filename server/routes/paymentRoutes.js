const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  purchaseCredit,
  getSupporterPaymentHistory
} = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { verifySupporter } = require('../middlewares/roleMiddleware');

// Stripe payment intent
router.post('/create-payment-intent', verifyToken, createPaymentIntent);

// Credit purchase
router.post('/payments/purchase-credit', verifyToken, verifySupporter, purchaseCredit);

// Supporter payment history
router.get('/supporter/payments/:email', verifyToken, verifySupporter, getSupporterPaymentHistory);

module.exports = router;
