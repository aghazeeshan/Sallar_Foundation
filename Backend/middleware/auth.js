const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const { promisePool } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Development bypass for demo token
    if (token === 'demo-admin-token-12345') {
      req.user = {
        id: 1,
        username: 'admin',
        email: 'admin@charityfoundation.com',
        role: 'admin',
        is_active: true
      };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const [users] = await promisePool.execute(
      'SELECT id, username, email, role, is_active FROM admin_users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0 || !users[0].is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user is admin or moderator
const requireModerator = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Moderator access required'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireModerator
};
