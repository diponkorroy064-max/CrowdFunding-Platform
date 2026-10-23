const { getCollections } = require('../config/db');

// Supporter: Report campaign
const createReport = async (req, res) => {
  try {
    const { reportsCollection } = getCollections();
    const { campaign_id, campaign_title, reporter_name, reporter_email, reason } = req.body;
    const newReport = {
      campaign_id,
      campaign_title,
      reporter_name,
      reporter_email: reporter_email?.toLowerCase(),
      reason,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      createdAt: new Date()
    };
    const result = await reportsCollection.insertOne(newReport);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: View all reported campaigns
const getAdminReports = async (req, res) => {
  try {
    const { reportsCollection } = getCollections();
    const reports = await reportsCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(reports);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  createReport,
  getAdminReports
};
