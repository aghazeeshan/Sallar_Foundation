@echo off
REM Local Docker Setup Script for Development (Windows)

echo 🐳 Setting up Sallar Foundation with Docker (Development)
echo ========================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first:
    echo    https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating environment file...
    copy env.example .env
    
    echo ✅ Environment file created. Please edit .env file with your settings.
    echo    You can use the default values for development.
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist "logs" mkdir logs
if not exist "ssl" mkdir ssl
if not exist "nginx\conf.d" mkdir nginx\conf.d

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down --remove-orphans 2>nul

REM Build and start containers
echo 🏗️ Building and starting containers...
docker-compose up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost
echo    Admin Panel: http://localhost/development
echo    Backend API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/api/health
echo.
echo 📊 Admin Credentials:
echo    Username: admin
echo    Password: password
echo.
echo 🔧 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop: docker-compose down
echo    Restart: docker-compose restart
echo    Status: docker-compose ps
echo.
echo 📝 Next Steps:
echo 1. Visit http://localhost to see your website
echo 2. Visit http://localhost/development to access admin panel
echo 3. Configure email settings in admin panel
echo 4. Upload your content (banners, services, etc.)
echo.

pause
