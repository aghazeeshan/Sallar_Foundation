const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465, // Use 465 for SSL
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@sallarfoundation.org', // Your email address
        pass: 'Sallar123!@#', // Your email password
    },
    logger: true, // Enable logging
    debug: true, // Enable debug output
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'info@sallarfoundation.org', // Sender address
        to: to, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;