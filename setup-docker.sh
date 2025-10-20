#!/bin/bash

# Local Docker Setup Script for Development
set -e

echo "🐳 Setting up Sallar Foundation with Docker (Development)"
echo "========================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   Windows/Mac: https://www.docker.com/products/docker-desktop"
    echo "   Linux: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp env.example .env
    
    # Generate random passwords
    MYSQL_ROOT_PASS=$(openssl rand -base64 32)
    MYSQL_USER_PASS=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Update .env file with generated values
    sed -i "s/your_strong_root_password_here/$MYSQL_ROOT_PASS/g" .env
    sed -i "s/your_strong_mysql_password_here/$MYSQL_USER_PASS/g" .env
    sed -i "s/your_very_strong_jwt_secret_key_minimum_32_characters_long/$JWT_SECRET/g" .env
    sed -i "s/your-domain.com/localhost/g" .env
    sed -i "s/your-email@gmail.com/admin@localhost/g" .env
    
    echo "✅ Environment file created with random passwords"
fi

# Make deployment scripts executable
echo "🔧 Making scripts executable..."
chmod +x deploy/*.sh

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs ssl nginx/conf.d

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans || true

# Build and start containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    
    # Show running containers
    docker-compose ps
    
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3075"
    echo "   Admin Panel: http://localhost:3075/development"
    echo "   Backend API: http://localhost:5075/api"
    echo "   Health Check: http://localhost:5075/api/health"
    echo ""
    echo "📊 Admin Credentials:"
    echo "   Username: admin"
    echo "   Password: password"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop: docker-compose down"
    echo "   Restart: docker-compose restart"
    echo "   Status: docker-compose ps"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Visit http://localhost to see your website"
    echo "2. Visit http://localhost/development to access admin panel"
    echo "3. Configure email settings in admin panel"
    echo "4. Upload your content (banners, services, etc.)"
    echo ""
else
    echo "❌ Some services failed to start. Checking logs..."
    docker-compose logs --tail=50
    exit 1
fi
