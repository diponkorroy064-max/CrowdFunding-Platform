const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance = null;
let clientPromise = null;

async function connectDB() {
  if (dbInstance) return dbInstance;
  if (!clientPromise) {
    clientPromise = client.connect().then(() => {
      console.log("Successfully connected to MongoDB Atlas Cluster!");
      dbInstance = client.db(process.env.DB_NAME || "crowdspark_db");
      return dbInstance;
    }).catch(err => {
      clientPromise = null;
      console.error("MongoDB Atlas connection error:", error.message);
      throw err;
    });
  }
  await clientPromise;
  return dbInstance;
}

function getDB() {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
}

function getCollections() {
  const db = getDB();
  return {
    usersCollection: db.collection("users"),
    campaignsCollection: db.collection("campaigns"),
    contributionsCollection: db.collection("contributions"),
    withdrawalsCollection: db.collection("withdrawals"),
    paymentsCollection: db.collection("payments"),
    notificationsCollection: db.collection("notifications"),
    reportsCollection: db.collection("reports"),
  };
}

module.exports = { connectDB, getDB, getCollections, client };
