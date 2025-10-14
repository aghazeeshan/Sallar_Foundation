const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Submit contact message
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { name, email, subject, message } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, subject, message]);

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message'
    });
  }
});

// Get all contact messages (admin only)
router.get('/', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const queryParams = [];

    if (status) {
      query += ' AND status = ?';
      queryParams.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [messages] = await promisePool.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await promisePool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// Get single contact message (admin only)
router.get('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await promisePool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      data: messages[0]
    });
  } catch (error) {
    console.error('Get contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
});

// Update contact message status (admin only)
router.put('/:id/status', [
  authenticateToken,
  requireModerator,
  body('status').isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status')
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
    const { status } = req.body;

    const updateFields = ['status = ?'];
    const updateValues = [status];

    if (status === 'replied') {
      updateFields.push('replied_at = NOW()');
    }

    updateValues.push(id);

    const [result] = await promisePool.execute(
      `UPDATE contact_messages SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message status updated successfully'
    });
  } catch (error) {
    console.error('Update contact message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message status'
    });
  }
});

// Delete contact message (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
});

// Get contact message statistics (admin only)
router.get('/stats/summary', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [totalMessages] = await promisePool.execute(
      'SELECT COUNT(*) as count FROM contact_messages'
    );

    const [statusCounts] = await promisePool.execute(`
      SELECT status, COUNT(*) as count 
      FROM contact_messages 
      GROUP BY status
    `);

    const [recentMessages] = await promisePool.execute(`
      SELECT COUNT(*) as count 
      FROM contact_messages 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    res.json({
      success: true,
      data: {
        totalMessages: totalMessages[0].count,
        statusBreakdown: statusCounts,
        recentMessages: recentMessages[0].count
      }
    });
  } catch (error) {
    console.error('Get contact message stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message statistics'
    });
  }
});

module.exports = router;
