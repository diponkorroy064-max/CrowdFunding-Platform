const { getDB, connectDB } = require('../config/db');

const verifyAdmin = async (req, res, next) => {
  try {
    let db;
    try {
      db = getDB();
    } catch {
      db = await connectDB();
    }
    const email = req.decoded?.email;
    const user = await db.collection('users').findOne({ email: email?.toLowerCase() });
    if (user?.role !== 'admin') {
      return res.status(403).send({ error: true, message: 'Forbidden access. Admin role required.' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

const verifyCreator = async (req, res, next) => {
  try {
    let db;
    try {
      db = getDB();
    } catch {
      db = await connectDB();
    }
    const email = req.decoded?.email;
    const user = await db.collection('users').findOne({ email: email?.toLowerCase() });
    if (user?.role !== 'creator' && user?.role !== 'admin') {
      return res.status(403).send({ error: true, message: 'Forbidden access. Creator role required.' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

const verifySupporter = async (req, res, next) => {
  try {
    let db;
    try {
      db = getDB();
    } catch {
      db = await connectDB();
    }
    const email = req.decoded?.email;
    const user = await db.collection('users').findOne({ email: email?.toLowerCase() });
    if (user?.role !== 'supporter' && user?.role !== 'admin') {
      return res.status(403).send({ error: true, message: 'Forbidden access. Supporter role required.' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = { verifyAdmin, verifyCreator, verifySupporter };
