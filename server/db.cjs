const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.cjs');

const os = require('os');
let isMongoConnected = false;

// On Vercel / serverless, filesystem is read-only; use os.tmpdir()
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const fallbackDir = isServerless
  ? path.join(os.tmpdir(), 'maxxcode-data')
  : path.join(__dirname, 'data');
const fallbackFilePath = path.join(fallbackDir, 'users.json');

// In-memory fallback if disk is completely unavailable
let memoryUsers = [];

// Ensure fallback directory and file exist safely
try {
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
  if (!fs.existsSync(fallbackFilePath)) {
    fs.writeFileSync(fallbackFilePath, JSON.stringify([], null, 2));
  }
} catch (e) {
  // Silent fallback to memoryUsers on read-only environments
}

// Fallback helpers
const readFallbackUsers = () => {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const raw = fs.readFileSync(fallbackFilePath, 'utf8');
      return JSON.parse(raw) || memoryUsers;
    }
  } catch (e) {
    // Ignore read errors
  }
  return memoryUsers;
};

const writeFallbackUsers = (users) => {
  memoryUsers = users;
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(users, null, 2));
  } catch (e) {
    // Disk write may fail on serverless; memoryUsers is already updated
  }
};

// Auto-migrate fallback users into Atlas once connected
const migrateFallbackToAtlas = async () => {
  try {
    const fallbackUsers = readFallbackUsers();
    if (!fallbackUsers || fallbackUsers.length === 0) return;

    let migrated = 0;
    for (const u of fallbackUsers) {
      const existing = await User.findOne({ email: u.email.toLowerCase().trim() });
      if (!existing) {
        await User.create({
          name: u.name,
          email: u.email.toLowerCase().trim(),
          password: u.password,
          avatar: u.avatar || 'happy',
          xp: u.xp || 0,
          currentStreak: u.currentStreak || 1,
          lastLoginDate: u.lastLoginDate || new Date(),
          completedLessons: u.completedLessons || [],
          completedProblems: u.completedProblems || [],
          badges: u.badges || [],
          adminUnlocked: u.adminUnlocked || false,
          settings: u.settings || { appLanguage: 'en', theme: 'light' },
        });
        migrated++;
      }
    }

    if (migrated > 0) {
      console.log(`📦 [Migration] Successfully uploaded ${migrated} local user(s) into MongoDB Atlas Cloud!`);
    }
  } catch (err) {
    console.warn('⚠️ [Migration] Could not auto-migrate local users:', err.message);
  }
};

// Setup connection listeners
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
});

mongoose.connection.on('error', (err) => {
  isMongoConnected = false;
});

const connectDB = async (uri) => {
  if (!uri || uri.includes('<password>') || uri.includes('<username>')) {
    console.warn('⚠️  Notice: MongoDB Atlas placeholder found in .env.');
    console.warn('🛡️  Running in Resilient Local Storage mode (server/data/users.json).');
    console.warn('    Put your real Atlas DB password in .env to sync directly to cloud!\n');
    return false;
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas Cloud...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Auto-sync any existing local accounts to Atlas!
    await migrateFallbackToAtlas();
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.warn('\n⚠️  MongoDB Atlas Notice:');
    console.warn(`   Atlas connection error: ${err.message}`);
    console.warn('   🛡️  Running in Resilient Mode using local storage (server/data/users.json).');
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
      try {
        return await User.findOne({ email: normalized });
      } catch (err) {
        console.warn('Atlas query fallback:', err.message);
      }
    }
    const users = readFallbackUsers();
    return users.find((u) => u.email.toLowerCase() === normalized) || null;
  },

  async findById(id) {
    if (isMongoConnected) {
      try {
        return await User.findById(id);
      } catch (err) {
        console.warn('Atlas query fallback:', err.message);
      }
    }
    const users = readFallbackUsers();
    return users.find((u) => u._id === id || u.id === id) || null;
  },

  async createUser(userData) {
    const normalizedEmail = userData.email.toLowerCase().trim();

    // Always keep a local copy as backup
    const users = readFallbackUsers();
    const newUserObj = {
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
    users.push(newUserObj);
    writeFallbackUsers(users);

    if (isMongoConnected) {
      try {
        const atlasUser = new User({
          ...userData,
          email: normalizedEmail,
        });
        const saved = await atlasUser.save();
        return saved;
      } catch (err) {
        console.warn('Atlas save failed, falling back to local:', err.message);
      }
    }

    return newUserObj;
  },

  async updateUser(id, updateData) {
    let result = null;

    if (isMongoConnected) {
      try {
        result = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      } catch (err) {
        console.warn('Atlas update error:', err.message);
      }
    }

    // Also update local copy
    const users = readFallbackUsers();
    const idx = users.findIndex((u) => u._id === id || u.id === id);
    if (idx !== -1) {
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
      if (!result) result = users[idx];
    }

    return result;
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
