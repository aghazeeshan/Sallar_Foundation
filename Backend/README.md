# Charity Foundation Backend API

A complete Node.js backend API for the Charity Foundation website with MySQL database integration.

## 🚀 Features

- **Authentication System**: JWT-based authentication with admin/moderator roles
- **Blog Management**: Create, read, update, delete blog posts with categories
- **Banner Management**: Dynamic homepage banners with image support
- **Event Management**: Event creation, registration, and management
- **Donation System**: Donation tracking and payment status management
- **Volunteer Applications**: Volunteer registration and approval system
- **Contact System**: Contact form submissions and management
- **Gallery Management**: Image gallery with categories and featured images
- **Security**: Rate limiting, CORS, helmet security, input validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (XAMPP recommended)
- npm or yarn

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env` file

3. **Database Setup**
   ```bash
   # Test database connection
   node test-connection.js
   
   # Setup database (if needed)
   node setup-simple.js
   ```

4. **Start Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=charity_foundation
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Database Configuration
The API is configured to work with your existing XAMPP MySQL database. It automatically detects and adapts to your existing table structure.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Blog Management
- `GET /api/blog` - Get all published posts
- `GET /api/blog/:slug` - Get single post
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)
- `DELETE /api/blog/:id` - Delete post (admin)

### Banner Management
- `GET /api/banner` - Get active banners
- `GET /api/banner/admin` - Get all banners (admin)
- `POST /api/banner` - Create banner (admin)
- `PUT /api/banner/:id` - Update banner (admin)
- `DELETE /api/banner/:id` - Delete banner (admin)

### Events
- `GET /api/events` - Get active events
- `GET /api/events/:id` - Get single event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### Donations
- `POST /api/donations` - Submit donation
- `GET /api/donations` - Get all donations (admin)
- `GET /api/donations/:id` - Get single donation (admin)
- `PUT /api/donations/:id/status` - Update donation status (admin)

### Volunteers
- `POST /api/volunteers` - Submit volunteer application
- `GET /api/volunteers` - Get all applications (admin)
- `GET /api/volunteers/:id` - Get single application (admin)
- `PUT /api/volunteers/:id/status` - Update application status (admin)

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (admin)
- `GET /api/contact/:id` - Get single message (admin)
- `PUT /api/contact/:id/status` - Update message status (admin)

### Gallery
- `GET /api/gallery` - Get gallery images
- `GET /api/gallery/:id` - Get single image
- `POST /api/gallery` - Create image (admin)
- `PUT /api/gallery/:id` - Update image (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

## 🔐 Default Admin Account

- **Username**: admin
- **Password**: admin123
- **Email**: admin@charityfoundation.com

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Database Connection
```bash
node test-connection.js
```

### Test Server
```bash
node test-server.js
```

## 📁 Project Structure

```
Backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Route controllers
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/                  # Database models
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── bannerRoutes.js
│   ├── blogRoutes.js
│   ├── contactRoutes.js
│   ├── donationRoutes.js
│   ├── eventRoutes.js
│   ├── galleryRoutes.js
│   └── volunteerRoutes.js
├── .env                     # Environment variables
├── database_setup.sql      # Database schema
├── server.js               # Main server file
└── package.json            # Dependencies
```

## 🚀 Deployment

1. **Production Environment**
   ```bash
   NODE_ENV=production npm start
   ```

2. **Environment Variables**
   - Update `.env` with production values
   - Set secure JWT secret
   - Configure production database

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure XAMPP MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing process: `taskkill /f /im node.exe`

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check Node.js version compatibility

## 📞 Support

For issues and support, check the troubleshooting section or review the error logs in the console.

## 🎉 Success!

Your backend is now running on `http://localhost:5000` and connected to your XAMPP MySQL database!
