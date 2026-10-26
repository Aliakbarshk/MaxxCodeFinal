const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db.cjs');
const { authenticate, JWT_SECRET } = require('../middleware/auth.cjs');

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
};

const calculateStreak = (user) => {
  const today = new Date().toDateString();
  const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate).toDateString() : null;

  if (lastLogin === today) {
    return user.currentStreak || 1;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastLogin === yesterday.toDateString()) {
    return (user.currentStreak || 0) + 1;
  } else {
    return 1;
  }
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, guestProgress } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields: name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await db.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPayload = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: 'happy',
      xp: guestProgress?.xp || 0,
      currentStreak: guestProgress?.currentStreak || 1,
      lastLoginDate: new Date().toISOString(),
      completedLessons: guestProgress?.completedLessons || [],
      completedProblems: guestProgress?.completedProblems || [],
      badges: guestProgress?.badges || [],
      adminUnlocked: guestProgress?.adminUnlocked || false,
      settings: guestProgress?.settings || {
        appLanguage: 'en',
        theme: 'light',
      },
    };

    const created = await db.createUser(userPayload);
    const userId = created._id ? created._id.toString() : created.id;
    const token = generateToken(userId);
    const safeUser = db.sanitizeUser(created);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to MaXxCode!',
      token,
      user: safeUser,
      database: db.isAtlasConnected() ? 'MongoDB Atlas' : 'Resilient Fallback',
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error while creating your account. Please try again.',
    });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password',
      });
    }

    const user = await db.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      });
    }

    const updatedStreak = calculateStreak(user);
    const userId = user._id ? user._id.toString() : user.id;

    const updatedUser = await db.updateUser(userId, {
      currentStreak: updatedStreak,
      lastLoginDate: new Date().toISOString(),
    });

    const token = generateToken(userId);
    const safeUser = db.sanitizeUser(updatedUser);

    return res.json({
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      token,
      user: safeUser,
      database: db.isAtlasConnected() ? 'MongoDB Atlas' : 'Resilient Fallback',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Server error during login. Please try again.',
    });
  }
});

// @route   GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
    database: db.isAtlasConnected() ? 'MongoDB Atlas' : 'Resilient Fallback',
  });
});

// @route   PUT /api/auth/sync
router.put('/sync', authenticate, async (req, res) => {
  try {
    const {
      xp,
      currentStreak,
      completedLessons,
      completedProblems,
      badges,
      settings,
      adminUnlocked,
    } = req.body;

    const updates = {};
    if (typeof xp === 'number') updates.xp = xp;
    if (typeof currentStreak === 'number') updates.currentStreak = currentStreak;
    if (Array.isArray(completedLessons)) updates.completedLessons = completedLessons;
    if (Array.isArray(completedProblems)) updates.completedProblems = completedProblems;
    if (Array.isArray(badges)) updates.badges = badges;
    if (typeof adminUnlocked === 'boolean') updates.adminUnlocked = adminUnlocked;
    if (settings) updates.settings = settings;

    const updatedUser = await db.updateUser(req.userId, updates);
    const safeUser = db.sanitizeUser(updatedUser);

    return res.json({
      success: true,
      message: 'Progress synced successfully',
      user: safeUser,
    });
  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to sync progress with cloud',
    });
  }
});

// @route   GET /api/auth/status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    isAtlasConnected: db.isAtlasConnected(),
    engine: db.isAtlasConnected() ? 'MongoDB Atlas Cloud' : 'Local Resilient Fallback',
  });
});

module.exports = router;
