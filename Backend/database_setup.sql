-- Charity Foundation Database Setup
-- This file contains the complete database schema

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS charity_foundation;
USE charity_foundation;

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Separate admin users table used by admin routes
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog posts table
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
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog post categories (many-to-many relationship)
CREATE TABLE IF NOT EXISTS blog_post_categories (
    post_id INT,
    category_id INT,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Banners table for homepage banners (matches routes' columns)
CREATE TABLE IF NOT EXISTS banners (
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
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    image_url VARCHAR(255),
    max_participants INT,
    registration_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Donations table (matches donationRoutes expectations)
CREATE TABLE IF NOT EXISTS donations (
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
);

-- Volunteers (matches volunteerRoutes expectations)
CREATE TABLE IF NOT EXISTS volunteers (
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
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    replied_at TIMESTAMP NULL
);

-- Contact forms (matches contactFormRoutes expectations)
CREATE TABLE IF NOT EXISTS contact_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    subject VARCHAR(255) NULL,
    message TEXT NOT NULL,
    status ENUM('new','read','replied','closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@charityfoundation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert default admin for admin_users as well
INSERT INTO admin_users (username, email, password, role, is_active) VALUES 
('admin', 'admin@charityfoundation.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE)
ON DUPLICATE KEY UPDATE username=username;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES 
('Health', 'health', 'Health-related blog posts and articles'),
('Education', 'education', 'Educational content and resources'),
('Community', 'community', 'Community development and outreach'),
('Events', 'events', 'Upcoming events and activities')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample banner
INSERT INTO banners (title, sub_heading, description, image_url, button_text, button_link, text_alignment, is_active, display_order) VALUES 
('Welcome to Charity Foundation', 'Together We Can', 'Making a difference in our community through compassion and action', '/images/banner1.jpg', 'Learn More', '/about', 'center', TRUE, 1)
ON DUPLICATE KEY UPDATE title=title;

-- Insert sample blog post
INSERT INTO blog_posts (title, slug, content, excerpt, author_id, status, published_at) VALUES 
('Welcome to Our Foundation', 'welcome-to-our-foundation', 'This is our first blog post. We are excited to share our journey with you.', 'Welcome message from our foundation', 1, 'published', NOW())
ON DUPLICATE KEY UPDATE title=title;
