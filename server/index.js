const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = require('stripe')(stripeSecretKey);

const app = express();
const port = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

// File filter: accept all image MIME types (jpg, png, jpeg, webp, gif, svg, avif, etc.)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif, svg, etc.) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CLIENT_URL || '*'
  ],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploads folder as static files
app.use('/uploads', express.static(uploadDir));

// MongoDB Client Initialization
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let usersCollection;
let campaignsCollection;
let contributionsCollection;
let withdrawalsCollection;
let paymentsCollection;
let notificationsCollection;
let reportsCollection;

// JWT Token Verification Middleware
const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'Unauthorized access. Token not provided.' });
  }

  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'crowdspark_super_secret_jwt_key_2026_secure', (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'Unauthorized access. Token invalid or expired.' });
    }
    req.decoded = decoded;
    next();
  });
};

// Role-Based Verification Middlewares
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;
    const query = { email: email?.toLowerCase() };
    const user = await usersCollection.findOne(query);
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
    const email = req.decoded?.email;
    const query = { email: email?.toLowerCase() };
    const user = await usersCollection.findOne(query);
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
    const email = req.decoded?.email;
    const query = { email: email?.toLowerCase() };
    const user = await usersCollection.findOne(query);
    if (user?.role !== 'supporter' && user?.role !== 'admin') {
      return res.status(403).send({ error: true, message: 'Forbidden access. Supporter role required.' });
    }
    next();
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Helper: Create Notification
async function createNotification({ message, toEmail, actionRoute }) {
  try {
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

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");

    db = client.db(process.env.DB_NAME || "crowdspark_db");
    usersCollection = db.collection("users");
    campaignsCollection = db.collection("campaigns");
    contributionsCollection = db.collection("contributions");
    withdrawalsCollection = db.collection("withdrawals");
    paymentsCollection = db.collection("payments");
    notificationsCollection = db.collection("notifications");
    reportsCollection = db.collection("reports");

    /* ==============================================================
       0. IMAGE UPLOAD ENDPOINT (MULTER)
       ============================================================== */

    // Upload any image (jpg, jpeg, png, webp, gif, svg, avif) and convert to accessible URL
    app.post('/upload', upload.single('image'), (req, res) => {
      if (!req.file) {
        return res.status(400).send({ error: true, message: 'No image file uploaded.' });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      res.send({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    });

    /* ==============================================================
       1. AUTH & JWT ENDPOINTS
       ============================================================== */

    // Generate JWT Token
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET || 'crowdspark_super_secret_jwt_key_2026_secure', {
        expiresIn: '7d'
      });
      res.send({ token });
    });

    /* ==============================================================
       2. USER MANAGEMENT ENDPOINTS
       ============================================================== */

    // Save/Register user with default credits: Supporter=50, Creator=20 (only once!)
    app.post('/users', async (req, res) => {
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
    });

    // Get current user profile & role & credits
    app.get('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      if (req.decoded.email?.toLowerCase() !== email) {
        return res.status(403).send({ message: 'Forbidden access to user data' });
      }
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.send(user);
    });

    // Admin: Get all users
    app.get('/admin/users', verifyToken, verifyAdmin, async (req, res) => {
      const users = await usersCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(users);
    });

    // Admin: Update user role
    app.patch('/admin/users/:id/role', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const { role } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: { role: role.toLowerCase() }
      };
      const result = await usersCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Admin: Delete user
    app.delete('/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    /* ==============================================================
       3. CAMPAIGNS ENDPOINTS (Public, Creator, Supporter, Admin)
       ============================================================== */

    // Public / Home: Top 6 Funded Campaigns (raised maximum amount of credits)
    app.get('/campaigns/top-funded', async (req, res) => {
      const topCampaigns = await campaignsCollection
        .find({ status: 'approved' })
        .sort({ amount_raised: -1 })
        .limit(6)
        .toArray();
      res.send(topCampaigns);
    });

    // Supporter / Public: Explore campaigns (status === 'approved' and deadline not passed)
    app.get('/campaigns/explore', async (req, res) => {
      const { category, search, sort } = req.query;
      const today = new Date().toISOString().split('T')[0];

      let query = {
        status: 'approved',
        deadline: { $gte: today }
      };

      if (category && category !== 'All') {
        query.category = category;
      }

      if (search) {
        query.campaign_title = { $regex: search, $options: 'i' };
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'raised-desc') sortOptions = { amount_raised: -1 };
      if (sort === 'raised-asc') sortOptions = { amount_raised: 1 };
      if (sort === 'deadline') sortOptions = { deadline: 1 };

      const campaigns = await campaignsCollection.find(query).sort(sortOptions).toArray();
      res.send(campaigns);
    });

    // Get single campaign details
    app.get('/campaigns/:id', async (req, res) => {
      const { id } = req.params;
      try {
        const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) });
        if (!campaign) {
          return res.status(404).send({ message: 'Campaign not found' });
        }
        res.send(campaign);
      } catch (err) {
        res.status(400).send({ message: 'Invalid campaign ID' });
      }
    });

    // Creator: Add new campaign (status: 'pending')
    app.post('/campaigns', verifyToken, verifyCreator, async (req, res) => {
      const campaignData = req.body;
      const newCampaign = {
        campaign_title: campaignData.campaign_title,
        campaign_story: campaignData.campaign_story,
        category: campaignData.category,
        funding_goal: Number(campaignData.funding_goal),
        minimum_Contribution: Number(campaignData.minimum_Contribution || 1),
        deadline: campaignData.deadline,
        reward_info: campaignData.reward_info,
        campaign_image_url: campaignData.campaign_image_url,
        creator_name: campaignData.creator_name,
        creator_email: campaignData.creator_email?.toLowerCase(),
        amount_raised: 0,
        status: 'pending',
        createdAt: new Date()
      };

      const result = await campaignsCollection.insertOne(newCampaign);
      res.send(result);
    });

    // Creator: Get my campaigns (ordered descending based on deadline)
    app.get('/creator/campaigns/:email', verifyToken, verifyCreator, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      if (req.decoded.email?.toLowerCase() !== email) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      const campaigns = await campaignsCollection
        .find({ creator_email: email })
        .sort({ deadline: -1 })
        .toArray();
      res.send(campaigns);
    });

    // Creator: Update campaign (title, campaign_story, reward_info)
    app.patch('/campaigns/:id', verifyToken, verifyCreator, async (req, res) => {
      const { id } = req.params;
      const { campaign_title, campaign_story, reward_info } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          campaign_title,
          campaign_story,
          reward_info,
          updatedAt: new Date()
        }
      };
      const result = await campaignsCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Creator: Delete campaign (Refund all approved supporters of that campaign their contributions credits!)
    app.delete('/campaigns/:id', verifyToken, verifyCreator, async (req, res) => {
      const { id } = req.params;
      const campaignFilter = { _id: new ObjectId(id) };

      // Find all approved contributions for this campaign to refund
      const approvedContributions = await contributionsCollection.find({
        campaign_id: id,
        status: 'approved'
      }).toArray();

      // Refund each supporter
      for (const contrib of approvedContributions) {
        await usersCollection.updateOne(
          { email: contrib.Supporter_email?.toLowerCase() },
          { $inc: { credits: Number(contrib.Contribution_amount) } }
        );

        // Notify supporter of refund
        await createNotification({
          message: `Campaign "${contrib.campaign_title}" was deleted. Your contribution of ${contrib.Contribution_amount} credits has been refunded.`,
          toEmail: contrib.Supporter_email,
          actionRoute: "/dashboard/my-contributions"
        });
      }

      // Mark or delete contributions
      await contributionsCollection.deleteMany({ campaign_id: id });

      // Delete the campaign
      const result = await campaignsCollection.deleteOne(campaignFilter);
      res.send(result);
    });

    // Admin: Get all pending campaigns for approval
    app.get('/admin/campaigns/pending', verifyToken, verifyAdmin, async (req, res) => {
      const pendingCampaigns = await campaignsCollection
        .find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(pendingCampaigns);
    });

    // Admin: Approve or Reject campaign
    app.patch('/admin/campaigns/:id/status', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const { status } = req.body; // 'approved' | 'rejected'
      const filter = { _id: new ObjectId(id) };
      const campaign = await campaignsCollection.findOne(filter);

      if (!campaign) {
        return res.status(404).send({ message: 'Campaign not found' });
      }

      const result = await campaignsCollection.updateOne(filter, {
        $set: { status, reviewedAt: new Date() }
      });

      // Notify the creator
      await createNotification({
        message: `Your campaign "${campaign.campaign_title}" was ${status} by Admin.`,
        toEmail: campaign.creator_email,
        actionRoute: "/dashboard/my-campaigns"
      });

      res.send(result);
    });

    // Admin: Manage Campaigns (all campaigns list)
    app.get('/admin/campaigns', verifyToken, verifyAdmin, async (req, res) => {
      const allCampaigns = await campaignsCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(allCampaigns);
    });

    // Admin: Delete campaign
    app.delete('/admin/campaigns/:id', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const result = await campaignsCollection.deleteOne(filter);
      res.send(result);
    });

    /* ==============================================================
       4. CONTRIBUTIONS ENDPOINTS (Supporter & Creator)
       ============================================================== */

    // Supporter: Make a contribution to a campaign
    app.post('/contributions', verifyToken, verifySupporter, async (req, res) => {
      const {
        campaign_id,
        campaign_title,
        Contribution_amount,
        Supporter_email,
        Supporter_name,
        creator_name,
        creator_email
      } = req.body;

      const amount = Number(Contribution_amount);
      const supporterEmail = Supporter_email?.toLowerCase();

      // Check supporter credits
      const supporter = await usersCollection.findOne({ email: supporterEmail });
      if (!supporter || supporter.credits < amount) {
        return res.status(400).send({ message: 'Insufficient available credits.' });
      }

      // Deduct credits immediately on contribution pledge
      await usersCollection.updateOne(
        { email: supporterEmail },
        { $inc: { credits: -amount } }
      );

      const newContribution = {
        campaign_id,
        campaign_title,
        Contribution_amount: amount,
        Supporter_email: supporterEmail,
        Supporter_name,
        creator_name,
        creator_email: creator_email?.toLowerCase(),
        current_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdAt: new Date()
      };

      const result = await contributionsCollection.insertOne(newContribution);

      // Notify the creator
      await createNotification({
        message: `${Supporter_name} contributed ${amount} credits to "${campaign_title}". Review pending.`,
        toEmail: creator_email,
        actionRoute: "/dashboard/creator-home"
      });

      res.send(result);
    });

    // Creator: Contributions To Review (status === 'pending')
    app.get('/creator/contributions/:email', verifyToken, verifyCreator, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const contributions = await contributionsCollection
        .find({ creator_email: email, status: 'pending' })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(contributions);
    });

    // Creator: Approve Contribution
    app.patch('/creator/contributions/:id/approve', verifyToken, verifyCreator, async (req, res) => {
      const { id } = req.params;
      const contrib = await contributionsCollection.findOne({ _id: new ObjectId(id) });
      if (!contrib) {
        return res.status(404).send({ message: 'Contribution not found' });
      }

      // Add Contribution amount to the campaign's raised amount
      await campaignsCollection.updateOne(
        { _id: new ObjectId(contrib.campaign_id) },
        { $inc: { amount_raised: Number(contrib.Contribution_amount) } }
      );

      // Change status to approved
      const result = await contributionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'approved', approvedAt: new Date() } }
      );

      // Notify supporter
      await createNotification({
        message: `Your Contribution of ${contrib.Contribution_amount} credits to ${contrib.campaign_title} was approved by ${contrib.creator_name}`,
        toEmail: contrib.Supporter_email,
        actionRoute: "/dashboard/supporter-home"
      });

      res.send(result);
    });

    // Creator: Reject Contribution (refund contribution amount back to supporter's credits)
    app.patch('/creator/contributions/:id/reject', verifyToken, verifyCreator, async (req, res) => {
      const { id } = req.params;
      const contrib = await contributionsCollection.findOne({ _id: new ObjectId(id) });
      if (!contrib) {
        return res.status(404).send({ message: 'Contribution not found' });
      }

      // Refund to supporter
      await usersCollection.updateOne(
        { email: contrib.Supporter_email?.toLowerCase() },
        { $inc: { credits: Number(contrib.Contribution_amount) } }
      );

      // Change status to rejected
      const result = await contributionsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'rejected', rejectedAt: new Date() } }
      );

      // Notify supporter
      await createNotification({
        message: `Your Contribution of ${contrib.Contribution_amount} credits to ${contrib.campaign_title} was rejected by ${contrib.creator_name} and refunded to your credits.`,
        toEmail: contrib.Supporter_email,
        actionRoute: "/dashboard/supporter-home"
      });

      res.send(result);
    });

    // Supporter: Approved contributions
    app.get('/supporter/contributions/approved/:email', verifyToken, verifySupporter, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const approved = await contributionsCollection
        .find({ Supporter_email: email, status: 'approved' })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(approved);
    });

    // Supporter: My Contributions with Pagination (Challenge)
    app.get('/supporter/contributions/:email', verifyToken, verifySupporter, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const total = await contributionsCollection.countDocuments({ Supporter_email: email });
      const contributions = await contributionsCollection
        .find({ Supporter_email: email })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      res.send({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        contributions
      });
    });

    /* ==============================================================
       5. WITHDRAWALS ENDPOINTS (Creator & Admin)
       ============================================================== */

    // Creator: Submit Withdrawal Request
    // Business logic: 20 Credits = $1. Minimum 200 credits ($10). Cannot exceed total raised credits.
    app.post('/withdrawals', verifyToken, verifyCreator, async (req, res) => {
      const {
        creator_email,
        creator_name,
        withdrawal_credit,
        payment_system,
        account_number
      } = req.body;

      const creditNum = Number(withdrawal_credit);
      const email = creator_email?.toLowerCase();

      if (creditNum < 200) {
        return res.status(400).send({ message: 'Minimum withdrawal is 200 credits ($10).' });
      }

      // Check creator's total raised credits
      const campaigns = await campaignsCollection.find({ creator_email: email }).toArray();
      const totalRaised = campaigns.reduce((sum, c) => sum + (c.amount_raised || 0), 0);

      // Check already withdrawn or pending credits
      const existingWithdrawals = await withdrawalsCollection.find({
        creator_email: email,
        status: { $in: ['pending', 'approved'] }
      }).toArray();
      const totalWithdrawn = existingWithdrawals.reduce((sum, w) => sum + (w.withdrawal_credit || 0), 0);
      const availableToWithdraw = totalRaised - totalWithdrawn;

      if (creditNum > availableToWithdraw) {
        return res.status(400).send({ message: `Insufficient raised credits. Available to withdraw: ${availableToWithdraw} credits.` });
      }

      const withdrawAmountDollars = creditNum / 20;

      const newWithdrawal = {
        creator_email: email,
        creator_name,
        withdrawal_credit: creditNum,
        withdrawal_amount: withdrawAmountDollars,
        payment_system,
        account_number,
        withdraw_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        createdAt: new Date()
      };

      const result = await withdrawalsCollection.insertOne(newWithdrawal);
      res.send(result);
    });

    // Creator: Payment History (all withdrawal payments made to creator)
    app.get('/creator/withdrawals/:email', verifyToken, verifyCreator, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const history = await withdrawalsCollection
        .find({ creator_email: email })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(history);
    });

    // Admin: View pending withdrawal requests
    app.get('/admin/withdrawals/pending', verifyToken, verifyAdmin, async (req, res) => {
      const pendingWithdrawals = await withdrawalsCollection
        .find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(pendingWithdrawals);
    });

    // Admin: Mark withdrawal Payment Success
    // Status -> 'approved', decrease creator's raised credits by withdrawal amount, notify creator
    app.patch('/admin/withdrawals/:id/success', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) });
      if (!withdrawal) {
        return res.status(404).send({ message: 'Withdrawal not found' });
      }

      const result = await withdrawalsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'approved', approvedAt: new Date() } }
      );

      // Notify Creator
      await createNotification({
        message: `Your withdrawal request of $${withdrawal.withdrawal_amount} (${withdrawal.withdrawal_credit} credits) was processed successfully!`,
        toEmail: withdrawal.creator_email,
        actionRoute: "/dashboard/withdrawals"
      });

      res.send(result);
    });

    /* ==============================================================
       6. CREDIT PURCHASE & STRIPE PAYMENTS (Supporter)
       ============================================================== */

    // Create Stripe Payment Intent
    app.post('/create-payment-intent', verifyToken, async (req, res) => {
      const { price } = req.body;
      const amountInCents = Math.round(Number(price) * 100);

      try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
          // Dummy client secret for development if Stripe key not provided yet
          return res.send({ clientSecret: `dummy_secret_for_test_${Date.now()}` });
        }
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: 'usd',
          payment_method_types: ['card']
        });
        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });

    // Record credit purchase payment and increase supporter's credits
    app.post('/payments/purchase-credit', verifyToken, verifySupporter, async (req, res) => {
      const {
        user_email,
        user_name,
        credits_purchased,
        amount_paid,
        transaction_id,
        payment_method
      } = req.body;

      const credits = Number(credits_purchased);
      const email = user_email?.toLowerCase();

      // Save payment
      const paymentDoc = {
        user_email: email,
        user_name,
        credits_purchased: credits,
        amount_paid: Number(amount_paid),
        transaction_id: transaction_id || `TXN_${Date.now()}`,
        payment_method: payment_method || 'Stripe',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date()
      };

      const paymentResult = await paymentsCollection.insertOne(paymentDoc);

      // Increase supporter credits
      await usersCollection.updateOne(
        { email },
        { $inc: { credits: credits } }
      );

      // Create Notification
      await createNotification({
        message: `You successfully purchased ${credits} credits for $${amount_paid}!`,
        toEmail: email,
        actionRoute: "/dashboard/purchase-credit"
      });

      res.send(paymentResult);
    });

    // Supporter: Payment history
    app.get('/supporter/payments/:email', verifyToken, verifySupporter, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const payments = await paymentsCollection
        .find({ user_email: email })
        .sort({ createdAt: -1 })
        .toArray();
      res.send(payments);
    });

    /* ==============================================================
       7. STATS & ANALYTICS ENDPOINTS (Supporter, Creator, Admin)
       ============================================================== */

    // Supporter Stats: total contributions count, pending count, total approved contributed credits
    app.get('/supporter/stats/:email', verifyToken, verifySupporter, async (req, res) => {
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
    });

    // Creator Stats: total campaigns launched, active campaigns (deadline >= today), total amount raised across all campaigns
    app.get('/creator/stats/:email', verifyToken, verifyCreator, async (req, res) => {
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
    });

    // Admin Stats: total supporters, total creators, sum of all users' credits, total payments processed
    app.get('/admin/stats', verifyToken, verifyAdmin, async (req, res) => {
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
    });

    /* ==============================================================
       8. NOTIFICATIONS & REPORTS ENDPOINTS
       ============================================================== */

    // Get notifications for user matching toEmail, sorted descending
    app.get('/notifications/:email', verifyToken, async (req, res) => {
      const email = req.params.email?.toLowerCase();
      const notifications = await notificationsCollection
        .find({ toEmail: email })
        .sort({ time: -1 })
        .limit(20)
        .toArray();
      res.send(notifications);
    });

    // Mark notification as read
    app.patch('/notifications/:id/read', verifyToken, async (req, res) => {
      const { id } = req.params;
      const result = await notificationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isRead: true } }
      );
      res.send(result);
    });

    // Supporter: Report campaign
    app.post('/reports', verifyToken, async (req, res) => {
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
    });

    // Admin: View all reported campaigns
    app.get('/admin/reports', verifyToken, verifyAdmin, async (req, res) => {
      const reports = await reportsCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(reports);
    });

    // Admin: Suspend reported campaign
    app.patch('/admin/campaigns/:id/suspend', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      const result = await campaignsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'suspended', suspendedAt: new Date() } }
      );
      res.send(result);
    });

    console.log("All Crowdfunding Platform API routes registered successfully!");
  } catch (error) {
    console.error("MongoDB Connection / Setup Error:", error.message);
  }
}

run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send({
    status: 'online',
    platform: 'CrowdSpark API - Crowdfunding Platform',
    version: '1.0.0'
  });
});

app.listen(port, () => {
  console.log(`CrowdSpark server is running smoothly on port ${port}`);
});
