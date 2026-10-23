const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { uploadDir } = require('./middlewares/uploadMiddleware');

// Import modular routes
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Static files (Uploads)
app.use('/uploads', express.static(uploadDir));

// Connect to MongoDB
connectDB().catch(console.error);

// Ensure DB is connected before any API requests proceed
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/favicon.ico') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).send({ error: true, message: 'Database connection failed: ' + err.message });
  }
});

// Register Modular Routers
app.use('/', uploadRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', campaignRoutes);
app.use('/', contributionRoutes);
app.use('/', withdrawalRoutes);
app.use('/', paymentRoutes);
app.use('/', statsRoutes);
app.use('/', notificationRoutes);
app.use('/', reportRoutes);

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.send({
    status: 'online',
    platform: 'CrowdSpark API - Crowdfunding Platform',
    version: '1.0.0',
    architecture: 'MVC (Routes & Controllers)'
  });
});

// Global 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).send({ error: true, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).send({ error: true, message: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`CrowdSpark server is running smoothly on port ${port}`);
  });
}

module.exports = app;
