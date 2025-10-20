# Final Solution - Login/Logout Issue

## Problem
User logs in successfully but immediately gets logged out when redirected to dashboard.

## Root Causes Identified
1. **Token Expiry**: JWT token was expiring in 1 hour (too short)
2. **localStorage Timing**: localStorage write and page redirect were racing
3. **Auth Check Timing**: AdminDashboard was checking auth before localStorage was ready

## Complete Solution

### 1. Backend - Increase Token Expiry
**File**: `Backend/routes/adminRoutes.js` (Line 61)
```javascript
// Changed from '1h' to '7d'
{ expiresIn: '7d' }
```

### 2. Frontend - Add Delays for localStorage
**File**: `frontend/src/components/LoginModal.js` (Line 28-35)
```javascript
const handleSuccessClose = () => {
  setShowSuccess(false);
  onClose();
  // 500ms delay to ensure localStorage is written
  setTimeout(() => {
    window.location.href = '/admin/dashboard';
  }, 500);
};
```

**File**: `frontend/src/admin/AdminDashboard.js` (Line 33-48)
```javascript
useEffect(() => {
  // 200ms delay to ensure localStorage has been written after login redirect
  const checkAuthTimer = setTimeout(() => {
    const isLoggedIn = adminService.isLoggedIn();
    
    if (!isLoggedIn) {
      console.log('User not authenticated, redirecting to login...');
      navigate('/development');
    } else {
      console.log('User authenticated successfully');
    }
  }, 200);

  return () => clearTimeout(checkAuthTimer);
}, [navigate]);
```

### 3. Fixed API URLs
**All service files** changed from:
```javascript
const API_BASE_URL = 'http://localhost:5000/api/...';
```

To:
```javascript
const API_BASE_URL = '/api/...';
```

This allows nginx to properly proxy requests.

## Rebuild Commands

```bash
# Rebuild backend
docker-compose build backend
docker-compose up -d backend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Check status
docker-compose ps
```

## Testing Steps

1. **Clear Browser Data**
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Close and Reopen Browser**
   - Completely close browser
   - Reopen and go to: http://localhost:3075/development

3. **Login**
   - Username: `admin_dev`
   - Password: `Admin@2025!`
   
4. **Watch Console Logs**
   You should see:
   ```
   ✅ Login successful, storing token...
   ✅ Token stored successfully: { token: "...", user: "admin_dev" }
   ```
   
   Then after redirect (wait 500ms):
   ```
   🔍 Checking login status: { hasToken: true, hasUser: true, isLoggedIn: true }
   User authenticated successfully
   ```

5. **Verify Dashboard Loads**
   - Dashboard should load without redirecting
   - Data should load (banners, services, etc.)
   - Refresh page - should stay logged in

6. **Check Token Expiry**
   Open console and run:
   ```javascript
   const token = localStorage.getItem('adminToken');
   const parts = token.split('.');
   const payload = JSON.parse(atob(parts[1]));
   const expiry = new Date(payload.exp * 1000);
   console.log('Token expires:', expiry);
   // Should show 7 days from now
   ```

## Alternative: Quick Test Without Rebuild

If build takes too long, test manually:

1. **Login to get token**
   - Go to http://localhost:3075/development
   - Open Console (F12)
   - Login normally
   
2. **Manually keep yourself logged in**
   ```javascript
   // Before redirect happens, save token
   const token = localStorage.getItem('adminToken');
   const user = localStorage.getItem('adminUser');
   
   console.log('Token:', token);
   console.log('User:', user);
   
   // If redirect happened and token was cleared, restore it:
   localStorage.setItem('adminToken', 'YOUR_TOKEN_HERE');
   localStorage.setItem('adminUser', 'YOUR_USER_JSON_HERE');
   
   // Then navigate to dashboard
   window.location.href = '/admin/dashboard';
   ```

## Troubleshooting

### Still Logging Out?

**Check 1: Backend Running**
```bash
docker-compose ps
# Backend should be "healthy"

curl http://localhost:5075/api/health
# Should return: {"status":"OK",...}
```

**Check 2: Token Received**
```bash
curl -X POST http://localhost:5075/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_dev","password":"Admin@2025!"}'

# Should return token with 7d expiry
```

**Check 3: localStorage Persists**
- Login
- Open Console → Application tab → Local Storage
- Check if `adminToken` and `adminUser` exist
- Refresh page - they should still be there

**Check 4: Browser Issues**
Some browsers (Incognito mode, strict privacy settings) might block localStorage:
- Try normal browsing mode
- Try different browser (Chrome, Firefox, Edge)
- Disable strict privacy extensions

### Quick Fix: Disable Auth Check Temporarily

**File**: `frontend/src/admin/AdminDashboard.js`

Comment out the auth check:
```javascript
useEffect(() => {
  // TEMPORARILY DISABLED - ONLY FOR DEBUGGING
  /*
  const checkAuthTimer = setTimeout(() => {
    const isLoggedIn = adminService.isLoggedIn();
    if (!isLoggedIn) {
      navigate('/development');
    }
  }, 200);
  return () => clearTimeout(checkAuthTimer);
  */
}, [navigate]);
```

This lets you access dashboard without auth to test other features.

## Final Checklist

After rebuild:
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend shows "Up X minutes (healthy)"
- [ ] Login shows console logs
- [ ] Token saves to localStorage
- [ ] Dashboard loads without redirect
- [ ] Refresh keeps you logged in
- [ ] Token expires in 7 days (check console)

## VPS Deployment

Same code works on VPS with https://sallarfoundation.org

Just set in `.env`:
```
NODE_ENV=production
DOMAIN=sallarfoundation.org
JWT_SECRET=<strong-secret-here>
```

Then:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

## Summary

**What was fixed:**
1. ✅ Token expiry: 1h → 7d
2. ✅ localStorage timing: Added 500ms delay after login
3. ✅ Auth check timing: Added 200ms delay before checking
4. ✅ API URLs: Changed to relative paths for nginx proxy
5. ✅ Console logging: Added debug logs to track flow

**Expected behavior:**
- Login → Wait 500ms → Redirect to dashboard → Wait 200ms → Check auth → Stay logged in
- Token valid for 7 days
- Refresh page keeps you logged in

If still having issues after rebuild, check browser console for errors and verify localStorage is actually saving the token.

