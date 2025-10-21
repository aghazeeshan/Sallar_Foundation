#!/bin/bash

# Quick VPS Deploy Script
# Run this after complete-vps-setup.sh

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "🚀 Quick VPS Deploy for Sallar Foundation..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run this script from the project root directory."
    exit 1
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Pull latest code
print_status "Pulling latest code from repository..."
git pull origin sallar

# Start containers
print_status "Starting containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Wait for containers to be ready
print_status "Waiting for containers to be ready..."
sleep 30

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
if docker exec sallar_mysql mysql -u root -p'SallarFoundation2024!' -e "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database is running"
else
    print_error "Database is not responding"
fi

print_success "Quick deploy completed!"
print_status "Your application should be available at:"
echo "- Website: https://sallarfoundation.org"
echo "- Admin: https://sallarfoundation.org/development"
echo "- API: https://sallarfoundation.org/api/health"
