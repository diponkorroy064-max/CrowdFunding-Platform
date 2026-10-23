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

async function connectDB() {
  if (dbInstance) return dbInstance;
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas Cluster!");
    dbInstance = client.db(process.env.DB_NAME || "crowdspark_db");
    return dbInstance;
  } catch (error) {
    console.error("MongoDB Atlas connection error:", error.message);
    throw error;
  }
}

function getDB() {
  if (!dbInstance) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return dbInstance;
}

module.exports = { connectDB, getDB, client };
