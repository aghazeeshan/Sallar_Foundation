const mysql = require('mysql2');
require('dotenv').config();

// Database connection for setup
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

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

    console.log('🔄 Creating database...');
    
    // Create database
    await new Promise((resolve, reject) => {
      connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'charity_foundation'}`, (err) => {
        if (err) {
          console.error('❌ Database creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Database created/verified successfully');
          resolve();
        }
      });
    });

    // Switch to the database
    await new Promise((resolve, reject) => {
      connection.query(`USE ${process.env.DB_NAME || 'charity_foundation'}`, (err) => {
        if (err) {
          console.error('❌ Database selection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Database selected successfully');
          resolve();
        }
      });
    });

    console.log('🔄 Creating tables...');
    
    // Create users table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'moderator') DEFAULT 'admin',
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Users table creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Users table created');
          resolve();
        }
      });
    });

    // Create blog_posts table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          featured_image VARCHAR(255),
          author_id INT,
          status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
          published_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `, (err) => {
        if (err) {
          console.error('❌ Blog posts table creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Blog posts table created');
          resolve();
        }
      });
    });

    // Create banners table
    await new Promise((resolve, reject) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS banners (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(255) NOT NULL,
          link_url VARCHAR(255),
          button_text VARCHAR(100),
          is_active BOOLEAN DEFAULT TRUE,
          display_order INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Banners table creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Banners table created');
          resolve();
        }
      });
    });

    // Insert default admin user
    await new Promise((resolve, reject) => {
      connection.query(`
        INSERT IGNORE INTO users (username, email, password, role) VALUES 
        ('admin', 'admin@charityfoundation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
      `, (err) => {
        if (err) {
          console.error('❌ Admin user creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Default admin user created');
          resolve();
        }
      });
    });

    // Insert sample banner
    await new Promise((resolve, reject) => {
      connection.query(`
        INSERT IGNORE INTO banners (title, description, image_url, link_url, button_text, is_active, display_order) VALUES 
        ('Welcome to Charity Foundation', 'Making a difference in our community through compassion and action', '/images/banner1.jpg', '/about', 'Learn More', TRUE, 1)
      `, (err) => {
        if (err) {
          console.error('❌ Sample banner creation failed:', err.message);
          reject(err);
        } else {
          console.log('✅ Sample banner created');
          resolve();
        }
      });
    });

    connection.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📊 Database: charity_foundation');
    console.log('👤 Default admin: username=admin, password=admin123');
    console.log('🌐 You can now start the server with: npm start');
    
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
