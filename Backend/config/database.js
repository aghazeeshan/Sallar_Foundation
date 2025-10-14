const mysql = require('mysql2');
require('dotenv').config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'charity_foundation',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Create database if it doesn't exist
const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'charity_foundation'}`);
    console.log('✅ Database created/verified successfully');
    connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  promisePool,
  testConnection,
  createDatabase
};
