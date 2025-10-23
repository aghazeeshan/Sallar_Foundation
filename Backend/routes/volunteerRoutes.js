const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Get all volunteers (admin only)
router.get('/admin', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [volunteers] = await promisePool.execute(`
      SELECT * FROM volunteers 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    console.error('Get all volunteers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteers'
    });
  }
});

// Get volunteer statistics
router.get('/stats', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [totalResult] = await promisePool.execute(`
      SELECT 
        COUNT(*) as total_volunteers,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_volunteers,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_volunteers,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_volunteers
      FROM volunteers
    `);

    res.json({
      success: true,
      data: totalResult[0]
    });
  } catch (error) {
    console.error('Get volunteer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer statistics'
    });
  }
});

// Create volunteer (public)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional(),
  body('age').optional().isInt({ min: 16, max: 100 }).withMessage('Age must be between 16 and 100'),
  body('address').optional(),
  body('skills').optional(),
  body('experience').optional(),
  body('availability').optional(),
  body('motivation').optional(),
  body('emergency_contact').optional(),
  body('emergency_phone').optional()
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
      age = null,
      address = null,
      skills = null,
      experience = null,
      availability = null,
      motivation = null,
      emergency_contact = null,
      emergency_phone = null
    } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO volunteers (
        name, email, phone, age, address, skills, experience, 
        availability, motivation, emergency_contact, emergency_phone, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      name, email, phone, age, address, skills, experience,
      availability, motivation, emergency_contact, emergency_phone
    ]);

    // Send email notification
    try {
      await emailService.sendVolunteerEmail({
        name,
        email,
        phone,
        skills,
        availability,
        message: motivation
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit volunteer application',
      error: error.message
    });
  }
});

// Get single volunteer
router.get('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [volunteers] = await promisePool.execute(
      'SELECT * FROM volunteers WHERE id = ?',
      [id]
    );

    if (volunteers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      data: volunteers[0]
    });
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch volunteer'
    });
  }
});

// Update volunteer status (admin only)
router.patch('/:id/status', [
  authenticateToken,
  requireModerator,
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
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
      'UPDATE volunteers SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer status updated successfully'
    });
  } catch (error) {
    console.error('Update volunteer status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer status'
    });
  }
});

// Delete volunteer (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM volunteers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    console.error('Delete volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer'
    });
  }
});

module.exports = router;