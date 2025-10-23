const { promisePool } = require('./config/database');

async function setupEmailConfig() {
  try {
    console.log('Setting up Hostinger SMTP configuration...');
    
    const emailConfig = {
      adminEmail: 'info@sallarfoundation.org',
      smtpHost: 'smtp.hostinger.com',
      smtpPort: '587',
      smtpUser: 'info@sallarfoundation.org',
      smtpPassword: 'InfoAdmin123!@#',
      sendDonationEmail: true,
      sendContactEmail: true,
      sendVolunteerEmail: true
    };

    // Check if email settings already exist
    const [existing] = await promisePool.execute(
      'SELECT id FROM settings WHERE setting_type = ?',
      ['email']
    );

    if (existing.length > 0) {
      // Update existing settings
      await promisePool.execute(
        'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_type = ?',
        [JSON.stringify(emailConfig), 'email']
      );
      console.log('✅ Email settings updated successfully');
    } else {
      // Insert new settings
      await promisePool.execute(
        'INSERT INTO settings (setting_type, setting_value) VALUES (?, ?)',
        ['email', JSON.stringify(emailConfig)]
      );
      console.log('✅ Email settings created successfully');
    }

    console.log('📧 SMTP Configuration:');
    console.log(`   Host: ${emailConfig.smtpHost}`);
    console.log(`   Port: ${emailConfig.smtpPort}`);
    console.log(`   User: ${emailConfig.smtpUser}`);
    console.log(`   Admin Email: ${emailConfig.adminEmail}`);
    console.log('   Email Notifications: Enabled for all forms');
    
    console.log('\n🎉 Email configuration completed!');
    console.log('Now when users submit forms, both user and admin will receive emails.');
    
  } catch (error) {
    console.error('❌ Error setting up email configuration:', error);
  } finally {
    process.exit(0);
  }
}

setupEmailConfig();
