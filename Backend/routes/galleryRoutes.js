const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, featured } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM gallery_images WHERE 1=1';
    const queryParams = [];

    if (category) {
      query += ' AND category = ?';
      queryParams.push(category);
    }

    if (featured === 'true') {
      query += ' AND is_featured = TRUE';
    }

    query += ' ORDER BY display_order ASC, created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    const [images] = await promisePool.execute(query, queryParams);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM gallery_images WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (featured === 'true') {
      countQuery += ' AND is_featured = TRUE';
    }

    const [countResult] = await promisePool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: images,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalImages: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get gallery images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [images] = await promisePool.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      data: images[0]
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery image'
    });
  }
});

// Create gallery image (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  body('title').optional(),
  body('description').optional(),
  body('image_url').notEmpty().withMessage('Image URL is required'),
  body('category').optional(),
  body('is_featured').optional().isBoolean().withMessage('is_featured must be boolean'),
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

    const { title, description, image_url, category, is_featured = false, display_order = 0 } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO gallery_images (title, description, image_url, category, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, image_url, category, is_featured, display_order]);

    res.status(201).json({
      success: true,
      message: 'Gallery image created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery image'
    });
  }
});

// Update gallery image (admin only)
router.put('/:id', [
  authenticateToken,
  requireModerator,
  body('title').optional(),
  body('description').optional(),
  body('category').optional(),
  body('is_featured').optional().isBoolean().withMessage('is_featured must be boolean'),
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

    // Check if image exists
    const [images] = await promisePool.execute(
      'SELECT * FROM gallery_images WHERE id = ?',
      [id]
    );

    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
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
      `UPDATE gallery_images SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Gallery image updated successfully'
    });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery image'
    });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM gallery_images WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery image'
    });
  }
});

// Get gallery categories
router.get('/categories/list', async (req, res) => {
  try {
    const [categories] = await promisePool.execute(`
      SELECT DISTINCT category 
      FROM gallery_images 
      WHERE category IS NOT NULL AND category != ''
      ORDER BY category
    `);

    res.json({
      success: true,
      data: categories.map(cat => cat.category)
    });
  } catch (error) {
    console.error('Get gallery categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery categories'
    });
  }
});

// Get featured images
router.get('/featured/list', async (req, res) => {
  try {
    const [images] = await promisePool.execute(`
      SELECT * FROM gallery_images 
      WHERE is_featured = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `);

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('Get featured images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured images'
    });
  }
});

module.exports = router;
