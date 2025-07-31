const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sendEmail = require('./mailer');
const connectDB = require('./db'); // Import the database connection function
require('dotenv').config();
const path = require('path');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Model for form submissions
const Submission = require('./models/Submission'); // Assuming you have this model

// Route to handle form submissions
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newSubmission = new Submission({ name, email, message });
        await newSubmission.save();

        await sendEmail('info@sallarfoundation.org', 'New Form Submission', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
        res.status(200).send('Form submitted and email sent successfully!');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});