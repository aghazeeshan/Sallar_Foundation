#!/bin/bash

# VPS Deployment Script for Sallar Foundation
# Run this script to deploy/update the application on VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this script from the project root directory."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from env.prod..."
    if [ -f "env.prod" ]; then
        cp env.prod .env
        print_warning "Please edit .env file with your production values before continuing."
        print_warning "Required values: MYSQL_ROOT_PASSWORD, EMAIL, DOMAIN"
        exit 1
    else
        print_error "env.prod file not found. Please create .env file manually."
        exit 1
    fi
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Pull latest code
print_status "Pulling latest code from repository..."
git pull origin sallar

# Build and start containers
print_status "Building and starting containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 30

# Check if database needs to be imported
if ! docker exec sallar_mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) -e "USE charity_foundation; SHOW TABLES;" 2>/dev/null | grep -q "admin_users"; then
    print_status "Importing database..."
    if [ -f "charity_foundation.sql" ]; then
        docker exec -i sallar_mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) charity_foundation < charity_foundation.sql
        print_success "Database imported successfully"
    else
        print_warning "charity_foundation.sql not found. Please import database manually."
    fi
else
    print_success "Database already exists and has data"
fi

# Check container status
print_status "Checking container status..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Test application
print_status "Testing application..."
sleep 10

# Test frontend
if curl -f -s http://localhost:4000 > /dev/null; then
    print_success "Frontend is running on port 4000"
else
    print_error "Frontend is not responding on port 4000"
fi

# Test backend
if curl -f -s http://localhost:4010/api/health > /dev/null; then
    print_success "Backend is running on port 4010"
else
    print_error "Backend is not responding on port 4010"
fi

# Test database
if docker exec sallar_mysql mysql -u root -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) -e "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database is running"
else
    print_error "Database is not responding"
fi

# Show logs
print_status "Showing recent logs..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=20

print_success "Deployment completed!"
print_status "Your application should be available at:"
echo "- Frontend: https://sallarfoundation.org"
echo "- Admin: https://sallarfoundation.org/development"
echo "- API: https://sallarfoundation.org/api/health"

print_status "To view logs: docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f"
print_status "To restart: docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
