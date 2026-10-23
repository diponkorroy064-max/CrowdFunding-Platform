const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');

// Save/Register user with default credits: Supporter=50, Creator=20, Admin=1000 (only once!)
const saveUser = async (req, res) => {
  try {
    const { usersCollection } = getCollections();
    const user = req.body;
    const email = user.email?.toLowerCase();
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.send({ message: 'User already exists in database', insertedId: null, user: existingUser });
    }

    // Default credits according to role
    let initialCredits = 0;
    const normalizedRole = user.role?.toLowerCase() || 'supporter';
    if (normalizedRole === 'supporter') {
      initialCredits = 50;
    } else if (normalizedRole === 'creator') {
      initialCredits = 20;
    } else if (normalizedRole === 'admin') {
      initialCredits = 1000;
    }

    const newUser = {
      name: user.name,
      email: email,
      photoURL: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: normalizedRole,
      credits: initialCredits,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    res.send({ ...result, user: newUser });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Get current user profile & role & credits
const getUserProfile = async (req, res) => {
  try {
    const { usersCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    if (req.decoded?.email?.toLowerCase() !== email) {
      return res.status(403).send({ message: 'Forbidden access to user data' });
    }
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const { usersCollection } = getCollections();
    const users = await usersCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Update user role
const updateUserRole = async (req, res) => {
  try {
    const { usersCollection } = getCollections();
    const { id } = req.params;
    const { role } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: { role: role.toLowerCase() }
    };
    const result = await usersCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { usersCollection } = getCollections();
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  saveUser,
  getUserProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
};
