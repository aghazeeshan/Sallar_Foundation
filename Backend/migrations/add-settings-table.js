const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSettingsTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'charity_foundation'
    });

    console.log('Connected to database');

    // Create settings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_type VARCHAR(50) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_setting_type (setting_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✓ Settings table created successfully');

    // Insert default settings
    await connection.execute(`
      INSERT INTO settings (setting_type, setting_value) VALUES 
      ('theme', '{"primaryColor":"#012a23","secondaryColor":"#eb9801","textDark":"#333333","textLight":"#666666"}'),
      ('logo', '{"headerLogo":"/images/sallar_logo.png","stickyLogo":"/images/sticky_logo.png","footerLogo":"/images/sticky_logo.png","favicon":"/favicon.ico"}'),
      ('email', '{"adminEmail":"","smtpHost":"","smtpPort":"587","smtpUser":"","smtpPassword":"","sendDonationEmail":true,"sendContactEmail":true,"sendVolunteerEmail":true}')
      ON DUPLICATE KEY UPDATE setting_type=setting_type;
    `);

    console.log('✓ Default settings inserted');

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migration
addSettingsTable()
  .then(() => {
    console.log('\nSettings table migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration error:', error);
    process.exit(1);
  });

