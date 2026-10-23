const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function seed() {
  if (!uri) {
    console.error("No MONGODB_URI found in environment.");
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas for initial seeding...");
    const db = client.db(process.env.DB_NAME || "crowdspark_db");

    // 1. Initial Users
    const usersCollection = db.collection("users");
    const demoUsers = [
      {
        name: "Diponkor Roy (Admin)",
        email: "admin@crowdspark.com",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        role: "admin",
        credits: 1000,
        createdAt: new Date()
      },
      {
        name: "SolarAid Collective",
        email: "creator@crowdspark.com",
        photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        role: "creator",
        credits: 20,
        createdAt: new Date()
      },
      {
        name: "Priya Sharma",
        email: "supporter@crowdspark.com",
        photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
        role: "supporter",
        credits: 50,
        createdAt: new Date()
      }
    ];

    for (const u of demoUsers) {
      await usersCollection.updateOne(
        { email: u.email },
        { $setOnInsert: u },
        { upsert: true }
      );
    }
    console.log("Seeded initial demo users.");

    // 2. Initial Campaigns (Top Funded & Approved)
    const campaignsCollection = db.collection("campaigns");
    const demoCampaigns = [
      {
        campaign_title: "EcoFlow: Community Solar Clean Water Pumps",
        campaign_story: "Installing solar-powered brushless water pumps with IoT telemetry in remote drought-stricken agricultural communities to provide perpetual clean drinking water.",
        category: "Community",
        funding_goal: 5000,
        minimum_Contribution: 10,
        deadline: "2026-12-31",
        reward_info: "Digital backer badge & live GPS telemetry report access.",
        campaign_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        creator_name: "SolarAid Collective",
        creator_email: "creator@crowdspark.com",
        amount_raised: 4500,
        status: "approved",
        createdAt: new Date()
      },
      {
        campaign_title: "Aura Next-Gen Open Source Robotics Kit",
        campaign_story: "Affordable modular robotic platforms for high-school STEM curricula with visual block programming and real-world micro-actuators.",
        category: "Technology",
        funding_goal: 4000,
        minimum_Contribution: 25,
        deadline: "2026-11-20",
        reward_info: "Open-source CAD blueprints & firmware repository access.",
        campaign_image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        creator_name: "Dr. Evelyn Vance",
        creator_email: "evelyn@tech.org",
        amount_raised: 3800,
        status: "approved",
        createdAt: new Date()
      },
      {
        campaign_title: "Chronicles of Earth: Environmental Graphic Novel",
        campaign_story: "A 200-page hand-illustrated speculative fiction graphic novel portraying regeneration of marine and rainforest ecosystems.",
        category: "Creative",
        funding_goal: 3000,
        minimum_Contribution: 15,
        deadline: "2026-12-15",
        reward_info: "Digital art book & personalized backer dedication page.",
        campaign_image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        creator_name: "Studio Lumina",
        creator_email: "creator@crowdspark.com",
        amount_raised: 2900,
        status: "approved",
        createdAt: new Date()
      },
      {
        campaign_title: "Smart AgTech: Low-Cost Drip Irrigation for Small Farmers",
        campaign_story: "Solar-automated low pressure drip irrigation lines with soil moisture probes, reducing farm water consumption by 65%.",
        category: "Technology",
        funding_goal: 3500,
        minimum_Contribution: 20,
        deadline: "2026-11-30",
        reward_info: "Annual harvest update & sensor dashboard invite.",
        campaign_image_url: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80",
        creator_name: "Tariq Rahman",
        creator_email: "tariq@agri.com",
        amount_raised: 2400,
        status: "approved",
        createdAt: new Date()
      },
      {
        campaign_title: "HeartBeat: Portable Pediatric Cardiac Monitor",
        campaign_story: "Handheld Bluetooth electrocardiogram designed specifically for rural clinic health workers in developing nations.",
        category: "Healthcare",
        funding_goal: 2500,
        minimum_Contribution: 10,
        deadline: "2026-12-25",
        reward_info: "Clinical field test progress journal.",
        campaign_image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
        creator_name: "BioMed Innovators",
        creator_email: "biomed@health.org",
        amount_raised: 2100,
        status: "approved",
        createdAt: new Date()
      },
      {
        campaign_title: "Heritage Revive: Traditional Artisan Weaving Guild",
        campaign_story: "Supporting indigenous women weavers with natural organic dyes, sustainable looms, and fair-trade global export channels.",
        category: "Creative",
        funding_goal: 2000,
        minimum_Contribution: 10,
        deadline: "2026-12-10",
        reward_info: "Handwoven commemorative bookmark.",
        campaign_image_url: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
        creator_name: "Craft Heritage Alliance",
        creator_email: "heritage@craft.org",
        amount_raised: 1950,
        status: "approved",
        createdAt: new Date()
      }
    ];

    for (const c of demoCampaigns) {
      await campaignsCollection.updateOne(
        { campaign_title: c.campaign_title },
        { $setOnInsert: c },
        { upsert: true }
      );
    }
    console.log("Seeded top-funded campaigns.");

    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await client.close();
  }
}

seed();
