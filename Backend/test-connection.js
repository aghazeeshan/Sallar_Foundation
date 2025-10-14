const mysql = require('mysql2');
require('dotenv').config();

async function testConnection() {
  console.log('🔄 Testing database connection...');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`User: ${process.env.DB_USER || 'root'}`);
  console.log(`Database: ${process.env.DB_NAME || 'charity_foundation'}`);
  
  try {
    // Test basic connection
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error('❌ MySQL connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ MySQL connection successful');
          resolve();
        }
      });
    });

    // Test database access
    const dbConnection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'charity_foundation'
    });

    await new Promise((resolve, reject) => {
      dbConnection.connect((err) => {
        if (err) {
          console.error('❌ Database access failed:', err.message);
          console.log('💡 Run: node setup-database.js to create the database');
          reject(err);
        } else {
          console.log('✅ Database access successful');
          resolve();
        }
      });
    });

    // Test tables
    const [tables] = await dbConnection.promise().execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(table => Object.values(table)[0]));

    dbConnection.end();
    connection.end();
    
    console.log('🎉 All tests passed! Database is ready.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. XAMPP MySQL is running');
    console.log('2. MySQL service is started in XAMPP Control Panel');
    console.log('3. No password is set for root user (or update .env file)');
    process.exit(1);
  }
}

testConnection();
