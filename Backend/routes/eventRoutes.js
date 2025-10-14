const express = require('express');
const { body, validationResult } = require('express-validator');
const { promisePool } = require('../config/database');
const { authenticateToken, requireModerator } = require('../middleware/auth');

const router = express.Router();

// Get all active events
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [events] = await promisePool.execute(`
      SELECT * FROM events 
      WHERE is_active = TRUE AND event_date >= CURDATE()
      ORDER BY event_date ASC, event_time ASC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), parseInt(offset)]);

    // Get total count
    const [countResult] = await promisePool.execute(`
      SELECT COUNT(*) as total FROM events 
      WHERE is_active = TRUE AND event_date >= CURDATE()
    `);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalEvents: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [events] = await promisePool.execute(
      'SELECT * FROM events WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: events[0]
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// Register for event
router.post('/:id/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional()
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
    const { name, email, phone } = req.body;

    // Check if event exists and is active
    const [events] = await promisePool.execute(
      'SELECT * FROM events WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or not active'
      });
    }

    const event = events[0];

    // Check if registration is required
    if (!event.registration_required) {
      return res.status(400).json({
        success: false,
        message: 'Registration not required for this event'
      });
    }

    // Check if event has capacity
    if (event.max_participants) {
      const [registrations] = await promisePool.execute(
        'SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?',
        [id]
      );

      if (registrations[0].count >= event.max_participants) {
        return res.status(400).json({
          success: false,
          message: 'Event is full'
        });
      }
    }

    // Check if already registered
    const [existingRegistrations] = await promisePool.execute(
      'SELECT id FROM event_registrations WHERE event_id = ? AND email = ?',
      [id, email]
    );

    if (existingRegistrations.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Register for event
    await promisePool.execute(
      'INSERT INTO event_registrations (event_id, name, email, phone) VALUES (?, ?, ?, ?)',
      [id, name, email, phone]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event'
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event'
    });
  }
});

// Create event (admin only)
router.post('/', [
  authenticateToken,
  requireModerator,
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('event_date').isISO8601().withMessage('Valid event date is required'),
  body('event_time').optional(),
  body('location').optional(),
  body('image_url').optional(),
  body('max_participants').optional().isInt().withMessage('Max participants must be integer'),
  body('registration_required').optional().isBoolean().withMessage('registration_required must be boolean')
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

    const { title, description, event_date, event_time, location, image_url, max_participants, registration_required = false } = req.body;

    const [result] = await promisePool.execute(`
      INSERT INTO events (title, description, event_date, event_time, location, image_url, max_participants, registration_required)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, event_date, event_time, location, image_url, max_participants, registration_required]);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// Update event (admin only)
router.put('/:id', [
  authenticateToken,
  requireModerator,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('event_date').optional().isISO8601().withMessage('Valid event date required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean')
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

    // Check if event exists
    const [events] = await promisePool.execute(
      'SELECT * FROM events WHERE id = ?',
      [id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
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
      `UPDATE events SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// Delete event (admin only)
router.delete('/:id', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await promisePool.execute(
      'DELETE FROM events WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

// Get event registrations (admin only)
router.get('/:id/registrations', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { id } = req.params;

    const [registrations] = await promisePool.execute(`
      SELECT * FROM event_registrations 
      WHERE event_id = ? 
      ORDER BY registration_date DESC
    `, [id]);

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event registrations'
    });
  }
});

module.exports = router;
