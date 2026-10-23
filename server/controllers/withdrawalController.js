const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { createNotification } = require('../utils/notification');

// Creator: Submit Withdrawal Request
// Business logic: 20 Credits = $1. Minimum 200 credits ($10). Cannot exceed total raised credits.
const createWithdrawal = async (req, res) => {
  try {
    const { campaignsCollection, withdrawalsCollection } = getCollections();
    const {
      creator_email,
      creator_name,
      withdrawal_credit,
      payment_system,
      account_number
    } = req.body;

    const creditNum = Number(withdrawal_credit);
    const email = creator_email?.toLowerCase();

    if (creditNum < 200) {
      return res.status(400).send({ message: 'Minimum withdrawal is 200 credits ($10).' });
    }

    // Check creator's total raised credits
    const campaigns = await campaignsCollection.find({ creator_email: email }).toArray();
    const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

    // Check already withdrawn or pending credits
    const existingWithdrawals = await withdrawalsCollection.find({
      creator_email: email,
      status: { $in: ['pending', 'approved'] }
    }).toArray();
    const totalWithdrawn = existingWithdrawals.reduce((sum, w) => sum + (w.withdrawal_credit || 0), 0);
    const availableToWithdraw = totalRaised - totalWithdrawn;

    if (creditNum > availableToWithdraw) {
      return res.status(400).send({ message: `Insufficient raised credits. Available to withdraw: ${availableToWithdraw} credits.` });
    }

    const withdrawAmountDollars = creditNum / 20;

    const newWithdrawal = {
      creator_email: email,
      creator_name,
      withdrawal_credit: creditNum,
      withdrawal_amount: withdrawAmountDollars,
      payment_system,
      account_number,
      withdraw_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date()
    };

    const result = await withdrawalsCollection.insertOne(newWithdrawal);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Payment History (all withdrawal payments made to creator)
const getCreatorWithdrawalHistory = async (req, res) => {
  try {
    const { withdrawalsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const history = await withdrawalsCollection
      .find({ creator_email: email })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(history);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: View pending withdrawal requests
const getPendingWithdrawals = async (req, res) => {
  try {
    const { withdrawalsCollection } = getCollections();
    const pendingWithdrawals = await withdrawalsCollection
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(pendingWithdrawals);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Mark withdrawal Payment Success
const approveWithdrawalSuccess = async (req, res) => {
  try {
    const { withdrawalsCollection } = getCollections();
    const { id } = req.params;
    const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) });
    if (!withdrawal) {
      return res.status(404).send({ message: 'Withdrawal not found' });
    }

    const result = await withdrawalsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'approved', approvedAt: new Date() } }
    );

    // Notify Creator
    await createNotification({
      message: `Your withdrawal request of $${withdrawal.withdrawal_amount} (${withdrawal.withdrawal_credit} credits) was processed successfully!`,
      toEmail: withdrawal.creator_email,
      actionRoute: "/dashboard/withdrawals"
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  createWithdrawal,
  getCreatorWithdrawalHistory,
  getPendingWithdrawals,
  approveWithdrawalSuccess
};
