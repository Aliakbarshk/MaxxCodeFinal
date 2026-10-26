require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db.cjs');
const authRoutes = require('./routes/auth.cjs');

const app = express();

app.use(cors());
app.use(express.json());

// Serverless-ready DB connection caching
let dbPromise = null;
const ensureDBConnected = async () => {
  if (!dbPromise) {
    dbPromise = connectDB(process.env.MONGODB_URI);
  }
  return dbPromise;
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await ensureDBConnected();
  } catch (err) {
    console.error('DB middleware error:', err.message);
  }
  next();
});

// Mount routes on both /api/auth and /auth for compatibility with Vercel serverless rewrites
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'MaXxCode API Server',
    timestamp: new Date().toISOString(),
  });
});
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'MaXxCode API Server',
    timestamp: new Date().toISOString(),
  });
});

module.exports = {
  app,
  ensureDBConnected,
};
