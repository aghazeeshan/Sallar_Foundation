const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'charity_foundation';

  // New admin credentials (override via env if needed)
  const newUsername = process.env.NEW_ADMIN_USERNAME || 'admin_dev';
  const newEmail = process.env.NEW_ADMIN_EMAIL || 'admin@sallarfoundation.org';
  const newPasswordPlain = process.env.NEW_ADMIN_PASSWORD || 'Admin@2025!';

  try {
    const conn = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName
    });

    const hashed = await bcrypt.hash(newPasswordPlain, 10);

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','moderator') DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Upsert by username
    const [existing] = await conn.execute(
      'SELECT id FROM admin_users WHERE username = ? LIMIT 1',
      [newUsername]
    );

    if (existing.length > 0) {
      await conn.execute(
        'UPDATE admin_users SET email = ?, password = ?, role = "admin", is_active = TRUE WHERE id = ?',
        [newEmail, hashed, existing[0].id]
      );
      console.log('✅ Updated existing admin user');
    } else {
      // If another admin exists, update first admin row, otherwise insert new
      const [anyAdmin] = await conn.execute('SELECT id FROM admin_users ORDER BY id ASC LIMIT 1');
      if (anyAdmin.length > 0) {
        await conn.execute(
          'UPDATE admin_users SET username = ?, email = ?, password = ?, role = "admin", is_active = TRUE WHERE id = ?',
          [newUsername, newEmail, hashed, anyAdmin[0].id]
        );
        console.log('✅ Updated first admin user');
      } else {
        await conn.execute(
          'INSERT INTO admin_users (username, email, password, role, is_active) VALUES (?, ?, ?, "admin", TRUE)',
          [newUsername, newEmail, hashed]
        );
        console.log('✅ Inserted new admin user');
      }
    }

    console.log('👤 Username:', newUsername);
    console.log('🔑 Password:', newPasswordPlain);

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update admin credentials:', err.message);
    process.exit(1);
  }
})();
