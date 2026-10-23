const { getCollections } = require('../config/db');

// Supporter Stats: total contributions count, pending count, total approved contributed credits
const getSupporterStats = async (req, res) => {
  try {
    const { contributionsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const totalContributions = await contributionsCollection.countDocuments({ Supporter_email: email });
    const pendingContributions = await contributionsCollection.countDocuments({ Supporter_email: email, status: 'pending' });

    const approvedContributions = await contributionsCollection
      .find({ Supporter_email: email, status: 'approved' })
      .toArray();
    const totalContributedCredits = approvedContributions.reduce((sum, c) => sum + (c.Contribution_amount || 0), 0);

    res.send({
      totalContributions,
      pendingContributions,
      totalContributedCredits
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator Stats: total campaigns launched, active campaigns (deadline >= today), total amount raised across all campaigns
const getCreatorStats = async (req, res) => {
  try {
    const { campaignsCollection, withdrawalsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const today = new Date().toISOString().split('T')[0];

    const campaigns = await campaignsCollection.find({ creator_email: email }).toArray();
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.deadline >= today).length;
    const totalAmountRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

    // Also compute withdrawn and available credits
    const approvedWithdrawals = await withdrawalsCollection
      .find({ creator_email: email, status: 'approved' })
      .toArray();
    const totalWithdrawnCredits = approvedWithdrawals.reduce((sum, w) => sum + (w.withdrawal_credit || 0), 0);
    const availableCredits = Math.max(0, totalAmountRaised - totalWithdrawnCredits);

    res.send({
      totalCampaigns,
      activeCampaigns,
      totalAmountRaised,
      totalWithdrawnCredits,
      availableCredits
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin Stats: total supporters, total creators, sum of all users' credits, total payments processed
const getAdminStats = async (req, res) => {
  try {
    const { usersCollection, paymentsCollection } = getCollections();
    const totalSupporters = await usersCollection.countDocuments({ role: 'supporter' });
    const totalCreators = await usersCollection.countDocuments({ role: 'creator' });

    const users = await usersCollection.find().toArray();
    const totalAvailableCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);

    const payments = await paymentsCollection.find().toArray();
    const totalPaymentsProcessed = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);

    res.send({
      totalSupporters,
      totalCreators,
      totalAvailableCredits,
      totalPaymentsProcessed
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  getSupporterStats,
  getCreatorStats,
  getAdminStats
};
