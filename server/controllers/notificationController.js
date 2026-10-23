const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

// Get notifications for user matching toEmail, sorted descending
const getNotifications = async (req, res) => {
  try {
    const { notificationsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    const notifications = await notificationsCollection
      .find({ toEmail: email })
      .sort({ time: -1 })
      .limit(20)
      .toArray();
    res.send(notifications);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { notificationsCollection } = getCollections();
    const { id } = req.params;
    const result = await notificationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead
};
