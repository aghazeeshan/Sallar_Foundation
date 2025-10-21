# Sallar Foundation - Complete Project Documentation

## 📋 Project Overview

**Sallar Foundation** is a comprehensive charity management system built with modern web technologies. The project includes a React frontend, Node.js backend, and MySQL database, all containerized with Docker for easy deployment.

## 🎯 Project Features

### **Frontend Features:**
- ✅ **Responsive Website** - Modern, mobile-friendly design
- ✅ **Home Page** - Hero section, services, gallery, blog section
- ✅ **Blog System** - Dynamic blog posts with categories
- ✅ **Gallery** - Image gallery with lightbox
- ✅ **Contact Form** - User inquiry system
- ✅ **Admin Dashboard** - Complete management system
- ✅ **Image Upload** - File upload for blogs and gallery
- ✅ **Authentication** - Secure admin login system

### **Backend Features:**
- ✅ **REST API** - Complete API endpoints
- ✅ **Database Management** - MySQL with proper schema
- ✅ **File Upload** - Image upload with multer
- ✅ **Authentication** - JWT-based admin authentication
- ✅ **Data Validation** - Input validation and sanitization
- ✅ **Error Handling** - Comprehensive error management

### **Admin Features:**
- ✅ **Blog Management** - Add, edit, delete blog posts
- ✅ **Gallery Management** - Upload and manage images
- ✅ **Banner Management** - Homepage banner management
- ✅ **Service Management** - Service offerings management
- ✅ **User Management** - Admin user management
- ✅ **Settings** - System configuration

## 🏗️ Technical Architecture

### **Frontend Stack:**
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **CSS3** - Custom styling with CSS variables
- **Font Awesome** - Icon library
- **Swiper.js** - Image carousel
- **LocalStorage** - Client-side data storage

### **Backend Stack:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### **Database Schema:**
```sql
-- Admin Users
admin_users (id, username, password, email, role, is_active, created_at)

-- Banners
banners (id, title, description, image_url, is_active, created_at)

-- Services
services (id, title, description, icon, is_active, created_at)

-- Gallery
gallery (id, title, image_url, created_at)

-- Contact Form
contact_submissions (id, name, email, message, created_at)
```

## 📁 Project Structure

```
sallar/
├── Backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin API routes
│   │   ├── bannerRoutes.js      # Banner management
│   │   ├── serviceRoutes.js     # Service management
│   │   ├── galleryRoutes.js     # Gallery management
│   │   └── contactRoutes.js     # Contact form
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── uploads/                 # File uploads directory
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
├── frontend/
│   ├── public/
│   │   ├── images/              # Static images
│   │   └── index.html           # HTML template
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── admin/               # Admin dashboard
│   │   ├── services/            # API services
│   │   └── App.js               # Main app component
│   └── package.json             # Frontend dependencies
├── deploy/                      # Deployment scripts
├── nginx/                       # Nginx configuration
├── docker-compose.yml           # Docker configuration
├── docker-compose.prod.yml      # Production configuration
└── docker-compose.override.yml  # Local development
```

## 🚀 Deployment Guide

### **Local Development:**
```bash
# Clone repository
git clone https://github.com/aghazeeshan/Sallar_Foundation.git
cd Sallar_Foundation

# Start with Docker
docker-compose up -d --build

# Access application
# Frontend: http://localhost:4000
# Backend: http://localhost:4010
# Admin: http://localhost:4000/development
```

### **VPS Production Deployment:**
```bash
# Connect to VPS
ssh root@your-vps-ip

# Clone and setup
git clone https://github.com/aghazeeshan/Sallar_Foundation.git /var/www/sallar
cd /var/www/sallar
git checkout sallar

# Run complete setup
chmod +x deploy/*.sh
sudo ./deploy/complete-vps-setup.sh

# Configure environment
cp env.prod .env
nano .env  # Edit with your values

# Deploy application
./deploy/vps-deploy.sh
```

## 🔧 Configuration

### **Environment Variables:**
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_DATABASE=charity_foundation
MYSQL_USER=charity_user
MYSQL_PASSWORD=your_password

# Backend Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://sallarfoundation.org

# Port Configuration
FRONTEND_PORT=4000
BACKEND_PORT=4010
DATABASE_PORT=4020

