@echo off
cls
echo ================================================
echo   CHARITY FOUNDATION BACKEND SERVER
echo ================================================
echo.
echo Checking MySQL connection...
echo.

REM Set environment variables
set PORT=5000
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=charity_foundation
set JWT_SECRET=your_jwt_secret_key_change_this_in_production
set FRONTEND_URL=http://localhost:3000

echo Starting server...
echo.
node server.js

pause

