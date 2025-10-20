# Login Test & Fix Guide

## Steps to Test & Fix

### 1. Rebuild Frontend with All Fixes
```bash
cd C:\xampp\htdocs\sallar
docker-compose build frontend
docker-compose up -d frontend
```

### 2. Clear Browser Cache
- Open Chrome/Browser
- Press `Ctrl + Shift + Del`
- Select "Cached images and files" and "Cookies and other site data"
- Clear for "All time"
- Click "Clear data"

### 3. Test Login Flow
1. Open: http://localhost:3075/development
2. Open Browser Console (F12 → Console tab)
3. Login with:
   - Username: `admin_dev`
   - Password: `Admin@2025!`

### 4. Watch Console Logs
You should see:
```
✅ Login successful, storing token...
✅ Token stored successfully: { token: "eyJhbGciOiJIUzI1NI...", user: "admin_dev" }
```

Then after redirect to dashboard:
```
🔍 Checking login status: { hasToken: true, hasUser: true, isLoggedIn: true }
User authenticated successfully
```

### 5. If Still Logging Out

**Check Console for Errors:**
- If you see `❌ Login failed: No token in response` → Backend not returning token properly
- If you see `🔍 Checking login status: { hasToken: false, ... }` → Token not saving to localStorage

**Solution A: Backend Token Issue**
```bash
# Check backend logs
docker-compose logs backend | grep -i "login\|token\|jwt"

# Restart backend
docker-compose restart backend
```

**Solution B: LocalStorage Issue**
1. Open Console (F12)
2. Go to Application tab → Local Storage → http://localhost:3075
3. Manually check if `adminToken` and `adminUser` exist after login
4. If not saving, clear all storage and try again

**Solution C: CORS Issue**
Check Network tab (F12 → Network):
- Click on the `/api/admin/login` request
- Check Response - should have `success: true, data: { token: "...", user: {...} }`
- If CORS error, backend needs restart

### 6. Manual localStorage Test

After login, open Console and run:
```javascript
// Check what's stored
console.log('Token:', localStorage.getItem('adminToken'));
console.log('User:', localStorage.getItem('adminUser'));

// Manually set (for testing)
localStorage.setItem('adminToken', 'test-token-123');
localStorage.setItem('adminUser', JSON.stringify({
  id: 2,
  username: 'admin_dev',
  email: 'admin@sallarfoundation.org',
  role: 'admin'
}));

// Now try accessing dashboard
window.location.href = '/admin/dashboard';
```

### 7. Alternative: Disable Auth Check Temporarily

If you need to access dashboard to debug, temporarily comment out auth check:

File: `frontend/src/admin/AdminDashboard.js`
```javascript
// Check authentication
useEffect(() => {
  // TEMPORARILY DISABLED FOR DEBUGGING
  // const isLoggedIn = adminService.isLoggedIn();
  // if (!isLoggedIn) {
  //   console.log('User not authenticated, redirecting to login...');
  //   navigate('/development');
  // }
}, [navigate]);
```

Then rebuild:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

## Common Issues & Solutions

### Issue 1: Token Saving But Page Reloads
**Cause:** `window.location.href` causes full page reload  
**Fix:** Already implemented in code

### Issue 2: Backend Not Returning Token
**Check:**
```bash
# Test backend directly
curl -X POST http://localhost:5075/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_dev","password":"Admin@2025!"}'
```

Should return:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "username": "admin_dev",
      "email": "admin@sallarfoundation.org",
      "role": "admin"
    }
  }
}
```

### Issue 3: Frontend Can't Reach Backend
**Check:**
```bash
# Test from container
docker exec sallar_frontend curl http://backend:5000/api/health

# Should return: {"status":"OK","message":"Charity Foundation API is running",...}
```

If fails, nginx proxy is not working. Check:
```bash
docker-compose logs frontend | grep -i error
```

## Final Verification

After all fixes:
1. ✅ Login should show console logs with token
2. ✅ Should redirect to `/admin/dashboard`
3. ✅ Dashboard should load without redirect loop
4. ✅ Refresh page should keep you logged in
5. ✅ Opening `/admin/dashboard` directly should work if logged in

## Emergency Reset

If nothing works:
```bash
# Complete reset
docker-compose down -v
docker system prune -a -f

# Start fresh
docker-compose up -d --build

# Wait 1 minute
# Re-import database
docker exec -i sallar_mysql mysql -u root -pyour_strong_root_password_here charity_foundation < charity_foundation.sql

# Test again
```

## Success Checklist

- [ ] Docker containers running (frontend, backend, mysql)
- [ ] http://localhost:3075 shows website
- [ ] http://localhost:5075/api/health shows API status
- [ ] Login shows console logs
- [ ] Token saves to localStorage
- [ ] Dashboard loads without redirect
- [ ] Refresh keeps you logged in

