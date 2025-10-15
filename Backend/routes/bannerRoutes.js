const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage for banner images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '');
    cb(null, `banner_${Date.now()}_${base}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 15 * 1024 * 1024 }
});

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
  upload.single('image'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('image_url').optional(),
  body('link_url').optional(),
  body('button_text').optional(),
  body('title').custom((val, { req }) => {
    // Ensure either file uploaded or image_url provided
    if (!req.file && !req.body.image_url) {
      throw new Error('Image is required');
    }
    return true;
  })
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

    const { title, sub_heading = null, description, button_text = null, button_link = null, text_alignment = 'center', is_active = true } = req.body;

    // Determine image URL from upload or body
    const computedImageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

    // Backward-compatible link column detection
    const [cols] = await promisePool.execute(`SHOW COLUMNS FROM banners LIKE 'button_link'`);
    const linkCol = cols.length > 0 ? 'button_link' : 'link_url';

    const insertSql = `INSERT INTO banners (title, sub_heading, description, image_url, button_text, ${linkCol}, text_alignment, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await promisePool.execute(insertSql,
      [title, sub_heading, description, computedImageUrl, button_text, button_link, text_alignment, is_active]
    );

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
  upload.single('image'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty')
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
    const updates = { ...req.body };

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

    // Build update query with backward-compatible link column
    const updateFields = [];
    const updateValues = [];

    // If new file uploaded, set image_url
    if (req.file) {
      updates.image_url = `/uploads/${req.file.filename}`;
    }

    // Map button_link to link_url if needed
    if (updates.button_link !== undefined) {
      const [cols] = await promisePool.execute(`SHOW COLUMNS FROM banners LIKE 'button_link'`);
      if (cols.length === 0) {
        updates.link_url = updates.button_link;
        delete updates.button_link;
      }
    }

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
