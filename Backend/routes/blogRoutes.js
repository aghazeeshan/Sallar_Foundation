const express = require('express');
const router = express.Router();
const db = require('../db'); // Import your database connection

// Create a new post
router.post('/posts', (req, res) => {
    console.log(req.body); // Log the request body
    const { title, category, date, image, description, content, tags, highlights } = req.body;
    const query = 'INSERT INTO posts (title, category, date, image, description, content, tags, highlights) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [title, category, date, image, description, content, tags, highlights], (err, result) => {
        if (err) {
            console.error('Database error:', err); // Log the error
            return res.status(500).json({ message: 'Error saving post', error: err });
        }
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
    });
});

module.exports = router; 