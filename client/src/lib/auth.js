import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

const clientInstance = await clientPromise;
const db = clientInstance.db(process.env.DB_NAME || "crowdspark_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET || "crowdspark_super_secret_better_auth_key_2026",
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5005",
    "https://*.vercel.app"
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "supporter",
        input: true,
      },
      credits: {
        type: "number",
        required: false,
        defaultValue: 50,
        input: true,
      },
      photoURL: {
        type: "string",
        required: false,
        defaultValue: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        input: true,
      }
    },
  },
});
