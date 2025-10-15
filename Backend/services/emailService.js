const nodemailer = require('nodemailer');
const { promisePool } = require('../config/database');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Get email settings from database
  async getEmailSettings() {
    try {
      const [rows] = await promisePool.execute(
        'SELECT * FROM settings WHERE setting_type = ? LIMIT 1',
        ['email']
      );

      if (rows.length > 0) {
        return JSON.parse(rows[0].setting_value);
      }
      return null;
    } catch (error) {
      console.error('Error fetching email settings:', error);
      return null;
    }
  }

  // Create transporter with settings
  async createTransporter() {
    const settings = await this.getEmailSettings();
    
    if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPassword) {
      throw new Error('Email settings not configured');
    }

    this.transporter = nodemailer.createTransporter({
      host: settings.smtpHost,
      port: parseInt(settings.smtpPort) || 587,
      secure: parseInt(settings.smtpPort) === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    return this.transporter;
  }

  // Send test email
  async sendTestEmail(toEmail) {
    try {
      const transporter = await this.createTransporter();
      const settings = await this.getEmailSettings();

      const mailOptions = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: toEmail,
        subject: 'Test Email - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #012a23;">Test Email</h2>
            <p>This is a test email from <strong>Sallar Foundation</strong> admin panel.</p>
            <p>If you received this email, your email configuration is working correctly!</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Sent at: ${new Date().toLocaleString()}<br>
              From: ${settings.smtpHost}
            </p>
          </div>
        `
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Test email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  // Send donation confirmation email
  async sendDonationEmail(donation) {
    try {
      const settings = await this.getEmailSettings();
      if (!settings || !settings.sendDonationEmail) {
        return { success: false, message: 'Donation emails disabled' };
      }

      const transporter = await this.createTransporter();

      // Email to donor
      const donorEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: donation.email,
        subject: 'Thank You for Your Donation - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">Thank You for Your Generous Donation!</h2>
            <p>Dear ${donation.name},</p>
            <p>We are deeply grateful for your donation of <strong>${donation.amount} ${donation.currency || 'PKR'}</strong> to Sallar Foundation.</p>
            <p>Your contribution will help us continue our mission to support those in need.</p>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #012a23;">
              <p style="margin: 5px 0;"><strong>Donation Details:</strong></p>
              <p style="margin: 5px 0;">Amount: ${donation.amount} ${donation.currency || 'PKR'}</p>
              <p style="margin: 5px 0;">Date: ${new Date().toLocaleDateString()}</p>
              <p style="margin: 5px 0;">Payment Method: ${donation.payment_method || 'N/A'}</p>
            </div>

            <p>Your support makes a real difference in people's lives. Thank you for standing with us!</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Sallar Foundation Team</strong>
            </p>
          </div>
        `
      };

      // Email to admin
      const adminEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: settings.adminEmail,
        subject: 'New Donation Received - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">New Donation Received!</h2>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Donor Information:</strong></p>
              <p style="margin: 5px 0;">Name: ${donation.name}</p>
              <p style="margin: 5px 0;">Email: ${donation.email}</p>
              <p style="margin: 5px 0;">Phone: ${donation.phone || 'N/A'}</p>
              <p style="margin: 5px 0;">Amount: ${donation.amount} ${donation.currency || 'PKR'}</p>
              <p style="margin: 5px 0;">Payment Method: ${donation.payment_method || 'N/A'}</p>
              <p style="margin: 5px 0;">Message: ${donation.message || 'N/A'}</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(donorEmail);
      await transporter.sendMail(adminEmail);

      return { success: true, message: 'Donation emails sent' };
    } catch (error) {
      console.error('Error sending donation email:', error);
      return { success: false, message: error.message };
    }
  }

  // Send contact form email
  async sendContactEmail(contact) {
    try {
      const settings = await this.getEmailSettings();
      if (!settings || !settings.sendContactEmail) {
        return { success: false, message: 'Contact emails disabled' };
      }

      const transporter = await this.createTransporter();

      // Email to user
      const userEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: contact.email,
        subject: 'We Received Your Message - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">Thank You for Contacting Us!</h2>
            <p>Dear ${contact.name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #012a23;">
              <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
              <p style="margin: 10px 0;">${contact.message}</p>
            </div>

            <p>We typically respond within 24-48 hours.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Sallar Foundation Team</strong>
            </p>
          </div>
        `
      };

      // Email to admin
      const adminEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: settings.adminEmail,
        subject: 'New Contact Form Submission - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">New Contact Form Submission!</h2>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Contact Information:</strong></p>
              <p style="margin: 5px 0;">Name: ${contact.name}</p>
              <p style="margin: 5px 0;">Email: ${contact.email}</p>
              <p style="margin: 5px 0;">Phone: ${contact.phone || 'N/A'}</p>
              <p style="margin: 5px 0;">Subject: ${contact.subject || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0;">${contact.message}</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(userEmail);
      await transporter.sendMail(adminEmail);

      return { success: true, message: 'Contact emails sent' };
    } catch (error) {
      console.error('Error sending contact email:', error);
      return { success: false, message: error.message };
    }
  }

  // Send volunteer application email
  async sendVolunteerEmail(volunteer) {
    try {
      const settings = await this.getEmailSettings();
      if (!settings || !settings.sendVolunteerEmail) {
        return { success: false, message: 'Volunteer emails disabled' };
      }

      const transporter = await this.createTransporter();

      // Email to volunteer
      const volunteerEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: volunteer.email,
        subject: 'Thank You for Volunteering - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">Thank You for Your Interest in Volunteering!</h2>
            <p>Dear ${volunteer.name},</p>
            <p>We are excited to receive your volunteer application. Your willingness to give your time and skills to help others is truly appreciated.</p>
            
            <p>Our team will review your application and contact you soon with next steps.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Sallar Foundation Team</strong>
            </p>
          </div>
        `
      };

      // Email to admin
      const adminEmail = {
        from: `"Sallar Foundation" <${settings.smtpUser}>`,
        to: settings.adminEmail,
        subject: 'New Volunteer Application - Sallar Foundation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #012a23;">New Volunteer Application!</h2>
            
            <div style="background: #f8f9fa; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Volunteer Information:</strong></p>
              <p style="margin: 5px 0;">Name: ${volunteer.name}</p>
              <p style="margin: 5px 0;">Email: ${volunteer.email}</p>
              <p style="margin: 5px 0;">Phone: ${volunteer.phone || 'N/A'}</p>
              <p style="margin: 5px 0;">Skills: ${volunteer.skills || 'N/A'}</p>
              <p style="margin: 5px 0;">Availability: ${volunteer.availability || 'N/A'}</p>
              <p style="margin: 10px 0;"><strong>Message:</strong></p>
              <p style="margin: 10px 0;">${volunteer.message || 'N/A'}</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(volunteerEmail);
      await transporter.sendMail(adminEmail);

      return { success: true, message: 'Volunteer emails sent' };
    } catch (error) {
      console.error('Error sending volunteer email:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = new EmailService();

