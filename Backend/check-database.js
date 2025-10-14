const mysql = require('mysql2');
require('dotenv').config();

async function checkDatabase() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'charity_foundation'
  });

  try {
    console.log('🔄 Checking database structure...');
    
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error('❌ Connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to database');
          resolve();
        }
      });
    });

    // Check existing tables
    const [tables] = await connection.promise().execute('SHOW TABLES');
    console.log('📋 Existing tables:', tables.map(table => Object.values(table)[0]));

    // Check banners table structure
    try {
      const [bannerColumns] = await connection.promise().execute('DESCRIBE banners');
      console.log('📊 Banners table structure:');
      bannerColumns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ Banners table does not exist or has issues');
    }

    // Check users table
    try {
      const [userColumns] = await connection.promise().execute('DESCRIBE users');
      console.log('👤 Users table structure:');
      userColumns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ Users table does not exist or has issues');
    }

    connection.end();
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
    connection.end();
  }
}

checkDatabase();
