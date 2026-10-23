const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { createNotification } = require('../utils/notification');

// Supporter: Make a contribution to a campaign
const createContribution = async (req, res) => {
  try {
    const { usersCollection, contributionsCollection } = getCollections();
    const {
      campaign_id,
      campaign_title,
      Contribution_amount,
      Supporter_email,
      Supporter_name,
      creator_name,
      creator_email
    } = req.body;

    const amount = Number(Contribution_amount);
    const supporterEmail = Supporter_email?.toLowerCase();

    // Check supporter credits
    const supporter = await usersCollection.findOne({ email: supporterEmail });
    if (!supporter || supporter.credits < amount) {
      return res.status(400).send({ message: 'Insufficient available credits.' });
    }

    // Deduct credits immediately on contribution pledge
    await usersCollection.updateOne(
      { email: supporterEmail },
      { $inc: { credits: -amount } }
    );

    const newContribution = {
      campaign_id,
      campaign_title,
      Contribution_amount: amount,
      Supporter_email: supporterEmail,
      Supporter_name,
      creator_name,
      creator_email: creator_email?.toLowerCase(),
      current_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date()
    };

    const result = await contributionsCollection.insertOne(newContribution);

    // Notify the creator
    await createNotification({
      message: `${Supporter_name} contributed ${amount} credits to "${campaign_title}". Review pending.`,
      toEmail: creator_email,
      actionRoute: "/dashboard/creator-home"
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Contributions To Review (status === 'pending')
const getCreatorContributions = async (req, res) => {
  try {
    const { contributionsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const contributions = await contributionsCollection
      .find({ creator_email: email, status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(contributions);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Approve Contribution
const approveContribution = async (req, res) => {
  try {
    const { contributionsCollection, campaignsCollection } = getCollections();
    const { id } = req.params;
    const contrib = await contributionsCollection.findOne({ _id: new ObjectId(id) });
    if (!contrib) {
      return res.status(404).send({ message: 'Contribution not found' });
    }

    // Add Contribution amount to the campaign's raised amount
    await campaignsCollection.updateOne(
      { _id: new ObjectId(contrib.campaign_id) },
      { $inc: { amount_raised: Number(contrib.Contribution_amount) } }
    );

    // Change status to approved
    const result = await contributionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'approved', approvedAt: new Date() } }
    );

    // Notify supporter
    await createNotification({
      message: `Your Contribution of ${contrib.Contribution_amount} credits to ${contrib.campaign_title} was approved by ${contrib.creator_name}`,
      toEmail: contrib.Supporter_email,
      actionRoute: "/dashboard/supporter-home"
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Reject Contribution (refund contribution amount back to supporter's credits)
const rejectContribution = async (req, res) => {
  try {
    const { contributionsCollection, usersCollection } = getCollections();
    const { id } = req.params;
    const contrib = await contributionsCollection.findOne({ _id: new ObjectId(id) });
    if (!contrib) {
      return res.status(404).send({ message: 'Contribution not found' });
    }

    // Refund to supporter
    await usersCollection.updateOne(
      { email: contrib.Supporter_email?.toLowerCase() },
      { $inc: { credits: Number(contrib.Contribution_amount) } }
    );

    // Change status to rejected
    const result = await contributionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'rejected', rejectedAt: new Date() } }
    );

    // Notify supporter
    await createNotification({
      message: `Your Contribution of ${contrib.Contribution_amount} credits to ${contrib.campaign_title} was rejected by ${contrib.creator_name} and refunded to your credits.`,
      toEmail: contrib.Supporter_email,
      actionRoute: "/dashboard/supporter-home"
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Supporter: Approved contributions
const getSupporterApprovedContributions = async (req, res) => {
  try {
    const { contributionsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const approved = await contributionsCollection
      .find({ Supporter_email: email, status: 'approved' })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(approved);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Supporter: My Contributions with Pagination
const getSupporterContributions = async (req, res) => {
  try {
    const { contributionsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await contributionsCollection.countDocuments({ Supporter_email: email });
    const contributions = await contributionsCollection
      .find({ Supporter_email: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      contributions
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  createContribution,
  getCreatorContributions,
  approveContribution,
  rejectContribution,
  getSupporterApprovedContributions,
  getSupporterContributions
};
