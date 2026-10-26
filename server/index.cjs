require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db.cjs');
const authRoutes = require('./routes/auth.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Root health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'MaXxCode API Server',
    timestamp: new Date().toISOString(),
  });
});

// Start Server
const startServer = async () => {
  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 MaXxCode Auth Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api/auth`);
    console.log(`===============================================\n`);
  });
};

startServer();