# Domain Configuration
DOMAIN=sallarfoundation.org
EMAIL=admin@sallarfoundation.org
```

### **Port Configuration:**
- **Frontend**: 4000 (was 3075)
- **Backend**: 4010 (was 5075)
- **Database**: 4020 (was 3307)

## 📱 Admin Dashboard Features

### **Blog Management:**
- ✅ Add new blog posts
- ✅ Upload images from laptop
- ✅ Use image URLs
- ✅ Categorize posts
- ✅ Edit/Delete posts
- ✅ Preview functionality

### **Gallery Management:**
- ✅ Upload multiple images
- ✅ Image preview
- ✅ Delete images
- ✅ Organize gallery

### **Banner Management:**
- ✅ Homepage banners
- ✅ Image upload
- ✅ Active/Inactive status
- ✅ Order management

### **Service Management:**
- ✅ Service offerings
- ✅ Icons and descriptions
- ✅ Active/Inactive status
- ✅ Order management

## 🔐 Security Features

### **Authentication:**
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Session management
- ✅ Role-based access control

### **File Upload Security:**
- ✅ File type validation
- ✅ File size limits (5MB)
- ✅ Secure file naming
- ✅ Upload directory protection

### **API Security:**
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Rate limiting

## 📊 Database Information

### **Default Admin Credentials:**
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `super_admin`

### **Database Tables:**
1. **admin_users** - Admin user accounts
2. **banners** - Homepage banners
3. **services** - Service offerings
4. **gallery** - Image gallery
5. **contact_submissions** - Contact form submissions

## 🌐 URLs and Endpoints

### **Frontend URLs:**
- **Homepage**: `https://sallarfoundation.org`
- **Blog Page**: `https://sallarfoundation.org/events`
- **Gallery**: `https://sallarfoundation.org/gallery`
- **Contact**: `https://sallarfoundation.org/contact`
- **Admin**: `https://sallarfoundation.org/development`

### **API Endpoints:**
- **Health Check**: `GET /api/health`
- **Admin Login**: `POST /api/admin/login`
- **Image Upload**: `POST /api/admin/upload`
- **Banners**: `GET/POST /api/banners`
- **Services**: `GET/POST /api/services`
- **Gallery**: `GET/POST /api/gallery`
- **Contact**: `POST /api/contact`

## 🛠️ Development Commands

### **Backend Development:**
```bash
cd Backend
npm install
npm run dev
```

### **Frontend Development:**
```bash
cd frontend
npm install
npm start
```

### **Docker Commands:**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

## 📈 Performance Features

### **Frontend Optimization:**
- ✅ Lazy loading for images
- ✅ Code splitting
- ✅ Optimized bundle size
- ✅ Responsive design
- ✅ Fast loading times

### **Backend Optimization:**
- ✅ Database indexing
- ✅ Efficient queries
- ✅ File compression
- ✅ Caching strategies
- ✅ Error handling

## 🔄 Update Process

### **Local Updates:**
```bash
git pull origin sallar
docker-compose up -d --build
```

### **VPS Updates:**
```bash
cd /var/www/sallar
git pull origin sallar
./deploy/vps-deploy.sh
```

## 📞 Support Information

### **Project Details:**
- **Repository**: https://github.com/aghazeeshan/Sallar_Foundation
- **Branch**: `sallar`
- **Domain**: https://sallarfoundation.org
- **Admin URL**: https://sallarfoundation.org/development

### **Technical Support:**
- **Docker**: Containerized deployment
- **Nginx**: Web server and reverse proxy
- **SSL**: Let's Encrypt certificates
- **Backup**: Database and file backups

## 🎉 Project Status

### **Completed Features:**
✅ Complete website with responsive design  
✅ Admin dashboard with full functionality  
✅ Blog management with image upload  
✅ Gallery management system  
✅ Contact form with email notifications  
✅ Docker containerization  
✅ VPS deployment automation  
✅ SSL certificate setup  
✅ Database management  
✅ File upload system  

### **Ready for Production:**
✅ All features implemented and tested  
✅ Docker setup for easy deployment  
✅ VPS deployment scripts ready  
✅ SSL configuration complete  
✅ Database schema optimized  
✅ Security measures implemented  

## 📝 Notes

- **Image Upload**: Supports jpg, png, gif, webp formats
- **File Size Limit**: 5MB maximum per image
- **Database**: MySQL with proper indexing
- **Authentication**: JWT tokens with 365-day expiry
- **Deployment**: One-command deployment to VPS
- **Backup**: Automatic database backups
- **Monitoring**: Health check endpoints

---

**Project Status**: ✅ **COMPLETE & READY FOR PRODUCTION**

**Last Updated**: October 21, 2025  
**Version**: 1.0.0  
**Maintainer**: Sallar Foundation Development Team
