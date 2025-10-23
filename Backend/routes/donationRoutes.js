const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Get all donations (admin only)
router.get('/admin', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [donations] = await promisePool.execute(`
      SELECT * FROM donations 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations'
    });
  }
});

// Get latest donations for popup (public)
router.get('/latest', async (req, res) => {
  try {
    const [donations] = await promisePool.execute(`
      SELECT donor_name, donor_country, amount, currency, created_at
      FROM donations 
      WHERE status = 'completed' AND is_anonymous = FALSE
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    console.error('Get latest donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest donations'
    });
  }
});

// Get donation statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalResult] = await promisePool.execute(`
      SELECT 
        COUNT(*) as total_donations,
        SUM(amount) as total_amount,
        AVG(amount) as average_amount
      FROM donations 
      WHERE status = 'completed'
    `);

    const [countryResult] = await promisePool.execute(`
      SELECT donor_country, COUNT(*) as count
      FROM donations 
      WHERE status = 'completed'
      GROUP BY donor_country
      ORDER BY count DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        ...totalResult[0],
        top_countries: countryResult
      }
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics'
    });
  }
});

// Create donation (public)
router.post('/', [
  body('donor_name').notEmpty().withMessage('Donor name is required'),
  body('donor_email').isEmail().withMessage('Valid email is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least 1'),
  body('donor_country').optional(),
  body('donor_phone').optional(),
  body('payment_method').optional(),
  body('donation_type').optional(),
  body('message').optional(),
  body('is_anonymous').optional().isBoolean()
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
      donor_name, 
      donor_email, 
      donor_phone = null, 
      donor_country = null, 
      amount, 
      currency = 'USD',
      payment_method = null,
      donation_type = null,
      message = null,
      is_anonymous = false
    } = req.body;

    // Generate transaction ID
    const transaction_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const [result] = await promisePool.execute(`
      INSERT INTO donations (
        donor_name, donor_email, donor_phone, donor_country, 
        amount, currency, payment_method, donation_type, 
        message, is_anonymous, transaction_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')
    `, [
      donor_name, donor_email, donor_phone, donor_country,
      amount, currency, payment_method, donation_type,
      message, is_anonymous, transaction_id
    ]);

    // Send email notification
    try {
      await emailService.sendDonationEmail({
        name: donor_name,
        email: donor_email,
        phone: donor_phone,
        amount,
        currency,
        payment_method,
        message
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Donation submitted successfully',
      data: { 
        id: result.insertId,
        transaction_id: transaction_id
      }
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation',
      error: error.message
    });
  }
});

// Get single donation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [donations] = await promisePool.execute(
      'SELECT * FROM donations WHERE id = ?',
      [id]
    );

    if (donations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donations[0]
    });
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation'
    });
  }
});

// Update donation status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireModerator,
  body('status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid status')
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
      'UPDATE donations SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      message: 'Donation status updated successfully'
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update donation status'
    });
  }
});

// Delete donation (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM donations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation'
    });
  }
});

module.exports = router;