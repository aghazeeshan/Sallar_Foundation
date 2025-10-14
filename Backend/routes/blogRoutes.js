const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT bp.*, u.username as author_name,
             GROUP_CONCAT(c.name) as categories
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN categories c ON bpc.category_id = c.id
      WHERE bp.status = 'published'
    `;
    
    const queryParams = [];

    if (category) {
      query += ` AND c.slug = ?`;
      queryParams.push(category);
    }

    if (search) {
      query += ` AND (bp.title LIKE ? OR bp.content LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY bp.id ORDER BY bp.published_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [posts] = await promisePool.execute(query, queryParams);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT bp.id) as total
      FROM blog_posts bp
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN categories c ON bpc.category_id = c.id
      WHERE bp.status = 'published'
    `;
    const countParams = [];

    if (category) {
      countQuery += ` AND c.slug = ?`;
      countParams.push(category);
    }

    if (search) {
      countQuery += ` AND (bp.title LIKE ? OR bp.content LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await promisePool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [posts] = await promisePool.execute(`
      SELECT bp.*, u.username as author_name,
             GROUP_CONCAT(c.name) as categories
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN categories c ON bpc.category_id = c.id
      WHERE bp.slug = ? AND bp.status = 'published'
      GROUP BY bp.id
    `, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: posts[0]
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
});

// Create blog post (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional(),
  body('featured_image').optional(),
  body('status').isIn(['draft', 'published']).withMessage('Status must be draft or published'),
  body('categories').optional().isArray().withMessage('Categories must be an array')
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

    const { title, content, excerpt, featured_image, status, categories } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug already exists
    const [existingPosts] = await promisePool.execute(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );

    let finalSlug = slug;
    if (existingPosts.length > 0) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const publishedAt = status === 'published' ? new Date() : null;

    // Insert blog post
    const [result] = await promisePool.execute(`
      INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author_id, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, finalSlug, content, excerpt, featured_image, req.user.id, status, publishedAt]);

    const postId = result.insertId;

    // Add categories if provided
    if (categories && categories.length > 0) {
      for (const categoryId of categories) {
        await promisePool.execute(
          'INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)',
          [postId, categoryId]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: { id: postId, slug: finalSlug }
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post'
    });
  }
});

// Update blog post (admin only)
router.put('/:id', [
  authenticateToken,
  requireModerator,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
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

    // Check if post exists
    const [posts] = await promisePool.execute(
      'SELECT * FROM blog_posts WHERE id = ?',
      [id]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Update published_at if status changed to published
    if (updates.status === 'published' && posts[0].status !== 'published') {
      updates.published_at = new Date();
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
      `UPDATE blog_posts SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Blog post updated successfully'
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post'
    });
  }
});

// Delete blog post (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM blog_posts WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post'
    });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const [categories] = await promisePool.execute(
      'SELECT * FROM categories ORDER BY name'
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
