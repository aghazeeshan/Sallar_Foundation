const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Login admin
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find admin user
    const [users] = await promisePool.execute(
      'SELECT * FROM admin_users WHERE username = ? AND is_active = TRUE',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Get all admins (admin only)
router.get('/', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [admins] = await promisePool.execute(`
      SELECT id, username, email, role, is_active, created_at, updated_at
      FROM admin_users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins'
    });
  }
});

// Create admin (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'moderator']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, role = 'moderator' } = req.body;

    // Check if username or email already exists
    const [existingUsers] = await promisePool.execute(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const [result] = await promisePool.execute(`
      INSERT INTO admin_users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, hashedPassword, role]);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin'
    });
  }
});

// Update admin password (admin only)
router.patch('/:id/password', [
  authenticateToken,
  requireModerator,
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await promisePool.execute(
      'UPDATE admin_users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
});

// Toggle admin status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireModerator,
  body('is_active').isBoolean().withMessage('is_active must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    const [result] = await promisePool.execute(
      'UPDATE admin_users SET is_active = ? WHERE id = ?',
      [is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin status updated successfully'
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update admin status'
    });
  }
});

// Delete admin (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const [result] = await promisePool.execute(
      'DELETE FROM admin_users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin'
    });
  }
});

module.exports = router;

