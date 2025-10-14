const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection for setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

// Read SQL file
const sqlFile = fs.readFileSync(path.join(__dirname, 'database_setup.sql'), 'utf8');

async function ensureDatabaseSelected() {
  // Create database if needed, then USE it
  const dbName = process.env.DB_NAME || 'charity_foundation';
  await new Promise((resolve, reject) => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  await new Promise((resolve, reject) => {
    connection.query(`USE ${dbName}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function columnExists(tableName, columnName) {
  return new Promise((resolve) => {
    connection.query(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [columnName], (err, results) => {
      if (err) return resolve(false);
      resolve(results && results.length > 0);
    });
  });
}

async function tableExists(tableName) {
  return new Promise((resolve) => {
    connection.query(`SHOW TABLES LIKE ?`, [tableName], (err, results) => {
      if (err) return resolve(false);
      resolve(results && results.length > 0);
    });
  });
}

async function addColumnIfMissing(tableName, columnName, columnDefinition) {
  const exists = await columnExists(tableName, columnName);
  if (!exists) {
    await new Promise((resolve, reject) => {
      connection.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    console.log(`✅ Added column ${tableName}.${columnName}`);
  }
}

async function createTableIfMissing(tableName, createSql) {
  const exists = await tableExists(tableName);
  if (!exists) {
    await new Promise((resolve, reject) => {
      connection.query(createSql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    console.log(`✅ Created table ${tableName}`);
  }
}

async function runLightweightMigrations() {
  await ensureDatabaseSelected();

  // Ensure admin_users table exists
  await createTableIfMissing('admin_users', `
    CREATE TABLE admin_users (
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

  // Ensure contact_forms table exists
  await createTableIfMissing('contact_forms', `
    CREATE TABLE contact_forms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NULL,
      subject VARCHAR(255) NULL,
      message TEXT NOT NULL,
      status ENUM('new','read','replied','closed') DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ensure volunteers table exists
  await createTableIfMissing('volunteers', `
    CREATE TABLE volunteers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NULL,
      age INT NULL,
      address TEXT NULL,
      skills TEXT NULL,
      experience TEXT NULL,
      availability TEXT NULL,
      motivation TEXT NULL,
      emergency_contact VARCHAR(100) NULL,
      emergency_phone VARCHAR(20) NULL,
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ensure donations table exists
  await createTableIfMissing('donations', `
    CREATE TABLE donations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      donor_name VARCHAR(100) NOT NULL,
      donor_email VARCHAR(100) NOT NULL,
      donor_phone VARCHAR(20) NULL,
      donor_country VARCHAR(100) NULL,
      amount DECIMAL(10,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      payment_method VARCHAR(50) NULL,
      donation_type VARCHAR(50) NULL,
      message TEXT NULL,
      is_anonymous BOOLEAN DEFAULT FALSE,
      transaction_id VARCHAR(255),
      status ENUM('pending','completed','failed') DEFAULT 'completed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ensure banners table exists
  await createTableIfMissing('banners', `
    CREATE TABLE banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      sub_heading VARCHAR(255) NULL,
      description TEXT,
      image_url VARCHAR(255) NOT NULL,
      button_text VARCHAR(100),
      button_link VARCHAR(255),
      text_alignment ENUM('left','center','right') DEFAULT 'center',
      is_active BOOLEAN DEFAULT TRUE,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Add missing columns to existing tables (no-op if already present)
  await addColumnIfMissing('banners', 'sub_heading', 'VARCHAR(255) NULL');
  await addColumnIfMissing('banners', 'button_link', 'VARCHAR(255) NULL');
  await addColumnIfMissing('banners', 'text_alignment', "ENUM('left','center','right') DEFAULT 'center'");
  await addColumnIfMissing('banners', 'display_order', 'INT DEFAULT 0');

  await addColumnIfMissing('donations', 'donor_phone', 'VARCHAR(20) NULL');
  await addColumnIfMissing('donations', 'donor_country', 'VARCHAR(100) NULL');
  await addColumnIfMissing('donations', 'currency', "VARCHAR(10) DEFAULT 'USD'");
  await addColumnIfMissing('donations', 'payment_method', 'VARCHAR(50) NULL');
  await addColumnIfMissing('donations', 'donation_type', 'VARCHAR(50) NULL');
  await addColumnIfMissing('donations', 'message', 'TEXT NULL');
  await addColumnIfMissing('donations', 'is_anonymous', 'BOOLEAN DEFAULT FALSE');
  await addColumnIfMissing('donations', 'status', "ENUM('pending','completed','failed') DEFAULT 'completed'");
  await addColumnIfMissing('donations', 'created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
}

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Test connection
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error('❌ MySQL connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to MySQL successfully');
          resolve();
        }
      });
    });

    console.log('🔄 Ensuring database/tables/columns exist...');
    await runLightweightMigrations();

    console.log('🔄 Applying full SQL schema (idempotent where possible)...');
    await new Promise((resolve, reject) => {
      connection.query(sqlFile, (err) => {
        if (err) {
          console.error('❌ Database setup failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Database and tables created successfully');
          resolve();
        }
      });
    });

    console.log('🔄 Inserting sample data...');
    
    // Test the new database connection
    const testConnection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'charity_foundation'
    });

    await new Promise((resolve, reject) => {
      testConnection.connect((err) => {
        if (err) {
          console.error('❌ Test connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Database setup completed successfully!');
          console.log('📊 Database: charity_foundation');
          console.log('👤 Default admin: username=admin, password=admin123');
          console.log('🌐 You can now start the server with: npm start');
          resolve();
        }
      });
    });

    testConnection.end();
    connection.end();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure XAMPP MySQL is running');
    console.log('2. Check your .env file configuration');
    console.log('3. Ensure MySQL port 3306 is not blocked');
    process.exit(1);
  }
}

setupDatabase();
