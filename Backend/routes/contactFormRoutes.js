const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Get all contact forms (admin only)
router.get('/admin', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [contacts] = await promisePool.execute(`
      SELECT * FROM contact_forms 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Get all contact forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact forms'
    });
  }
});

// Get contact form statistics
router.get('/stats', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [totalResult] = await promisePool.execute(`
      SELECT 
        COUNT(*) as total_contacts,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_contacts,
        SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read_contacts,
        SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied_contacts,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_contacts
      FROM contact_forms
    `);

    res.json({
      success: true,
      data: totalResult[0]
    });
  } catch (error) {
    console.error('Get contact form stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact form statistics'
    });
  }
});

// Create contact form (public)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('phone').optional(),
  body('subject').optional()
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

    const { 
      name, 
      email, 
      phone = null, 
      subject = null, 
      message 
    } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO contact_forms (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `, [name, email, phone, subject, message]);

    // Send email notification
    try {
      await emailService.sendContactEmail({
        name,
        email,
        phone,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
});

// Get single contact form
router.get('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [contacts] = await promisePool.execute(
      'SELECT * FROM contact_forms WHERE id = ?',
      [id]
    );

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      data: contacts[0]
    });
  } catch (error) {
    console.error('Get contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact form'
    });
  }
});

// Update contact form status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireModerator,
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status')
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

    const [result] = await promisePool.execute(
      'UPDATE contact_forms SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact form status updated successfully'
    });
  } catch (error) {
    console.error('Update contact form status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact form status'
    });
  }
});

// Delete contact form (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM contact_forms WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact form deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact form'
    });
  }
});

module.exports = router;
