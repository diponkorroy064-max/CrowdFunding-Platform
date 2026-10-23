const { getCollections } = require('../config/db');
const { createNotification } = require('../utils/notification');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = require('stripe')(stripeSecretKey);

// Create Stripe Payment Intent
const createPaymentIntent = async (req, res) => {
  const { price } = req.body;
  const amountInCents = Math.round(Number(price) * 100);

  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      // Dummy client secret for development if Stripe key not provided yet
      return res.send({ clientSecret: `dummy_secret_for_test_${Date.now()}` });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card']
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Record credit purchase payment and increase supporter's credits
const purchaseCredit = async (req, res) => {
  try {
    const { paymentsCollection, usersCollection } = getCollections();
    const {
      user_email,
      user_name,
      credits_purchased,
      amount_paid,
      transaction_id,
      payment_method
    } = req.body;

    const credits = Number(credits_purchased);
    const email = user_email?.toLowerCase();

    // Save payment
    const paymentDoc = {
      user_email: email,
      user_name,
      credits_purchased: credits,
      amount_paid: Number(amount_paid),
      transaction_id: transaction_id || `TXN_${Date.now()}`,
      payment_method: payment_method || 'Stripe',
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    };

    const paymentResult = await paymentsCollection.insertOne(paymentDoc);

    // Increase supporter credits
    await usersCollection.updateOne(
      { email },
      { $inc: { credits: credits } }
    );

    // Create Notification
    await createNotification({
      message: `You successfully purchased ${credits} credits for $${amount_paid}!`,
      toEmail: email,
      actionRoute: "/dashboard/purchase-credit"
    });

    res.send(paymentResult);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Supporter: Payment history
const getSupporterPaymentHistory = async (req, res) => {
  try {
    const { paymentsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const payments = await paymentsCollection
      .find({ user_email: email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(payments);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  purchaseCredit,
  getSupporterPaymentHistory
};
