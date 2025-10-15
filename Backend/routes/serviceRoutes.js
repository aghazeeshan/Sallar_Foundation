const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Multer configuration for service image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/services';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, 'service_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all active services
router.get('/', async (req, res) => {
  try {
    const [services] = await promisePool.execute(`
      SELECT id, title, description, image_url, icon_class, is_active, display_order, created_at, updated_at
      FROM services 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, created_at DESC
    `);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get all services (admin only)
router.get('/admin', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [services] = await promisePool.execute(`
      SELECT * FROM services 
      ORDER BY display_order ASC, created_at DESC
    `);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Get single service
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [services] = await promisePool.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: services[0]
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service'
    });
  }
});

// Create service (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  upload.single('image'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('title').custom((val, { req }) => {
    if (!req.file && !req.body.image_url) {
      throw new Error('Image is required');
    }
    return true;
  }),
  body('icon_class').optional(),
  body('is_active').optional(),
  body('display_order').optional()
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

    const { title, description = null, icon_class = null, display_order = 0 } = req.body;
    const is_active = req.body.is_active === 'true' || req.body.is_active === true;
    
    const computedImageUrl = req.file ? `/uploads/services/${req.file.filename}` : req.body.image_url;

    const [result] = await promisePool.execute(`
      INSERT INTO services (title, description, image_url, icon_class, is_active, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, computedImageUrl, icon_class, is_active, parseInt(display_order) || 0]);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
});

// Update service (admin only)
router.put('/:id', [
  authenticateToken,
  requireModerator,
  upload.single('image'),
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('is_active').optional(),
  body('display_order').optional()
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

    // Check if service exists
    const [services] = await promisePool.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    // Handle image upload
    if (req.file) {
      updateFields.push('image_url = ?');
      updateValues.push(`/uploads/services/${req.file.filename}`);
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'image') {
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
      `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
});

// Delete service (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM services WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
});

// Toggle service status (admin only)
router.patch('/:id/toggle', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'UPDATE services SET is_active = NOT is_active WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service status updated successfully'
    });
  } catch (error) {
    console.error('Toggle service status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service status'
    });
  }
});

module.exports = router;

