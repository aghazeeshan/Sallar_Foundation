const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Get all active banners
router.get('/', async (req, res) => {
  try {
    const [banners] = await promisePool.execute(`
      SELECT id, image_url, sub_heading, title, 
             description, button_text, button_link as link_url, 
             text_alignment, is_active, created_at, updated_at
      FROM banners 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners'
    });
  }
});

// Get all banners (admin only)
router.get('/admin', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [banners] = await promisePool.execute(`
      SELECT * FROM banners 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Get all banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners'
    });
  }
});

// Get single banner
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [banners] = await promisePool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [id]
    );

    if (banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      data: banners[0]
    });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner'
    });
  }
});

// Create banner (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  body('link_url').optional(),
  body('button_text').optional(),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  body('display_order').optional().isInt().withMessage('display_order must be integer')
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

    const { title, sub_heading = null, description, image_url, button_text = null, button_link = null, text_alignment = 'center', is_active = true } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO banners (title, sub_heading, description, image_url, button_text, button_link, text_alignment, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, sub_heading, description, image_url, button_text, button_link, text_alignment, is_active]);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: error.message
    });
  }
});

// Update banner (admin only)
router.put('/:id', [
  authenticateToken,
  requireModerator,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  body('display_order').optional().isInt().withMessage('display_order must be integer')
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
    const updates = req.body;

    // Check if banner exists
    const [banners] = await promisePool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [id]
    );

    if (banners.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    updateValues.push(id);

    await promisePool.execute(
      `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner'
    });
  }
});

// Delete banner (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM banners WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner'
    });
  }
});

// Toggle banner status (admin only)
router.patch('/:id/toggle', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'UPDATE banners SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner status updated successfully'
    });
  } catch (error) {
    console.error('Toggle banner status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner status'
    });
  }
});

module.exports = router;
