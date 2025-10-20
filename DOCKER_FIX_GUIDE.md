# Docker Setup Fix Guide - Sallar Foundation

## Quick Fix Commands

### 1. Start Docker Desktop
- Open Docker Desktop from Start Menu
- Wait for it to show "Docker Desktop is running"

### 2. Start All Services
```bash
cd C:\xampp\htdocs\sallar
docker-compose up -d
```

### 3. Check Status
```bash
docker-compose ps
```

You should see:
- `sallar_mysql` - Running on ports 3306, 3307
- `sallar_backend` - Running on ports 5000, 5075
- `sallar_frontend` - Running on ports 80, 443, 3075

---

## Login Credentials

**Admin Panel URL:** http://localhost:3075/development

**Username:** `admin_dev`  
**Password:** `Admin@2025!`

---

## Fix 1: Authentication/Logout Issue

The logout issue is already fixed in the code with:
1. 100ms delay in AdminDashboard auth check
2. `window.location.href` for full page reload after login
3. Relative API URLs for proper nginx proxying

**To rebuild frontend with fixes:**
```bash
docker-compose build frontend
docker-compose up -d frontend
```

---

## Fix 2: Images Not Showing

### Problem
Images stored in database with paths like `/uploads/banner_xxx.jpg` are not accessible because:
1. Backend serves from `/uploads` but files are in Docker volume
2. Nginx needs to proxy `/uploads/` to backend
3. Volume needs to be persisted

### Solution Already Implemented

The `docker-compose.yml` already has:
```yaml
backend:
  volumes:
    - backend_uploads:/app/uploads

volumes:
  backend_uploads:
    driver: local
```

### Verify Upload Directory
```bash
# Check if uploads directory exists in backend
docker exec sallar_backend ls -la /app/uploads

# You should see folders: banners, services, gallery, logos
```

### If Images Still Don't Show

**Option 1: Copy Existing Images to Docker Volume**
```bash
# If you have images in local Backend/uploads folder
docker cp Backend/uploads/. sallar_backend:/app/uploads/
```

**Option 2: Re-upload Images via Admin Panel**
1. Login to admin panel: http://localhost:3075/development
2. Go to Banners section
3. Edit each banner and re-upload the image
4. Same for Services and Gallery

---

## Images Path Configuration

### For Local Development (Docker)
- Frontend accesses images via: `/uploads/banner_xxx.jpg`
- Nginx proxies `/uploads/` to `http://backend:5000/uploads/`
- Backend serves from `/app/uploads/` (Docker volume)

### For VPS Production
Same configuration works because:
- Nginx proxy is configured in both `nginx.conf` (local) and `nginx.prod.conf` (VPS)
- Backend volume persists on VPS
- HTTPS URLs will work automatically

---

## Complete Reset (If Needed)

If everything is broken:

```bash
# Stop and remove everything
docker-compose down -v

# Remove old images
docker system prune -a -f

# Rebuild from scratch
docker-compose up -d --build

# Re-import database
docker exec -i sallar_mysql mysql -u root -pyour_strong_root_password_here charity_foundation < charity_foundation.sql

# Check status
docker-compose ps
docker-compose logs frontend
docker-compose logs backend
```

---

## Test URLs

After starting containers:

- **Frontend:** http://localhost:3075
- **Admin Panel:** http://localhost:3075/development  
- **Backend API:** http://localhost:5075/api/health
- **Backend Health:** http://localhost:5075/api/health

---

## Common Issues

### Issue: "Cannot connect to Docker daemon"
**Solution:** Start Docker Desktop

### Issue: "Port already in use"
**Solution:** 
```bash
# Find process using port
netstat -ano | findstr ":3075"
netstat -ano | findstr ":5075"

# Kill process (replace PID)
taskkill /F /PID <PID>
```

### Issue: "Frontend keeps restarting"
**Solution:** Check logs
```bash
docker-compose logs frontend
```

### Issue: "Database connection failed"
**Solution:** 
```bash
# Restart MySQL
docker-compose restart mysql

# Check MySQL is healthy
docker-compose ps
```

---

## VPS Deployment

To deploy on VPS with same code:

1. Copy `.env.example` to `.env` on VPS
2. Update `.env` with production values:
   ```
   DOMAIN=sallarfoundation.org
   MYSQL_ROOT_PASSWORD=<strong-password>
   MYSQL_PASSWORD=<strong-password>
   JWT_SECRET=<strong-secret>
   SSL_EMAIL=admin@sallarfoundation.org
   ```

3. Run:
   ```bash
   NODE_ENV=production docker-compose -f docker-compose.prod.yml up -d --build
   ```

4. Images will work automatically via:
   - `https://sallarfoundation.org/uploads/banner_xxx.jpg`
   - Nginx proxies to backend
   - SSL handles HTTPS

---

## Summary

✅ **Authentication Fixed:** Login will persist after page reload  
✅ **Images Fixed:** Uploads stored in Docker volume, accessible via nginx proxy  
✅ **VPS Ready:** Same configuration works for localhost and production  
✅ **Database:** All data imported and persisted  
✅ **Ports:** 3075 (frontend), 5075 (backend), 3307 (MySQL)

---

## Quick Start

```bash
# 1. Ensure Docker Desktop is running
# 2. Start services
docker-compose up -d

# 3. Wait 30 seconds for MySQL to initialize
# 4. Access admin panel
# Open: http://localhost:3075/development
# Login: admin_dev / Admin@2025!
```

If images don't show, upload them again via admin panel or copy from local folder to container.

