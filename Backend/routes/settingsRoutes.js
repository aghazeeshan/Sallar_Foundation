const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken, requireModerator } = require('../middleware/auth');
const { promisePool } = require('../config/database');
const emailService = require('../services/emailService');

// Multer configuration for logo uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/logos';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|ico/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get theme settings
router.get('/theme', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM settings WHERE setting_type = ? LIMIT 1',
      ['theme']
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        data: JSON.parse(rows[0].setting_value)
      });
    } else {
      // Return default theme
      res.json({
        success: true,
        data: {
          primaryColor: '#012a23',
          secondaryColor: '#eb9801',
          textDark: '#333333',
          textLight: '#666666'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    res.status(500).json({ success: false, message: 'Error fetching theme settings' });
  }
});

// Save theme settings
router.post('/theme', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const themeData = JSON.stringify(req.body);
    
    const [existing] = await promisePool.execute(
      'SELECT id FROM settings WHERE setting_type = ?',
      ['theme']
    );

    if (existing.length > 0) {
      await promisePool.execute(
        'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_type = ?',
        [themeData, 'theme']
      );
    } else {
      await promisePool.execute(
        'INSERT INTO settings (setting_type, setting_value) VALUES (?, ?)',
        ['theme', themeData]
      );
    }

    res.json({ success: true, message: 'Theme settings saved successfully' });
  } catch (error) {
    console.error('Error saving theme settings:', error);
    res.status(500).json({ success: false, message: 'Error saving theme settings' });
  }
});

// Get logo settings
router.get('/logo', async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM settings WHERE setting_type = ? LIMIT 1',
      ['logo']
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        data: JSON.parse(rows[0].setting_value)
      });
    } else {
      res.json({
        success: true,
        data: {
          headerLogo: '/images/sallar_logo.png',
          stickyLogo: '/images/sticky_logo.png',
          footerLogo: '/images/sticky_logo.png',
          favicon: '/favicon.ico'
        }
      });
    }
  } catch (error) {
    console.error('Error fetching logo settings:', error);
    res.status(500).json({ success: false, message: 'Error fetching logo settings' });
  }
});

// Save logo settings
router.post('/logo', [
  authenticateToken,
  requireModerator,
  upload.fields([
    { name: 'headerLogo', maxCount: 1 },
    { name: 'stickyLogo', maxCount: 1 },
    { name: 'footerLogo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ])
], async (req, res) => {
  try {
    const logoData = {};

    // Get existing logo settings
    const [existing] = await promisePool.execute(
      'SELECT setting_value FROM settings WHERE setting_type = ?',
      ['logo']
    );

    const existingData = existing.length > 0 ? JSON.parse(existing[0].setting_value) : {};

    // Process uploaded files
    if (req.files) {
      if (req.files.headerLogo) {
        logoData.headerLogo = '/uploads/logos/' + req.files.headerLogo[0].filename;
      } else {
        logoData.headerLogo = existingData.headerLogo || '';
      }

      if (req.files.stickyLogo) {
        logoData.stickyLogo = '/uploads/logos/' + req.files.stickyLogo[0].filename;
      } else {
        logoData.stickyLogo = existingData.stickyLogo || '';
      }

      if (req.files.footerLogo) {
        logoData.footerLogo = '/uploads/logos/' + req.files.footerLogo[0].filename;
      } else {
        logoData.footerLogo = existingData.footerLogo || '';
      }

      if (req.files.favicon) {
        logoData.favicon = '/uploads/logos/' + req.files.favicon[0].filename;
      } else {
        logoData.favicon = existingData.favicon || '';
      }
    }

    const logoDataString = JSON.stringify(logoData);

    if (existing.length > 0) {
      await promisePool.execute(
        'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_type = ?',
        [logoDataString, 'logo']
      );
    } else {
      await promisePool.execute(
        'INSERT INTO settings (setting_type, setting_value) VALUES (?, ?)',
        ['logo', logoDataString]
      );
    }

    res.json({ 
      success: true, 
      message: 'Logo settings saved successfully',
      data: logoData
    });
  } catch (error) {
    console.error('Error saving logo settings:', error);
    res.status(500).json({ success: false, message: 'Error saving logo settings' });
  }
});

// Get email settings
router.get('/email', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM settings WHERE setting_type = ? LIMIT 1',
      ['email']
    );

    if (rows.length > 0) {
      res.json({
        success: true,
        data: JSON.parse(rows[0].setting_value)
      });
    } else {
      res.json({
        success: true,
        data: {
          adminEmail: '',
          smtpHost: '',
          smtpPort: '587',
          smtpUser: '',
          smtpPassword: '',
          sendDonationEmail: true,
          sendContactEmail: true,
          sendVolunteerEmail: true
        }
      });
    }
  } catch (error) {
    console.error('Error fetching email settings:', error);
    res.status(500).json({ success: false, message: 'Error fetching email settings' });
  }
});

// Save email settings
router.post('/email', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const emailData = JSON.stringify(req.body);
    
    const [existing] = await promisePool.execute(
      'SELECT id FROM settings WHERE setting_type = ?',
      ['email']
    );

    if (existing.length > 0) {
      await promisePool.execute(
        'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_type = ?',
        [emailData, 'email']
      );
    } else {
      await promisePool.execute(
        'INSERT INTO settings (setting_type, setting_value) VALUES (?, ?)',
        ['email', emailData]
      );
    }

    res.json({ success: true, message: 'Email settings saved successfully' });
  } catch (error) {
    console.error('Error saving email settings:', error);
    res.status(500).json({ success: false, message: 'Error saving email settings' });
  }
});

// Send test email
router.post('/email/test', [authenticateToken, requireModerator], async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }

    const result = await emailService.sendTestEmail(email);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: 'Test email sent successfully! Check your inbox (and spam folder).' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: result.message || 'Failed to send test email'
      });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email: ' + error.message 
    });
  }
});

module.exports = router;

