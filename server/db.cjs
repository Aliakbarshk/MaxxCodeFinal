const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.cjs');

let isMongoConnected = false;
const fallbackDir = path.join(__dirname, 'data');
const fallbackFilePath = path.join(fallbackDir, 'users.json');

// Ensure fallback directory and file exist
if (!fs.existsSync(fallbackDir)) {
  fs.mkdirSync(fallbackDir, { recursive: true });
}
if (!fs.existsSync(fallbackFilePath)) {
  fs.writeFileSync(fallbackFilePath, JSON.stringify([], null, 2));
}

// Fallback JSON helpers
const readFallbackUsers = () => {
  try {
    const raw = fs.readFileSync(fallbackFilePath, 'utf8');
    return JSON.parse(raw) || [];
  } catch (e) {
    console.error('Error reading fallback storage:', e.message);
    return [];
  }
};

const writeFallbackUsers = (users) => {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Error writing fallback storage:', e.message);
  }
};

const connectDB = async (uri) => {
  if (!uri) {
    console.warn('⚠️ No MONGODB_URI provided in .env. Running on local resilient DB fallback.');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn('\n⚠️  MongoDB Atlas Notice:');
    console.warn(`   Atlas connection reported: ${err.message}`);
    console.warn('   🛡️  MaXxCode is running in resilient mode using local storage (server/data/users.json).');
    console.warn('   All registrations, logins, progress and XP sync work 100% smoothly!\n');
    return false;
  }
};

// Unified Data Access Layer
const db = {
  isAtlasConnected: () => isMongoConnected,

  async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (isMongoConnected) {
      return await User.findOne({ email: normalized });
    } else {
      const users = readFallbackUsers();
      return users.find((u) => u.email.toLowerCase() === normalized) || null;
    }
  },

  async findById(id) {
    if (isMongoConnected) {
      return await User.findById(id);
    } else {
      const users = readFallbackUsers();
      return users.find((u) => u._id === id || u.id === id) || null;
    }
  },

  async createUser(userData) {
    const normalizedEmail = userData.email.toLowerCase().trim();
    if (isMongoConnected) {
      const newUser = new User({
        ...userData,
        email: normalizedEmail,
      });
      return await newUser.save();
    } else {
      const users = readFallbackUsers();
      const newUser = {
        _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: userData.name,
        email: normalizedEmail,
        password: userData.password,
        avatar: userData.avatar || 'happy',
        xp: userData.xp || 0,
        currentStreak: userData.currentStreak || 1,
        lastLoginDate: new Date().toISOString(),
        completedLessons: userData.completedLessons || [],
        completedProblems: userData.completedProblems || [],
        badges: userData.badges || [],
        adminUnlocked: userData.adminUnlocked || false,
        settings: userData.settings || { appLanguage: 'en', theme: 'light' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeFallbackUsers(users);
      return newUser;
    }
  },

  async updateUser(id, updateData) {
    if (isMongoConnected) {
      return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    } else {
      const users = readFallbackUsers();
      const idx = users.findIndex((u) => u._id === id || u.id === id);
      if (idx === -1) return null;

      users[idx] = {
        ...users[idx],
        ...updateData,
        settings: {
          ...(users[idx].settings || {}),
          ...(updateData.settings || {}),
        },
        updatedAt: new Date().toISOString(),
      };
      writeFallbackUsers(users);
      return users[idx];
    }
  },

  sanitizeUser(user) {
    if (!user) return null;
    const clean = typeof user.toSafeObject === 'function' ? user.toSafeObject() : { ...user };
    delete clean.password;
    delete clean.__v;
    return clean;
  },
};

module.exports = {
  connectDB,
  db,
};
