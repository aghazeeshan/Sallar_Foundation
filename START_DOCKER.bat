@echo off
echo ========================================
echo   Sallar Foundation - Docker Startup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Desktop is not running!
    echo.
    echo Please start Docker Desktop and wait for it to fully load.
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down 2>nul

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo   Service Status
echo ========================================
docker-compose ps

echo.
echo ========================================
echo   Access URLs
echo ========================================
echo.
echo Frontend:     http://localhost:3075
echo Admin Panel:  http://localhost:3075/development
echo Backend API:  http://localhost:5075/api/health
echo.
echo ========================================
echo   Admin Login
echo ========================================
echo.
echo Username: admin_dev
echo Password: Admin@2025!
echo.
echo ========================================
echo   Important Notes
echo ========================================
echo.
echo 1. If login keeps logging out, rebuild frontend:
echo    docker-compose build frontend
echo    docker-compose up -d frontend
echo.
echo 2. If images don't show, you need to:
echo    - Re-upload images via admin panel, OR
echo    - Copy images to container (see DOCKER_FIX_GUIDE.md)
echo.
echo 3. Check logs if something is wrong:
echo    docker-compose logs frontend
echo    docker-compose logs backend
echo.
pause

