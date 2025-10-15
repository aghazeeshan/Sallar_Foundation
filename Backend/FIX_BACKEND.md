# Backend Fix Guide - Node App Crash Solutions

## Quick Fix Steps

### 1. **Start MySQL First** ⚠️ IMPORTANT!
```
Open XAMPP Control Panel
Click "Start" next to MySQL
Wait until it shows "Running"
```

### 2. **Install Missing Dependencies**
```cmd
cd Backend
npm install
```

### 3. **Create .env File**
Create a file named `.env` in the Backend folder:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=charity_foundation
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

### 4. **Setup Database**
```cmd
cd Backend
node setup-database.js
```

### 5. **Start Backend**
```cmd
cd Backend
start-server.bat
```
OR
```cmd
cd Backend
node server.js
```

---

## Common Errors and Solutions

### Error 1: "Cannot find module"
**Solution:**
```cmd
cd Backend
npm install
```

### Error 2: "connect ECONNREFUSED"
**Reason:** MySQL is not running
**Solution:**
1. Open XAMPP Control Panel
2. Start MySQL
3. Restart backend

### Error 3: "ER_BAD_DB_ERROR: Unknown database"
**Solution:**
```cmd
cd Backend
node setup-database.js
```

### Error 4: "Port 5000 is already in use"
**Solution:**
```cmd
# Find process using port 5000
netstat -ano | findstr ":5000"

# Kill the process (replace PID with number from above)
taskkill /F /PID [PID]
```

### Error 5: "JWT_SECRET is not defined"
**Solution:** Make sure `.env` file exists with JWT_SECRET

---

## Check if Backend is Running

### Method 1: Command Line
```cmd
netstat -ano | findstr ":5000"
```
If you see output, backend is running ✅

### Method 2: Browser
Open: `http://localhost:5000/api/health`

Should see:
```json
{
  "status": "OK",
  "message": "Charity Foundation API is running"
}
```

---

## Complete Reset (If Nothing Works)

```cmd
# 1. Stop all Node processes
taskkill /F /IM node.exe

# 2. Delete node_modules
cd Backend
rmdir /s /q node_modules

# 3. Reinstall
npm install

# 4. Setup database
node setup-database.js

# 5. Start server
node server.js
```

---

## Verify Everything is Working

✅ MySQL is running in XAMPP
✅ Backend shows "Server is running on port 5000"
✅ `http://localhost:5000/api/health` returns OK
✅ No errors in terminal

---

## File Structure Check

Make sure these files exist:
```
Backend/
├── .env (you need to create this)
├── server.js
├── package.json
├── config/
│   └── database.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── bannerRoutes.js
│   ├── blogRoutes.js
│   ├── contactFormRoutes.js
│   ├── contactRoutes.js
│   ├── donationRoutes.js
│   ├── eventRoutes.js
│   ├── galleryRoutes.js
│   ├── serviceRoutes.js
│   ├── settingsRoutes.js
│   └── volunteerRoutes.js
└── middleware/
    └── auth.js
```

---

## Still Not Working?

1. **Check MySQL Credentials:**
   - Open `phpMyAdmin` in XAMPP
   - Verify username is `root`
   - Verify password is empty (or matches .env)

2. **Check Port:**
   - Make sure port 5000 is not blocked by firewall
   - Try changing PORT in .env to 5001

3. **Check Node Version:**
   ```cmd
   node --version
   ```
   Should be v14 or higher

4. **Run in Debug Mode:**
   ```cmd
   cd Backend
   set DEBUG=* && node server.js
   ```

---

## Contact Details

If backend still crashes, check:
- Terminal error messages
- MySQL error logs in XAMPP
- Windows Event Viewer for system errors

