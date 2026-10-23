const { getCollections } = require('../config/db');

async function createNotification({ message, toEmail, actionRoute }) {
  try {
    const { notificationsCollection } = getCollections();
    if (!notificationsCollection) return;
    const notification = {
      message,
      toEmail: toEmail?.toLowerCase(),
      actionRoute,
      isRead: false,
      time: new Date()
    };
    await notificationsCollection.insertOne(notification);
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
}

module.exports = { createNotification };
