# Backend Server Troubleshooting Guide

## Quick Start

### Option 1: Using Batch Files (Recommended)
1. Open XAMPP Control Panel
2. Start **MySQL** service
3. Double-click `START_BACKEND.bat` in the project root folder
4. Wait for the message "Server is running on port 5000"

### Option 2: Manual Start
1. Open XAMPP Control Panel and start MySQL
2. Open Command Prompt (CMD)
3. Navigate to project: `cd C:\xampp\htdocs\react\Charity`
4. Navigate to Backend: `cd Backend`
5. Run: `node server.js`

## Common Issues and Solutions

### Issue 1: "Cannot connect to database"
**Solution:**
- Open XAMPP Control Panel
- Click "Start" next to MySQL
- Wait for MySQL to show green "Running" status
- Restart the backend server

### Issue 2: "Port 5000 already in use"
**Solution:**
```cmd
netstat -ano | findstr ":5000"
taskkill /F /PID [PID_NUMBER]
```
Replace [PID_NUMBER] with the number from the netstat output

### Issue 3: ".env file not found"
**Solution:**
Create a file named `.env` in the Backend folder with:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=charity_foundation
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

### Issue 4: "Database does not exist"
**Solution:**
Run database setup:
```cmd
cd Backend
node setup-database.js
```

## Checking if Backend is Running

### Method 1: Command Line
```cmd
netstat -ano | findstr ":5000"
```
If you see output, backend is running.

### Method 2: Browser
Open: http://localhost:5000/api/banner
You should see JSON response.

## Starting Everything in Order

1. **Start XAMPP MySQL**
   - Open XAMPP Control Panel
   - Click Start next to MySQL

2. **Start Backend**
   - Double-click `START_BACKEND.bat`
   - OR run: `cd Backend && node server.js`

3. **Start Frontend**
   - Double-click `START_FRONTEND.bat`
   - OR run: `cd frontend && npm start`

4. **Access Website**
   - Open browser: http://localhost:3000

## Environment Requirements

- Node.js (v14 or higher)
- MySQL (via XAMPP)
- npm packages installed in Backend folder

## Contact Admin Panel

- Development Login: http://localhost:3000/development
- Username: `admin`
- Password: `password` (default, change after first login)

## Logs and Debugging

If backend doesn't start, check:
1. MySQL is running in XAMPP
2. Port 5000 is not occupied
3. .env file exists with correct values
4. node_modules are installed (`npm install` in Backend folder)
5. Database exists (run setup-database.js)

## Quick Reset

If nothing works:
```cmd
cd Backend
npm install
node setup-database.js
node server.js
```

