const jwt = require('jsonwebtoken');
const { db } = require('../db.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'maxxcode_secret_token_key_default';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User no longer exists' });
    }

    req.user = db.sanitizeUser(user);
    req.userId = user._id ? user._id.toString() : user.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

module.exports = {
  authenticate,
  JWT_SECRET,
};
