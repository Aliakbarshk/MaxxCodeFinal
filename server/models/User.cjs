const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    avatar: {
      type: String,
      default: 'happy',
    },
    xp: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 1,
    },
    lastLoginDate: {
      type: Date,
      default: Date.now,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    completedProblems: {
      type: [String],
      default: [],
    },
    badges: {
      type: [String],
      default: [],
    },
    adminUnlocked: {
      type: Boolean,
      default: false,
    },
    settings: {
      appLanguage: {
        type: String,
        default: 'en',
      },
      theme: {
        type: String,
        default: 'light',
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject ? this.toObject() : { ...this };
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
